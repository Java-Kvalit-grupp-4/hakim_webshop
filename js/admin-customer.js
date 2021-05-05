/**
 * Cache variables 
 * 
 */
let customers = [];
let allOrders = [];
let choosedCustomer = "";

// let getAllCustomers = "https://hakim-test.herokuapp.com/users";
let getAllCustomers = "https://hakimlivs.herokuapp.com/users";
let updateUser = "https://hakimlivs.herokuapp.com/users/adminUpdateUser";
// let updateUser = "https://hakim-test.herokuapp.com/users/adminUpdateUser";
let getCustomerOrder = "https://hakimlivs.herokuapp.com/customerOrder/getCustomerOrders?email=";
// let getCustomerOrder = "https://hakim-test.herokuapp.com/customerOrder/getCustomerOrders?email=";
// let getAllOrders =  "https://hakim-test.herokuapp.com/customerOrder/orders"
let getAllOrders =  "https://hakimlivs.herokuapp.com/customerOrder/orders"

let startDateC = null;
let endDateC = null;
let firstName = $('#customer-first-name'),
    lastName = $('#customer-last-name'),
    email = $('#customer-email'),
    phoneNumber = $('#customer-phone'),
    address = $('#customer-street'),
    city = $('#customer-city'),
    zipCode = $('#customer-zip')
    customerComment = $("#customer-comments")

 let FIRSTNAME_ERROR_MSG = $('#FIRSTNAME_ERROR_MSG'),
    LASTNAME_ERROR_MSG = $('#LASTNAME_ERROR_MSG'),
    EMAIL_ERROR_MSG = $('#EMAIL_ERROR_MSG'),
    PHONE_NUMBER_ERROR_MSG = $('#PHONE_NUMBER_ERROR_MSG'),
    ADDRESS_ERROR_MSG = $('#ADDRESS_ERROR_MSG'),
    ZIPCODE_ERROR_MSG = $('#ZIPCODE_ERROR_MSG'),
    CITY_ERROR_MSG = $('#CITY_ERROR_MSG'),
    WRONNG_PASSWORD_ERROR_MSG = $('#WRONG_PASSWORD_ERROR_MSG'),
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG = $('#NEW_PASSWORD_NOT_MATCH_ERROR_MSG'),
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $('#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG')
    //INPUT_ERROR_MSG = ("#INPUT_ERROR_MSG")

$('form').submit(false)

$(document).ready(load)

$(document).on('click', '.customer-tab', openCustomerTab);

$(document).on('click', '#search-btn', filterSearch);

$(document).on('click', '#updateBtn', updateCustomer);

$(document).on('focus', '#search-select', function(){
    $("#input").val("");
})

$(document).on('click', ".orderLink", openOrderTab)
 
$(document).on('click', '#nav-profile-tab', function(){
    $("#orderTable").empty();
    firstName.val("")
    lastName.val("")
    email.val("")
    phoneNumber.val("")
    address.val("")
    city.val("")
    zipCode.val("")
    customerComment.val("")
    startDateC = null;
    endDateC = null;
    load();
})

function openOrderTab(){
    sessionStorage.setItem("chosenOrder",(Number($(this).text())));
    sessionStorage.setItem("redirect", true);
    location.replace("../Orders/index.html")
}

function load(){
    let chosenId = sessionStorage.getItem("customerNumber");
    if(chosenId!=null || chosenId!=undefined){       
      openCustomerPage();
      chosenId =null;
    } else {
        hideAllErrorMsgs()
        $("#reservation").daterangepicker(null, function (start, end, label) {
            startDateC = new Date(start.toISOString())
            endDateC = new Date(end.toISOString())
        })
        axios.get(getAllCustomers)
            .then((response) =>{
                if(response.status ===200){
                    showCustomers(response.data) 
                    customers = response.data   
                }
                else{
                    swal({title:"Något gick fel vid inläsning av kunder", icon:"warning"})
                }
            })
            .catch(err =>{
                alert("Serverfel!" + err)
            })
    }
}



