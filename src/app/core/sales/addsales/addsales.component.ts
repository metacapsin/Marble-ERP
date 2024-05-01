import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { SubCategoriesService } from '../../settings/sub-categories/sub-categories.service';
import { UnitsService } from '../../settings/units/units.service';
@Component({
  selector: 'app-addsales',
  standalone: true,
  imports: [CommonModule, SharedModule, MultiSelectModule, DropdownModule, CalendarModule, ToastModule],
  templateUrl: './addsales.component.html',
  styleUrl: './addsales.component.scss',
  providers: [MessageService]
})
export class AddsalesComponent {

  addSalesForm!: FormGroup;
  public routes = routes;
  public searchData_id = '';
  addTaxTotal: any;
  customerList = [];
  originalCustomerData = [];
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
  isSalesItemSubTotalDisabled: boolean = true;

  constructor(
    private customerByIdService: CustomersdataService,
    private router: Router,
    private messageService: MessageService,
    private Service: SalesService,
    private customerService: CustomersdataService,
    private unitService: UnitsService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder,
  ) {
    this.addSalesForm = this.fb.group({
      customer: ['', [Validators.required]],
      salesDate: ['', [Validators.required]],
      salesDiscount: ['', [Validators.min(0)]],
      salesInvoiceNumber: ['', [Validators.required]],
      salesItemDetails: this.fb.array([
        this.fb.group({
          salesItemCategory: [''],
          salesItemSubCategory: [''],
          unit: [''],
          salesItemName: [''],
          salesItemQuantity: ['', [Validators.min(0)]],
          salesItemUnitPrice: ['', [Validators.min(0)]],
          salesItemSubTotal: [''],
        })
      ]),
      salesNotes: [''],
      salesGrossTotal: [''],
      salesOrderStatus: [''],
      salesOrderTax: [''],
      appliedTax: [''],
      salesShipping: ['', [Validators.min(0)]],
      salesTermsAndCondition: [''],
      salesTotalAmount: [''],
      otherCharges: ['', [Validators.min(0)]]
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
      salesItemSubCategory: [''],
      unit: [''],
      salesItemName: [''],
      salesItemQuantity: ['', [Validators.min(0)]],
      salesItemUnitPrice: ['', [Validators.min(0)]],
      salesItemSubTotal: [''],
    });
    this.salesItemDetails.push(item);
  }


  getSalesItemQuantityError(index: number) {
    const salesItemDetailsForm = this.addSalesForm.get('salesItemDetails') as FormArray;
    const quantityControl = salesItemDetailsForm.at(index).get('salesItemQuantity');
    return quantityControl && quantityControl.hasError('min') && quantityControl.touched;
  }

  getSalesItemUnitPriceError(index: number) {
    const salesItemDetailsForm = this.addSalesForm.get('salesItemDetails') as FormArray;
    const unitPriceControl = salesItemDetailsForm.at(index).get('salesItemUnitPrice');
    return unitPriceControl && unitPriceControl.hasError('min') && unitPriceControl.touched;
  }

  getSalesItemSubTotalError(index: number) {
    const salesItemDetailsForm = this.addSalesForm.get('salesItemDetails') as FormArray;
    const subTotalControl = salesItemDetailsForm.at(index).get('salesItemSubTotal');
    return subTotalControl && subTotalControl.hasError('min') && subTotalControl.touched;
  }




