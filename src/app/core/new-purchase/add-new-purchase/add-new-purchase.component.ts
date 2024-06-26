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
    AccordionModule
  ],
  templateUrl: "./add-new-purchase.component.html",
  styleUrl: "./add-new-purchase.component.scss",
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
  constructor(private fb: FormBuilder,
    private services: WarehouseService,
    private categoriesService: CategoriesService,
    private Service: SuppliersdataService,
    private subCategoriesService: SubCategoriesService,
    private NewPurchaseService: NewPurchaseService) {
    this.addNewPurchaseForm = this.fb.group({
      invoiceNumber: [""],
      purchaseDate: [""],
      supplier: [""],
      paidToSupplierPurchaseCost: [""],
      purchaseType: [""],
      purchaseNotes: [""],
      transportationCharges: [""],
      otherCharges: [""],
      // portExpenses: [""],
      slabNo: [""],
      warehouseDetails: [""],
      categoryDetail: [""],
      subCategoryDetail: [""],
      width: [""],
      length: [""],
      thickness: [""],
      finishes: [""],
      sellingPricePerSQFT: [""],
      totalSQFT: [""],
      slabTotalCosthing: [''],
    });
  }
  ngOnInit(): void {
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
  // nextCallback() {
  //   this.NewPurchaseService.setFormData("stepperOneData", this.addNewPurchaseForm.value);
  // }



  nextStep(nextCallback: any) {
    const payload = this.addNewPurchaseForm.value.paidToSupplierPurchaseCost;
    this.NewPurchaseService.setFormData("stepperOneData", payload);
    nextCallback.emit();
    this.calculateTotalAmount()

    this.ItemDetails = this.NewPurchaseService.getFormData('stepTwoData')
  }

  lotType(value: any) {
    this.lotTypeValue = value;
  }
  calculateTotalAmount() {
    this.totalCostPerSQFT = 0;
    const paidToSupplierPurchaseCost = this.addNewPurchaseForm.get("paidToSupplierPurchaseCost").value || 0;
    const transportationCharges =
      this.addNewPurchaseForm.get("transportationCharges").value || 0;
    // const portExpenses = this.addNewPurchaseForm.get("portExpenses").value || 0;
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
        slabTotalCosthing: total,
      });
      console.log(this.totalCostPerSQFT);
    }
    console.log(this.totalCostPerSQFT, total);
  }
  receiveData(data: string) {
    const data1 = JSON.parse(data);
    console.log(data1);
    console.log(data);
    this.lotWeight = data1.lotWeight;
    this.priceperTon = data1.pricePerTon;
    this.taxAmount = data1.taxAmount;
    this.lotTotalCost = data1.lotTotalCost.toFixed(3);
    // this.totalRawCosting = data1.totalRawCosting.toFixed(3);
  }

  addNewPurchaseFormSubmit() {
    const formData = this.addNewPurchaseForm.value;
    let payload = {};
    if (this.addNewPurchaseForm.value.purchaseType == 'Lot') {
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: formData.purchaseType,
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: formData.paidToSupplierPurchaseCost,
        purchaseTotalAmount: this.ItemDetails.lotTotalCost,
        lotDetail: this.ItemDetails,
      }
    } else {
      payload = {

      }
    }
    console.log("object", JSON.stringify(payload));
  }


}
