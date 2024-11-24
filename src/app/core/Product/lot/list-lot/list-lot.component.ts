import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { LotService } from "../lot.service";
import { SlabsService } from "../../slabs/slabs.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
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
  selector: "app-list-lot",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./list-lot.component.html",
  styleUrl: "./list-lot.component.scss",
})
export class ListLotComponent implements OnInit {
  files2!: TreeNode[];
  public routes = routes;
  lotData: any = [];
  blockDatabyLotId: any = [];
  originalData: any = [];
  public showDialog: boolean = false;
  public lotVisible: boolean = false;
  modalData: any = {};
  lotID: any;
  searchDataValue = "";
  selectedlot = "";
  showData: any;
  childrenData: any = [];

  cols: Column[] = [];
  exportColumns: ExportColumn[] = [];
  allInDropDown: any;
  warehouseDropDown: any;
  warehouseData: any;
  lotDaTa = "lotDaTa";
  blockProcessorList: any = [];

  constructor(
    public router: Router,
    private service: LotService,
    private SlabsService: SlabsService,
    private messageService: MessageService,
    private WarehouseService: WarehouseService,
    private blockProcessorService: blockProcessorService // private csvDownloadService: CsvDownloadService
  ) {}

  getLotList(): void {
    this.service.getLotList().subscribe((resp: any) => {
      // if (resp && resp.data) {
      //    this.lotData = this.csvDownloadService.flattenArray(resp.data);
      //    this.generateColumns(resp.data);
      // }
      this.lotData = resp.data;
      this.originalData = resp.data;

      this.cols = [
        { field: "date", header: "Date" },
        { field: "lotName", header: "Lot Name" },
        { field: "lotNo", header: "Lot No" },
        { field: "lotWeight", header: "Lot Weight" },
        { field: "pricePerTon", header: "Price Per Ton" },
        { field: "blocksCount", header: "Blocks Count" },
        { field: "lotTotalCosting", header: "Lot Total Costing" },
        { field: "warehouseDetails.name", header: "Warehouse Details" },
        { field: "vehicleNo", header: "Vehicle No" },
        { field: "transportationCharge", header: "Transportation Charge" },
        { field: "royaltyCharge", header: "Royalty Charge" },
        { field: "blocksCount", header: "Blocks Count" },
        { field: "averageTransport", header: "Average Transport" },
        { field: "averageWeight", header: "Average Weight" },
        { field: "averageRoyalty", header: "Average Royalty" },
        { field: "purchaseCost", header: "Purchase Cost" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.lotData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }

  isAnyBlockProcessed(blockDetails: any[]): boolean {
    return blockDetails.some((block) => block.isProcessed);
  }
  ngOnInit(): void {
    this.getLotList();
    this.blockProcessorService
      .getAllBlockProcessorData()
      .subscribe((data: any) => {
        this.blockProcessorList = [];
        data.forEach((element: any) => {
          this.blockProcessorList.push({
            name: element.name,
            _id: {
              _id: element._id,
              name: element.name,
            },
          });
        });
        console.log(this.blockProcessorList);
      });
    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
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
 

  onSearchByChange(value: any): void {
    // If the search value is empty or null, return all original data
    if (value == null) {
      this.lotData = this.originalData;
    } else {
      this.lotData = this.originalData.filter((i) => {
        return i.warehouseDetails && i.warehouseDetails._id == value._id;
      });
      this.allInDropDown = this.lotData;
    }

    // Update dropdown data with the filtered data

    console.log(this.lotData);
  }

  searchData() {
    if (this.searchDataValue == "") {
      this.onSearchByChange(null);
      console.log(this.warehouseDropDown);
      if (this.warehouseDropDown.name == "") {
        this.lotData = this.originalData;
      }
      return (this.lotData = this.allInDropDown);
    }
  }

  editPage(_id: any) {
    this.router.navigate(["/lot/edit/" + _id]);
  }
  showLotDetails(_id: any) {
    this.lotID = "";
    this.SlabsService.getBlockDetailByLotId(_id).subscribe((resp: any) => {
      this.lotVisible = true;
      this.blockDatabyLotId = resp.data.blockDetails;
      this.lotID = _id;
    });
  }

  onBlockProcessorChange(event: any, blockNo: any) {
    console.log("block processor", event);
    const payload = {
      lotId: this.lotID,
      blockNo: blockNo,
      blockProcessor: event.value,
    };
    this.SlabsService.updateBlockProcessorByLotId(payload).subscribe(
      (resp: any) => {
        if (resp) {
          if (resp.status == "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
          } else {
            this.messageService.add({
              severity: "error",
              detail: resp.message,
            });
          }
        }
      }
    );
  }

  deleteLot(_id: any) {
    this.lotID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Lot",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteLotById(this.lotID).subscribe((resp) => {
      const message = "Lot has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getLotList();
      this.showDialog = false;
    });
  }

  close() {
    this.showDialog = false;
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.lotData.slice(startIndex, endIndex);
  }
}
