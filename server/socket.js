const cv = require('opencv');
const usbDetect = require('usb-detection');
const _ = require('lodash');

// camera properties
const width = 320;
const height = 240;
const fps = 10;
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


let original;

let cameraCount = 0;
const cameras = [];

usbDetect.find((err, devices) => { 
  devices.forEach((element) => {
    if (element.productId === WEBCAM_PRODUCT_ID) {
      const camera = new cv.VideoCapture(cameraCount);
      camera.setWidth(width);
      camera.setHeight(height);
      cameras.push({ camera, firstImage: null });
      cameraCount++;
    }
  }, this);
  const camera = new cv.VideoCapture(cameraCount);
  camera.setWidth(width);
  camera.setHeight(height);
  cameras.push({ camera, firstImage: null });
});

module.exports = (socket) => {
  socket.emit('cameras', { count: cameraCount });
  setInterval(() => {
    cameras.forEach((response, index) => {
      let { camera, firstImage } = response;
      camera.read((err, im) => {
        if (err) {
          console.log('dashjdajskhdjk');
          throw err;
        }
        if (_.isArrayLike(im.size(), [height, width])) {
          original = im.clone();
          im.cvtColor(BGR2GRAY);
          im.gaussianBlur([15, 15]);
          x++;

          if (!firstImage) {
            firstImage = im.clone();
            cameras[index].firstImage = firstImage;
          }

          if (x % 20 === 0) {
            firstImage = im.clone();
            cameras[index].firstImage = firstImage;
          }

          
          const diff = new cv.Matrix();
          diff.absDiff(firstImage, im);
          
          diff.canny(lowThresh, highThresh);
          diff.dilate(nIters);
          
          const contours = diff.findContours();
          for (let i = 0; i < contours.size(); i++) {
            if (contours.area(i) > minArea) {
              const rec = contours.boundingRect(i);
              original.rectangle([rec.x, rec.y], [rec.width, rec.height], GREEN, 2);
              socket.emit('motion', { buffer: original.toBuffer() });
              console.log(`MOTION ON CAMERA ${index}`);
            }
          }
          socket.emit(`camera${index}`, { buffer: original.toBuffer() });
        }
      });
    });
  }, interval);
};
