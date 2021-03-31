let productList = [];
let customerList = [];

// test data urls
//let productTestUrl = './TestData/test_data_v.1.0.JSON' 
// let customerTestUrl = './TestData/testdata_persons.json'
//let cartTestUrl = './TestData/test_data_cart.JSON' 

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
    console.log('in load');
    console.log(list)
    return list;
}



