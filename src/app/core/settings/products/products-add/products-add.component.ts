import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { SettingsService } from "src/app/shared/data/settings.service";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService, SelectItem } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ProductsService } from "../products.service";
import { TreeSelectModule } from "primeng/treeselect";
import { TreeNode } from "primeng/api";
import { UnitsService } from "../../units/units.service";
import { CategoriesService } from "../../categories/categories.service";
import { SubCategoriesService } from "../../sub-categories/sub-categories.service";
import { TaxesService } from "../../taxes/taxes.service";
import { WarehouseService } from "../../warehouse/warehouse.service";

interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[];
}
@Component({
  selector: "app-products-add",
  standalone: true,
  templateUrl: "./products-add.component.html",
  styleUrl: "./products-add.component.scss",
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    TreeSelectModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    TreeSelectModule, // Make sure to import TreeSelectModule
    ToastModule,
  ],
  providers: [MessageService],
})
export class ProductsAddComponent {
  public routes = routes;
  productForm!: FormGroup;

  warehouseList: any = [];

  categoryList: any = [];

  subCategoryList: any = [];

  unitList: any = [];

  barcodeSymbologyList = [
    { label: "CODE128", value: "CODE128" },
    { label: "CODE39", value: "CODE39" },
    { label: "EAN-13", value: "EAN13" },
    { label: "EAN-8", value: "EAN8" },
    { label: "UPC-A", value: "UPCA" },
    { label: "UPC-E", value: "UPCE" },
  ];
  taxList: any = [];

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,10})$/;

  descriptionRegex = /^(?!\s)(.{3,500})$/;

  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private unitService: UnitsService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private warehouseServices: WarehouseService
  ) {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      // slug: [
      //   '',
      //   [Validators.required, Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))],
      // ],
      warehouse: ["", [Validators.required]],
      category: ["", [Validators.required]],
      subCategory: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      quantityAlert: ["", [Validators.pattern(this.shortNameRegex)]],
      barcodeSymbology: [""],
      itemCode:  ["", [Validators.pattern(this.shortNameRegex)]],
      tax:  ["", [Validators.required]],
      openingStock:   ["", [Validators.required,Validators.min(0)]],
      openingStockDate:  ["", [Validators.required]],
      purchasePrice:  ["", [Validators.required,Validators.min(0)]],
      mRP:  ["", [Validators.required,Validators.min(0)]],
      expiryDate:  ["", [Validators.required]],
      description:  ["", [ Validators.pattern(this.descriptionRegex)]],
      salesPrice:  ["", [Validators.required,Validators.min(0)]],
    });
  }
  get f() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    this.unitService.getAllUnitList().subscribe((resp: any) => {
      this.unitList = resp.data;
    });

    this.warehouseServices.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseList = resp.data;
    });

    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxList = resp.data;
    });
  }

  ProductFormSubmit() {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      this.service
        .CreateProduct(this.productForm.value)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Product has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/settings/product"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        });
    } else {
      console.log("Form is invalid!");
    }
  }
}
