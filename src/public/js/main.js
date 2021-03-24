const app={};
app.globals={
    lang:'EN',
    user:{},
    termsPfPolicy:'https://siava.ca/term-and-condition',
};

app.gotoPage = function (page){
    var base = window.location.origin;
    window.location.href=`${base}/${page}.html`;
};

app.gotoWebsite = function (page){
    window.location.href=page;
};

app.disappear = function(div){
    if (div.value.length==0){
        div.parentNode.children[0].classList.toggle("disappear");
    }
};
//NOT COMPLETE YET
app.showModal = function(type,title,message){
    document.getElementsByClassName('modalWrapper')[0].style.display='flex';
    document.getElementsByClassName('appWrapper')[0].style.opacity='0%';
    var checkImage = "url('../images/check.svg')"
    var errorImage = "url('../images/error.svg')";
    var modalImage = document.getElementsByClassName('messageImage')[0];
    var modalTitle = document.getElementsByClassName('messageTitle')[0];
    var modalMessage = document.getElementsByClassName('messageText')[0];
    var modalButton = document.getElementsByClassName('modalButton')[0];
    modalImage.style.backgroundImage = (type == 'error') ? errorImage : checkImage;
    modalImage.style.borderColor = (type == 'error') ? "#DC2626" : "#059669";
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modalButton.style.backgroundColor = (type == 'error') ? "#DC2626" : "#059669";
    modalButton.style.borderColor = (type == 'error') ? "#DC2626" : "#059669";
};

app.closeModal = function(){
    document.getElementsByClassName('modalWrapper')[0].style.display='none';
    document.getElementsByClassName('appWrapper')[0].style.opacity='100%';
};

app.setModalCloseButton = function(){
    document.getElementsByClassName('modalButton')[0].addEventListener('click',function(){
        app.closeModal();
    });
};

app.setTexBoxGroups = function(){
    //TextBox Group
    var textBoxGroups = Object.values(document.getElementsByClassName('formTextGroup'));
    textBoxGroups.map(function(element,index){
        
        if (element.children[1].getAttribute('name')!='phone'){
            
            element.children[1].addEventListener('focus',function(){
                app.disappear(element.children[1]);
            });

            element.children[1].addEventListener('blur',function(){
                app.disappear(element.children[1]);
            });
        }

    });
};

app.setTexFormLinks = function(){
    //formLinks
    var formLinks = Object.values(document.getElementsByClassName('formLink'));
    formLinks.map(function(element,index){
        element.addEventListener('click',function(){
            var destination = element.getAttribute('destination');
            if (destination!='termsOfPolicy'){
                app.gotoPage(destination);
            }else if(destination=='termsOfPolicy'){
                app.gotoWebsite(app.globals.termsPfPolicy);
            }
        });
    });
}