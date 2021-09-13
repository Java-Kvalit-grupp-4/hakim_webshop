const searchWrapper = $(".search-input");
const searchField = $("#search-field");
const suggBox = $(".autocom-box");
const searchIcon = $(".icon");
// const allProductsUrl = 'https://hakimlivs.herokuapp.com/products'
let searchWords = [];
let productsToSerach = [];

/* $(document).ready(() => {
       axios.get(getAllProducts)
       .then(response => {
         createSearchWords(removeHiddenProductsFromArray(response.data))
       })
       .catch(err => {
         console.log('error in searchbar script! ' + err.response.status);
       }) 

}) */

/**
 * Checks for keyPresses in the searchField
 */
searchField.keyup((e) => {
  let userInput = e.target.value; //user enetered data
  let emptyArray = [];
  let allList = [];
  if (userInput) {
    emptyArray = searchWords.filter((data) => {
      //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
      return data.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // passing return data inside li tag
      return (data = "<li>" + data + "</li>");
    });
    searchWrapper.addClass("active"); //show autocomplete box
    showSuggestions(emptyArray);
    allList = suggBox.children("li");
    for (let i = 0; i < allList.length; i++) {
      //adding onclick attribute in all li tag
      allList[i].setAttribute("onclick", "select(this)");
    }
  } else {
    searchWrapper.removeClass("active"); //hide autocomplete box
  }
});

/**
 * Take an array of products, gets the product title,
 * product categories, product tags, and the product
 * discription and puts in an array
 * @param {Array} products
 */
function createSearchWords(products) {
  productsToSerach = products;

  let searchStringToSplit = "";
  products.forEach((product) => {
    searchStringToSplit += `${product.title} `;
    product.categories.forEach((category) => {
      searchStringToSplit += `${category.name} `;
    });
    product.tags.forEach((tag) => {
      searchStringToSplit += `${tag.name} `;
    });
  });

  searchWords = searchStringToSplit.split(" ").filter(distinct);
}

/**
 * Gets the text from the selected element
 * and puts it in the searchfield
 * Send request for server if icon is pressed
 *
 * @param {HTML element} element
 */
function select(element) {
  let selectData = element.innerText;
  searchField.val(selectData);
  searchIcon.click(() => {
    renderProductFromSearchWord(selectData);
    //sendDataToServer(selectData)
  });
  searchWrapper.removeClass("active");
}

/**
 * Takes an array of data and show
 * puts it in the suggestion box underthe
 * searchfield
 * @param {String[]} list
 */
function showSuggestions(list) {
  index = -1;
  let listData;
  if (!list.length) {
    userValue = searchField.val();
    listData = "<li>" + userValue + "</li>";
  } else {
    listData = list.join("");
  }
  suggBox.html(listData);
}

// to remove duplcate from array
const distinct = (value, index, self) => {
  return self.indexOf(value) === index;
};

/**
 * Returns a list of filtered products based on the searchword
 * @param {String} searchWord
 */
const renderProductFromSearchWord = (searchWord) => {
  let filteredList = [];
  let resultMsg;

  // checks if searchwrod is among title, brand or description
  filteredList = productsToSerach.filter(
    (product) =>
      product.title
        .toLocaleLowerCase()
        .includes(searchWord.toLocaleLowerCase()) ||
      product.brand.name
        .toLocaleLowerCase()
        .includes(searchWord.toLocaleLowerCase()) ||
      product.description
        .toLocaleLowerCase()
        .includes(searchWord.toLocaleLowerCase())
  );

  // check if searchwords is among the tags of each product
  productsToSerach.forEach((product) => {
    product.tags.forEach((tag) => {
      if (
        tag.name.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase())
      ) {
        filteredList.push(product);
      }
    });
  });

  // check if searchwords is among the categories of each product
  productsToSerach.forEach((product) => {
    product.categories.forEach((category) => {
      if (
        category.name
          .toLocaleLowerCase()
          .includes(searchWord.toLocaleLowerCase())
      ) {
        filteredList.push(product);
      }
    });
  });

  // remove duplcates from the filtered list
  filteredList = filteredList.filter(distinct);

  // sets the filtered list to localstorage
  localStorage.removeItem("categoryList");
  localStorage.setItem("categoryList", JSON.stringify(filteredList));

  resultMsg =
    filteredList.length == 0
      ? "Sökningen gav inga träffar"
      : "Resultat för " + searchWord;
  $("#heading").text(resultMsg);

  renderProducts(filteredList);
};
