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
import { StockTransferService } from '../stock-transfer.service';

@Component({
  
  selector: 'app-stock-transfer-list',
  templateUrl: './stock-transfer-list.component.html',
  styleUrl: './stock-transfer-list.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, ButtonModule, TableModule, TreeTableModule, ToastModule, DialogModule, DropdownModule],
  providers: [MessageService],
})
export class StockTransferListComponent implements OnInit {
  addStockTransferForm: FormGroup;
  public routes = routes;
  stockTransferDataList: any = [];
  originalData: any = []
  public showDialog: boolean = false;
  public addstockTransfer: boolean = false;
  modalData: any = {}
  stockTransferId: any;
  searchDataValue = "";
  selectedlot = "";
  showData: any;
  warehouseData: any = []
  slabData: any = []
  transferType: any = [
    {name: "Add", value:"add"},
    {name: "Subtract", value:"subtract"}
  ]

  constructor(public router: Router,
    private service: StockTransferService,
    private SlabsService: SlabsService,
    private WarehouseService: WarehouseService,
    private fb: FormBuilder,
    private messageService: MessageService) {
      this.addStockTransferForm = this.fb.group({
        fromWarehouse: [""],
        toWarehouse: [""],
        slab: ["", [Validators.required]],
        transferType: [""],
        currrentQty: ["", [Validators.required]],
        transferQty: ["", [Validators.required]],
        transportCharges: [""],
        otherCharges: [""],
      })
     }

  getAdjustmentList(): void {
    this.service.getAdjustmentList().subscribe((resp: any) => {
      this.stockTransferDataList = resp.data;
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
  addstockTransferDialog() {
    this.addStockTransferForm.reset();
      this.addstockTransfer = true;
  }

  settotalSQFT(value: any){
    console.log("totalSQFT");
    
    this.addStockTransferForm.get("currentQty").setValue(value.totalSQFT)
  }

  deleteStockAdjustment(_id: any) {
    this.stockTransferId = _id;

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
    this.service.deleteAdjustment(this.stockTransferId).subscribe(resp => {
      const message = "Stock Adjustment has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getAdjustmentList();
      this.showDialog = false;

    })
  }

  close() {
    this.showDialog = false;
  }

  addStockTransferFormSubmit(){
    const payload = {
      fromWarehouse: this.addStockTransferForm.value.fromWarehouse,
      toWarehouse: this.addStockTransferForm.value.toWarehouse,
      slab: this.addStockTransferForm.value.slab,
      transferType: this.addStockTransferForm.value.transferType,
      currrentQty: this.addStockTransferForm.value.currrentQty,
      transferQty: this.addStockTransferForm.value.transferQty,
      transportCharges: this.addStockTransferForm.value.transportCharges,
      otherCharges: this.addStockTransferForm.value.otherCharges,
    }
    if (this.addStockTransferForm.valid) {
      this.service.addNewAdjustment(payload).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.addstockTransfer = false;
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
    this.stockTransferDataList = this.originalData.filter(i =>
      i.slabs.slabName.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.stockTransferDataList.slice(startIndex, endIndex);
  }
}


