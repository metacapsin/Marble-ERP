import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TaxesService } from '../../settings/taxes/taxes.service';
import { CustomersdataService } from '../../Customers/customers.service';
import { SalesService } from '../sales.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CategoriesService } from '../../settings/categories/categories.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-addsales',
  standalone: true,
  imports: [CommonModule,SharedModule, MultiSelectModule, DropdownModule,CalendarModule, ToastModule ],
  templateUrl: './addsales.component.html',
  styleUrl: './addsales.component.scss',
  providers:[MessageService]
})
export class AddsalesComponent {
  
  addSalesForm!: FormGroup;
public routes = routes;
customerList=[];
categoryList=[];
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

constructor(
  private router: Router,
  private messageService: MessageService,
  private Service: SalesService,
  private customerService: CustomersdataService,
  private CategoriesService: CategoriesService,
  private taxService: TaxesService,
private fb: FormBuilder,
    ) {
      this.addSalesForm = this.fb.group({
        customer: [''],
        salesDate: [''],
        salesDiscount: [''],
        salesInvoiceNumber: [''],
        salesItemDetails: this.fb.array([
          this.fb.group({
            salesItemCategory: [''],
            salesItemQuantity: [''],
            salesItemUnitPrice: [''],
            salesItemSubTotal: [''],
          })
        ]),
        salesNotes: [''],
        salesOrderStatus: [''],
        salesOrderTax: [''],
        salesShipping: [''],
        salesTermsAndCondition: [''],
        salesTotalAmount: [''],
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

    this.taxService.getAllTaxList().subscribe((resp:any) => {
      this.taxesListData = resp.data;
    
      this.orderTaxList = [];
      for (const obj of this.taxesListData) { 
        this.orderTaxList.push({
          _id: obj._id,
          taxRate: obj.taxRate,
          orderTaxName: obj.name +  ' (' + obj.taxRate + '%'+')',
        });
      }
    
    });

    this.CategoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    })

    this.customerService.GetCustomerData().subscribe((resp:any) => {
      this.customerList = resp;

      console.log("customer", this.customerList);
      
    })

  }
  

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
  
  

addSalesFormSubmit(){
if(this.addSalesForm.valid){
  console.log("valid form");
  console.log(this.addSalesForm.value);

  this.Service.AddSalesData(this.addSalesForm.value).subscribe((resp: any) => {
    console.log(resp);
    if (resp) {
      if (resp.status === "success") {
        const message = "Sales has been added";
        this.messageService.add({ severity: "success", detail: message });
        setTimeout(() => {
          this.router.navigate(["/sales"]);
        }, 400);
      } else {
        const message = resp.message;
        this.messageService.add({ severity: "error", detail: message });
      }
    }
  });
}
else{
  console.log("invalid form");
  
}
}

}
