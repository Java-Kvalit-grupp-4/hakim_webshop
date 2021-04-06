$(function () {
  addYearOptions();
  addDayOptions();

  $("#confirm-account").on("click", function () {
    //validate(getInputs())
    validateInput()
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

/**
 * Vaidates input fields
 */
function validateInput(){
  let firstName = $("#register-first-name").val(),
    lastName = $("#register-last-name").val(),
    email = $("#register-email").val(),
    phoneNr = $("#register-phone-number").val(),
    password =  $("#register-password").val(),
    confirmedPassword = $("#register-confirm-password").val(),
    street = $("#register-street").val(),
    city = $("#register-city").val(),
    zip = $("#register-zip").val();
    
    if(testForOnlyText(firstName)) {
      console.log(firstName + ' true')
    }else{
        console.log(firstName + ' false')
    }

    if(testForOnlyText(lastName)) {
        console.log(lastName + ' true')
    }else{
        console.log(lastName + ' false')
    }

    if(testForEmail(email)){
        console.log(email + ' true')
    }else{
        console.log(email + ' false')
    }

    if(testForNumbersOnly(phoneNr)){
        console.log(phoneNr + ' true')
    }else{
        console.log(phoneNr + ' false')
    }
    if(testForPassword(password)){
      console.log(password + ' true')
    }else{
      console.log(password + ' false')
    }
    if(testForPassword(confirmedPassword)){
      console.log(confirmedPassword + ' true')
    }else{
      console.log(confirmedPassword + ' false')
    }

    if(testForAddress(street)){
        console.log(street + ' true')
    }else{
        console.log(street + ' false')
    }
    
    if(testForZipCode(zip)){
        console.log(zip + ' true')
    }else{
        console.log(zip + ' false')
    }

    if(testForOnlyText(city)){
        console.log(city + ' true')
    }else{
        console.log(city + ' false')
    }
}