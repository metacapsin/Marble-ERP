import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { Validators } from 'ngx-editor';
import { el } from '@fullcalendar/core/internal-common';
@Component({
  selector: 'app-addsales',
  standalone: true,
  imports: [CommonModule,SharedModule, MultiSelectModule, DropdownModule,CalendarModule ],
  templateUrl: './addsales.component.html',
  styleUrl: './addsales.component.scss'
})
export class AddsalesComponent {
  
  addSalesForm!: FormGroup;
public routes = routes;
CustomerList=[
  {customerName:"Adnan"},
  {customerName:"Nadim"},
  {customerName:"Kavya"},
]
productsList=[
  {productsName:'Earphone'},
  {productsName:'Mobiles'},
  {productsName:'Computers'}
]
orderStatusList=[
  {orderStatus:"Ordered"},
  {orderStatus:"Confirmed"},
  {orderStatus:"Processing"},
  {orderStatus:"Shipping"},
  {orderStatus:"Delivered"},
];
orderTaxList=[
  {orderTax:"GST"},
  {orderTax:"GST"},
  {orderTax:"GST"},
]
// public checkboxes: string[] = [];
public itemDetails:  number[] = [0];
public chargesArray: number[]= [0];
public recurringInvoice   = false;
public selectedValue! : string  ;
date = new FormControl(new Date());

// public openCheckBoxes(val: string) {
//   if (this.checkboxes[0] != val) {
//     this.checkboxes[0] = val;
//   } else {
//     this.checkboxes = [];
//   }
// }
constructor(
private fb: FormBuilder,
    ) {
      this.addSalesForm = this.fb.group({
        salesInvoiceNumber: [''],
        salesCustomerName: [''],
        salesDate: [''],
        salesOrderStatus: [''],
        salesOrderTax: [''],
        salesDiscount: [''],
        salesShipping: [''],
        salesTermsAndCondition: [''],
        salesNotes: [''],
        salesTotalAmount: [''],
        salesItemDetails: this.fb.array([]),
    });
  }

  get salesItemDetails() {
    return this.addSalesForm.controls['salesItemDetails'] as FormArray;
  }
  deletesalesItemDetails(salesItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesItemDetailsIndex);
  }
  addsalesItemDetailsItem() {
    const item = this.fb.group({
      salesItemProducts: [''],
      salesItemQuantity: [''],
      salesItemUnitPrice: [''],
      salesItemDiscount: [''],
      salesItemTax: [''],
      salesItemSubTotal: [''],
    });
    this.salesItemDetails.push(item);
  }

  ngOnInit(): void {
    // const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;
    // salesItems.valueChanges.subscribe(() => this.calculateTotalAmount());
    // this.addSalesForm.get('salesShipping').valueChanges.subscribe(() => {
    //   this.calculateTotalAmount();
    // })
    // this.addSalesForm.get('salesDiscount').valueChanges.subscribe(() => {
    //   this.calculateTotalAmount();
    // })
  }
  
  // calculateTotalAmount() {
  //   console.log("Enter in caltotal");
  //   let totalAmount = 0;
  //   let shipping = 0;
  //   let Discount = 0;
  //   const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;
    
  //   salesItems.controls.forEach((item: FormGroup) => {
  //     const quantity = +item.get('salesItemQuantity').value;
  //     const unitPrice = +item.get('salesItemUnitPrice').value;
  //     const discount = +item.get('salesItemDiscount').value;
  //     const tax = +item.get('salesItemTax').value;
  //     const subtotal = (quantity * unitPrice) - discount + tax;

  //     shipping = +this.addSalesForm.get('salesShipping').value;
  //     Discount = +this.addSalesForm.get('salesDiscount').value;
  //     totalAmount += (shipping + subtotal) - Discount;
  //     // totalAmount += subtotal;
  
  //     item.get('salesItemSubTotal').setValue(subtotal.toFixed(2)); // Corrected the variable name
  //   });
  
  //   // Update the total amount in the form
  //   this.addSalesForm.patchValue({

  //     salesDiscount: Discount.toFixed(2),
  //     salesShipping: shipping.toFixed(2),
  //     salesTotalAmount: totalAmount.toFixed(2)
  //   });
  // }
  
  


addItem() {
  this.itemDetails.push(0);
}
deleteItem(index:number){
  this.itemDetails.splice(index,1)
}
addCharges(){
  this.chargesArray.push(1)
}
deleteCharges(index:number){
  this.chargesArray.splice(index, 1)
}
recurringInvoiceFunc(){
  this.recurringInvoice = !this.recurringInvoice
}
// selecedList: data[] = [
//   {value: 'By month'},
//   {value: 'March'},
//   {value: 'April'},
//   {value: 'May'},
//   {value: 'June'},
//   {value: 'July'}
// ];
addSalesFormSubmit(){
if(this.addSalesForm.valid){
  console.log("valid form");
  console.log(this.addSalesForm.value);
}
else{
  console.log("invalid form");
  
}
}
}
