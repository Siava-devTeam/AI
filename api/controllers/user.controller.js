var userDAO = require('../DAO/user.DAO');
var tokenDAO = require('../DAO/token.DAO');
var helpers = require('./helpers');
var config = require('../../config');

var user={};

// TO DO on this page
/*
    1.add projection when reading a file from Database
    2.i user.exist:
        ->Resend Email if initReg
        ->redirect to signin if paid

*/


user.getUserByToken = async function(token){

    return new Promise(async function(resolve,reject){

        try{

            token = (token)?await helpers.replaceIllegalChars(token):false;
            token = ((token)&&(typeof(token)!=='undefined')&&(token.length==20))?token:false;
            
            if(token){
    
                var tokenData = await tokenDAO.getTokenByToken(token);
                if ((tokenData.type=='success') && (tokenData.data)){
                    
                    var userData = await userDAO.getUser(tokenData.data.email);

                    if ((userData.type=='success') && (userData.data)){

                        // var data = {
                        //     "firstName":userData.data.firstName,
                        //     "lastName":userData.data.lastName,
                        //     "email":userData.data.email
                        // };

                        resolve(JSON.stringify(userData.data));
    
                    }else{
                        reject('No user for this token');
                    }
    
                }else{
                    reject('Token Does not exist!');
                }
    
            }else{
                reject('Token is not Valid');
            }
    
        }catch(e){
            reject(e.message);
        }
    });
};

