import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
import { MatSnackBar } from "@angular/material/snack-bar";
import { LotService } from "../../lot/lot.service";
import { BlocksService } from "../../blocks/blocks.service";

@Component({
  selector: 'app-edit-slabs',
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
  templateUrl: './edit-slabs.component.html',
  styleUrl: './edit-slabs.component.scss'
})
export class EditSlabsComponent {

  public routes = routes;
  slabsEditForm!: FormGroup;
  data: any;
  slabsId: any;

  
  lotNoList: any = [];
  blocksNoList: any = [];

  subCategoryList: any = [];
  categoryList: any = [];

  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private lotService: LotService,
    private blocksService: BlocksService,
  ) {this.slabsEditForm = this.fb.group({
    lotNo: ["", [Validators.required]],
    blockNo: ["", [Validators.required]],
    category: ["", [Validators.required]],
    subCategory: ["", [Validators.required]],
    height: ["", [Validators.required, Validators.min(0)]],
    width: ["", [Validators.required, Validators.min(0)]],
    length: ["", [Validators.required, Validators.min(0)]],
    totalSqrFt: ["", [Validators.required, Validators.min(0)]],
    totalCosting: ["", [Validators.required, Validators.min(0)]],
    persellPrice: ["", [Validators.required, Validators.min(0)]],
  });}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.slabsId = params["id"];
      console.log("user id ", this.slabsId);
    });


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
    this.service.getProductById(this.slabsId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("Slabs Data", this.data);
      this.slabsEditForm.patchValue({
        lotNo: this.data.lotNo,
        blockNo: this.data.blockNo,
        category: this.data.category,
        subCategory: this.data.subCategory        ,
        height: this.data.height,
        width: this.data.width,
        length: this.data.length,
        totalSqrFt: this.data.totalSqrFt,
        totalCosting: this.data.totalCosting,
        perSellPrice: this.data.perSellPrice,
        
      });
    });
  }

  get f() {
    return this.slabsEditForm.controls;
  }

  SlabsEditFormSubmit() {
    console.log(this.slabsEditForm.value);
    if (this.slabsEditForm.valid) {
      const requestBody = this.slabsEditForm.value;
      requestBody.id = this.slabsId;
      this.service.updateProductById(requestBody).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              const message = "Slabs has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/slabs"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        },
        (error) => {
          console.error("Error occured while updating Slabs:", error);
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }

}
