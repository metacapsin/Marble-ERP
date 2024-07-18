import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { SalesService } from "../sales.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { SlabsService } from "../../Product/slabs/slabs.service";

@Component({
  selector: "app-addsales",
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: "./addsales.component.html",
  styleUrls: ["./addsales.component.scss"],
})
export class AddsalesComponent implements OnInit {
  addSalesForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  public searchData_id = "";
  addTaxTotal: any;
  customerList: any = [];
  originalCustomerData = [];
  slabList = [];
  slabData = [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  maxQuantity: number;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;
  customer: any[] = [];
  returnUrl: string;
  wareHousedataListsEditArray: any[];
  originalSlabData: any;
  slabDatas: any;
  slabDataList: any = []


  constructor(
    private router: Router,
    private messageService: MessageService,
    private salesService: SalesService,
    private customerService: CustomersdataService,
    private slabService: SlabsService,
    private taxService: TaxesService,
    private fb: FormBuilder,
    private SlabsService: SlabsService,
    private localStorageService: LocalStorageService,
    private services: WarehouseService,
  ) {
    this.addSalesForm = this.fb.group({
      customer: ["", [Validators.required]],
      salesDate: ["", [Validators.required]],
      salesDiscount: ["", [Validators.min(1), Validators.max(100000)]],
      salesInvoiceNumber: [""],
      salesItemDetails: this.fb.array([
        this.fb.group({
          salesItemProduct: ['', [Validators.required]],
          salesItemQuantity: ["", [Validators.required, Validators.min(0), Validators.max(this.maxQuantity)]],
          salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
          salesItemTax: [''],
          salesItemTaxAmount: [''],
          salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
          maxQuantity: [" "],
          salesWarehouseDetails: ['', [Validators.required]]
        }),
      ]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [""],
      salesOrderStatus: ["", [Validators.required]],
      salesOrderTax: ["",],
      appliedTax: [""],
      salesShipping: ["", [Validators.min(1), Validators.max(100000)]],
      salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: [""],
      otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
    });
  }

  get salesItemDetails() {
    return this.addSalesForm.controls["salesItemDetails"] as FormArray;
  }

  deletesalesItemDetails(salesItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesItemDetailsIndex);

    if (salesItemDetailsIndex > -1 && salesItemDetailsIndex < this.slabDataList.length) {
      this.slabDataList.splice(salesItemDetailsIndex, 1);
    } else {
      console.log("salesItemDetailsIndex out of range");
    }
    this.calculateTotalAmount();
  }

  addsalesItemDetailsItem() {
    const item = this.fb.group({
      salesItemProduct: ['', [Validators.required]],
      salesItemQuantity: ["", [Validators.required, Validators.min(0)]],
      salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      salesItemTax: [''],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
      salesItemTaxAmount: [''],
      maxQuantity: [''],
      salesWarehouseDetails: ['', [Validators.required]]
    });
    this.salesItemDetails.push(item);
  }
  onWareHouseSelect(value: any, i: number) {
    this.SlabsService.getSlabListByWarehouseId(value._id).subscribe(
      (resp: any) => {
        this.originalSlabData = resp.data;
        this.slabDatas = resp.data.map((element) => ({
          name: element.slabName,
          _id: {
            _id: element._id,
            slabName: element.slabName,
            slabNo: element.slabNo,
          },
        }));
        this.salesItemDetails.controls.forEach((element, index) => {
          console.log("before if", "index", index, "element", element);

          if (i === index) {
            this.slabDataList[index] = this.slabDatas;
            console.log("if", this.slabDataList[index]);
           
            
            const control = this.salesItemDetails.at(i);
            control.get('salesItemProduct').reset();
            control.get('salesItemQuantity').reset();
            control.get('salesItemUnitPrice').reset();
            control.get('salesItemTax').reset();
            control.get('salesItemSubTotal').reset();
            this.calculateTotalAmount()
          } else if (!this.slabDataList[index]) {
            this.slabDataList[index] = [];
            console.log("else", this.slabDataList);

          }
        });
        //this.slabDataList.push(this.slabDatas)
        console.log("this.slabDataList", this.slabDataList);
      }
    );
    console.log("----------------------------####################----------------");
  }
  ngOnInit() {


    this.customerList = this.getCustomer();
    this.customer = this.localStorageService.getItem('customer');
    this.returnUrl = this.localStorageService.getItem('returnUrl')
    console.log("this is retrun url", this.returnUrl)
    console.log("this is customer data by local sotrage service", this.customer)
    if (this.customer) {
      this.addSalesForm.patchValue({
        customer: this.customer

      }
      );
    }

    this.services.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedataListsEditArray = [];
      resp.data.forEach((element: any) => {
        this.wareHousedataListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
      console.log(this.wareHousedataListsEditArray);
    });

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = this.taxesListData.map(element => ({
        orderTaxName: `${element.name} (${element.taxRate}%)`,
        orderNamevalue: element,
      }));
    });

