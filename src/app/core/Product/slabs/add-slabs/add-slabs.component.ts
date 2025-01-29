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
import { MessageService } from "primeng/api";
import { ProductsService } from "src/app/core/settings/products/products.service";
import { CategoriesService } from "src/app/core/settings/categories/categories.service";
import { SubCategoriesService } from "src/app/core/settings/sub-categories/sub-categories.service";
import { BlocksService } from "../../blocks/blocks.service";
import { LotService } from "../../lot/lot.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { SlabsService } from "../slabs.service";
import { CalendarModule } from "primeng/calendar";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-add-slabs",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./add-slabs.component.html",
  styleUrl: "./add-slabs.component.scss",
})
export class AddSlabsComponent {
  public routes = routes;
  slabsAddForm!: FormGroup;
  // __REGEX FOR Slab Form
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  LWTSQ = /^[a-zA-Z0-9]{1,100000}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  shortNameRegex =
    /^(?!.*\s\s)[a-zA-Z\d\/\-]{1,15}(?:\s[a-zA-Z\d\/\-]{1,15}){0,14}$/;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,50})$/;

  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  // The variable that used in this file
  maxDate = new Date();
  blockDropDownData = [];
  blockDropDowntotleCost: any;
  blockDropDownPerBlockWeight: any;
  CategoryListsEditArray: any;
  wareHousedataListsEditArray: any;
  SubCategoryListsEditArray: any;
  SubCategoryFilterArray: any;

  blockProcessorData: any;
  blockProcessorArray: any[];
  fromWareHouseLotValue: any;
  BlockWeight: number = 0;
  currentUrl: string;
  subCategoryList: any;
  originalPurchaseCost: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private services: WarehouseService,
    private Service: SlabsService,
    private Lotservice: LotService,
    private ServiceblockProcessor: blockProcessorService,
    private localStorageService: LocalStorageService
  ) {
    this.slabsAddForm = this.fb.group({
      slabNo: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
      ],
      lotDetails: ["", [Validators.required]],
      blockDetails: ["", [Validators.required]],
      categoryDetail: ["", [Validators.required]],
      subCategoryDetail: ["", [Validators.required]],
      slabName: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.invoiceRegex),
        ],
      ],
      processingFee: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ], //p
      totalSQFT: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
      transportationCharges: ["", [Validators.min(1), Validators.max(100000)]],
      sellingPricePerSQFT: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      notes: ["", [Validators.pattern(this.billingAddressRegex)]],
      blockProcessor: ["", [Validators.required]],
      warehouseDetails: ["", [Validators.required]],
      processingCost: [""],
      totalCosting: ["0"],
      costPerSQFT: [""],
      date: ["", [Validators.required]],
      purchaseCost: [
        "",
        [Validators.required, Validators.min(0), Validators.max(10000000)],
      ],
      thickness: ["", [Validators.min(1), Validators.max(100000)]],
      width: ["", [Validators.min(1), Validators.max(100000)]],
      length: ["", [Validators.min(1), Validators.max(100000)]],
      finishes: ["", [Validators.required]],
      noOfPieces: ["", [Validators.min(1), Validators.max(100000)]],
      height: ["", [Validators.min(1), Validators.max(500)]],
      sqftPerPiece: [""],
      stockType: ["BlockToSlabConvert", Validators.required],
    });
  }
  get f() {
    return this.slabsAddForm.controls;
  }

  slabTypeOptions = [
    { label: "Block To Slab Convert", value: "BlockToSlabConvert" },
    { label: "Opening Stock", value: "OpeningStock" },
  ];
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl);

    this.ServiceblockProcessor.getAllBlockProcessorData().subscribe(
      (data: any) => {
        this.blockProcessorArray = [];
        data.forEach((element: any) => {
          this.blockProcessorArray.push({
            name: element.name,
            _id: {
              _id: element._id,
              name: element.name,
            },
          });
        });
        console.log(this.blockProcessorArray);
      }
    );
    // API for get all Categories
    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.CategoryListsEditArray = [];
      resp.data.forEach((element: any) => {
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
    // API for get all Sub Categories
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
      this.SubCategoryListsEditArray = [];
      resp.data.forEach((element: any) => {
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
    // API for get all Warehouse
    this.services.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedataListsEditArray = [];
      resp.data.forEach((element: any) => {
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

  onSlabTypeSelect(selectedValue: any): void {
    if (selectedValue === "OpeningStock") {
      this.slabsAddForm.get("blockProcessor")?.setValue("");
      this.slabsAddForm.get("blockProcessor")?.clearValidators();
      this.slabsAddForm.get("blockProcessor")?.updateValueAndValidity();

      this.slabsAddForm.get("lotDetails")?.setValue("");
      this.slabsAddForm.get("lotDetails")?.clearValidators();
      this.slabsAddForm.get("lotDetails")?.updateValueAndValidity();

      this.slabsAddForm.get("blockDetails")?.setValue("");
      this.slabsAddForm.get("blockDetails")?.clearValidators();
      this.slabsAddForm.get("blockDetails")?.updateValueAndValidity();

      this.slabsAddForm.get("processingFee")?.setValue("");
      this.slabsAddForm.get("processingFee")?.clearValidators();
      this.slabsAddForm.get("processingFee")?.updateValueAndValidity();
    }
  }

  findSubCategory(value: any) {
    let SubCategoryData: any = [];
    this.slabsAddForm.get("subCategoryDetail").reset();
    SubCategoryData = this.subCategoryList.filter(
      (e) => e.categoryId._id == value._id
    );
    this.SubCategoryFilterArray = SubCategoryData.map((e) => ({
      name: e.name,
      _id: {
        _id: e._id,
        name: e.name,
      },
    }));
  }

  // Function call for on warehouse Select
  onWarehouseSelect(value: any) {
    this.Lotservice.lotByWarehouse(value._id).subscribe((resp: any) => {
      this.fromWareHouseLotValue = resp.data.map((e) => ({
        lotName: `${e.lotName}  [${e.lotNo}]`,
        _id: {
          lotName: e.lotName,
          lotNo: e.lotNo,
          _id: e._id,
        },
      }));
    });
  }
  // Function call for on Lot Select
  onLotSelect(value: any) {
    if (!value) {
      this.slabsAddForm.patchValue({
        purchaseCost: null,
      });
    } else {
      this.Service.getNotProcessedBlocksByLotId(value._id).subscribe(
        (resp: any) => {
          this.blockDropDownData = resp.data;
        }
      );
    }
    this.calculateTotalAmount();
  }
  // Function call for on Block Select
  onBlockSelect(block: any) {
    this.blockDropDowntotleCost = block.totalCosting;
    this.blockDropDownPerBlockWeight = block.weightPerBlock;
    if (block.totalCosting) {
      // Store the original value for calculations
      this.originalPurchaseCost = block.totalCosting;
      this.slabsAddForm.patchValue({
        purchaseCost: block.totalCosting.toFixed(2) || null,
      });
      this.calculateTotalAmount();
    }
    if (block.blockProcessor) {
      console.log(block.blockProcessor);
      this.slabsAddForm.patchValue({
        blockProcessor: block.blockProcessor,
        width: block.width,
        height: block.height,
        length: block.length,
      });

      this.calculateTotalAmount();
    } else {
      this.slabsAddForm.get("blockProcessor")?.reset();
    }
  }

  calculateTotalAmount() {
    console.log("call");
    // Get the displayed (rounded) purchase cost from the form control
    let purchaseCostDisplayed = parseFloat(
      this.slabsAddForm.get("purchaseCost").value
    );

    // Use the original, unrounded purchase cost for calculations
    let purchaseCostOrg: number =
      this.originalPurchaseCost || purchaseCostDisplayed;
    // Gatting data with input
    let processingFee: number =
      this.slabsAddForm.get("processingFee").value || 0;
    let otherCharges: number = +this.slabsAddForm.get("otherCharges").value;
    let totalSQFT: number = +this.slabsAddForm.get("totalSQFT").value;
    let transportationCharges: number = +this.slabsAddForm.get(
      "transportationCharges"
    ).value;

    // console.log(purchaseCostOrg);
    // console.log(totalSQFT);
    console.log(
      "blockDropDownPerBlockWeight",
      this.blockDropDownPerBlockWeight
    );
    this.BlockWeight = Number(this.blockDropDownPerBlockWeight) || 0;
    // console.log(this.BlockWeight);
    // calculate for creating slabs
    let fee = processingFee || 0;

    console.log("processingFee:", fee);
    console.log("this.BlockWeight:", this.BlockWeight);

    let processingCost = Number(fee) * Number(this.BlockWeight);
    console.log("purchaseCostOrg:", purchaseCostOrg);
    console.log("processingCost:", processingCost);
    console.log("otherCharges:", otherCharges);
    console.log("transportationCharges:", transportationCharges);

    let totalCosting =
      Number(purchaseCostOrg) +
      Number(processingCost) +
      Number(otherCharges) +
      Number(transportationCharges);
    console.log("totalCosting:", totalCosting);

    let totalAmount: number = totalSQFT == 0 ? 0 : totalCosting / totalSQFT;
    let noOfPieces = this.slabsAddForm.get("noOfPieces").value || 0;

    let sqftPerPiece = totalSQFT / noOfPieces;

    // console.log("processingCost", processingCost);
    // console.log("totalCosting", purchaseCostOrg);
    // console.log("totalAmount", totalAmount)
    console.log("totalCosting", totalCosting);
    this.slabsAddForm.patchValue({
      processingCost: processingCost,
      totalCosting: totalCosting.toFixed(4),
      costPerSQFT: totalAmount.toFixed(2),
      sqftPerPiece: sqftPerPiece,

      sellingPricePerSQFT:
        parseFloat(totalAmount.toFixed(2)) === 0.0
          ? null
          : totalAmount.toFixed(2),
    });
  }

  navigateToCreateBlockProcessor() {
    const returnUrl = this.router.url;
    this.router.navigate(["/block-processor/add-block-processor"]);
    this.localStorageService.setItem("returnUrl", returnUrl);

    // this.router.navigate(['/purchase/add-purchase'], { state: { returnUrl: this.currentUrl } });
  }

  SlabsAddFormSubmit() {
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
    if (
      this.slabsAddForm.value.lotDetails &&
      !this.slabsAddForm.value.blockProcessor
    ) {
      const message = "Enter Block Processor";
      this.messageService.add({ severity: "error", detail: message });
    } else {
      const payload = {
        slabNo: this.slabsAddForm.value.slabNo,
        lotDetails:
          this.slabsAddForm.value.lotDetails === "null"
            ? null
            : this.slabsAddForm.value.lotDetails,
        blockDetails:
          this.slabsAddForm.value.blockDetails === "null"
            ? null
            : this.slabsAddForm.value.blockDetails,
        categoryDetail: this.slabsAddForm.value.categoryDetail,
        subCategoryDetail: this.slabsAddForm.value.subCategoryDetail,
        slabName: this.slabsAddForm.value.slabName,
        totalSQFT: this.slabsAddForm.value.totalSQFT,
        processingFee:
          this.slabsAddForm.value.processingFee === "null"
            ? 0
            : Number(this.slabsAddForm.value.processingFee) || 0,
        purchaseCost:
          this.originalPurchaseCost || this.slabsAddForm.value.purchaseCost,
        processingCost: Number(this.slabsAddForm.value.processingCost) || 0,
        otherCharges: Number(this.slabsAddForm.value.otherCharges),
        transportationCharges: Number(
          this.slabsAddForm.value.transportationCharges
        ),
        totalCosting:
          Number(this.slabsAddForm.value.totalCosting) ||
          this.slabsAddForm.value.purchaseCost,
        costPerSQFT: Number(this.slabsAddForm.value.costPerSQFT),
        sellingPricePerSQFT: Number(
          this.slabsAddForm.value.sellingPricePerSQFT
        ),

        notes: this.slabsAddForm.value.notes,
        blockProcessor:
          this.slabsAddForm.value.blockProcessor === "null"
            ? null
            : this.slabsAddForm.value.blockProcessor,
        warehouseDetails: this.slabsAddForm.value.warehouseDetails,
        date: this.slabsAddForm.value.date,
        width: this.slabsAddForm.value.width,
        length: this.slabsAddForm.value.length,
        thickness: this.slabsAddForm.value.thickness,
        finishes: this.slabsAddForm.value.finishes,
        slabSize: _Size,
        sqftPerPiece: this.slabsAddForm.value.sqftPerPiece,
        stockType: this.slabsAddForm.value.stockType,
      };
      if (this.slabsAddForm.valid) {
        // Api call for creating slab
        this.Service.CreateSlabs(payload).subscribe((resp: any) => {
          console.log("resp", resp);

          if (resp.status === "success") {
            const message = "Slabs has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/slabs"]);
            }, 400);
          }

          if (resp.lotResponse.status === "success") {
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
  // }
}
