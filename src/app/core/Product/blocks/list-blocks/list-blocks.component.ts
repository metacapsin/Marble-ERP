import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { LotService } from "../../lot/lot.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";


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
export class ListBlocksComponent {
  public routes = routes;
  data: any = [];
  originalData: any = [];
  public showDialog: boolean = false;
  modalData: any = {};
  blocksID: any;
  searchDataValue = "";
  selectedBlocks = [];
  allInDropDown: any;
  warehouseDropDown: any;
  warehouseData: any;
  cols: Column[] = [];




  constructor(
    public dialog: MatDialog,
    public router: Router,
    private lotService: LotService,
    private messageService: MessageService,
    private WarehouseService: WarehouseService,

  ) {}

  onFilter(value: any) {
    this.data = value.filteredValue;
    console.log(value.filteredValue);
  }
  getUnProcessedList(): void {
    this.lotService.getUnProcessedList().subscribe((resp: any) => {
      this.data = resp.data;
    
      this.originalData = resp.data;

      console.log("API", this.data);
    });
  }
  ngOnInit(): void {
    this.getUnProcessedList();
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

  deleteBlocks(_id: any) {
    this.blocksID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Block",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    // this.lotService.deleteBlocksById(this.blocksID).subscribe((resp) => {
    //   const message = "Blocks has been deleted";
    //   this.messageService.add({ severity: "success", detail: message });
    //   this.getUnProcessedList();
    //   this.showDialog = false;
    // });
  }

  close() {
    this.showDialog = false;
  }
  
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.data.slice(startIndex, endIndex);
  }
  onSearchByChange(value: any): void {
    // If the search value is empty or null, return all original data
    if (value == null) {
      this.data = this.originalData;
    } else {
      this.data = this.originalData.filter((i) => {
        return i.warehouseDetails && i.warehouseDetails._id == value._id;
      });
      this.allInDropDown = this.data;
    }

    // Update dropdown data with the filtered data

    console.log(this.data);
  }
  searchData() {
    if (this.searchDataValue == "") {
      this.onSearchByChange(null);
      console.log(this.warehouseDropDown);
      if (this.warehouseDropDown.name == "") {
        this.data = this.originalData;
      }
      return (this.data = this.allInDropDown);
    }
  }
}
