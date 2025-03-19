import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { BillingAddressService } from "../../settings/billing-Address/billingAddress.service";
import { validationRegex } from "../../validation";
import { dashboardService } from "../../dashboard/dashboard.service";
import { isArray } from "ngx-bootstrap/chronos";

@Component({
  selector: "app-edit-sals",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./edit-sals.component.html",
  styleUrl: "./edit-sals.component.scss",
  providers: [MessageService],
})
export class EditSalsComponent implements OnInit {
  editSalesForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  public searchData_id = "";
  addTaxTotal: any;
  customerList: any = [];
  originalCustomerData = [];
  slabList = [];
  slabData = [];
  addressVisible: any = false;
  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  maxQuantity: number;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,30})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^[\s\S]{2,100}$/;
  customer: any = ([] = []);
  returnUrl: string;
  wareHousedataListsEditArray: any[];
  originalSlabData: any;
  slabDatas: any;
  slabDataList: any = [];
  address: any;
  orgAddress: any;
  dropAddress: any[];
  billingAddress: any = null;
  setAddressData: any;
  customerAddress: any;
  appliedTaxAmount: number;
  salesGrossTotal: number;
  salesOrderTax: number;
  totalTaxableAmount: number = 0;
  displayEwayBillPopup: boolean = false;
  salesId: any;
  ewayBillForm: FormGroup;
  vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}(?: ?[A-Z])?(?: ?[A-Z]*)? ?[0-9]{4}$/;
  BuyerData: any;
  EwayBill: any;
  UpdtshippingAddress: any;
  isUpdateAddress: boolean = false;
  isrequired: boolean = false;

  manuallyEditedPieces: boolean[] = []; // Tracks manually edited pieces

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
    private activeRoute: ActivatedRoute,
    private SalesService: SalesService,
    private dashboard: dashboardService
  ) {
    this.ewayBillForm = this.fb.group({
      eWayBillNo: ["", Validators.required],
      date: [new Date(), Validators.required],
      dispatchedThrough: ["", Validators.required],
      transporter: ["", Validators.required],
      vehicleNumber: ["", Validators.pattern(this.vehicleRegex)],
      deliveryTerms: [""],
    });

    this.editSalesForm = this.fb.group({
      customer: ["", [Validators.required]],
      salesDate: ["", [Validators.required]],
      billingAddress: [""],
      salesDiscount: ["", [Validators.min(0)]],
      salesInvoiceNumber: ["", [Validators.pattern(this.invoiceRegex)]],
      salesItemDetails: this.fb.array([
        this.fb.group({
          salesItemProduct: ["", [Validators.required]],
          salesItemQuantity: [
            "",
            [
              Validators.required,
              Validators.min(0),
              Validators.max(this.maxQuantity),
            ],
          ],
          salesItemUnitPrice: [
            "",
            [Validators.required, Validators.min(0), Validators.max(100000)],
          ],
          salesItemTax: [""],
          salesItemTotal: [""],
          salesItemTaxAmount: [""],
          salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
          maxQuantity: [" "],
          salesWarehouseDetails: ["", [Validators.required]],
          salesItemNonTaxableAmount: ["", Validators.min(0)],
          salesItemTaxableAmount: ["", Validators.min(0)],
          salesItemAppliedTaxAmount: ["", Validators.min(0)],
          salesItemPieces: [
            "",
            [Validators.required, Validators.min(0), Validators.max(100000)],
          ],
          sqftPerPiece: [""],
        }),
      ]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [""],
      salesOrderStatus: ["Confirmed"],
      salesOrderTax: [""],
      vendorTaxApplied: ["", [Validators.max(100), Validators.min(0)]],
      vendorTaxAmount: [""],
      appliedTax: [""],
      salesShipping: [
        "",
        [Validators.pattern(validationRegex.oneToOneLakhRegex)],
      ],
      salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: ["", [Validators.min(0)]],
      otherCharges: [
        "",
        [Validators.pattern(validationRegex.oneToOneLakhRegex)],
      ],
      taxable: [""],
      nonTaxable: [""],
      creditPeriod: ["", [Validators.min(0), Validators.max(180)]],
      eWayBill: [""],
      isShippingTax: [false],
      isOtherChargesTax: [false],
    });

    // Set up a value change subscription to update the max validator for salesDiscount
    this.editSalesForm
      .get("salesGrossTotal")
      .valueChanges.subscribe((value) => {
        const salesDiscountControl = this.editSalesForm.get("salesDiscount");
        salesDiscountControl.setValidators([
          Validators.min(0),
          Validators.max(value || 0),
        ]);
        salesDiscountControl.updateValueAndValidity();
      });

    this.salesId = this.activeRoute.snapshot.params["id"];
    this.handleTaxValidation();
  }

  handleTaxValidation() {
    console.log('handleTaxValidation');
    
    const salesItemDetailsArray = this.editSalesForm.get("salesItemDetails") as FormArray;
  
    salesItemDetailsArray.controls.forEach((group) => {
      const taxableAmountControl = group.get("salesItemTaxableAmount");
      const taxControl = group.get("salesItemTax");
  
      taxableAmountControl?.valueChanges.subscribe((value) => {
        if (value && value > 0) {
          console.log('hey');
          
          taxControl?.setValidators([Validators.required]); // Make tax required
          taxControl?.markAsTouched(); // Mark as touched if taxable amount is present
        } else {
          taxControl?.clearValidators(); // Remove required if no taxable amount
        }
        taxControl?.updateValueAndValidity(); // Update validity state
      });
    });
  }

  get salesItemDetails() {
    return this.editSalesForm.controls["salesItemDetails"] as FormArray;
  }

  public setValidations(formControlName: string) {
    return (
      this.ewayBillForm.get(formControlName)?.invalid &&
      (this.ewayBillForm.get(formControlName)?.dirty ||
        this.ewayBillForm.get(formControlName)?.touched)
    );
  }

  dispatchOptions = [
    { label: "By Road", value: "Road" },
    { label: "By Train", value: "Train" },
  ];

  deletesalesItemDetails(salesItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesItemDetailsIndex);

    if (
      salesItemDetailsIndex > -1 &&
      salesItemDetailsIndex < this.slabDataList.length
    ) {
      this.slabDataList.splice(salesItemDetailsIndex, 1);
    } else {
      console.log("salesItemDetailsIndex out of range");
    }
    this.manuallyEditedPieces.splice(salesItemDetailsIndex, 1); // ✅ Remove manual edit flag

    console.log(`Product at index ${salesItemDetailsIndex} deleted. Pieces will now reset.`);
    this.calculateTotalAmount();
  }

  addsalesItemDetailsItem() {
    const item = this.fb.group({
      salesItemProduct: ["", [Validators.required]],
      salesItemQuantity: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(this.maxQuantity),
        ],
      ],
      salesItemUnitPrice: [
        "",
        [Validators.required, Validators.min(0), Validators.max(100000)],
      ],
      salesItemTax: [""],
      salesItemTotal: [""],
      salesItemTaxAmount: [""],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
      maxQuantity: [" "],
      salesWarehouseDetails: ["", [Validators.required]],
      salesItemNonTaxableAmount: ["", Validators.min(0)],
      salesItemTaxableAmount: ["", Validators.min(0)],
      salesItemAppliedTaxAmount: ["", Validators.min(0)],
      salesItemPieces: [
        "",
        [Validators.required, Validators.min(0), Validators.max(100000)],
      ],
      sqftPerPiece: [""],
    });
    this.salesItemDetails.push(item);
    this.manuallyEditedPieces.push(false); // ✅ Reset manual tracking for new item

    console.log("New product added. Pieces will calculate automatically.");
    this.calculateTotalAmount();
    
  }
  onWareHouseSelect(value: any, i: number) {
    this.SlabsService.getSlabListByWarehouseId(value._id).subscribe(
      (resp: any) => {
        this.originalSlabData = resp.data;
        console.log("resp.data?>>>", resp.data);
        this.slabDatas = resp.data.map((element) => ({
          name: element.slabName,
          displayLabel: `${element.slabName}(${element.slabNo})`,
          // _id: {
          //   _id: element._id,
          //   slabName: element.slabName,
          //   slabNo: element.slabNo,
          //   hsnCode: element.subCategoryDetail?.hsnCode,
          // },
          _id: {
            _id: element._id,
            slabName: element.slabName,
            slabNo: element.slabNo,
            costPerSQFT: element.costPerSQFT,
            salesItemTotalQuantity: element.totalSlabSQFT,
            hsnCode: element.subCategoryDetail?.hsnCode,
          },
        }));
        this.salesItemDetails.controls.forEach((element, index) => {
          if (i === index) {
            this.slabDataList[index] = this.slabDatas;
            const control = this.salesItemDetails.at(i);
            // control.get("salesItemProduct").reset();
            // control.get("salesItemQuantity").reset();
            // control.get("salesItemUnitPrice").reset();
            // control.get("salesItemTax").reset();
            this.calculateTotalAmount();
          } else if (!this.slabDataList[index]) {
            this.slabDataList[index] = [];
          }
        });
      }
    );
  }
  editAddressWithDrop() {
    this.setAddressData = this.editSalesForm.get("billingAddress")?.value;
    console.log("setaddress", this.setAddressData);

    // Check if the billing address indicates that the vendor tax is applied
    if (this.setAddressData?.isTaxVendor) {
      this.isrequired = true;
      // Set validators for vendorTaxApplied field
      this.editSalesForm
        .get("vendorTaxApplied")
        .setValidators([Validators.required]);

      // Set validators for salesItemTaxableAmount inside each salesItemDetails entry
      const salesItemDetails = this.editSalesForm.get(
        "salesItemDetails"
      ) as FormArray;
      salesItemDetails.controls.forEach((itemGroup: FormGroup) => {
        itemGroup
          .get("salesItemTaxableAmount")
          ?.setValidators([Validators.required]);
      });
    } else {
      // Remove validators if isTaxVendor is false
      this.editSalesForm.get("vendorTaxApplied").setValidators([]);

      // Remove validators for salesItemTaxableAmount inside each salesItemDetails entry
      const salesItemDetails = this.editSalesForm.get(
        "salesItemDetails"
      ) as FormArray;
      salesItemDetails.controls.forEach((itemGroup: FormGroup) => {
        itemGroup.get("salesItemTaxableAmount")?.setValidators([]);
      });
    }

    // Update the validity of the fields after modifying the validators
    this.editSalesForm.get("vendorTaxApplied")?.updateValueAndValidity();

    // Iterate through the salesItemDetails array and update validity for each salesItemTaxableAmount
    const salesItemDetails = this.editSalesForm.get(
      "salesItemDetails"
    ) as FormArray;
    salesItemDetails.controls.forEach((itemGroup: FormGroup) => {
      itemGroup.get("salesItemTaxableAmount")?.updateValueAndValidity();
    });

    // Optionally, update other fields as needed
    this.editSalesForm.patchValue({
      salesTermsAndCondition:  this.editSalesForm.get("salesTermsAndCondition")?.value || this.setAddressData?.termsAndCondition,
    });
  }

  onSubmit() {
    if (this.ewayBillForm.valid) {
      console.log("E-way Bill Data:", this.ewayBillForm.value);
      let formData = this.ewayBillForm.value;
      let formaeDate = this.dashboard.getFormattedDate(formData.date);

      let payload = {
        date: formaeDate,
        eWayBillNo: formData.eWayBillNo,
        dispatchedThrough: formData.dispatchedThrough,
        transporter: formData.transporter,
        vehicleNumber: formData.vehicleNumber,
        deliveryTerms: formData.deliveryTerms,
      };

      this.EwayBill = payload;

      this.editSalesForm.patchValue({
        eWayBill: payload,
      });

      this.displayEwayBillPopup = false;
    }

    console.log("E-way Bill addSalesForm:", this.editSalesForm.value);
  }

  UpdateShippingAddress() {
    let customer = this.originalCustomerData.find(
      (item) => item?._id === this.BuyerData?._id
    );
    console.log("customer", customer);

    let payload = {
      shippingAddress: this.UpdtshippingAddress,
      _id: customer._id,
    };

    this.customerService.UpdateCustomerShippingAddress(payload).subscribe((resp: any) => {
      if (resp.status === "success") {
        const value = this.editSalesForm.get("customer").value;
        let data = {
          billingAddress: value.billingAddress,
          name: value.name,
          shippingAddress: this.UpdtshippingAddress,
          taxNo: value.taxNo,
          _id: value._id,
        };

        console.log("data<<<<<", data);

        // this.editSalesForm.patchValue({
        //   customer:data
        // })
        console.log(" this.editSalesForm<<<<<", this.editSalesForm.value);

        this.BuyerData = data;
        this.customerAddress = data.billingAddress;
        // this.getCustomer();
        this.isUpdateAddress = false;
      }
    });
  }

  ngOnInit() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US"); // Format to MM/DD/YYYY

    
    this.slabService.getSlabsList().subscribe((resp: any) => {
      this.slabData = resp.data;
    });

    this.salesService.getVendorBillingList().subscribe((resp: any) => {
      this.address = resp.data;
      this.orgAddress = resp.data;
      this.dropAddress = [];
      this.orgAddress.forEach((ele) => {
        this.dropAddress.push({
          name: `${ele.companyName} / ${ele.city},`,
          _id: ele,
        });
      });
      // const filterData = this.address.find((e) => e.setAsDefault);
      // if (!filterData) {
      //   const message = "First you want to set one billing Address as Default";
      //   this.messageService.add({ severity: "error", detail: message });
      // }
      // this.editSalesForm.get("billingAddress").patchValue(filterData);
    });

    // this.customerList = this.getCustomer();
    this.customer = this.localStorageService.getItem("customer");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    // if (this.customer) {
    //   this.editSalesForm.patchValue({
    //     customer: this.customer,
    //   });
    //   this.customerAddress = this.customer.billingAddress;
    // }

    // this.taxService.getAllTaxList().subscribe((resp: any) => {
    //   this.taxesListData = resp.data;
    //   this.orderTaxList = this.taxesListData.map((element) => ({
    //     orderTaxName: `${element.name} (${element.taxRate}%)`,
    //     orderNamevalue: element,
    //   }));
    // });

    // this.slabService.getSlabsList().subscribe((resp: any) => {
    //   this.slabData = resp.data;
    //   this.slabList = this.slabData.map((e) => ({
    //     slabName: e.slabName,
    //     _id: {
    //       _id: e._id,
    //       slabName: e.slabName,
    //       slabNo: e.slabNo,
    //     },
    //   }));
    // });

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      this.customerList = this.originalCustomerData.map((element) => ({
        name: element.name,
        _id: {
          _id: element._id || "",
          name: element.name || "",
          taxNo: element.taxNo ,
          billingAddress: element.billingAddress || "",
          shippingAddress: element.shippingAddress || "",
        },
      }));
    });

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = this.taxesListData.map((element) => ({
        orderTaxName: `${element.name} (${element.taxRate}%)`,
        orderNamevalue: element,
      }));
    });

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
    });

    this.SalesService.GetSalesDataById(this.salesId).subscribe((resp: any) => {
      this.patchForm(resp.data);
      console.log("resp.data", resp.data);
    });
  }

  toUpperCase(event: any) {
    let val = event.target.value.toUpperCase();
    this.ewayBillForm.patchValue({
      vehicleNumber: val,
    });
  }

  hasError(controlName: string, errorName: string): boolean | undefined {
    const control = this.editSalesForm.get(controlName);
    return control?.hasError(errorName) && (control.dirty || control.touched);
  }
  isPatchingData: boolean = false;

  patchForm(data) {
    console.log("data>>", data);
    this.setAddressData = data.billingAddress;
        // Prevent recalculation while patching
        this.isPatchingData = true; 
    this.editSalesForm.patchValue({
      billingAddress: data.billingAddress,
      customer: data.customer,
      salesDate: data.salesDate,
      creditPeriod: data.creditPeriod,
      salesDiscount: data.salesDiscount,
      salesInvoiceNumber: data.salesInvoiceNumber,
      salesNotes: data.salesNotes,
      salesGrossTotal: data.salesGrossTotal,
      salesOrderStatus: data.salesOrderStatus,
      salesShipping: data.salesShipping,
      salesTermsAndCondition: data.salesTermsAndCondition,
      salesTotalAmount: data.salesTotalAmount,
      otherCharges: data.otherCharges,
      isOtherChargesTax: data.isOtherChargesTax,
      isShippingTax: data.isShippingTax,
      vendorTaxApplied: data?.taxVendor?.vendorTaxApplied,
      companyName: data?.taxVendor?.companyName,
      taxVendorAmount: data?.taxVendor?.taxVendorAmount,
    });
    // this.BuyerData = data.customer
    this.setCustomer(data.customer);
    let Ebill = data?.eWayBill;
    this.EwayBill = data?.eWayBill;
    console.log("ebill", Ebill);
    this.editAddressWithDrop();
    this.ewayBillForm.patchValue({
      date: Ebill?.date ? new Date(Ebill?.date) : new Date(),
      eWayBillNo: Ebill?.eWayBillNo,
      dispatchedThrough: Ebill?.dispatchedThrough,
      transporter: Ebill?.transporter,
      vehicleNumber: Ebill?.vehicleNumber,
      deliveryTerms: Ebill?.deliveryTerms,
    });
    this.onSubmit();
    console.log(" this.ewayBillForm", this.ewayBillForm.value);
    this.salesItemDetails.clear(); // Clear existing items

    // Patch sales item details and disable product field
    data.salesItemDetails.forEach((item: any, index: number) => {
      this.onWareHouseSelect(item.salesWarehouseDetails, index);

      console.log("item", item);

      this.totalTaxableAmount = Number(item.salesItemTaxableAmount);

      const salesItem = this.fb.group({
        salesItemProduct: [item.salesItemProduct, [Validators.required]],
        salesItemQuantity: [
          item.salesItemQuantity,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(this.maxQuantity),
          ],
        ],
        salesItemUnitPrice: [
          item.salesItemUnitPrice,
          [Validators.required, Validators.min(0), Validators.max(100000)],
        ],
        salesItemTax: [item.salesItemTax],
        salesItemTotal: [item.salesItemTotal],
        salesItemTaxAmount: [item.salesItemTaxAmount],
        salesItemSubTotal: [
          item.salesItemSubTotal,
          [Validators.required, Validators.min(0)],
        ],
        maxQuantity: [item.maxQuantity],
        salesWarehouseDetails: [
          item.salesWarehouseDetails,
          [Validators.required],
        ],
        salesItemNonTaxableAmount: [
          item.salesItemNonTaxableAmount,
          Validators.min(0),
        ],
        salesItemTaxableAmount: [
          item.salesItemTaxableAmount,
          Validators.min(0),
        ],
        salesItemAppliedTaxAmount: [
          item.salesItemAppliedTaxAmount,
          Validators.min(0),
        ],
        salesItemPieces: [
          item.salesItemPieces,
          [Validators.required, Validators.min(0), Validators.max(100000)],
        ],
        sqftPerPiece: [item.sqftPerPiece],
      });

      this.salesItemDetails.push(salesItem);
      this.manuallyEditedPieces[index] = false; // Reset manual edit tracking for API patch

      this.handleTaxValidation()
    });
    this.isPatchingData = false; // Re-enable recalculations after patching
    this.calculateTotalAmount(); // Now calculate totals
  }

  openEwayBillPopup() {
    this.displayEwayBillPopup = true;
  }

  openShippingPopup() {
    this.UpdtshippingAddress = this.BuyerData?.shippingAddress;
    this.isUpdateAddress = true;
  }

  // Close the popup (if needed)
  closeEwayBillPopup() {
    this.displayEwayBillPopup = false;
    this.isUpdateAddress = true;
  }

  editAddress() {
    this.addressVisible = true;
  }

  setCustomer(value: any) {
    console.log("customer", value);
    const data = this.editSalesForm.get("customer").value;
    this.BuyerData = data;
    this.customerAddress = data.billingAddress;
  }
  getCustomer() {
    // this.customerService.GetCustomerData().subscribe((resp: any) => {
    //   this.originalCustomerData = resp;

    //   this.customerList = this.originalCustomerData.map((element) => ({
    //     name: element.name,
    //     _id: {
    //       _id: element._id,
    //       name: element.name,
    //       billingAddress: element.billingAddress,
    //       taxNo: element.taxNo,
    //       shippingAddress: element.shippingAddress,
    //     },
    //   }));
    // });
  }
  onSlabSelect(value, i) {
    console.log("value", value);

    console.log("this.originalSlabData", this.originalSlabData);
    const rec = this.originalSlabData?.find(
      (item) => item._id === value._id
    )?.subCategoryDetail;

    console.log("rec:", rec);

    if (rec && rec?.hsnCode) {
      const salesItemDetails = this.editSalesForm.get(
        "salesItemDetails"
      ) as FormArray;

      salesItemDetails?.controls?.forEach((salesItemGroup: FormGroup) => {
        const existingProduct = salesItemGroup.get("salesItemProduct")?.value;
        console.log("Existing Product:", existingProduct);
        // Use Object.assign to update the object without changing the reference
        if (existingProduct) {
          Object.assign(existingProduct, {
            hsnCode: rec?.hsnCode || null,
          });

          salesItemGroup.patchValue({
            salesItemProduct: existingProduct,
          });
        }
      });
    } else {
      console.error("hsnCode not found in rec:", rec);
    }

    const salesItemDetailsArray = this.editSalesForm.get(
      "salesItemDetails"
    ) as FormArray;

    const selectedSlab = this.slabData.find((slab) => slab._id === value._id);

    if (selectedSlab) {
      let remainingQuantity = selectedSlab.totalSQFT;
      for (let j = 0; j < salesItemDetailsArray.length; j++) {
        if (j !== i) {
          const currentRowSlab = salesItemDetailsArray
            .at(j)
            ?.get("salesItemProduct").value;
          if (currentRowSlab && currentRowSlab._id === value._id) {
            remainingQuantity -=
              salesItemDetailsArray.at(j)?.get("salesItemQuantity").value || 0;
          }
        }
      }

      const salesItemUnitPriceControl = salesItemDetailsArray
        .at(i)
        ?.get("salesItemUnitPrice");
      const maxQuantityControl = salesItemDetailsArray
        .at(i)
        ?.get("maxQuantity");
      const sqftPerPieceControl = salesItemDetailsArray
        .at(i)
        ?.get("sqftPerPiece");

      if (salesItemUnitPriceControl) {
        salesItemUnitPriceControl.patchValue(selectedSlab.sellingPricePerSQFT);
        this.calculateTotalAmount();
      }
      if (maxQuantityControl) {
        maxQuantityControl.setValue(
          remainingQuantity > 0 ? remainingQuantity : 0
        );
      }
      if (sqftPerPieceControl) {
        sqftPerPieceControl.patchValue(selectedSlab.sqftPerPiece);
        this.calculateTotalAmount();
      }
    } else {
      console.error("Slab not found!");
    }
  }
  isPiecesManuallyEdited: boolean = false;

  calculateTotalAmount() {
    let salesGrossTotal = 0;
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Calculates total amount of sales
 * @description
 * This function calculates total amount of sales based on the items in the salesItemDetails form array.
 * It also calculates taxable and non-taxable amounts and updates the form accordingly.
 */
/******  4c30cd54-ee29-4042-bbe1-0a7b607eb872  *******/    let salesOrderTax: number = 0;
    let taxable: number = 0;
    let nonTaxable: number = 0;
    const salesItems = this.editSalesForm.get("salesItemDetails") as FormArray;
    console.log("Starting calculation. isPatchingData:", this.isPatchingData);

    console.log("salesOrderTax", salesOrderTax);

    this.totalTaxableAmount = 0;
    salesItems.controls.forEach((item , index) => {
      const quantity = item.get("salesItemQuantity").value || 0;
      const unitPrice = item.get("salesItemUnitPrice").value || 0;
      const tax = item.get("salesItemTax").value || [];
      const sqftPerPiece = item.get("sqftPerPiece").value || 0;

      const pieces = quantity / sqftPerPiece;

      let totalTaxAmount = 0;
      const salesItemTaxableAmount = item.get("salesItemTaxableAmount").value || 0;
      this.totalTaxableAmount += Number(salesItemTaxableAmount);
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          totalTaxAmount +=
            (salesItemTaxableAmount * selectedTax.taxRate) / 100;
        });
      } else {
        totalTaxAmount = (salesItemTaxableAmount * tax) / 100;
      }
      const totalAmount = quantity * unitPrice;
      const salesItemNonTaxableAmount = totalAmount - salesItemTaxableAmount;
      const salesItemAppliedTaxAmount = salesItemTaxableAmount + totalTaxAmount;
      taxable += salesItemAppliedTaxAmount;
      const subtotal = quantity * unitPrice + totalTaxAmount;
      salesOrderTax += totalTaxAmount;
      salesGrossTotal += subtotal;

      if (totalAmount > 0) {
        // const salesItemTaxableAmount = item.get("salesItemTaxableAmount") as FormControl
        item.get("salesItemTaxableAmount").clearValidators();
        if(this.isrequired){
          item
          .get("salesItemTaxableAmount")
          .setValidators([
            Validators.required,
            Validators.max(totalAmount)
          ]);
        }else{
          item
          .get("salesItemTaxableAmount")
          .setValidators([
            Validators.max(totalAmount)
          ]);
        }
        item.get("salesItemTaxableAmount").updateValueAndValidity();

        item.get("salesItemNonTaxableAmount").clearValidators();
        item
          .get("salesItemNonTaxableAmount")
          .setValidators([Validators.max(totalAmount)]);
        item.get("salesItemNonTaxableAmount").updateValueAndValidity();
      }
   
