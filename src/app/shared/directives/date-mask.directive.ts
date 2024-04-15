import { Directive } from '@angular/core';
import Inputmask from 'inputmask';
import { Calendar } from 'primeng/calendar';
@Directive({
  selector: '[dateMask]',
  standalone: true
})
export class DateMaskDirective {
  constructor(private primeCalendar: Calendar) { }

  ngAfterViewInit() {
    new Inputmask( this.getDateMask() ).mask( this.getHTMLInput() );
  }

  getHTMLInput(): HTMLInputElement {
    return this.primeCalendar.el.nativeElement.querySelector('input');
  }

  getDateMask(): string {
    if(this.primeCalendar.timeOnly) {
      return '99:99';
    } else if(this.primeCalendar.showTime) {
      return '99/99/9999 99:99';
    } else {
      return '99/99/9999';
    }
  }
}
