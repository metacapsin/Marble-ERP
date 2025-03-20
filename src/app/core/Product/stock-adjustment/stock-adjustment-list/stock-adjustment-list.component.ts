import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
// import { SlabsService } from "../../slabs/slabs.service";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from "@angular/forms";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { DropdownModule } from "primeng/dropdown";
import { Validators } from "@angular/forms";
import { StockAdjustmentService } from "../stock-adjustment.service";
import { FilterPipe } from "src/app/core/filter.pipe";
import { SlabsService } from "../../slabs/slabs.service";
import { validationRegex } from "src/app/core/validation";

@Component({
  selector: "app-stock-adjustment-list",
  templateUrl: "./stock-adjustment-list.component.html",
  styleUrl: "./stock-adjustment-list.component.scss",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
})
export class StockAdjustmentListComponent implements OnInit {
  addStockAdjustmentForm: FormGroup;
  editStockAdjustmentForm: FormGroup;
  public routes = routes;
  stockAdjustmentDataList: any = [];
  originalData: any = [];
  public showDialog: boolean = false;
  public addstockAdjustment: boolean = false;
  public editstockAdjustment: boolean = false;
  modalData: any = {};
  stockAdjustmentId: any;
  searchDataValue = "";
  stockAdjustmentData = "stockAdjustmentData";
  selectedlot = "";
  showData: any;
  warehouseData: any = [];
  originalSlabData: any = [];
  slabData: any = [];
  adjustmentTypeData: any = [
    { name: "Add", value: "add" },
    { name: "Subtract", value: "subtract" },
  ];
  searchByWarehouseData: any = [];
  searchBy: any;
  cols = [];
  exportColumns = [];
  warehouseDropDown: any;
  allInDropDown: any;


  constructor(
    public router: Router,
    private service: StockAdjustmentService,
    private SlabsService: SlabsService,
    private WarehouseService: WarehouseService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.addStockAdjustmentForm = this.fb.group({
      warehouse: ["", [Validators.required]],
      slabs: ["", [Validators.required]],
      currentQty: [""],
      quantity: ["", [Validators.required, Validators.min(1),Validators.max(100000), this.quantityValidator()]],
      adjustmentType: ["", [Validators.required]],
      note: [
        "",
        [Validators.required, Validators.pattern(validationRegex.address3To500Regex)],
      ],
    });
    this.editStockAdjustmentForm = this.fb.group({
      warehouse: ["", [Validators.required]],
      slabs: ["", [Validators.required]],
      currentQty: [""],
      quantity: ["", [Validators.required, Validators.min(1),Validators.max(100000), this.quantityValidator()]],
      adjustmentType: ["", [Validators.required]],
      note: [
        "",
        [Validators.required, Validators.pattern(validationRegex.address3To500Regex)],
      ],
    });
  }

  quantityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const quantity = control.value;
      const adjustmentType = control.parent?.get('adjustmentType')?.value;
      const currentQty = control.parent?.get('currentQty')?.value;

