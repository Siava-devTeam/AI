dashboard={};
dashboard.sessionValid = false;

dashboard.logoutUser = function(){

};

dashboard.sessionExist = function(){
    var aiAppData = window.localStorage.getItem('aiAppData');

    if (aiAppData){
        var aiAppDataObject = JSON.parse(aiAppData);
        if (aiAppDataObject.hasOwnProperty('session')){
            // console.log()
            return true;
        }
    }

    return false;
};

dashboard.setProfileName = function(){
    var aiAppData = window.localStorage.getItem('aiAppData');
    if(aiAppData){
        var data = JSON.parse(aiAppData);
        var profileName = `${data.firstName} ${data.lastName}`;
        document.getElementById('profileName').innerText = profileName;
    }
};

dashboard.validateSession =async function(){
    if (dashboard.sessionExist()){
        var aiAppData = window.localStorage.getItem('aiAppData');
        var aiAppDataObject = JSON.parse(aiAppData);
        var session = aiAppDataObject['session'];

        var base = window.location.origin;
        await axios({
            method: "get",
            url: base+"/api/v1/user/checkSession",
            headers:{"authorization":session}
        })
        .then(function(res){
            // console.log(res.data.data);
            // app.showModal('success', 'DONE!',"server Response not Valid!");
            // var data  = (typeof(res.data.data)=="undefined")?false:res.data.data;
            // if (signIn.validateServerResponse(data)){
            //     var base = window.location.origin;
            //     window.location.href = base+'/dashboard.html';
            // }else{
            //     app.showModal('error', 'Something went wrong!',"server Response not Valid!");
            // };

            dashboard.sessionValid=true;
            aiAppDataObject['firstName'] = res.data.data.firstName;
            aiAppDataObject['lastName'] = res.data.data.lastName;
            window.localStorage.setItem('aiAppData',JSON.stringify(aiAppDataObject));
        }).catch(function(err){
            // if (typeof(err.response)=="undefined"){
            //     app.showModal('error','Something went wrong!',"Request timeout!");
            // }else{
            //     app.showModal('error','Something went wrong!',err.response.data.data);
            // }

            dashboard.sessionValid= false;
        });

    }

    // app.showModal('error','Something went wrong!',`Not a valid page session`);
    // return false;
};


dashboard.setLogoutButton = function(){
    var btnLogout = document.getElementById('lnkLogout');
    btnLogout.addEventListener('click',function(){
        dashboard.showModal2("Logging out!","Are you sure you want to leave the application?");
        var modal2BtnConfirm = document.getElementById("modal2Confirm");
        modal2BtnConfirm.addEventListener('click',function(){
            var aiAppData = window.localStorage.getItem('aiAppData');
            if (aiAppData){
                var data = JSON.parse(window.localStorage.getItem('aiAppData'));
                delete data.session;
                window.localStorage.setItem('aiAppData',JSON.stringify(data));
            }

            var base = window.location.origin;
            window.location.href = base+"/signin.html";
        });
        
    });
};

dashboard.showModal2 = function(title,message){
    document.getElementsByClassName('modalWrapper')[0].style.display='none';
    document.getElementsByClassName('modalWrapper2')[0].style.display='flex';
    document.getElementsByClassName('appWrapper')[0].style.opacity='0%';
    document.getElementById("modal2Title").innerText = title;
    document.getElementById("modal2Text").innerText = message;
};

dashboard.setModal2CloseButton = function(){
    var modal2BtnCancel = document.getElementById("modal2Cancel");
    modal2BtnCancel.addEventListener('click',function(){
        document.getElementsByClassName('modalWrapper')[0].style.display='none';
        document.getElementsByClassName('modalWrapper2')[0].style.display='none';
        document.getElementsByClassName('appWrapper')[0].style.opacity='100%';
    });
};

app.init = async function(){
    app.setModalCloseButton();
    dashboard.setModal2CloseButton();
    // console.log(dashboard.validateSession())
    await dashboard.validateSession();

    if (dashboard.sessionValid){
        dashboard.setLogoutButton();
        dashboard.setProfileName();

    }else{
        var base = window.location.origin;
        window.location.href = base+"/signin.html";
    };
};


app.init();

