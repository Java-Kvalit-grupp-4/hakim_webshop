/**
 *  Takes input as String and checks for only characters
 *  capital, lowercase and hyphen allowed
 * @param {String} input to test 
 * @returns true or false
 */

function testForOnlyText(input) {
    let pattern = /^[a-zA-ZåäöÅÄÖ\-]*$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}
/**
 * Takes input as String and checks for 5 numbers
 * (swedish standard for zip codes)
 * @param {String} input to test 
 * @returns true or false
 */
function testForZipCode(input) {
    let pattern = /\d{3}[ ]?\d{2}/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}
/**
 * Takes input as a String and checks if 
 * it's an correct email
 * @param {String} input to test 
 * @returns true or false
 */
function testForEmail(input) {
    let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return testForSqlInjections(input) ? false : pattern.test(input)
}

function testForAddress(input) {
    // lägg till 3 siffor efter mellanskalg
    let pattern = /^\S[a-zA-ZåäöÅÄÖ\s0-9]*$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}
/**
 * Takes input as String and checks it 
 * to match a swedish social security number
 * @param {String} input to test
 * @returns true or false
 */
function testForSocialSecurityNumber(input) {
    let pattern = /^(\d{6}|\d{8})[-|(\s)]{0,1}\d{4}$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}

/**
 * Takes input as String and checks it 
 * to match only digits no decimals allowed
 * @param {String} input to test 
 * @returns true or false
 */
function testForNumbersOnly(input) {
    let pattern = /^[0-9\s]*$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}

/**
 * Takes input as String and checks it 
 * to match decimal numbers
 * @param {String} input to test 
 * @returns true or false
 */
function testForDecimalNumbers(input) {
    let pattern = /^\d{1,}\.?\d*$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}
/**
 * Checks standard for swedish numbers
 * @param {String} input 
 * @returns true or false
 */
function testForPhoneNumber(input) {
    let test = input.replace(" ", "")
    let pattern =  /^[(]{0,1}[0-9]{2,4}[)]{0,1}[-\s\.]{0,1}[0-9][-\s\.][0-9]{2,6}$/; 
    return testForSqlInjections(test) ? false : pattern.test(test)
}

/**
 * Takes input as String and checks it 
 * to match our password specifics:
 * The string must contain at least 1 lowercase alphabetical character
 * The string must contain at least 1 uppercase alphabetical character
 * The string must contain at least 1 numeric character
 * The string must be six characters or longer
 * @param {String} input to test 
 * @returns true or false
 */
 function testForPassword(input) {
    let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
    return  testForSqlInjections(input) ? false : pattern.test(input)
    
}

/**
 * Takes input as String and blocks 
 * SQL injections from the user
 * 
 * @param {String} input to test 
 * @returns true or false
 */
 function testForSqlInjections(input) {
    let pattern = /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/;
    return pattern.test(input)
}

/**
    * Take a function to test for from validate.js,
    * and a input field to test value from
    * changes the border of the inputfield according 
    * to if it passes(green border) or not(red border)
    * @param {function} toTestFor 
    * @param {jQuery inputfield} input 
    * @returns false or current bool value from input
    */
 function checkForInput(toTestFor, input, bool, ERROR_MSG) {
    let testInput = input.val().trim()
    if(toTestFor(testInput) && testInput != '') {
        input.css("border", "3px solid #34F458") 
        ERROR_MSG.hide()
        return bool
    }else {
        input.css("border", "3px solid #F90A0A")
        ERROR_MSG.show()
        return false
    }
 }

 /**
  * Resets the border to the orignal color
  * @param {jQuery inputfield} inputField 
  */
  function resetBorder(inputField) {
     inputField.css("border", "1px solid #ced4da")
 }




