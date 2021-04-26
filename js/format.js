// format phonenumbers

const formatPhoneNumber = (phoneNumber) => {
    let formatPhoneNumber;
  
    if(phoneNumber.charAt(1) == 8){
      formatPhoneNumber = `${phoneNumber.substring(0,2)}-${phoneNumber.substring(3,6)} ${phoneNumber.substring(6,8)} ${phoneNumber.substring(8)}`
    }
    if(phoneNumber.charAt(1) == 7){
      formatPhoneNumber = `${phoneNumber.substring(0,3)}-${phoneNumber.substring(3,6)} ${phoneNumber.substring(6,8)} ${phoneNumber.substring(8)}`
    }
    
    return formatPhoneNumber
  }

  const formatPhoneNumberForDB = (phoneNumber) => { return phoneNumber.replace(/\D/g,'')}

 
  // format zipcodes

  const formatZipCode = (zipCode) => {return `${zipCode.substring(0,3)} ${zipCode.substring(3)}`}

  const formatZipForDB = (zipCode) => { return zipCode.replace(/\D/g,'') }

  // format string to uppercase

  const formatFirstLetterToUpperCase = (string) => {return string.charAt(0).toUpperCase() + string.slice(1)}





  