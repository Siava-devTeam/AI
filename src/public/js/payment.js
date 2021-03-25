var payment={};

payment.validatePage = function(){
    
    var aiAppData = window.localStorage.getItem('aiAppData');

    if (aiAppData){
        var aiAppDataObject = JSON.parse(aiAppData);
        if (aiAppDataObject.hasOwnProperty('regToken')){
            return true;
        }
    }
    app.showModal('error','Something went wrong!',`Not a valid page token`);
    return false;
};

payment.validateForm = function(callback){
    callback ("valid","valid");
};

payment.handleUserAddressSubmission = function(){
    payment.validateForm(function(title, message){
        if (title == 'valid'){

            var aiAppData = JSON.parse(window.localStorage.getItem('aiAppData'))
            var token = aiAppData['regToken'];
            
            var base = window.location.origin;
            axios({
                method: "delete",
                url: `${base}/api/v1/user/deleteUserToken?t=${token}`,
                timeout: 1000 * 5,
            })
            .then(function(res){
                app.showModal('success','Congratulations!',`Registration Completed!`);
                window.localStorage.removeItem('aiAppData');
                window.location.href = base+"/signIn.html";
                
            }).catch(function(err){
                if (typeof(err.response)=="undefined"){
                    console.log(err.response);
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

payment.setFormButton = function(){
    var btnContinue = document.getElementById('btnContinue');
    btnContinue.addEventListener('click',function(){
        payment.handleUserAddressSubmission();
    });
};

app.init = function(){
    app.setModalCloseButton();
    if (payment.validatePage()){
        payment.setFormButton();
    }
};

app.init();