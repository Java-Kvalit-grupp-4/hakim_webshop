// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;

const allProductsurl = `http://localhost:8080/products`
let searchWords = []


function getProducts() {
    axios.get(allProductsurl)
    .then(response => {
        getSearchWords(response.data)
    })
    .catch(err => alert(err))

}

function getSearchWords(data) {
    data.forEach(element => {
        console.log(element)
        let searchStringToSplit = `${element.title} ${element.description}`
        element.categories.forEach(e => {
            searchStringToSplit += ` ${e.category}`
        })
        element.tags.forEach(e => {
            searchStringToSplit += ` ${e.tagName}`
        })
        searchWords = searchStringToSplit.split(' ') 
    });
}

getProducts()


// if user press any key and release
inputBox.onkeyup = (e)=>{
    
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        emptyArray = searchWords.filter((data)=>{
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
            return data = '<li>'+ data +'</li>';
        });
        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    icon.onclick = ()=>{
        console.log(selectData);
        sendDataToServer(selectData);
    } 
    searchWrapper.classList.remove("active");
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

function sendDataToServer(searchWord) {
    let productMatchWordUrl = `http://localhost:8080/products/searchProducts?searchWord=${searchWord}`
    
    axios.get(productMatchWordUrl)
    .then(response => {
        console.log(response);

        // rendera producterna du sökt efter med response.data
    })
    .catch(err => alert(err))
}
