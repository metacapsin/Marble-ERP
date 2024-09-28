import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { LotService } from "../../lot/lot.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { SlabsService } from "../../slabs/slabs.service";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: "app-list-blocks",
  standalone: true,
  imports: [CommonModule, SharedModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: "./list-blocks.component.html",
  styleUrl: "./list-blocks.component.scss",
})
export class ListBlocksComponent implements OnInit {
  public routes = routes;
  data: any[] = [];
  originalData: any[] = [];
  public showDialog = false;
  modalData: any = {};
  blocksID: string;
  searchDataValue = "";
  selectedBlocks: any[] = [];
  allInDropDown: any[];
  warehouseDropDown: any;
  warehouseData: any[];
  cols: Column[] = [];
  blockProcessorList: any[] = [];
  lotID: string;
  exportColumns: ExportColumn[] = [];


  constructor(
    public dialog: MatDialog,
    public router: Router,
    private lotService: LotService,
    private slabsService: SlabsService,
    private blockProcessorService: blockProcessorService,
    private messageService: MessageService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.getUnProcessedList();
    this.getWarehouseList();
    this.getBlockProcessorList();
  }

  onFilter(value: any): void {
    this.data = value.filteredValue;
    console.log(value.filteredValue);
  }

  getUnProcessedList(): void {
    this.lotService.getUnProcessedList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      this.lotID = resp.data.lotId;
      if (this.data.some(block => block.blockProcessor)) {
        const blockWithProcessor = this.data.find(block => block.blockProcessor);
        if (blockWithProcessor) {
          this.lotID = blockWithProcessor.lotId;
          blockWithProcessor.blockProcessor = blockWithProcessor.blockProcessor;
        }
      }
      console.log("API", this.data);
      this.cols = [
        
        { field: "date", header: "Date" },
        { field: "blockDetails.blockNo", header: "Block Number" },
        { field: "category", header: "Category" },
        { field: "subCategory", header: "Sub Category" },
        { field: "blockDetails.height", header: "Height" },
        { field: "blockDetails.width", header: "Width" },
        { field: "blockDetails.length", header: "Length" },
        { field: "blockDetails.totalArea", header: "Total Area" },
        { field: "lotTotalCosting", header: "Total Cost" },
        { field: "warehouseDetails.name", header: "Warehouse" },
        { field: "lotNo", header: "Lot Number" },
        { field: "lotName", header: "Lot Name" },
        { field: "blockProcessorList", header: "Processor" }
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });
  }

  getWarehouseList(): void {
    this.warehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseData = resp.data.map((element) => ({
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name,
        },
      }));
      console.log(this.warehouseData);
    });
  }

  getBlockProcessorList(): void {
    this.blockProcessorService.getAllBlockProcessorData().subscribe((data: any) => {
      this.blockProcessorList = data.map((element: any) => ({
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name,
        },
      }));
      console.log(this.blockProcessorList);
    });
  }

  deleteBlocks(_id: string): void {
    this.blocksID = _id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Block?",
    };
    this.showDialog = true;
  }

  showNewDialog(): void {
    this.showDialog = true;
  }

  callBackModal(): void {
    // Implement delete functionality if needed
  }

  onBlockProcessorChange(event: any, blockNo: string, lotId: string): void {
    console.log("block processor", event.value);
    const payload = {
      lotId: lotId,
      blockNo: blockNo,
      blockProcessor: event.value,
    };
    console.log(payload);
    this.slabsService.updateBlockProcessorByLotId(payload).subscribe(
      (resp: any) => {
        if (resp) {
          this.messageService.add({
            severity: resp.status === "success" ? "success" : "error",
            detail: resp.message,
            
          });
          this.getUnProcessedList();
        }
      }
    );
  }

  close(): void {
    this.showDialog = false;
  }

  onPageChange(event: any): void {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.data.slice(startIndex, endIndex);
  }

  onSearchByChange(value: any): void {
    if (value == null) {
      this.data = this.originalData;
    } else {
      this.data = this.originalData.filter((i) => i.warehouseDetails && i.warehouseDetails._id === value._id);
      this.allInDropDown = this.data;
    }
    console.log(this.data);
  }

  searchData(): void {
    if (this.searchDataValue === "") {
      this.onSearchByChange(null);
      console.log(this.warehouseDropDown);
      if (this.warehouseDropDown.name === "") {
        this.data = this.originalData;
      }
      this.data = this.allInDropDown;
    }
  }
}
