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
import { ProductsService } from "src/app/core/settings/products/products.service";
import { CategoriesService } from "src/app/core/settings/categories/categories.service";
import { SubCategoriesService } from "src/app/core/settings/sub-categories/sub-categories.service";
import { BlocksService } from "../../blocks/blocks.service";
import { LotService } from "../../lot/lot.service";

interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[];
}

@Component({
  selector: 'app-add-slabs',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-slabs.component.html',
  styleUrl: './add-slabs.component.scss'
})
export class AddSlabsComponent {

  public routes = routes;
  slabsAddForm!: FormGroup;
  
  categoryList: any = [];

  lotNoList: any = [];
  blocksNoList: any = [];

  subCategoryList: any = [];

  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private lotService: LotService,
    private blocksService: BlocksService,
  ) {
    this.slabsAddForm = this.fb.group({
      lotNo: ["", [Validators.required]],
      blockNo: ["", [Validators.required]],
      category: ["", [Validators.required]],
      subCategory: ["", [Validators.required]],
      height: ["", [Validators.required, Validators.min(0)]],
      width: ["", [Validators.required, Validators.min(0)]],
      length: ["", [Validators.required, Validators.min(0)]],
      totalSqrFt: ["", [Validators.required, Validators.min(0)]],
      totalCosting: ["", [Validators.required, Validators.min(0)]],
      sellPricePerSqrFt: ["", [Validators.required, Validators.min(0)]],
    });
  }
  get f() {
    return this.slabsAddForm.controls;
  }

  ngOnInit(): void {
    

    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });
    this.lotService.getLotList().subscribe((resp: any) => {
      this.lotNoList = resp.data;
    });
    this.blocksService.getBlocksList().subscribe((resp: any) => {
      this.blocksNoList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
   
  }
  SlabsAddFormSubmit() {
    console.log(this.slabsAddForm.value);
    if (this.slabsAddForm.valid) {
      this.service
        .CreateProduct(this.slabsAddForm.value)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Slabs has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/slabs"]);
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