function showCustomers(customerArr){
    $("#customerTable").empty();
    if(customerArr.length==0){
        swal({title: "Hittade inga kunder på denna sökning", icon: "info"})
    }
    customerArr.forEach(customer => {
        let isVip = "";
        if(customer.isVip=== true){
            isVip = "bi-check2"
        }
        else{
            isVip = "bi-x"
        }

        axios.get(getCustomerOrder+customer.email)
        .then((response) =>{
            if(response.status ===200){ 
                let numberOfOrders;
                let totalPrice; 
                let customerOrders = response.data
                
                if(customerOrders!=null){
                    numberOfOrders = customerOrders.length
                    totalPrice = getTotalPriceOfOrders(customerOrders);
                }
                else{
                    numberOfOrders = 0;
                    totalPrice =0;
                }   
            
            
                $("#customerTable").append(`
                    <tr>
                        <th scope="row"><a href="#" class="customer-tab">${
                          customer.customerNumber
                        }</a></th>
                        <td>${customer.firstName}</td>
                        <td>${customer.lastName}</td>
                        <td style="word-break:break-all;"><a href="mailto:${
                          customer.email
                        }">${customer.email}</a></td>
                        <td>${numberOfOrders}</td>
                        <td>${totalPrice.toLocaleString("sv-SE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}</td>
                        
                    </tr>
                    `);
                // <td>
                //   <i class="bi ${isVip}"></i>
                // </td>;
            }
            else{
                swal("Något gick fel vid inläsning av kunder")
            }
        })
        .catch(err =>{
            alert("Serverfel!" + err)
        })
    })
}

function openCustomerTab(){
    console.log("inne i openCustomerTab")
    $("#orderTable").empty();
    sessionStorage.setItem("customerNumber", $(this).text())
    saveCustomer();
    sessionStorage.removeItem("customerNumber");
    //$("#nav-contact-tab").tab('show');
    openTab();
    };

function openCustomerPage(){
    console.log("inne i openCustomerPage")
    saveCustomer();
    sessionStorage.removeItem("customerNumber");
    openTab();
}

function openTab(){
    $("#nav-contact-tab").tab("show");
}

function saveCustomer(){
    console.log("inne i saveCustomer")
    let customerNumber = Number(sessionStorage.getItem("customerNumber"));
    customers.forEach(customer => {

        if(customer.customerNumber==customerNumber){
            let newZipCode = "";
            let newPhoneNumber = `${customer.phoneNumber.substring(0,3)} ${customer.phoneNumber.substring(3,6)} ${customer.phoneNumber.substring(6,8)} ${customer.phoneNumber.substring(8)}`
            sessionStorage.setItem("choosedCustomer", JSON.stringify(customer));

            if(customer.zipCode!=null){
                newZipCode = `${customer.zipCode.substring(0,3)} ${customer.zipCode.substring(3)}`
            }
            axios.get(getCustomerOrder+customer.email)
                .then((response) =>{
                if(response.status ===200){ 
                    console.log(response.data) 
                    //sessionStorage.setItem('customerOrders', JSON.stringify(response.data))
                    firstName.val(customer.firstName)
                    lastName.val(customer.lastName)
                    email.val( customer.email)
                    phoneNumber.val(newPhoneNumber)
                    address.val(customer.streetAddress)
                    city.val(customer.city.name)
                    zipCode.val( newZipCode)
                    customerComment.val(customer.comment)
                    showOrders(response.data);
                }
                else{
                    swal("Något gick fel vid inläsning av kunder")
                }
            })
            .catch(err =>{
                alert("Server fel!" + err)
            })                       
        }
    })
}

function customerOrderLength(orderArr){
    if(orderArr!=null){
        return orderArr.length;
    }
    else{
        return 0;
    }
}


function getTotalPriceOfOrders(orderArr){
    if(orderArr!=null){
        let sum = 0;
        orderArr.forEach(e => {
            sum += e.totalCost;
        })
        return sum;
    }
    else{
        return 0;
    }
}

function filterSearch(){
    //let tempOrders = [];
    let filter = $("#search-select option:selected").text();
    let input = $("#input").val();
        
    $("#customerTable").empty();
    switch (filter) {
        case 'Visa alla':
            showCustomers(customers);
            break;
        case 'Vip-kunder':
            showCustomers(customers.filter(customer => customer.isVip==true));   
            break;
        case 'Total ordersumma över:':
            if(input!="" && input!=NaN){
                resetsInputBorders()
                    axios.get(getAllOrders)
                        .then((response) =>{
                            let filterCustomers = [];
                            let filterOrders = response.data
                            let date;
                            let filterOrders2=[];
                            if(startDateC!=null && endDateC!=null){
                                filterOrders
                                    .forEach(order => {
                                        date = new Date(order.timeStamp)
                                        if( date>=startDateC && date<=endDateC){
                                            filterOrders2.push(order)
                                        }})
                                
                                customers.forEach(customer =>{
                                    if(getTotalPriceOfOrders(filterOrders2.filter(order => 
                                        order.appUser.customerNumber==customer.customerNumber))>input){

                                        filterCustomers.push(customer)
                                    }
                                })
                            }
                            else{
                                customers.forEach(customer =>{
                                    if(getTotalPriceOfOrders(filterOrders.filter(order => 
                                        order.appUser.customerNumber==customer.customerNumber))>input){

                                        filterCustomers.push(customer)
                                    }
                                })

                            }
                            showCustomers(filterCustomers)
                            
                        })
            }
            else{
                swal("Fel input!", "Du måste skriva in totalsumma","warning" )
            }
            break;
            case 'Totalt antal ordrar över:':
                if(input!="" && input!=NaN){
                    resetsInputBorders()
                    axios.get(getAllOrders)
                        .then((response) =>{
                            let filterCustomers = [];
                            let filterOrders = response.data
                            let date;
                            let filterOrders2=[];
                            console.log("startdate: " + startDateC +"endDate: " +endDateC);
                            if(startDateC!=null && endDateC!=null){
                                filterOrders
                                    .forEach(order => {
                                        date = new Date(order.timeStamp)
                                        console.log(date)
                                        if( date>=startDateC && date<=endDateC){
                                            filterOrders2.push(order)
                                        }})
                                    
                                customers.forEach(customer =>{
                                    if(customerOrderLength(filterOrders2.filter(order => 
                                        order.appUser.customerNumber==customer.customerNumber))>input){

                                        filterCustomers.push(customer)
                                    }
                                })
                            }
                            else{
                                customers.forEach(customer =>{
                                    if(customerOrderLength(filterOrders.filter(order => 
                                        order.appUser.customerNumber==customer.customerNumber))>input){

                                        filterCustomers.push(customer)
                                    }
                                })

                            }
                            showCustomers(filterCustomers)
                            
                        })
                }
                else{
                    swal("Fel input", "Du måste skriva in totalt antal ordrar","warning" )
                }
            break;
    }
   
};

