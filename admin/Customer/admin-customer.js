let customers = [];
let orders = [];
let choosedCustomer = "";
let customerFile = "../../TestData/testdata_persons.json";
let ordersFile = "../../TestData/test_data_orders.json";
let startDate = null;
let endDate = null;

$.getJSON(ordersFile, function(response) {
    console.log(response);
    orders = response;
})

$.getJSON(customerFile, function(response) {
    console.log(response);
    customers = response;
    showCustomers(customers);
})

$(document).ready(function(){
    $("#reservation").daterangepicker(null, function (start, end, label) {
        startDate = new Date(start.toISOString())
        endDate = new Date(end.toISOString())
    })
})

function showCustomers(customerArr){

    if(customerArr.length==0){
        swal("Hittade inga kunder på denna sökning")
    }
    customerArr.forEach(e => {
        let isVip = "";
        if(e.vip=="true"){
            console.log("ÄR VIP")
            isVip = "bi-check2"
        }
        else{
            isVip = "bi-x"
        }
        let personalNumber = e.social_security_number;
        let firstNr = personalNumber.substring(0,6);
        let lastNr = personalNumber.substring(6);
    
        $("#customerTable").append(`
            <tr>
                <th scope="row"><a href="#" class="customer-tab">${e.id}</a></th>
                <td>${e.first_name}</td>
                <td>${e.last_name}</td>
                <td>${firstNr}-${lastNr}</td>
                <td><a href="mailto:${e.email}">${e.email}</a></td>
                <td>${getNumberOfOrders(e.id, orders)}</td>
                <td>${getTotalPriceOfOrders(e.id, orders).toFixed(2)} kr</td>
                <td><i class="bi ${isVip}"></i></td>
            </tr>
            `
        )})
}

$(document).on('click', '.customer-tab', openCustomerTab);

function openCustomerTab(){
    $("#orderTable").empty();
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
            showOrders(e.id);

        }
    })
}

function getNumberOfOrders(id, orderArr){
    let sum = 0;
    orderArr.forEach(e => {
        if(e.user.id==id){
            sum++;
        }
    })
    return sum;
}

function getTotalPriceOfOrders(id, orderArr){
    let sum = 0;
    orderArr.forEach(e => {
        if(e.user.id==id){
            sum += e.totalCost;
        }
    })
    return sum;
}

$(document).on('click', '#search-btn', filterSearch);

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

function showOrders(id){
    let sum = 0;
    orders.forEach(e => {
        if(e.user.id == id){
            sum += e.totalCost;
            let dateFromOrder = new Date(e.orderTimestamp);
            let orderDate = dateFromOrder.toISOString().substring(0,10);
            console.log(orderDate)
           
            let isPaid = "Obetalad";
            if(e.isPaid){
                isPaid ="Betalad"
            }
            $("#orderTable").append(`
                <tr>
                    <th scope="row" class="col-3">
                    <a href="#">${e.orderId}</a>
                    <td class="col-2">${e.status.type}</td>
                    <td class="col-2">${isPaid}</td>
                    <td class="col-3">${orderDate}</td>
                    <td class="col-2">${e.totalCost.toFixed(2)} kr</td>
                </tr>`
            )
        }
    })
    $("#totalCost").text(sum.toFixed(2) + " kr");
    
}

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

})




        

    