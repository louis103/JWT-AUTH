//in this tutorial we shall deal with user authorization and authentication
const http = require("http");
const app = require("./app");

//create a server
const server = http.createServer(app);

const { API_PORT } = process.env;
const { MODE } = process.env;
const port = process.env.PORT || API_PORT;//server port

//server listening to specified port
server.listen(port, () => {
    console.log(`Server running on port ${port} in ${MODE} mode.`);
});