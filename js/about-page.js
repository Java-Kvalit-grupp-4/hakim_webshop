let adminview = $("#admin-view-link");
let myAccountMenu = $("#myAccountDropdown");

$(function () {
  let loggedIn = JSON.parse(sessionStorage.getItem("customer"));
  if (loggedIn == undefined) {
    adminview.hide();
  } else {
    if(loggedIn.roleList) {
      if (loggedIn.roleList.some(role => role.name=="ADMIN")) {
      adminview.show();
      }
    }
  }

  loggedIn = sessionStorage.getItem("customer") || "";
  if (loggedIn.length > 0) {
    navLoginBtn.text("Logga ut");
    $("#myAccountDropdown").show();
  } else {
    $("#myAccountDropdown").hide();
  }


  fetch(information)
  .then((response) => response.json())
  .then((response) => renderInformation(response))
  .catch(error => console.log(error));

  function renderInformation(response) {
      let deviatingHours = response[0].deviatingHours.replaceAll("/", "<br>");
      let aboutInfo = response[0].aboutInfo.replaceAll("/", "<br>");

      $("#deviating-hours").html(deviatingHours)
      $("#about-text-hakim-livs").html(aboutInfo);
  }
});
