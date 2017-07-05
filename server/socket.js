const cv = require('opencv');

// camera properties
const width = 320;
const height = 240;
const fps = 10;
const interval = 1000 / fps;

// initialize camera
const camera = new cv.VideoCapture(0);
camera.setWidth(width);
camera.setHeight(height);

const lowThresh = 0;
const highThresh = 100;
const nIters = 2;
const minArea = 2000;
const BGR2GRAY = 'CV_BGR2GRAY';
const GREEN = [0, 255, 0]; // B, G, R
let x = 0;
let firstImage;

let original;

module.exports = (socket) => {
  setInterval(() => {
    camera.read((err, im) => {
      if (err) {
        throw err;
      }


      if (im.size()[0] === 240) {
        original = im.clone();
        im.cvtColor(BGR2GRAY);
        im.gaussianBlur([15, 15]);
        x++;

        if (!firstImage) {
          firstImage = im.clone();
        }
        if (x % 20 === 0) {
          console.log('new image');
          firstImage = im.clone();
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
            console.log('MOTION!');
          }
        }
        socket.emit('camera', { buffer: original.toBuffer() });
      }
    });
  }, interval);
};
