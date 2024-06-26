const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = 'AjteMwUKdwmoTjQ5RNDVF_H';
const VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN';

// Endpoint cho webhook
app.post('/webhook', (req, res) => {
  let body = req.body;

  // Xác nhận rằng sự kiện đến từ một trang Facebook
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      // Lặp qua các sự kiện tin nhắn
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Lấy ID của người gửi
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Kiểm tra sự kiện là tin nhắn hay sự kiện tin nhắn
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Phản hồi lại sự kiện
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Endpoint để xác thực webhook
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Xác thực token và phản hồi lại với challenge token từ yêu cầu
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Xử lý tin nhắn
function handleMessage(sender_psid, received_message) {
  let response;

  // Kiểm tra nếu tin nhắn có chứa văn bản
  if (received_message.text) {
    response = {
      'text': `Bạn đã gửi: "${received_message.text}".`
    };
  }

  // Gửi tin nhắn phản hồi
  callSendAPI(sender_psid, response);
}

// Gọi API của Facebook để gửi tin nhắn
function callSendAPI(sender_psid, response) {
  let request_body = {
    'recipient': {
      'id': sender_psid
    },
    'message': response
  };

  request({
    'uri': 'https://graph.facebook.com/v13.0/me/messages',
    'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    'method': 'POST',
    'json': request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent!');
    } else {
      console.error('Unable to send message:' + err);
    }
  });
}

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
