import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomersdataService } from '../../Customers/customers.service';
import { PaymentInService } from '../payment-in.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { min } from 'rxjs';

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
  originalCustomerData= [];
  
  selectedCustomer: any;
  salesDataById = [];
  paymentModeList = [{
    paymentMode: 'Cash'
  },
{
  paymentMode:'Online'
}];

notesRegex = /^(?:.{2,100})$/;
nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  constructor( 
    private customerService: CustomersdataService,
    private Service: PaymentInService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ){
    this.addPaymentInForm = this.fb.group({
      sales: this.fb.array([]),
      customer: ['',[Validators.required]],
      paymentDate: ['',[Validators.required]],
      paymentMode: ['',[Validators.required]],
      note: ['',[Validators.pattern(this.notesRegex)]],
    });
    
  }
  addSalesControls() {
    const salesArray = this.addPaymentInForm.get('sales') as FormArray;
    this.salesDataById?.forEach(sale => {
      salesArray.push(this.fb.group({
        _id: [sale._id],
        amount: ["", [Validators.required,Validators.min(0)]]
      }));
    });
  }
  

  ngOnInit(): void {
    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      this.customerList = [];
      this.originalCustomerData.forEach((element) => {
        this.customerList.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
  }
  onCustomerSelect(customerId: any){
   
    this.Service.getSalesByCustomerId(customerId).subscribe((resp:any) => {
      this.salesDataById = resp.data;
      // console.log("sales Data by id ",this.salesDataById);
      this.addSalesControls();
    });
    
  }


  addPaymentInFormSubmit(){
    const formData = this.addPaymentInForm.value;
    console.log('Submitted data:', formData);

    const payload = {
      customer: formData.customer,
      sales: formData.sales,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
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
