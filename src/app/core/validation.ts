export const validationPatterns = {
    emailRGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneRGEX: /^\d{10}$/,
    postalZipRGEX: /^\d{5}(-\d{4})?$/,
    cityNameRGEX: /^[a-zA-Z\s\-]{2,50}$/,
    companyNameRGEX: /^[a-zA-Z0-9\s\.\-]{2,100}$/,
    addressRegex: /^.{3,500}$/,
};
