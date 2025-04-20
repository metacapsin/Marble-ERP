import { FormGroup, ValidatorFn } from '@angular/forms';

export const validationRegex = {
  phoneRGEX: /^[0-9]{10}$/,
  postalZipRGEX: /^\d{6}$/, // Adjusted for exactly 6 digits
  cityNameRGEX: /^[a-zA-Z\s\-]{3,50}$/, // Adjusted for 3 to 50 characters
  companyNameRGEX: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\.\-]{3,50}$/, // Adjusted for 3 to 50 characters, must include at least one letter
  stateRegex: /^[a-zA-Z\s]{3,50}$/,
  billingAddressRegex: /^(?!\s)(?!.*\s{3})(?=.*[a-zA-Z])(.{3,100})$/s,
  descriptionRegex: /^(?=.*[a-zA-Z]).{3,500}$/s,


  // staff mostly 
  aadharRegex: /^\d{4}\s\d{4}\s\d{4}$/,
  passportRegex: /^[A-Z][1-9]\d\s?\d{4}[1-9]$/,
  panCardRegex: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
  voterIdRegex: /^[A-Z]{3}[0-9]{7}$/,
  ssnRegex: /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/,
  drivingLicenceRegex: /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/,
  residentPermitRegex: /^[A-Z]{2}[0-9]{6}$/,
  nationalIdRegex: /^\d{4}\s\d{4}\s\d{4}$/,

  // bank details 
  upiIdRegex: /^[a-zA-Z0-9.-]{2, 256}@[a-zA-Z][a-zA-Z]{2, 64}$/,  // 3 to 50 characters
  bankAccountNumberRegex: /^[0-9]{9,18}$/, // 9 to 18 digits
  ifscCodeRegexL: /^[A-Z]{4}0[A-Z0-9]{6}$/,   // 11 characters
  nameREGEX : /^(?=[^\s])(?=.*[a-zA-Z])([a-zA-Z\d\/\- ]{3,50})$/,
  // common regex
  oneToFiftyCharRegex: /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,50})$/,                        // one to fifty alpahnueric characters
  threeTothirtyCharRegex: /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/,   // three to thirty alphanumeric characters
  threeToFiftyCharRegex: /^[A-Za-z\s]{3,50}$/,                        // three to fifty alpahnueric characters
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,16}$/,  // 8 to 16 characters, one uppercase, one lowercase, one digit, one special character
  address3To500Regex: /^(?!\s)(?!.*\s{3})(.{3,500})$/s,     // 3 to 500 characters
  pinCodeRegex: /^[1-9][0-9]{2}\s?[0-9]{3}$/,
  emailRegex: /^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,   // email regex
  oneToOneLakhRegex:/^(0|[1-9][0-9]{0,6})(\.\d+)?$/




};

export function atLeastOneRequiredValidator(): ValidatorFn {
  return (formGroup: FormGroup) => {
    const taxableAmount = formGroup.get('taxableAmount')?.value;
    const nonTaxableAmount = formGroup.get('nonTaxableAmount')?.value;

    if (!taxableAmount && !nonTaxableAmount) {
      return { atLeastOneRequired: true }; // return error if both are empty
    }

    return null; // return null if one or both are filled
  };
}
