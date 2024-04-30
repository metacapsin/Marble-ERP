import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TaxesService } from '../../settings/taxes/taxes.service';
import { CustomersdataService } from '../../Customers/customers.service';
import { CategoriesService } from '../../settings/categories/categories.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SalesReturnService } from '../sales-return.service';
import { UnitsService } from '../../settings/units/units.service';
import { SubCategoriesService } from '../../settings/sub-categories/sub-categories.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-add-sales-return',
  standalone: true,
  imports: [CommonModule, SharedModule, MultiSelectModule, DropdownModule, CalendarModule, ToastModule],
  templateUrl: './add-sales-return.component.html',
  styleUrl: './add-sales-return.component.scss',
  providers: [MessageService]
})
export class AddSalesReturnComponent {

  addReturnSalesForm!: FormGroup;
  public routes = routes;

  public searchData_id = '';
  addTaxTotal: any;
  customerList = [];
  categoryList = [];
  subCategoryList = [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  unitListData = []
  orderTaxList = []
  taxesListData = [];
  customerById = {};
  public itemDetails: number[] = [0];
  public selectedValue!: string;
  constructor(
    private router: Router,
    private messageService: MessageService,
    private Service: SalesReturnService,
    private customerService: CustomersdataService,
    private unitService: UnitsService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder,
  ) {
    this.addReturnSalesForm = this.fb.group({
      customer: [''],
      returnDate: [''],
      salesDiscount: ['', [Validators.min(0)]],
      salesInvoiceNumber: [''],
      salesItemDetails: this.fb.array([
        this.fb.group({
          salesItemCategory: [''],
          salesItemSubCategory: [''],
          salesItemName: [''],
          salesItemQuantity: ['', [Validators.min(0)]],
          salesItemUnitPrice: ['', [Validators.min(0)]],
          salesItemSubTotal: ['', [Validators.min(0)]],
        })
      ]),
      salesNotes: [''],
      returnOrderStatus: [''],
      salesOrderTax: [''],
      appliedTax: [''],
      salesShipping: ['', [Validators.min(0)]],
      salesTermsAndCondition: [''],
      salesTotalAmount: [''],
      unit: [''],
      otherCharges: ['', [Validators.min(0)]]
    });
  }

  get salesItemDetails() {
    return this.addReturnSalesForm.controls['salesItemDetails'] as FormArray;
  }
  deletesalesReturnItemDetails(salesReturnItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesReturnItemDetailsIndex);
  }
  addsalesReturnItemDetailsItem() {
    const item = this.fb.group({
      salesItemCategory: [''],
      salesItemSubCategory: [''],
      salesItemName: [''],
      salesItemQuantity: ['', [Validators.min(0)]],
      salesItemUnitPrice: ['', [Validators.min(0)]],
      salesItemSubTotal: ['', [Validators.min(0)]],
    });
    this.salesItemDetails.push(item);
  }

  getSalesItemQuantityError(index: number) {
    const salesItemDetailsForm = this.addReturnSalesForm.get('salesItemDetails') as FormArray;
    const quantityControl = salesItemDetailsForm.at(index).get('salesItemQuantity');
    return quantityControl && quantityControl.hasError('min') && quantityControl.touched;
  }

  getSalesItemUnitPriceError(index: number) {
    const salesItemDetailsForm = this.addReturnSalesForm.get('salesItemDetails') as FormArray;
    const unitPriceControl = salesItemDetailsForm.at(index).get('salesItemUnitPrice');
    return unitPriceControl && unitPriceControl.hasError('min') && unitPriceControl.touched;
  }

  getSalesItemSubTotalError(index: number) {
    const salesItemDetailsForm = this.addReturnSalesForm.get('salesItemDetails') as FormArray;
    const subTotalControl = salesItemDetailsForm.at(index).get('salesItemSubTotal');
    return subTotalControl && subTotalControl.hasError('min') && subTotalControl.touched;
  }


  ngOnInit(): void {

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;
      console.log("customer", this.customerList);
    });

    this.unitService.getAllUnitList().subscribe((resp: any) => {
      this.unitListData = resp.data;
    })

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = [];
      this.taxesListData.forEach(element => {
        this.orderTaxList.push({
          orderTaxName: element.name + ' (' + element.taxRate + '%' + ')',
          orderNamevalue: element
        });
      });
    });

    this.CategoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
  }

  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalTax = 0
    let totalAmount = 0;
    if (Array.isArray(this.addReturnSalesForm.get('salesOrderTax').value)) {
      this.addReturnSalesForm.get('salesOrderTax').value.forEach(element => {
        totalTax += Number(element.taxRate);
      });
    } else {
      totalTax += Number(this.addReturnSalesForm.get('salesOrderTax').value);
    }
    let shipping = +this.addReturnSalesForm.get('salesShipping').value;
    let Discount = +this.addReturnSalesForm.get('salesDiscount').value;
    let otherCharges = +this.addReturnSalesForm.get('otherCharges').value;

    const salesItems = this.addReturnSalesForm.get('salesItemDetails') as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get('salesItemQuantity').value || 0;
      const unitPrice = +item.get('salesItemUnitPrice').value || 0;
      const subtotal = quantity * unitPrice;

      totalAmount += subtotal;
      item.get('salesItemSubTotal').setValue(subtotal.toFixed(2));
    });

    this.addTaxTotal = totalAmount * totalTax / 100;
    totalAmount += this.addTaxTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.addReturnSalesForm.patchValue({
      salesDiscount: Discount.toFixed(2),
      salesShipping: shipping.toFixed(2),
      otherCharges: otherCharges.toFixed(2),
      salesTotalAmount: totalAmount.toFixed(2)
    });
  }

  onCustomerSelect(customerId: string) {
    const selectedCustomer = this.customerList.find(customer => customer._id === customerId);
    this.addReturnSalesForm.get('customer').setValue(selectedCustomer);
  }



  addReturnSalesFormSubmit() {
    const formData = this.addReturnSalesForm.value;
    const selectedCustomerId = this.addReturnSalesForm.get('customer').value?._id;
    const selectedCustomerName = this.addReturnSalesForm.get('customer').value?.name;

    let totalTax = 0
    formData.salesOrderTax.forEach(element => {
      totalTax = totalTax + element.taxRate;
    });
    const payload = {
      // customer: formData.customer,
      customer: {
        _id: selectedCustomerId,
        name: selectedCustomerName
      },
      returnDate: formData.returnDate,
      salesDiscount: formData.salesDiscount,
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      returnOrderStatus: formData.returnOrderStatus,
      salesOrderTax: totalTax,
      salesShipping: formData.salesShipping,
      appliedTax: formData.salesOrderTax,
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: formData.salesTotalAmount,
      unit: formData.unit,
      otherCharges: formData.otherCharges
    }
    if (this.addReturnSalesForm.valid) {
      console.log("valid form");
      console.log("data by payload", payload);

      this.Service.createSalesReturn(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales Return has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/sales-return"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
    else {
      console.log("invalid form");

    }
  }
}
