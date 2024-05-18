import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { PurchaseService } from 'src/app/core/purchase/purchase.service';

@Component({
  selector: 'app-purchase-invoice-dialog',
  standalone: true,
  imports: [ RouterModule,CommonModule, TableModule,  DialogModule, ToastModule, TabViewModule],
  templateUrl: './purchase-invoice-dialog.component.html',
  styleUrl: './purchase-invoice-dialog.component.scss'
})
export class PurchaseInvoiceDialogComponent {

  @Input() showPurchaseInvoiceDialog: boolean = false;
  @Input() purchaseDataById: any = [];
  @Output() callbackModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() close = new EventEmitter<any>();


  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    console.log("this is purchase invoice component");
  }

  closeTheWindow() {
    // debugger
    console.log("dialog close")
    this.close.emit();
  }



}


