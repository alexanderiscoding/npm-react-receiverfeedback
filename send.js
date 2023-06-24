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
  }).then(
    (response) => console.log(response.status == 200 ? 'ReceiverFeedback: send ' + level : 'ReceiverFeedback: not send ' + level + ' - status code: ' + response.status)
  ).catch(
    (error) => console.log('ReceiverFeedback: Ocorred error in ' + level + ': ' + error)
  );
}

function registerFeedback(level, text) {
  if (Number(ReceiverFeedbackIdentify) && String(ReceiverFeedbackToken) && String(ReceiverFeedbackSource)) {
    if (level != 0) {
      getUserAgent().then((userAgent) => {
        send(level, text, userAgent);
      });
    }
  } else {
    console.log("ReceiverFeedbackIdentify and/or ReceiverFeedbackToken and/or ReceiverFeedbackSource not defined in package.json");
  }
}

export { registerFeedback };