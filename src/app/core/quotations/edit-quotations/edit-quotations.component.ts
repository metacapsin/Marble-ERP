import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../../Customers/customers.service";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { SlabsService } from "../../Product/slabs/slabs.service";
import { QuotationsService } from "../quotations.service";
import { SharedModule } from "src/app/shared/shared.module";
import { BillingAddressService } from "../../settings/billing-Address/billingAddress.service";

@Component({
  selector: "app-edit-quotations",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./edit-quotations.component.html",
  styleUrl: "./edit-quotations.component.scss",
})
export class EditQuotationsComponent {
  editQuotationForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  public searchData_id = "";
  addTaxTotal: any;
  customerList: any = [];
  originalCustomerData = [];
  slabList = [];
  slabData = [];

  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  maxQuantity: number;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex =  /^[\s\S]{2,100}$/;
  customer: any[] = [];
  returnUrl: string;
  wareHousedataListsEditArray: any[];
  originalSlabData: any;
  slabDatas: any;
  slabDataList: any = [];
  quotationId: any;
  setAddressData: any;
  addressVisible: boolean;
  address: any;
  customerAddress: any;
  orgAddress: any;
  dropAddress: any[];
  addQuotationForm: any;
  UpdtshippingAddress: any;
  isUpdateAddress: boolean;
  BuyerData: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private QuotationsService: QuotationsService,
    private customerService: CustomersdataService,
    private slabService: SlabsService,
    private taxService: TaxesService,
    private fb: FormBuilder,
    private SlabsService: SlabsService,
    private localStorageService: LocalStorageService,
    private services: WarehouseService,
    private quotationsService: QuotationsService,
    private BillingAddressService: BillingAddressService
  ) {
    this.editQuotationForm = this.fb.group({
      customer: ["", [Validators.required]],
      billingAddress: [""],

      quotationDate: ["", [Validators.required]],
      quotationDiscount: ["", [Validators.min(0), Validators.max(100000)]],
      quotationInvoiceNumber: [""],
      quotationItemDetails: this.fb.array([
        this.fb.group({
          quotationItemProduct: ["", [Validators.required]],
          quotationItemQuantity: [
            "",
            [
              Validators.required,
              Validators.min(0),
              // Validators.max(this.maxQuantity),
            ],
          ],
          quotationItemUnitPrice: [
            "",
            [Validators.required, Validators.min(0)],
          ],
          quotationItemTax: [""],
          quotationItemTaxAmount: [""],
          quotationItemSubTotal: ["", [Validators.required, Validators.min(0)]],
          maxQuantity: [" "],
          quotationWarehouseDetails: ["", [Validators.required]],
        }),
      ]),
      quotationNotes: ["", [Validators.pattern(this.notesRegex)]],
      quotationGrossTotal: [""],
      // quotationStatus: ["", [Validators.required]],
      quotationTax: [""],
      appliedTax: [""],
      quotationShipping: ["", [Validators.min(0), Validators.max(100000)]],
      quotationTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      quotationTotalAmount: [""],
      otherCharges: ["", [Validators.min(0), Validators.max(100000)]],
    });
    this.quotationId = this.activeRoute.snapshot.params["id"];
  }

  get quotationItemDetails() {
    return this.editQuotationForm.controls["quotationItemDetails"] as FormArray;
  }

  deletequotationItemDetails(quotationItemDetailsIndex: number) {
    this.quotationItemDetails.removeAt(quotationItemDetailsIndex);

    if (
      quotationItemDetailsIndex > -1 &&
      quotationItemDetailsIndex < this.slabDataList.length
    ) {
      this.slabDataList.splice(quotationItemDetailsIndex, 1);
    } else {
      console.log("quotationItemDetailsIndex out of range");
    }
    this.calculateTotalAmount();
  }

  addquotationItemDetailsItem() {
    const item = this.fb.group({
      quotationItemProduct: ["", [Validators.required]],
      quotationItemQuantity: ["", [Validators.required, Validators.min(0)]],
      quotationItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      quotationItemTax: [""],
      quotationItemSubTotal: ["", [Validators.required, Validators.min(0)]],
      quotationItemTaxAmount: [""],
      maxQuantity: [""],
      quotationWarehouseDetails: ["", [Validators.required]],
    });
    this.quotationItemDetails.push(item);
  }
  onWareHouseSelect(value: any, i: number) {
    console.log("value", value, "i", i);

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
        this.quotationItemDetails.controls.forEach((element, index) => {
          console.log("before if", "index", index, "element", element);

          if (i === index) {
            this.slabDataList[index] = this.slabDatas;
            console.log("if", this.slabDataList[index]);

            // const control = this.quotationItemDetails.at(i);
            // control.get("quotationItemProduct").reset();
            // control.get("quotationItemQuantity").reset();
            // control.get("quotationItemUnitPrice").reset();
            // control.get("quotationItemTax").reset();
            // control.get("quotationItemSubTotal").reset();
            this.calculateTotalAmount();
          } else if (!this.slabDataList[index]) {
            this.slabDataList[index] = [];
            console.log("else", this.slabDataList);
          }
        });
        this.slabDataList.push(this.slabDatas);
        console.log("this.slabDataList", this.slabDataList);
      }
    );
    console.log(
      "----------------------------####################----------------"
    );
  }
  ngOnInit() {
    this.customerList = this.getCustomer();
    this.customer = this.localStorageService.getItem("customer");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    console.log("this is retrun url", this.returnUrl);
    console.log(
      "this is customer data by local sotrage service",
      this.customer
    );
    if (this.customer) {
      this.editQuotationForm.patchValue({
        customer: this.customer,
      });
    }

    this.BillingAddressService.getBillingAddressList().subscribe(
      (resp: any) => {
        this.address = resp.data;
        this.orgAddress = resp.data;
        this.dropAddress = [];
        this.orgAddress.forEach((ele) => {
          this.dropAddress.push({
            name: `${ele.companyName} / ${ele.city},`,
            _id: ele,
          });
        });
        console.log(this.address);
        const filterData = this.address.find((e) => e.setAsDefault);
        this.editQuotationForm.get("billingAddress").patchValue(filterData);
        console.log(this.editQuotationForm.get("billingAddress")?.value);
        console.log(filterData);
      }
    );

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
      this.orderTaxList = this.taxesListData.map((element) => ({
        orderTaxName: `${element.name} (${element.taxRate}%)`,
        orderNamevalue: element,
      }));
    });

    // this.slabService.getSlabsList().subscribe((resp: any) => {
    //   this.slabData = resp.data;
    //   this.slabList = this.slabData.map((e) => ({
    //     slabName: e.slabName,
    //     _id: {
    //       _id: e._id,
    //       slabName: e.slabName,
    //       slabNo: e.slabNo,
    //     },
    //   }
    //   ));
    // });
    this.quotationsService
      .getQuotationById(this.quotationId)
      .subscribe((resp: any) => {
        console.log(resp);
        this.patchForm(resp.data);
        // this.getCustomer();
        this.customerAddress = resp.data.customer.billingAddress;
        console.log(resp.data.customer.billingAddress);
      });
  }

  editAddressWithDrop() {
    this.setAddressData = this.editQuotationForm.get("billingAddress")?.value;
    console.log(this.setAddressData);
  }
  editAddress() {
    this.addressVisible = true;
  }

  setCustomer(value) {
    console.log("customer", value);
    const data = this.editQuotationForm.get("customer").value;
    this.BuyerData = data;
    this.customerAddress = data.billingAddress;
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
        const value = this.editQuotationForm.get("customer").value;
        let data = {
          billingAddress: value.billingAddress,
          name: value.name,
          shippingAddress: this.UpdtshippingAddress,
          taxNo: value.taxNo,
          _id: value._id,
        };

        console.log("data<<<<<", data);

        // this.editQuotationForm.patchValue({
        //   customer:data
        // })
        console.log(" this.editQuotationForm<<<<<", this.editQuotationForm.value);

        this.BuyerData = data;
        this.customerAddress = data.billingAddress;
        // this.getCustomer();
        this.isUpdateAddress = false;
      }
    });
  }
  getCustomer() {
    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      console.log("this is customer respone", resp);
      // this.customerAddress=resp.billingAddress
      console.log(this.customerAddress);
      this.customerList = this.originalCustomerData.map((element) => ({
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name,
          billingAddress: element.billingAddress,
          shippingAddress: element.shippingAddress,
        },
      }));
    });
  }

  openShippingPopup() {
    this.UpdtshippingAddress = this.BuyerData?.shippingAddress;
    this.isUpdateAddress = true;
  }
  
  // Close the popup (if needed)
  closeEwayBillPopup() {
    this.isUpdateAddress = true;
  }
  

  onSlabSelect(value, i) {
    const quotationItemDetailsArray = this.editQuotationForm.get(
      "quotationItemDetails"
    ) as FormArray;

    const selectedSlab = this.slabData.find((slab) => slab._id === value._id);

    if (selectedSlab) {
      console.log("Slab Found", selectedSlab);

      // Calculate remaining quantity for the selected slab
      let remainingQuantity = selectedSlab.totalSQFT;
      for (let j = 0; j < quotationItemDetailsArray.length; j++) {
        if (j !== i) {
          const currentRowSlab = quotationItemDetailsArray
            .at(j)
            ?.get("quotationItemProduct").value;
          if (currentRowSlab && currentRowSlab._id === value._id) {
            remainingQuantity -=
              quotationItemDetailsArray.at(j)?.get("quotationItemQuantity")
                .value || 0;
          }
        }
      }

      const quotationItemUnitPriceControl = quotationItemDetailsArray
        .at(i)
        ?.get("quotationItemUnitPrice");
      const maxQuantityControl = quotationItemDetailsArray
        .at(i)
        ?.get("maxQuantity");

      if (quotationItemUnitPriceControl) {
        quotationItemUnitPriceControl.patchValue(
          selectedSlab.sellingPricePerSQFT
        );
        this.calculateTotalAmount();
      }
      if (maxQuantityControl) {
        maxQuantityControl.setValue(
          remainingQuantity > 0 ? remainingQuantity : 0
        );
      }
    } else {
      console.error("Slab not found!");
    }
  }

  calculateTotalAmount() {
    console.log("Calculating total amount");
    let quotationGrossTotal = 0;
    let quotationTax: number = 0;
    const salesItems = this.editQuotationForm.get(
      "quotationItemDetails"
    ) as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get("quotationItemQuantity").value || 0;
      const unitPrice = +item.get("quotationItemUnitPrice").value || 0;
      const tax = item.get("quotationItemTax").value || [];

      let totalTaxAmount = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          totalTaxAmount += (quantity * unitPrice * selectedTax.taxRate) / 100;
        });
      } else {
        totalTaxAmount = (quantity * unitPrice * tax) / 100;
      }

      const subtotal = quantity * unitPrice + totalTaxAmount;
      quotationTax += totalTaxAmount;

      quotationGrossTotal += subtotal;
      item
        .get("quotationItemTaxAmount")
        .setValue(Number(totalTaxAmount.toFixed(2)));
      item.get("quotationItemSubTotal").setValue(Number(subtotal.toFixed(2)));
    });

    this.editQuotationForm
      .get("quotationTax")
      .setValue(Number(quotationTax.toFixed(2)));
    this.editQuotationForm
      .get("quotationGrossTotal")
      .setValue(Number(quotationGrossTotal.toFixed(2)));

    const discount = +this.editQuotationForm.get("quotationDiscount").value || 0;
    const shipping = +this.editQuotationForm.get("quotationShipping").value || 0;
    const otherCharges = +this.editQuotationForm.get("otherCharges").value || 0;

    let totalAmount = quotationGrossTotal - discount + shipping + otherCharges;

    if (discount > quotationGrossTotal) {
      this.editQuotationForm.get("quotationDiscount").setErrors({ 'invalid': true });
    } else if (discount === quotationGrossTotal) {
      this.editQuotationForm.get("quotationDiscount").setErrors({ 'equalToGrossTotal': true });
      totalAmount = 0; // Set total amount to 0 when discount equals gross total
    } else {
      this.editQuotationForm.get("quotationDiscount").setErrors(null);
    }

    console.log("Total Amount:", totalAmount);
    this.editQuotationForm
      .get("quotationTotalAmount")
      .setValue(Number(totalAmount.toFixed(2)));
  }

  patchForm(data) {

    this.editQuotationForm.patchValue({
      billingAddress: data.billingAddress,
      customer: data.customer,
      quotationDate: data.quotationDate,
      quotationDiscount: data.quotationDiscount,
      quotationInvoiceNumber: data.quotationInvoiceNumber,
      quotationNotes: data.quotationNotes,
      quotationGrossTotal: data.quotationGrossTotal,
      quotationShipping: data.quotationShipping,
      quotationTermsAndCondition: data.quotationTermsAndCondition,
      quotationTotalAmount: data.quotationTotalAmount,
      otherCharges: data.otherCharges,
    });
    this.setCustomer(data.customer);
    this.quotationItemDetails.clear(); // Clear existing items

    // Patch sales item details and disable product field
    data.quotationItemDetails.forEach((item: any, index: number) => {
      const quotationItem = this.fb.group({
        quotationItemProduct: [
          item.quotationItemProduct,
          [Validators.required],
        ],
        quotationItemQuantity: [
          item.quotationItemQuantity,
          [Validators.required, Validators.min(0)],
        ],
        quotationItemUnitPrice: [
          item.quotationItemUnitPrice,
          [Validators.required, Validators.min(0)],
        ],
        quotationItemTax: [item.quotationItemTax],
        quotationItemTaxAmount: [item.quotationItemTaxAmount],
        quotationItemSubTotal: [
          item.quotationItemSubTotal,
          [Validators.required, Validators.min(0)],
        ],
        maxQuantity: [item.maxQuantity],
        quotationWarehouseDetails: [
          item.quotationWarehouseDetails,
          [Validators.required],
        ],
      });
      this.onWareHouseSelect(item.quotationWarehouseDetails, index);
      this.quotationItemDetails.push(quotationItem);
    });
  }

  editQuotationFormSubmit() {
    const formData = this.editQuotationForm.value;
    console.log(formData);
    const payload = {
      customer: formData.customer,
      quotationDate: formData.quotationDate,
      quotationDiscount: formData.quotationDiscount,
      quotationInvoiceNumber: formData.quotationInvoiceNumber,
      quotationItemDetails: formData.quotationItemDetails,
      quotationNotes: formData.quotationNotes,
      quotationGrossTotal: Number(formData.quotationGrossTotal),
      quotationShipping: formData.quotationShipping,
      quotationTermsAndCondition: formData.quotationTermsAndCondition,
      quotationTotalAmount: formData.quotationTotalAmount,
      otherCharges: formData.otherCharges,
      quotationTax: Number(formData.quotationTax),
      id: this.quotationId,
      billingAddress: formData.billingAddress,

    };

    if (this.editQuotationForm.valid) {
      console.log("Valid form Quotation payload", payload);

      this.QuotationsService.updateQuotation(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Quotation has been updated";
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
