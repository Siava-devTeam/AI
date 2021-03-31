const nodemailer = require('nodemailer');
const config = require('../../config');
const bcrypt = require('bcrypt');
const path = require('path');

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
        const pageWrapper = `
        line-height: 1.5rem;
        display: table;
        margin: 0;
        width: 100%;
        height: 100vh;
        background-color: #F3F4F6;
        text-align: center;`;

        const tblRow = `width: 100%;`;
        
        const frmWrapper = `
        text-align: center;
        background-color: #fff;
        width:500px;
        padding: 1.25rem;
        margin: auto;`;
        
        const frmLogo = `
        padding: 0.75rem 1rem;
        width: 100%;`;
        
        const frmLogoImg =`width:400px;`;

        const frmTitle = `
        width: 100%;
        color: #60A5FA;
        font-size: 1.25rem;
        line-height: 1.75rem;
        padding: 0.75rem 1rem;`;
        
        const frmText = `
        width: 100%;
        color: #9CA3AF;
        font-size: 1rem;
        line-height: 1.25rem;
        padding: 0.75rem 1rem;`;
        
        const frmButton = `
        width: 100%;
        padding: 1rem 0rem;`;
        
        const formButton = `
        background-color: #60A5FA;
        border: 2px #60A5FA solid;
        color: #fff;
        padding: .5rem 1rem;
        font-size: 1.25rem;
        line-height: 1.5;
        border-radius: .3rem;
        text-decoration: none;`;

        const mailBody=`
        <table style="${pageWrapper}">
            <tr style="${tblRow}">
                <td>
                    <table style="${frmWrapper}">
                        <tr style="${tblRow}">
                            <td style="${frmLogo}">
                            <img style="${frmLogoImg}" src="cid:confirmationPagelogo"/>
                            </td>
                        </tr>
                        <tr style="${tblRow}">
                            <td style="${frmTitle}">Welcome to Automated Immigration System</td>
                        </tr>
                        <tr style="${tblRow}">
                            <td style="${frmText}">Please confirm your email by clicking on following link</td>
                        </tr>
                        <tr style="${tblRow}">
                            <td style="${frmButton}">
                                <a style="${formButton}" href="${link}" target="_blank">Continue Registration</button>
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
            attachments: [
    
                {
                  filename: 'aiRect.png',
                  path: path.join(__dirname,'../','../','src','public','images','aiRect.png'),
                  cid: 'confirmationPagelogo',
    
                },
    
            ]
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