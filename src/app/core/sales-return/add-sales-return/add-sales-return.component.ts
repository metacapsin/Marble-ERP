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
  public selectedValue!: string;
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;

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
      customer: ["", [Validators.required]],
      returnDate: ["", [Validators.required]],
      salesDiscount: ["", [Validators.min(0)]],
      salesInvoiceNumber: [
        "",
        // [Validators.required, Validators.pattern(this.nameRegex)],
      ],
      salesItemDetails: this.fb.array([
        this.fb.group({
          salesItemCategory: ["", [Validators.required]],
          salesItemSubCategory: ["", [Validators.required]],
          unit: ["", [Validators.required]],
          salesItemName: [
            "",
            [Validators.required, Validators.pattern(this.nameRegex)],
          ],
          salesItemQuantity: ["", [Validators.required, Validators.min(0)]],
          salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
          salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
        }),
      ]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [''],
      returnOrderStatus:  ["", [Validators.required]],
      salesOrderTax: [''],
      appliedTax: [''],
      salesShipping: ["", [Validators.min(0)]],
      salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: [""],
      otherCharges: ["", [Validators.min(0)]],
    });
  }

  get salesItemDetails() {
    return this.addReturnSalesForm.controls['salesItemDetails'] as FormArray;
  }
  deletesalesReturnItemDetails(salesReturnItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesReturnItemDetailsIndex);
    this.calculateTotalAmount();
  }
  addsalesReturnItemDetailsItem() {
    const item = this.fb.group({
      salesItemCategory: ["", [Validators.required]],
      salesItemSubCategory: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      salesItemName: [
        "",
        [Validators.required, Validators.pattern(this.nameRegex)],
      ],
      salesItemQuantity: ["", [Validators.required, Validators.min(0)]],
      salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
    });
    this.salesItemDetails.push(item);
  }

  ngOnInit(): void {

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
    let totalAmount = 0;
    let salesGrossTotal = 0;
    let totalTax = 0;

    const salesItems = this.addReturnSalesForm.get('salesItemDetails') as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
        const quantity = +item.get('salesItemQuantity').value || 0;
        const unitPrice = +item.get('salesItemUnitPrice').value || 0;
        const subtotal = quantity * unitPrice;
        salesGrossTotal += subtotal;
        item.get('salesItemSubTotal').setValue(subtotal.toFixed(2));
    });

    if (Array.isArray(this.addReturnSalesForm.get('salesOrderTax').value)) {
        this.addReturnSalesForm.get('salesOrderTax').value.forEach(element => {
            totalTax += Number(element.taxRate);
        });
    } else {
        totalTax += Number(this.addReturnSalesForm.get('salesOrderTax').value);
    }
    this.addTaxTotal = salesGrossTotal * totalTax / 100;

    // Other calculations remain unchanged
    let shipping = +this.addReturnSalesForm.get('salesShipping').value;
    let Discount = +this.addReturnSalesForm.get('salesDiscount').value;
    let otherCharges = +this.addReturnSalesForm.get('otherCharges').value;

    totalAmount += salesGrossTotal;
    totalAmount += this.addTaxTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.addReturnSalesForm.patchValue({
        salesGrossTotal: salesGrossTotal.toFixed(2),
        salesDiscount: Discount.toFixed(2),
        salesShipping: shipping.toFixed(2),
        otherCharges: otherCharges.toFixed(2),
        salesTotalAmount: totalAmount.toFixed(2)
    });
}

  addReturnSalesFormSubmit() {
    const formData = this.addReturnSalesForm.value;

    let totalTax = 0
    if(formData.salesOrderTax){
      formData.salesOrderTax.forEach((element) => {
          totalTax = totalTax + element.taxRate;
        });
    }  
    const payload = {
      customer: formData.customer,
      returnDate: formData.returnDate,
      salesDiscount: formData.salesDiscount,
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: formData.salesGrossTotal,
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
