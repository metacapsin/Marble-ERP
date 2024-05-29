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
import { CalendarModule } from "primeng/calendar";

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
    CalendarModule,
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
  billingAddressRegex = /^(?!\s)(?:.{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  shortNameRegex =
    /^(?!.*\s\s)[a-zA-Z\d\/\-]{1,15}(?:\s[a-zA-Z\d\/\-]{1,15}){0,14}$/;
  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  TotalCosting: number = 28447.38;
  PerBlockWeight: number = 11.98067702;
  if_sellingPricePerSQFT: boolean = false;
  data: any;
  originalData: any;

  blockDataByLotId = [];
  blockDropDownData = [];
  blockDropDowntotleCost: any;
  blockDropDownPerBlockWeight: any;
  CategoryListsEditArray: any;
  wareHousedataListsEditArray: any;
  SubCategoryListsEditArray: any;
  originallotNoList: any = [];

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
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
      lotDetails: [""],
      blockDetails: [""],
      categoryDetail: ["", [Validators.required]],
      subCategoryDetail: ["", [Validators.required]],
      slabName: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.shortNameRegex),
        ],
      ],
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
        [Validators.required, Validators.min(1), Validators.max(1000000)],
      ],
      notes: ["", [Validators.pattern(this.billingAddressRegex)]],
      blockProcessor: [""],
      warehouseDetails: ["", [Validators.required]],
      processingCost: [""],
      totalCosting: [""],
      costPerSQFT: [""],
      date: ["", [Validators.required]],
      purchaseCost: ["", [Validators.required]],
      thickness: [""],
      width: ["", [Validators.min(1)]],
      length: ["", [Validators.min(1)]],
      finishes: ["", [Validators.min(1)]],
    });
  }
  get f() {
    return this.slabsAddForm.controls;
  }

  ngOnInit(): void {
    console.log(this.slabsAddForm.value.lotDetails);
    this.Lotservice.getLotList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      console.log("API lot", this.data);
      this.originallotNoList = resp.data.map((e) => ({
        lotName: `${e.lotName} (${e.lotNo})`,
        _id: {
          lotName: e.lotName,
          lotNo: e.lotNo,
          _id: e._id,
        },
      }));
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
      console.log(this.CategoryListsEditArray);
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
      console.log(this.SubCategoryListsEditArray);
    });

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
      console.log(this.wareHousedataListsEditArray);
    });
  }
  onLotSelect(value: any) {
    console.log(value, "set it lot");
    this.Service.getNotProcessedBlocksByLotId(value._id).subscribe((resp: any) => {
      this.blockDropDownData = resp.data;
      console.log("resp.data.blocksDetails", resp.data);
    });
    console.log("blockDropDownData", this.blockDropDownData);
  }
  onBlockSelect(block: any) {
    console.log(block, "set it lot");
    this.blockDropDowntotleCost = block.totalCosting;
    this.blockDropDownPerBlockWeight = block.weightPerBlock;
    if (block.totalCosting) {
      this.slabsAddForm.patchValue({
        purchaseCost: block.totalCosting || 0,
      });
      this.calculateTotalAmount();
    }
    console.log(this.blockDropDownPerBlockWeight, this.blockDropDowntotleCost);
  }
  calculateTotalAmount() {
    let processingFee = +this.slabsAddForm.get("processingFee").value;
    let otherCharges = +this.slabsAddForm.get("otherCharges").value;
    let totalSQFT = +this.slabsAddForm.get("totalSQFT").value;
    let sellingPricePerSQFT = +this.slabsAddForm.get("sellingPricePerSQFT")
      .value;
    let transportationCharges = +this.slabsAddForm.get("transportationCharges")
      .value;
    let purchaseCost = +this.slabsAddForm.get("purchaseCost").value;

    if (!this.blockDropDownPerBlockWeight && !this.blockDropDowntotleCost) {
      console.log(transportationCharges, otherCharges, processingCost);
      var totalCosting = +purchaseCost + otherCharges + transportationCharges;
      var totalAmount = +totalCosting / totalSQFT;
      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsAddForm.patchValue({
        totalCosting: totalCosting.toFixed(2),
        costPerSQFT: totalAmount.toFixed(2),
      });
    } else {
      var processingCost = processingFee * this.blockDropDownPerBlockWeight;
      var totalCosting =
        +purchaseCost + processingCost + otherCharges + transportationCharges;
      var totalAmount = totalCosting / totalSQFT;
      console.log("processingCost", processingCost);
      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsAddForm.patchValue({
        processingCost: processingCost,
        totalCosting: totalCosting.toFixed(2),
        costPerSQFT: totalAmount.toFixed(2),
      });
    }
    // Update form values
    if (sellingPricePerSQFT < totalAmount) {
      this.if_sellingPricePerSQFT = true;
      console.log("if set");
    } else {
      console.log("else set");
      this.if_sellingPricePerSQFT = false;
    }
  }

  SlabsAddFormSubmit() {
    console.log(this.slabsAddForm.value);
    let formData = this.slabsAddForm.value;
    if (
      this.slabsAddForm.value.width ||
      this.slabsAddForm.value.length ||
      this.slabsAddForm.value.thickness
    ) {
      var width = this.slabsAddForm.value.width;
      var length = this.slabsAddForm.value.length;
      var thickness = this.slabsAddForm.value.thickness;
      var _Size = `${width}x${length}x${thickness}`;
    }
    const payload = {
      slabNo: this.slabsAddForm.value.slabNo,
      lotDetails: this.slabsAddForm.value.lotDetails,
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
      date: this.slabsAddForm.value.date,
      width: this.slabsAddForm.value.width,
      length: this.slabsAddForm.value.length,
      thickness: this.slabsAddForm.value.thickness,
      finishes: this.slabsAddForm.value.finishes,
      slabSize: _Size,
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
