
/**
 *  Takes input as String and checks for only characters
 *  capital and lowercase allowed
 * @param {String} input to test 
 * @returns true or false
 */

function testForOnlyText(input) {
    // kolla efter -
    let pattern = /^[a-zA-ZåäöÅÄÖ]*$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}
/**
 * Takes input as String and checks for 5 numbers
 * (swedish standard for zip codes)
 * @param {String} input to test 
 * @returns true or false
 */
function testForZipCode(input) {
    // alt blanksteg mellan 123 34
    let pattern = /^[0-9]{5}/;
    return pattern.test(input)
}
/**
 * Takes input as a String and checks if 
 * it's an correct email
 * @param {String} input to test 
 * @returns true or false
 */
function testForEmail(input) {
    let pattern =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return testForSqlInjections(input) ? false : pattern.test(input)
}

function testForAddress(input) {
    let pattern = /^[a-zA-ZåäöÅÄÖ\s0-9]*$/;
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
    let pattern = /^[0-9]*$/;
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
    return  testForSqlInjections(input) ? pattern.test(input) : false
    
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




