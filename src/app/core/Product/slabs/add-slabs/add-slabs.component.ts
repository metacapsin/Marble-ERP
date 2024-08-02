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
  billingAddressRegex = /^(?!\s)(?:.{3,15})$/;
  LWTSQ = /^[a-zA-Z0-9]{1,100000}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  shortNameRegex =
    /^(?!.*\s\s)[a-zA-Z\d\/\-]{1,15}(?:\s[a-zA-Z\d\/\-]{1,15}){0,14}$/;
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
        [Validators.required, Validators.pattern(this.shortNameRegex)],
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
          Validators.pattern(this.shortNameRegex),
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
      totalCosting: [""],
      costPerSQFT: [""],
      date: ["", [Validators.required]],
      purchaseCost: ["", [Validators.required]],
      thickness: ["", [Validators.min(1), Validators.max(100000)]],
      width: ["", [Validators.min(1), Validators.max(100000)]],
      length: ["", [Validators.min(1), Validators.max(100000)]],
      finishes: ["", [Validators.required]],
    });
  }
  get f() {
    return this.slabsAddForm.controls;
  }
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl);
    console.log("this is current url on slab page", this.currentUrl);
    // API for get all block Processor
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

  findSubCategory(value: any){
    let SubCategoryData: any = [];
    this.slabsAddForm.get('subCategoryDetail').reset();
    SubCategoryData = this.subCategoryList.filter(e => e.categoryId._id == value._id);
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
        lotName: `${e.lotName} (${e.lotNo})`,
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
      this.slabsAddForm.patchValue({
        purchaseCost: block.totalCosting.toFixed(4) || null,
      });
      this.calculateTotalAmount();
    }
  }
  calculateTotalAmount() {
    // Gatting data with input
    let processingFee = +this.slabsAddForm.get("processingFee").value;
    let otherCharges: number = +this.slabsAddForm.get("otherCharges").value;
    let totalSQFT = +this.slabsAddForm.get("totalSQFT").value;
    let transportationCharges: number = +this.slabsAddForm.get(
      "transportationCharges"
    ).value;
    var purchaseCostOrg = parseFloat(
      this.slabsAddForm.get("purchaseCost").value
    );
    console.log(purchaseCostOrg);
    console.log(totalSQFT);
    console.log(this.blockDropDownPerBlockWeight, this.blockDropDowntotleCost);
    this.BlockWeight = this.blockDropDownPerBlockWeight;
    console.log(this.BlockWeight);
    // calculate for creating slabs
    var processingCost = processingFee * this.BlockWeight;
    var totalCosting =
      +purchaseCostOrg + processingCost + otherCharges + transportationCharges;
    var totalAmount: number = totalSQFT == 0 ? 0 : totalCosting / totalSQFT;
    console.log("processingCost", processingCost);
    console.log("totalCosting", totalCosting);
    console.log("totalAmount", totalAmount);
    this.slabsAddForm.patchValue({
      processingCost: processingCost,
      totalCosting: totalCosting.toFixed(4),
      costPerSQFT: totalAmount.toFixed(2),
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
        lotDetails: this.slabsAddForm.value.lotDetails,
        blockDetails: this.slabsAddForm.value.blockDetails,
        categoryDetail: this.slabsAddForm.value.categoryDetail,
        subCategoryDetail: this.slabsAddForm.value.subCategoryDetail,
        slabName: this.slabsAddForm.value.slabName,
        processingFee: Number(this.slabsAddForm.value.processingFee),
        totalSQFT: this.slabsAddForm.value.totalSQFT,
        purchaseCost: Number(this.slabsAddForm.value.purchaseCost),
        processingCost: Number(this.slabsAddForm.value.processingCost),
        otherCharges: Number(this.slabsAddForm.value.otherCharges),
        transportationChargesNumber:( this.slabsAddForm.value.transportationCharges),
        totalCosting:Number( this.slabsAddForm.value.totalCosting),
        costPerSQFTNumber:( this.slabsAddForm.value.costPerSQFT),
        sellingPricePerSQFT: Number(this.slabsAddForm.value.sellingPricePerSQFT),
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
      if (this.slabsAddForm.valid) {
        // Api call for creating slab
        this.Service.CreateSlabs(payload).subscribe((resp: any) => {
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
