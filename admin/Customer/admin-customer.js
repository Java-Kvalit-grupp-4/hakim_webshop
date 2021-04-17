let customers = [];
let orders = [];
let choosedCustomer = "";
let getAllCustomers = "http://localhost:8080/users";
let updateUser = "http://localhost:8080/users/updateUser2";

let startDate = null;
let endDate = null;
let sendTo = "localhost:8080/customers/add"

$(document).ready(load)

$(document).on('click', '.customer-tab', openCustomerTab);

$(document).on('click', '#search-btn', filterSearch);

$(document).on('click', '#updateBtn', updateCustomer);

$(document).on('focus', '#search-select', function(){
    $("#input").val("");
})

$(document).on('click', '#nav-profile-tab', function(){
    $("#orderTable").empty();
    $("#customer-first-name").val("")
    $("#customer-last-name").val("")
    $("#customer-email").val("")
    $("#customer-phone").val("")
    $("#customer-street").val("")
    $("#customer-city").val("")
    $("#customer-zip").val("")
    load();
})

function load(){
    $("#reservation").daterangepicker(null, function (start, end, label) {
        startDate = new Date(start.toISOString())
        endDate = new Date(end.toISOString())
    })
    axios.get(getAllCustomers)
        .then((response) =>{
            console.log(response.data)
            if(response.status ===200){
                showCustomers(response.data) 
                customers = response.data   
            }
            else{
                swal("Något gick fel vid uppladdning av kunder")
            }
        })
        .catch(err =>{
            alert("Server fel!" + err)
        })
}

function showCustomers(customerArr){
    $("#customerTable").empty();
    if(customerArr.length==0){
        swal("Hittade inga kunder på denna sökning")
    }
    customerArr.forEach(e => {
        let isVip = "";
        if(e.isVip=== true){
            console.log("ÄR VIP")
            isVip = "bi-check2"
        }
        else{
            isVip = "bi-x"
        }
        let personalNumber = e.socialSecurityNumber;
        let firstNr = personalNumber.substring(0,6);
        let lastNr = personalNumber.substring(6);
        let customerOrders = e.customerOrders;
        let totalPrice = getTotalPriceOfOrders(customerOrders);

        //<td>${e.customerOrders.length}</td>   Kod för antalet ordrar
        //<td>${getTotalPriceOfOrders(customerOrders).toFixed(2)} kr</td>   Kod för totala summan av alla ordrar
    
        $("#customerTable").append(`
            <tr>
                <th scope="row"><a href="#" class="customer-tab">${e.customerNumber}</a></th>
                <td>${e.firstName}</td>
                <td>${e.lastName}</td>
                <td>${firstNr}-${lastNr}</td>
                <td><a href="mailto:${e.email}">${e.email}</a></td>
                <td>${customerOrders.length}</td>
                <td>${totalPrice.toFixed(2)} kr</td>
                <td><i class="bi ${isVip}"></i></td>
            </tr>
            `
        )})
}

function openCustomerTab(){
    $("#orderTable").empty();
    saveCustomer($(this).text());
    $("#nav-contact-tab").tab('show');
    };

function saveCustomer(customerNumber){
    customers.forEach(customer => {
        console.log("Telefon " + customer.phoneNumber)
        console.log("postadress " + customer.zipCode)
        
        if(customer.customerNumber==customerNumber){
            
            let phoneNumber = `${customer.phoneNumber.substring(0,3)}-${customer.phoneNumber.substring(3,6)} ${customer.phoneNumber.substring(6,8)} ${customer.phoneNumber.substring(8)}`
            sessionStorage.setItem("choosedCustomer", JSON.stringify(customer));
            let zipCode = `${customer.zipCode.substring(0,3)} ${customer.zipCode.substring(3)}`
            
            $("#customer-first-name").val(customer.firstName)
            $("#customer-last-name").val(customer.lastName)
            $("#customer-email").val( customer.email)
            $("#customer-phone").val(phoneNumber)
            $("#customer-street").val(customer.streetAddress)
            $("#customer-city").val(customer.city.cityName)
            $("#customer-zip").val( zipCode)
            showOrders(customer.customerOrders);
        }
    })
}

