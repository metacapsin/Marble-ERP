import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomersdataService } from '../../Customers/customers.service';
import { PaymentInService } from '../payment-in.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-in-add',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, ToastModule],
  templateUrl: './payment-in-add.component.html',
  styleUrl: './payment-in-add.component.scss',
  providers: [MessageService]
})
export class PaymentInAddComponent {
  public routes = routes
  addPaymentInForm! : FormGroup;
  customerList= [];
  selectedCustomer: any;
  salesDataById = [];
  salesId: any;

  paymentModeList = [{
    paymentMode: 'Cash'
  },
{
  paymentMode:'Online'
}];


  constructor( 
    private customerService: CustomersdataService,
    private Service: PaymentInService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ){
    this.addPaymentInForm = this.fb.group({
      // customer: [''],
      salesId: [''],
      paymentDate: [''],
      paymentMode: [''],
      amount: [''],
      note: [''],
    })

  }


  ngOnInit(): void {
    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;
      // console.log("customer", this.customerList);
    });
  
  }

  getsalesByID(){
    this.Service.getSalesById(this.salesId).subscribe((resp:any) => {
      this.salesDataById = resp;
    })
  }


  addPaymentInFormSubmit(){
    const formData = this.addPaymentInForm.value;

    const payload = {
      // salesId: formData.salesId,
      salesId: "662cfc22cc15af9cf64a922c",
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      amount: formData.amount,
      note: formData.note
    }

    
    if (this.addPaymentInForm.valid) {
      console.log("valid form");

      this.Service.createPayment(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Payment has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/payment-in"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
    else {
      console.log("invalid form");

    }

  }

}
