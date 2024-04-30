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
import { UnitsService } from '../../settings/units/units.service';
import { SubCategoriesService } from '../../settings/sub-categories/sub-categories.service';
import { MessageService } from 'primeng/api';
import { SalesReturnService } from '../sales-return.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-edit-sales-return',
  standalone: true,
  imports: [CommonModule, SharedModule, MultiSelectModule, DropdownModule, CalendarModule, ToastModule],
  templateUrl: './edit-sales-return.component.html',
  styleUrl: './edit-sales-return.component.scss',
  providers: [MessageService]
})
export class EditSalesReturnComponent {

  editReturnSalesForm!: FormGroup;
  public routes = routes;
  salesReturnId: any
  addTaxTotal: any;
  customerList = [];
  categoryList = [];
  subCategoryList = [];
  unitListData = [];
  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  public selectedValue!: string;
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private Service: SalesReturnService,
    private subCategoriesService: SubCategoriesService,
    private unitService: UnitsService,
    private customerService: CustomersdataService,
    private CategoriesService: CategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder,
  ) {
    this.editReturnSalesForm = this.fb.group({
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

    this.salesReturnId = this.activeRoute.snapshot.params["id"];
  }

  get salesItemDetails() {
    return this.editReturnSalesForm.controls['salesItemDetails'] as FormArray;
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
    const salesItemDetailsForm = this.editReturnSalesForm.get('salesItemDetails') as FormArray;
    const quantityControl = salesItemDetailsForm.at(index).get('salesItemQuantity');
    return quantityControl && quantityControl.hasError('min') && quantityControl.touched;
  }

  getSalesItemUnitPriceError(index: number) {
    const salesItemDetailsForm = this.editReturnSalesForm.get('salesItemDetails') as FormArray;
    const unitPriceControl = salesItemDetailsForm.at(index).get('salesItemUnitPrice');
    return unitPriceControl && unitPriceControl.hasError('min') && unitPriceControl.touched;
  }

  getSalesItemSubTotalError(index: number) {
    const salesItemDetailsForm = this.editReturnSalesForm.get('salesItemDetails') as FormArray;
    const subTotalControl = salesItemDetailsForm.at(index).get('salesItemSubTotal');
    return subTotalControl && subTotalControl.hasError('min') && subTotalControl.touched;
  }


  ngOnInit(): void {
    let totalTax = 0;

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

    this.CategoriesService.getCategories().subscribe((resp:any) => {
      this.categoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });

    this.Service.getSalesReturnByCustomerId(this.salesReturnId).subscribe((resp: any) => {
      // debugger
      resp.data[0]?.salesItemDetails?.forEach(lang => {
        this.addsalesReturnItemDetailsItem()
      });
      resp.data[0].appliedTax.forEach(element => {
        totalTax += Number(element.taxRate);
      });
      this.addTaxTotal = resp.data.salesTotalAmount * totalTax / 100;
      console.log("applied tax", resp.data.appliedTax);


      this.patchForm(resp.data[0])
    })

    this.calculateTotalAmount()



  }

  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalTax = 0
    let totalAmount = 0;
    if (Array.isArray(this.editReturnSalesForm.get('salesOrderTax').value)) {
      this.editReturnSalesForm.get('salesOrderTax').value.forEach(element => {
        totalTax += Number(element.taxRate);
      });
    } else {
      totalTax += Number(this.editReturnSalesForm.get('salesOrderTax').value);
    }
    let shipping = +this.editReturnSalesForm.get('salesShipping').value;
    let Discount = +this.editReturnSalesForm.get('salesDiscount').value;
    let otherCharges = +this.editReturnSalesForm.get('otherCharges').value;

    const salesItems = this.editReturnSalesForm.get('salesItemDetails') as FormArray;

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

    this.editReturnSalesForm.patchValue({
      salesDiscount: Discount.toFixed(2),
      salesShipping: shipping.toFixed(2),
      otherCharges: otherCharges.toFixed(2),
      salesTotalAmount: totalAmount.toFixed(2)
    });
  }

  onCustomerSelect(customerId: string) {
    const selectedCustomer = this.customerList.find(customer => customer._id === customerId);
    this.editReturnSalesForm.get('customer').setValue(selectedCustomer);
  }


  patchForm(data) {
    data.appliedTax.forEach(element => {
      delete element.tenantId;
    });
    this.editReturnSalesForm.patchValue({
      salesInvoiceNumber: data.salesInvoiceNumber,
      customer: data.customer,
      returnDate: data.returnDate,
      salesOrderStatus: data.salesOrderStatus,
      salesOrderTax: data.appliedTax,
      salesDiscount: data.salesDiscount,
      salesShipping: data.salesShipping,
      salesTermsAndCondition: data.salesTermsAndCondition,
      salesNotes: data.salesNotes,
      salesTotalAmount: data.salesTotalAmount,
      unit: data.unit,
      otherCharges: data.otherCharges,
    });

    this.salesItemDetails.patchValue(data.salesItemDetails);
  }


  editReturnSalesFormSubmit() {
    const formData = this.editReturnSalesForm.value;
    const selectedCustomerId = this.editReturnSalesForm.get('customer').value?._id;
    const selectedCustomerName = this.editReturnSalesForm.get('customer').value?.name;

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

    if (this.editReturnSalesForm.valid) {
      console.log("valid form");
      console.log(this.editReturnSalesForm.value);

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
