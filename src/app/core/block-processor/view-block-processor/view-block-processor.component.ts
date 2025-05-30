import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { blockProcessorService } from "../block-processor.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { MessageService } from "primeng/api";
import { MatDialog } from "@angular/material/dialog";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";
import { CustomersdataService } from "../../Customers/customers.service";
import { SalesReturnService } from "../../sales-return/sales-return.service";
import { SlabsService } from "../../Product/slabs/slabs.service";

@Component({
  selector: "app-view-block-processor",
  standalone: true,
  imports: [SharedModule, PaymentsInvoiceDialogComponent],
  templateUrl: "./view-block-processor.component.html",
  styleUrl: "./view-block-processor.component.scss",
  providers: [MessageService],
})
export class ViewBlockProcessorComponent {
  routes = routes;
  addSlabProcessingForm!: FormGroup;
  editSlabProcessingForm!: FormGroup;
  blockProcessor_id: any;
  slabProcessing_id: any;
  payment_id: any;
  blockProcessorData: any = {};
  slabProcessingPaymentData: any[] = [];
  slabProcessingDataList: any[] = [];
  slabListData: any[] = [];
  paymentInvoicePurchaseDataShowById: any = [];
  addSlabVisible: boolean = false;
  editSlabVisible: boolean = false;
  showDialog: boolean = false;
  modalData: any = {};

  ShowPaymentInvoice: boolean = false;
  paymentObject: any = {};
  header: string = "";
  showDialoge: boolean = false; // to enable delete popup