const previousPieces = item.get("salesItemPieces").value;
const previousQuantity = item.get("salesItemQuantity")?.value || 0;

// ✅ Ensure recalculation when quantity is entered for new products right method
if (!this.manuallyEditedPieces[index] && !this.isPatchingData && quantity > 0 &&  (item.get("salesItemPieces").value === null || item.get("salesItemPieces").value === undefined || item.get("salesItemPieces").value === "" && (previousPieces === null || previousPieces === undefined || previousPieces === "" || previousPieces !== pieces ))) {
  console.log(`Auto-calculating pieces for index ${index}: ${pieces}`);
  item.get("salesItemPieces").setValue(Number(isNaN(pieces) ? 0 : pieces.toFixed(2)), { emitEvent: false });
} else {
  console.log(`Skipping recalculation for index ${index}, manually edited or already set.`);
}




// ---------------------------------------------------------

// second right method

// const previousPieces = item.get("salesItemPieces").value;
// const previousQuantity = item.get("salesItemQuantity")?.value || 0;

// console.log("previousQuantity", previousQuantity);

// // ✅ If user changes quantity after manually editing pieces, reset manual edit tracking
// if (this.manuallyEditedPieces[index] && previousQuantity !== quantity) {
//     console.log(`Quantity changed after manual edit for index ${index}, allowing recalculation.`);
//     this.manuallyEditedPieces[index] = false; // Reset manual edit tracking
// }

