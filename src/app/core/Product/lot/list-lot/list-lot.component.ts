import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { LotService } from '../lot.service';
interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'app-list-lot',
  standalone: true,
  imports: [CommonModule,SharedModule,ButtonModule, TreeTableModule, ToastModule],
  providers: [MessageService],
  templateUrl: './list-lot.component.html',
  styleUrl: './list-lot.component.scss'
})
export class ListLotComponent implements OnInit {
  files!: TreeNode[];

  cols = [
    { field: 'lotNo', header: 'Lot No' },
    { field: 'lotName', header: 'Lot Name' },
    { field: 'lotWeight', header: 'Lot Weight' },
    // Add more columns as needed
  ];

// cols = [
//     { field: 'lotNo', header: 'Lot No' },
//     { field: 'lotName', header: 'Lot Name' },
//     { field: 'lotWeight', header: 'Lot Weight' },
//   ];
  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  lotID: any;
  searchDataValue = "";
  selectedLot = [];

  constructor(public dialog: MatDialog, public router: Router, private service: LotService, private _snackBar: MatSnackBar, private messageService: MessageService) { }
  getLotList(): void {
    this.service.getLotList().subscribe((resp: any) => {
      console.log("Before map", resp.data);
      this.data = resp.data.map((item: any) => ({
        lotNo: item.lotNo,
        lotName: item.lotName,
        lotWeight: item.lotWeight,
        blocksDetails: item.blocksDetails || [] // If blocksDetails is null, default to an empty array
      }));
    });
     

    console.log("After map", this.data);
    

  }
  ngOnInit(): void {
    this.getLotList();

    this.files = [];
        for(let i = 0; i < 50; i++) {
            let node = {
                data:{  
                    name: 'Item ' + i,
                    size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                    type: 'Type ' + i
                },
                children: [
                    {
                        data: {  
                            name: 'Item ' + i + ' - 0',
                            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                            type: 'Type ' + i
                        }
                    }
                ]
            };

            this.files.push(node);
  }
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
    this.data = this.originalData.filter(i =>
    i.name.toLowerCase().includes(value.trim().toLowerCase())
  );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.data.slice(startIndex, endIndex);
  }

}

