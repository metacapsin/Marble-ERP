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
import { LotService } from '../lot.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

import { SlabsService } from '../../slabs/slabs.service';
import { WarehouseService } from 'src/app/core/settings/warehouse/warehouse.service';
// import { CsvDownloadService } from 'src/app/common-component/shared/csv-download/shared/csv-download.service';


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
  selector: 'app-list-lot',
  standalone: true,
  imports: [ SharedModule],
  providers: [MessageService],
  templateUrl: './list-lot.component.html',
  styleUrl: './list-lot.component.scss'
})
export class ListLotComponent implements OnInit {
  files2!: TreeNode[];
  public routes = routes;
  lotData: any = [];
  blockDatabyLotId: any = [];
  originalData: any = []
  public showDialog: boolean = false;
  public lotVisible: boolean = false;
  modalData: any = {}
  lotID: any;
  searchDataValue = "";
  selectedlot = "";
  showData: any;
  childrenData: any = []

  cols: Column[] = [];
  exportColumns: ExportColumn[] = [];
  allInDropDown: any;
  warehouseDropDown: any;
  warehouseData: any;
  lotDaTa='lotDaTa'

  constructor(public router: Router,
    private service: LotService,
    private SlabsService: SlabsService,
    private messageService: MessageService,
    private WarehouseService: WarehouseService
    // private csvDownloadService: CsvDownloadService
  ) { }

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
    return blockDetails.some(block => block.isProcessed);
}


  // generateColumns(data: any[]) {
  //   this.cols = [
  //     { field: 'lotNo', header: 'Lot No' },
  //     { field: 'lotName', header: 'Lot Name' },
  //     { field: 'date', header: 'Date' },
  //   ];

  //   const maxBlocks = Math.max(...data.map(item => item.blockDetails.length));

  //   for (let i = 0; i < maxBlocks; i++) {
  //     this.cols.push(
  //       { field: `blockDetails[${i}].blockNo`, header: `Block No ${i + 1}` },
  //       { field: `blockDetails[${i}].height`, header: `Height ${i + 1}` },
  //       { field: `blockDetails[${i}].width`, header: `Width ${i + 1}` },
  //       { field: `blockDetails[${i}].length`, header: `Length ${i + 1}` },
  //       { field: `blockDetails[${i}].totalArea`, header: `Total Area ${i + 1}` },
  //       { field: `blockDetails[${i}].weightPerBlock`, header: `Weight Per Block ${i + 1}` },
  //       { field: `blockDetails[${i}].rawCosting`, header: `Raw Costing ${i + 1}` },
  //       { field: `blockDetails[${i}].royaltyCosting`, header: `Royalty Costing ${i + 1}` },
  //       { field: `blockDetails[${i}].transportationCosting`, header: `Transportation Costing ${i + 1}` },
  //       { field: `blockDetails[${i}].totalCosting`, header: `Total Costing ${i + 1}` }
  //     );
  //   }

  //   this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  // }

  // exportCSV(dt: any) {
  //     dt.exportCSV();
  // }

  // downloadCSV() {
  //   this.csvDownloadService.downloadCSV(this.lotData, 'lot-details');
  // }

  ngOnInit(): void {
    this.getLotList();
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
  onFilter(value: any) {
    this.lotData = value.filteredValue; 
    console.log(value.filteredValue);
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

    this.router.navigate(['/lot/edit/' + _id]);
  }
  showLotDetails(_id: any) {
    this.SlabsService.getBlockDetailByLotId(_id).subscribe((resp: any) => {
      this.lotVisible = true;
      this.blockDatabyLotId = [resp.data]
      console.log(resp.data);
    });

    this.service.getLotById(_id).subscribe((resp: any) => {
      console.log("resp id lot", resp.data);

    })
  }

  deleteLot(_id: any) {
    this.lotID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Lot",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteLotById(this.lotID).subscribe(resp => {
      const message = "Lot has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getLotList();
      this.showDialog = false;

    })
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

