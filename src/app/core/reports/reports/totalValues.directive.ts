import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[totalValueDirective]',
  standalone: true,
})
export class TotalValueDirective {
  private _data: any = [];
  private totalValue: number = 0;

  constructor(private elementRef: ElementRef) { }

  @Input() set data(value: any) {
    this._data = value;
    this.totalValue = 0;
    this._data.forEach(element => {
      this.totalValue += element.salesOrderTax;
    });
    this.elementRef.nativeElement.textContent = `₹ ${this.totalValue}`;
  }
}