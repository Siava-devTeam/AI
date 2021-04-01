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

profileBillingAddress.validateRequired = function(filedId){
    var fieldValue =(document.getElementById(filedId).value).trim();
    if ((fieldValue=='')|| (fieldValue==null) || (fieldValue=='undefined')){
        return false;
    }

    return true;
};

profileBillingAddress.validateForm = function(callback){
    if (profileBillingAddress.validateRequired('selRegion')){
        if (profileBillingAddress.validateRequired('selCountry')){
            if (profileBillingAddress.validateRequired('txtAddress1')){
                if (profileBillingAddress.validateRequired('txtZip')){
                    callback ("valid","valid");
                }else{
                    callback('Zip code empty', "Please type-in your zip code!");
                }
            }else{
                callback('Address Empty', "Please type-in your address!")
            }
        }else{
            callback('Country Empty', "Please Choose a country!")
        }
    }else{
        callback('Region Empty', "Please Choose your region!")
    }

};

profileBillingAddress.handleUserAddressSubmission = function(){
    profileBillingAddress.validateForm(function(title, message){
        if (title == 'valid'){
            var userRegion = document.getElementById('selRegion').value.trim();
            var userCountry = document.getElementById('selCountry').value.trim();
            var userState =  document.getElementById('selState').value.trim();
            var userAddress1 =  document.getElementById('txtAddress1').value.trim();
            var userAddress2 =  document.getElementById('txtAddress2').value.trim();
            var userZipCode =  document.getElementById('txtZip').value.trim();

            var pageToken = JSON.parse(window.localStorage.getItem('aiAppData'));
            var formData={
                'type':'billingAddress',
                'token': pageToken['regToken'],
                'region':userRegion,
                'country':userCountry,
                'state':userState,
                'address1':userAddress1,
                'address2':userAddress2,
                'zipCode':userZipCode,
            };

            var base = window.location.origin;
            axios({
                method: "put",
                url: base+"/api/v1/user/updateUserAddressByToken",
                data:formData
            })
            .then(function(res){
                // app.showModal('success','Congrats!','User information updated successfully');
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
    field.value = fieldValue;
};
profileBillingAddress.setInitialFormFields = function(data){

    profileBillingAddress.setTextField('selRegion',data.region);
    var regionField = document.getElementById('selRegion');
    set_country();

    profileBillingAddress.setTextField('selCountry',data.country);
    var countryField = document.getElementById('selCountry');
    set_city_state();

    profileBillingAddress.setTextField('selState',data.state);
    profileBillingAddress.setTextField('txtAddress1',data.address1);
    profileBillingAddress.setTextField('txtAddress2',data.address2);
    profileBillingAddress.setTextField('txtZip',data.zipCode);
    
};


profileBillingAddress.loadUserInfo = async function(){
    var aiAppData = JSON.parse(window.localStorage.getItem('aiAppData'))
    var token = aiAppData['regToken'];
    
    var base = window.location.origin;
    await axios({
        method: "get",
        url: `${base}/api/v1/user/getAddressByToken?t=${token}`,
        timeout: 1000 * 5, // Wait for 5 seconds
    })
    .then(async function(res){
        var userData = res.data.data;
        // aiAppData['email'] = userData.email;
        // window.localStorage.setItem('aiAppData',JSON.stringify(aiAppData));
        await profileBillingAddress.setInitialFormFields(userData);
        
    }).catch(function(err){
        console.log(err.response);
        if (typeof(err.response)=="undefined"){
            app.showModal('error','Something went wrong!',"Request timeout!");
        }else{
            app.showModal('error','Something went wrong!',err.response.data.data);
        }
    });
};

profileBillingAddress.handleCheckbox = async function(){
    var frmCheckBox = document.getElementById('addressCheck');
    if (frmCheckBox.checked){
        await profileBillingAddress.loadUserInfo();
    }
};

profileBillingAddress.setCheckBox = function(){
    var frmCheckBox = document.getElementById('addressCheck');
    frmCheckBox.addEventListener('change',function(){
        profileBillingAddress.handleCheckbox();
    });
}

profileBillingAddress.setRegionCountryState = function(){
    var regionSelect = document.getElementById('selRegion');
    regionSelect.addEventListener('change',function(){
        set_country();
    });
    var countrySelect  = document.getElementById('selCountry');
    countrySelect.addEventListener('change',function(){
        set_city_state();
    });
};

app.init = function(){
    app.setModalCloseButton();
    profileBillingAddress.setRegionCountryState();
    if (profileBillingAddress.validatePage()){
        profileBillingAddress.setFormButton();
        profileBillingAddress.setCheckBox();
    }else{
        var base = window.location.origin;
        window.location.href = base+"/signin.html";
    }
};


app.init();