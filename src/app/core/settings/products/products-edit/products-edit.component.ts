import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { SettingsService } from "src/app/shared/data/settings.service";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService, TreeNode } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProductsService } from "../products.service";
import { TreeModule } from "primeng/tree";
import { TreeSelectModule } from "primeng/treeselect";
import { UnitsService } from "../../units/units.service";
import { CategoriesService } from "../../categories/categories.service";
import { SubCategoriesService } from "../../sub-categories/sub-categories.service";
import { TaxesService } from "../../taxes/taxes.service";
import { WarehouseService } from "../../warehouse/warehouse.service";

@Component({
  selector: "app-products-edit",
  standalone: true,
  templateUrl: "./products-edit.component.html",
  styleUrl: "./products-edit.component.scss",
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
export class ProductsEditComponent {
  public routes = routes;
  productForm!: FormGroup;
  data: any;
  productId: any;

  warehouseList = [];

  subCategoryList: any = [];
  categoryList: any = [];

  unitList = [];

  barcodeSymbologyList = [
    { label: "CODE128", value: "CODE128" },
    { label: "CODE39", value: "CODE39" },
    { label: "EAN-13", value: "EAN13" },
    { label: "EAN-8", value: "EAN8" },
    { label: "UPC-A", value: "UPCA" },
    { label: "UPC-E", value: "UPCE" },
  ];
  taxList = [];

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,10})$/;

  descriptionRegex = /^(?!\s)(.{3,500})$/;
  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private unitService: UnitsService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private warehouseServices: WarehouseService
  ) {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      itemCode: ["", [Validators.pattern(this.shortNameRegex)]],
      // slug: [
      //   '',
      //   [Validators.required, Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))],
      // ],
      category: ["", [Validators.required]],
      subCategory: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      warehouse: ["", [Validators.required]],
      quantityAlert: ["", [Validators.pattern(this.shortNameRegex)]],
      // barcodeSymbology: [""],
      // tax: ["", [Validators.required]],
      openingStock: ["", [Validators.required, Validators.min(0)]],
      openingStockDate: ["", [Validators.required]],
      purchasePrice: ["", [Validators.required, Validators.min(0)]],
      // mRP: ["", [Validators.required, Validators.min(0)]],
      expiryDate: ["", [Validators.required]],
      description: ["", [Validators.pattern(this.descriptionRegex)]],
      salesPrice: ["", [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.productId = params["id"];
      console.log("user id ", this.productId);
    });

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

    this.service.getProductById(this.productId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("User Data", this.data);
      this.productForm.patchValue({
        name: this.data.name,
        itemCode: this.data.itemCode,
        // slug: this.data.slug,
        category: this.data.category,
        subCategory: this.data.subCatergory        ,
        unit: this.data.unit,
        warehouse: this.data.warehouse,
        quantityAlert: this.data.quantityAlert,
        // barcodeSymbology: this.data.barcodeSymbology,
        // tax: this.data.tax,
        openingStock: this.data.openingStock,
        openingStockDate: this.data.openingStockDate,
        purchasePrice: this.data.purchasePrice,
        salesPrice: this.data.salesPrice,
        // mRP: this.data.mRP,
        expiryDate: this.data.expiryDate,
        description: this.data.description,
      });
    });
  }

  get f() {
    return this.productForm.controls;
  }

  ProductFormSubmit() {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      const requestBody = this.productForm.value;
      requestBody.id = this.productId;
      this.service.updateProductById(requestBody).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              const message = "Product has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/settings/product"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        },
        (error) => {
          console.error("Error occured while updating Product:", error);
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
