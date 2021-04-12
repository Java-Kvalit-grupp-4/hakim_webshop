$(function () {
  console.log("Script is linked");
  addListenerToMenu();
  function addListenerToMenu() {
  }

  fetch("../../TestData/test_data_admin_info.json")
    .then((response) => response.json())
    .then((response) => renderInformation(response))
    .catch((error) => console.error(error));

  function renderInformation(response) {
    console.log(response);
    Object.entries(response).forEach((element) => console.log(element));

    $("#opening-hours").text(`${response["opening_hours"]}`);
    $("#deviating-hours").text(`${response["deviating_hours"]}`);
    $("#info-address:text").val(`${response["street_address"]}`);
    $("#info-zip:text").val(`${response["zip_code"]}`);
    $("#info-city:text").val(`${response["city"]}`);
    $("#info-phone:text").val(`${response["phone_number"]}`);
    $("#info-email:text").val(`${response["email"]}`);
    $("#description").text(`${response["about_hakim"]}`);

    $("#about-image").attr("src", `${response["image"]}`);
  }
});
