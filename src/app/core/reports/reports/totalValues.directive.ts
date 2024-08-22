import { Directive, Input, ElementRef } from "@angular/core";
import { IndianCurrencyPipe } from "src/app/shared/directives/indian-currency.pipe";

@Directive({
  selector: "[totalValueDirective]",
  standalone: true,
})
export class TotalValueDirective {
  private _data: any = [];
  private _name: any;
  private totalValue: number = 0;
  salesTotalAmount: number = 0;
  dueAmount: number = 0;
  paidAmount: number = 0;
  purchaseCost: number = 0;
  purchaseTotalAmount: number = 0;
  constructor(
    private elementRef: ElementRef,
    private indianCurrencyPipe: IndianCurrencyPipe
  ) { }
  @Input() set name(value: any) {
    this._name = value;
    console.log(value);
  }
  @Input() set data(value: any) {
    this._data = value;
    console.log(this._name,this._data);
    this.totalValue = 0;
    if (this._name == "stockAdjustmentData") {
      if (this._data == false) {
        const setvalue = 0
        this.elementRef.nativeElement.textContent = `${setvalue}`;
      }
      this._data.forEach((element) => {
        if (element.currentQty) {
          this.totalValue += element.currentQty;
        }
        // const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `${this.totalValue} Sq. Feet.`;
      });
    }
    if (this._name == "slabsDaTa") {
      if (this._data == false) {
        const setvalue = 0;
        this.elementRef.nativeElement.textContent = `₹ ${setvalue}`;
      }
      this._data.forEach((element) => {
          if (element && element.totalSQFT) {
            const fixedTotalSQFT = parseFloat(element.totalSQFT.toFixed(2));
            this.totalValue += fixedTotalSQFT;
        }
        const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `${setValue}`;
      });
    }
    if (this._name == "lotDaTa") {
      if (this._data == false) {
        const setvalue = 0;
        this.elementRef.nativeElement.textContent = `₹ ${setvalue}`;
      }
      this._data.forEach((element) => {
          if (element && element.lotTotalCosting) {
            // const fixedlotTotalCosting = parseFloat(element.lotTotalCosting.toFixed(2));
            const fixedlotTotalCosting = Number(element.lotTotalCosting)
            this.totalValue += fixedlotTotalCosting;
        }
        const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `${'₹ '+setValue}`;
      });
    }
    if (this._name == "expensesDataName") {
      if (this._data == false) {
        const setvalue = 0
        this.elementRef.nativeElement.textContent = `₹ ${setvalue}`;
      }
      console.log(this.data);
      this._data.forEach((element) => {
        if (element.amount) {
          this.totalValue += element.amount;
        }
        const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `₹ ${setValue}`;
      });
    }
    if (this._name == "paymentIn") {
      if (this._data == false) {
        const setvalue = 0
        this.elementRef.nativeElement.textContent = `₹ ${setvalue}`;
      }
      this.totalValue = 0;
      this._data.forEach((element) => {
        if (element.amount) {
          this.totalValue += element.amount;
        }
        const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `₹ ${setValue}`;
      });
    }
    if (this._name == "paymentOut") {
      if (this._data == false) {
        const setvalue = 0
        this.elementRef.nativeElement.textContent = `₹ ${setvalue}`;
      }
      this.totalValue = 0;
      this._data.forEach((element) => {
        if (element.amount) {
          this.totalValue += element.amount;
        }
        const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `₹ ${setValue}`;
      });
    }
    if (this._name == "salesTaxReports") {
      if (this._data == false) {
        const setvalue = 0
        this.elementRef.nativeElement.textContent = `₹ ${setvalue}`;
      }
      this._data.forEach((element) => {
        if (element.salesOrderTax) {
          this.totalValue += element.salesOrderTax;
        }
        const setValue = this.indianCurrencyPipe.transform(this.totalValue);
        this.elementRef.nativeElement.textContent = `₹ ${setValue}`;
      });
    }
    if (this._name == "salesCreditReports") {
      console.log(this._data);
      if (this._data == false) {
        var paidAmount = 0;
        var dueAmount = 0;
        var salesTotalAmount = 0;
        this.elementRef.nativeElement.innerHTML = `     <td colspan="3"></td>
                                                        <td>Total Amount</td>
                                                        <td>₹ ${paidAmount}</td>
                                                        <td class="text-danger-dark">₹ ${dueAmount}</td>
                                                        <td >₹ ${salesTotalAmount}</td>
                                                        `;
      } else {
        this.paidAmount = 0;
        this.dueAmount = 0;
        this.salesTotalAmount = 0;

        this._data.forEach((element) => {
          if (element.paidAmount) {
            this.paidAmount += element.paidAmount;
          }
          if (element.dueAmount) {
            this.dueAmount += element.dueAmount;
          }
          if (element.salesTotalAmount) {
            this.salesTotalAmount += element.salesTotalAmount;
          }
        });

        const paidAmount = this.indianCurrencyPipe.transform(this.paidAmount);
        const dueAmount = this.indianCurrencyPipe.transform(this.dueAmount);
        const salesTotalAmount = this.indianCurrencyPipe.transform(
          this.salesTotalAmount
        );

        this.elementRef.nativeElement.innerHTML = `     <td colspan="3"></td>
                                                        <td>Total Amount</td>
                                                        <td>₹ ${paidAmount}</td>
                                                        <td class="text-danger-dark">₹ ${dueAmount}</td>
                                                        <td >₹ ${salesTotalAmount}</td>
                                                        `;
      }
    }
    if (this._name == "purchaseReports") {
      console.log(this._data);
      if (this._data == false) {
        this.paidAmount = 0;
        this.dueAmount = 0;
        this.purchaseCost = 0
        this.purchaseTotalAmount = 0
        this.elementRef.nativeElement.innerHTML = `     <td colspan="4"></td>
                                                        <td>Total Amount</td>
                                                        <td>₹ ${this.paidAmount}</td>
                                                        <td class="text-danger-dark">₹ ${this.dueAmount}</td>
                                                        <td >₹ ${this.purchaseCost}</td>
                                                        <td >₹ ${this.purchaseTotalAmount}</td>
                                                        `;
      } else {
        this.paidAmount = 0;
        this.dueAmount = 0;
        this.purchaseCost = 0
        this.purchaseTotalAmount = 0

        this._data.forEach((element) => {
          if (element.paidAmount) {
            this.paidAmount += element.paidAmount;
          }
          if (element.dueAmount) {
            this.dueAmount += element.dueAmount;
          }
          if (element.purchaseCost) {
            console.log(element.purchaseCost);
            this.purchaseCost += element.purchaseCost;
          }
          if (element.purchaseTotalAmount) {
            this.purchaseTotalAmount += element.purchaseTotalAmount;
          }
        });

        console.log(this.purchaseCost);
        console.log(this.purchaseTotalAmount);
        const paidAmount = this.indianCurrencyPipe.transform(this.paidAmount);
        const dueAmount = this.indianCurrencyPipe.transform(this.dueAmount);
        const purchaseCost = this.indianCurrencyPipe.transform(
          this.purchaseCost
        );
        const purchaseTotalAmount = this.indianCurrencyPipe.transform(
          this.purchaseTotalAmount
        );

        this.elementRef.nativeElement.innerHTML = `     <td colspan="4"></td>
                                                        <td>Total Amount</td>
                                                        <td>₹ ${paidAmount}</td>
                                                        <td class="text-danger-dark">₹ ${dueAmount}</td>
                                                        <td >₹ ${purchaseCost}</td>
                                                        <td >₹ ${purchaseTotalAmount}</td>
                                                        `;
      }
    }
    if (this._name == "salesReports") {
      console.log(this._data);
      if (this._data == false) {
        var paidAmount = 0;
        var dueAmount = 0;
        var salesTotalAmount = 0;
        this.elementRef.nativeElement.innerHTML = `     <td colspan="4"></td>
                                                        <td>Total Amount</td>
                                                        <td>₹ ${paidAmount}</td>
                                                        <td class="text-danger-dark">₹ ${dueAmount}</td>
                                                        <td >₹ ${salesTotalAmount}</td>
                                                        `;
      } else {
        this.paidAmount = 0;
        this.dueAmount = 0;
        this.salesTotalAmount = 0;

        this._data.forEach((element) => {
          if (element.paidAmount) {
            this.paidAmount += element.paidAmount;
          }
          if (element.dueAmount) {
            this.dueAmount += element.dueAmount;
          }
          if (element.salesTotalAmount) {
            this.salesTotalAmount += element.salesTotalAmount;
          }
        });

        const paidAmount = this.indianCurrencyPipe.transform(this.paidAmount);
        const dueAmount = this.indianCurrencyPipe.transform(this.dueAmount);
        const salesTotalAmount = this.indianCurrencyPipe.transform(
          this.salesTotalAmount
        );

        this.elementRef.nativeElement.innerHTML = `     <td colspan="4"></td>
                                                        <td>Total Amount</td>
                                                        <td>₹ ${paidAmount}</td>
                                                        <td class="text-danger-dark">₹ ${dueAmount}</td>
                                                        <td >₹ ${salesTotalAmount}</td>
                                                        `;
      }
    }
  }
}
