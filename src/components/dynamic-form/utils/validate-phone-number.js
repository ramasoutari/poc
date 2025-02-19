import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function validatePhoneNumber(phoneNumber, value) {
  if (phoneNumber && phoneNumber.length) {

    try {
      const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        const country = phoneNumberObj.country;
        if (country === 'JO') {
          const localNumber = phoneNumberObj.nationalNumber.toString();
          if (localNumber.startsWith('77') || localNumber.startsWith('78') || localNumber.startsWith('79')) {
            return true;
          } else {
            return false;
          }
        } else {
          // For other countries, just validate the number
          return true;
        }
      }
    } catch (error) {
      console.log('phone error', error);
    }
  }
  return false;
}