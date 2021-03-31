let productList = [];
let customerList = [];

// test data urls
let productTestUrl = './TestData/test_data_v.1.0.JSON' 
let customerTestUrl = './TestData/testdata_persons.json'

/**
 * [fetches data from url]
 * @param  {String} arg1 [String url to featch data from]
 * @return {Array}      [Array of objects]
 */
function load(url){
    let list = [];
    fetch(url)
    .then(response => response.json())
    .then(data => data.forEach(e => {
            list.push(e)
    }))
    return list;
}

// when page is loaded
productList = load(productTestUrl)
customerList = load(customerTestUrl)
console.log(productList)
console.log(customerList)


