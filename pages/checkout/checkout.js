
const sendOrderBtn = document.getElementById('send-order-btn')

sendOrderBtn.addEventListener('click',() => {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let phoneNumber = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    let zipCode = document.getElementById('zip').value;
    let city = document.getElementById('city').value;
    
    if(testForEmail(email)){
        console.log(email + ' true');
    }else{
        console.log(email + ' false');
    }
});