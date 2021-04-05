var confirmationPage={};

confirmationPage.getToken = function(){
    var address = window.location.href;
    address = (address.indexOf('?')==-1)?false:address;
    address = ((address) && (address.indexOf('=')==-1))?false:address;
    address = ((address) && (address.indexOf('&')>-1))?false:address;

    if (address){
        var temp = address.split('?');

        if((temp.length>1)&&(temp[1].length>2)){
            var tempToken = temp[1].split('=');

            return tempToken[1];   
        }
    }

    return false;
};

confirmationPage.setPageElements = function(elements){
    var pageTitle = document.getElementById('pageTitle');
    var pageMessage = document.getElementById('pageMessage');
    var pageButton = document.getElementById('pageButton');

    pageTitle.innerText = elements['title'];
    pageMessage.innerText = elements['message'];
    pageButton.innerText = elements['buttonLabel'];
    pageButton.addEventListener('click', function(){
        window.location.href = elements.buttonLink;
    });
};

confirmationPage.setPage = function(token){
    var base = window.location.origin;
    
    if (token=="signupConfirmation"){
        confirmationPage.setPageElements({
            "buttonLabel":"Main Page",
            "buttonLink":base+"/index.html",
            "title":"Congratulations!",
            "message":"User Registered successfully.We have sent you an Email. Please confirm your email and continue the registration process.",

        });
    }else if (token=="registrationComplete"){
        confirmationPage.setPageElements({
            "buttonLabel":"Sign In",
            "buttonLink":base+"/signin.html",
            "title":"Congratulations!",
            "message":"Registration Completed. You can Sign in now.",

        });
    }
};

app.init = function(){
    app.setModalCloseButton();
    var pageToken = confirmationPage.getToken();
    if(pageToken){
        confirmationPage.setPage(pageToken);
    }else{
        var base = window.location.origin;
        window.location.href = base+"/signin.html";
    }
};

app.init();