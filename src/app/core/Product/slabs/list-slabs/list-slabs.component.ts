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
import { Paginator, PaginatorModule } from "primeng/paginator";
@Component({
  selector: "app-list-slabs",
  standalone: true,
  imports: [SharedModule, PaginatorModule],
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
  selectedLayout: any = "Card";
  totalSqFtLeft: any = 0;
  selectedDate: string | null = null;
  searchTable: string = "";

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private service: SlabsService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private WarehouseService: WarehouseService
  ) {}

  currentPage = 0;
  rowsPerPage = 10;
  totalRecords = 0;
  pagedData: any[] = [];

  paginate(event: any): void {
    console.log("event", event);
    this.currentPage = event.first / event.rows;
    this.rowsPerPage = event.rows;

    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = this.currentPage * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    this.pagedData = this.allSlabsDaTa.slice(startIndex, endIndex);
    console.log(" this.pagedData", this.pagedData?.length);
  }

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

  isViewsystemtyp = [
    { code: "Card", value: "Card View" },
    { code: "Table", value: "Table View" },
  ];

  onSearchInput(event: any) {
    // Get the search term directly from the event
    const searchTerm = event.target.value;
    console.log("Search Term:", searchTerm);
    // Filter data based on searchTerm value
    let filteredData = this.allSlabsDaTa?.filter(
      (item) =>
        item?.categoryDetail?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item?.subCategoryDetail?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item?.slabName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.slabNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.sellingPricePerSQFT &&
          item?.sellingPricePerSQFT.toString().includes(searchTerm)) ||
        (item?.costPerSQFT &&
          item?.costPerSQFT.toString().includes(searchTerm)) ||
        (item?.totalSQFT && item?.totalSQFT.toString().includes(searchTerm)) ||
        // Check for size field
        (item?.slabSize && item?.slabSize.toString().includes(searchTerm)) ||
        item?.warehouseDetails?.name
          ?.toLowerCase()
          .toString()
          .includes(searchTerm.toLowerCase())
    );

    // If selectedDate exists, apply date filtering
    if (this.selectedDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item?.slabDate); // Assuming each item has a 'slabDate' property
        const selectedDate = new Date(this.selectedDate);
        return itemDate.toDateString() === selectedDate.toDateString(); // Compare only the date (no time)
      });
    }
    this.totalSqFtLeft = filteredData.reduce(
      (sum, slab) => sum + slab.totalSQFT,
      0
    );
    const startIndex = this.currentPage * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.totalRecords = filteredData?.length;
    this.pagedData = filteredData.slice(startIndex, endIndex);

    // Optionally log the filtered data to verify
    console.log("Filtered Data:", this.pagedData);
  }

  getSlabsList(): void {
    this.service.getSlabsList().subscribe((resp: any) => {
      if (resp) {
        this.allSlabsDaTa = resp.data;
        this.totalRecords = this.allSlabsDaTa?.length;
        if (this.allSlabsDaTa) {
          this.totalSqFtLeft = this.allSlabsDaTa.reduce(
            (sum, slab) => sum + slab.totalSQFT,
            0
          );
        }
        this.originalData = resp.data;
        this.updatePagedData();
        this.cols = [
          { field: "date", header: "Date" },
          { field: "slabNo", header: "Slab No" },
          { field: "slabName", header: "Slab Name" },
          { field: "slabSize", header: "Slab Size" },
          { field: "categoryDetail.name", header: "Category Detail Name" },
          {
            field: "subCategoryDetail.name",
            header: "Sub Category Detail Name",
          },
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
      this.slabProfitOfSlabHistory = resp.data.slabProfit;
      this.slabDetailsOfSlabHistory = resp.data.slabDetail;
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
      messege: "Are you sure want to delete this Slab.",
    };
    this.showDialog = true;
    this.activeTabIndex = 0; // Reset the active tab to the first tab
  }

  showNewDialog() {
    this.showDialog = true;
    this.activeTabIndex = 0; // Reset the active tab to the first tab
  }

  onSearchByChange(value: any): void {
    console.log("value", value);
    // If the search value is empty or null, return all original data
    if (value == null) {
      this.allSlabsDaTa = this.originalData;
      this.allInDropDown = this.allSlabsDaTa;
      const startIndex = this.currentPage * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;
      this.totalRecords = this.allSlabsDaTa?.length;
      this.pagedData = this.allSlabsDaTa.slice(startIndex, endIndex);
      this.totalSqFtLeft = this.allSlabsDaTa.reduce(
        (sum, slab) => sum + slab.totalSQFT,
        0
      );
    } else {
      this.allSlabsDaTa = this.originalData.filter((i) => {
        return i.warehouseDetails && i.warehouseDetails._id == value._id;
      });
      this.allInDropDown = this.allSlabsDaTa;
      const startIndex = this.currentPage * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;
      this.totalRecords = this.allSlabsDaTa?.length;
      this.pagedData = this.allSlabsDaTa.slice(startIndex, endIndex);
      this.totalSqFtLeft = this.allSlabsDaTa.reduce(
        (sum, slab) => sum + slab.totalSQFT,
        0
      );
    }

    // Update dropdown data with the filtered data

    console.log(this.allSlabsDaTa);
  }

  // for change layout
  onchangeLayout(value: any) {
    this.selectedLayout = value;
    console.log("layout", this.selectedLayout);
  }

  callBackModal() {
    this.service.deleteSlabsById(this.slabsID).subscribe((resp:any) => {
      if(resp){
        if(resp?.status === 'success'){
          this.messageService.add({ severity: "success", detail: resp?.message});
          this.getSlabsList();
          this.showDialog = false;
        } else {
          this.messageService.add({ severity: "error", detail: resp?.message });
        }
      }
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
      if (
        this.warehouseDropDown?.name == "" ||
        this.warehouseDropDown == null
      ) {
        console.log("object");
        console.log(this.originalData);
        console.log(this.allSlabsDaTa);
        return (this.allSlabsDaTa = this.originalData);
      } else {
        return (this.allSlabsDaTa = this.allInDropDown);
      }
    }
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.allSlabsDaTa.slice(startIndex, endIndex);
  }


  formatSlabSize(slabSize: string | undefined): string {
    if (!slabSize) return 'N/A';
  
    return slabSize
      .split('x') // Split by "x"
      .map(part => part.trim() ? part.trim() : '0') // Replace empty parts with "0"
      .join(' x '); // Join back with spaces around "x"
  }
}