function showOrders(customerOrders){
    let sum = 0;
    if(customerOrders!=null){
        customerOrders.forEach(orders => {
            sum += orders.totalCost;
            let dateFromOrder = new Date(orders.timeStamp);
            let orderDate = dateFromOrder.toISOString().substring(0,10);
            console.log(orderDate)
        
            let isPaid = "Obetalad";
            if(orders.isPaid){
                isPaid ="Betalad"
            }
            $("#orderTable").append(`
                <tr>
                    <th scope="row" class="col-3">
                    <a href="#" class="orderLink">${orders.orderNumber}</a>
                    <td class="col-2">${orders.orderStatus.type}</td>
                    <td class="col-2">${isPaid}</td>
                    <td class="col-3">${orderDate}</td>
                    <td class="col-2">${orders.totalCost.toLocaleString(
                        "sv-SE",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}</td>
                  </tr>`);
        })
    }
    $("#totalCost").text(
      sum.toLocaleString("sv-SE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " "
    );
        
}

function updateCustomer(){
    if(validateForm()){
        resetsInputBorders()
        let newPhoneNumber = phoneNumber.val().replaceAll(" ", "");
        let newZipCode = zipCode.val().replaceAll(" ", "");

        let data = {
            "firstName" : $(firstName).val(),
            "lastName" : $(lastName).val(),
            "email" : $(email).val(),
            "phoneNumber" : newPhoneNumber,
            "streetAddress" : $(address).val(),
            "city": 
                {
                "name": $(city).val()
                },
            "zipCode" : newZipCode,
            "comment" : $("#customer-comments").val()
        }


        axios.post(updateUser, data)
            .then(() => {
                swal({title: 'Kunden är uppdaterad!', icon: 'success'})
            })
            .catch(() => {
                
                swal('Något gick fel!','Vänligen försök igen', 'warning')
            })
        }
    }

function saveAndOpenOrder(){
    sessionStorage.setItem("chosenOrder", Number($(this).text()));
    location.replace("../Orders/index.html");
}


function validateForm() {
    let bool = true

    bool = checkForInput(testForOnlyText, firstName, bool, FIRSTNAME_ERROR_MSG)
    bool = checkForInput(testForOnlyText, lastName, bool,LASTNAME_ERROR_MSG)
    bool = checkForInput(testForEmail, email, bool,EMAIL_ERROR_MSG)
    bool = checkForInput(testForNumbersOnly,phoneNumber, bool,PHONE_NUMBER_ERROR_MSG)
    bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
    bool = checkForInput(testForZipCode, zipCode, bool,ZIPCODE_ERROR_MSG)
    bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
    
    return bool
  }


  function hideAllErrorMsgs() {
    FIRSTNAME_ERROR_MSG.hide()
    LASTNAME_ERROR_MSG.hide()
    EMAIL_ERROR_MSG.hide()
    PHONE_NUMBER_ERROR_MSG.hide()
    ADDRESS_ERROR_MSG.hide()
    ZIPCODE_ERROR_MSG.hide()
    CITY_ERROR_MSG.hide()
   
  }
  
  function resetsInputBorders() {
    resetBorder(firstName)
    resetBorder(lastName)
    resetBorder(email)
    resetBorder(phoneNumber)
    resetBorder(address)
    resetBorder(zipCode)
    resetBorder(city)
    resetBorder($("#input"))
  }




        

    