      if (adjustmentType === 'subtract' && quantity > currentQty) {
        return { 'exceedsCurrentQuantity': true };
      }
      return null;
    };
  }

  onSearchByChange(value: any): void {
    // If the search value is empty or null, return all original data
    if (value == null) {
      this.stockAdjustmentDataList = this.originalData;
    } else {
      this.stockAdjustmentDataList = this.originalData.filter((i) => {
        return i.warehouse && i.warehouse._id === value._id;
      });
      this.allInDropDown = this.stockAdjustmentDataList;
    }
  }
  
  
  getAdjustmentList(): void {
    this.service.getAdjustmentList().subscribe((resp: any) => {
      this.stockAdjustmentDataList =resp.data.map((element) => ({
        ...element,
        displayName: `${element.slabs.slabName} (${element.slabs.slabNo})`,
      }));
      this.originalData = resp.data;
      this.cols = [
        { field: "createdOn", header: "Created On" },
        { field: "slabs.slabName", header: "Slab Name" },
        { field: "warehouse.name", header: "Warehouse Name" },
        { field: "adjustmentType", header: "Adjustment Type" },
        { field: "previousQty", header: "Previous Qty" },
        { field: "quantity", header: "Quantity" },
        { field: "currentQty", header: "Current Qty" },
        { field: "note", header: "Note" },
        { field: "createdOn", header: "Created On" },
        { field: "createdByName", header: "Created By Name" },
        { field: "updatedByName", header: "Updated By Name" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.stockAdjustmentDataList.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
      console.log("original data", this.originalData);
    });
  }

  onFilter(value: any) {
    this.stockAdjustmentDataList = value.filteredValue;
  }

  ngOnInit(): void {
    this.getAdjustmentList();

    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseData = resp.data.map((element) => ({
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name,
        },
      }));
    });
  }
  addstockAdjustmentDialog() {
    this.addStockAdjustmentForm.reset();
    this.addstockAdjustment = true;
    this.setupFormValidation(this.addStockAdjustmentForm);

  }
  editstockAdjustmentDialog(_id) {
    this.stockAdjustmentId = _id;
    this.editstockAdjustment = true;
    this.setupFormValidation(this.editStockAdjustmentForm);

    this.service.getAdjustmentById(_id).subscribe((resp: any) => {
      this.onWarehouseSelect(resp.data.warehouse);
      this.editStockAdjustmentForm.patchValue({
        warehouse: resp.data.warehouse,
        slabs: resp.data.slabs,
        currentQty: resp.data.currentQty,
        adjustmentType: resp.data.adjustmentType,
        quantity: resp.data.quantity,
        note: resp.data.note,
      });
    });
  }
  setupFormValidation(form: FormGroup) {
    form.get('adjustmentType')?.valueChanges.subscribe(() => {
      form.get('quantity')?.updateValueAndValidity();
    });
    form.get('currentQty')?.valueChanges.subscribe(() => {
      form.get('quantity')?.updateValueAndValidity();
    });
  }

  onWarehouseSelect(value: any) {
    this.SlabsService.getSlabListByWarehouseId(value._id).subscribe(
      (resp: any) => {
        this.originalSlabData = resp.data;
        this.slabData = resp.data.map((element) => ({
          name: `${element.slabName} (${element.slabNo})`,
          _id: {
            _id: element._id,
            slabName: element.slabName,
            slabNo: element.slabNo,
            // totalSQFT: element.totalSQFT,
          },
        }));
      }
    );
  }

  settotalSQFT(value: any) {
    const selectedSlab = this.originalSlabData.find(
      (slab) => slab._id === value._id
    );
    this.addStockAdjustmentForm
      .get("currentQty")
      .setValue(selectedSlab.totalSQFT);
  }
  settotalSQFTEdit(value: any) {
    const selectedSlab = this.originalSlabData.find(
      (slab) => slab._id === value._id
    );
    this.editStockAdjustmentForm
      .get("currentQty")
      .setValue(selectedSlab.totalSQFT);
  }
  deleteStockAdjustment(_id: any) {
    this.stockAdjustmentId = _id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Stock Adjustment?",
    };
    this.showDialog = true;
  }
  showNewDialog() {
    this.showDialog = true;
  }
  callBackModal() {
    this.service.deleteAdjustment(this.stockAdjustmentId).subscribe((resp) => {
      const message = "Stock Adjustment has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getAdjustmentList();
      this.showDialog = false;
    });
  }
  close() {
    this.showDialog = false;
  }
  addStockAdjustmentFormSubmit() {
    const payload = {
      warehouse: this.addStockAdjustmentForm.value.warehouse,
      slabs: this.addStockAdjustmentForm.value.slabs,
      adjustmentType: this.addStockAdjustmentForm.value.adjustmentType,
      quantity: this.addStockAdjustmentForm.value.quantity,
      note: this.addStockAdjustmentForm.value.note,
      previousQty: this.addStockAdjustmentForm.value.currentQty,
    };
    if (this.addStockAdjustmentForm.valid) {
      this.service.addNewAdjustment(payload).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.addstockAdjustment = false;
          const message = "Stock Adjustment has been added";
          this.messageService.add({ severity: "success", detail: message });
          this.getAdjustmentList();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      },
      (error) => {
        const message = error.message;
          this.messageService.add({ severity: "error", detail: message });
      })
    } else {
      console.log("Form is invalid!");
    }
  }
  editStockAdjustmentFormSubmit() {
    const payload = {
      warehouse: this.editStockAdjustmentForm.value.warehouse,
      slabs: this.editStockAdjustmentForm.value.slabs,
      adjustmentType: this.editStockAdjustmentForm.value.adjustmentType,
      quantity: this.editStockAdjustmentForm.value.quantity,
      note: this.editStockAdjustmentForm.value.note,
      previousQty: this.editStockAdjustmentForm.value.currentQty,
      id: this.stockAdjustmentId,
    };
    if (this.editStockAdjustmentForm.valid) {
      this.service.updateAdjustment(payload).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.editstockAdjustment = false;
          const message = "Stock Adjustment has been updated";
          this.messageService.add({ severity: "success", detail: message });
          this.getAdjustmentList();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    } else {
      console.log("Form is invalid!");
    }
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.stockAdjustmentDataList.slice(
      startIndex,
      endIndex
    );
  }
  searchData() {
    if (this.searchDataValue == "") {
      this.onSearchByChange(null);
      if (this.warehouseDropDown?.name == "" || this.warehouseDropDown == null) {
        return this.stockAdjustmentDataList = this.originalData;
      } else {
        return (this.stockAdjustmentDataList = this.allInDropDown);
      }
    }
  }
}
