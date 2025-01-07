import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { SlabsService } from "../slabs.service";
import { DialogModule } from "primeng/dialog";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
@Component({
  selector: "app-list-slabs",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./list-slabs.component.html",
  styleUrl: "./list-slabs.component.scss",
})
export class ListSlabsComponent {
  public routes = routes;
  data: any = null;
  originalData: any = [];
  public showDialog: boolean = false;
  public slabVisible: boolean = false;
  slabDetail: any = {};
  modalData: any = {};
  activeTabIndex: number = 0;
  slabsID: any;
  searchDataValue = "";
  selectedSlabs = [];
  allSlabsDaTa: any;
  slabsDaTa = "slabsDaTa";
  slabProfit: number = 0;
  slabHistoryData: any = [];
  visibleSlabHistory: boolean = false;
  warehouseData: any;
  warehouseDropDown: any;
  allInDropDown: any;
  cols = [];
  exportColumns = [];
  showDataLoader: boolean = false;
  slabProfitOfSlabHistory: any = [];
  slabDetailsOfSlabHistory: any = [];

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private service: SlabsService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private WarehouseService: WarehouseService
  ) { }

  ngOnInit(): void {
    this.showDataLoader = true;
    this.getSlabsList();
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
  getSlabsList(): void {
    this.service.getSlabsList().subscribe((resp: any) => {
      if (resp) {


        this.allSlabsDaTa = resp.data;
        this.originalData = resp.data;
        this.cols = [
          { field: "date", header: "Date" },
          { field: "slabNo", header: "Slab No" },
          { field: "slabName", header: "Slab Name" },
          { field: "slabSize", header: "Slab Size" },
          { field: "categoryDetail.name", header: "Category Detail Name" },
          { field: "subCategoryDetail.name", header: "Sub Category Detail Name" },
          { field: "costPerSQFT", header: "Cost Per SQFT" },
          { field: "sellingPricePerSQFT", header: "Selling Price Per SQFT" },
          { field: "totalSQFT", header: "Total SQFT" },
          { field: "otherCharges", header: "Other Charges" },
          { field: "transportationCharges", header: "Transportation Charges" },
          { field: "totalCosting", header: "Total Costing" },
          { field: "finishes.name", header: "Finishes" },
          { field: "width", header: "Width" },
          { field: "length", header: "Length" },
          { field: "thickness", header: "Thickness" },
          { field: "createdOn", header: "Created On" },
          { field: "isInUse", header: "Is InUse" },
          { field: "blockProcessor.name", header: "Block Processor" },
          { field: "warehouseDetails.name", header: "Warehouse Details Name" },
        ];

        this.exportColumns = this.cols.map((col) => ({
          title: col.header,
          dataKey: col.field,
        }));

        this.showDataLoader = false;
      }
    });
  }
  showSlabDetails(_id: any) {
    this.slabProfit = 0;
    this.slabVisible = true;
    this.slabDetail = this.allSlabsDaTa.find((e) => e._id === _id);
    this.slabProfit =
      this.slabDetail?.totalSales - this.slabDetail?.totalSalesReturn;
  }

  showSlabHistoryDetails(_id) {
    this.activeTabIndex = 0;
    this.service.getSlabHistoryById(_id).subscribe((resp: any) => {
      this.visibleSlabHistory = true;
      this.slabHistoryData = resp.data;
      this.slabProfitOfSlabHistory = resp.data.slabProfit
      this.slabDetailsOfSlabHistory = resp.data.slabDetail
      console.log("Slab History API", this.slabHistoryData);
    });
  }

  onFilter(value: any) {
    this.allSlabsDaTa = value.filteredValue;
  }

  deleteSlabs(_id: any) {
    this.slabsID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Slabs",
    };
    this.showDialog = true;
    this.activeTabIndex = 0; // Reset the active tab to the first tab
  }

  showNewDialog() {
    this.showDialog = true;
    this.activeTabIndex = 0; // Reset the active tab to the first tab
  }

  onSearchByChange(value: any): void {
    // If the search value is empty or null, return all original data
    if (value == null) {
      this.allSlabsDaTa = this.originalData;
    } else {
      this.allSlabsDaTa = this.originalData.filter((i) => {
        return i.warehouseDetails && i.warehouseDetails._id == value._id;
      });
      this.allInDropDown = this.allSlabsDaTa;
    }

    // Update dropdown data with the filtered data

    console.log(this.allSlabsDaTa);
  }

  callBackModal() {
    this.service.deleteSlabsById(this.slabsID).subscribe((resp) => {
      const message = "Slabs has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getSlabsList();
      this.showDialog = false;
    });
  }
  updateSlabs(id: any) {
    this.router.navigate(["/slabs/slab-edit/" + id]);
  }

  close() {
    this.showDialog = false;
  }

  searchData() {
    if (this.searchDataValue == "") {
      this.onSearchByChange(null);
      console.log(this.warehouseDropDown);
      if (this.warehouseDropDown?.name == "" || this.warehouseDropDown == null) {
        console.log("object");
        console.log(this.originalData);
        console.log(this.allSlabsDaTa);
        return this.allSlabsDaTa = this.originalData;
      }
      else {
        return (this.allSlabsDaTa = this.allInDropDown);
      }
    }
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.allSlabsDaTa.slice(startIndex, endIndex);
  }
}