// // ✅ If the quantity changes, reset pieces to trigger recalculation
// if (!this.manuallyEditedPieces[index] && !this.isPatchingData && quantity > 0) {
   

//     // ✅ Recalculate `salesItemPieces` each time quantity changes (if not manually edited)
//     if (item.get("salesItemPieces").value === null || item.get("salesItemPieces").value === undefined || item.get("salesItemPieces").value === "" || previousPieces !== pieces) {

   
//         console.log(`Auto-recalculating pieces for index ${index}: ${pieces}`);
//         item.get("salesItemPieces").setValue(Number(isNaN(pieces) ? 0 : pieces.toFixed(2)), { emitEvent: false });
//     }
// } else {
//     console.log(`Skipping recalculation for index ${index}, manually edited or already set.`);
// }



      item.get("salesItemTotal").setValue(Number(totalAmount));
      item.get("salesItemTaxAmount").setValue(Number(totalTaxAmount));
      item
        .get("salesItemAppliedTaxAmount")
        .setValue(Number(salesItemAppliedTaxAmount));
      item
        .get("salesItemNonTaxableAmount")
        .setValue(Number(salesItemNonTaxableAmount));
      item.get("salesItemSubTotal").setValue(Number(subtotal));
    });

    let itemTotalAmount = salesGrossTotal;
    const discount = +this.editSalesForm.get("salesDiscount").value;
    const shipping = +this.editSalesForm.get("salesShipping").value;
    const otherCharges = +this.editSalesForm.get("otherCharges").value;

    // Check for shipping tax and other charges tax
    let shippingTaxAmount = 0;
    let otherChargesTaxAmount = 0;
    const isShippingTax = this.editSalesForm.get("isShippingTax").value; // checkbox value for shipping tax
    const isOtherChargesTax = this.editSalesForm.get("isOtherChargesTax").value; // checkbox value for other charges tax

    const item = salesItems.at(0);
    let taxRate = 0;
    if (isArray(item.get("salesItemTax")?.value)) taxRate = item.get("salesItemTax")?.value?.[0]?.taxRate;

    if (isShippingTax) {
      const shippingTaxRate = taxRate; // Tax rate for shipping
      shippingTaxAmount = (shipping * shippingTaxRate) / 100;
      taxable += shipping + shippingTaxAmount; // Add shipping and its tax to taxable amount;
      salesOrderTax += shippingTaxAmount;
    }

    // If other charges tax is applicable
    if (isOtherChargesTax) {
      const otherChargesTaxRate = taxRate; // Tax rate for other charges
      otherChargesTaxAmount = (otherCharges * otherChargesTaxRate) / 100;
      taxable += otherCharges + otherChargesTaxAmount; // Add other charges and its tax to taxable amount
      salesOrderTax += otherChargesTaxAmount;
    }

    this.editSalesForm.get("salesOrderTax").setValue(Number(salesOrderTax));
    this.editSalesForm.get("salesGrossTotal").setValue(Number(salesGrossTotal));

    // itemTotalAmount -= discount;
    // itemTotalAmount += shipping;
    // itemTotalAmount += otherCharges;
    // nonTaxable = itemTotalAmount - taxable;
    // nonTaxable =
    //   salesGrossTotal +
    //   shipping +
    //   otherCharges +
    //   otherChargesTaxAmount +
    //   shippingTaxAmount -
    //   taxable;
    // if (nonTaxable ) {
    //   nonTaxable -= discount;
    // } else {
    //   // itemTotalAmount -= discount;
    //   taxable -= discount;
    // }
    // itemTotalAmount = Number(nonTaxable) + Number(taxable);


  // Modify the existing discount calculation part in calculateTotalAmount method
