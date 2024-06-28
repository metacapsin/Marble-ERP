import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { StepperModule } from "primeng/stepper";
import { ButtonModule } from "primeng/button";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { AddLotComponent } from "../../Product/lot/add-lot/add-lot.component";
import { AddSlabsComponent } from "../../Product/slabs/add-slabs/add-slabs.component";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { NewPurchaseService } from "../new-purchase.service";
import { AccordionModule } from "primeng/accordion";
import { Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-add-new-purchase",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    StepperModule,
    ButtonModule,
    CalendarModule,
    AddLotComponent,
    DropdownModule,
    AddSlabsComponent,
    AccordionModule,
    ToastModule
  ],
  templateUrl: "./add-new-purchase.component.html",
  styleUrl: "./add-new-purchase.component.scss",
  providers: [MessageService]
})
export class AddNewPurchaseComponent implements OnInit {
  public routes = routes;
  maxDate = new Date();
  SupplierLists: any[];
  lotsNoArray = [
    { name: "Lot", _id: "Lot" },
    { name: "Slab", _id: "Slab" },
  ];
  addNewPurchaseForm!: FormGroup;
  lotTypeValue: any;
  wareHousedataListsEditArray: any[];
  wareHousedata: any;
  SubCategoryListsEditArray: any;
  subCategoryList: any;
  CategoryListsEditArray: any;
  categoryList: any;
  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  getSupplierShow: any;
  totalCostPerSQFT: any = 0;
  transportationCharges: any;
  otherCharges: any;
  lotWeight: any;
  priceperTon: any;
  taxAmount: any;
  lotTotalCost: any;
  totalRawCosting: any;
  ItemDetails: any = {};

  shortNameRegex = /^[^-\s][a-zA-Z0-9_\s-]{2,14}$/;
  notesRegex = /^(?:.{2,100})$/;

