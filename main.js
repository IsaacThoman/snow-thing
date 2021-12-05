const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("captureCanvas");
const ctx2 = canvas2.getContext("2d");



let camera_button = document.getElementById("cameraBtn");
let video = document.querySelector("#video");

function difference(img1, img2){ //gets image difference, returns as image.data

let img1Data = img1.data;
let img2Data = img2.data;
var newImgData = img1.data;
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

function getCenter(img){
    let imgData = img.data;
    let imgLength = imgData.length;

    var centerX = 0;
    var centerY = 0;
    var allIntensitySampled = 0;



    

}


camera_button.addEventListener('click', async function() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
});

var lastImg = ctx2.getImageData(0,0,320,240);
doFrame = window.setInterval(function(){
    ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    var thisImg = ctx2.getImageData(0,0,320,240);

var diffImgData = difference(thisImg, lastImg);
console.log(diffImgData)
    ctx.putImageData(diffImgData,0,0);

    ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    lastImg = ctx2.getImageData(0,0,320,240);


}, 100);