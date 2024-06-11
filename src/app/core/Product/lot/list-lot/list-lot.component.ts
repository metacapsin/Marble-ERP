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
  imports: [CommonModule, SharedModule, ButtonModule, TableModule, TreeTableModule, ToastModule, DialogModule],
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

  constructor(public router: Router,
    private service: LotService,
    private SlabsService: SlabsService,
    private messageService: MessageService,
    // private csvDownloadService: CsvDownloadService
  ) { }

  getLotList(): void {
    this.service.getLotList().subscribe((resp: any) => {
      if (resp && resp.data) {
        // this.lotData = this.csvDownloadService.flattenArray(resp.data);
        // this.generateColumns(resp.data);
      }
      this.lotData = resp.data;
      this.originalData = resp.data;
    });
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

  public searchData(value: any): void {
    this.lotData = this.originalData.filter(i =>
      i.lotName.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.lotData.slice(startIndex, endIndex);
  }
}