nonTaxable =
salesGrossTotal +
shipping +
otherCharges +
otherChargesTaxAmount +
shippingTaxAmount -
taxable;

// Logging the initial calculation values
console.log('Discount Calculation - Initial Values:');
console.log('Original Non-Taxable Amount:', nonTaxable);
console.log('Original Taxable Amount:', taxable);
console.log('Discount Amount:', discount);

// New approach for discount calculation
let remainingDiscount = discount;

console.log('Starting Discount Subtraction Process');

// First, subtract from non-taxable amount
if (nonTaxable > 0) {
console.log(`Non-Taxable Amount before discount: ${nonTaxable}`);
console.log(`Remaining Discount: ${remainingDiscount}`);

if (remainingDiscount <= nonTaxable) {
  // If discount is less than or equal to non-taxable amount
  console.log(`Discount (${remainingDiscount}) is less than or equal to Non-Taxable Amount (${nonTaxable})`);
  nonTaxable -= remainingDiscount;
  remainingDiscount = 0;
  console.log(`Non-Taxable Amount after discount: ${nonTaxable}`);
} else {
  // If discount is more than non-taxable amount
  console.log(`Discount (${remainingDiscount}) is greater than Non-Taxable Amount (${nonTaxable})`);
  remainingDiscount -= nonTaxable;
  nonTaxable = 0; // Explicitly set to 0
  console.log('Non-Taxable Amount set to 0');
  console.log(`Remaining Discount after consuming Non-Taxable: ${remainingDiscount}`);
}
} else {
console.log('No Non-Taxable Amount to subtract discount from');
}

