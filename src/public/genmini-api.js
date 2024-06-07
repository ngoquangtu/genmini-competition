
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
          await controller.generateStory(prompt, (chunk) => {
            // socket.send(JSON.stringify(chunk));
            // console.log(JSON.stringify(chunk));
            socket.send(chunk);
            console.log(chunk);
  
          });
        } catch (error) {
          socket.send(`Error: ${error.message}`);
        }
      } else {
        socket.send('Error: No prompt provided');
      }
    });

  socket.on('close', () => {
  console.log('Client disconnected');
});
});
// router.post('/generate-story', async (req, res) => {
//   const prompt = req.body.prompt;

//   if (!prompt) {
//     return res.status(400).send({ error: "Prompt is required" });
//   }

//   try {
//     let chunks = [];
//     await controller.generateStory(prompt, (chunk) => {
//       chunks.push(chunk);
//     });
//     res.status(200).send({ story: chunks });
//   } catch (error) {
//     res.status(500).send({ error: "Error generating story" });
//   }
// });
// router.get('/generate-story', async (req, res) => {
//   const { prompt } = req.query;
  
//   if (!prompt) {
//     return res.status(400).send({ error: "Prompt is required" });
//   }
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();
//   try {
//     await controller.generateStory(prompt, (chunk) => {
//       res.write(`data: ${chunk}\n\n`);
//     });
//   } catch (error) {
//     res.write(`data: Error: ${error.message}\n\n`);
//   } finally {
//     res.end();
//   }
// });


module.exports = {wsServer };
