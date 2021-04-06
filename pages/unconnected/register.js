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
    let year = new Date().getFullYear() - 18;
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
 let firstName = $("#register-first-name"),
    lastName = $("#register-last-name"),
    email = $("#register-email"),
    phoneNr = $("#register-phone-number"),
    password =  $("#register-password"),
    confirmedPassword = $("#register-confirm-password"),
    street = $("#register-street"),
    city = $("#register-city"),
    zip = $("#register-zip"),
    year = $("#register-year"),
    month = $("#register-month"),
    day = $("#register-day");

  
    
    let bool = true
    if(password.val() === confirmedPassword.val()){
      if(bool){
        bool = checkForInput(testForPassword,password, bool)
        bool = checkForInput(testForPassword,confirmedPassword, bool)
        alert("works")
      }
    }else{
      password.css("border", "3px solid #F90A0A")
      confirmedPassword.css("border", "3px solid #F90A0A")
      swal({
        title: "FEL!",
        text: "Lösenorden stämmer ej överräns\noch måste innehålla en siffra, en stor bokstav samt en liten bokstav",
        icon: "warning",
        button: "Ok",
      });
    }

    bool = checkForInput(testForOnlyText, firstName, bool)
    bool = checkForInput(testForOnlyText, lastName, bool)
    bool = checkForInput(testForEmail, email, bool)
    bool = checkForInput(testForNumbersOnly,phoneNr, bool)
    bool = checkForInput(testForAddress, street, bool)
    bool = checkForInput(testForZipCode, zip, bool)
    bool = checkForInput(testForOnlyText, city,bool)

    if(year.val() && month.val() && day.val()){
      swal({
        title: `Välkommen, ${firstName.val()}!`,
        text: "Du har nu skapat ett konto hos Hakim's livs och kan börja handla",
        icon: "success",
        button: "Ok",
      });
    }else {
      swal({
        title: "FEL!",
        text: "Du måste fylla i alla fält korrekt",
        icon: "warning",
        button: "Ok",
      });
    }
    
    
}