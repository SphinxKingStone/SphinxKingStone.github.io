document.getElementById('add-stopwatch').addEventListener('click', addStopwatch);

window.addEventListener('load', loadStopwatches);

let intervals = {};

function addStopwatch(name = 'Stopwatch', time = '00:00:00', color = '#ffffff') {
    const stopwatchesContainer = document.getElementById('stopwatches');
    
    const stopwatchDiv = document.createElement('div');
    stopwatchDiv.className = 'stopwatch';
    stopwatchDiv.style.backgroundColor = color;
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = name;
    nameInput.addEventListener('input', saveStopwatches);
    
    const timeDisplay = document.createElement('span');
    timeDisplay.textContent = time;
    timeDisplay.style.margin = '0 10px';
    
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.addEventListener('click', () => startStopwatch(timeDisplay, startButton));
    
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.addEventListener('click', () => stopStopwatch(timeDisplay));
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => resetStopwatch(timeDisplay, startButton));
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = color;
    colorInput.addEventListener('input', () => {
        changeColor(stopwatchDiv, colorInput.value);
        saveStopwatches();
    });
    
    const upButton = document.createElement('button');
    upButton.textContent = 'Up';
    upButton.addEventListener('click', () => {
        moveUp(stopwatchDiv);
        saveStopwatches();
    });
    
    const downButton = document.createElement('button');
    downButton.textContent = 'Down';
    downButton.addEventListener('click', () => {
        moveDown(stopwatchDiv);
        saveStopwatches();
    });
    
    stopwatchDiv.appendChild(nameInput);
    stopwatchDiv.appendChild(timeDisplay);
    stopwatchDiv.appendChild(startButton);
    stopwatchDiv.appendChild(stopButton);
    stopwatchDiv.appendChild(resetButton);
    stopwatchDiv.appendChild(colorInput);
    stopwatchDiv.appendChild(upButton);
    stopwatchDiv.appendChild(downButton);
    
    stopwatchesContainer.appendChild(stopwatchDiv);
    
    saveStopwatches();
}

function startStopwatch(display, button) {
    const startTime = Date.now() - getTimeInMilliseconds(display.textContent);
    if (intervals[display]) clearInterval(intervals[display]);
    
    intervals[display] = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        display.textContent = formatTime(elapsedTime);
    }, 10);
    
    button.disabled = true;
}

function stopStopwatch(display) {
    clearInterval(intervals[display]);
    delete intervals[display];
    document.querySelectorAll('.stopwatch button')[2].disabled = false;
    saveStopwatches();
}

function resetStopwatch(display, button) {
    clearInterval(intervals[display]);
    delete intervals[display];
    display.textContent = '00:00:00';
    button.disabled = false;
    saveStopwatches();
}

function changeColor(element, color) {
    element.style.backgroundColor = color;
}

function moveUp(element) {
    const previous = element.previousElementSibling;
    if (previous) element.parentNode.insertBefore(element, previous);
}

function moveDown(element) {
    const next = element.nextElementSibling;
    if (next) element.parentNode.insertBefore(next, element);
}

function saveStopwatches() {
    const stopwatches = Array.from(document.getElementsByClassName('stopwatch')).map(stopwatch => ({
        name: stopwatch.querySelector('input[type="text"]').value,
        time: stopwatch.querySelector('span').textContent,
        color: stopwatch.querySelector('input[type="color"]').value
    }));
    localStorage.setItem('stopwatches', JSON.stringify(stopwatches));
}

function loadStopwatches() {
    const stopwatches = JSON.parse(localStorage.getItem('stopwatches')) || [];
    stopwatches.forEach(sw => addStopwatch(sw.name, sw.time, sw.color));
}

function getTimeInMilliseconds(time) {
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return ((minutes * 60) + seconds) * 1000 + milliseconds;
}

function formatTime(milliseconds) {
    const time = new Date(milliseconds);
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');
    const ms = String(time.getUTCMilliseconds()).padStart(3, '0').substring(0, 2);
    return `${minutes}:${seconds}:${ms}`;
}
