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
}

//backEnd production config
config.backEnd.production={
    "httpPort":6200,
    "httpsPort":6400,
}

module.exports = config[programmingEnvironment][nodeEnvironment];