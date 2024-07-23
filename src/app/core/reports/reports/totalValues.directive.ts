import { Directive, Input, ElementRef } from '@angular/core';
import { IndianCurrencyPipe } from 'src/app/shared/directives/indian-currency.pipe';

@Directive({
  selector: '[totalValueDirective]',
  standalone: true,
})
export class TotalValueDirective {
  private _data: any = [];
  private totalValue: number = 0;

  constructor(private elementRef: ElementRef,private indianCurrencyPipe: IndianCurrencyPipe) { }

  @Input() set data(value: any) {
    this._data = value;
    this.totalValue = 0;
    this._data.forEach(element => {
      this.totalValue += element.salesOrderTax;
    });
    const setValue = this.indianCurrencyPipe.transform(this.totalValue)
    console.log(setValue);
    this.elementRef.nativeElement.textContent = `₹ ${setValue}`;
  }
}