import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentInService } from '../payment-in.service';

@Component({
  selector: 'app-payment-in-list',
  standalone: true,
  imports: [CommonModule, SharedModule, TableModule, ButtonModule],
  templateUrl: './payment-in-list.component.html',
  styleUrl: './payment-in-list.component.scss'
})
export class PaymentInListComponent {

  public routes = routes;
  public searchDataValue = '';
  customerList = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  originalData = [];
  visible: boolean = false;
  selectedCategory = [];
  paymentListData = [];

  constructor( private Service: PaymentInService) {

  }

  
  ngOnInit(): void {
  this.getPaymentList();
  
  }

  getPaymentList(){
    this.Service.getPaymentList().subscribe((resp: any) => {
      this.paymentListData = resp.data;
    });
  }


  public searchData(value: any): void {
    // this.categoriesListData = this.originalData.map(i => {
    //   if (i.name.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }
}
