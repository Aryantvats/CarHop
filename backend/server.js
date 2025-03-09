const app = require('./app');

const http = require('http');
const {initialiseSocket} = require('./socket');

const port = process.env.PORT || 8000;

const server = http.createServer(app);

initialiseSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});