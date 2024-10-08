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
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";

@Component({
  selector: "app-edit-slabs",
  standalone: true,
  imports: [
    SharedModule,
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
  maxDate = new Date();
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
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,50})$/;

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
  blockProcessorData: Object;

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
    private Lotservice: LotService,
    private ServiceblockProcessor: blockProcessorService
  ) {
    this.slabsEditForm = this.fb.group({
      slabNo: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
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
          Validators.pattern(this.invoiceRegex),
        ],
      ],
      blockDropDownPerBlockWeight: [""],
      processingFee: [""], //p
      totalSQFT: ["", [Validators.min(1), Validators.max(100000)]],
      otherCharges: [
        "",
        [ Validators.min(1), Validators.max(100000)],
      ],
      transportationCharges: [
        "",
        [ Validators.min(1), Validators.max(100000)],
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
      thickness: ["", [Validators.min(1), Validators.max(100000)]],
      width: ["", [Validators.min(1), Validators.max(100000)]],
      length: ["", [Validators.min(1), Validators.max(100000)]],
      finishes: ["", [Validators.required]],
    });
  }
  getBlockProcessor() {
    this.ServiceblockProcessor.getAllBlockProcessorData().subscribe((data) => {
      this.blockProcessorData = data;
      console.log(this.blockProcessorData);
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
        blockProcessor: this.data.blockProcessor,
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
  // onLotSelect(value: any){}
  // onBlockSelect(block: any){}
  // calculateTotalAmount() {}
  onLotSelect(value: any) {
    console.log("value of lot", value);
    if (!value) {
      this.slabsEditForm.patchValue({
        purchaseCost: 0,
      });
    } else {
      this.Service.getBlockDetailByLotId(value._id).subscribe((resp: any) => {
        this.blockDropDownData = resp.data.blockDetails;
        console.log("resp.data.blocksDetails", resp.data.blockDetails);
      });
    }

    // console.log("blockDropDownData", this.blockDropDownData);
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
  // calculateTotalAmount() {
  //   let processingFee = +this.slabsEditForm.get("processingFee").value || 0;
  //   let otherCharges = +this.slabsEditForm.get("otherCharges").value || 0;
  //   let totalSQFT = +this.slabsEditForm.get("totalSQFT").value || 0;
  //   let sellingPricePerSQFT =
  //     +this.slabsEditForm.get("sellingPricePerSQFT").value || 0;
  //   let transportationCharges =
  //     +this.slabsEditForm.get("transportationCharges").value || 0;
  //   let purchaseCost = +this.slabsEditForm.get("purchaseCost").value || 0;

  //   if (!this.blockDropDownPerBlockWeight && !this.blockDropDowntotleCost) {
  //     // Calculate totalCosting and totalAmount when block dropdowns are not set
  //     let totalCosting = purchaseCost + otherCharges + transportationCharges;
  //     let totalAmount = totalSQFT ? totalCosting / totalSQFT : 0;

  //     console.log("totalCosting", totalCosting);
  //     console.log("totalAmount", totalAmount);

  //     this.slabsEditForm.patchValue({
  //       totalCosting: totalCosting.toFixed(2),
  //       costPerSQFT: totalAmount.toFixed(2),
  //     });
  //   } else {
  //     // Calculate processingCost and update totalCosting and totalAmount
  //     let processingCost = processingFee * this.blockDropDownPerBlockWeight;
  //     let totalCosting = purchaseCost + processingCost + otherCharges + transportationCharges;
  //     let totalAmount = totalSQFT ? totalCosting / totalSQFT : 0;

  //    console.log("processingCost", processingCost);
  //    console.log("totalCosting", totalCosting);
  //    console.log("totalAmount", totalAmount);
  //    var total = this.function_For_processingCost()
  //    console.log(total);
  //    if(total){
  //     var AllTotal = total + otherCharges + transportationCharges;
  //     console.log(AllTotal);
  //    }else{
  //     this.slabsEditForm.patchValue({
  //       processingCost: processingCost.toFixed(2),
  //     })
  //    }
  //     this.slabsEditForm.patchValue({
  //       totalCosting: totalCosting.toFixed(2),
  //       costPerSQFT: totalAmount.toFixed(2),
  //     });
  //   }
  // }
  // function_For_processingCost() {
  //   let totalCosting = +this.slabsEditForm.get("totalCosting").value || 0;
  //   let processingCost = +this.slabsEditForm.get("processingCost").value || 0;

  //   let total = totalCosting + processingCost

  //   this.slabsEditForm.get("totalCosting").patchValue(total.toFixed(2));
  //   // console.log(processingCost);
  //   // return purchaseCost +  processingCost;
  // }
  calculateTotalAmount() {
    let processingFee = +this.slabsEditForm.get("processingFee").value || 0;
    let otherCharges = +this.slabsEditForm.get("otherCharges").value;
    let totalSQFT = +this.slabsEditForm.get("totalSQFT").value;
    var sellingPricePerSQFT = +this.slabsEditForm.get("sellingPricePerSQFT")
      .value;
    let transportationCharges = +this.slabsEditForm.get("transportationCharges")
      .value;
    let purchaseCost = +this.slabsEditForm.get("purchaseCost").value;
    if (!this.blockDropDownPerBlockWeight && !this.blockDropDowntotleCost) {
      console.log(transportationCharges, otherCharges, processingFee);
      // var totalCosting = +purchaseCost + otherCharges + transportationCharges;
      // var totalAmount = +totalCosting / totalSQFT;
      // console.log("totalCosting", totalCosting);
      // console.log("totalAmount", totalAmount);
      // this.slabsEditForm.patchValue({
      //   totalCosting: totalCosting.toFixed(2),
      //   costPerSQFT: totalAmount.toFixed(2),
      // });
      var totalCosting: number =
        +purchaseCost + otherCharges + transportationCharges;
        var totalAmount: number = totalSQFT > 0 ? totalCosting / totalSQFT : 0;
      console.log(totalCosting, totalSQFT);

      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsEditForm.patchValue({
        totalCosting: totalCosting.toFixed(2),
        costPerSQFT: totalAmount.toFixed(2),
        sellingPricePerSQFT: totalAmount === 0 ? null : totalAmount.toFixed(2),
      });
    } else {
      var processingCost = processingFee * this.blockDropDownPerBlockWeight;
      var totalCosting = +purchaseCost + processingCost + otherCharges + transportationCharges;
      var totalAmount: number = totalSQFT == 0 ? 0 : totalCosting / totalSQFT;
      console.log("processingCost", processingCost);
      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsEditForm.patchValue({
        processingCost: processingCost,
        totalCosting: totalCosting.toFixed(2),
        costPerSQFT: totalAmount.toFixed(2),
        sellingPricePerSQFT: parseFloat(totalAmount.toFixed(2)) === 0.00 ? null : totalAmount.toFixed(2),
      });
      // var totalCosting: number =
      //   +purchaseCost + processingFee + otherCharges + transportationCharges;
      // var totalAmount: number = totalSQFT == 0 ? 0 : totalCosting / totalSQFT;
      // this.slabsEditForm.patchValue({
      //   purchaseCost: purchaseCost,
      //   totalCosting: totalCosting,
      //   costPerSQFT: totalAmount.toFixed(2),
      // });
    }

    // if (sellingPricePerSQFT <= totalAmount) {
    //   this.if_sellingPricePerSQFT = true;
    //   console.log("if set");
    // } else {
    //   console.log("else set");
    //   this.if_sellingPricePerSQFT = false;
    // }
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
    if (
      this.slabsEditForm.value.lotDetails &&
      !this.slabsEditForm.value.blockProcessor
    ) {
      const message = "Enter Block Processor";
      this.messageService.add({ severity: "error", detail: message });
    } else {
      console.log(_Size);
      const payload = {
        slabNo: this.slabsEditForm.value.slabNo,
        lotDetails: this.slabsEditForm.value.lotDetails,
        blockDetails: this.slabsEditForm.value.blockDetails,
        categoryDetail: this.slabsEditForm.value.categoryDetail,
        subCategoryDetail: this.slabsEditForm.value.subCategoryDetail,
        slabName: this.slabsEditForm.value.slabName,
        purchaseCost: Number(this.slabsEditForm.value.purchaseCost),
        processingFee: Number(this.slabsEditForm.value.processingFee),
        totalSQFT: this.slabsEditForm.value.totalSQFT,
        processingCost:Number(this.slabsEditForm.value.processingCost),
        otherCharges: Number(this.slabsEditForm.value.otherCharges),
        transportationCharges: Number(this.slabsEditForm.value.transportationCharges),
        totalCosting:Number(this.slabsEditForm.value.totalCosting),
        costPerSQFT: Number(this.slabsEditForm.value.costPerSQFT),
        sellingPricePerSQFT: Number(this.slabsEditForm.value.sellingPricePerSQFT),
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
                this.messageService.add({
                  severity: "success",
                  detail: message,
                });
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
            const message= error.message
            this.messageService.add({ severity: "warn", detail: message });
            console.error("Error occured while updating Slabs:", error);
          }
        );
      } else {
        console.log("Form is invalid!");
      }
    }
  }
}
