const nodemailer = require('nodemailer');
const config = require('../../config');
const bcrypt = require('bcrypt');

helpers={};

helpers.createToken  = async function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){

    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';  
    var str = '';
    for(i = 1; i <= strLength; i++) {
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        str+=randomCharacter;
    }
        return (str);
    } else {
        return (false);
    }
};

helpers.sendConfirmationMail = async function(link, userInfo){
    try{
        
        //Mail Style
        var mailWrapperStyle=`
            width:100%;
            border:none;
            font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            box-sizing: border-box;`;
        var mailHeadStyle=`
            width: 100%;
            height: 10vh;
            font-size: 1.4rem;
            text-align: center;
            padding: 1rem;
            background-color: teal;
            color: #eee;`;
        var mailBodyStyle=`
            padding: 1rem;
            width: 100%;
            font-size: 1rem;
            background-color: #eee;
            text-align: center;`;
        var mailTrow=`
            width:100%;`;
        var line1Style=`
            font-size:1.1rem;
            font-weight: 400px;
            width: 100%;`;
        var line2Style=`
            font-size:0.8rem;
            font-weight: 400px;
            width: 100%;`;
        var linkStyle=`
            color: blue;width: 100%;`;
        
        //Mail Body
        const mailBody=`
        <table  cellspacing="0" cellpadding="0" style="${mailWrapperStyle}">
            <tr style="${mailTrow}">
                <td  style="${mailHeadStyle}">Welcome to Automated Immigration System</td>
            </tr>
            <tr style="${mailTrow}">
                <td style="${mailBodyStyle}">
                    <table style="${mailBodyStyle}" cellspacing="0" cellpadding="5rem 0">
                        <tr style="${mailTrow}">
                            <td  style="${line1Style}">
                                Please confirm your email by clicking on following link: 
                            </td>
                        </tr>
                        <tr style="${mailTrow}">
                            <td style="${line2Style}">
                                (In case of any problem, copy and paste the address in your browser's address bar)
                            </td>
                        </tr>
                        <tr style="${mailTrow}">
                            <td>
                                <a style="${linkStyle}" href="${link}" target="_blank">${link}</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;


        //Mailing System
        await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport(config.mail);

        const info = await transporter.sendMail({
            from: `Do Not Reply ${config.mail.auth.user}`,
            to: userInfo.email,
            subject: `Please Confirm you email ${userInfo.firstName}`,
            html:mailBody,
        });

        return({
            'type': 'success',
            'data': `Message Sent to ${info.to}`,
        });

    }catch(e){
        return({
            'type': 'error',
            'data':e.message
        });
    }

};

helpers.replaceIllegalChars= async function(str){
    var result = str;
    var illegalChars=['{','}','*','(',')','<','>','&',':'];
    for (var i=0;i<illegalChars.length;i++){
        if (result.indexOf(illegalChars[i])>-1){
            var regex=new RegExp(illegalChars[i], 'g');
            result=result.replace(regex,'');
        }
    }
    return result;
};

helpers.hashPassword = async function(password){

    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
        try{
            bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err){
                reject(false);
            }
            resolve(hash);
            });
        }catch(e){
            reject(false);
        }
    })

    return hashedPassword
};
module.exports = helpers;