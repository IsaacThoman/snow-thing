const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("captureCanvas");
const ctx2 = canvas2.getContext("2d");
let camera_button = document.getElementById("cameraBtn");
let video = document.querySelector("#video");
camera_button.addEventListener('click', async function() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
});

var lastImg = ctx2.getImageData(0,0,320,240);


function difference(img1, img2){ //gets image difference, returns as image.data

let img1Data = img1.data;
let img2Data = img2.data;
let newImgData = img1.data;
let imgLength = img1Data.length;

    for(let i = 0; i<imgLength; i+=4){
        let diff = 0;
        for(let j = 0; j<3; j++){
            diff+=Math.abs(img1Data[i+j]-img2Data[i+j]);
        }
        diff=Math.floor(diff/3*2.5)
        for(let j = 0; j<3; j++){
            newImgData[i+j]=diff;
        }
    }

return new ImageData(newImgData,320,240);
}

function getCenter(imgData, threshold){


    let centerX = 0;
    let centerY = 0;
    let pixelsMet = 0;

    console.log(imgData)
    for(let i = 0; i<imgData.data.length; i+=4){
        if(imgData.data[i]>threshold){
            pixelsMet++;
            centerX+=(i/4)%imgData.width;
            centerY+=(i/4)/imgData.width;
        }
    }
    centerX/=pixelsMet;
    centerY/=pixelsMet;

    return[centerX,centerY];
}



doFrame = window.setInterval(function(){
    ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    let thisImg = ctx2.getImageData(0,0,320,240);

    let diffImgData = difference(thisImg, lastImg);
//    console.log(diffImgData)
    ctx.putImageData(diffImgData,0,0);

    let motionCenter = getCenter(diffImgData,150,320,240);
    ctx.beginPath();
    ctx.fillStyle = "#ff0000"
    ctx.rect(motionCenter[0]-5,motionCenter[1]-5,10,10);
    ctx.fill();
    ctx.closePath();
    console.log(motionCenter)

    ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    lastImg = ctx2.getImageData(0,0,320,240);


}, 100);