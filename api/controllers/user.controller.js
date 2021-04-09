var userDAO = require('../DAO/user.DAO');
var tokenDAO = require('../DAO/token.DAO');
var sessionDAO = require('../DAO/session.DAO');
var helpers = require('./helpers');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var user={};

// TO DO on this page
/*
    1.add projection when reading a file from Database
    2.if user.exist:
        ->Resend Email if initReg DONE!
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
            var userMembership = ((req.body.membership)&&(typeof(req.body.membership)!== 'undefined'))?req.body.membership:false;


            if(userDateOfBirth && userLicenceNumber && 
                userCompanyName && userPassword && userMembership){

                var hashedPassword = await helpers.hashPassword(userPassword);

                if(hashedPassword){
                    var userObject = {
                        'dateOfBirth':userDateOfBirth,
                        'licenceNumber':userLicenceNumber,
                        'companyName':userCompanyName,
                        'password':hashedPassword,
                        'membership':userMembership,

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
            
            // console.log(userInfo);

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
            var userCity = ((req.body.city)&&(typeof(req.body.city))!== 'undefined')?req.body.city:false;
            var userCountry = ((req.body.country)&&(typeof(req.body.country)!== 'undefined'))?req.body.country:false;
            var userState = ((req.body.state)&&(typeof(req.body.state)!== 'undefined'))?req.body.state:"";
            var userAddress1 = ((req.body.address1)&&(typeof(req.body.address1)!== 'undefined'))?req.body.address1:false;
            var userAddress2 = ((req.body.address2)&&(typeof(req.body.address2)!== 'undefined'))?req.body.address2:"";
            var userZipCode = ((req.body.zipCode)&&(typeof(req.body.zipCode)!== 'undefined'))?req.body.zipCode:false;

            if (userCity && userCountry && userAddress1 && userZipCode){
            
                // console.log("data Valid");

                var addressObject = {};
                addressObject[addressType] = {
                    'city':userCity,
                    'country':userCountry,
                    'state':userState,
                    'address1':userAddress1,
                    'address2':userAddress2,
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

                // console.log(userData.data.status);
                if (userData.data.status=='paid'){
                    messageStatus = 200;
                    messageText={
                        'type':'success',
                        'data':'paid'
                    };
                }else{
                    //Resend Email
                    var token;
                    var tokenData = await tokenDAO.getTokenByEmail(userEmail);
                    if ((tokenData.type=='success') && (tokenData.data)){
                        token = tokenData.data.token;
                        //===========
                        // Send Email
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

user.userSignin = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus = 200;
        var messageText = {
            'type':'success',
            'data':"user signed-in successfully"
        };

        //Sanity Check 
        var userEmail = (typeof(req.body.email)!== 'undefined')?req.body.email:false;
        var userPassword = (typeof(req.body.password)!== 'undefined')?req.body.password:false;
        
        if (userEmail && userPassword){
            //Get user By Email
            var userData = await userDAO.getUser(userEmail);
            if ((userData.type=='success') && (userData.data)){
                
                var currentPassword = userData.data.password;
                var passwordCheck = await helpers.comparePasswords(userPassword,currentPassword);

                if (passwordCheck){
                    //If pass works!
                    //Sign the object + timing
                    var signature = await helpers.signToken({
                        "firstName":userData.data.firstName,
                        "lastName":userData.data.lastName,
                        "email":userEmail,
                    });
                    
                    var sessionObject={
                        "firstName":userData.data.firstName,
                        "lastName":userData.data.lastName,
                        "email":userEmail,
                        "session":signature
                    }
                    //SAVE TO SESSION DB FIRST
                    //If another session exist, delete session
                    //add new one
                    var sessionData = await sessionDAO.getSessionByEmail(userEmail);
                    if ((sessionData.type=='success') && (!sessionData.data)){
                        
                        var insertSessionData = await sessionDAO.addSession(sessionObject);
                        if (insertSessionData.type=='success'){

                            messageStatus = 200;
                            messageText={
                                'type':'success',
                                'data':signature
                            };

                        }else{
                            messageStatus = 500;
                            messageText={
                                'type':'error',
                                'data':'Problem with saving session data'
                            };
                        }

                    }else{

                        //delete session
                        var deleteSessionResults = await sessionDAO.deleteSessionByEmail(userEmail);
                        if (deleteSessionResults.type=='success'){

                            var insertSessionData = await sessionDAO.addSession(sessionObject);
                            if (insertSessionData.type=='success'){

                                messageStatus = 200;
                                messageText={
                                    'type':'success',
                                    'data':signature
                                };

                            }else{
                                messageStatus = 500;
                                messageText={
                                    'type':'error',
                                    'data':'Problem with saving session data'
                                };
                            }

                        }else{

                            messageStatus = 500;
                            messageText={
                                'type':'error',
                                'data':'Problem with deleting old session'
                            };

                        }
                    }

                }else{
                    //ELSE message back
                    messageStatus = 500;
                    messageText={
                        'type':'error',
                        'data':'Password is not correct!'
                    };
                }

            }else{
                //ELSE message back
                messageStatus = 500;
                messageText={
                    'type':'error',
                    'data':'User does not exist!'
                };
            }

        }else{
            //ELSE message back
            messageStatus = 400;
            messageText={
                'type':'error',
                'data':'Missing Email or Password! Problem with input Fields!'
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

user.checkSession = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');

        var sessionToken = (req.headers.authorization)
        sessionToken = sessionToken.trim();
        sessionToken = typeof(sessionToken)!='undefined'? sessionToken: false;
        sessionToken = (sessionToken!="" && sessionToken)?sessionToken:false;

        if (sessionToken){
            helpers.verifyToken(sessionToken, async function(tokenResponse){
                // console.log(tokenResponse);
    
                if (tokenResponse){
                    // console.log(tokenResponse);

                    var sessionData = await sessionDAO.getSessionBySession(sessionToken);
                    if ((sessionData.type=='success') && (sessionData.data)){
                        
                        // console.log('found it!');
                        
                        var messageStatus = 200;
                        var messageText = {
                            'type':'success',
                            'data':{
                                "firstName":tokenResponse.data.firstName,
                                "lastName":tokenResponse.data.lastName
                            }
                        };
    
                    }else{
    
                        var messageStatus = 400;
                        var messageText = {
                            'type':'error',
                            'data':"Invalid Session"
                        };
    
                    }
    
                }else{
    
                    var messageStatus = 400;
                    var messageText = {
                        'type':'error',
                        'data':"Invalid Session Token"
                    };
                    
                }
                // Response
                res.status(messageStatus).send(messageText);
            })
        }else{
            //Response
            var messageStatus = 400;
            var messageText = {
                'type':'error',
                'data':"session not Valid!"
            };
            res.status(messageStatus).send(messageText);
        }

        //Response
        // var messageStatus = 200;
        // var messageText = {
        //     'type':'success',
        //     'data':"Token Valid!"
        // };
        // res.status(messageStatus).send(messageText);

    }catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

user.forgotPassword = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus = 200;
        var messageText = {
            'type':'success',
            'data':"initial registration done!"
        };
         
        //Sanity Check
         var userEmail = (typeof(req.body.email)!== 'undefined')?req.body.email:false;
 
         if (userEmail){
 
             //Create User object
             userObject={
                "email":userEmail,
             }

             var userData = await userDAO.getUser(userEmail);
            if ((userData.type=='success') && (userData.data)){
                
                //Adding First Name to userObject
                userObject["firstName"] = userData.data.firstName;

                //Check if this user currently has some tokens
                var tokenData = await tokenDAO.getTokenByEmail(userEmail);
                if ((tokenData.type=='success') && (!tokenData.data)){

                    // Send reset Pass Email---------------------------------------
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
                            var outgoingEmail=await helpers.sendMailGeneral(`${config.base}/resetPassword.html?t=${token}`,userObject,"resetPass");
                            if (outgoingEmail.type=='success'){
                                messageStatus = 200;
                                messageText={
                                    'type':'success',
                                    'data':'We sent you a link to your email. Use that to reset your password!'
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

                    var token = tokenData.data.token;
                    // console.log(token);

                    //Send Email
                    var outgoingEmail=await helpers.sendMailGeneral(`${config.base}/resetPassword.html?t=${token}`,userObject,"resetPass");
                    if (outgoingEmail.type=='success'){
                        messageStatus = 200;
                        messageText={
                            'type':'success',
                            'data':'We sent you a link to your email. Use that to reset your password!'
                        };
                    }else{
                        messageStatus = 500;
                        messageText={
                            'type':'error',
                            'data':outgoingEmail.data
                        };
                    }


                }

            }else{
                messageStatus = 400;
                messageText={
                    'type':'error',
                    'data':'You don\'t have an account with us. Please Register first!'
                };
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

user.resetPassword = async function(req,res,next){
    try{
        //Default message
        res.set('Content-Type', 'application/json');
        var messageStatus, messageText;

        // req.body { token: 'zy7e2lfkmzwztdysfvbj', password: '324' }

        var token = (typeof(req.body.token)!== 'undefined')?req.body.token:false;
        var userPassword = (typeof(req.body.password)!== 'undefined')?req.body.password:false;

        if (token && userPassword){

            await user.getUserByToken(token)
            .then(async function(userData){

                // if(userDateOfBirth && userLicenceNumber && 
                //     userCompanyName && userPassword && userPlan){

                var userEmail = (JSON.parse(userData)).email;

                var hashedPassword = await helpers.hashPassword(userPassword);

                if(hashedPassword){
                    var userObject = {
                        'password':hashedPassword
                    }
                    
                    var updateResult = await userDAO.updateUser(userEmail,userObject);

                    if (updateResult.type=='success'){
                        //delete the token from database
                        var deleteResults = await tokenDAO.deleteToken(token);
                        if (deleteResults.type=='success'){
                        
                            // console.log(deleteResults);

                            messageStatus = 200;
                            messageText = {
                                'type':'success',
                                'data': 'user deleted successfully'
                            };

                        }else{
                            messageStatus = 500;
                            messageText = {
                                'type':'error',
                                'data': 'Problem with deleting the token!'
                            };
                        }

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

            // }else{
            //     messageStatus = 500;
            //     messageText = {
            //         'type':'error',
            //         'data': 'Input field Problem'
            //     };
            // }

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

        }else{
            messageStatus = 500;
            messageText = {
                'type':'error',
                'data': 'Input field Problem'
            };
            //Response
            res.status(messageStatus).send(messageText);
        }
    }
    catch(e){
        const error = new Error(e.message);
        error.statusCode = 501;
        next(error);
    }
};

module.exports = user;