const timeDisplay = document.getElementById('time-display');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const progressBar = document.querySelector('.progress');

let workDuration = parseInt(workDurationInput.value) * 60; 
let breakDuration = parseInt(breakDurationInput.value) * 60; 
let timeLeft = workDuration;
let isWorking = true;
let isRunning = false;
let interval;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
  const totalTime = isWorking ? workDuration : breakDuration;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  progressBar.style.width = `${progress}%`;
}

function switchMode() {
  isWorking = !isWorking;
  timeLeft = isWorking ? workDuration : breakDuration;
  updateDisplay();
  updateProgressBar();
  if (isRunning) {
    clearInterval(interval);
    startTimer();
  }
}

function startPauseTimer() {
  if (isRunning) {
    clearInterval(interval);
    startPauseBtn.textContent = 'Start';
  } else {
    startTimer();
    startPauseBtn.textContent = 'Pause';
  }
  isRunning = !isRunning;
}

function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    updateProgressBar();
    if (timeLeft <= 0) {
      clearInterval(interval);
      notifyUser();
      switchMode();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  workDuration = parseInt(workDurationInput.value) * 60;
  breakDuration = parseInt(breakDurationInput.value) * 60;
  timeLeft = workDuration;
  isWorking = true;
  updateDisplay();
  progressBar.style.width = '0%';
}

function notifyUser() {
  const message = isWorking ? 'Time for a break!' : 'Time to work!';
  alert(message);
}

startPauseBtn.addEventListener('click', startPauseTimer);
resetBtn.addEventListener('click', resetTimer);
workDurationInput.addEventListener('change', () => {
  workDuration = parseInt(workDurationInput.value) * 60;
  if (!isRunning && isWorking) {
    timeLeft = workDuration;
    updateDisplay();
  }
});
breakDurationInput.addEventListener('change', () => {
  breakDuration = parseInt(breakDurationInput.value) * 60;
  if (!isRunning && !isWorking) {
    timeLeft = breakDuration;
    updateDisplay();
  }
});

updateDisplay();