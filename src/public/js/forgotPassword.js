var forgotPassword={};

forgotPassword.validateEmail = function(){
    var emailText = document.getElementById('txtEmail').value.trim();
    var result = false;
    if (emailText.indexOf('@')>-1){
        if((emailText.split('@')[1]).indexOf('.')>-1){
            return true;
        }
    }
    return result;
};

forgotPassword.validateRequired = function(filedId){
    var fieldValue =(document.getElementById(filedId).value).trim();
    if ((fieldValue=='')|| (fieldValue==null) || (fieldValue=='undefined')){
        return false;
    }

    return true;
};

forgotPassword.validateForm = function(callback){
    if (forgotPassword.validateRequired('txtEmail')){
        if (forgotPassword.validateEmail()){
            callback ("valid","valid");
        }else{
            callback('Email Format', "Please Type-in a Valid Email!");
        }
    }else{
        callback('Email Empty!', "Email can not be Empty!");
    }

};

forgotPassword.handleResetProcess = function(){
    forgotPassword.validateForm(function(title, message){
        if (title == 'valid'){
            // alert('inProcess!')
            var email = document.getElementById('txtEmail').value.trim();
            var formData={
                "email":email
            };

            var base = window.location.origin;
            axios({
                method: "post",
                url: base+"/api/v1/user/forgotPassword",
                data:formData
            })
            .then(function(res){
                // console.log("Success");
                app.showModal('success','Done!',res.data.data);
            })
            .catch(function(err){
                if (typeof(err.response)=="undefined"){
                    app.showModal('error','Something went wrong!',"Request timeout!");
                }else{
                    // console.log(err.response);
                    app.showModal('error','Something went wrong!',err.response.data.data);
                }
            })


        }else{
            app.showModal('error',title, message)
        }
    });
};

forgotPassword.setResetButton = function(){
    var btnReset = document.getElementById('btnReset');
    btnReset.addEventListener('click',function(){
        forgotPassword.handleResetProcess();
    });
};

app.init = function(){
    app.setModalCloseButton();
    forgotPassword.setResetButton();
};

app.init();