import { getUserAgent, getVersion } from 'react-native-device-info';
const { ReceiverFeedbackIdentify, ReceiverFeedbackToken, ReceiverFeedbackSource } = require('../../package.json');

function send(level, text, userAgent) {
  fetch('https://rf.alexanderiscoding.com/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': userAgent,
      'identify': ReceiverFeedbackIdentify,
      'token': ReceiverFeedbackToken
    },
    body: JSON.stringify({
      level: level,
      text: text,
      source: ReceiverFeedbackSource,
      version: getVersion()
    })
  }).catch((error) => {
    console.log(error);
  });
}

function registerFeedback(level, text) {
  if (typeof ReceiverFeedbackIdentify && typeof ReceiverFeedbackToken && typeof ReceiverFeedbackSource == "string") {
    getUserAgent().then((userAgent) => {
      send(level, text, userAgent);
    });
  } else {
    console.log("ReceiverFeedbackIdentify and/or ReceiverFeedbackToken and/or ReceiverFeedbackSource not defined in package.json");
  }
}

export { registerFeedback };