const searchWrapper = $('.search-input') 
const searchField =  $('#search-field') 
const suggBox = $('.autocom-box')
const searchIcon = $('.icon')  

//let allProductsUrl = `http://localhost:8080/products`
//let allProductsUrl = './TestData/test_data_products_v1.2.JSON'
const allProductsUrl = 'https://hakimlivs.herokuapp.com/products'
let searchWords = []

// for testdata
let productsTestData = []

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

// to test testdata for live under
/* function createSearchWords(products) {
    let arr = Array(products.data)
    let searchStringToSplit = '';
    productsTestData = arr[0]
    arr[0].forEach(product => {
        searchStringToSplit += `${product.title} ${product.description} ${product.category}`
    })
    searchWords = searchStringToSplit.split(' ')
}  */



/**
 * Take an array of products, gets the product title,
 * product categories, product tags, and the product 
 * discription and puts in an array
 * @param {Array} products 
 */
function createSearchWords(products) {
    let searchStringToSplit = '';

    products.forEach(product => {
        searchStringToSplit += `${product.title} ${product.description}`
        product.categories.forEach(category => {
            searchStringToSplit += ` ${category.category}`
        })
        product.tags.forEach(tag => {
            searchStringToSplit += ` ${tag.tagName} `
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
    
    //for live version
    let productMatchWordUrl = `https://hakimlivs.herokuapp.com/products/searchProducts?searchWord=${searchWord}`

    //To test testdata
    //productMatchWordUrl = searchWord
    //productToRenderFromTestData(productMatchWordUrl)

    // for live
    axios.get(productMatchWordUrl)
    .then(response => {
        
        renderProducts(response.data)
        // rendera producterna du sökt efter med response.data
    })
    .catch(err => alert(err))
}

/* function productToRenderFromTestData(searchWord) {
    console.log(searchWord);
    let temp = []
    productsTestData.forEach(product => {
        
        if(product.title.includes(searchWord)){
            temp.push(product)
        }
        if(product.description.includes(searchWord)){
            temp.push(product)
        }
        if(product.category.includes(searchWord)){
            temp.push(product)
        }
    })
    renderProducts(temp)

} */


getProductsFromDataBase()
