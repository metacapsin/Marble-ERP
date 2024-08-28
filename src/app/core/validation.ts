export const validationRegex = {
  emailRGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phoneRGEX: /^\d{10}$/,
  postalZipRGEX: /^\d{6}$/, // Adjusted for exactly 6 digits
  cityNameRGEX: /^[a-zA-Z\s\-]{3,50}$/, // Adjusted for 3 to 50 characters
  companyNameRGEX: /^[a-zA-Z0-9\s\.\-]{3,50}$/, // Adjusted for 3 to 50 alphanumeric characters
  addressRegex: /^.{3,50}$/, // Adjusted for 3 to 50 characters
  stateRegex: /^[a-zA-Z\s]{3,50}$/,
};
