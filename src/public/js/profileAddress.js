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

profileAddress.validateForm = function(callback){
    callback ("valid","valid");
};

// profileAddress.handleUserAddressSubmission = function(){
//     //Validate Input
//     //If Valid -> Send for update profile
//     //If data added successFully -> go to next page
// };

profileAddress.handleUserAddressSubmission = function(){
    profileAddress.validateForm(function(title, message){
        if (title == 'valid'){
            var userCountry = 'Canada';
            var userStreetNumber = '1770';
            var userStreetName = 'Rue Joseph-Manseau';
            var userUnit = '222';
            var userProvince = 'QC';
            var userZipCode = 'H3H 0A1';

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