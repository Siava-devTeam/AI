var profileAddress={};

profileAddress.validatePage = function(){
    
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

profileAddress.validateRequired = function(filedId){
    var fieldValue =(document.getElementById(filedId).value).trim();
    if ((fieldValue=='')|| (fieldValue==null) || (fieldValue=='undefined')){
        return false;
    }

    return true;
};
profileAddress.validateForm = function(callback){
    if (profileAddress.validateRequired('txtCity')){
        if (profileAddress.validateRequired('selCountry')){
            if (profileAddress.validateRequired('txtAddress1')){
                if (profileAddress.validateRequired('txtZip')){
                    callback ("valid","valid");
                }else{
                    callback('Zip code empty', "Please type-in your zip code!");
                }
            }else{
                callback('Address Empty', "Please type-in your address!");
            }
        }else{
            callback('Country Empty', "Please Choose a country!");
        }
    }else{
        callback('City Empty', "Please type-in your city!");
    }

};

profileAddress.handleUserAddressSubmission = function(){
    profileAddress.validateForm(function(title, message){
        if (title == 'valid'){
            var userCity = document.getElementById('txtCity').value.trim();
            var userCountry = document.getElementById('selCountry').value.trim();
            var userState =  document.getElementById('selState').value.trim();
            var userAddress1 =  document.getElementById('txtAddress1').value.trim();
            var userAddress2 =  document.getElementById('txtAddress2').value.trim();
            var userZipCode =  document.getElementById('txtZip').value.trim();

            var pageToken = JSON.parse(window.localStorage.getItem('aiAppData'));
            var formData={
                'type':'homeAddress',
                'token': pageToken['regToken'],
                'city':userCity,
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
                window.location.href = base+"/profileBillingAddress.html";

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


profileAddress.setFormButton = function(){
    var btnContinue = document.getElementById('btnContinue');
    btnContinue.addEventListener('click',function(){
        profileAddress.handleUserAddressSubmission();
    });
};

profileAddress.setRegionCountryState = function(){
    // var regionSelect = document.getElementById('selRegion');
    // regionSelect.addEventListener('change',function(){
    //     set_country();
    // });
    var countrySelect  = document.getElementById('selCountry');
    countrySelect.addEventListener('change',function(){
        set_city_state();
    });
};

app.init = function(){
    app.setModalCloseButton();
    profileAddress.setRegionCountryState();
    if (profileAddress.validatePage()){
        setAllCountries();
        profileAddress.setFormButton();
    }else{
        var base = window.location.origin;
        window.location.href = base+"/signin.html";
    }
};


app.init();