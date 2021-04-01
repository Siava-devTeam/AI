var http = require('http');
var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var userDAO = require('./api/DAO/user.DAO');
var tokenDAO = require('./api/DAO/token.DAO');
var sessionDAO = require('./api/DAO/session.DAO');

const port = process.env.PORT || config.httpPort;

// programmingEnvironment
var programmingEnvironment = typeof(process.env.PROG_ENV)!= undefined ? process.env.PROG_ENV : 'frontEnd';
programmingEnvironment = (['frontEnd','backEnd'].indexOf(programmingEnvironment))>-1 ? programmingEnvironment : 'frontEnd';

// nodeEnvironment
var nodeEnvironment = typeof(process.env.NODE_ENV)!= undefined ? process.env.NODE_ENV : 'development';
nodeEnvironment = (['development','production'].indexOf(nodeEnvironment))>-1 ? nodeEnvironment : 'development';

//APP
var app = (programmingEnvironment=='frontEnd') ? require('./src/frontEndServer') : require('./api/backEndServer');

// HTTP Server
const httpServer = http.createServer(app);

//MongoDB
MongoClient.connect(
    config.db.uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize:50,
        connectTimeoutMS:5000,
        writeConcern: {
            j: true
        }
    }
  )
    .catch(err => {
      console.error(err.stack)
      process.exit(1);
    })
    .then(async client => {
        //Connect to User collection
        await userDAO.injectDB(client);
        await tokenDAO.injectDB(client);
        await sessionDAO.injectDB(client);
      
    //HTTP Server
    httpServer.listen(port, () => {
        console.log(`<< ${programmingEnvironment} >> server running on  => ${port} in << ${nodeEnvironment} >> mode`);
    });
    
})