$(function () {
  loadPage();
  function loadPage() {
    fetch(information)
      .then((response) => response.json())
      .then((response) => renderInformation(response))
      .catch((error) => console.error(error));
  }

  function renderInformation(response) {
    let oh = response[0].openingHours.replaceAll("/", "<br>");




    let zipCode = response[0].zipCode;
    let city = response[0].city.name;
    let streetAddress = response[0].streetAddress;
    let phoneNumber = response[0].phoneNumber;
    let addressOutput = `
      <a
        href="https://www.google.com/maps/search/${streetAddress.replaceAll(
          " ",
          "+"
        )},+${city}+${zipCode}/@59.3332978,18.0530605,17z/data=!3m1!4b1"
        class="text-light"
        target="_blank"
      >
        <div id="" class="footer-link-hover">${streetAddress}<br>
        ${zipCode} ${city}</div>
      </a>`;


    $("#address-footer").html(addressOutput);

    
    $("p#phone").text(phoneNumber);
    $("#openingHours").html(`${oh}`);
  }
});
