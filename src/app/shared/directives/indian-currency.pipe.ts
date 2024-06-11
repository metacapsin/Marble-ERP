import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency',
  standalone: true
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null) return '';

    let [integerPart, fractionalPart] = value.toString().split('.');

    // Remove commas from the integer part
    integerPart = integerPart.replace(/,/g, '');
    
    // Format the integer part
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, -3);

    if (otherNumbers != '') lastThree = ',' + lastThree;
    let formattedIntegerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

    // Combine the formatted integer part with the fractional part if it exists
    if (fractionalPart) {
      return `${formattedIntegerPart}.${fractionalPart}`;
    } else {
      return formattedIntegerPart;
    }
  }

}
