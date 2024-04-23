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
import { TaxesService } from '../../settings/taxes/taxes.service';
import { debounceTime } from 'rxjs';
import { CustomersdataService } from '../../Customers/customers.service';
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
customerList=[];
categoryList=[
  {categoryName:'Earphone'},
  {categoryName:'Mobiles'},
  {categoryName:'Computers'}
]
orderStatusList=[
  {orderStatus:"Ordered"},
  {orderStatus:"Confirmed"},
  {orderStatus:"Processing"},
  {orderStatus:"Shipping"},
  {orderStatus:"Delivered"},
];
orderTaxList= []
taxesListData = [];
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
  private customerService: CustomersdataService,
  private taxService: TaxesService,
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
        salesItemDetails: this.fb.array([
          this.fb.group({
            salesItemCategory: [''],
            salesItemName:[''],
            salesItemQuantity: [''],
            salesItemUnitPrice: [''],
            salesItemSubTotal: [''],
          })
        ]),
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
      salesItemCategory: [''],
      salesItemQuantity: [''],
      salesItemUnitPrice: [''],
      salesItemSubTotal: [''],
    });
    this.salesItemDetails.push(item);
  }

  ngOnInit(): void {
    // const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;
    // salesItems.controls.forEach((item: FormGroup) => {
    //   const salesItemQuantityControl = item.get('salesItemQuantity');
  
    //   salesItemQuantityControl.valueChanges
    //     .subscribe(() => {
    //       this.calculateTotalAmount();
    //     });
    // });
    // const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;
    // salesItems.valueChanges.subscribe((any:void) => this.calculateTotalAmount());
    // this.addSalesForm.get('salesDiscount').valueChanges.subscribe(() => this.calculateTotalAmount())

    this.taxService.getAllTaxList().subscribe((resp:any) => {
      this.taxesListData = resp.data;
    
      // console.log(this.taxesListData); 
      this.orderTaxList = [];
      for (const obj of this.taxesListData) { 
        this.orderTaxList.push({
          _id: obj._id,
          taxRate: obj.taxRate,
          orderTaxName: obj.name +  ' (' + obj.taxRate + '%'+')',
        });
      }
    
      // console.log(this.orderTaxList);
    });

    this.customerService.GetCustomerData().subscribe((resp:any) => {
      this.customerList = resp;

      console.log("customer", this.customerList);
      
    })

  }
  
  // calculateTotalAmount() {
  //   console.log("Enter in caltotal");
  //   let totalAmount = 0;
  //   let shipping = 0;
  //   let Discount = 0;
  //   let orderTax = 0;
  //   let addtaxTotal = 0; 
  //   const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;
    
  //   salesItems.controls.forEach((item: FormGroup) => {
  //     const quantity = +item.get('salesItemQuantity').value;
  //     const unitPrice = +item.get('salesItemUnitPrice').value;
  //     const subtotal = (quantity * unitPrice);

  //     shipping = +this.addSalesForm.get('salesShipping').value;
  //     Discount = +this.addSalesForm.get('salesDiscount').value;
  //     orderTax = +this.addSalesForm.get('salesOrderTax').value;
  //     totalAmount += ((shipping + subtotal) - Discount);
  //     addtaxTotal += totalAmount * orderTax/100;
  //     totalAmount += addtaxTotal;
  
  //     item.get('salesItemSubTotal').setValue(subtotal.toFixed(2)); 
  //   });
  
  //   this.addSalesForm.patchValue({

  //     salesDiscount: Discount.toFixed(2),
  //     salesShipping: shipping.toFixed(2),
  //     salesTotalAmount: totalAmount.toFixed(2)
  //   });
  // }

  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    let shipping = +this.addSalesForm.get('salesShipping').value;
    let Discount = +this.addSalesForm.get('salesDiscount').value;
    let orderTax = +this.addSalesForm.get('salesOrderTax').value;
  
    const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;
    
    salesItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get('salesItemQuantity').value || 0;
      const unitPrice = +item.get('salesItemUnitPrice').value || 0;
      const subtotal = quantity * unitPrice;
  
      totalAmount += subtotal;
      item.get('salesItemSubTotal').setValue(subtotal.toFixed(2)); 
    });
  
    let addTaxTotal = totalAmount * orderTax / 100;
    totalAmount += addTaxTotal;
    totalAmount += shipping - Discount;
    
    this.addSalesForm.patchValue({
      salesDiscount: Discount.toFixed(2),
      salesShipping: shipping.toFixed(2),
      salesTotalAmount: totalAmount.toFixed(2)
    });
  }
  
  
  


// addItem() {
//   this.itemDetails.push(0);
// }
// deleteItem(index:number){
//   this.itemDetails.splice(index,1)
// }
// addCharges(){
//   this.chargesArray.push(1)
// }
// deleteCharges(index:number){
//   this.chargesArray.splice(index, 1)
// }
// recurringInvoiceFunc(){
//   this.recurringInvoice = !this.recurringInvoice
// }
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