  returnUrl: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private services: WarehouseService,
    private categoriesService: CategoriesService,
    private Service: SuppliersdataService,
    private subCategoriesService: SubCategoriesService,
    private NewPurchaseService: NewPurchaseService,
    private messageService: MessageService,
  private localStorageService: LocalStorageService) {
    this.addNewPurchaseForm = this.fb.group({
      invoiceNumber: [""],
      purchaseDate: ["", Validators.required],
      supplier: ["", [Validators.required]],
      paidToSupplierPurchaseCost: ["", [Validators.required, Validators.min(1), Validators.max(9999999)]],
      purchaseType: ["", [Validators.required]],
      purchaseNotes: ["", [Validators.pattern(this.notesRegex)]],
      slabNo: ["", [Validators.required, Validators.pattern(this.shortNameRegex)],],
      warehouseDetails: ["", [Validators.required]],
      categoryDetail: ["", [Validators.required]],
      subCategoryDetail: ["", [Validators.required]],
      totalSQFT: ["", [Validators.required, Validators.min(1), Validators.max(100000)]],
      width: ["", [Validators.min(1), Validators.max(100000)]],
      length: ["", [Validators.min(1), Validators.max(100000)]],
      thickness: ["", [Validators.min(1), Validators.max(1000)]],
      finishes: ["", [Validators.required]],
      sellingPricePerSQFT: ["", [Validators.required, Validators.min(1), Validators.max(1000000)]],
      transportationCharges: ["", [Validators.min(1), Validators.max(100000)]],
      otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
      totalCosting: [''],

    });
  }
  ngOnInit(): void {
    this.returnUrl = this.localStorageService.getItem("returnUrl");

    this.services.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
      this.wareHousedataListsEditArray = [];
      this.wareHousedata.forEach((element: any) => {
        this.wareHousedataListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
    this.Service.GetSupplierData().subscribe((data: any) => {
      this.getSupplierShow = data;
      this.SupplierLists = [];
      this.getSupplierShow.forEach((element: any) => {
        this.SupplierLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
            billingAddress: element.billingAddress,
          },
        });
      });
    });
    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
      this.CategoryListsEditArray = [];
      this.categoryList.forEach((element: any) => {
        this.CategoryListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
      this.SubCategoryListsEditArray = [];
      this.subCategoryList.forEach((element: any) => {
        this.SubCategoryListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
  }


  nextStep(nextCallback: any) {
    const payload = this.addNewPurchaseForm.value.paidToSupplierPurchaseCost;
    this.NewPurchaseService.setFormData("stepperOneData", payload);
    nextCallback.emit();
    this.calculateTotalAmount()

    this.ItemDetails = this.NewPurchaseService.getFormData('stepTwoData')
  }

  lotType(value: any) {
    this.lotTypeValue = value;

    if (this.lotTypeValue == "Lot") {
      this.addNewPurchaseForm.patchValue({
        slabNo: "slabNo",
        warehouseDetails: {
          "_id": "123",
          "name": "test"
        },
        categoryDetail: {
          "_id": "123",
          "name": "sdj"
        },
        subCategoryDetail: {
          "_id": "123",
          "name": "sdj"
        },
        finishes: {
          name:
            "Unpolished"
        },
        sellingPricePerSQFT: 2,
        totalSQFT: 2,
      });
    } else {
      this.addNewPurchaseForm.patchValue({
        slabNo: "",
        warehouseDetails: "",
        categoryDetail: "",
        subCategoryDetail: "",
        finishes: "",
        sellingPricePerSQFT: "",
        totalSQFT: "",
      })
    }
  }
  calculateTotalAmount() {
    console.log("Log ----");

    this.totalCostPerSQFT = 0;
    const paidToSupplierPurchaseCost = this.addNewPurchaseForm.get("paidToSupplierPurchaseCost").value || 0;

    if (this.lotTypeValue === "Slab") {

      const transportationCharges = this.addNewPurchaseForm.get("transportationCharges").value || 0;
      const otherCharges = this.addNewPurchaseForm.get("otherCharges").value || 0;
      const totalSQFT = this.addNewPurchaseForm.get("totalSQFT").value || 0;

      const total: number = transportationCharges + otherCharges + paidToSupplierPurchaseCost;

      if (totalSQFT !== 0) {
        this.totalCostPerSQFT = total / totalSQFT;
      } else {
        console.log("Error: totalSQFT is zero!");
      }
      if (total) {
        this.addNewPurchaseForm.patchValue({
          sellingPricePerSQFT: this.totalCostPerSQFT.toFixed(2),
          totalCosting: total,
        });
        console.log(this.totalCostPerSQFT);
      }
    }

  }

  // receiveData(data: string) {
  //   const data1 = JSON.parse(data);
  //   console.log(data1);
  //   console.log(data);
  //   this.lotWeight = data1.lotWeight;
  //   this.priceperTon = data1.pricePerTon;
  //   this.taxAmount = data1.taxAmount;
  //   this.lotTotalCost = data1.lotTotalCost.toFixed(3);
  // }

  addNewPurchaseFormSubmit() {
    const formData = this.addNewPurchaseForm.value;
    let payload = {};
    if (this.addNewPurchaseForm.value.purchaseType == 'Lot') {
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: 'lot',
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: formData.paidToSupplierPurchaseCost,
        purchaseTotalAmount: this.ItemDetails.lotTotalCost,
        lotDetail: this.ItemDetails,
      }
    } else {
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: 'slab',
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: formData.paidToSupplierPurchaseCost,
        slabDetail: {
          slabNo: formData.slabNo,
          warehouseDetails: formData.warehouseDetails,
          categoryDetail: formData.categoryDetail,
          subCategoryDetail: formData.subCategoryDetail,
          totalSQFT: formData.totalSQFT,
          width: formData.width,
          length: formData.length,
          thickness: formData.thickness,
          finishes: formData.finishes,
          sellingPricePerSQFT: formData.sellingPricePerSQFT,
          transportationCharges: formData.transportationCharges,
          otherCharges: formData.otherCharges,
          totalCosting: formData.totalCosting,
        },
        purchaseTotalAmount: formData.totalCosting
      }
    }
    console.log("object", JSON.stringify(payload));

    console.log("form valid or not", this.addNewPurchaseForm);

    if (this.addNewPurchaseForm.valid) {
      console.log("valid form");
      this.NewPurchaseService.createPurchase(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Purchase has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              // this.router.navigateByUrl('/new-purchase');
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("form is not valid");

    }

    for (const key of Object.keys(this.addNewPurchaseForm.controls)) {
      if (this.addNewPurchaseForm.controls[key].invalid) {
        console.log(`Invalid control: ${key}, Errors:`, this.addNewPurchaseForm.controls[key].errors);
      }
    }
  }




}
