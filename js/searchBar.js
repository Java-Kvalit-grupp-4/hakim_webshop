const searchWrapper = $('.search-input') 
const searchField =  $('#search-field') 
const suggBox = $('.autocom-box')
const searchIcon = $('.icon')  
const allProductsUrl = 'https://hakimlivs.herokuapp.com/products'
let searchWords = []

/**
 * Eventlisteners
 */

/**
 * Checks for keyPresses in the searchField
 */
searchField.keyup((e)=>{
    let userInput = e.target.value //user enetered data   
    let emptyArray = []
    let allList = []
    if(userInput){
        emptyArray = searchWords.filter((data)=>{
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
            return data = '<li>'+ data +'</li>'
        });
        searchWrapper.addClass("active") //show autocomplete box
        showSuggestions(emptyArray)
        allList = suggBox.children("li")
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)")
        }
    }else{
        searchWrapper.removeClass("active"); //hide autocomplete box
    }

})

/**
 * Gets the products from the database
 */
function getProductsFromDataBase() {
    axios.get(allProductsUrl)
    .then(response => {
        createSearchWords(response.data) // use this if you fetching from database -> response.data
    })
    //.catch(err => alert('här' + err))
}

/**
 * Take an array of products, gets the product title,
 * product categories, product tags, and the product 
 * discription and puts in an array
 * @param {Array} products 
 */
function createSearchWords(products) {
    let searchStringToSplit = '';
    console.log(products);
    products.forEach(product => {
        searchStringToSplit += `${product.title} `
        product.categories.forEach(category => {
            searchStringToSplit += `${category.name} `
        })
        product.tags.forEach(tag => {
            searchStringToSplit += `${tag.name} `
        }) 
    })
    
    searchWords = searchStringToSplit.split(' ')
}

/**
 * Gets the text from the selected element
 * and puts it in the searchfield 
 * Send request for server if icon is pressed
 * 
 * @param {HTML element} element 
 */
function select(element){
    let selectData = element.innerText
    searchField.val(selectData)
    searchIcon.click(() =>{
        sendDataToServer(selectData)
    })
    searchWrapper.removeClass("active")
}

/**
 * Takes an array of data and show 
 * puts it in the suggestion box underthe 
 * searchfield
 * @param {String[]} list 
 */
function showSuggestions(list){
    index = -1
    let listData
    if(!list.length){
        userValue = searchField.val()
        listData = '<li>'+ userValue +'</li>'
    }else{
        listData = list.join('')
    }
    suggBox.html(listData)
}

/**
 * Take the users searchword and send it to 
 * the database for a response. Gets an array
 * of product that matches the word and send it
 * to getProducts() for render on the screen
 * @param {String} searchWord 
 */

function sendDataToServer(searchWord) {
    
    let productMatchWordUrl = `https://hakimlivs.herokuapp.com/products/searchProducts?searchWord=${searchWord}`

    axios.get(productMatchWordUrl)
    .then(response => {
        console.log(response.data);
        localStorage.removeItem('categoryList')
        localStorage.setItem('categoryList', JSON.stringify(response.data));
        renderProducts(response.data)
    })
    .catch(err => alert(err))
}

getProductsFromDataBase()
