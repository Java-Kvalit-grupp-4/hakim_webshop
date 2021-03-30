$(function () {
  $("#registerForm").on("shown.bs.modal", function () {
    let year = addYearOptions();
    for (let index = year - 110; index <= year; index++) {
      console.log(index);
    }
  });

  $("#test-button").on("click", function () {
    let day = $("#register-day").val();
    console.log(day);
    getInputs();
    addYearOptions();
  });

  $("#register-year");

  function getInputs() {
    let input = {
      firstName: $("#register-first-name").val(),
      lastName: $("#register-last-name").val(),
      month: $("#register-month").val(),
    };

    console.log(input);

    let email = $("#register-email").val();
    console.log(email);
  }

  function addYearOptions() {
    return new Date().getFullYear();
  }
});
