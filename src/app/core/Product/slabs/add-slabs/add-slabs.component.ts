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
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { SlabsService } from "../slabs.service";

interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[];
}

@Component({
  selector: "app-add-slabs",
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
  templateUrl: "./add-slabs.component.html",
  styleUrl: "./add-slabs.component.scss",
})
export class AddSlabsComponent {
  public routes = routes;
  slabsAddForm!: FormGroup;
  categoryList: any = [];
  lotNoList: any = [];
  blocksNoList: any = [];
  wareHousedata: any = [];
  subCategoryList: any = [];
  wareHousedataArray: any;
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  lotDetailList = [{ name: "kavya" }, { name: "adnan" }];
  TotalCosting: number = 28447.38;
  PerBlockWeight: number = 11.98067702;
  if_sellingPricePerSQFT:boolean = false;
  data:any
  originalData:any
  blockDropDownData:any
  blockDropDowntotleCost:any
  blockDropDownPerBlockWeight:any


  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private lotService: LotService,
    private blocksService: BlocksService,
    private services: WarehouseService,
    private Service: SlabsService,
    private Lotservice: LotService
  ) {
    this.slabsAddForm = this.fb.group({
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
  get f() {
    return this.slabsAddForm.controls;
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });
    
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });

    this.services.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    });

    this.Lotservice.getLotList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      console.log("API lot", this.data);
    })
  }
  onLotSelect(lotNo: any){
    console.log(lotNo,"set it lot");    
    this.blockDropDownData = lotNo.blocksDetails;
    // blockNo
  }
  onBlockSelect(block:any){
    console.log(block,"set it lot");    
    this.blockDropDowntotleCost = block.totalCosting
    this.blockDropDownPerBlockWeight = block.weightPerBlock
    console.log(this.blockDropDownPerBlockWeight,this.blockDropDowntotleCost);
  }
  calculateTotalAmount() {
    let processingFee = +this.slabsAddForm.get("processingFee").value;
    let otherCharges = +this.slabsAddForm.get("otherCharges").value;
    let totalSQFT = +this.slabsAddForm.get("totalSQFT").value;
    let sellingPricePerSQFT = +this.slabsAddForm.get("sellingPricePerSQFT").value;
    let transportationCharges = +this.slabsAddForm.get("transportationCharges")
      .value;

    let processingCost = processingFee * this.blockDropDownPerBlockWeight;
    let totalCosting = +this.blockDropDowntotleCost + processingCost + otherCharges + transportationCharges;
    let totalAmount = totalCosting / totalSQFT;
    console.log("processingCost", processingCost);
    console.log("totalCosting", totalCosting);
    console.log("totalAmount", totalAmount);

    // Update form values
    this.slabsAddForm.patchValue({
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

  SlabsAddFormSubmit() {
    console.log(this.slabsAddForm.value);
    const payload = {
      slabNo: this.slabsAddForm.value.slabNo,
      lotDetail: this.slabsAddForm.value.lotDetail._id,
      blockDetails: this.slabsAddForm.value.blockDetails,
      categoryDetail: this.slabsAddForm.value.categoryDetail,
      subCategoryDetail: this.slabsAddForm.value.subCategoryDetail,
      slabName: this.slabsAddForm.value.slabName,
      processingFee: this.slabsAddForm.value.processingFee,
      totalSQFT: this.slabsAddForm.value.totalSQFT,
      processingCost: this.slabsAddForm.value.processingCost,
      otherCharges: this.slabsAddForm.value.otherCharges,
      transportationCharges: this.slabsAddForm.value.transportationCharges,
      totalCosting: this.slabsAddForm.value.totalCosting,
      costPerSQFT: this.slabsAddForm.value.costPerSQFT,
      sellingPricePerSQFT: this.slabsAddForm.value.sellingPricePerSQFT,
      notes: this.slabsAddForm.value.notes,
      blockProcessor: this.slabsAddForm.value.blockProcessor,
      warehouseDetails: this.slabsAddForm.value.warehouseDetails,
      date: "13-05-2024",
      height: 10,
      length: 10,
      width: 10,
    };
    console.log("payload", payload);
    
    if (this.slabsAddForm.valid) {
      this.Service.CreateSlabs(payload).subscribe((resp: any) => {
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
