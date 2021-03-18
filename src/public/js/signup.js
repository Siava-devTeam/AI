var signup={};

signup.validatePhone = function(){
    var phoneValue =(document.getElementById('phone').value).trim();
    if ((phoneValue=='')|| (phoneValue==null) || (phoneValue=='undefined')){
        return false;
    }else{
        if (isNaN(phoneValue)){
            return false;
        }
    }

    return true;
};
signup.validateTermsOfPolicy = function(){
    return document.getElementById('checkBoxPolicy').checked;
};
signup.validateEmail = function(){
    var emailText = document.getElementById('txtEmail').value;
    var result = false;
    if (emailText.indexOf('@')>-1){
        if((emailText.split('@')[1]).indexOf('.')>-1){
            return true;
        }
    }
    return result;
};
signup.validateForm = function(){
    if (signup.validateEmail()){
        if (signup.validatePhone()){
            if (signup.validateTermsOfPolicy()){
                //SUBMIT FORM ----------------
                app.showModal('success','FORM', "SUBMIT FORM")
            }else{
                app.showModal('error','Policy Agreement', "Please agree to our terms of policy!")
            }
        }else{
            app.showModal('error','Phone Format', "Please Type-in a Valid Phone Number!");
        }
    }else{
        app.showModal('error','Email Format', "Please Type-in a Valid Email!")
    }
};

signup.setSignupButton = function(){
    //formLinks
    var btnSignup = document.getElementById('signup');
    btnSignup.addEventListener('click',function(){
        signup.validateForm();
    });;
};

app.init = function(){

    signup.setSignupButton();
    app.setModalCloseButton();
    app.setTexBoxGroups();
    app.setTexFormLinks();

    var phoneField = document.getElementById("phone");
    var iti = window.intlTelInput(phoneField, {
        utilsScript: "js/utils.js?1613236686837"
    });
};


app.init();
