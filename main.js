const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("captureCanvas");
const ctx2 = canvas2.getContext("2d");

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

let camera_button = document.getElementById("cameraBtn");
let video = document.querySelector("#video");
camera_button.addEventListener('click', async function() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
});

const mThreshold = 100;
const camWidth = 640;
const camHeight = 360;

var lastImg = ctx2.getImageData(0,0,camWidth,camHeight);


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
        diff=Math.floor(diff/3)
        for(let j = 0; j<3; j++){
            newImgData[i+j]=diff;
        }
    }

return new ImageData(newImgData,camWidth,camHeight);
}

function getCenter(imgData, threshold){


    let centerX = 0;
    let centerY = 0;
    let pixelsMet = 0;

//    console.log(imgData)
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


var centersTracked = [];
const trackLength = 15;

doFrame = window.setInterval(function(){
    ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    let thisImg = ctx2.getImageData(0,0,camWidth,camHeight);

    let diffImgData = difference(thisImg, lastImg);
//    console.log(diffImgData)
    ctx.putImageData(diffImgData,0,0);

    let motionCenter = getCenter(diffImgData,mThreshold,camWidth,camHeight);

    centersTracked.push(motionCenter)
    while(centersTracked.length>trackLength){
        centersTracked.shift();
    }
    ctx.beginPath();
    ctx.fillStyle = "#ff0000"
    ctx.rect(motionCenter[0]-5,motionCenter[1]-5,10,10);
    ctx.fill();
    ctx.closePath();

    for(let i = 0; i<centersTracked.length; i++){
        ctx.beginPath();
        ctx.fillStyle = "#ff0000"
        ctx.rect(centersTracked[i][0]-2,centersTracked[i][1]-2,4,4);
        ctx.fill();
        ctx.closePath();

    }
    let trackBack = 3;

    if(!(isNaN(motionCenter[0])||isNaN(motionCenter[1]))&&!((isNaN(centersTracked[trackLength-trackBack][0])||isNaN(centersTracked[trackLength-trackBack][1])))){
        //pew pew!
        let x = motionCenter[0];
        let y = motionCenter[1];
        let dir = Math.atan2(motionCenter[1]-centersTracked[trackLength-trackBack][1],motionCenter[0]-centersTracked[trackLength-trackBack][0]);
        let speed = 15;
        let radius = 10;
        let lifetime = 40;

        makeSnowflake(x,y,dir,speed,radius,lifetime)

    }



    ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    lastImg = ctx2.getImageData(0,0,camWidth,camHeight);
}, 100);

let snowBg = new Image();
snowBg.src="bg.jpg";

let snowflakeX = [];
let snowflakeY = [];
let snowflakeDirection = [];
let snowflakeSpeed = [];
let snowflakeRadius = [];
let snowflakeTimeLeft = [];


gameFrame = window.setInterval(function(){
    gameCtx.drawImage(snowBg,0,0,640,360)

for(let i = 0; i<snowflakeX.length; i++){
    gameCtx.fillStyle = 'rgba(255, 0, 0, 1)';

    snowflakeX[i]+= Math.cos(snowflakeDirection[i])*snowflakeSpeed[i];
    snowflakeY[i]+= Math.sin(snowflakeDirection[i])*snowflakeSpeed[i];
    console.log([snowflakeX[i],snowflakeY[i]])
   snowflakeTimeLeft[i]--;
    snowflakeSpeed[i]/=1.1;

    if(snowflakeTimeLeft[i]<10){
        gameCtx.fillStyle = 'rgba(255, 0, 0,'+(0.1*(snowflakeTimeLeft[i]))+')';
    }
if(snowflakeTimeLeft[0]<1){
    snowflakeX.shift();
    snowflakeY.shift();
    snowflakeDirection.shift();
    snowflakeSpeed.shift();
    snowflakeRadius.shift();
    snowflakeTimeLeft.shift();
}



    gameCtx.beginPath();
    gameCtx.arc(snowflakeX[i], snowflakeY[i], snowflakeRadius[i], 0, 2 * Math.PI);
    gameCtx.fill();

}



}, 32);

function makeSnowflake(x,y,dir,speed,radius,lifetime){
    snowflakeX.push(x);
    snowflakeY.push(y);
    snowflakeDirection.push(dir);
    snowflakeSpeed.push(speed);
    snowflakeRadius.push(radius);
    snowflakeTimeLeft.push(lifetime);
}

