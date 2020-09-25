/* GLOBAL */

/** Applications states. (fake enum) */
const states = {
  INITITAL_START: 'initial_start',
  STARTUP: 'startup',
  PREVIEW: 'preview',
  TIMER: 'timer',
  RESULT: 'result'
}
/** Default application state. */
let state = null;

/** Timer that handles countdown before taking picture. */
let timer = null;
/** Handles webcam preview and taking snapshots. */
let camera = null;
/** Utility functions */
const utils = {
  validateEmail: function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
};
/** Wrapper for html elements. */
const ui = {
  canvas: document.querySelector('canvas'),
  video: document.querySelector('video'),
  countdownText: document.getElementById('countdown-text'),
  startTimerBtn: document.getElementById('hero-cta'),
  backBtn: document.getElementById('back'),
  sendEmailBtn: document.getElementById('send-email'),
  emailInput: document.querySelector('input[type=email]'),
  clearEmailBtn: document.getElementById('clear-email'),
  stopTimerBtn: document.getElementById('stop-timer-btn'),
  timerProgressCircle: document.querySelector('circle'),
  views: {
    home: document.getElementById('home'),
    timer: document.getElementById('timer'),
    results: document.getElementById('results'),
  },
  setVisible: (element, visible) => {
    element.style.opacity = visible ? 1 : 0;
    element.style.pointerEvents = visible ? 'auto' : 'none';
  },
  setEnabled: (element, enabled) => {
    if (enabled) {
      element.removeAttribute('disabled');
    } else {
      element.setAttribute('disabled', true);
    }
  },
  fadeIn: (element) => {
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
    element.style.pointerEvents = 'all';
  },
  fadeOut: (element) => {
    // Check for existing fade-in class to prevent
    // fading out and triggering opacity:1 on something
    // that might already have opacity:0.
    if (element.classList.contains('fade-in')) {
      element.classList.remove('fade-in');
      element.classList.add('fade-out');
      element.style.pointerEvents = 'none';
    }
  },
  setTimerProgress: (percent) => {
    const offset = circumference - percent / 100 * circumference;
    ui.timerProgressCircle.style.strokeDashoffset = offset;
  }
};

// Progress circle setup
const radius = ui.timerProgressCircle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
ui.timerProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
ui.timerProgressCircle.style.strokeDashoffset = circumference;

// UI event listeners
ui.startTimerBtn.onclick = () => nextState();
ui.backBtn.onclick = () => nextState();
ui.clearEmailBtn.onclick = clearEmailInput;
ui.sendEmailBtn.onclick = handleSendEmailClick;
ui.emailInput.addEventListener('input', handleEmailInput);
ui.stopTimerBtn.onclick = () => nextState(states.PREVIEW);



/* UI HANDLERS */

function clearEmailInput(reset = true) {
  ui.emailInput.value = '';
  ui.setEnabled(ui.sendEmailBtn, false);

  if (reset) resetSendEmailBtn();
}

function handleEmailInput(e) {
  const email = e.target.value;
  const isValidEmail = utils.validateEmail(email);
  ui.setEnabled(ui.sendEmailBtn, isValidEmail);
  resetSendEmailBtn();
}

function handleSendEmailClick() {
  const snapshot = camera.getSnapshot();
  const recipient = ui.emailInput.value;

  ui.setEnabled(ui.sendEmailBtn, false);
  ui.sendEmailBtn.classList = "";
  ui.sendEmailBtn.innerHTML = 'Sending...';
  ui.sendEmailBtn.classList.add('sending');

  sendEmailWithSnapshot(recipient, snapshot)
    .then(() => {
      ui.sendEmailBtn.innerHTML = 'Sent!';
      ui.sendEmailBtn.classList.add('sent');
      clearEmailInput(false);
    })
    .catch(xhr => {
      console.log(xhr);
      ui.setEnabled(ui.sendEmailBtn, false);
      ui.setEnabled(ui.sendEmailBtn, true);
      ui.sendEmailBtn.innerHTML = 'Try again';
      ui.sendEmailBtn.classList.add('error');
      alert(`Error: ${xhr.status} (${xhr.statusText})`);
    });
}

function resetSendEmailBtn() {
  ui.sendEmailBtn.classList.remove('sent', 'sending', 'error');
  ui.sendEmailBtn.innerHTML = 'Send';
}

/* EMAIL & SMS */

async function sendEmailWithSnapshot(to, snapshot) {
  return new Promise((resolve, reject) => {
    const url = '/email?to=' + to;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = () => {
      // TODO: check status for errors
      if (xhr.status === 200) {
        resolve();
      } else {
        console.error(xhr.status, xhr.responseText);
        reject(xhr);
      }
    }
    xhr.send(snapshot);
  });
}

/**
 * Handles streaming a webcam preview and taking a snapshot.
 */
