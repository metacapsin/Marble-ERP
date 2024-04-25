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
  selector: 'app-add-purchase-return',
  standalone: true,
  imports: [CommonModule,SharedModule, MultiSelectModule, DropdownModule,CalendarModule ],
  templateUrl: './add-purchase-return.component.html',
  styleUrl: './add-purchase-return.component.scss'
})
export class AddPurchaseReturnComponent {
 
  addPurchaseReturnForm!: FormGroup;
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
date = new FormControl(new Date());

constructor(
  private customerService: CustomersdataService,
  private taxService: TaxesService,
  private fb: FormBuilder,
    ) {
      this.addPurchaseReturnForm = this.fb.group({
        purchaseReturnInvoiceNumber: [''],
        purchaseReturnSupplierName: [''],
        purchaseReturnDate: [''],
        purchaseReturnOrderStatus: [''],
        purchaseReturnOrderTax: [''],
        purchaseReturnDiscount: [''],
        purchaseReturnShipping: [''],
        purchaseReturnTermsAndCondition: [''],
        purchaseReturnNotes: [''],
        purchaseReturnTotalAmount: [''],
        purchaseReturnDetails: this.fb.array([
          this.fb.group({
            purchaseReturnItemCategory: [''],
            purchaseReturnQuantity: [''],
            purchaseReturnUnitPrice: [''],
            purchaseItemSubTotal: [''],
            purchaseReturnItemName:[''],
          
          })
        ]),
        
    
    });
  }

  get purchaseReturnDetails() {
    return this.addPurchaseReturnForm.controls['purchaseReturnDetails'] as FormArray;
  }
  deletepurchaseReturnDetails(purchaseReturnDetailsIndex: number) {
    this.purchaseReturnDetails.removeAt(purchaseReturnDetailsIndex);
  }
  addpurchaseReturnDetailsItem() {
    const item = this.fb.group({
      purchaseReturnItemCategory: [''],
      purchaseReturnQuantity: [''],
      purchaseReturnUnitPrice: [''],
      purchaseItemSubTotal: [''],
      purchaseReturnItemName:[''],
    
    });
    this.purchaseReturnDetails.push(item);
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
      let shipping = +this.addPurchaseReturnForm.get('purchaseShipping').value;
      let Discount = +this.addPurchaseReturnForm.get('purchaseDiscount').value;
      let orderTax = +this.addPurchaseReturnForm.get('purchaseOrderTax').value;
    
      const purchaseItems = this.addPurchaseReturnForm.get('purchaseReturnItemDetails') as FormArray;
      
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
      
      this.addPurchaseReturnForm.patchValue({
        purchaseDiscount: Discount.toFixed(2),
        purchaseShipping: shipping.toFixed(2),
        purchaseTotalAmount: totalAmount.toFixed(2)
      });
    }
addPurchaseReturnFormSubmit(){
if(this.addPurchaseReturnForm.valid){
  console.log("valid form");
  console.log(this.addPurchaseReturnForm.value);
}
else{
  console.log("invalid form");
  
}
}
}