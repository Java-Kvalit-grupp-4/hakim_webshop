$(function () {
  addYearOptions();
  addDayOptions();

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
  
});