import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { LotService } from '../../lot/lot.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SlabsService } from '../../slabs/slabs.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WarehouseAddComponent } from 'src/app/core/settings/warehouse/warehouse-add/warehouse-add.component';
import { WarehouseService } from 'src/app/core/settings/warehouse/warehouse.service';
import { DropdownModule } from 'primeng/dropdown';
import { Validators } from '@angular/forms';
import { StockAdjustmentService } from '../stock-adjustment.service';

@Component({
  selector: 'app-stock-adjustment-list',
  templateUrl: './stock-adjustment-list.component.html',
  styleUrl: './stock-adjustment-list.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, ButtonModule, TableModule, TreeTableModule, ToastModule, DialogModule, DropdownModule],
  providers: [MessageService],
})
export class StockAdjustmentListComponent implements OnInit {
  addStockAdjustmentForm: FormGroup;
  public routes = routes;
  stockAdjustmentDataList: any = [];
  originalData: any = []
  public showDialog: boolean = false;
  public addstockAdjustment: boolean = false;
  modalData: any = {}
  stockAdjustmentId: any;
  searchDataValue = "";
  selectedlot = "";
  showData: any;
  warehouseData: any = []
  slabData: any = []
  adjustmentTypeData: any = [
    {name: "Add", value:"add"},
    {name: "Subtract", value:"subtract"}
  ]

  constructor(public router: Router,
    private service: StockAdjustmentService,
    private SlabsService: SlabsService,
    private WarehouseService: WarehouseService,
    private fb: FormBuilder,
    private messageService: MessageService) {
      this.addStockAdjustmentForm = this.fb.group({
        warehouse: [""],
        slabs: ["", [Validators.required]],
        currentQty: [""],
        quantity: ["", [Validators.required]],
        adjustmentType: ["", [Validators.required]],
        note: [""],
      })
     }

  getAdjustmentList(): void {
    this.service.getAdjustmentList().subscribe((resp: any) => {
      this.stockAdjustmentDataList = resp.data;
      this.originalData = resp.data;

    });
  }

  ngOnInit(): void {
    this.getAdjustmentList();

    this.WarehouseService.getAllWarehouseList().subscribe((resp:any) => {
      this.warehouseData = resp.data.map(element => ({ 
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name
        }
      }));
    });

    this.SlabsService.getSlabsList().subscribe((resp:any) => {
      this.slabData = resp.data.map(element => ({
        name: element.slabName,
        _id: {
          _id: element._id,
          slabName: element.slabName,
          slabNo: element.slabNo,
          totalSQFT: element.totalSQFT,
        },
      }));
    });
  }
  addstockAdjustmentDialog() {
    this.addStockAdjustmentForm.reset();
      this.addstockAdjustment = true;
  }

  settotalSQFT(value: any){
    console.log("totalSQFT");
    
    this.addStockAdjustmentForm.get("currentQty").setValue(value.totalSQFT)
  }

  deleteStockAdjustment(_id: any) {
    this.stockAdjustmentId = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Stock Adjustment?",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteAdjustment(this.stockAdjustmentId).subscribe(resp => {
      const message = "Stock Adjustment has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getAdjustmentList();
      this.showDialog = false;

    })
  }

  close() {
    this.showDialog = false;
  }

  addStockAdjustmentFormSubmit(){
    const payload = {
      warehouse: this.addStockAdjustmentForm.value.warehouse,
      slabs: this.addStockAdjustmentForm.value.slabs,
      adjustmentType: this.addStockAdjustmentForm.value.adjustmentType,
      quantity: this.addStockAdjustmentForm.value.quantity,
      note: this.addStockAdjustmentForm.value.note,
    }
    if (this.addStockAdjustmentForm.valid) {
      this.service.addNewAdjustment(this.addStockAdjustmentForm.value).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.addstockAdjustment = false;
          const message = "Stock Adjustment has been added";
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

  public searchData(value: any): void {
    this.stockAdjustmentDataList = this.originalData.filter(i =>
      i.slabs.slabName.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.stockAdjustmentDataList.slice(startIndex, endIndex);
  }
}

