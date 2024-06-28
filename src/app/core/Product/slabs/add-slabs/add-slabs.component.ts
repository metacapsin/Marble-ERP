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
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";

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
  TotalCosting: number = 28447.38;
  PerBlockWeight: number = 11.98067702;
  if_sellingPricePerSQFT: boolean = false;
  data: any;
  originalData: any;
  maxDate = new Date();
  blockDataByLotId = [];
  blockDropDownData = [];
  blockDropDowntotleCost: any;
  blockDropDownPerBlockWeight: any;
  CategoryListsEditArray: any;
  wareHousedataListsEditArray: any;
  SubCategoryListsEditArray: any;
  originallotNoList: any = [];
  blockProcessorData: any;
  blockProcessorArray: any[];
  fromWareHouseLotValue: any;
  BlockWeight: number = 0;

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
    private Lotservice: LotService,
    private ServiceblockProcessor: blockProcessorService
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
      processingFee: ["", [Validators.required, Validators.min(1), Validators.max(1000000)]], //p
      totalSQFT: ["", [Validators.required, Validators.min(1), Validators.max(100000)]],
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
        [Validators.required, Validators.min(1), Validators.max(1000000)],
      ],
      notes: ["", [Validators.pattern(this.billingAddressRegex)]],
      blockProcessor: ["",[Validators.required]],
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
  getBlockProcessor() {
    this.ServiceblockProcessor.getAllBlockProcessorData().subscribe((data) => {
      this.blockProcessorData = data;
      this.blockProcessorArray = [];
      this.blockProcessorData.forEach((element: any) => {
        this.blockProcessorArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
      console.log(this.blockProcessorData);
    });
  }

  ngOnInit(): void {
    
    this.getBlockProcessor();
    console.log(this.slabsAddForm.value);
    // this.Lotservice.getLotList().subscribe((resp: any) => {
    //   this.data = resp.data;
    //   this.originalData = resp.data;
    //   console.log("API lot", this.data);
    //   this.originallotNoList = resp.data.map((e) => ({
    //     lotName: `${e.lotName} (${e.lotNo})`,
    //     _id: {
    //       lotName: e.lotName,
    //       lotNo: e.lotNo,
    //       _id: e._id,
    //     },
    //   }));
    // });

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
  onWarehouseSelect(value:any){
    console.log(value);
    this.Lotservice.lotByWarehouse(value._id).subscribe((resp:any)=>{
      this.fromWareHouseLotValue = resp.data.map((e) => ({
        lotName: `${e.lotName} (${e.lotNo})`,
        _id: {
          lotName: e.lotName,
          lotNo: e.lotNo,
          _id: e._id,
        },
      }));
      console.log(this.fromWareHouseLotValue);
    })
  }
  onLotSelect(value: any) {
    if(!value){
      this.slabsAddForm.patchValue({
        purchaseCost: null,
      });
    }else{
      this.Service.getNotProcessedBlocksByLotId(value._id).subscribe(
        (resp: any) => {
          this.blockDropDownData = resp.data;
          console.log("resp.data.blocksDetails", resp.data);
        }
      );
    }
    console.log("blockDropDownData", this.blockDropDownData);
    this.calculateTotalAmount()
  }
  onBlockSelect(block: any) {
    console.log(block, "set it lot");
    this.blockDropDowntotleCost = block.totalCosting;
    this.blockDropDownPerBlockWeight = block.weightPerBlock;
    if (block.totalCosting) {
      this.slabsAddForm.patchValue({
        purchaseCost: block.totalCosting.toFixed(4) || null,
      });
      this.calculateTotalAmount();
    }
    console.log(this.blockDropDowntotleCost, this.blockDropDowntotleCost);
  }
  calculateTotalAmount() {
    let processingFee = +this.slabsAddForm.get("processingFee").value;
    let otherCharges: number = +this.slabsAddForm.get("otherCharges").value;
    let totalSQFT = +this.slabsAddForm.get("totalSQFT").value;
    let sellingPricePerSQFT = +this.slabsAddForm.get("sellingPricePerSQFT")
      .value;
    let transportationCharges: number = +this.slabsAddForm.get(
      "transportationCharges"
    ).value;
    var purchaseCostOrg = parseFloat(this.slabsAddForm.get("purchaseCost").value);
    console.log(purchaseCostOrg);
    console.log(totalSQFT);
    console.log(this.blockDropDownPerBlockWeight ,this.blockDropDowntotleCost);
    // if (!this.blockDropDownPerBlockWeight && !this.blockDropDowntotleCost) {
      // console.log(transportationCharges, otherCharges, processingFee);
      // var totalCosting: number =
      //   +purchaseCost + otherCharges + transportationCharges;
      //   var totalAmount: number = totalSQFT > 0 ? totalCosting / totalSQFT : 0; 
      // console.log(totalCosting, totalSQFT);

      // console.log("totalCosting", totalCosting);
      // console.log("totalAmount", totalAmount);
      // this.slabsAddForm.patchValue({
      //   totalCosting: totalCosting.toFixed(2),
      //   costPerSQFT: totalAmount.toFixed(2),
      //   sellingPricePerSQFT: totalAmount === 0 ? null : totalAmount.toFixed(2),
      // });
    // } else {
      this.BlockWeight =  this.blockDropDownPerBlockWeight.toFixed(4);
      console.log(this.BlockWeight);
      var processingCost = processingFee * this.BlockWeight;
      var totalCosting = +purchaseCostOrg + processingCost + otherCharges + transportationCharges;
      var totalAmount: number = totalSQFT == 0 ? 0 : totalCosting / totalSQFT;
      console.log("processingCost", processingCost);
      console.log("totalCosting", totalCosting);
      console.log("totalAmount", totalAmount);
      this.slabsAddForm.patchValue({
        processingCost: processingCost,
        totalCosting: totalCosting.toFixed(4),
        costPerSQFT: totalAmount.toFixed(2),
        sellingPricePerSQFT: parseFloat(totalAmount.toFixed(2)) === 0.00 ? null : totalAmount.toFixed(2),
      });
      // var totalCosting: number =
      //   +purchaseCost + processingFee + otherCharges + transportationCharges;
      // var totalAmount: number = totalSQFT == 0 ? null : totalCosting / totalSQFT;
      // this.slabsAddForm.patchValue({
      //   purchaseCost: purchaseCost,
      //   totalCosting: totalCosting,
      //   costPerSQFT: totalAmount.toFixed(2),
      // });
    // }
  
    // if (sellingPricePerSQFT <= totalAmount) {
    //   this.if_sellingPricePerSQFT = true;
    //   console.log("if set");
    // } else {
    //   console.log("else set");
    //   this.if_sellingPricePerSQFT = false;
    // }
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
        processingFee: this.slabsAddForm.value.processingFee,
        totalSQFT: this.slabsAddForm.value.totalSQFT,
        purchaseCost: this.slabsAddForm.value.purchaseCost,
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
  // }
}
