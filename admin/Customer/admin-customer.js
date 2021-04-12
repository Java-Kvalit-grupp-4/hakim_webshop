let customers = [];
let orders = [];
let choosedCustomer = "";
let customerFile = "../../TestData/testdata_persons.json";
let ordersFile = "../../TestData/test_data_orders.json";

$.getJSON(ordersFile, function(response) {
    console.log(response);
    orders = response;
})

$.getJSON(customerFile, function(response) {
    console.log(response);
    customers = response;
    showCustomers(customers);
})

function showCustomers(customerArr){
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
                <td>${getNumberOfOrders(e.id)}</td>
                <td>${getTotalPriceOfOrders(e.id).toFixed(2)} kr</td>
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
            showOrders(e.id);

        }
    })
}

function getNumberOfOrders(id){
    let sum = 0;
    orders.forEach(e => {
        if(e.user.id==id){
            sum++;
        }
    })
    return sum;
}

function getTotalPriceOfOrders(id){
    let sum = 0;
    orders.forEach(e => {
        if(e.user.id==id){
            sum += e.totalCost;
        }
    })
    return sum;
}

$(document).on('click', '#search-btn', filterSearch);

function filterSearch(){
    let filter = $("#search-select option:selected").text();
    let input = $("#input").val();
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
                showCustomers(customers.filter(e => getTotalPriceOfOrders(e.id)>input));
            }
            break;
        case 'Totalt antal ordrar över:':
            if(input!=""){
                showCustomers(customers.filter(e => getNumberOfOrders(e.id)>input));
            }
            break;
        //case 'Födelsedag':
    }
};

function showOrders(id){
    orders.forEach(e => {
        if(e.user.id == id){
            let isPaid = "Obetalad";
            if(e.isPaid){
                isPaid ="Betalad"
            }
            $("#orderTable").append(`
                <tr>
                    <th scope="row" class="col-3">
                    <a href="#">${e.orderId}</a>
                    </th>
                    <td class="col-2">${e.status.type}</td>
                    <td class="col-2">${isPaid}</td>
                    <td class="col-3">2021-03-13</td>
                    <td class="col-2">${e.totalCost}</td>
                </tr>`
            )
        }
    })
    
}

    