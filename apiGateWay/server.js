const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));

const routes = {
    '/api/users': 'http://localhost:8000',
    '/api/submission': 'http://localhost:8003',
    '/api/problems': 'http://localhost:8002',
    '/api/profiles': 'http://localhost:8001',
    '/api/contests': 'http://localhost:8005',
};

for (const [route, target] of Object.entries(routes)) {
    app.use(createProxyMiddleware({
        target,
        changeOrigin: true,
        pathFilter: route,
        timeout: 30000, 
    }));
}


app.use((req, res) => {
    res.status(404).json({ message: "Gateway Error: Endpoint not found or microservice is down." });
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});
