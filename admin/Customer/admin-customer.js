let customers = [];
let choosedCustomer = "";
let customerFile = "../../TestData/testdata_persons.json";


$.getJSON(customerFile, function(response) {
    console.log(response);
    customers = response;
    showCustomers();
})

function showCustomers(){
    customers.forEach(e => {
        let isVip = "";
        if(e.vip=="true"){
            console.log("ÄR VIP")
            isVip = "bi-check2"
        }
        else{
            isVip = "bi-x"
        }
        $("#customerTable").append(`
        <tr>
        <th scope="row"><a href="#nav-contact" class="customer-tab">${e.id}</a></th>
        <td>${e.first_name}</td>
        <td>${e.last_name}</td>
        <td>${e.social_security_number}</td>
        <td>${e.email}</td>
        <td>x</td>
        <td>x kr</td>
        <td><i class="bi ${isVip}"></i></td>
        </tr>
        `
        )})
}

$(document).on('click', '.customer-tab', openCustomerTab);

function openCustomerTab(){
    saveCustomer($(this).text());
    $("#nav-contact-tab").tab('show');
    };

function saveCustomer(id){
    customers.forEach(e => {
        if(e.id==id){
            sessionStorage.setItem("choosedCustomer", JSON.stringify(e));
            $("#customer-first-name").val(e.first_name)
            $("#customer-last-name").val(e.last_name)
            $("#customer-email").val( e.email)
            $("#customer-phone").val(e.phone_number)
            $("#customer-street").val(e.adress)
            $("#customer-city").val(e.city.name)
            $("#customer-zip").val(e.city.zipcode)
        }
    })
}
    