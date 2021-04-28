$(function(){

axios.get("../TestData/test_data_orders.json")
.then(response => getOrderStatus(response.data))

function getOrderStatus (data) {
   let waiting = 0;
   let picking = 0;
   let ready = 0;
   let sent = 0;
   let canceled = 0;
    data.forEach(element => {
        switch(element.status.type){
            case "Väntar på behandling": waiting += 1;  break;
            case "Plockning pågår": picking += 1;       break;
            case "Redo att skickas": ready += 1;        break;  
            case "Skickad": sent += 1;                  break;              
            case "Avbeställd": canceled += 1;           break;  
        }
    })
    $('#waitingForHandling').text(waiting)
    $('#pickingInProgress').text(picking)
    $('#readyForSending').text(ready)
    $('#sent').text(sent)
    $('#canceled').text(canceled)
}
})