user.deleteUserToken = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus, messageText;
        //Parsing Token
        var token = req.query;
        token = (token.hasOwnProperty('t'))?token.t:false;
        token = (token)?await helpers.replaceIllegalChars(token):false;
        token = ((token)&&(typeof(token)!=='undefined')&&(token.length==20))?token:false;
        
        console.log(token)

        if(token){

            var deleteResults = await tokenDAO.deleteToken(token);
            if (deleteResults.type=='success'){
            
                console.log(deleteResults);

                messageStatus = 200;
                messageText = {
                    'type':'success',
                    'data': 'user deleted successfully'
                };

            }else{
                messageStatus = 500;
                messageText = {
                    'type':'error',
                    'data': 'Problem with deleting the item!'
                };
            }

        }else{
            messageStatus = 500;
            messageText = {
                'type':'error',
                'data': 'The token is not Valid!'
            };
        }
        //Response
        res.status(messageStatus).send(messageText);
        
    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.updateUserByToken = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus,messageText;
        //Parsing Token
        var token = (typeof(req.body.token)!== 'undefined')?req.body.token:false;


        await user.getUserByToken(token)
        .then(async function(userData){


            var userDateOfBirth = ((req.body.dateOfBirth)&&(typeof(req.body.dateOfBirth))!== 'undefined')?req.body.dateOfBirth:false;
            var userLicenceNumber = ((req.body.licenceNumber)&&(typeof(req.body.licenceNumber)!== 'undefined'))?req.body.licenceNumber:false;
            var userCompanyName = ((req.body.companyName)&&(typeof(req.body.companyName)!== 'undefined'))?req.body.companyName:false;
            var userPassword = ((req.body.password)&&(typeof(req.body.password)!== 'undefined'))?req.body.password:false;
            var userPlan = ((req.body.plan)&&(typeof(req.body.plan)!== 'undefined'))?req.body.plan:false;

            if(userDateOfBirth && userLicenceNumber && 
                userCompanyName && userPassword && userPlan){

                var hashedPassword = await helpers.hashPassword(userPassword);

                if(hashedPassword){
                    var userObject = {
                        'dateOfBirth':userDateOfBirth,
                        'licenceNumber':userLicenceNumber,
                        'companyName':userCompanyName,
                        'password':hashedPassword,
                        'plan':userPlan,

                    }

                    var userEmail = (JSON.parse(userData)).email;
                    
                    var updateResult = await userDAO.updateUser(userEmail,userObject);

                    if (updateResult.type=='success'){
                        messageStatus = 200;
                        messageText = {
                            'type':'success',
                            'data': 'User Updated Successfully'
                        };

                    }else{
                        messageStatus = 500;
                        messageText = {
                            'type':'error',
                            'data': 'problem with updating results!'
                        };
                    }
                    
                }else{
                    messageStatus = 500;
                    messageText = {
                        'type':'error',
                        'data': 'problem with hashing password!'
                    };
                }

            }else{
                messageStatus = 500;
                messageText = {
                    'type':'error',
                    'data': 'Input field Problem'
                };
            }

            //Response
            res.status(messageStatus).send(messageText);
        })
        .catch(async function(err){
            messageStatus = 500;
            messageText = {
                'type':'error',
                'data': err
            };
            //Response
            res.status(messageStatus).send(messageText);
        });

    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.getAddressByToken =async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        //Parsing Token
        var token = req.query;
        token = (token.hasOwnProperty('t'))?token.t:false;

        await user.getUserByToken(token)
        .then(function(userData){
            var allUserInfo= JSON.parse(userData);
            var userInfo = allUserInfo.homeAddress;

            var messageStatus = 200;
            var messageText = {
                'type':'success',
                'data': userInfo
            };
            //Response
            res.status(messageStatus).send(messageText);
        })
        .catch(function(err){
            var messageStatus = 500;
            var messageText = {
                'type':'error',
                'data': err
            };
            //Response
            res.status(messageStatus).send(messageText);
        });

    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.updateUserStatusByToken = async function(req,res,next){
    try{

        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus,messageText;
        //Parsing Token
        var token = (typeof(req.body.token)!== 'undefined')?req.body.token:false;

        // console.log(token);

        await user.getUserByToken(token)
        .then(async function(userData){

            var userStatus = ((req.body.status)&&(typeof(req.body.status))!== 'undefined')?req.body.status:false;
        
            if (userStatus){

                userObject={
                    "status":userStatus,
                }

                var userEmail = (JSON.parse(userData)).email;
                var updateResult = await userDAO.updateUser(userEmail,userObject);
            
                if (updateResult.type=='success'){

                    messageStatus = 200;
                    messageText = {
                        'type':'success',
                        'data': 'User Updated Successfully'
                    };

                }else{
                    messageStatus = 500;
                    messageText = {
                        'type':'error',
                        'data': 'problem with updating results!'
                    };
                }

            }else{
                messageStatus = 500;
                messageText = {
                    'type':'error',
                    'data': 'Input field Problem'
                };
            }

            //Response
            res.status(messageStatus).send(messageText);

        })
        .catch(async function(err){
            messageStatus = 500;
            messageText = {
                'type':'error',
                'data': err
            };
            //Response
            res.status(messageStatus).send(messageText);
        });
    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.updateUserAddressByToken = async function(req,res,next){
    try{

        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus,messageText;
        //Parsing Token
        var token = (typeof(req.body.token)!== 'undefined')?req.body.token:false;

        // console.log(token);

        await user.getUserByToken(token)
        .then(async function(userData){

            var addressType = ((req.body.type)&&(typeof(req.body.type))!== 'undefined')?req.body.type:false;
            var userCountry = ((req.body.country)&&(typeof(req.body.country))!== 'undefined')?req.body.country:false;
            var userStreetNumber = ((req.body.streetNumber)&&(typeof(req.body.streetNumber)!== 'undefined'))?req.body.streetNumber:false;
            var userStreetName = ((req.body.streetName)&&(typeof(req.body.streetName)!== 'undefined'))?req.body.streetName:false;
            var userUnit = ((req.body.unit)&&(typeof(req.body.unit)!== 'undefined'))?req.body.unit:"";
            var userProvince = ((req.body.province)&&(typeof(req.body.province)!== 'undefined'))?req.body.province:false;
            var userZipCode = ((req.body.zipCode)&&(typeof(req.body.zipCode)!== 'undefined'))?req.body.zipCode:false;

            if (userCountry && userStreetNumber && userStreetName && userProvince && userZipCode){
            
                // console.log("data Valid");

                var addressObject = {};
                addressObject[addressType] = {
                    'country':userCountry,
                    'streetNumber':userStreetNumber,
                    'streetName':userStreetName,
                    'unit':userUnit,
                    'province':userProvince,
                    'zipCode':userZipCode,

                }

                // console.log(addressObject);

                var userEmail = (JSON.parse(userData)).email;
                
                
                var updateResult = await userDAO.updateUser(userEmail,addressObject);
                
                // console.log(userData);
                // console.log(updateResult);
                

                if (updateResult.type=='success'){

                    messageStatus = 200;
                    messageText = {
                        'type':'success',
                        'data': 'User Updated Successfully'
                    };

                }else{
                    messageStatus = 500;
                    messageText = {
                        'type':'error',
                        'data': 'problem with updating results!'
                    };
                }

            }else{
                messageStatus = 500;
                messageText = {
                    'type':'error',
                    'data': 'Input field Problem'
                };
            }

            //Response
            res.status(messageStatus).send(messageText);

        })
        .catch(async function(err){
            messageStatus = 500;
            messageText = {
                'type':'error',
                'data': err
            };
            //Response
            res.status(messageStatus).send(messageText);
        });
    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.getTokenUser = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        //Parsing Token
        var token = req.query;
        token = (token.hasOwnProperty('t'))?token.t:false;

        await user.getUserByToken(token)
        .then(function(userData){
            var allUserInfo= JSON.parse(userData);
            var userInfo = {
                "firstName":allUserInfo.firstName,
                "lastName":allUserInfo.lastName,
                "email":allUserInfo.email
            };

            var messageStatus = 200;
            var messageText = {
                'type':'success',
                'data': userInfo
            };
            //Response
            res.status(messageStatus).send(messageText);
        })
        .catch(function(err){
            var messageStatus = 500;
            var messageText = {
                'type':'error',
                'data': err
            };
            //Response
            res.status(messageStatus).send(messageText);
        });

    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.initialRegistration = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus = 200;
        var messageText = {
            'type':'success',
            'data':"initial registration done!"
        };

        //Sanity Check 
        var userFirstName = (typeof(req.body.firstName)!== 'undefined')?req.body.firstName:false;
        var userLastName = (typeof(req.body.lastName)!== 'undefined')?req.body.lastName:false;
        var userPhone = (typeof(req.body.phone)!== 'undefined')?req.body.phone:false;
        var userEmail = (typeof(req.body.email)!== 'undefined')?req.body.email:false;
        

        if (userEmail && userLastName && userPhone && userEmail){

            //Create User object
            userObject={
                "firstName":userFirstName,
                "lastName":userLastName,
                "email":userEmail,
                "phone":userPhone,
                "status":"initial",
                "role":"rcic"
            }
            
            var userData = await userDAO.getUser(userEmail);
            if ((userData.type=='success') &&
                (!userData.data)){
                
                //Push the info to the database (keep a log)
                var insertUserData = await userDAO.addUser(userObject);
                if (insertUserData.type=='success'){
                    
                    // Send Confirmation Email---------------------------------------????
                    var token = await helpers.createToken(20);
                    //Save Token
                    if (token){
                        var tokenInfo={
                            "email":userEmail,
                            "token":token,
                        }

                        var insertTokenData = await tokenDAO.addToken(tokenInfo);
                        if (insertTokenData.type=='success'){

                            //Send Email
                            var outgoingEmail=await helpers.sendConfirmationMail(`${config.base}/profileInfo.html?t=${token}`,userObject);
                            if (outgoingEmail.type=='success'){
                                messageStatus = 200;
                                messageText={
                                    'type':'success',
                                    'data':'user created successfully. We have sent you an Email. Please confirm your email and continue the registration process.'
                                };
                            }else{
                                messageStatus = 500;
                                messageText={
                                    'type':'error',
                                    'data':outgoingEmail.data
                                };
                            }

                        }else{
                            messageStatus = 500;
                            messageText={
                                'type':'error',
                                'data':insertTokenData.data
                            };
                        }

                    }else{
                        messageStatus = 500;
                        messageText={
                            'type':'error',
                            'data':"Problem with creating token!"
                        }
                    }

                }else{
                    messageStatus = 400;
                    messageText={
                        'type':'error',
                        'data':insertUserData.data
                    };
                }

            }else{
                //What to do from here? if user exist---------------------------------------???
                //Resend Email if initReg
                //redirect to signin if paid
                // ---------------------------------------???

                //Resend Email
                var token;
                var tokenData = await tokenDAO.getTokenByEmail(userEmail);
                if ((tokenData.type=='success') && (tokenData.data)){
                    token = tokenData.data.token;
                    //===========
                    //Send Email
                    var outgoingEmail=await helpers.sendConfirmationMail(`${config.base}/profileInfo.html?t=${token}`,userObject);
                    if (outgoingEmail.type=='success'){
                        messageStatus = 200;
                        messageText={
                            'type':'success',
                            'data':'You have profile with us. We have sent you an Email. Please confirm your email and continue the registration process.'
                        };
                    }else{
                        messageStatus = 500;
                        messageText={
                            'type':'error',
                            'data':outgoingEmail.data
                        };
                    }
                    //=============

                }else{
                    token = await helpers.createToken(20);

                    //======================
                    var tokenInfo={
                        "email":userEmail,
                        "token":token,
                    }

                    var insertTokenData = await tokenDAO.addToken(tokenInfo);
                    if (insertTokenData.type=='success'){

                        //Send Email
                        var outgoingEmail=await helpers.sendConfirmationMail(`${config.base}/profileinfo.html?t=${token}`,userObject);
                        if (outgoingEmail.type=='success'){
                            messageStatus = 200;
                            messageText={
                                'type':'success',
                                'data':'You have a profile wit us. We have sent you an Email. Please confirm your email and continue the registration process.'
                            };
                        }else{
                            messageStatus = 500;
                            messageText={
                                'type':'error',
                                'data':outgoingEmail.data
                            };
                        }

                    }else{
                        messageStatus = 500;
                        messageText={
                            'type':'error',
                            'data':insertTokenData.data
                        };
                    }

                    //====================
                    
                }
            }

        }else{
            messageStatus = 400;
            messageText={
                'type':'error',
                'data':'Missing Email! Problem with input Fields!'
            };
        }
        
        //Response
        res.status(messageStatus).send(messageText);
    }
    catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

module.exports = user;