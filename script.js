const PYTHON_URL = 'http://127.0.0.1:8000'
let clickCount = 0;
let sessionStartTime = new Date();
let url = window.location.href;
let uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
let flag = false;

let urlsVisited = [];
urlsVisited.push({ "url": url, "accessed_at": sessionStartTime });

let previousUrl = document.referrer;
let browser = navigator.userAgent;

window.navigation.addEventListener("navigate", (event) => {
  if (url !== window.location.href) {
    url = window.location.href;
    urlsVisited.push({ "url": url, "accessed_at": new Date() });
  }
});

function sendData() {
  const sessionDuration = Math.round((new Date() - sessionStartTime) / 1000);
  const data = {
    clickCount,
    sessionStartTime,
    sessionEndTime: new Date(),
    sessionDuration,
    url,
    urlsVisited,
    uuid
  };

  fetch(PYTHON_URL + "/track/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': 'csrftoken',
    },
    body: JSON.stringify(data),
  });

  console.log('Data:', data);
}

const handleClick = () => {
  clickCount++;
}

function startSession() {
  sessionStartTime = new Date();
  previousUrl = document.referrer;
  browser = navigator.userAgent;

  fetch(PYTHON_URL + "/start/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': 'csrftoken',
    },
    body: JSON.stringify({ sessionStartTime, previousUrl, browser, uuid, url }),
  });
}

document.addEventListener('click', handleClick);
window.addEventListener('beforeunload', () => {
  sendData();
});

window.addEventListener('load', () => {
  if (!flag) {
    startSession();
    flag = true;
  }
});