
const GeminiController = require('../public/genminiController');
const WebSocket = require('ws');

const controller = new GeminiController();

 const wsServer= new WebSocket.Server({noServer:true});

 wsServer.on ('connection', (socket) => {
    console.log('Client connected');
    socket.on('message',async  (message) => {
      const { prompt } = JSON.parse(message);
      if (prompt) {
        try {
          // await controller.generateStory(prompt, (chunk) => {
          //   socket.send(chunk);
          // });

          let fullStory = '';
        
          await controller.generateStory(prompt, (chunk) => {
            fullStory += chunk;
            socket.send(JSON.stringify({ type: 'chunk', data: chunk }));
          });
  
          socket.send(JSON.stringify({ type: 'full', data: fullStory }));



        } catch (error) {
          socket.send(`Error: ${error.message}`);
        }

       
      } else {
        socket.send('Error: No prompt provided');
      }
    });


});


module.exports = {wsServer };
