require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/config/mongo');
const msgqueue = require('./src/services/broker');
const initSocketServer = require('./src/socket/socket-server');
const http = require('http');

connectDb();
msgqueue.connect().catch(err => console.error('Broker connect error:', err));

const PORT = process.env.PORT || 8010;
const httpserver = http.createServer(app);
initSocketServer(httpserver);

httpserver.listen(PORT, () => {
    console.log(`aiService running on port ${PORT}`);
});

