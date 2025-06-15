import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
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
import { ConfirmDialogComponent } from "src/app/common-component/modals/confirm-dialog/confirm-dialog.component";
import { Table } from 'primeng/table';
import { dashboardService } from "src/app/core/dashboard/dashboard.service";
import { CategoriesService } from "src/app/core/settings/categories/categories.service";
import { SubCategoriesService } from "src/app/core/settings/sub-categories/sub-categories.service";

interface SlabInfo {
  _id: string;
  slabNo: string;
  slabName: string;
}

interface SlabDetail {
  slabInfo: SlabInfo;
}

interface SlabMedia {
  type: 'image' | 'video' | 'no-media';
  url: string;
}

@Component({
  selector: "app-list-slabs",
  standalone: true,
  imports: [SharedModule, PaginatorModule, InvoiceDialogComponent],
  providers: [MessageService],
  templateUrl: "./list-slabs.component.html",
  styleUrl: "./list-slabs.component.scss",
})
export class ListSlabsComponent implements OnInit {
  @ViewChild('dt') dt: Table;
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
  stockType: string = 'live'; // Default value
  stockTypeOptions = [
    { label: 'Live Stock', value: 'live', icon: 'fa-solid fa-circle text-success' },
    { label: 'Sold Stock', value: 'sold', icon: 'fa-solid fa-circle text-secondary' }
  ];
  selectedCategory: any;
  selectedSubCategory: any;
  categoryData: any[] = [];
  subCategoryData: any[] = [];

  // Static media for demonstration
  private staticMedia: { [key: string]: SlabMedia[] } = {
    'default': [
      { type: 'image', url: 'assets/img/slabs/slab1.jpg' },
      { type: 'image', url: 'assets/img/slabs/slab2.jpg' },
      { type: 'video', url: 'assets/videos/slab1.mp4' }
    ]
  };

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private service: SlabsService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private warehouseService: WarehouseService,
    private blockProcessorService: blockProcessorService,
    private SalesService: SalesService,
    private http: HttpClient,
    private datefilter: dashboardService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService
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
  

  // saveExpenses() {
  //   for (const expense of this.expenses) {
  //     if (!expense.expenseType) {
  //       alert('Please select an expense type.');
  //       return;
  //     }
  //     if (expense.expenseType === 'Other Expense' && (!expense.recipient || !expense.date || !expense.amount)) {
  //       alert('Please fill all fields for Other Expense.');
  //       return;
  //     }
  //     if (expense.expenseType === 'Block/Slab Processing' && (!expense.processingDate || !expense.processingCost || !expense.blockProcessor._id)) {
  //       alert('Please fill all fields for Block/Slab Processing.');
  //       return;
  //     }
  //   }

  //   const filteredExpenses = this.expenses.map(expense => {
  //     if (expense.expenseType === 'Other Expense') {
  //       return {
  //         expenseType: expense.expenseType,
  //         recipient: expense.recipient,
  //         date: expense.date,
  //         amount: expense.amount
  //       };
  //     } else if (expense.expenseType === 'Block/Slab Processing') {
  //       return {
  //         expenseType: expense.expenseType,
  //         processingDate: expense.processingDate,
  //         processingCost: expense.processingCost,
  //         blockProcessor: { _id: expense.blockProcessor._id }
  //       };
  //     }
  //     return {};
  //   });

