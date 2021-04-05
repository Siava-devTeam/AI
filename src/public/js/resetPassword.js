var resetPassword={};

resetPassword.validateRequired = function(filedId){
    var fieldValue =(document.getElementById(filedId).value).trim();
    if ((fieldValue=='')|| (fieldValue==null) || (fieldValue=='undefined')){
        return false;
    }

    return true;
};

resetPassword.validateForm = function(callback){
    if (resetPassword.validateRequired('txtPassword')){
        callback ("valid","valid");
    }else{
        callback('Password Empty!', "Password can not be Empty!");
    }

};

resetPassword.handleResetProcess = function(){
    resetPassword.validateForm(function(title, message){
        if (title == 'valid'){
            var userPass = (document.getElementById('txtPassword').value).trim();
            
            if (resetPassword.hasOwnProperty('pageToken'))
            {
                var userToken = resetPassword['pageToken'];
                var formData={
                    "token":userToken,
                    "password":userPass,
                };

                var base = window.location.origin;
                axios({
                    method: "post",
                    url: base+"/api/v1/user/resetPassword",
                    data:formData
                })
                .then(function(res){
                    console.log('success');
                    console.log(res.data.data);
                    app.showModal('success','Congrats!','Password Changed Successfully.')
                    // if (res.data.data=='paid'){
                    //     var base = window.location.origin;
                    //     window.location.href = base+"/signin.html";
                        
                    // }else{
                    //     app.showModal('success','Congrats!','User Registered successfully.'+ 
                    //     'We have sent you an Email. Please confirm your email and continue the registration process.');
                    // }

                }).catch(function(err){
                    console.log(err.response.data.data);
                    if (typeof(err.response)=="undefined"){
                        app.showModal('error','Something went wrong!',"Request timeout!");
                    }else{
                        app.showModal('error','Something went wrong!',err.response.data.data);
                    }
                });

            }else{
                app.showModal('error','Token Error', 'Token does not exist!')
            }
        }else{
            app.showModal('error',title, message)
        }
    });
};

resetPassword.setResetButton = function(){
    var btnReset = document.getElementById('btnReset');
    btnReset.addEventListener('click',function(){
        resetPassword.handleResetProcess();
    });
};

resetPassword.togglePassText = function(imageTag){
    var eyeImage='images/eye.svg';
    var eyeSlashImage='images/eyeSlash.svg';
    imageTag.src = imageTag.src.indexOf('eyeSlash.svg')>-1 ? eyeImage : eyeSlashImage;
    
    var passTextBox = imageTag.parentNode.parentNode.children[0];
    passTextBox.type = imageTag.src.indexOf('eyeSlash.svg')>-1 ? 'password' : 'text';
}

resetPassword.setPasswordEye = function(){
    //PassEye
    var passEye = Object.values(document.getElementsByClassName('passwordEyeImage'));
    passEye[0].addEventListener('click',function(){
        resetPassword.togglePassText(passEye[0]);
    });
};

resetPassword.getToken = function(){
    var address = window.location.href;
    address = (address.indexOf('?')==-1)?false:address;
    address = ((address) && (address.indexOf('=')==-1))?false:address;
    address = ((address) && (address.indexOf('&')>-1))?false:address;
    if (address){
        var temp = address.split('?');
        if((temp.length>1)&&(temp[1].length==22)){
            var tempToken = temp[1].split('=');
            return tempToken[1];   
        }
    }

    return false;
};

resetPassword.validatePage = function(){
    var pageToken = resetPassword.getToken();
    if (pageToken){
        resetPassword['pageToken'] = pageToken;
        return true;

    }else{
        app.showModal('error','Link Not Valid!',"The link you have used to reach out to this page is not valid!");
    }

    return false;
}

app.init = function(){
    app.setModalCloseButton();
    app.setTexFormLinks();
    resetPassword.setPasswordEye();
    if (resetPassword.validatePage()){
        resetPassword.setResetButton();
    }else{
        // var base = window.location.origin;
        // window.location.href = base+"/signin.html";
    }
};

app.init();