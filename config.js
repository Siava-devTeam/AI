const config={};

var programmingEnvironment = typeof(process.env.PROG_ENV)!= undefined ? process.env.PROG_ENV : 'frontEnd';
programmingEnvironment = (['frontEnd','backEnd'].indexOf(programmingEnvironment))>-1 ? programmingEnvironment : 'frontEnd';

var nodeEnvironment = typeof(process.env.NODE_ENV)!= undefined ? process.env.NODE_ENV : 'development';
nodeEnvironment = (['development','production'].indexOf(nodeEnvironment))>-1 ? nodeEnvironment : 'development';

// frontEnd config
config.frontEnd={}

// frontEnd development config
config.frontEnd.development={
    "httpPort":5600,
}

// frontEnd production config
config.frontEnd.production={
    "httpPort":6600,
}

// backEnd config
config.backEnd={}

//backEnd development config
config.backEnd.development={
    "httpPort":5200,
    "httpsPort":5400,
    "base":"http://localhost:5200",
    "key":"devKey",
    "mail":{
        "host": 'mail.automatedimmigration.com',
        "port": 465,
        "secure": true, 
        "auth": {
            "user": 'no-reply@automatedimmigration.com',
            "pass": 'Siava@2021',
        },
    },
    "db":{
        "uri":"mongodb+srv://aiDevUser:aiDevUser@2021@cluster0.y1k2d.mongodb.net/",
        "dbName":"automatedImmigration"
    }
}

//backEnd production config
config.backEnd.production={
    "httpPort":6200,
    "httpsPort":6400,
    "key":"productionKey",
    "base":"http://automatedimmigration.herokuapp.com",
    "mail":{
        "host": 'mail.automatedimmigration.com',
        "port": 465,
        "secure": true, 
        "auth": {
            "user": 'no-reply@automatedimmigration.com',
            "pass": 'Siava@2021',
        },
    },
    "db":{
        "uri":"mongodb+srv://aiDevUser:aiDevUser@2021@cluster0.y1k2d.mongodb.net/",
        "dbName":"automatedImmigration"
    }
}

module.exports = config[programmingEnvironment][nodeEnvironment];