class Camera {
  constructor(video, canvas) {
    /** Webacm preview. */
    this.video = video;
    /** Display for the snapshot taken. */
    this.canvas = canvas;
    /** Range from 0 to 1 in 0.1 increments, where 0 is low and 1 is high. */
    this.canvasQuality = 1;
    /** Base64 string of the snapshot taken. */
    this.snapshot = null;
    /** 
     * Options to apply when getting user media devices 
     * from navigator when stream starts.
     */
    this.videoParams = {
      audio: false,
      video: {
        facingMode: 'user'
      }
    };

    this.init();
  }

  init() {
    // Video default attributes
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('muted', '');
    this.video.setAttribute('playsinline', '');

    // Make canvas size match the camera preview size to get correct picture sizing.
    this.canvas.width = this.video.offsetWidth;
    this.canvas.height = this.video.offsetHeight;
  }

  startStream() {
    if (this.streamStarted) return;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.videoParams)
        .then(stream => {
          this.video.srcObject = stream;
          this.streamStarted = true;
        })
        .catch(err => {
          console.error(err);
          alert('Stream error: ' + err)
        });
    } else {
      console.error('navigator.mediaDevices.getUserMedia is false');
      alert('No camera found.');
    }
  }

  takeSnapshot(onSnapshot) {
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    this.snapshot = this.canvas.toDataURL('image/jpeg', this.canvasQuality);
    if (onSnapshot) onSnapshot(this.snapshot);
  }

  clear() {
    this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snapshot = null;
  }

  getSnapshot() {
    return this.snapshot;
  }
}

/**
 * Counts down from a given start time.
 * Provides `onUpdate` and `onStop` callbacks.
 */
class CountdownTimer {
  /**
   * 
   * @param {number} startTime Seconds to start the timer at.
   * @param {Function} onUpdate Returns `tick` before it's updated.
   * @param {Function} onStop Called when the timer has been stopped.
   */
  constructor(startTime, onUpdate, onStop) {
    /** Interval timer. */
    this.timer = null;
    /** Number of seconds to start the countdown at. */
    this.startTime = startTime;
    /** Countdown number. */
    this.tick = this.startTime;
    /** Callback after tick is updated. Returns updated tick. */
    this.onUpdate = onUpdate;
    /** Callback after timer stops. */
    this.onStop = onStop;
  }

  /**
   * Starts the timer and does an initial `Timer.update()`.
   */
  start() {
    this.tick = this.startTime;
    this.timer = setInterval(this.update.bind(this), 1000);

    // Initial update
    this.update();
  }

  /**
   * Clears the timer and calls `Timer.onStop()`.
   */
  stop() {
    clearInterval(this.timer);
    this.onStop();
  }

  /**
   * Updates tick with countdown, calls onUpdate callback before tick is updated.
   * `Timer.stop()` is called when tick reaches 0.
   */
  update() {
    if (this.tick >= 0) {
      this.onUpdate(this.tick);
      this.tick--;
    } else {
      this.stop();
    }
  }
}


function handleCountdownTimerUpdate(tick) {
  // Update countdown text
  ui.countdownText.innerHTML = tick;
  ui.setTimerProgress((tick / timer.startTime) * 100);
}

function handleCountdownTimerStop() {
  if (state === states.TIMER) {
    nextState();
  }
}



/* MAIN */

function nextState(forceState) {
  // Change state
  if (forceState) {
    state = forceState;
  } else {
    switch (state) {
      case null: state = states.INITITAL_START; break;
      case states.INITITAL_START: state = states.PREVIEW; break;
      case states.STARTUP: state = states.PREVIEW; break;
      case states.PREVIEW: state = states.TIMER; break;
      case states.TIMER: state = states.RESULT; break;
      case states.RESULT: state = states.STARTUP; break;
      default: break;
    }
  }


  // State onChange
  switch (state) {
    case states.INITITAL_START:
      camera = new Camera(ui.video, ui.canvas);
      // camera.startStream();
      nextState();
      break;
    case states.STARTUP:
      ui.fadeOut(ui.views.results);
      ui.fadeOut(ui.views.timer);
      nextState();
      break;
    case states.PREVIEW:
      ui.fadeOut(ui.views.timer);
      ui.fadeIn(ui.views.home);
      camera.clear();
      if (timer) timer.stop();
      break;
    case states.TIMER:
      ui.fadeOut(ui.views.home);
      ui.fadeIn(ui.views.timer);
      // Note: timer stop is handled by time, use onStop callback below to trigger new state.
      timer = new CountdownTimer(5, handleCountdownTimerUpdate, handleCountdownTimerStop)
      timer.start();
      break;
    case states.RESULT:
      ui.fadeOut(ui.views.timer);
      ui.fadeIn(ui.views.results);
      camera.takeSnapshot();
      resetSendEmailBtn();
      break;
    default:
      break;
  }
}
nextState();

/* SMS FEATURE: Removed for now, don't need sms for 9/27 trial. */
// async function sendText() {
//     const to = '+19136878235'; // Todo: remove

//     const url = '/sms?to=' + to;
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', url, true);
//     xhr.onload = () => {
//         // TODO: check status for errors
//         console.log(xhr.status, xhr.responseText);
//     }
//     xhr.send(picture);
// }
