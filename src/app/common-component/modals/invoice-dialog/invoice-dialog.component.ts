import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { CommonModule } from "@angular/common";

import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";

import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { SalesService } from "src/app/core/sales/sales.service";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "src/app/shared/shared.module";
import { UsersdataService } from "src/app/core/users/services/usersdata.service";
import { AuthService } from "src/app/shared/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { PurchaseService } from "src/app/core/purchase/purchase.service";
import { RouterModule } from "@angular/router";
import { QuotationsService } from "src/app/core/quotations/quotations.service";
import { MessageService } from "primeng/api";
import { SlabsService } from "src/app/core/Product/slabs/slabs.service";
import { TooltipModule } from "primeng/tooltip";
import { FileUploadService } from "src/app/shared/components/file-upload/file-upload.service";
import { environment } from "src/environments/environment";
import { SafePipe } from "src/app/shared/pipes/safe.pipe";

@Component({
  selector: "app-invoice-dialog",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TableModule,
    DialogModule,
    ToastModule,
    TabViewModule,
    ButtonModule,
    SharedModule,
    TooltipModule,
    ButtonModule,
    SafePipe
  ],
  templateUrl: "./invoice-dialog.component.html",
  styleUrl: "./invoice-dialog.component.scss",
  providers: [MessageService],
})
export class InvoiceDialogComponent implements OnInit {
  @Input() showInvoiceDialog: boolean;
  @Input() salesDataById: any;
  @Input() header: any = [];
  @Input() paymentDataListById: any = [];
  @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  lotID: string;
  public lotVisible: boolean = false;
  blockDatabyLotId: any = [];

  sellerData: any;
  displayFilePreviewDialog: boolean = false;
  previewFileUrl: string = '';
  previewFileName: string = '';
  previewFileType: string = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private userData: AuthService,
    private salesService: SalesService,
    private purchaseService: PurchaseService,
    private quotationService: QuotationsService,
    private http: HttpClient,
    private messageService: MessageService,
    private SlabsService: SlabsService,
    private fileUploadService: FileUploadService
  ) {}
  ngOnInit() {
    this.userData.getUserProfile().subscribe((user: any) => {
      this.sellerData = user.data;
      console.log("THis is buyer data on invoice", this.sellerData);
    });

    console.log("this.salesDataById", this.salesDataById);
  }
  closeTheWindow() {
    // console.log("dialog close")
    this.close.emit();
  }
  clickMe() {
    console.log('salesDataById',this.salesDataById);
  }

// Add this method to resolve the error
getRemainingTaxRates(taxArray: any[]): string {
  if (!taxArray || taxArray.length <= 1) {
    return 'No Additional Tax Rates';
  }
  return taxArray.slice(1).map(tax => `${tax.taxRate}%`).join(', ');
}


  downloadTaxInvoice(id: any, invoice: any) {
    if (!id) {
      console.error("No ID provided for download");
      return;
    }
    this.salesService.getTaxinvoice(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Sales-Invoice ${invoice}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        const message = error.message;
        this.messageService.add({ severity: "warn", detail: message });
      }
    );
  }

  downloadFullInvoice(id: any, invoiceNumber: any) {
    if (!id) {
      console.error("No ID provided for download");
      return;
    }

    this.salesService.getFullInvoice(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Sales-Invoice ${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        const message = error.message;
        this.messageService.add({ severity: "warn", detail: message });
      }
    );
  }

  downloadSalesFile(id: any, invoiceNumber: any) {
    console.log("Invoice number", invoiceNumber);
    if (!id) {
      console.error("No ID provided for download");
      return;
    }

    this.salesService.getTaxinvoice(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Sales-Invoice ${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        const message = error.message;
        this.messageService.add({ severity: "warn", detail: message });
      }
    );
  }

  showLotDetails(_id: any) {
    this.lotID = "";
    this.SlabsService.getBlockDetailByLotId(_id).subscribe((resp: any) => {
      this.lotVisible = true;
      this.blockDatabyLotId = resp.data.blockDetails;
      this.lotID = _id;
    });
  }
  downloadQuotationFile(id: any, invoiceNumber: string) {
    console.log("Invoice number", invoiceNumber);

    if (!id) {
      console.error("No ID provided for download");
      return;
    }

    this.quotationService.downloadQuotationInvoice(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Quotation-Invoice ${invoiceNumber}.pdf`; // Adjust the file name and extension as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        const message = error.message;
        this.messageService.add({ severity: "warn", detail: message });
      }
    );
  }

  onConfirm() {
    this.callbackModal.emit();
  }
  print() {
    window.print();
  }

  viewAttachment(attachment: any) {
    this.fileUploadService.downloadFile(attachment.path, attachment.name).subscribe(
      (blob: Blob) => {
        // Create a new blob with the correct MIME type
        const fileType = this.getFileType(attachment.name);
        const mimeType = fileType === 'pdf' ? 'application/pdf' : blob.type;
        const newBlob = new Blob([blob], { type: mimeType });
        
        const fileUrl = window.URL.createObjectURL(newBlob);
        this.previewFileName = attachment.name;
        this.previewFileUrl = fileUrl;
        this.previewFileType = fileType;
        this.displayFilePreviewDialog = true;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load file'
        });
      }
    );
  }

  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    }
    return 'other';
  }

  closeFilePreview() {
    this.displayFilePreviewDialog = false;
    if (this.previewFileUrl) {
      window.URL.revokeObjectURL(this.previewFileUrl);
      this.previewFileUrl = '';
    }
  }

  downloadPreviewFile() {
    if (this.previewFileUrl) {
      const link = document.createElement('a');
      link.href = this.previewFileUrl;
      link.download = this.previewFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// salesDataById
