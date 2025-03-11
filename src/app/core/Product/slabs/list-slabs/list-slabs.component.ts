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
import { HttpClient } from "@angular/common/http";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";
import { SalesService } from "src/app/core/sales/sales.service";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
interface SlabInfo {
  _id: string;
  slabNo: string;
  slabName: string;
}

interface SlabDetail {
  slabInfo: SlabInfo;
}

@Component({
  selector: "app-list-slabs",
  standalone: true,
  imports: [SharedModule, PaginatorModule, InvoiceDialogComponent],
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
  viewingSLabId: any;
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
  mergedExpenseData: any[] = [];
  slabExpenseId: any;
  totalSqFtLeft: any = 0;
  selectedDate: string | null = null;
  searchTable: string = "";
  slabOtherExpenseData: any = [];
  slabBlockSlabProcessing: any = [];
  public showDialoge: boolean = false;
  formVisible: boolean = true; // Controls form visibility
  canAddExpense: boolean = true; // Controls the visibility of "Add Expense" button
  header: string;
  salesDataById = [];
  showInvoiceDialog: boolean = false;
  paymentListData = [];


  constructor(
    public dialog: MatDialog,
    public router: Router,
    private service: SlabsService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private WarehouseService: WarehouseService,
    private blockProcessorService: blockProcessorService,
        private SalesService: SalesService,
    

    private http: HttpClient
  ) {}

  currentPage = 0;
  rowsPerPage = 10;
  totalRecords = 0;
  pagedData: any[] = [];

  expenses: any[] = [];

  blockProcessorList = []

  expenseOptions = [
    { label: "Block/Slab Processing", value: "Block/Slab Processing" },
    { label: "Other Expense", value: "Other Expense" },
  ];

  addExpense() {
    // if (this.expenses.length >= 1) {
    //   console.warn("❌ You can only add one expense.");
    //   return; // Prevent adding more expenses
    // }
    // this.blockProcessorService.getAllBlockProcessorData().subscribe((data) => {
    //   this.blockProcessorList = data as { _id: string; name: string; }[];
    // })
    this.expenses.push({
      expenseType: "",
      recipient: "",
      date: "",
      amount: null,
      processingDate: "",
      processingCost: null,
      blockProcessor: null // Start as null, not an empty object

    });
    this.formVisible = true; // Show the form when adding a new record
    this.canAddExpense = false; // Hide "Add Expense" button after adding
  }

  removeExpense(index: number) {
    this.expenses.splice(index, 1);
    this.canAddExpense = true;
        this.expenses = []; // Reset expenses
  }

  viewSales(_id:any){
console.log('sales id',_id)
  this.SalesService.GetSalesDataById(_id).subscribe((resp: any) => {
    this.header = "Sales Invoice";

    this.salesDataById = [resp.data];
    console.log("sales data by id On dialog", this.salesDataById);
    this.showInvoiceDialog = true;
  });

  this.SalesService.getSalesPaymentList(_id).subscribe((resp: any) => {
    this.paymentListData = resp.data;
  });
  }

  callBackModalForInvoice() {
    this.showInvoiceDialog = false;
    
  }
  closeForInvocie() {
    this.showInvoiceDialog = false;
  }
  onExpenseTypeChange(expense: any) {
    if (expense.expenseType === "Other Expense") {
      delete expense.processingDate;
      delete expense.processingCost;
      delete expense.blockProcessor;
      expense.recipient = "";
      expense.date = "";
      expense.amount = null;
    } else if (expense.expenseType === "Block/Slab Processing") {
      delete expense.recipient;
      delete expense.date;
      delete expense.amount;
      expense.processingDate = "";
      expense.processingCost = null;
      expense.blockProcessor = { _id: "", name: "" };
    }
  }

  // onBlockProcessorSelect(expense: any, selectedProcessor: any) {
  //   console.log(selectedProcessor);
  //   console.log(expense);
  //   expense.blockProcessor = {
  //     _id: selectedProcessor._id,
  //     name: selectedProcessor.name,
  //   };
  // }

  onBlockProcessorSelect(expense: any, selectedProcessor: any) {
    console.log("Selected Processor:", selectedProcessor);
    console.log("Before Update Expense:", expense);
  
    // Ensure `selectedProcessor` is an object, not just an ID
    if (typeof selectedProcessor === "string") {
      selectedProcessor = this.blockProcessorList.find(p => p._id === selectedProcessor) || null;
    }
  
    expense.blockProcessor = selectedProcessor; // Assign full object
  
    console.log("Updated Expense:", expense);
  }

  isFormValid(): boolean {
    if (this.expenses.length === 0) {
      return false; // No expenses to validate
    }

    const expense = this.expenses[0]; // Since only one expense is allowed

    if (!expense.expenseType) {
      return false; // Expense type is required
    }

    if (expense.expenseType === "Block/Slab Processing") {
      return (
        !!expense.processingDate &&
        !!expense.processingCost &&
        !!expense.blockProcessor?._id
      );
    } else if (expense.expenseType === "Other Expense") {
      return !!expense.recipient && !!expense.date && !!expense.amount;
    }

    return false; // Default to invalid
  }

  saveExpenses() {
    if (this.expenses.length === 0) {
      alert("No expenses to save.");
      return;
    }

    const expense = this.expenses[0]; // Since only one expense is allowed

    if (!expense.expenseType) {
      alert("Please select an expense type.");
      return;
    }

    let payload = {}; // Initialize the payload object

    if (expense.expenseType === "Block/Slab Processing") {
      if (
        !expense.processingDate ||
        !expense.processingCost ||
        !expense.blockProcessor._id
      ) {
        alert("Please fill all fields for Block/Slab Processing.");
        return;
      }

      payload = {
        slabDetail: {
          slab: {
            _id: this.slabDetail._id, // Assuming `slabDetail` contains slab info
            slabNo: this.slabDetail.slabNo,
            slabName: this.slabDetail.slabName,
          },
          slabExpense: {
            expenseType: "Block/Slab Processing",
            blockProcessor: {
              _id: expense.blockProcessor._id,
              name: expense.blockProcessor.name,
            },
            processingCost: expense.processingCost,
            date: expense.processingDate,
          },
        },
      };
    } else if (expense.expenseType === "Other Expense") {
      if (!expense.recipient || !expense.date || !expense.amount) {
        alert("Please fill all fields for Other Expense.");
        return;
      }

      payload = {
        slabDetail: {
          slab: {
            _id: this.slabDetail._id, // Assuming `slabDetail` contains slab info
            slabNo: this.slabDetail.slabNo,
            slabName: this.slabDetail.slabName,
          },
          slabExpense: {
            expenseType: "Other Expense",
            recipient: expense.recipient,
            amount: expense.amount,
            date: expense.date,
          },
        },
      };
    }

    // Call the API with the correct payload
    this.service.updateSlabExpense(payload).subscribe(
      (response) => {
        console.log("Expenses updated successfully", response);

        // **Hide the form after successful submission**
        this.formVisible = false;
        this.canAddExpense = true;
        this.expenses = []; // Reset expenses
        // **Refresh the table**
        // this.service.getSlabHistoryById(this.viewingSLabId).subscribe((resp: any) => {
        //   this.slabOtherExpenseData = resp.data.otherExpenses;
        //   this.slabBlockSlabProcessing = resp?.data?.slabProcessing
        //   console.log("🔄 Updated Slab History:", this.slabOtherExpenseData);
        // });
        // this.getSlabHistoryById(this.viewingSLabId);
        this.getSlabDetailsById(this.viewingSLabId)
      },
      (error) => {
        console.error("Error updating expenses", error);
        alert("Failed to save expenses.");
        this.expenses = []; // Reset expenses
      }
    );
  }

  closeDialog() {
    this.formVisible = false; // Show form when dialog is reopened
    this.canAddExpense = true; // Ensure "Add Expense" button is visible
this.getSlabsList();
    this.expenses = []; // Reset expenses
  }

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
    this.blockProcessorService.getAllBlockProcessorData().subscribe((data) => {
      this.blockProcessorList = data as { _id: string; name: string }[];
    });
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
    this.viewingSLabId = _id;
    this.getSlabHistoryById(_id);
    this.slabProfit = 0;
    this.slabVisible = true;
    this.slabDetail = this.allSlabsDaTa.find((e) => e._id === _id);
    this.slabProfit =
      this.slabDetail?.totalSales - this.slabDetail?.totalSalesReturn;
  }
  getSlabDetailsById(_id:any){
    this.viewingSLabId = _id;
    this.service.getSlabsById(_id).subscribe((resp:any)=>{
      console.log('get slab by id', resp)
      if(resp.status=== 'success'){
        this.slabDetail=resp.data
    this.getSlabHistoryById(_id);

        this.slabProfit = 0;
          this.slabVisible = true;
          this.slabProfit =
        this.slabDetail?.totalSales - this.slabDetail?.totalSalesReturn;
      }
      else{
        this.messageService.add({
          severity: "error",
          detail: resp?.message,
        });
      }
     
    })
  }

  getTotalQuantity(sales: any): number {
    if (!sales?.salesItemDetails) return 0;
    return sales.salesItemDetails.reduce((total, item) => total + (item.salesItemQuantity || 0), 0);
  }
  

  deleteExpense(id: any, type?: any) {
    this.slabExpenseId = id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Expense",
    };
    this.showDialog = true;
  }

  showSlabHistoryDetails(_id) {
    this.activeTabIndex = 0;
    this.service.getSlabHistoryById(_id).subscribe((resp: any) => {
      const otherExpenses = resp.data.otherExpenses || [];
      const slabProcessing = resp.data.slabProcessing || [];

      // Merge both arrays into one and add a type indicator
      this.mergedExpenseData = [
        ...otherExpenses.map((expense) => ({
          ...expense,
          type: "Other Expense",
          date: expense.date, // Keep original date
          recipient: expense.recipient,
          amount: expense.amount,
          processorName: null, // Not applicable
          processingCost: null, // Not applicable
        })),
        ...slabProcessing.map((expense) => ({
          ...expense,
          type: "Block/Slab Processing",
          date: expense.processingDate, // Rename to match structure
          recipient: null, // Not applicable
          amount: null, // Not applicable
          processorName: expense.processor?.name || "N/A",
          processingCost: expense.processingCost || 0,
        })),
      ];
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
    if (this.slabsID && !this.slabExpenseId) {
      this.service.deleteSlabsById(this.slabsID).subscribe((resp: any) => {
        if (resp) {
          if (resp?.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp?.message,
            });
            this.getSlabsList();
            this.showDialog = false;
          } else {
            this.messageService.add({
              severity: "error",
              detail: resp?.message,
            });
          }
        }
      });
    }
    if (this.slabExpenseId) {
      this.service
        .deleteSlabExpenseById(this.slabExpenseId)
        .subscribe((resp: any) => {
          if (resp) {
            if (resp?.status === "success") {
              this.messageService.add({
                severity: "success",
                detail: resp?.message,
              });
              this.getSlabDetailsById(this.viewingSLabId);
              this.showDialog = false; // Close the dialog
            } else {
              this.messageService.add({
                severity: "error",
                detail: resp?.message,
              });
            }
          }
        });
    }
  }

  getSlabHistoryById(id: any) {
    this.service
      .getSlabHistoryById(this.viewingSLabId)
      .subscribe((resp: any) => {
        if (resp?.data) {
          // Extract individual arrays
          const otherExpenses = resp.data.otherExpenses || [];
          const slabProcessing = resp.data.slabProcessing || [];

          // Merge both arrays into one and add a type indicator
          this.mergedExpenseData = [
            ...otherExpenses.map((expense) => ({
              ...expense,
              type: "Other Expense",
              date: expense.date, // Keep original date
              recipient: expense.recipient,
              amount: expense.amount,
              processorName: null, // Not applicable
              processingCost: null, // Not applicable
            })),
            ...slabProcessing.map((expense) => ({
              ...expense,
              type: "Block/Slab Processing",
              date: expense.processingDate, // Rename to match structure
              recipient: null, // Not applicable
              amount: null, // Not applicable
              processorName: expense.processor?.name || "N/A",
              processingCost: expense.processingCost || 0,
            })),
          ];

          console.log("🔄 Merged Expense Data:", this.mergedExpenseData);
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
    if (!slabSize) return "N/A";

    return slabSize
      .split("x") // Split by "x"
      .map((part) => (part.trim() ? part.trim() : "0")) // Replace empty parts with "0"
      .join(" x "); // Join back with spaces around "x"
  }
}
