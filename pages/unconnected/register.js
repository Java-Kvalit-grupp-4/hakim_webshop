$(function () {
  addYearOptions();
  addDayOptions();

  $("#confirm-account").on("click", function () {
    validate(getInputs());
  });

  //Hämtar input från varje fält och sparar i ett objekt.
  function getInputs() {
    let input = {
      firstName: $("#register-first-name").val(),
      lastName: $("#register-last-name").val(),
      email: $("#register-email").val(),
      phoneNr: $("#register-phone-number").val(),
      password: $("#register-password").val(),
      confirmedPassword: $("#register-confirm-password").val(),
      street: $("#register-street").val(),
      city: $("#register-city").val(),
      zip: $("#register-zip").val(),
      year: $("#register-year").val(),
      month: $("#register-month").val(),
      day: $("#register-day").val(),
    };

    return input;
  }

  function addYearOptions() {
    let year = new Date().getFullYear();
    for (let index = year; index >= year - 110; index--) {
      $("#register-year").append(`<option value="${index}">
                                       ${index}
                                  </option>`);
    }
  }


  //Sätter antalet dagar per månad till korrekt antal när användaren väljer månad.
  function addDayOptions() {
    let dayOptions = {
      1: 31,
      2: 29,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };

    $("#register-month").on("change", function () {
      let $registerDay = $("#register-day");
      let selection = Number($(this).val());
      let daysInSelectedMonth = dayOptions[selection];
      $registerDay.empty();
      $registerDay.append(`<option selected disabled value="">
        Välj
      </option>`);

      for (let index = 1; index <= daysInSelectedMonth; index++) {
        $registerDay.append(`<option value="${index}">
                                       ${index}
                                  </option>`);
      }
    });
  }
  //Behöver bytas ut moit riktig validering
  function validate(inputs) {
    console.log("Valideras");
    let isFilled = true;
    Object.entries(inputs).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      if (value == null || value == undefined) {
        isFilled = false;
      }
    });
    console.log(isFilled);
    return isFilled;
  }
});
