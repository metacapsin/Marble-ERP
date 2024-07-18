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
    SharedModule,
    AddLotComponent,
    AddSlabsComponent,
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
  ItemDetails: any = {};

  shortNameRegex = /^[^\s.-][a-zA-Z0-9_.\s-]{2,50}$/;
  descriptionRegex = /^(?!\s)(?:.{1,500})$/;
  
  previousSlabValues: any = {};
  returnUrl: any;
  supplier: any;

  subCategorListByCategory: any = [];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private WarehouseService: WarehouseService,
    private categoriesService: CategoriesService,
    private SuppliersdataService: SuppliersdataService,
    private subCategoriesService: SubCategoriesService,
    private NewPurchaseService: NewPurchaseService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService) {
    this.addNewPurchaseForm = this.fb.group({
      invoiceNumber: [""],
      purchaseDate: ["", Validators.required],
      supplier: ["", [Validators.required]],
      paidToSupplierPurchaseCost: ["", [Validators.required, Validators.min(0), Validators.max(9999999)]],
      purchaseType: ["", [Validators.required]],
      purchaseNotes: ["", [Validators.pattern(this.descriptionRegex)]],
      slabNo: ["", [Validators.required, Validators.pattern(this.shortNameRegex)],],
      slabName: ["", [Validators.required, Validators.pattern(this.shortNameRegex)],],
      warehouseDetails: ["", [Validators.required]],
      categoryDetail: ["", [Validators.required]],
      subCategoryDetail: ["", [Validators.required]],
      totalSQFT: ["", [Validators.required, Validators.min(1), Validators.max(100000)]],
      width: ["", [Validators.min(1), Validators.max(100000)]],
      length: ["", [Validators.min(1), Validators.max(100000)]],
      thickness: ["", [Validators.min(1), Validators.max(1000)]],
      finishes: ["", [Validators.required]],
      sellingPricePerSQFT: ["", [Validators.required, Validators.min(1), Validators.max(100000)]],
      transportationCharges: ["", [Validators.min(1), Validators.max(100000)]],
      otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
      totalCosting: [''],
      costPerSQFT: [''],

    });
  }
  ngOnInit(): void {
    this.supplier = this.localStorageService.getItem("supplier");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    if (this.supplier) {
      this.addNewPurchaseForm.patchValue({
        supplier: this.supplier,
      });
    }

    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
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
    this.SuppliersdataService.GetSupplierData().subscribe((data: any) => {
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

  findSubCategory(value: any){
    let SubCategoryData: any = [];
    this.addNewPurchaseForm.get('subCategoryDetail').reset();
    SubCategoryData = this.subCategoryList.filter(e => e.categoryId._id == value._id);
      this.subCategorListByCategory = SubCategoryData.map((e) => ({
        name: e.name,
        _id: {
          _id: e._id,
          name: e.name,
        },
      }));
  }


  nextStep(nextCallback: any, page: string) {
    const paidToSupplierPurchaseCost = this.addNewPurchaseForm.value.paidToSupplierPurchaseCost;
    this.NewPurchaseService.setFormData("stepperOneData", paidToSupplierPurchaseCost);
    nextCallback.emit();

    if(page == 'first'){
      this.calculateTotalAmount();
    }
    this.ItemDetails = this.NewPurchaseService.getFormData('stepTwoData')
  }

  lotType(value: any) {
    this.lotTypeValue = value;

    if (this.lotTypeValue == "Lot") {
      this.previousSlabValues = {
        slabNo: this.addNewPurchaseForm.value.slabNo,
        slabName: this.addNewPurchaseForm.value.slabName,
        warehouseDetails: this.addNewPurchaseForm.value.warehouseDetails,
        categoryDetail: this.addNewPurchaseForm.value.categoryDetail,
        subCategoryDetail: this.addNewPurchaseForm.value.subCategoryDetail,
        finishes: this.addNewPurchaseForm.value.finishes,
        totalSQFT: this.addNewPurchaseForm.value.totalSQFT,
        sellingPricePerSQFT: this.addNewPurchaseForm.value.sellingPricePerSQFT,
        transportationCharges: this.addNewPurchaseForm.value.transportationCharges,
        otherCharges: this.addNewPurchaseForm.value.otherCharges,
        totalCosting: this.addNewPurchaseForm.value.totalCosting,
        thickness: this.addNewPurchaseForm.value.thickness,
        length: this.addNewPurchaseForm.value.length,
        width: this.addNewPurchaseForm.value.width,
        costPerSQFT: this.addNewPurchaseForm.value.costPerSQFT,
      }

      this.addNewPurchaseForm.patchValue({
        slabNo: "slabNo",
        slabName: "slabName",
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
        costPerSQFT: 2,
      });
    } else {
      this.addNewPurchaseForm.patchValue({
        slabNo: this.previousSlabValues.slabNo,
        slabName: this.previousSlabValues.slabName,
        warehouseDetails: this.previousSlabValues.warehouseDetails,
        categoryDetail: this.previousSlabValues.categoryDetail,
        subCategoryDetail: this.previousSlabValues.subCategoryDetail,
        finishes: this.previousSlabValues.finishes,
        totalSQFT: this.previousSlabValues.totalSQFT,
        sellingPricePerSQFT: this.previousSlabValues.sellingPricePerSQFT,
        transportationCharges: this.previousSlabValues.transportationCharges,
        otherCharges: this.previousSlabValues.otherCharges,
        totalCosting: this.previousSlabValues.totalCosting,
        thickness: this.previousSlabValues.thickness,
        length: this.previousSlabValues.length,
        width: this.previousSlabValues.width,
        costPerSQFT: this.previousSlabValues.costPerSQFT,
      })
    }
  }
  calculateTotalAmount() {
    
    if (this.lotTypeValue === "Slab") {      
      const paidToSupplierPurchaseCost = this.addNewPurchaseForm.get("paidToSupplierPurchaseCost").value || 0;
      const transportationCharges = this.addNewPurchaseForm.get("transportationCharges").value || 0;
      const otherCharges = this.addNewPurchaseForm.get("otherCharges").value || 0;
      const totalSQFT = this.addNewPurchaseForm.get("totalSQFT").value || 0;
      let costPerSQFT = this.addNewPurchaseForm.get("costPerSQFT").value || 0;

      const total: number = transportationCharges + otherCharges + paidToSupplierPurchaseCost;
      if (totalSQFT !== 0) {
        costPerSQFT = total / totalSQFT;
      }
      if (total) {
        this.addNewPurchaseForm.patchValue({
          sellingPricePerSQFT: costPerSQFT.toFixed(2),
          costPerSQFT: costPerSQFT.toFixed(2),
          totalCosting: total,
        });
        console.log(costPerSQFT);
      }
    }

  }

  addNewPurchaseFormSubmit() {
    const formData = this.addNewPurchaseForm.value;
    let payload = {};
    this.ItemDetails = this.ItemDetails || {};

    if (formData && formData.paidToSupplierPurchaseCost !== undefined) {
      this.ItemDetails.purchaseCost = Number(formData.paidToSupplierPurchaseCost);
      this.ItemDetails.date = formData.purchaseDate;
      this.ItemDetails.notes = formData.purchaseNotes;
    } else {
      console.error("formData.paidToSupplierPurchaseCost is not defined");
    }
    
    if (this.addNewPurchaseForm.value.purchaseType == 'Lot') {
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: 'lot',
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: Number(formData.paidToSupplierPurchaseCost),
        purchaseTotalAmount: Number(this.ItemDetails.lotTotalCost),
        lotDetail: this.ItemDetails,
      }
    } else {
      if (
        formData.width ||
          formData.length ||
          formData.thickness
      ) {
        var _Size = `${formData.width}x${formData.length}x${formData.thickness}`;
      }
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: 'slab',
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: Number(formData.paidToSupplierPurchaseCost),
        slabDetail: {
          slabNo: formData.slabNo,
          slabName: formData.slabName,
          warehouseDetails: formData.warehouseDetails,
          categoryDetail: formData.categoryDetail,
          subCategoryDetail: formData.subCategoryDetail,
          totalSQFT: formData.totalSQFT,
          width: formData.width,
          length: formData.length,
          thickness: formData.thickness,
          finishes: formData.finishes,
          sellingPricePerSQFT: Number(formData.sellingPricePerSQFT),
          transportationCharges: Number(formData.transportationCharges),
          otherCharges: Number(formData.otherCharges),
          totalCosting: Number(formData.totalCosting),
          costPerSQFT: Number(formData.costPerSQFT),
          slabSize: _Size,
          purchaseCost: Number(formData.paidToSupplierPurchaseCost),
          date: formData.purchaseDate,
          notes: formData.purchaseNotes,
        },
        purchaseTotalAmount: Number(formData.totalCosting)
      }
    }
    if (this.addNewPurchaseForm.valid) {
      console.log("valid form");
      this.NewPurchaseService.createPurchase(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.NewPurchaseService.clearFormData()
            const message = "Purchase has been added";
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
      console.log("form is not valid");
    }
    // for (const key of Object.keys(this.addNewPurchaseForm.controls)) {
    //   if (this.addNewPurchaseForm.controls[key].invalid) {
    //     console.log(`Invalid control: ${key}, Errors:`, this.addNewPurchaseForm.controls[key].errors);
    //   }
    // }
  }




}
