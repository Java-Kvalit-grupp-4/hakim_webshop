const testData = "../../TestData/test_data_admin_info.json";
const localHost = "http://localhost:8080/information";

$(function () {
  fetch(localHost)
    .then((response) => response.json())
    .then((response) => renderInformation(response))
    .catch((error) => console.error(error));

  function renderInformation(response) {
    console.log(response);

    response.forEach((element) => {
      console.log(element);
      console.log(element.openingHours);
      openingHours = element.openingHours.replace("//", "\n");
      console.log(openingHours);
      $("#opening-hours").text(`${openingHours}`);
      $("#deviating-hours").text(`${element.deviatingHours}`);
      $("#info-address:text").val(`${element.streetAddress}`);
      $("#info-zip:text").val(`${element.zipCode}`);
      $("#info-city:text").val(`${element.city.cityName}`);
      $("#info-phone:text").val(`${element.phoneNumber}`);
      $("#info-email:text").val(`${element.email}`);
      $("#description").text(`${element.aboutInfo}`);

      $("#about-image").attr("src", `${element.imageUrl}`);
    });

    // $("#deviating-hours").text(`${response["deviating_hours"]}`);
    // $("#info-address:text").val(`${response["street_address"]}`);
    // $("#info-zip:text").val(`${response["zip_code"]}`);
    // $("#info-city:text").val(`${response["city"]}`);
    // $("#info-phone:text").val(`${response["phone_number"]}`);
    // $("#info-email:text").val(`${response["email"]}`);
    // $("#description").text(`${response["about_hakim"]}`);

    // $("#about-image").attr("src", `${response["image"]}`);
  }
});
