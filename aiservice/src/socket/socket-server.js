const { Server } = require('socket.io');
const { HumanMessage, SystemMessage, AIMessage } = require('@langchain/core/messages')
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const agent = require('../services/langgraph');
function initSocketServer(httpserver) {
  const io = new Server(httpserver, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
    }
  })

  const systemPrompt = `You are and ai Code assistant. you have to fix the code of leetcode problem. you have to use the tools to find the problem by its id so the model will fix it. you have to provide the fixed code . also you have to provide the code in the same language as the problem.The Output should always be in json format.it contains fixed_code and mistakes in the code pointwise with line number and mistake description the fixed code must be ready to run and do not contain any extra text or explanation.provide only real mistake if you dont able to recognize or code is empty or not understandable then provide empty array of mistakes.Do not provide ans of any Question talk related to question onlyand do not give any header make only funtion and its code
  like if code is class Solution {
    public int[] twoSum(int[] nums, int target) {
           ...code
    }
} then you need to return same without any extra library or thing put code inside function rest of all i manage.
 donot use lib like import java.util.*; or include , suing namespace std or any language library

 
 {
    "fixed_code": "<code>",
    "mistakes": "[
       {
          "mistake": "<mistake>",
          "line": <line>
       },
       {
          "mistake": "<mistake>",
          "line": <line>
       },
       {
          "mistake": "<mistake>",
          "line": <line>
       },
       {
          "mistake": "<mistake>",
          "line": <line>
       },
       {
          "mistake": "<mistake>",
          "line": <line>
       }
    ]"
 }
   Rules:
   1 Must provide the same structure of json
   2 Do not contain any extra text or explanation or symbol like ** and all
  
 `



  io.use(async (socket, next) => {
    const pid = socket.handshake.auth.pid;
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      console.log('Socket auth failed: no token cookie');
      next(new Error("Unauthorized"));
    }
    try {
      const decoded = jwt.verify(cookies.token, process.env.Jwt_key);
      socket.user = decoded;
      socket.token = cookies.token;
      socket.pid = pid;
      next();
    }
    catch (err) {
      console.log('Socket auth failed:', err.message || err);
      next(new Error(err));
    }

  })

  io.on('connection', (socket) => {

    socket.on("ai-message", async (msg) => {



      try {

        const result = await agent.invoke(
          {
            messages: [
              new HumanMessage(msg.message),
              new SystemMessage(systemPrompt + `pid:${socket.pid}this is problem id do not change it`)
            ]
          },
          {
            metadata: {
              token: socket.token
            }
          }
        );




        console.log(result.messages[result.messages.length - 1].content)
        socket.emit("ai-message-response", {
          response: result.messages[result.messages.length - 1].content,
          chatId: msg.chatId
        });


      }

      catch (err) {
        console.error("Error handling ai-message:", err);
        socket.emit('ai-message-error', { error: err.message });
      }

    });

  });

}

module.exports = initSocketServer;
