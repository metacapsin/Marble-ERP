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
  selector: 'app-add-purchase',
  standalone: true,
  imports: [CommonModule,SharedModule, MultiSelectModule, DropdownModule,CalendarModule ],
  templateUrl: './add-purchase.component.html',
  styleUrl: './add-purchase.component.scss'
})
export class AddPurchaseComponent {

  addPurchaseForm!: FormGroup;
public routes = routes;
SupplierList=[
  {SupplierName:"Adnan"},
  {SupplierName:"Nadim"},
  {SupplierName:"Kavya"},
]
categoryList=[
  {categoryName:'Earphone'},
  {categoryName:'Mobiles'},
  {categoryName:'Computers'}
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
orderTaxList= []
taxesListData = [];

public itemDetails:  number[] = [0];
public chargesArray: number[]= [0];
public recurringInvoice   = false;
public selectedValue! : string  ;
constructor( 
  private customerService: CustomersdataService,
  private taxService: TaxesService,
private fb: FormBuilder,
    ) {
      this.addPurchaseForm = this.fb.group({
        purchaseInvoiceNumber: [''],
        purchaseSupplierName: [''],
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
    
    });


  }
  


  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    let shipping = +this.addPurchaseForm.get('purchaseShipping').value;
    let Discount = +this.addPurchaseForm.get('purchaseDiscount').value;
    let orderTax = +this.addPurchaseForm.get('purchaseOrderTax').value;
  
    const purchaseItems = this.addPurchaseForm.get('purchaseItemDetails') as FormArray;
    
    purchaseItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get('purchaseItemQuantity').value || 0;
      const unitPrice = +item.get('purchaseItemUnitPrice').value || 0;
      const subtotal = quantity * unitPrice;
  
      totalAmount += subtotal;
      item.get('purchaseItemSubTotal').setValue(subtotal.toFixed(2)); 
    });
  
    let addTaxTotal = totalAmount * orderTax / 100;
    totalAmount += addTaxTotal;
    totalAmount += shipping - Discount;
    
    this.addPurchaseForm.patchValue({
      purchaseDiscount: Discount.toFixed(2),
      purchaseShipping: shipping.toFixed(2),
      purchaseTotalAmount: totalAmount.toFixed(2)
    });
  }


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
