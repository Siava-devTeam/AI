var iti;
var signup={};

signup.validateFirstName = function(){
    var firstNameValue =(document.getElementById('txtFirstName').value).trim();
    if ((firstNameValue=='')|| (firstNameValue==null) || (firstNameValue=='undefined')){
        return false;
    }

    return true;
};
signup.validateLastName = function(){
    var lastNameValue =(document.getElementById('txtLastName').value).trim();
    if ((lastNameValue=='')|| (lastNameValue==null) || (lastNameValue=='undefined')){
        return false;
    }

    return true;
};

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
signup.validateForm = function(callback){
    if (signup.validateFirstName()){
        if (signup.validateLastName()){
            if (signup.validateEmail()){
                if (signup.validatePhone()){
                    if (signup.validateTermsOfPolicy()){
                        //SUBMIT FORM
                        callback ("valid","valid");

                    }else{
                        callback('Policy Agreement', "Please agree to our terms of policy!")
                    }
                }else{
                    callback('Phone Format', "Please Type-in a Valid Phone Number!");
                }
            }else{
                callback('Email Format', "Please Type-in a Valid Email!")
            }
        }else{
            callback('Lastname Format', "Lastname cannot be empty!")
        }
    }else{
        callback('Firstname Format', "Firstname cannot be empty!")
    }

};

signup.handleRegistration = function(){
    signup.validateForm(function(title, message){
        if (title == 'valid'){
            var firstName = document.getElementById('txtFirstName').value;
            var lastName = document.getElementById('txtLastName').value;
            var email = document.getElementById('txtEmail').value;
            var phone = document.getElementById('phone').value;
            var prefix = iti.getSelectedCountryData().dialCode;

            var formData={
                "firstName":firstName,
                "lastName":lastName,
                "email":email,
                "phone":`${prefix}-${phone}`
            };

            var base = window.location.origin;
            axios({
                method: "post",
                url: base+"/api/v1/user/initReg",
                data:formData
            })
            .then(function(res){
                app.showModal('success','Congrats!','User Registered successfully.'+ 
                'We have sent you an Email. Please confirm your email and continue the registration process.');

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

signup.setSignupButton = function(){
    //formLinks
    var btnSignup = document.getElementById('signup');
    btnSignup.addEventListener('click',function(){
        signup.handleRegistration();
    });
};

app.init = function(){

    signup.setSignupButton();
    app.setModalCloseButton();
    // app.setTexBoxGroups();
    app.setTexFormLinks();

    var phoneField = document.getElementById("phone");
    iti = window.intlTelInput(phoneField, {
        utilsScript: "js/utils.js?1613236686837"
    });
};


app.init();
