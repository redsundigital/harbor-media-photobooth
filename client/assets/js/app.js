const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const startTimerBtn = document.getElementById('start-timer');
const stopTimerBtn = document.getElementById('stop-timer');
const sendBtn = document.getElementById('send');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');

const canvasQuality = 1; // 0..1 in 0.1 increments, 0=low 1=high
const videoParams = {
    audio: false,
    video: {
        facingMode: 'user'
    }
};

let streamStarted = false;
let startSecs = 5;
let timer;
let tick = 0;
let picture;


video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.setAttribute('playsinline', '');


canvas.width = video.offsetWidth;
canvas.height = video.offsetHeight;

startTimerBtn.onclick = startTimer;
stopTimerBtn.onclick = stopTimer;
sendBtn.onclick = send;
redoBtn.onclick = redo;
clearBtn.onclick = clear;


function setEnabled(el, enabled = true) {
    enabled
        ? el.removeAttribute('disabled')
        : el.setAttribute('disabled', true);
}

function sendEmail() {
    const url = '/email?to=' + 'jason@redsundigitalkc.com'; 
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = () => {
        console.log(xhr.status, xhr.responseText);
    }
    xhr.send(picture);
}

function send() {
    sendEmail();
}

function redo() {
    clear();
    startTimer();
}

function clear() {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    picture = null;
    init();
}

function takePicture() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    picture = canvas.toDataURL('image/jpeg', canvasQuality);

    setEnabled(sendBtn);
    setEnabled(redoBtn);

    send();
}

function updateTimer() {
    if (tick > 0) {
        startTimerBtn.innerHTML = tick;
        tick--;
    } else {
        takePicture();
        stopTimer();
    }
}

function startTimer() {
    tick = startSecs;
    updateTimer();
    timer = setInterval(updateTimer, 1000);

    setEnabled(startTimerBtn, false);
    setEnabled(stopTimerBtn);
}

function stopTimer() {
    tick = 0;
    clearInterval(timer);

    startTimerBtn.innerHTML = 'Start Timer';
    setEnabled(startTimerBtn);
    setEnabled(stopTimerBtn, false);
}

function startStream() {
    if (streamStarted) return;

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(videoParams)
            .then(stream => {
                video.srcObject = stream;
                streamStarted = true;
            })
            .catch(err => {
                console.error(err);
                alert('Error: ' + err);
            });
    } else {
        console.error('navigator.mediaDevices.getUserMedia is false');
        alert('No camera found.');
    }
}

function init() {
    setEnabled(stopTimerBtn, false);
    setEnabled(sendBtn, false);
    setEnabled(redoBtn, false);

    startStream();
}

init();
