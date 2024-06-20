import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { SalesService } from "../sales.service";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { SlabsService } from "../../Product/slabs/slabs.service";

@Component({
  selector: "app-edit-sals",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: "./edit-sals.component.html",
  styleUrl: "./edit-sals.component.scss",
  providers: [MessageService],
})
export class EditSalsComponent {
  editSalesForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  public searchData_id = "";
  salesId = "";
  customerList = [];
  originalCustomerData = [];
  slabList = [];
  slabData = [];
  addTaxTotal: any;
  unitListData: [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  orderTaxList = [];
  taxesListData = [];
  // public itemDetails: number[] = [0];
  maxQuantity: number;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private Service: SalesService,
    private customerService: CustomersdataService,
    private slabService: SlabsService,
    private taxService: TaxesService,
    private fb: FormBuilder
  ) {
    this.editSalesForm = this.fb.group({
      customer: ["", [Validators.required]],
      salesDate: ["", [Validators.required]],
      salesDiscount: ["", [Validators.min(0)]],
      salesInvoiceNumber: [
        "",
      ],
      salesItemDetails: this.fb.array([]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [""],
      salesOrderStatus: ["", [Validators.required]],
      salesOrderTax: ["", []],
      appliedTax: [""],
      salesShipping: ["", [Validators.min(0)]],
      salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: [""],
      otherCharges: ["", [Validators.min(0)]],
    });
    this.salesId = this.activeRoute.snapshot.params["id"];
  }

  get salesItemDetails() {
    return this.editSalesForm.controls["salesItemDetails"] as FormArray;
  }
  deletesalesItemDetails(salesItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesItemDetailsIndex);
    this.calculateTotalAmount();
  }
  addsalesItemDetailsItem() {
    const item = this.fb.group({
      salesItemProduct: ['', [Validators.required]],
      salesItemQuantity: ["", [Validators.required, Validators.min(0), Validators.max(this.maxQuantity)]],
      salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      salesItemTax: [''],
      salesItemTaxAmount: [''],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
      maxQuantity: [" "],
    })
    this.salesItemDetails.push(item);

  }

  ngOnInit(): void {
    this.slabService.getSlabsList().subscribe((resp: any) => {

      this.slabData = resp.data;
      this.slabList = this.slabData.map(e => ({
        slabName: e.slabName,
        _id: {
          _id: e._id,
          slabName: e.slabName,
          slabNo: e.slabNo,
          // sellingPricePerSQFT: e.sellingPricePerSQFT,
          // totalSQFT: e.totalSQFT,
        }
      }));

      this.customerService.GetCustomerData().subscribe((resp: any) => {
        this.originalCustomerData = resp;
        this.customerList = this.originalCustomerData.map(element => ({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
            billingAddress: element.billingAddress,
          },
        }));
      });

      this.taxService.getAllTaxList().subscribe((resp: any) => {
        this.taxesListData = resp.data;
        this.orderTaxList = this.taxesListData.map(element => ({
          orderTaxName: `${element.name} (${element.taxRate}%)`,
          orderNamevalue: element,
        }));
      });



      this.Service.GetSalesDataById(this.salesId).subscribe((resp: any) => {
        // resp.data?.salesItemDetails?.forEach((lang) => {
        //   console.log("Product value",lang);
        // });
        this.getTotalQuantity()
        this.patchForm(resp.data);
      });
    });



