
//const startUrl = 'https://hakimlivs.herokuapp.com'
const startUrl = 'https://hakim-livs-dev.herokuapp.com'

// Information-links
let information = `${startUrl}/information`
let informationUpdate = `${startUrl}/information/update`

// Customer-links
let getAllCustomers = `${startUrl}/users`
let getCustomer = `${startUrl}/users/getUser/`
let updateUser = `${startUrl}/users/adminUpdateUser`
let addUser = `${startUrl}/users/add`
let updateUserInfo = `${startUrl}/users/update/user/info`
let updateUserPassword = `${startUrl}/users/update/password`
// let checkCredentials = `${startUrl}/users/checkCredentials?email=`

// Order-links
let getAllOrders = `${startUrl}/customerOrder/orders`
let updateOrderLink = `${startUrl}/customerOrder/update`
let getCustomerOrder = `${startUrl}/customerOrder/getCustomerOrders?email=`
let addOrder = `${startUrl}/customerOrder/add`

// Product-links
let getAllProducts = `${startUrl}/products`
let upsertProduct = `${startUrl}/products/upsertProduct`

// Image-links
let imageSource = `${startUrl}/api/v1/images`
let imageDelete = `${startUrl}/api/v1/delete/`
let imageUpload = `${startUrl}/api/v1/upload/db`