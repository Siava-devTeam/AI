var signIn = {};

signIn.togglePassText = function(imageTag){
    var eyeImage='images/eye.svg';
    var eyeSlashImage='images/eyeSlash.svg';
    imageTag.src = imageTag.src.indexOf('eyeSlash.svg')>-1 ? eyeImage : eyeSlashImage;
    
    var passTextBox = imageTag.parentNode.parentNode.children[1];
    passTextBox.type = imageTag.src.indexOf('eyeSlash.svg')>-1 ? 'password' : 'text';
}

signIn.setPasswordEye = function(){
    //PassEye
    var passEye = Object.values(document.getElementsByClassName('passwordEyeImage'));
    passEye[0].addEventListener('click',function(){
        signIn.togglePassText(passEye[0]);
    });
};

app.init = function(){
    app.setModalCloseButton();
    app.setTexBoxGroups();
    app.setTexFormLinks();
    signIn.setPasswordEye();
};


app.init();


