//const startUrl = 'https://hakimlivs.herokuapp.com'
const startUrl = "https://hakimlivs4.herokuapp.com";
//const startUrl = "http://localhost:8080";

// Customer-links
let updateUserInfo = `${startUrl}/api/user/update/info`;
let updateUserPasswordUrl = `${startUrl}/api/user/update/password`;
let addOrder = `${startUrl}/api/user/create/order`;
let getCustomerOrder = `${startUrl}/api/user/get/customer/orders?email=`;
let deleteUserUrl = `${startUrl}/api/user/delete`;

// admin
let getAllCustomers = `${startUrl}/api/admin/get/all/users`;
let updateUser = `${startUrl}/api/admin/update/user`;
let getAllOrders = `${startUrl}/api/admin/orders`;
let updateOrderLink = `${startUrl}/api/admin/update/order`;
let upsertProduct = `${startUrl}/api/admin/upsert/product`;
let imageSource = `${startUrl}/api/public/download/`;
let imageDelete = `${startUrl}/api/admin/delete/`;
let imageUpload = `${startUrl}/api/admin/upload/db`;
let informationUpdate = `${startUrl}/api/admin/upsert/information`;

// public
let getAllProducts = `${startUrl}/api/public/get/all/products`;
let addUser = `${startUrl}/api/public/create/user`;
let forgotPasswordUrl = `${startUrl}/api/public/forgot/password`;
let getCustomer = `${startUrl}/api/public/getUser/`;
let information = `${startUrl}/api/public/get/store/information`;
let loginUrl = `${startUrl}/login`;
