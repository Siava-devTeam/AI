var profileBillingAddress={};

profileBillingAddress.validatePage = function(){
    
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

profileBillingAddress.validateForm = function(callback){
    callback ("valid","valid");
};
profileBillingAddress.validateRequired = function(filedId){
    var fieldValue =(document.getElementById(filedId).value).trim();
    if ((fieldValue=='')|| (fieldValue==null) || (fieldValue=='undefined')){
        return false;
    }

    return true;
};
profileBillingAddress.validateForm = function(callback){
    if (profileAddress.validateRequired(txtCountry)){
        if (profileAddress.validateRequired(txtStreetNumber)){
            if (profileAddress.validateRequired(txtStreetName)){
                if (profileAddress.validateRequired(txtProvince)){
                    if (profileAddress.validateRequired(txtZip)){
                        //SUBMIT FORM
                        callback ("valid","valid");

                    }else{
                        callback('Zip Code Field', "Zip Code cannot be empty!")
                    }
                }else{
                    callback('Province Field', "Province cannot be empty!");
                }
            }else{
                callback('Street Name Field', "Street Number  cannot be empty!")
            }
        }else{
            callback('Street Number Field', "Street Number  cannot be empty!")
        }
    }else{
        callback('Country Field', "Country cannot be empty!")
    }

};
profileBillingAddress.handleUserAddressSubmission = function(){
    profileBillingAddress.validateForm(function(title, message){
        if (title == 'valid'){
            var userCountry = document.getElementById(txtCountry).value;
            var userStreetNumber = document.getElementById(txtStreetNumber).value;
            var userStreetName =  document.getElementById(txtStreetName).value;
            var userUnit =  document.getElementById(txtUnit).value;
            var userProvince =  document.getElementById(txtProvince).value;
            var userZipCode =  document.getElementById(txtZip).value;

            var pageToken = JSON.parse(window.localStorage.getItem('aiAppData'));
            var formData={
                'type':'billingAddress',
                'token': pageToken['regToken'],
                'country':userCountry,
                'streetNumber':userStreetNumber,
                'streetName':userStreetName,
                'unit':userUnit,
                'province':userProvince,
                'zipCode':userZipCode,
            };

            var base = window.location.origin;
            axios({
                method: "post",
                url: base+"/api/v1/user/updateUserAddressByToken",
                data:formData
            })
            .then(function(res){
                app.showModal('success','Congrats!','User information updated successfully');
                window.location.href = base+"/payment.html";

            }).catch(function(err){
                if (typeof(err.response)=="undefined"){
                    app.showModal('error','Something went wrong!',"Request timeout!");
                }else{
                    console.log(err.response);
                    app.showModal('error','Something went wrong!',err.response.data.data);
                }
            });

        }else{
            app.showModal('error',title, message)
        }
    });
};

profileBillingAddress.setFormButton = function(){
    var btnContinue = document.getElementById('btnContinue');
    btnContinue.addEventListener('click',function(){
        profileBillingAddress.handleUserAddressSubmission();
    });
};

profileBillingAddress.setTextField = function(fieldId,fieldValue){
    var field = document.getElementById(fieldId);
    field.focus();
    field.value = fieldValue;
    field.blur();
};
profileBillingAddress.setInitialFormFields = function(data){

    profileBillingAddress.setTextField('txtCountry',data.country);
    profileBillingAddress.setTextField('txtProvince',data.province);
    profileBillingAddress.setTextField('txtStreetName',data.streetName);
    profileBillingAddress.setTextField('txtStreetNumber',data.streetNumber);
    profileBillingAddress.setTextField('txtUnit',data.unit);
    profileBillingAddress.setTextField('txtZip',data.zipCode);
    
};

profileBillingAddress.loadUserInfo = function(){
    var aiAppData = JSON.parse(window.localStorage.getItem('aiAppData'))
    var token = aiAppData['regToken'];
    
    var base = window.location.origin;
    axios({
        method: "get",
        url: `${base}/api/v1/user/getAddressByToken?t=${token}`,
        timeout: 1000 * 5, // Wait for 5 seconds
    })
    .then(function(res){
        var userData = res.data.data;
        // aiAppData['email'] = userData.email;
        // window.localStorage.setItem('aiAppData',JSON.stringify(aiAppData));
        profileBillingAddress.setInitialFormFields(userData);
        console.log(userData);
        
    }).catch(function(err){
        if (typeof(err.response)=="undefined"){
            console.log(err.response);
            app.showModal('error','Something went wrong!',"Request timeout!");
        }else{
            app.showModal('error','Something went wrong!',err.response.data.data);
        }
    });
};

app.init = function(){
    app.setModalCloseButton();
    app.setTexBoxGroups();
    if (profileBillingAddress.validatePage()){
        profileBillingAddress.setFormButton();
        profileBillingAddress.loadUserInfo();
    }
};


app.init();