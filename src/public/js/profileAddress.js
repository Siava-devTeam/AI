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
    if (profileAddress.validateRequired('txtCountry')){
        if (profileAddress.validateRequired('txtStreetNumber')){
            if (profileAddress.validateRequired('txtStreetName')){
                if (profileAddress.validateRequired('txtProvince')){
                    if (profileAddress.validateRequired('txtZip')){
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

profileAddress.handleUserAddressSubmission = function(){
    profileAddress.validateForm(function(title, message){
        if (title == 'valid'){
            var userCountry = document.getElementById('txtCountry').value.trim();
            var userStreetNumber = document.getElementById('txtStreetNumber').value.trim();
            var userStreetName =  document.getElementById('txtStreetName').value.trim();
            var userUnit =  document.getElementById('txtUnit').value.trim();
            var userProvince =  document.getElementById('txtProvince').value.trim();
            var userZipCode =  document.getElementById('txtZip').value.trim();

            var pageToken = JSON.parse(window.localStorage.getItem('aiAppData'));
            var formData={
                'type':'homeAddress',
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

app.init = function(){
    app.setModalCloseButton();
    app.setTexBoxGroups();
    if (profileAddress.validatePage()){
        profileAddress.setFormButton();
    }
};


app.init();