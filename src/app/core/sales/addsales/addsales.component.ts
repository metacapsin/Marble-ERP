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
import { BillingAddressService } from "../../settings/billing-Address/billingAddress.service";
import { validationRegex } from "../../validation";
import { isArray } from "ngx-bootstrap/chronos";
import { dashboardService } from "../../dashboard/dashboard.service";

@Component({
  selector: "app-addsales",
  standalone: true,
  imports: [SharedModule],
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
  addressVisible: any = false;
  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  maxQuantity: number;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,30})$/;
  notesRegex = /^[\s\S]{2,100}$/;
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
  BuyerData: any;
  ewayBillForm: FormGroup;
  vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}(?: ?[A-Z])?(?: ?[A-Z]*)? ?[0-9]{4}$/;
  displayEwayBillPopup: boolean = false;
  EwayBill: any;
  UpdtshippingAddress: any;
  isUpdateAddress: boolean = false;
  isrequired: boolean = false;
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
    private BillingAddressService: BillingAddressService,
    private dashboard: dashboardService
  ) {
    this.ewayBillForm = this.fb.group({
      eWayBillNo: ["", Validators.required],
      date: [null, Validators.required],
      dispatchedThrough: ["", Validators.required],
      transporter: ["", Validators.required],
      vehicleNumber: ["", Validators.pattern(this.vehicleRegex)],
      deliveryTerms: [""],
    });

    this.addSalesForm = this.fb.group({
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
      isShippingTax: [false],
      isOtherChargesTax: [false],
      eWayBill: [""],
    });

    // Set up a value change subscription to update the max validator for salesDiscount
    this.addSalesForm.get("salesGrossTotal").valueChanges.subscribe((value) => {
      const salesDiscountControl = this.addSalesForm.get("salesDiscount");
      salesDiscountControl.setValidators([
        Validators.min(0),
        Validators.max(value || 0),
      ]);
      salesDiscountControl.updateValueAndValidity();
    });
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

  get salesItemDetails() {
    return this.addSalesForm.controls["salesItemDetails"] as FormArray;
  }

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
    this.calculateTotalAmount();
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
    this.isUpdateAddress = false;
  }

  toUpperCase(event: any) {
    let val = event.target.value.toUpperCase();
    this.ewayBillForm.patchValue({
      vehicleNumber: val,
    });
  }

  UpdateShippingAddress() {
    let customer = this.originalCustomerData.find(
      (item) => item?._id === this.BuyerData?._id
    );
    console.log("customer", customer);

    let payload = {
      shippingAddress: this.UpdtshippingAddress,
      phoneNo: customer.phoneNo,
      name: customer.name,
      _id: customer._id,
    };

    this.customerService.UpDataCustomerApi(payload).subscribe((resp: any) => {
      if (resp.status === "success") {
        const value = this.addSalesForm.get("customer").value;
        let data = {
          billingAddress: value.billingAddress,
          name: value.name,
          shippingAddress: this.UpdtshippingAddress,
          taxNo: value.taxNo,
          _id: value._id,
        };

        // this.addSalesForm.patchValue({
        //   customer: data,
        // });

        this.BuyerData = data;
        this.customerAddress = data.billingAddress;
        // this.getCustomer();
        this.isUpdateAddress = false;
      }
    });
  }

  onCheckboxChange(event: any) {
    const isChecked = event.checked;
    console.log("is checked>>>>>>", isChecked);
    if (isChecked) {
      this.addSalesForm.patchValue({
        isShippingTax: true,
      });
    } else {
      this.addSalesForm.patchValue({
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
      this.addSalesForm.patchValue({
        isOtherChargesTax: true,
      });
    } else {
      this.addSalesForm.patchValue({
        isOtherChargesTax: false,
      });
    }

    this.calculateTotalAmount();
  }

  // On form submit
  onSubmit() {
    if (this.ewayBillForm.valid) {
      console.log("E-way Bill Data:", this.ewayBillForm.value);
      let formData = this.ewayBillForm.value;
      // console.log('formdata',formData)
      // let formaeDate =formData?.date.toLocaleDateString("en-US");

      let payload = {
        date: formData.date,
        eWayBillNo: formData.eWayBillNo,
        dispatchedThrough: formData.dispatchedThrough,
        transporter: formData.transporter,
        vehicleNumber: formData.vehicleNumber,
        deliveryTerms: formData.deliveryTerms,
      };
      // console.log('payload',payload)
      this.EwayBill = payload;
      this.addSalesForm.patchValue({
        eWayBill: payload,
      });

      this.displayEwayBillPopup = false;
    }

    console.log("E-way Bill addSalesForm:", this.addSalesForm.value);
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
            costPerSQFT: element.costPerSQFT,
            salesItemTotalQuantity: element.totalSlabSQFT,
            hsnCode: element.subCategoryDetail?.hsnCode,
          },
          sellingPricePerSQFT: element.sellingPricePerSQFT,
          sqftPerPiece: element.sqftPerPiece,
          totalSQFT: element.totalSQFT,
        }));
        console.log(" this.salesItemDetails", this.salesItemDetails);
        this.salesItemDetails.controls.forEach((element, index) => {
          if (i === index) {
            this.slabDataList[index] = this.slabDatas;
            const control = this.salesItemDetails.at(i);
            // control.get("salesItemProduct").reset();
            control.get("salesItemQuantity").reset();
            control.get("salesItemUnitPrice").reset();
            control.get("salesItemTax").reset();
            // this.calculateTotalAmount();
          } else if (!this.slabDataList[index]) {
            this.slabDataList[index] = [];
          }
        });
      }
    );
  }
  editAddressWithDrop() {
    this.setAddressData = this.addSalesForm.get("billingAddress")?.value;
    console.log("setaddress", this.setAddressData);

    // Check if the billing address indicates that the vendor tax is applied
    if (this.setAddressData?.isTaxVendor) {
      this.isrequired = true;
      // Set validators for vendorTaxApplied field
      this.addSalesForm
        .get("vendorTaxApplied")
        .setValidators([Validators.required]);

      // Set validators for salesItemTaxableAmount inside each salesItemDetails entry
      const salesItemDetails = this.addSalesForm.get(
        "salesItemDetails"
      ) as FormArray;
      salesItemDetails.controls.forEach((itemGroup: FormGroup) => {
        itemGroup.get("salesItemTaxableAmount")?.setValidators([Validators.required]);
      });
    } else {
      // Remove validators if isTaxVendor is false
      this.addSalesForm.get("vendorTaxApplied").setValidators([]);

      // Remove validators for salesItemTaxableAmount inside each salesItemDetails entry
      const salesItemDetails = this.addSalesForm.get(
        "salesItemDetails"
      ) as FormArray;
      salesItemDetails.controls.forEach((itemGroup: FormGroup) => {
        itemGroup.get("salesItemTaxableAmount")?.setValidators([]);
      });
    }

    // Update the validity of the fields after modifying the validators
    this.addSalesForm.get("vendorTaxApplied")?.updateValueAndValidity();

    // Iterate through the salesItemDetails array and update validity for each salesItemTaxableAmount
    const salesItemDetails = this.addSalesForm.get(
      "salesItemDetails"
    ) as FormArray;
    salesItemDetails.controls.forEach((itemGroup: FormGroup) => {
      itemGroup.get("salesItemTaxableAmount")?.updateValueAndValidity();
    });

    // Optionally, update other fields as needed
    this.addSalesForm.patchValue({
      salesTermsAndCondition: this.setAddressData?.termsAndCondition,
    });
  }

  ngOnInit() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US"); // Format to MM/DD/YYYY

    this.addSalesForm.patchValue({
      salesDate: formattedDate,
    });
    this.salesService.getVendorBillingList().subscribe((resp: any) => {
      this.address = resp.data;
      console.log(" this.address", this.address);
      this.orgAddress = resp.data;
      this.dropAddress = [];
      this.orgAddress.forEach((ele) => {
        this.dropAddress.push({
          name: `${ele.companyName} / ${ele.city},`,
          _id: ele,
        });
      });
      const filterData = this.address.find((e) => e.setAsDefault);
      if (!filterData) {
        const message = "First you want to set one billing Address as Default";
        this.messageService.add({ severity: "error", detail: message });
      }
      this.addSalesForm.get("billingAddress").patchValue(filterData);
    });

    this.customerList = this.getCustomer();
    this.customer = this.localStorageService.getItem("customer");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    if (this.customer) {
      this.addSalesForm.patchValue({
        customer: this.customer,
      });
      this.customerAddress = this.customer.billingAddress;
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
    });

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = this.taxesListData.map((element) => ({
        orderTaxName: `${element.name} (${element.taxRate}%)`,
        orderNamevalue: element,
      }));
    });

    this.slabService.getSlabsList().subscribe((resp: any) => {
      this.slabData = resp.data;
      this.slabList = this.slabData.map((e) => ({
        slabName: e.slabName,
        _id: {
          _id: e._id,
          slabName: e.slabName,
          slabNo: e.slabNo,
        },
      }));
    });
  }
  editAddress() {
    this.addressVisible = true;
  }

  setCustomer(value: any) {
    console.log("customer", this.addSalesForm.value);
    const data = this.addSalesForm.get("customer").value;
    this.customerAddress = data.billingAddress;
    this.BuyerData = data;
    console.log("  this.BuyerData", this.BuyerData);
  }

  getCustomer() {
    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;

      this.customerList = this.originalCustomerData.map((element) => ({
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name,
          taxNo: element.taxNo,
          billingAddress: element.billingAddress,
          shippingAddress: element.shippingAddress,
        },
      }));
    });
  }
  onSlabSelect(value, i) {
    console.log("val", value);
    console.log("this.slabDataList[i]", this.slabDataList[i]);
    const selectedItem = this.slabDataList[i].find(
      (item) => item._id._id === value._id
    );

    console.log("val", selectedItem);
    const control = this.salesItemDetails.at(i);
    // control.get("salesItemProduct").reset();
    if (selectedItem) {
      if (selectedItem.totalSQFT === 0) {
        console.log("00");
        control.get("salesItemProduct").reset();
        return;
      }
    }

    console.log("this.originalSlabData", this.originalSlabData);
    const rec = this.originalSlabData?.find(
      (item) => item._id === value._id
    )?.subCategoryDetail;

    console.log("rec:", rec);

    if (rec && rec?.hsnCode) {
      const salesItemDetails = this.addSalesForm.get(
        "salesItemDetails"
      ) as FormArray;

      salesItemDetails?.controls?.forEach((salesItemGroup: FormGroup) => {
        const existingProduct = salesItemGroup.get("salesItemProduct")?.value;

        // Use Object.assign to update the object without changing the reference
        Object.assign(existingProduct, {
          hsnCode: rec?.hsnCode || null,
        });

        salesItemGroup.patchValue({
          salesItemProduct: existingProduct,
        });
      });
    } else {
      console.error("hsnCode not found in rec:", rec);
    }

    console.log("salesItemDetails", this.addSalesForm);

    const salesItemDetailsArray = this.addSalesForm.get(
      "salesItemDetails"
    ) as FormArray;

    console.log("salesItemDetailsArray", salesItemDetailsArray);

    const selectedSlab = this.slabDataList[i].find(
      (slab) => slab._id?._id === value._id
    );
    console.log("selectedSlab", selectedSlab);

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
        sqftPerPieceControl.setValue(selectedSlab.sqftPerPiece);
        this.calculateTotalAmount();
      }
    } else {
      console.error("Slab not found!");
    }
  }
  
  calculateTotalAmount() {
    // debugger
    // this.editAddressWithDrop()
    let salesGrossTotal = 0;
    let salesOrderTax: number = 0;
    let taxable: number = 0;
    let nonTaxable: number = 0;

    const salesItems = this.addSalesForm.get("salesItemDetails") as FormArray;

    this.totalTaxableAmount = 0;
    salesItems.controls.forEach((item) => {
      const quantity = +item.get("salesItemQuantity").value || 0;
      const unitPrice = +item.get("salesItemUnitPrice").value || 0;
      const tax = item.get("salesItemTax").value || [];
      const sqftPerPiece = +item.get("sqftPerPiece").value || 0;

      console.log("quantity", quantity);
      console.log("sqftPerPiece", sqftPerPiece);

      const pieces = quantity / sqftPerPiece;
      console.log("pieces", pieces);
      let totalTaxAmount = 0;
      const salesItemTaxableAmount = item.get("salesItemTaxableAmount").value || 0;
      this.totalTaxableAmount += Number(salesItemTaxableAmount);
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any, index: any) => {
          if (index == 0) {
          }
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
      item.get("salesItemPieces").setValue(Number(isNaN(pieces) ? 0 : pieces.toFixed(2)));
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
    const discount = +this.addSalesForm.get("salesDiscount").value;
    const shipping = +this.addSalesForm.get("salesShipping").value;
    const otherCharges = +this.addSalesForm.get("otherCharges").value;

    // Check for shipping tax and other charges tax
    let shippingTaxAmount = 0;
    let otherChargesTaxAmount = 0;
    const isShippingTax = this.addSalesForm.get("isShippingTax").value; // checkbox value for shipping tax
    const isOtherChargesTax = this.addSalesForm.get("isOtherChargesTax").value; // checkbox value for other charges tax

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

    this.addSalesForm.get("salesOrderTax").setValue(Number(salesOrderTax));
    this.addSalesForm.get("salesGrossTotal").setValue(Number(salesGrossTotal));


    console.log('--',salesGrossTotal,shipping,otherCharges,otherChargesTaxAmount,shippingTaxAmount,taxable,'--');
    
    nonTaxable =
      (salesGrossTotal +
      shipping +
      otherCharges +
      otherChargesTaxAmount +
      shippingTaxAmount) -
      taxable;
    itemTotalAmount = Number(nonTaxable) + Number(taxable);
    if (nonTaxable) {
      nonTaxable -= discount;
    } else {
      taxable -= discount;
      // itemTotalAmount -= discount;
    }
    this.addSalesForm.get("salesTotalAmount").setValue(Number(itemTotalAmount));
    this.addSalesForm.get("taxable").setValue(Number(taxable));
    this.addSalesForm.get("nonTaxable").setValue(Number(nonTaxable));
    if (this.setAddressData?.isTaxVendor) {
      this.taxVendorAmount();
    }

    console.log("Updated salesItemDetails:", this.addSalesForm.value);
  }

  calculatesummaryTaxAmount(_type: any) {
    console.log(_type);
  }
  taxVendorAmount() {
    const vendorTaxApplied = this.addSalesForm.get("vendorTaxApplied").value;

    if (vendorTaxApplied) {
      const vendorTaxAmount =
        (this.totalTaxableAmount * vendorTaxApplied) / 100;
      this.addSalesForm
        .get("vendorTaxAmount")
        .setValue(Number(vendorTaxAmount));
    }
  }

  navigateToCreateCustomer() {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    this.router.navigateByUrl("/customers/add-customers");
  }

  addSalesFormSubmit() {
    const formData = this.addSalesForm.value;

    console.log("formData", formData);
    // console.log(object)
    const payload = {
      eWayBill: formData.eWayBill,
      isOtherChargesTax: formData.isOtherChargesTax,
      isShippingTax: formData.isShippingTax,
      customer: formData.customer,
      salesDate: formData.salesDate,
      billingAddress: formData.billingAddress,
      salesDiscount: Number(formData.salesDiscount),
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: Number(formData.salesGrossTotal),
      salesShipping: Number(formData.salesShipping),
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: Number(formData.salesTotalAmount),
      otherCharges: Number(formData.otherCharges),
      taxVendor: this.setAddressData?.isTaxVendor
        ? {
            _id: this.setAddressData._id,
            companyName: this.setAddressData.companyName,
            taxVendorAmount: Number(formData.vendorTaxAmount),
            vendorTaxApplied: Number(formData.vendorTaxApplied),
          }
        : null,
      salesOrderTax: Number(formData.salesOrderTax),
      taxable: Number(formData.taxable),
      nonTaxable: Number(formData.nonTaxable),
      creditPeriod: Number(formData.creditPeriod),
    };

    if (this.addSalesForm.valid) {
      this.salesService.AddSalesData(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              if (this.returnUrl == "/sales/add-sales") {
                this.router.navigate(["/sales"]);
              } else {
                this.router.navigateByUrl(this.returnUrl);
              }
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
