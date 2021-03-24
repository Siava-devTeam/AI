var path = require('path');
var fs = require('fs');

var public={};


public.htmlTokenHandler = async function(req,res, next){
    
    try{

        var templateAddress = path.join(__dirname,'../','../','src','public',"profileInfo.html");


        await public.loadFile(templateAddress)
        .then(function(htmlFile){
            res.set('Content-Type', 'text/html');
            res.status(200).send(htmlFile);
        })
        .catch(function(error){
            res.set('Content-Type', 'application/json');
            res.status(404).send({
                'type':'error',
                'data': error
            });
        });

    }catch(e){

        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};


public.loadFile = async function(templateAddress){
    return new Promise(function(resolve,reject){
        try{
            if(templateAddress){

                fs.readFile(templateAddress, 'utf8', function(err,str){
                    if(!err && str && str.length > 0){

                        resolve(str);

                    } else {

                        reject(err);
                    }
                });

            } else {
                reject('A valid template name was not specified');
            }
        }catch(e){
            reject(e.message)
        }
    });
};


module.exports = public;