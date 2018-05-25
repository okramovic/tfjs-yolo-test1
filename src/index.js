// Deep learning in your browser: A brisk guide

import * as tf from '@tensorflow/tfjs';
import yolo, { downloadModel } from 'tfjs-yolo-tiny';

//import { Webcam } from './webcam';
import { DESTRUCTION } from 'dns';
import { image, doc } from '@tensorflow/tfjs';

let model;
//const webcam = new Webcam(document.getElementById('webcam'));
let myImage, imgFile, input;





;
(async function main() {
  try {
    ga();
    model = await downloadModel();

    myImage.style.display = 'block';
    console.log('upload imge now')
    
    // await webcam.setup();

    doneLoading();
    //run();
  } catch(e) {
    console.error(e);
    showError();
  }
})();

async function run() {
  //while (true) {
    clearRects();
    if (!input) return console.error('no input')
    //const inputImage = webcam.capture();

    console.log('running')
    const inputImage = input

    const t0 = performance.now();

    const boxes = await yolo(inputImage, model);

    const t1 = performance.now();
    console.log("YOLO inference took " + (t1 - t0) + " milliseconds.");

    boxes.forEach(box => {
      const {
        top, left, bottom, right, classProb, className,
      } = box;

      drawRect(left, top, right-left, bottom-top,
        `${className} Confidence: ${Math.round(classProb * 100)}%`)
    });

    //await tf.nextFrame();
  //}
}

const webcamElem = document.getElementById('webcam-wrapper');

function drawRect(x, y, w, h, text = '', color = 'red') {
  const rect = document.createElement('div');
  rect.classList.add('rect');
  rect.style.cssText = `top: ${y}; left: ${x}; width: ${w}; height: ${h}; border-color: ${color}`;

  const label = document.createElement('div');
  label.classList.add('label');
  label.innerText = text;
  rect.appendChild(label);

  webcamElem.appendChild(rect);
}

function clearRects() {
  const rects = document.getElementsByClassName('rect');
  while(rects[0]) {
    rects[0].parentNode.removeChild(rects[0]);
  }
}

function doneLoading() {
  const elem = document.getElementById('loading-message');
  elem.style.display = 'none';

  const successElem = document.getElementById('success-message');
  successElem.style.display = 'block';

  const webcamElem = document.getElementById('webcam-wrapper');
  webcamElem.style.display = 'flex';
}

function showError() {
  const elem = document.getElementById('error-message');
  elem.style.display = 'block';
  doneLoading();
}

function ga() {
  if (process.env.UA) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', process.env.UA);
  }
}


document.addEventListener('DOMContentLoaded', ()=>{
  console.log('dom loaded')
  myImage = document.querySelector('#imgFile')

  myImage.addEventListener('change', ev =>{

    console.log('files', ev.target.files[0])
    const r = new FileReader()

    imgFile = ev.target.files[0]
    
    r.onerror = function(er){ console.error(er) }
    r.onloadend = function(ev){
        console.log('image loaded - ')//, ev.target.result)
        imgFile = ev.target.result

        const newImg = document.querySelector('#testImg') //new Image()
        //newImg.src = "_test5.jpg"//ev.target.result
        document.body.appendChild(newImg);
        console.log(newImg, newImg.width, newImg.height)
        
        newImg.adjustSize = adjustSize.bind(newImg)
        newImg.adjustSize(newImg.width, newImg.height)
        console.log(newImg.width, newImg.height)
        //input = x

        input = tf.tidy(() => {
            let x = tf.fromPixels(newImg)
            console.log(x)
            const croppedImage = cropImage(x);
            console.log(croppedImage)
            const batchedImage = croppedImage.expandDims(0);
            console.log(batchedImage);
            const final = batchedImage.toFloat().div(tf.scalar(255));
            console.log(final)
            return final
        })
        console.log('input', input)
         
        run()
    }

    r.readAsDataURL(ev.target.files[0])
})
})

function adjustSize(width, height) {
  const aspectRatio = width / height;
  if (width >= height) {
    //this.webcamElement.width = aspectRatio * this.webcamElement.height;
    this.width = aspectRatio * this.height;
  } else if (width < height) {
    //this.webcamElement.height = this.webcamElement.width / aspectRatio;
    this.height = this.width / aspectRatio;
  }
}

function cropImage(img){
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerHeight = img.shape[0] / 2;
  const beginHeight = centerHeight - (size / 2);
  const centerWidth = img.shape[1] / 2;
  const beginWidth = centerWidth - (size / 2);
  return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
}


/*function redrawToCanvas(file){
    const canvas = document.querySelector('#myCanvas'),
    ctx = canvas.getContext('2d')

    const w = file.width, h = file.height


    //ctx.drawImage(file, )

    console.log(file, w,h)
}*/