/*function getNumberOfOrders(id, orderArr){
    let sum = 0;
    orderArr.forEach(e => {
        if(e.user.id==id){
            sum++;
        }
    })
    return sum;
}*/

function getTotalPriceOfOrders(orderArr){
    let sum = 0;
    orderArr.forEach(e => {
        sum += e.totalCost;
    })
    return sum;
}

function filterSearch(){
    let tempOrders = [];
    let filter = $("#search-select option:selected").text();
    let input = $("#input").val();
  
    console.log(startDate, endDate);

    if(startDate!=null && endDate!=null){
        orders.forEach(e => {
            let date = new Date(e.orderTimestamp);
            if(date>=startDate && date<=endDate){
                tempOrders.push(e);
            }
        });
    }
    else{
        tempOrders=orders
    };
        
    $("#customerTable").empty();
    switch (filter) {
        case 'Visa alla':
            showCustomers(customers);
            break;
        case 'Vip-kunder':
            showCustomers(customers.filter(e => e.vip=="true"));   
            break;
        case 'Total ordersumma över:':
            if(input!=""){
                showCustomers(customers.filter(e => getTotalPriceOfOrders(e.id, tempOrders)>input));
            }
            break;
        case 'Totalt antal ordrar över:':
            if(input!=""){
                showCustomers(customers.filter(e => getNumberOfOrders(e.id, tempOrders)>input));
            }
            break;
    }
};

function showOrders(customerOrders){
    let sum = 0;
    customerOrders.forEach(orders => {
            sum += orders.totalCost;
            let dateFromOrder = new Date(orders.orderTimestamp);
            let orderDate = dateFromOrder.toISOString().substring(0,10);
            console.log(orderDate)
           
            let isPaid = "Obetalad";
            if(orders.isPaid){
                isPaid ="Betalad"
            }
            $("#orderTable").append(`
                <tr>
                    <th scope="row" class="col-3">
                    <a href="#">${orders.orderId}</a>
                    <td class="col-2">${orders.status.type}</td>
                    <td class="col-2">${isPaid}</td>
                    <td class="col-3">${orderDate}</td>
                    <td class="col-2">${orders.totalCost.toFixed(2)} kr</td>
                </tr>`
            )
    })
    $("#totalCost").text(sum.toFixed(2) + " kr");    
}

function updateCustomer(){
    let phoneNumber = $("#customer-phone").val()
    phoneNumber = phoneNumber.replace("-", "");
    phoneNumber = phoneNumber.replaceAll(" ", "");
    let zipCode = $("#customer-zip").val();
    zipCode = zipCode.replaceAll(" ", "");

    console.log(phoneNumber)
    console.log(zipCode)

    const data = {
        "firstName" : $("#customer-first-name").val(),
        "lastName" : $("#customer-last-name").val(),
        "email" : $("#customer-email").val(),
        "phone" : phoneNumber,
        "street" : $("#customer-street").val(),
        "city": 
            {
            "cityName": $("#customer-city").val()
            },
        "zipCode" : zipCode,
        "comment" : $("#commentTextField").val()
    }

    axios.post(updateUser, data)
        .then(() => {
            swal('Kunden är uppdaterad!')
        })
        .catch(() => {
            swal('Något gick fel!','Vänligen försök igen', 'warning')
        })
}



$(document).on('click', '#saveChangesBtn', function(){
    let firstName= $("#customer-first-name").val()
    let lastName = $("#customer-last-name").val()
    let email = $("#customer-email").val()
    let phone = $("#customer-phone").val()
    let street = $("#customer-street").val()
    let city = $("#customer-city").val()
    let zipcode = $("#customer-zip").val()

    console.log(firstName + " " + lastName)


    let customerChanges = `
    "firstName": ${firstName}, 
    "lastName": ¨${lastName}, 
    "phoneNumber": ${phone}, 
    "email": ${email}, 
    "streetAdress": ${street}, 
    "city":${city}, 
    "zipCode" : ${zipcode} `
})




        

     