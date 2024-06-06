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
import { CalendarModule } from "primeng/calendar";

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
    CalendarModule,
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
  originallotNoList: any = [];
  blocksNoList: any = [];
  wareHousedata: any;
  subCategoryList: any = [];
  categoryList: any = [];
  billingAddressRegex = /^(?!\s)(?:.{3,15})$/;
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  shortNameRegex =
    /^(?!.*\s\s)[a-zA-Z\d\/\-]{1,15}(?:\s[a-zA-Z\d\/\-]{1,15}){0,14}$/;
  originalData: any;
  blockDropDownData: any;
  blockDropDownPerBlockWeight: any;
  blockDropDowntotleCost: any;
  if_sellingPricePerSQFT: boolean = false;
  CategoryListsEditArray: any;
  wareHousedataListsEditArray: any;
  SubCategoryListsEditArray: any;

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
    private Service: SlabsService,
    private Lotservice: LotService
  ) {
    this.slabsEditForm = this.fb.group({
      slabNo: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
      lotDetails: ["", []],
      blockDetails: ["", []],
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
      processingFee: ["",], //p
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
      date: ["", [Validators.required]],
      purchaseCost: ["", [Validators.required]],
      thickness: ["",Validators.min(1)],
      width: ["", [Validators.min(1)]],
      length: ["", [Validators.min(1)]],
      finishes: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.slabsId = params["id"];
      console.log("user id ", this.slabsId);
    });

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

    this.Service.getSlabsById(this.slabsId).subscribe((resp: any) => {
      this.data = resp.data;
      this.onLotSelect(resp.data.lotDetails);
      this.onBlockSelect(resp.data.blockDetails);
      console.log(this.data);
      this.slabsEditForm.patchValue({
        slabNo: this.data.slabNo,
        lotDetails: this.data.lotDetails,
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
        date: this.data.date,
        blockProcessor: this.data.blockProcessor,
        warehouseDetails: this.data.warehouseDetails,
        processingCost: this.data.processingCost,
        totalCosting: this.data.totalCosting,
        costPerSQFT: this.data.costPerSQFT,
        purchaseCost: this.data.purchaseCost,
        thickness: this.data.thickness,
        width: this.data.width,
        length: this.data.length,
        finishes: this.data.finishes,
      });
    });
  }

  get f() {
    return this.slabsEditForm.controls;
  }

  onLotSelect(value: any) {
    console.log("value of lot", value);
    this.Service.getBlockDetailByLotId(value._id).subscribe((resp: any) => {
      this.blockDropDownData = resp.data.blockDetails;
      console.log("resp.data.blocksDetails", resp.data.blockDetails);
    });
    console.log("blockDropDownData", this.blockDropDownData);
  }
  onBlockSelect(block: any) {
    console.log(block, "set it lot");
    this.blockDropDowntotleCost = block.totalCosting;
    this.blockDropDownPerBlockWeight = block.weightPerBlock;
    if (block.totalCosting) {
      this.slabsEditForm.patchValue({
        purchaseCost: block.totalCosting || 0,
      });
      this.calculateTotalAmount();
    }
    console.log(this.blockDropDownPerBlockWeight, this.blockDropDowntotleCost);
  }

  calculateTotalAmount() {
    let processingFee = +this.slabsEditForm.get("processingFee").value;
    let otherCharges = +this.slabsEditForm.get("otherCharges").value;
    let totalSQFT = +this.slabsEditForm.get("totalSQFT").value;
    let sellingPricePerSQFT = +this.slabsEditForm.get("sellingPricePerSQFT")
      .value;
    let transportationCharges = +this.slabsEditForm.get("transportationCharges")
      .value;
    let purchaseCost = +this.slabsEditForm.get("purchaseCost").value;
    if (!this.blockDropDownPerBlockWeight && !this.blockDropDowntotleCost) {
      console.log(transportationCharges, otherCharges, processingCost);
      var totalCosting = +purchaseCost + otherCharges + transportationCharges;
      var totalAmount = +totalCosting / totalSQFT;
      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsEditForm.patchValue({
        totalCosting: totalCosting.toFixed(2),
        costPerSQFT: totalAmount.toFixed(2),
      });
    } else {
      var processingCost = processingFee * this.blockDropDownPerBlockWeight;
      var totalCosting = +purchaseCost + processingCost + otherCharges + transportationCharges;
      var totalAmount = totalCosting / totalSQFT;
      console.log("processingCost", processingCost);
      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsEditForm.patchValue({
        processingCost: processingCost,
        totalCosting: totalCosting.toFixed(2),
        costPerSQFT: totalAmount.toFixed(2),
      });
    }

    if (sellingPricePerSQFT < totalAmount) {
      this.if_sellingPricePerSQFT = true;
      console.log("if set");
    } else {
      console.log("else set");
      this.if_sellingPricePerSQFT = false;
    }
  }

  SlabsEditFormSubmit() {
    let formData = this.slabsEditForm.value;
    if (
      this.slabsEditForm.value.width ||
      this.slabsEditForm.value.length ||
      this.slabsEditForm.value.thickness
    ) {
      var width = this.slabsEditForm.value.width;
      var length = this.slabsEditForm.value.length;
      var thickness = this.slabsEditForm.value.thickness;
      var _Size = `${width}x${length}x${thickness}`;
    }
    console.log(_Size);
    const payload = {
      slabNo: this.slabsEditForm.value.slabNo,
      lotDetails: this.slabsEditForm.value.lotDetails,
      blockDetails: this.slabsEditForm.value.blockDetails,
      categoryDetail: this.slabsEditForm.value.categoryDetail,
      subCategoryDetail: this.slabsEditForm.value.subCategoryDetail,
      slabName: this.slabsEditForm.value.slabName,
      purchaseCost: this.slabsEditForm.value.purchaseCost,
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
      date: this.slabsEditForm.value.date,
      length: this.slabsEditForm.value.length,
      width: this.slabsEditForm.value.width,
      thickness: this.slabsEditForm.value.thickness,
      finishes: this.slabsEditForm.value.finishes,
      id: this.slabsId,
      slabSize: _Size,
    };
    console.log(payload);
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