    this.calculateTotalAmount();
  }

  getTotalQuantity() {

  }

  onSlabSelect(value, i) {
    const salesItemDetailsArray = this.editSalesForm.get("salesItemDetails") as FormArray;

    const selectedSlab = this.slabData.find(slab => slab._id === value._id);

    if (selectedSlab) {

      let totalUsedQuantity = 0;
      for (let j = 0; j < salesItemDetailsArray.length; j++) {
        const currentRowSlab = salesItemDetailsArray.at(j)?.get("salesItemProduct").value;
        if (currentRowSlab && currentRowSlab._id === value._id) {
          totalUsedQuantity += salesItemDetailsArray.at(j)?.get("salesItemQuantity").value || 0;
        }
      }

      // Calculate the remaining quantity for the selected slab
      let remainingQuantity = selectedSlab.totalSQFT - totalUsedQuantity;

      const salesItemUnitPriceControl = salesItemDetailsArray.at(i)?.get("salesItemUnitPrice");
      const maxQuantityControl = salesItemDetailsArray.at(i)?.get("maxQuantity");

      if (salesItemUnitPriceControl) {
        salesItemUnitPriceControl.patchValue(selectedSlab.sellingPricePerSQFT);
        this.calculateTotalAmount();
      }
      if (maxQuantityControl) {
        maxQuantityControl.setValue(remainingQuantity > 0 ? remainingQuantity : 0);
      }
    } else {
      console.error('Slab not found!');
    }
  }



  calculateTotalAmount() {
    let salesGrossTotal = 0;

    const salesItems = this.editSalesForm.get("salesItemDetails") as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
      if (item.get("salesItemQuantity").value > item.get("maxQuantity").value) {
        item.get("salesItemQuantity").patchValue(item.get("maxQuantity").value)
      }
      const quantity = +item.get("salesItemQuantity").value || 0;
      const unitPrice = +item.get("salesItemUnitPrice").value || 0;
      const tax = item.get("salesItemTax").value || [];

      let totalTaxAmount = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          totalTaxAmount += (quantity * unitPrice * selectedTax.taxRate) / 100;
        });
      } else {
        totalTaxAmount = (quantity * unitPrice * tax) / 100;
      }

      const subtotal = (quantity * unitPrice) + totalTaxAmount;

      salesGrossTotal += subtotal;
      item.get("salesItemTaxAmount").setValue(totalTaxAmount.toFixed(2))
      item.get("salesItemSubTotal").setValue(subtotal.toFixed(2));
    });

    this.editSalesForm.get('salesGrossTotal').setValue(salesGrossTotal.toFixed(2));

    let totalAmount = salesGrossTotal;
    const discount = +this.editSalesForm.get("salesDiscount").value;
    const shipping = +this.editSalesForm.get("salesShipping").value;
    const otherCharges = +this.editSalesForm.get("otherCharges").value;

    totalAmount -= discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.editSalesForm.get("salesTotalAmount").setValue(totalAmount)
  }

  patchForm(data) {
    this.editSalesForm.patchValue({
      customer: data.customer,
      salesDate: data.salesDate,
      salesDiscount: data.salesDiscount,
      salesInvoiceNumber: data.salesInvoiceNumber,
      salesNotes: data.salesNotes,
      salesGrossTotal: data.salesGrossTotal,
      salesOrderStatus: data.salesOrderStatus,
      salesShipping: data.salesShipping,
      salesTermsAndCondition: data.salesTermsAndCondition,
      salesTotalAmount: data.salesTotalAmount,
      otherCharges: data.otherCharges,
    });

    this.salesItemDetails.clear();  // Clear existing items

    // Patch sales item details and disable product field
    data.salesItemDetails.forEach((item: any, index: number) => {
      const salesItem = this.fb.group({
        salesItemProduct: [{ value: item.salesItemProduct, disabled: true }, [Validators.required]],
        salesItemQuantity: [item.salesItemQuantity, [Validators.required, Validators.min(0)]],
        salesItemUnitPrice: [item.salesItemUnitPrice, [Validators.required, Validators.min(0)]],
        salesItemTax: [item.salesItemTax],
        salesItemTaxAmount: [item.salesItemTaxAmount],
        salesItemSubTotal: [item.salesItemSubTotal, [Validators.required, Validators.min(0)]],
        maxQuantity: [item.maxQuantity],
      });

      this.salesItemDetails.push(salesItem);

      // this.onSlabSelect(item.salesItemProduct, index);
    });

  }


  editSalesFormSubmit() {
    const formData = this.editSalesForm.getRawValue();
    const payload = {

      customer: formData.customer,
      salesDate: formData.salesDate,
      salesDiscount: formData.salesDiscount,
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: formData.salesGrossTotal,
      salesOrderStatus: formData.salesOrderStatus,
      salesShipping: formData.salesShipping,
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: formData.salesTotalAmount,
      otherCharges: formData.otherCharges,
      id: this.salesId,
    };

    if (this.editSalesForm.valid) {
      console.log("valid form");
      console.log(payload);
      this.Service.UpdateSalesData(payload).subscribe((resp: any) => {
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
    } else {
      console.log("invalid form");
    }
  }
}
