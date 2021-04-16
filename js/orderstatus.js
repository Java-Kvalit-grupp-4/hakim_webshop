let orders = [];

function loadOrders(){
    let getOrders = 'hakim_webshop\TestData\test_data_orders.json'
    fetch(getOrders)
      .then((response) => response.json())
      .then((data) => makeArrayFromData(data))
      .catch((error) => console.error(error));

      orders.push(getOrders)
      console.log(orders)
}

function getWatingForHandlingOrders(){
    document.getElementById("waitingForHandling").innerHTML +=
    
    orders.forEach(element => {
        $('#element.type : Väntar på behandling').filter(function(){return this.value =="Väntar på behandling"})
        
    })
}
loadOrders