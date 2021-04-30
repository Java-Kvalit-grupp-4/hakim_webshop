const testData = "../../TestData/test_data_admin_info.json";
const localHost = "http://localhost:8080/information";
const heroku = "https://hakimlivs.herokuapp.com/information";
const imageSource = "https://hakimlivs.herokuapp.com/api/v1/images/";
let informationObject = new Object();
const chosenImageName = "Hakim.jpg";

$(function () {
  loadPage();
  function loadPage() {
    fetch(heroku)
      .then((response) => response.json())
      .then((response) => renderInformation(response))
      .catch((error) => console.error(error));
  }

  function renderInformation(response) {
    informationObject = {
      openingHours: response[0].openingHours,
      deviatingHours: response[0].deviatingHours,
      streetAddress: response[0].streetAddress,
      zipCode: response[0].zipCode,
      phoneNumber: response[0].phoneNumber,
      email: response[0].email,
      aboutInfo: response[0].aboutInfo,
      imageUrl: response[0].imageUrl,
    };

    //This fetches images from local directory. Will not work on Heroku
    // let imageSource = "http://localhost:8080/api/v1/image?imageUrl=";

    //This mapping gets files from db by file name.
    let imageLink = imageSource;
    response.forEach((element) => {
      imageLink += element.imageUrl;
      const openingHours = element.openingHours.replaceAll("/", "\n");
      const deviatingHours = element.deviatingHours.replaceAll("/", "\n");
      const aboutInfo = element.aboutInfo.replaceAll("/", "\n");
      $("#opening-hours").text(`${openingHours}`);
      $("#deviating-hours").text(`${deviatingHours}`);
      $("#info-address:text").val(`${element.streetAddress}`);
      $("#info-zip:text").val(`${element.zipCode}`);
      $("#info-city:text").val(`${element.city.name}`);
      $("#info-phone:text").val(`${element.phoneNumber}`);
      $("#info-email:text").val(`${element.email}`);
      $("#description").text(`${aboutInfo}`);
    });

    localStorage.setItem("imageUrl", response[0].imageUrl);
    loadImage(imageLink);
  }
  $('input[type="file"]').change(function (e) {
    let fileName = e.target.files[0].name;
    let fileData = e.target.files[0];
  });

  $("#uploadButton").on("click", function () {
    uploadImage();
  });

  $(".save-button").on("click", function () {
    let data = getInformationFromFields();

    axios
      .post("https://hakimlivs.herokuapp.com/information/update", data)
      .then(() => {
        swal(
          "Informationen har uppdaterats",
          "Uppladdningen lyckades",
          "success"
        ).then(() => loadPage());
      })
      .catch((error) => {
        swal("Något fick fel!", "Vänligen försök igen", "warning");
      });
  });

  function uploadImage() {
    const newFileName = "Hakim.jpg";
    let formData = new FormData();
    let imagefile = document.querySelector("#fileUpload");
    if (imagefile.files[0] != undefined) {
      let selectedImageFile = imagefile.files[0];
      formData.append("file", selectedImageFile, newFileName);
      axios
        .post("https://hakimlivs.herokuapp.com/api/v1/upload/db", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          swal("Ny bild uppladdad", "Uppladdningen lyckades", "success")
            .then(() => localStorage.setItem("imageUrl", newFileName))
            .then(() => loadImage(imageSource + newFileName));
        })
        .catch(() => {
          swal("Något fick fel!", "Vänligen försök igen", "warning");
        });
    }
  }

  function loadImage(imageUrl) {
    $("#about-image").attr("src", `${imageUrl}`);
  }

  function removeImage(imageUrl) {
    axios.get("https://hakimlivs.herokuapp.com/api/v1/delete/" + imageUrl);
    // .then(() => {
    //   swal("Bilden är borttagen");
    // })
    // .then(() => {
    //   resetImage();
    // })
    // .catch(() => {
    //   swal("Något gick fel!", "Vänligen försök igen", "warning");
    // });
  }

  $("#removeImageButton").on("click", function () {
    const imageUrl = localStorage.getItem("imageUrl");

    swal({
      title: "Är du säker?",
      text: "Det går inte att ångra detta val!",
      icon: "warning",
      buttons: ["Avbryt", "Bekräfta"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          title: "Bilden är borttagen",
          icon: "success",
        })
          .then(() => {
            return removeImage(imageUrl);
          })
          .then(() => {
            resetImage();
          });
      } else {
        swal("Radering avbruten!");
      }
    });
    removeImage(imageUrl);
  });

  function resetImage() {
    $("#about-image").attr("src", "");
    localStorage.removeItem("imageUrl");
  }

  function getInformationFromFields() {
    const openingHours = $("#opening-hours").val().replaceAll("\n", "/").trim();
    const deviatingHours = $("#deviating-hours").val().replaceAll("\n", "/");
    const streetAddress = $("#info-address:text").val();
    const zipCode = $("#info-zip:text").val();
    const city = $("#info-city:text").val();
    const phoneNumber = $("#info-phone:text").val();
    const email = $("#info-email:text").val();
    const aboutInfo = $("#description").val().replaceAll("\n", "/");

    informationObject = {
      openingHours: openingHours,
      deviatingHours: deviatingHours,
      streetAddress: streetAddress,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      aboutInfo: aboutInfo,
      imageUrl: chosenImageName,
      city: {
        name: city,
      },
    };
    return informationObject;
  }
});
