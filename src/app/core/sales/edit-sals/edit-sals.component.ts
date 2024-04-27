import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TaxesService } from '../../settings/taxes/taxes.service';
import { CustomersdataService } from '../../Customers/customers.service';
import { SalesService } from '../sales.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../settings/categories/categories.service';
import { ToastModule } from 'primeng/toast';
import { SubCategoriesService } from '../../settings/sub-categories/sub-categories.service';

@Component({
  selector: 'app-edit-sals',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, ToastModule],
  templateUrl: './edit-sals.component.html',
  styleUrl: './edit-sals.component.scss',
  providers: [MessageService]
})
export class EditSalsComponent {

  editSalesForm!: FormGroup;
  public routes = routes;
  salesId = "";
  customerList = [];
  categoryList = []
  subCategoryList = []
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
  public chargesArray: number[] = [0];
  public recurringInvoice = false;
  public selectedValue!: string;

  constructor(

    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private Service: SalesService,
    private customerService: CustomersdataService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder,
  ) {
    this.editSalesForm = this.fb.group({
      id: [''],
      salesInvoiceNumber: [''],
      customer: [''],
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
          salesItemName: [''],
          salesItemQuantity: [''],
          salesItemUnitPrice: [''],
          salesItemSubTotal: [''],
        })
      ]),
    });
    this.salesId = this.activeRoute.snapshot.params["id"];
  }

  get salesItemDetails() {
    return this.editSalesForm.controls['salesItemDetails'] as FormArray;
  }
  deletesalesItemDetails(salesItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesItemDetailsIndex);
  }
  addsalesItemDetailsItem() {
    const item = this.fb.group({
      salesItemCategory: [''],
      salesItemName: [''],
      salesItemQuantity: [''],
      salesItemUnitPrice: [''],
      salesItemSubTotal: [''],
    });
    this.salesItemDetails.push(item);

  }

  ngOnInit(): void {

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;
    })

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

    this.CategoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });

    this.Service.GetSalesDataById(this.salesId).subscribe((resp: any) => {
      resp.data?.salesItemDetails?.forEach(lang => {
        this.addsalesItemDetailsItem()
      });

      this.patchForm(resp.data)
    })



  }


  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    let shipping = +this.editSalesForm.get('salesShipping').value;
    let Discount = +this.editSalesForm.get('salesDiscount').value;
    let orderTax = +this.editSalesForm.get('salesOrderTax').value;

    const salesItems = this.editSalesForm.get('salesItemDetails') as FormArray;

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

    this.editSalesForm.patchValue({
      salesDiscount: Discount.toFixed(2),
      salesShipping: shipping.toFixed(2),
      salesTotalAmount: totalAmount.toFixed(2)
    });
  }

  patchForm(data) {
    console.log(data);
    this.editSalesForm.patchValue({
      salesInvoiceNumber: data.salesInvoiceNumber,
      customer: data.customer,
      salesDate: data.salesDate,
      salesOrderStatus: data.salesOrderStatus,
      salesOrderTax: data.salesOrderTax,
      salesDiscount: data.salesDiscount,
      salesShipping: data.salesShipping,
      salesTermsAndCondition: data.salesTermsAndCondition,
      salesNotes: data.salesNotes,
      salesTotalAmount: data.salesTotalAmount,

    });

    this.salesItemDetails.patchValue(data.salesItemDetails);
  }


  editSalesFormSubmit() {
    if (this.editSalesForm.valid) {
      console.log("valid form");
      console.log(this.editSalesForm.value);
      this.editSalesForm.value.id = this.salesId
      this.Service.UpdateSalesData(this.editSalesForm.value).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales has been updated";
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
