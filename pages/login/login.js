let persons = [];
let password = $('#login-password');
let email =$('#login-email');
let loginButton1 = $('#login-btn');
let loginbutton2 = $('#login-button');
let wrongEmail = $('#wrong-email')
let wrongPassword = $('#wrong-password')
let personsFile = "../../TestData/testdata_persons.json";
let loginModal = $('#login-modal');
let whichPage = $("#login-page");

email.on('focus', function() {
    wrongEmail.html('');
})

password.on('focus', function() {
    wrongPassword.html('');
})

$("#show-password-button").on("click", showHidePassword);

loginbutton2.on("click",checkUsernameAndPassword);

$.getJSON(personsFile, function(response) {
    console.log(response);
    persons = response;
})


function showHidePassword(){
    if($(this).text()=="Visa"){
        $(this).text("Dölj")
        password.attr("type", "text");
    }
    else{
        $(this).text("Visa")
        password.attr("type", "password");   
    }
}

function checkUsernameAndPassword(){
    let isCustomer= findUser(email.val());
    if(isCustomer){
        let isCorrectPassword = findPassword(password.val());
        if(isCorrectPassword){
            loginbutton2.modal("hide");
            let customer = JSON.parse(sessionStorage.getItem("customer"))
            console.log(customer)
            if(customer.admin=="false"){
                if(customer.vip == "false"){
                    console.log("Du är inloggad som vanlig kund")
                }
                else{
                    console.log("Du är inloggad som VIP kund")
                }
            }
            else{
                console.log("Du är inloggad som admin")
                whichPage.load( "../../admin/index.html")
            }
            //loginbutton2.attr("data-dismiss", "modal");
        }
        else {
            wrongPassword.html("Fel lösenord")
        }
    }
    else{
        wrongEmail.html("Den email-adressen finns inte registrerad");
    }
    
}

function findUser(input){
    let isTrue = false;
    persons.forEach(e => {
        if(e.email== input){
            sessionStorage.setItem("customer", JSON.stringify(e));
            isTrue = true;
        }
    });
    return isTrue;
}

function findPassword(password){
    console.log(password);
    let customer = JSON.parse(sessionStorage.getItem("customer"))
    let isTrue = false;
    if(customer.password==password){
        isTrue = true;
    }
    return isTrue;
}
$("#newCust-button").on("click",function(){
    $("#registerForm").modal("show");
})
