import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { Validators } from 'ngx-editor';
import { el } from '@fullcalendar/core/internal-common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-purchase',
  standalone: true,
  imports: [CommonModule,SharedModule, MultiSelectModule, DropdownModule,CalendarModule ],
  templateUrl: './add-purchase.component.html',
  styleUrl: './add-purchase.component.scss'
})
export class AddPurchaseComponent {

  addPurchaseForm!: FormGroup;
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
      this.addPurchaseForm = this.fb.group({
        purchaseInvoiceNumber: [''],
        purchaseCustomerName: [''],
        purchaseDate: [''],
        purchaseOrderStatus: [''],
        purchaseOrderTax: [''],
        purchaseDiscount: [''],
        purchaseShipping: [''],
        purchaseTermsAndCondition: [''],
        purchaseNotes: [''],
        purchaseTotalAmount: [''],
        purchaseItemDetails: this.fb.array([]),
        
    });
  }

  get purchaseItemDetails() {
    return this.addPurchaseForm.controls['purchaseItemDetails'] as FormArray;
  }
  deletePurchaseItemDetails(purchaseItemDetailsIndex: number) {
    this.purchaseItemDetails.removeAt(purchaseItemDetailsIndex);
  }
  addPurchaseItemDetailsItem() {
    const item = this.fb.group({
      purchaseItemProducts: [''],
      purchaseItemQuantity: [''],
      purchaseItemUnitPrice: [''],
      purchaseItemDiscount: [''],
      purchaseItemTax: [''],
      purchaseItemSubTotal: [''],
    });
    this.purchaseItemDetails.push(item);
  }

  ngOnInit(): void {
    // const purchaseItems = this.addPurchaseForm.get('purchaseItemDetails') as FormArray;
    // purchaseItems.valueChanges.subscribe(() => this.calculateTotalAmount());
    // this.addPurchaseForm.get('purchaseShipping').valueChanges.subscribe(() => {
    //   this.calculateTotalAmount();
    // })
    // this.addPurchaseForm.get('purchaseDiscount').valueChanges.subscribe(() => {
    //   this.calculateTotalAmount();
    // })
  }
  
  // calculateTotalAmount() {
  //   console.log("Enter in caltotal");
  //   let totalAmount = 0;
  //   let shipping = 0;
  //   let Discount = 0;
  //   const purchaseItems = this.addPurchaseForm.get('purchaseItemDetails') as FormArray;
    
  //   purchaseItems.controls.forEach((item: FormGroup) => {
  //     const quantity = +item.get('purchaseItemQuantity').value;
  //     const unitPrice = +item.get('purchaseItemUnitPrice').value;
  //     const discount = +item.get('purchaseItemDiscount').value;
  //     const tax = +item.get('purchaseItemTax').value;
  //     const subtotal = (quantity * unitPrice) - discount + tax;

  //     shipping = +this.addPurchaseForm.get('purchaseShipping').value;
  //     Discount = +this.addPurchaseForm.get('purchaseDiscount').value;
  //     totalAmount += (shipping + subtotal) - Discount;
  //     // totalAmount += subtotal;
  
  //     item.get('purchaseItemSubTotal').setValue(subtotal.toFixed(2)); // Corrected the variable name
  //   });
  
  //   // Update the total amount in the form
  //   this.addPurchaseForm.patchValue({

  //     purchaseDiscount: Discount.toFixed(2),
  //     purchaseShipping: shipping.toFixed(2),
  //     purchaseTotalAmount: totalAmount.toFixed(2)
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
addPurchaseFormSubmit(){
  console.log(this.addPurchaseForm.value)
if(this.addPurchaseForm.valid){
  console.log("valid form");
  console.log(this.addPurchaseForm.value);
}
else{
  console.log("invalid form");
  
}
}
}
