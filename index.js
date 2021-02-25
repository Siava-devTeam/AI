var http = require('http');
var config = require('./config');
const port = process.env.PORT || config.httpPort;

// programmingEnvironment
var programmingEnvironment = typeof(process.env.PROG_ENV)!= undefined ? process.env.PROG_ENV : 'frontEnd';
programmingEnvironment = (['frontEnd','backEnd'].indexOf(programmingEnvironment))>-1 ? programmingEnvironment : 'frontEnd';

// nodeEnvironment
var nodeEnvironment = typeof(process.env.NODE_ENV)!= undefined ? process.env.NODE_ENV : 'development';
nodeEnvironment = (['development','production'].indexOf(nodeEnvironment))>-1 ? nodeEnvironment : 'development';

//APP
var app = (programmingEnvironment=='frontEnd') ? require('./src/server') : require('./api/server');

// HTTP Server
const httpServer = http.createServer(app);

//HTTP Server
httpServer.listen(port, () => {
    console.log(`<< ${programmingEnvironment} >> server running on  => ${port} in << ${nodeEnvironment} >> mode`);
});