  ngOnInit(): void {
    this.isSalesItemSubTotalDisabled = true;

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      this.customerList = [];
      this.originalCustomerData.forEach(element => {
        this.customerList.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name
          }
        })
      });
      // console.log("customer", this.customerList);
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


  // calculateTotalAmount() {
  //   console.log("Enter in caltotal");
  //   let totalTax = 0
  //   let totalAmount = 0;
  //   let salesGrossTotal = 0
    
  //   const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;

  //   salesItems.controls.forEach((item: FormGroup) => {
  //     const quantity = +item.get('salesItemQuantity').value || 0;
  //     const unitPrice = +item.get('salesItemUnitPrice').value || 0;
  //     const subtotal = quantity * unitPrice;
  //     salesGrossTotal += subtotal;
  //     // totalAmount += subtotal;
  //     item.get('salesItemSubTotal').setValue(subtotal.toFixed(2));
  //   });

  //   if (Array.isArray(this.addSalesForm.get('salesOrderTax').value)) {
  //     // debugger
  //     console.log("in loop");
      
  //     this.addSalesForm.get('salesOrderTax').value.forEach(element => {
  //       totalTax += Number(element.taxRate);
  //       this.addTaxTotal = salesGrossTotal * totalTax / 100;
  //     });
  //   } else {
  //     totalTax += Number(this.addSalesForm.get('salesOrderTax').value);
  //     this.addTaxTotal = salesGrossTotal * totalTax / 100;
  //   }
  //   let shipping = +this.addSalesForm.get('salesShipping').value;
  //   let Discount = +this.addSalesForm.get('salesDiscount').value;
  //   let otherCharges = +this.addSalesForm.get('otherCharges').value;
    
    
  //   // this.addTaxTotal = totalAmount * totalTax / 100;
  //   totalAmount += salesGrossTotal;
  //   totalAmount += this.addTaxTotal;
  //   totalAmount -= Discount;
  //   totalAmount += shipping;
  //   totalAmount += otherCharges;

  //   this.addSalesForm.patchValue({
  //     salesGrossTotal: salesGrossTotal.toFixed(2),
  //     salesDiscount: Discount.toFixed(2),
  //     salesShipping: shipping.toFixed(2),
  //     otherCharges: otherCharges.toFixed(2),
  //     salesTotalAmount: totalAmount.toFixed(2)
  //   });
  // };
  calculateTotalAmount() {
    let totalAmount = 0;
    let salesGrossTotal = 0;
    let totalTax = 0;

    const salesItems = this.addSalesForm.get('salesItemDetails') as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
        const quantity = +item.get('salesItemQuantity').value || 0;
        const unitPrice = +item.get('salesItemUnitPrice').value || 0;
        const subtotal = quantity * unitPrice;
        salesGrossTotal += subtotal;
        item.get('salesItemSubTotal').setValue(subtotal.toFixed(2));
    });

    if (Array.isArray(this.addSalesForm.get('salesOrderTax').value)) {
        this.addSalesForm.get('salesOrderTax').value.forEach(element => {
            totalTax += Number(element.taxRate);
        });
    } else {
        totalTax += Number(this.addSalesForm.get('salesOrderTax').value);
    }
    this.addTaxTotal = salesGrossTotal * totalTax / 100;

    // Other calculations remain unchanged
    let shipping = +this.addSalesForm.get('salesShipping').value;
    let Discount = +this.addSalesForm.get('salesDiscount').value;
    let otherCharges = +this.addSalesForm.get('otherCharges').value;

    totalAmount += salesGrossTotal;
    totalAmount += this.addTaxTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.addSalesForm.patchValue({
        salesGrossTotal: salesGrossTotal.toFixed(2),
        salesDiscount: Discount.toFixed(2),
        salesShipping: shipping.toFixed(2),
        otherCharges: otherCharges.toFixed(2),
        salesTotalAmount: totalAmount.toFixed(2)
    });
}





  addSalesFormSubmit() {
    const formData = this.addSalesForm.value;
    // const selectedCustomerId = this.addSalesForm.get('customer').value?._id;
    // const selectedCustomerName = this.addSalesForm.get('customer').value?.name;

    let totalTax = 0
    formData.salesOrderTax.forEach(element => {
      totalTax = totalTax + element.taxRate;
    });

    const payload = {
      // customer: {
        // _id: selectedCustomerId,
        // name: selectedCustomerName
      // },
      customer: formData.customer,
      salesDate: formData.salesDate,
      salesDiscount: formData.salesDiscount,
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: formData.salesGrossTotal,
      salesOrderStatus: formData.salesOrderStatus,
      salesOrderTax: totalTax,
      salesShipping: formData.salesShipping,
      appliedTax: formData.salesOrderTax,
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: formData.salesTotalAmount,
      otherCharges: formData.otherCharges
    }


    if (this.addSalesForm.valid) {
      console.log("valid form");

      this.Service.AddSalesData(payload).subscribe((resp: any) => {
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
    else {
      console.log("invalid form");

    }
  }

}
