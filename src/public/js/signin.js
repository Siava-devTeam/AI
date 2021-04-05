var signIn = {};

signIn.togglePassText = function(imageTag){
    var eyeImage='images/eye.svg';
    var eyeSlashImage='images/eyeSlash.svg';
    imageTag.src = imageTag.src.indexOf('eyeSlash.svg')>-1 ? eyeImage : eyeSlashImage;
    
    var passTextBox = imageTag.parentNode.parentNode.children[0];
    passTextBox.type = imageTag.src.indexOf('eyeSlash.svg')>-1 ? 'password' : 'text';
}

signIn.setPasswordEye = function(){
    //PassEye
    var passEye = Object.values(document.getElementsByClassName('passwordEyeImage'));
    passEye[0].addEventListener('click',function(){
        signIn.togglePassText(passEye[0]);
    });
};

signIn.validateEmail = function(){
    var emailText = (document.getElementById('txtEmail').value).trim();
    var result = false;
    if (emailText.indexOf('@')>-1){
        if((emailText.split('@')[1]).indexOf('.')>-1){
            return true;
        }
    }
    return result;
};

signIn.validateRequired = function(filedId){
    var fieldValue =(document.getElementById(filedId).value).trim();
    if ((fieldValue=='')|| (fieldValue==null) || (fieldValue=='undefined')){
        return false;
    }

    return true;
};

signIn.validateForm = function(callback){
    if (signIn.validateEmail()){
        if (signIn.validateRequired('txtPassword')){
            callback ("valid","valid");
        }else{
            callback('Password Empty!', "Password can not be Empty!")
        }
    }else{
        callback('Email Format', "Please Type-in a Valid Email!")
    }

};

signIn.validateServerResponse = function(data){
    var pageTokenObject = window.localStorage.getItem('aiAppData');
    var aiAppData;
    if (data){
        if (pageTokenObject){
            aiAppData = JSON.parse(pageTokenObject);
        }else{
            aiAppData={};
        }

        aiAppData['session']=data;
        window.localStorage.setItem('aiAppData',JSON.stringify(aiAppData));
        return true;
    }

    return false;
};

signIn.handleSigninProcess = function(){
    signIn.validateForm(function(title, message){
        if (title == 'valid'){
            var userEmail = (document.getElementById('txtEmail').value).trim();
            var userPassword = (document.getElementById('txtPassword').value).trim();

            var formData={
                "email":userEmail,
                "password":userPassword
            };
            
            var base = window.location.origin;
            axios({
                method: "post",
                url: base+"/api/v1/user/userSignin",
                data:formData
            })
            .then(function(res){
                var data  = (typeof(res.data.data)=="undefined")?false:res.data.data;
                if (signIn.validateServerResponse(data)){
                    var base = window.location.origin;
                    window.location.href = base+'/dashboard.html';
                }else{
                    app.showModal('error', 'Something went wrong!',"server Response not Valid!");
                };

            }).catch(function(err){
                if (typeof(err.response)=="undefined"){
                    app.showModal('error','Something went wrong!',"Request timeout!");
                }else{
                    app.showModal('error','Something went wrong!',err.response.data.data);
                }
            });

        }else{
            app.showModal('error',title, message)
        }
    });
};

signIn.setSigninButton = function(){
    //formLinks
    var btnSignin = document.getElementById('btnSignin');
    btnSignin.addEventListener('click',function(){
        signIn.handleSigninProcess();
    });
};

app.init = function(){
    app.setModalCloseButton();
    // app.setTexBoxGroups();
    app.setTexFormLinks();
    signIn.setPasswordEye();
    signIn.setSigninButton();
};


app.init();