// If there's remaining discount, subtract from taxable amount
if (remainingDiscount > 0) {
console.log(`Applying remaining discount (${remainingDiscount}) to Taxable Amount`);
console.log(`Taxable Amount before discount: ${taxable}`);

taxable -= remainingDiscount;

console.log(`Taxable Amount after discount: ${taxable}`);
}

// Calculate total amount
itemTotalAmount = Number(nonTaxable) + Number(taxable);

console.log('Final Calculation Results:');
console.log('Non-Taxable Amount:', nonTaxable);
console.log('Taxable Amount:', taxable);
console.log('Total Item Amount:', itemTotalAmount);

// More robust logging for form value setting
try {
const salesTotalAmountControl = this.editSalesForm.get("salesTotalAmount");
const taxableControl = this.editSalesForm.get("taxable");
const nonTaxableControl = this.editSalesForm.get("nonTaxable");

if (salesTotalAmountControl) {
  salesTotalAmountControl.setValue(Number(itemTotalAmount));
  console.log('Sales Total Amount set to:', itemTotalAmount);
} else {
  console.error('Sales Total Amount control not found');
}

if (taxableControl) {
  taxableControl.setValue(Number(taxable));
  console.log('Taxable Amount set to:', taxable);
} else {
  console.error('Taxable control not found');
}

if (nonTaxableControl) {
  nonTaxableControl.setValue(Number(nonTaxable));
  console.log('Non-Taxable Amount set to:', nonTaxable);
} else {
  console.error('Non-Taxable control not found');
}

console.log('Discount calculation completed and form values updated');
} catch (error) {
console.error('Error setting form values:', error);
}
    if (this.setAddressData?.isTaxVendor) {
      this.taxVendorAmount();
    }

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("Updated Form Data:", this.editSalesForm.value);

  }
  onPiecesEdit(index: number) {
    this.manuallyEditedPieces[index] = true;
    console.log(`User manually edited pieces at index ${index}`);
}


  taxVendorAmount() {
    const vendorTaxApplied = this.editSalesForm.get("vendorTaxApplied").value;

    if (vendorTaxApplied) {
      const vendorTaxAmount =
        (this.totalTaxableAmount * vendorTaxApplied) / 100;
      this.editSalesForm
        .get("vendorTaxAmount")
        .setValue(Number(vendorTaxAmount));
    }
  }

  navigateToCreateCustomer() {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    this.router.navigateByUrl("/customers/add-customers");
  }

  onCheckboxChange(event: any) {
    const isChecked = event.checked;
    console.log("is checked>>>>>>", isChecked);
    if (isChecked) {
      this.editSalesForm.patchValue({
        isShippingTax: true,
      });
    } else {
      this.editSalesForm.patchValue({
        isShippingTax: false,
      });
    }
    // You can call the calculateTotalAmount when the checkbox is changed
    this.calculateTotalAmount();
  }

  isOtherTaxChange(event: any) {
    const isChecked = event.checked;
    console.log("is checked>>>>>>", isChecked);
    if (isChecked) {
      this.editSalesForm.patchValue({
        isOtherChargesTax: true,
      });
    } else {
      this.editSalesForm.patchValue({
        isOtherChargesTax: false,
      });
    }

    this.calculateTotalAmount();
  }

  addSalesFormSubmit() {
    this.editSalesForm.patchValue({
      customer: this.BuyerData,
    });
    console.log("click", this.editSalesForm.value);
    const formData = this.editSalesForm.value;

    const payload = {
      id: this.salesId,
      customer: formData.customer,
      isOtherChargesTax: formData.isOtherChargesTax,
      isShippingTax: formData.isShippingTax,
      salesDate: formData.salesDate,
      billingAddress: formData.billingAddress,
      salesDiscount: Number(formData.salesDiscount).toFixed(2),
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: Number(formData.salesGrossTotal).toFixed(2),
      salesShipping: Number(formData.salesShipping).toFixed(2),
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: Number(formData.salesTotalAmount).toFixed(2),
      otherCharges: Number(formData.otherCharges).toFixed(2),
      eWayBill: formData.eWayBill,
      taxVendor: this.setAddressData?.isTaxVendor
        ? {
            _id: this.setAddressData._id,
            companyName: this.setAddressData.companyName,
            taxVendorAmount: Number(formData.vendorTaxAmount).toFixed(2),
            vendorTaxApplied: Number(formData.vendorTaxApplied).toFixed(2),
          }
        : null,
      salesOrderTax: Number(formData.salesOrderTax).toFixed(2),
      taxable: Number(formData.taxable).toFixed(2),
      nonTaxable: Number(formData.nonTaxable).toFixed(2),
      creditPeriod: Number(formData.creditPeriod).toFixed(2),
    };

    if (this.editSalesForm.valid) {
      this.salesService.UpdateSalesData(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
            setTimeout(() => {
              this.router.navigate(["/sales"]);
            }, 400);
          } else {
            this.messageService.add({
              severity: "error",
              detail: resp.message,
            });
          }
        }
      });
    } else {
      console.log("Invalid form");
    }
  }
}
