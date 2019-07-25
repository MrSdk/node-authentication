 
var app = require("./app")
var http = require("http")
var port = process.env.PORT || 8080;


var server = http.createServer(app)

server.listen(port,()=>{
    console.log(`Server running on port ${port}`); 
})