    this.slabService.getSlabsList().subscribe((resp: any) => {
      this.slabData = resp.data;
      this.slabList = this.slabData.map(e => ({
        slabName: e.slabName,
        _id: {
          _id: e._id,
          slabName: e.slabName,
          slabNo: e.slabNo,
        }
      }));
    });
  }

  getCustomer() {
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
  }
  onSlabSelect(value, i) {
    const salesItemDetailsArray = this.addSalesForm.get("salesItemDetails") as FormArray;

    const selectedSlab = this.slabData.find(slab => slab._id === value._id);

    if (selectedSlab) {
      console.log('Slab Found', selectedSlab);

      // Calculate remaining quantity for the selected slab
      let remainingQuantity = selectedSlab.totalSQFT;
      for (let j = 0; j < salesItemDetailsArray.length; j++) {
        if (j !== i) {
          const currentRowSlab = salesItemDetailsArray.at(j)?.get("salesItemProduct").value;
          if (currentRowSlab && currentRowSlab._id === value._id) {
            remainingQuantity -= salesItemDetailsArray.at(j)?.get("salesItemQuantity").value || 0;
          }
        }
      }

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
    let salesOrderTax: number = 0;
    const salesItems = this.addSalesForm.get("salesItemDetails") as FormArray;

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
      salesOrderTax += totalTaxAmount;

      salesGrossTotal += subtotal;
      item.get("salesItemTaxAmount").setValue(totalTaxAmount.toFixed(2));
      item.get("salesItemSubTotal").setValue(subtotal.toFixed(2));
    });

    this.addSalesForm.get('salesOrderTax').setValue(salesOrderTax.toFixed(2));
    this.addSalesForm.get('salesGrossTotal').setValue(salesGrossTotal.toFixed(2));

    let totalAmount = salesGrossTotal;
    const discount = +this.addSalesForm.get("salesDiscount").value;
    const shipping = +this.addSalesForm.get("salesShipping").value;
    const otherCharges = +this.addSalesForm.get("otherCharges").value;

    totalAmount -= discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.addSalesForm.get("salesTotalAmount").setValue(totalAmount)
  }

  addSalesFormSubmit() {
    const formData = this.addSalesForm.value;
    // let salesOrderTax: number = 0;
    // formData.salesItemDetails.forEach(element => {
    //   salesOrderTax += element.salesItemTaxAmount
    // });
    // console.log("salesOrderTax",salesOrderTax);
    console.log(formData);
    const payload = {
      customer: formData.customer,
      salesDate: formData.salesDate,
      salesDiscount: Number(formData.salesDiscount),
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: Number(formData.salesGrossTotal),
      salesOrderStatus: formData.salesOrderStatus,
      salesShipping: Number(formData.salesShipping),
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: Number(formData.salesTotalAmount),
      otherCharges: Number(formData.otherCharges),
      salesOrderTax: Number(formData.salesOrderTax)
    };

    if (this.addSalesForm.valid) {
      console.log("Valid form sales payload", payload);

      this.salesService.AddSalesData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Invalid form");
    }
  }
}
