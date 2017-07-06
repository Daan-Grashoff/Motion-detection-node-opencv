const cv = require('opencv');
const usbDetect = require('usb-detection');
const _ = require('lodash');
const io = require('socket.io-client');

// camera properties
const width = 320;
const height = 240;
const fps = 5;
const interval = 1000 / fps;

// initialize camera
// const camera = new cv.VideoCapture(0);


const lowThresh = 0;
const highThresh = 100;
const nIters = 2;
const minArea = 2000;
const BGR2GRAY = 'CV_BGR2GRAY';
const GREEN = [0, 255, 0]; // B, G, R
const WEBCAM_PRODUCT_ID = 57863;
let x = 0;
const buffers = [];

let original;

let cameraCount = 0;
const cameras = [];

usbDetect.find((err, devices) => {
  devices.forEach((element) => {
    if (element.productId === WEBCAM_PRODUCT_ID) {
      const camera = new cv.VideoCapture(cameraCount);
      camera.setWidth(width);
      camera.setHeight(height);
      cameras.push({
        camera,
        firstImage: null,
        id: Math.floor(Math.random() * 1000) + 1
      });
      cameraCount++;
    }
  }, this);
  // const c = new cv.VideoCapture(cameraCount);
  // c.setWidth(width);
  // c.setHeight(height);
  // cameras.push({ camera: c, firstImage: null, id: Math.floor(Math.random() * 1000) + 1 });

  const socket = io.connect('http://localhost:8080');

  socket.on('connect', () => {
    socket.emit('cameras', { cameras });
    setInterval(() => {
      cameras.forEach((response, index) => {
          let { firstImage } = response;
          const { camera, id } = response;
          camera.read((err, im) => {
            if (err) {
              throw err;
            }
            original = im.clone();
            if (_.isArrayLike(im.size(), [height, width])) {
              im.cvtColor(BGR2GRAY);
              im.gaussianBlur([15, 15]);
              x++;

              if (x % 20 === 0) {
                firstImage = im.clone();
                cameras[index].firstImage = firstImage;
              }

              const diff = new cv.Matrix();
              if (firstImage) {
                diff.absDiff(firstImage, im);

                diff.canny(lowThresh, highThresh);
                diff.dilate(nIters);

                const contours = diff.findContours();
                for (let i = 0; i < contours.size(); i++) {
                  if (contours.area(i) > minArea) {
                    const rec = contours.boundingRect(i);
                    original.rectangle([rec.x, rec.y], [rec.width, rec.height], GREEN, 2);
                    console.log('MOTION');
                  }
                }
              }
            }
            buffers.push({ buffer: original.toBuffer(), id });
          });
      });
      socket.emit('cameraBuff', { buffers });
      buffers.length = 0;
    }, interval);
  });
});
