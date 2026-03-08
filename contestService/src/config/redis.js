const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: process.env.Redis_pass,
    socket: {
        host: process.env.Redis_Host,
        port: process.env.Redis_port
    }
});

client.on('error', err => console.log('Redis Client Error', err));




module.exports = {
    client
};
