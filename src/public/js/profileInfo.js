var profileInfo={};

profileInfo.getToken = function(){
    var address = window.location.href;
    address = (address.indexOf('?')==-1)?false:address;
    address = ((address) && (address.indexOf('=')==-1))?false:address;
    address = ((address) && (address.indexOf('&')>-1))?false:address;
    if (address){
        var temp = address.split('?');
        if((temp.length>1)&&(temp[1].length==22)){
            var tempToken = temp[1].split('=');
            return tempToken[1];   
        }
    }

    return false;
};

profileInfo.validatePage = function(){
    var pageToken = profileInfo.getToken();
    if (pageToken){
        if (window.localStorage.getItem('aiAppData')){
            window.localStorage.removeItem('aiAppData');
        }
        var aiAppData={
            'regToken':pageToken,
        }
        window.localStorage.setItem('aiAppData',JSON.stringify(aiAppData));
        return true;

    }else{
        app.showModal('error','Link Not Valid!',"The link you have used to reach out to this page is not valid!");
    }

    return false;
};

profileInfo.validateForm = function(callback){
    callback ("valid","valid");
};

// profileInfo.handleUserInfoSubmission = function(){
//     //Validate Input
//     //If Valid -> Send for registration
//     //If data added successFully -> go to next page
// };
profileInfo.handleUserInfoSubmission = function(){
    profileInfo.validateForm(function(title, message){
        if (title == 'valid'){
            var userDateOfBirth = '12/08/1983';
            var userLicenceNumber = '123123123';
            var userCompanyName = 'Siava';
            var userPassword = 'SomePass';
            var userPlan = 'Plan1';

            var pageToken = JSON.parse(window.localStorage.getItem('aiAppData'));
            var formData={
                'token': pageToken['regToken'],
                'dateOfBirth':userDateOfBirth,
                'licenceNumber':userLicenceNumber,
                'companyName':userCompanyName,
                'password':userPassword,
                'plan':userPlan,
            };

            var base = window.location.origin;
            axios({
                method: "post",
                url: base+"/api/v1/user/updateUserByToken",
                data:formData
            })
            .then(function(res){
                app.showModal('success','Congrats!','User information updated successfully');
                window.location.href = base+"/profileAddress.html";

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

profileInfo.setInitialFormFields = function(firstName,lastName){
    var fName = document.getElementById('firstName');
    fName.focus();fName.value = firstName;fName.blur();

    var lName = document.getElementById('lastName');
    lName.focus();lName.value = lastName;lName.blur();
};

profileInfo.loadUserInfo = function(){
    var aiAppData = JSON.parse(window.localStorage.getItem('aiAppData'))
    var token = aiAppData['regToken'];

    var base = window.location.origin;
    axios({
        method: "get",
        url: `${base}/api/v1/user/getTokenUser?t=${token}`,
        timeout: 1000 * 5, // Wait for 5 seconds
    })
    .then(function(res){
        var userData = res.data.data;
        // aiAppData['email'] = userData.email;
        // window.localStorage.setItem('aiAppData',JSON.stringify(aiAppData));
        profileInfo.setInitialFormFields(userData.firstName,userData.lastName);
        
    }).catch(function(err){
        if (typeof(err.response)=="undefined"){
            console.log(err.response);
            app.showModal('error','Something went wrong!',"Request timeout!");
        }else{
            app.showModal('error','Something went wrong!',err.response.data.data);
        }
    });
};

profileInfo.setFormButton = function(){
    var btnContinue = document.getElementById('btnContinue');
    btnContinue.addEventListener('click',function(){
        profileInfo.handleUserInfoSubmission();
    });
};

app.init = function(){
    app.setModalCloseButton();
    app.setTexBoxGroups();
    if (profileInfo.validatePage()){
        profileInfo.setFormButton();
        profileInfo.loadUserInfo();
    }
};


app.init();