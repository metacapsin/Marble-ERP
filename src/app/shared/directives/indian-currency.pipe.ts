import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency',
  standalone: true
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: number | string, decimalPlaces: number = 2): string {
    if (value == null) return '';

     // Parse the value as a number if it's a string
     const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Check if the parsed value is a valid number
    if (isNaN(numericValue)) {
      return '';
    }

    // Use .toFixed() to format the number to the specified decimal places
    const formattedValue = numericValue.toFixed(decimalPlaces);

    // Split the formatted value into integer and fractional parts
    const [integerPart, fractionalPart] = formattedValue.split('.');

    // Apply Indian number formatting to the integer part
    let lastThree = integerPart.slice(-2);
    let otherNumbers = integerPart.slice(0, -2);

    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedIntegerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

    // Combine the formatted integer part with the fractional part if it exists
    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
  }
}
