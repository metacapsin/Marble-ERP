import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TaxesService } from '../../settings/taxes/taxes.service';
import { CustomersdataService } from '../../Customers/customers.service';
import { CategoriesService } from '../../settings/categories/categories.service';
@Component({
  selector: 'app-add-sales-return',
  standalone: true,
  imports: [CommonModule, SharedModule, MultiSelectModule, DropdownModule, CalendarModule],
  templateUrl: './add-sales-return.component.html',
  styleUrl: './add-sales-return.component.scss'
})
export class AddSalesReturnComponent {

  addReturnSalesForm!: FormGroup;
  public routes = routes;
  customerList = [];
  categoryList = [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  orderTaxList = []
  taxesListData = [];
  public itemDetails: number[] = [0];
  public selectedValue!: string;
  constructor(
    private customerService: CustomersdataService,
    private CategoriesService: CategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder,
  ) {
    this.addReturnSalesForm = this.fb.group({
      salesReturnInvoiceNumber: [''],
      salesReturnCustomerName: [''],
      salesReturnDate: [''],
      salesReturnOrderStatus: [''],
      salesReturnOrderTax: [''],
      salesReturnDiscount: [''],
      salesReturnShipping: [''],
      salesReturnTermsAndCondition: [''],
      salesReturnNotes: [''],
      salesReturnTotalAmount: [''],
      salesReturnItemDetails: this.fb.array([
        this.fb.group({
          salesReturnItemCategory: [''],
          salesReturnItemName: [''],
          salesReturnItemQuantity: [''],
          salesReturnItemUnitPrice: [''],
          salesReturnItemSubTotal: [''],
        })
      ]),
    });
  }

  get salesReturnItemDetails() {
    return this.addReturnSalesForm.controls['salesReturnItemDetails'] as FormArray;
  }
  deletesalesReturnItemDetails(salesReturnItemDetailsIndex: number) {
    this.salesReturnItemDetails.removeAt(salesReturnItemDetailsIndex);
  }
  addsalesReturnItemDetailsItem() {
    const item = this.fb.group({
      salesReturnItemCategory: [''],
      salesReturnItemQuantity: [''],
      salesReturnItemUnitPrice: [''],
      salesReturnItemSubTotal: [''],
    });
    this.salesReturnItemDetails.push(item);
  }

  ngOnInit(): void {

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;

      this.orderTaxList = [];
      for (const obj of this.taxesListData) {
        this.orderTaxList.push({
          _id: obj._id,
          taxRate: obj.taxRate,
          orderTaxName: obj.name + ' (' + obj.taxRate + '%' + ')',
        });
      }

    });

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;

      console.log("customer", this.customerList);

    });

    this.CategoriesService.getCategories().subscribe((resp:any) => {
      this.categoryList = resp.data;
    })

  }

  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    let shipping = +this.addReturnSalesForm.get('salesReturnShipping').value;
    let Discount = +this.addReturnSalesForm.get('salesReturnDiscount').value;
    let orderTax = +this.addReturnSalesForm.get('salesReturnOrderTax').value;

    const salesItems = this.addReturnSalesForm.get('salesItemDetails') as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get('salesReturnItemQuantity').value || 0;
      const unitPrice = +item.get('salesReturnItemUnitPrice').value || 0;
      const subtotal = quantity * unitPrice;

      totalAmount += subtotal;
      item.get('salesReturnItemSubTotal').setValue(subtotal.toFixed(2));
    });

    let addTaxTotal = totalAmount * orderTax / 100;
    totalAmount += addTaxTotal;
    totalAmount += shipping - Discount;

    this.addReturnSalesForm.patchValue({
      salesReturnDiscount: Discount.toFixed(2),
      salesReturnShipping: shipping.toFixed(2),
      salesReturnTotalAmount: totalAmount.toFixed(2)
    });
  }

  addReturnSalesFormSubmit() {
    if (this.addReturnSalesForm.valid) {
      console.log("valid form");
      console.log(this.addReturnSalesForm.value);
    }
    else {
      console.log("invalid form");

    }
  }
}