  maxDate = new Date();
  dueBalance: any;
  openingBalPayList: any;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{2,15})$/;
  balanceId: any;
  totalPaidAmount: number;
  totalDueAmount: number;
  totalProcessingCost: number;
  constructor(
    private customerService: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private salesReturnService: SalesReturnService,
    private blockProcessorService: blockProcessorService,
    private messageService: MessageService,
    private slabService:SlabsService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.addSlabProcessingForm = this.fb.group({
      processingInvoiceNo: ["", [Validators.pattern(this.invoiceRegex)]],
      processor: [""],
      slab: [""],
      processingCost: ["", [Validators.required, Validators.min(1)]],
      processingDate: ["", [Validators.required]],
      note: [""],
    });
    this.editSlabProcessingForm = this.fb.group({
      processingInvoiceNo: ["", [Validators.pattern(this.invoiceRegex)]],
      processor: [""],
      slab: [""],
      processingCost: ["", [Validators.required, Validators.min(1)]],
      processingDate: ["", [Validators.required]],
      note: [""],
    });
    this.blockProcessor_id = this.activeRoute.snapshot.params["id"];
  }
  addSlabProcessing() {
    this.addSlabProcessingForm.reset();
    this.addSlabVisible = true;
  }
  editSlabProcessing(_id: any) {
    this.slabProcessing_id = _id;
    this.blockProcessorService
      .getSlabProcessingById(_id)
      .subscribe((resp: any) => {
        this.editSlabVisible = true;
        this.editSlabProcessingForm.patchValue({
          processor: resp.data.processor,
          slab: resp.data.slab,
          processingDate: resp.data.processingDate,
          processingCost: resp.data.processingCost,
          processingInvoiceNo: resp.data.processingInvoiceNo,
          note: resp.data.note,
        });
      });
  }
  ngOnInit() {
    this.getBlockProcessor();
    this.getOpeningBalance();
    // this.getOpeningBalancePayList();
    this.slabService
      .getSlabsList()
      .subscribe((resp: any) => {
        console.log(resp);
        this.slabListData = resp.data.map((e) => ({
          slabName: e.slabName,
          displayName: `${e.slabNo} (${e.slabName})`,
          _id: {
            _id: e._id,
            slabName: e.slabName,
            slabNo: e.slabNo,
            processingCost: e.processingCost,
          },
        }));
      });
    this.getslabProcessingList();
    this.getPaymentListByProcessorId();
  }
  /**
   * Retrieves the block processor data by its ID.
   * @returns An Observable that emits the block processor data.
   */
  getBlockProcessor() {
    this.blockProcessorService
      .getBlockProcessorDataById(this.blockProcessor_id)
      .subscribe((data: any) => {
        this.blockProcessorData = data;
        console.log(this.blockProcessorData);
      });
  }

  // getTotal(field: string): number {
  //   const sum = this.slabProcessingDataList?.reduce((sum, item) => sum + (item[field] || 0), 0);
  //   return sum + this.dueBalance?.[field === 'processingCost' ? 'totalAmount' : field];
  // }

  // getTotal(field: string): number {
  //   if (field === 'paidAmount') {
  //     return this.totalPaidAmount;
  //   } else if (field === 'dueAmount') {
  //     return this.totalDueAmount;
  //   } else if (field === 'processingCost') {
  //     return this.totalProcessingCost;
  //   }
  //   return 0;
  // }


  getTotal(field: string): number {
    // console.log(`Fetching total for field: ${field}`);
  
    if (field === 'paidAmount') {
      // console.log('Total Paid Amount:', this.totalPaidAmount);
      return this.totalPaidAmount;
    } else if (field === 'dueAmount') {
      // console.log('Total Due Amount:', this.totalDueAmount);
      return this.totalDueAmount;
    } else if (field === 'processingCost') {
      // console.log('Total Processing Cost:', this.totalProcessingCost);
      return this.totalProcessingCost;
    }
  
    // console.warn('Invalid field:', field);
    return 0;
  }

  // getOpeningBalance() {
  //   this.customerService
  //     .GetOpeningBalanceById(this.blockProcessor_id)
  //     .subscribe((data: any) => {
  //       this.dueBalance = data.data;

  //         // Ensure dueBalance is an object, not an array
  //     const openingBalance = this.dueBalance?.[0] || {};
  //       this.slabProcessingDataList = [
  //         {
  //           type: 'openBalance',
  //           processingInvoiceNo: 'Opening Balance',
  //           processingDate: this.dueBalance[0]?.createdOn,
  //           slab: ' Days',
  //           paymentStatus: this.dueBalance[0]?.paymentStatus,
  //           paidAmount: this.dueBalance[0]?.paidAmount,
  //           dueAmount: this.dueBalance[0]?.dueAmount,
  //           processingCost: this.dueBalance[0]?.totalAmount,
  //         },
  //         ...this.slabProcessingDataList, // Keep existing slab data if any
  //       ];
  //          // Update total amounts by adding opening balance values
  //     this.totalPaidAmount += openingBalance.paidAmount || 0;
  //     this.totalDueAmount += openingBalance.dueAmount || 0;
  //     this.totalProcessingCost += openingBalance.totalAmount || 0;
  //     });
  // }

  getOpeningBalance() {
    // console.log('Fetching opening balance for blockProcessor_id:', this.blockProcessor_id);
  
    this.customerService.GetOpeningBalanceById(this.blockProcessor_id).subscribe((data: any) => {
      // console.log('Opening balance API response:', data);
  
      this.dueBalance = data.data;
  
      // Ensure dueBalance is an object, not an array
      const openingBalance = this.dueBalance|| {};
      // console.log('Extracted opening balance:', openingBalance);
  
      this.slabProcessingDataList = [
        {
          type: 'openBalance',
          processingInvoiceNo: 'Opening Balance',
          processingDate: openingBalance.createdOn,
          slab: ' Days',
          paymentStatus: openingBalance.paymentStatus,
          paidAmount: openingBalance.paidAmount,
          dueAmount: openingBalance.dueAmount,
          processingCost: openingBalance.totalAmount,
        },
        ...this.slabProcessingDataList, // Keep existing slab data if any
      ];
  
      // console.log('Updated slabProcessingDataList:', this.slabProcessingDataList);
  
      // Update total amounts by adding opening balance values
      this.totalPaidAmount += openingBalance.paidAmount || 0;
      this.totalDueAmount += openingBalance.dueAmount || 0;
      this.totalProcessingCost += openingBalance.totalAmount || 0;
  
      // console.log('Updated totals - Paid:', this.totalPaidAmount, 'Due:', this.totalDueAmount, 'Processing Cost:', this.totalProcessingCost);
    });
  }

  getOpeningBalancePayList() {
    this.customerService
      .GetOpeningBalancePayListById(this.blockProcessor_id)
      .subscribe((data: any) => {
        this.openingBalPayList = data.data;
        this.slabProcessingPaymentData = [ ...(this.openingBalPayList || []),
    ...(this.slabProcessingPaymentData || []) ]
      });
  }

  // getslabProcessingList() {
  //   this.blockProcessorService
  //     .getAllSlabProcessing(this.blockProcessor_id)
  //     .subscribe((resp: any) => {
  //       // this.slabProcessingDataList = resp.data;
  //       // if(resp.status === 'success'){
  //         this.slabProcessingDataList = resp.data.map((e) => ({
  //           ...e,
  //            displayName: `${e.slab.slabNo} (${e.slab.slabName})`,
  //          }));

  //             // Store the total amounts from this API response
  //       this.totalPaidAmount = resp.totalPaidAmount || 0;
  //       this.totalDueAmount = resp.totalDueAmount || 0;
  //       this.totalProcessingCost = resp.totalAmount || 0;

  //          this.getOpeningBalance();

  //       // }
  //       // else if(resp.status === 'error'){
  //       //   this.slabProcessingDataList = [];
  //       // }
  //       // this.paymentInvoicePurchaseDataShowById = resp.data;
  //     });
  // }

  getslabProcessingList() {
    // console.log('Fetching slab processing list for blockProcessor_id:', this.blockProcessor_id);
  
    this.blockProcessorService.getAllSlabProcessing(this.blockProcessor_id).subscribe((resp: any) => {
      // console.log('Slab processing API response:', resp);
  
      this.slabProcessingDataList = resp.data.map((e) => ({
        ...e,
        displayName: `${e.slab.slabNo} (${e.slab.slabName})`,
      }));
  
      // console.log('Processed slabProcessingDataList:', this.slabProcessingDataList);
  
      // Store the total amounts from this API response
      this.totalPaidAmount = resp.totalPaidAmount || 0;
      this.totalDueAmount = resp.totalDueAmount || 0;
      this.totalProcessingCost = resp.totalAmount || 0;
  
      // console.log('Initial totals from slab processing - Paid:', this.totalPaidAmount, 'Due:', this.totalDueAmount, 'Processing Cost:', this.totalProcessingCost);
  
      this.getOpeningBalance();
    });
  }

  getPaymentListByProcessorId() {
    this.blockProcessorService
      .getPaymentListByProcessorId(this.blockProcessor_id)
      .subscribe((resp: any) => {
        this.slabProcessingPaymentData = resp.data;
        this.getOpeningBalancePayList();
      });
  }
  onSlabSelect(value: any) {
    this.addSlabProcessingForm
      .get("processingCost")
      .patchValue(value.processingCost);
  }

  deletebalance(Id: any) {
    this.balanceId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Slab Processing Details",
    };
    this.showDialog = true;
  }

  deleteSlabProcessing(Id: any) {
    this.slabProcessing_id = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Slab Processing Details",
    };
    this.showDialog = true;
  }
  deletePayment(Id: any, key: any) {
    if (key === "balance") {
      this.balanceId = Id;
    } else {
      this.payment_id = Id;
    }

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details",
    };
    this.showDialog = true;
  }



  callBackModal() {
    if (this.slabProcessing_id) {
      this.blockProcessorService
        .deleteSlabProcessing(this.slabProcessing_id)
        .subscribe((resp) => {
          const message = "Slab Processing Details has been deleted";
          this.getslabProcessingList();
          this.getPaymentListByProcessorId();
          this.messageService.add({ severity: "success", detail: message });
          // this.getOpeningBalance();
          this.slabProcessing_id = null;

          this.showDialog = false;
        });
    }
    if (this.payment_id) {
      this.blockProcessorService
        .deletePayment(this.payment_id)
        .subscribe((resp) => {
          const message = "Payment Details has been deleted";
          this.getslabProcessingList();
          this.getPaymentListByProcessorId();
          this.messageService.add({ severity: "success", detail: message });
          // this.getOpeningBalance();
          this.payment_id = null;

          this.showDialog = false;
        });
    } else if (this.balanceId) {
      this.salesReturnService
        .deleteBalancePayRec(this.balanceId)
        .subscribe((resp: any) => {
          this.getslabProcessingList();
          this.getPaymentListByProcessorId();
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          // this.getOpeningBalance();
          this.showDialog = false;
         
          this.balanceId = null;
        });
    }
  }

  close() {
    this.showDialog = false;
    this.ShowPaymentInvoice = false;
    this.getslabProcessingList();
    this.getPaymentListByProcessorId();
  }

  addSlabProcessingFormSubmit() {
    const payload = {
      processor: {
        _id: this.blockProcessorData._id,
        name: this.blockProcessorData.name,
      },
      slab: this.addSlabProcessingForm.value.slab,
      processingDate: this.addSlabProcessingForm.value.processingDate,
      processingCost: Number(this.addSlabProcessingForm.value.processingCost),
      processingInvoiceNo: this.addSlabProcessingForm.value.processingInvoiceNo,
      note: this.addSlabProcessingForm.value.note,
    };

    if (this.addSlabProcessingForm.valid) {
      this.blockProcessorService
        .addSlabProcessing(payload)
        .subscribe((resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              this.addSlabVisible = false;
              const message = "Slab Processing has been added";
              this.messageService.add({ severity: "success", detail: message });
              this.getslabProcessingList();
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        });
    } else {
      console.log("Form is Invalid");
    }
  }

  editSlabProcessingFormSubmit() {
    const payload = {
      processor: this.editSlabProcessingForm.value.processor,
      slab: this.editSlabProcessingForm.value.slab,
      processingDate: this.editSlabProcessingForm.value.processingDate,
      processingCost: Number(this.editSlabProcessingForm.value.processingCost),
      processingInvoiceNo:
        this.editSlabProcessingForm.value.processingInvoiceNo,
      note: this.editSlabProcessingForm.value.note,
      id: this.slabProcessing_id,
    };

    if (this.editSlabProcessingForm.valid) {
      this.blockProcessorService
        .updateSlabProcessing(payload)
        .subscribe((resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              this.editSlabVisible = false;
              const message = "Slab Processing has been updated";
              this.messageService.add({ severity: "success", detail: message });
              this.getslabProcessingList();
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        });
    } else {
      console.log("Form is Invalid");
    }
  }

  searchData(value: any) {}

  openPaymentDialog(_id: any) {
    this.blockProcessorService
      .getSlabProcessingById(_id)
      .subscribe((resp: any) => {
        this.ShowPaymentInvoice = true;
        this.header = "Slab Processing Payment";
        this.paymentObject = {
          customer: resp.data.processor,
          slabProcessing_id: _id,
          isSlabProcessing: true,
          processingInvoiceNo: resp.data.processingInvoiceNo,
          processingCost: resp.data.processingCost,
          dueAmount: resp.data.dueAmount,
          paidAmount: resp.data.paidAmount,
        };
        this.paymentInvoicePurchaseDataShowById.push({
          customer: resp.data.processor,
          slabProcessing_id: _id,
          isSlabProcessing: true,
          processingInvoiceNo: resp.data.processingInvoiceNo,
          processingCost: resp.data.processingCost,
          dueAmount: resp.data.dueAmount,
          paidAmount: resp.data.paidAmount,
        });
      });
  }

  openeningBalancepopup(Id: any) {
    this.customerService
      .GetOpeningBalanceById(this.blockProcessor_id)
      .subscribe((resp: any) => {
        this.ShowPaymentInvoice = true;
        this.header = "Opening Balance";
        this.paymentObject = {
          customer: resp?.data?.customer,
          salesId: Id,
          customerId: this.blockProcessor_id,
          isSales: true,
          salesInvoiceNumber: "Opening Balance",
          salesTotalAmount: resp?.data?.totalAmount,
          paidAmount: resp?.data?.paidAmount,
          salesDueAmount: resp?.data?.dueAmount,
          salesPaidAmount: resp?.data?.paidAmount,
          taxable: resp?.data?.taxable,
          taxableDue: resp?.data?.taxableDue,
          nonTaxable: resp?.data?.nonTaxable,
          nonTaxableDue: resp?.data?.nonTaxableDue,
        };
        this.paymentInvoicePurchaseDataShowById.push({
          customer: resp.data.processor,
          slabProcessing_id: Id,
          isSlabProcessing: true,
          processingInvoiceNo: resp.data.processingInvoiceNo,
          processingCost: resp.data.processingCost,
          dueAmount: resp.data.dueAmount,
          paidAmount: resp.data.paidAmount,
        });
        console.log("this is api response on payment dialog open ", resp?.data);
      });
  }
}