  //   this.service.updateSlabExpense({ expenses: filteredExpenses }).subscribe(
  //     (response) => {
  //       console.log('Expenses updated successfully', response);
  //       alert('Expenses saved successfully!');
  //     },
  //     (error) => {
  //       console.error('Error updating expenses', error);
  //       alert('Failed to save expenses.');
  //     }
  //   );
  // }

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
    this.getWarehouseList();
    this.getCategories();
    this.getAllSubCategories();
    this.blockProcessorService.getAllBlockProcessorData().subscribe((data) => {
      this.blockProcessorList = data as { _id: string; name: string }[];
    });
    this.warehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseData = resp.data.map((element) => ({
        name: element.name,
        _id: element._id
      }));
    });
  }

  isViewsystemtyp = [
    { code: "Card", value: "Card View" },
    { code: "Table", value: "Table View" },
  ];

  onSearchInput(event: any) {
    const searchValue = event.target.value.toLowerCase();
    
    if (!searchValue) {
      this.allSlabsDaTa = [...this.originalData];
    } else {
      this.allSlabsDaTa = this.originalData.filter(item => {
        return (
          (item.slabName?.toLowerCase().includes(searchValue)) ||
          (item.slabNo?.toLowerCase().includes(searchValue)) ||
          (item.categoryDetail?.name?.toLowerCase().includes(searchValue)) ||
          (item.subCategoryDetail?.name?.toLowerCase().includes(searchValue)) ||
          (item.warehouseDetails?.name?.toLowerCase().includes(searchValue)) ||
          (item.totalSQFT?.toString().includes(searchValue)) ||
          (item.costPerSQFT?.toString().includes(searchValue)) ||
          (item.sellingPricePerSQFT?.toString().includes(searchValue))
        );
      });
    }

    // Update total available stock based on filtered data
    this.totalSqFtLeft = this.allSlabsDaTa.reduce((sum, slab) => sum + (slab.totalSQFT || 0), 0);
    
    // Reset pagination
    this.currentPage = 0;
    this.totalRecords = this.allSlabsDaTa.length;
    this.updatePagedData();
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
      const otherExpenses = resp.data.SlabExpense || [];
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
    this.warehouseDropDown = value;
    this.applyFilters();
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
          const otherExpenses = resp.data.SlabExpense || [];
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

  // closeDialog() {
  //   this.formVisible = true; // Show form when dialog is reopened
  //   this.canAddExpense = true; // Ensure "Add Expense" button is visible

  //   this.expenses = []; // Reset expenses
  //   this.showDialog = false;
  // }

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
      .split("x")
      .map((part) => {
        const num = parseFloat(part.trim());
        if (isNaN(num)) return "0";
        return num.toFixed(2);
      })
      .join(" x "); 
  }
  
  getSlabMedia(slab: any): any[] {
    // Return a simple no-media placeholder
    return [{
      type: 'no-media',
      url: ''
    },
    {
      type: 'no-media',
      url: ''
    },
    {
      type: 'no-media',
      url: ''
    },
    {
      type: 'no-media',
      url: ''
    },
    {
      type: 'no-media',
      url: ''
    }
  ];
  }

  getWarehouseList() {
    this.warehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseData = resp.data.map((element: any) => ({
        name: element.name,
        _id: element._id
      }));
    });
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryData = resp.data.map((element: any) => ({
        name: element.name,
        _id: element._id
      }));
    });
  }

  getAllSubCategories() {
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryData = resp.data.map((element: any) => ({
        name: element.name,
        _id: element._id
      }));
    });
  }

  onCategoryChange(value: any): void {
    this.selectedCategory = value;
    if (value) {
      // Filter subcategories based on selected category
      this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
        this.subCategoryData = resp.data
          .filter((element: any) => element.categoryId._id === value)
          .map((element: any) => ({
            name: element.name,
            _id: element._id
          }));
      });
    } else {
      // If no category selected, show all subcategories
      this.getAllSubCategories();
    }
    this.selectedSubCategory = null;
    this.applyFilters();
  }

  onSubCategoryChange(value: any): void {
    this.selectedSubCategory = value;
    this.applyFilters();
  }

  applyFilters() {
    let filteredData = [...this.originalData];
    console.log('filteredData', filteredData)
    console.log('warehouseDropDown', this.warehouseDropDown)
    console.log('selectedCategory', this.selectedCategory)
    console.log('selectedSubCategory', this.selectedSubCategory)

    // Apply warehouse filter
    if (this.warehouseDropDown) {
      filteredData = filteredData.filter(item => 
        item.warehouseDetails && item.warehouseDetails._id === this.warehouseDropDown
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filteredData = filteredData.filter(item => 
        item.categoryDetail && item.categoryDetail._id === this.selectedCategory
      );
    }

    // Apply subcategory filter
    if (this.selectedSubCategory) {
      filteredData = filteredData.filter(item => 
        item.subCategoryDetail && item.subCategoryDetail._id === this.selectedSubCategory
      );
    }

    // Apply stock type filter
    if (this.stockType === 'sold') {
      filteredData = filteredData.filter(item => item.totalSQFT === 0);
    } else {
      filteredData = filteredData.filter(item => item.totalSQFT > 0);
    }

    // Update the total available stock based on filtered data
    this.totalSqFtLeft = filteredData.reduce((sum, slab) => sum + (slab.totalSQFT || 0), 0);

    // Update the data and pagination
    this.allSlabsDaTa = filteredData;
    this.totalRecords = filteredData.length;
    this.currentPage = 0; // Reset to first page when filters change
    this.updatePagedData();
  }

  resetFilters() {
    // Reset all filter values
    this.warehouseDropDown = null;
    this.selectedCategory = null;
    this.selectedSubCategory = null;
    this.stockType = 'live';
    
    // Clear search input if it exists
    const searchInput = document.querySelector('input[placeholder="Enter Key Word here"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }

    // Reset data to original state
    this.allSlabsDaTa = [...this.originalData];
    
    // Update total available stock
    this.totalSqFtLeft = this.allSlabsDaTa.reduce((sum, slab) => sum + (slab.totalSQFT || 0), 0);
    
    // Reset pagination
    this.currentPage = 0;
    this.totalRecords = this.allSlabsDaTa.length;
    this.updatePagedData();

    // Reload all subcategories
    this.getAllSubCategories();
  }

  exportSlabsToCSV() {
    if (!this.allSlabsDaTa || this.allSlabsDaTa.length === 0) {
        console.warn("No data to export.");
        return;
    }

    const header = [
        "Slab Name",
        "Slab Number",
        "Category",
        "Sub Category",
        "Size",
        "Available Stock (Sq. Feet)",
        "Initial Stock (Sq. Feet)",
        "Cost/Sq. Feet",
        "Selling Price/Sq. Feet",
        "Warehouse",
        "Stock Entry Date",
        "Thickness (MM)",
        "No of Pieces",
        "Purchase Cost",
        "Transportation Charges",
        "Other Charges",
        "Processing Fee",
        "Processing Cost",
        "Total Slab Cost",
        "Notes"
    ].join(',');

    const rows = this.allSlabsDaTa.map(item => {
        const slabSize = this.formatSlabSize(item.slabSize); // Assuming formatSlabSize exists in your component
        return [
            `"${item.slabName || ''}"`,
            `"${item.slabNo || ''}"`,
            `"${item.categoryDetail?.name || ''}"`,
            `"${item.subCategoryDetail?.name || ''}"`,
            `"${slabSize || ''}"`,
            `"${item.totalSQFT || 0}"`,
            `"${item.totalSlabSQFT || 0}"`,
            `"${item.costPerSQFT || 0}"`,
            `"${item.sellingPricePerSQFT || 0}"`,
            `"${item.warehouseDetails?.name || ''}"`,
            `"${item.date ? new Date(item.date).toLocaleDateString() : ''}"`,
            `"${item.thickness || ''}"`,
            `"${item.noOfPieces || ''}"`,
            `"${item.purchaseCost || 0}"`,
            `"${item.transportationCharges || 0}"`,
            `"${item.otherCharges || 0}"`,
            `"${item.processingFee || 0}"`,
            `"${item.processingCost || 0}"`,
            `"${item.totalSlabCost || 0}"`,
            `"${item.notes || ''}"`
        ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'slabs_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }
}
