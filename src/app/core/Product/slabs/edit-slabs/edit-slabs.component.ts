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
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { SlabsService } from "../slabs.service";

@Component({
  selector: "app-edit-slabs",
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
  templateUrl: "./edit-slabs.component.html",
  styleUrl: "./edit-slabs.component.scss",
})
export class EditSlabsComponent {
  public routes = routes;
  slabsEditForm!: FormGroup;
  data: any;
  slabsId: any;

  lotNoList: any = [];
  blocksNoList: any = [];
  wareHousedata:any
  subCategoryList: any = [];
  categoryList: any = [];
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  lotDetailList=[{name:"kavya"},{name:"adnan"}];
  originalData:any
  blockDropDownData:any
  blockDropDownPerBlockWeight:any
  blockDropDowntotleCost:any
  if_sellingPricePerSQFT:boolean = false;


  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private blocksService: BlocksService,
    private services: WarehouseService,
    private Service:SlabsService,
    private Lotservice: LotService

  ) {
    this.slabsEditForm = this.fb.group({
      slabNo: [
        "",
        [Validators.required, Validators.pattern(this.billingAddressRegex)],
      ],
      lotDetail: ["", []],
      blockDetails: ["", []],
      categoryDetail: ["", [Validators.required]],
      subCategoryDetail: ["", [Validators.required]],
      slabName: ["", [Validators.required, Validators.min(0)]],
      processingFee: ["", [Validators.min(1), Validators.max(1000000)]], //p
      totalSQFT: ["", [Validators.min(1), Validators.max(100000)]],
      otherCharges: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      transportationCharges: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      sellingPricePerSQFT: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      notes: ["", [Validators.pattern(this.billingAddressRegex)]],
      blockProcessor: [""],
      warehouseDetails: ["", [Validators.required]],
      processingCost: [""],
      totalCosting: [""],
      costPerSQFT: [""],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.slabsId = params["id"];
      console.log("user id ", this.slabsId);
    });

    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
    this.services.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    });
    this.Service.getSlabsById(this.slabsId).subscribe((data: any) => {
      this.data = data.data;
      console.log("Slabs Data", this.data.blockDetails);
      this.slabsEditForm.patchValue({
        slabNo: this.data.slabNo,
        lotDetail: this.data.lotDetail,
        blockDetails: this.data.blockDetails,
        categoryDetail: this.data.categoryDetail,
        subCategoryDetail: this.data.subCategoryDetail,
        slabName: this.data.slabName,
        processingFee: this.data.processingFee, 
        totalSQFT: this.data.totalSQFT,
        otherCharges: this.data.otherCharges,
        transportationCharges: this.data.transportationCharges,
        sellingPricePerSQFT: this.data.sellingPricePerSQFT,
        notes: this.data.notes,
        blockProcessor: this.data.blockProcessor,
        warehouseDetails: this.data.warehouseDetails,
        processingCost: this.data.processingCost,
        totalCosting: this.data.totalCosting,
        costPerSQFT: this.data.costPerSQFT,
      });
    });

    this.Lotservice.getLotList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      console.log("API lot", this.data);
    })

  }

  get f() {
    return this.slabsEditForm.controls;
  }

  onLotSelect(lotNo: any){
    console.log(lotNo,"set it lot");    
    this.blockDropDownData = lotNo.blocksDetails;
    console.log(this.blockDropDownData);
    // blockNo
  }
  onBlockSelect(block:any){
    console.log(block,"set it lot");    
    this.blockDropDowntotleCost = block.totalCosting
    this.blockDropDownPerBlockWeight = block.weightPerBlock
    console.log(this.blockDropDownPerBlockWeight,this.blockDropDowntotleCost);
  }

  calculateTotalAmount() {
    let processingFee = +this.slabsEditForm.get("processingFee").value;
    let otherCharges = +this.slabsEditForm.get("otherCharges").value;
    let totalSQFT = +this.slabsEditForm.get("totalSQFT").value;
    let sellingPricePerSQFT = +this.slabsEditForm.get("sellingPricePerSQFT").value;
    let transportationCharges = +this.slabsEditForm.get("transportationCharges")
      .value;

    let processingCost = processingFee * this.blockDropDownPerBlockWeight;
    let totalCosting = +this.blockDropDowntotleCost + processingCost + otherCharges + transportationCharges;
    let totalAmount = totalCosting / totalSQFT;
    console.log("processingCost", processingCost);
    console.log("totalCosting", totalCosting);
    console.log("totalAmount", totalAmount);

    // Update form values
    this.slabsEditForm.patchValue({
      processingCost: processingCost,
      totalCosting: totalCosting,
      costPerSQFT: totalAmount.toFixed(2),
    });
    if( sellingPricePerSQFT <  totalAmount ){
      this.if_sellingPricePerSQFT = true;
      console.log("if set");
    }else{
      console.log("else set");
      this.if_sellingPricePerSQFT = false;
    }
  }


  SlabsEditFormSubmit() {
    const payload = {
      slabNo: this.slabsEditForm.value.slabNo,
      lotDetail: this.slabsEditForm.value.lotDetail,
      blockDetail: this.slabsEditForm.value.blockDetail,
      categoryDetail: this.slabsEditForm.value.categoryDetail,
      subCategoryDetail: this.slabsEditForm.value.subCategoryDetail,
      slabName: this.slabsEditForm.value.slabName,
      processingFee: this.slabsEditForm.value.processingFee,
      totalSQFT: this.slabsEditForm.value.totalSQFT,
      processingCost: this.slabsEditForm.value.processingCost,
      otherCharges: this.slabsEditForm.value.otherCharges,
      transportationCharges: this.slabsEditForm.value.transportationCharges,
      totalCosting: this.slabsEditForm.value.totalCosting,
      costPerSQFT: this.slabsEditForm.value.costPerSQFT,
      sellingPricePerSQFT: this.slabsEditForm.value.sellingPricePerSQFT,
      notes: this.slabsEditForm.value.notes,
      blockProcessor: this.slabsEditForm.value.blockProcessor,
      warehouseDetails: this.slabsEditForm.value.warehouseDetails,
      date: "13-05-2024",
      height: 10,
      length: 10,
      width: 10,
      id: this.slabsId,
    };
    console.log(this.slabsEditForm.value);
    if (this.slabsEditForm.valid) {
      this.Service.updateSlabsById(payload).subscribe(
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
