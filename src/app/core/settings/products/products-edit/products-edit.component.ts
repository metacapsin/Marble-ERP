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
  
  lotNoList: any = [];
  blockNoList: any = [];

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

  // nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  // shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,10})$/;

  // descriptionRegex = /^(?!\s)(.{3,500})$/;
  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
  ) {
    this.productForm = this.fb.group({
      lotNo: ["", [Validators.required]],
      blockNo: ["", [Validators.required]],
      category: ["", [Validators.required]],
      subCategory: ["", [Validators.required]],
      height: ["", [Validators.required, Validators.min(0)]],
      width: ["", [Validators.required, Validators.min(0)]],
      length: ["", [Validators.required, Validators.min(0)]],
      totalSqrFt: ["", [Validators.required, Validators.min(0)]],
      // price: ["", [Validators.required, Validators.min(0)]],
      // transportCharge: ["", [Validators.required, Validators.min(0)]],
      // processingCharge: ["", [Validators.required, Validators.min(0)]],
      // unitInTon: ["", [Validators.required, Validators.min(0)]],
      // slabsCount: ["", [Validators.required, Validators.min(0)]],
      totalCosting: ["", [Validators.required, Validators.min(0)]],
      perSellPrice: ["", [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.productId = params["id"];
      console.log("user id ", this.productId);
    });

    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
  

    this.service.getProductById(this.productId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("User Data", this.data);
      this.productForm.patchValue({
        lotNo: this.data.lotNo,
        blockNo: this.data.blockNo,
        // slug: this.data.slug,
        category: this.data.category,
        subCategory: this.data.subCatergory        ,
        height: this.data.height,
        width: this.data.width,
        length: this.data.length,
        // barcodeSymbology: this.data.barcodeSymbology,
        // tax: this.data.tax,
        totalSqrFt: this.data.totalSqrFt,
        totalCosting: this.data.totalCosting,
        perSellPrice: this.data.perSellPrice,
        
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
