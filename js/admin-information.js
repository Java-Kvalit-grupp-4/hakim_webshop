const testData = "../../TestData/test_data_admin_info.json";
const localHost = "http://localhost:8080/information";

$(function () {
  fetch(localHost)
    .then((response) => response.json())
    .then((response) => renderInformation(response))
    .catch((error) => console.error(error));

  // var outside;

  // fetch("http://localhost:8080/api/v1/image?imageUrl=uploaded_Hakim.jpg")
  //   .then((response) => response.blob())
  //   .then((images) => {
  //     // Then create a local URL for that image and print it
  //     outside = URL.createObjectURL(images);
  //     console.log(outside);
  //   });

  function renderInformation(response) {
    console.log(response);
    let imageSource = "http://localhost:8080/api/v1/image?imageUrl=";

    response.forEach((element) => {
      imageSource += element.imageUrl;
      console.log(imageSource);
      console.table(element);
      console.log(element.openingHours);
      const openingHours = element.openingHours.replaceAll("/", "\n");
      const deviatingHours = element.deviatingHours.replaceAll("/", "\n");
      const aboutInfo = element.aboutInfo.replaceAll("/", "\n");
      console.log(openingHours);
      $("#opening-hours").text(`${openingHours}`);
      $("#deviating-hours").text(`${deviatingHours}`);
      $("#info-address:text").val(`${element.streetAddress}`);
      $("#info-zip:text").val(`${element.zipCode}`);
      $("#info-city:text").val(`${element.city.name}`);
      $("#info-phone:text").val(`${element.phoneNumber}`);
      $("#info-email:text").val(`${element.email}`);
      $("#description").text(`${aboutInfo}`);

      // $("#about-image").attr("src", `${imageSource}`);

      console.log($("#opening-hours").val());
    });

    loadImage(imageSource);

    // $("#deviating-hours").text(`${response["deviating_hours"]}`);
    // $("#info-address:text").val(`${response["street_address"]}`);
    // $("#info-zip:text").val(`${response["zip_code"]}`);
    // $("#info-city:text").val(`${response["city"]}`);
    // $("#info-phone:text").val(`${response["phone_number"]}`);
    // $("#info-email:text").val(`${response["email"]}`);
    // $("#description").text(`${response["about_hakim"]}`);

    // $("#about-image").attr("src", `${response["image"]}`);
  }
  $('input[type="file"]').change(function (e) {
    var fileName = e.target.files[0].name;
    let fileData = e.target.files[0];
    console.log(fileData);
    console.log('The file "' + fileName + '" has been selected.');
    
  });
$("#uploadButton").on("click", function() {
  uploadImage();
})


  function uploadImage() {
  var formData = new FormData();
  var imagefile = document.querySelector("#fileUpload");
  formData.append("image", imagefile.files[0]);
  // axios.post("upload_file", formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // }); 
  console.log(formData);
  }

  

  function loadImage(imageUrl) {
    $("#about-image").attr("src", `${imageUrl}`);
  }
});
