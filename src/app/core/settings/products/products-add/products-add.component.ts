import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
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
import { ProductsService } from "../products.service";
import { TreeSelectModule } from "primeng/treeselect";
import { CategoriesService } from "../../categories/categories.service";
import { SubCategoriesService } from "../../sub-categories/sub-categories.service";

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
    ToastModule,
  ],
  providers: [MessageService],
})
export class ProductsAddComponent {
  public routes = routes;
  productForm!: FormGroup;



  categoryList: any = [];

  lotNoList: any = [];
  blockNoList: any = [];

  subCategoryList: any = [];





  // nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  // shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15)$/;

  // descriptionRegex = /^(?!\s)(.{3,500})$/;

  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    private router: Router,
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
      persellPrice: ["", [Validators.required, Validators.min(0)]],
    });
  }
  get f() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    

    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
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
