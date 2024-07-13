import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency',
  standalone: true
})
export class IndianCurrencyPipe implements PipeTransform {

  // transform(value: number | string): string {
  //   if (value == null) return '';

  //   let [integerPart, fractionalPart] = value.toString().split('.');

  //   // Remove commas from the integer part
  //   integerPart = integerPart.replace(/,/g, '');
    
  //   // Format the integer part
  //   let lastThree = integerPart.slice(-3);
  //   let otherNumbers = integerPart.slice(0, -3);

  //   if (otherNumbers != '') lastThree = ',' + lastThree;
  //   let formattedIntegerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  //   // Combine the formatted integer part with the fractional part if it exists
  //   if (fractionalPart) {
  //     return `${formattedIntegerPart}.${fractionalPart}`;
  //   } else {
  //     return formattedIntegerPart;
  //   }
  // }



  transform(value: number | string, decimalPlaces: number = 3): string {
    if (value == null) return '';

    // Parse the value as a number
    const numericValue = Number(value);

    // Check if the parsed value is a valid number
    if (isNaN(numericValue)) {
      return '';
    }

    // Use .toFixed() to format the number to the specified decimal places
    const formattedValue = numericValue.toFixed(decimalPlaces);

    // Split the formatted value into integer and fractional parts
    const parts = formattedValue.split('.');

    // Format the integer part with commas for thousands separator
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and fractional parts
    if (parts.length === 1) {
      // If there's no fractional part, return just the formatted integer part
      return integerPart;
    } else {
      // If there's a fractional part, return the formatted number with the fractional part
      return `${integerPart}.${parts[1]}`;
    }
  }

}
