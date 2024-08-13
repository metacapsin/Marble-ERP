import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { routes } from "src/app/shared/routes/routes";
import { blockProcessorService } from "../block-processor.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { PurchaseService } from "../../purchase/purchase.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogComponent } from "src/app/common-component/modals/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";

@Component({
  selector: "app-view-block-processor",
  standalone: true,
  imports: [
    SharedModule,
    ConfirmDialogComponent,
    PaymentsInvoiceDialogComponent,
  ],
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
  paymentInvoicePurchaseDataShowById = [];
  addSlabVisible: boolean = false;
  editSlabVisible: boolean = false;
  showDialog: boolean = false;
  modalData: any = {};

  ShowPaymentInvoice: boolean = false;
  paymentObject: any = {};
  header: string = "";
  showDialoge: boolean = false; // to enable delete popup

  maxDate = new Date();

  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{2,15})$/;

  constructor(
    private activeRoute: ActivatedRoute,
    private blockProcessorService: blockProcessorService,
    private messageService: MessageService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.addSlabProcessingForm = this.fb.group({
      processingInvoiceNo: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
      ],
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
    this.blockProcessorService
      .getSlabsByProcessorId(this.blockProcessor_id)
      .subscribe((resp: any) => {
        this.slabListData = resp.data.map((e) => ({
          slabName: e.slabName,
          _id: {
            _id: e._id,
            slabName: e.slabName,
            slabNo: e.slabNo,
            processingCost: e.processingCost,
          },
        }));
      });
    this.getslabProcessingList();
    this.getslabProcessingPeymentList();
  }
  getBlockProcessor() {
    this.blockProcessorService
      .getBlockProcessorDataById(this.blockProcessor_id)
      .subscribe((data: any) => {
        this.blockProcessorData = data;
        console.log(this.blockProcessorData);
      });
  }
  getslabProcessingList() {
    this.blockProcessorService
      .getAllSlabProcessing(this.blockProcessor_id)
      .subscribe((resp: any) => {
        this.slabProcessingDataList = resp.data;
        // this.paymentInvoicePurchaseDataShowById = resp.data;
      });
  }
  getslabProcessingPeymentList() {
    this.blockProcessorService
      .getPaymentList(this.blockProcessor_id)
      .subscribe((resp: any) => {
        this.slabProcessingPaymentData = resp.data;
      });
  }
  onSlabSelect(value: any) {
    this.addSlabProcessingForm
      .get("processingCost")
      .patchValue(value.processingCost);
  }

  deleteSlabProcessing(Id: any) {
    this.slabProcessing_id = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Slab Processing Details",
    };
    this.showDialog = true;
  }
  deletePayment(Id: any) {
    this.payment_id = Id;
    console.log(
      "Block Processor Payment Delete Dialog triggred and this is its id",
      Id
    );

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details",
    };
    this.showDialog = true;
  }
  // showNewDialog() {
  //   this.showDialog = true;
  // }

  callBackModal() {
    if (this.slabProcessing_id) {
      this.blockProcessorService
        .deleteSlabProcessing(this.slabProcessing_id)
        .subscribe((resp) => {
          const message = "Slab Processing Details has been deleted";
          this.messageService.add({ severity: "success", detail: message });
          this.getslabProcessingList();
          this.getslabProcessingPeymentList();
          console.log("Block Processor deleted")

          this.showDialog = false;
        });
    } else if (this.payment_id) {
      this.blockProcessorService
        .deletePayment(this.payment_id)
        .subscribe((resp) => {
          const message = "Payment Details has been deleted";
          this.messageService.add({ severity: "success", detail: message });
          this.getslabProcessingList();
          this.getslabProcessingPeymentList();
          console.log("Block Processor Payment deleted")

          this.showDialog = false;
        });
    }
  }

  close() {
    this.showDialog = false;
    this.ShowPaymentInvoice = false;

    this.getslabProcessingList();
    this.getslabProcessingPeymentList();
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
        this.header = "Slab Processing Payment ";
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
        // console.log("this is user data on popup dialog of payment invoice",this.salesDataShowById);
      });
  }
}
