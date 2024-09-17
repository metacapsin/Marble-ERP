import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomersdataService } from "../../Customers/customers.service";
import { PaymentInService } from "../payment-in.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Router } from "@angular/router";
import { min } from "rxjs";

@Component({
  selector: "app-payment-in-add",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./payment-in-add.component.html",
  styleUrl: "./payment-in-add.component.scss",
  providers: [MessageService],
})
export class PaymentInAddComponent {
  public routes = routes;
  addPaymentInForm!: FormGroup;
  customerList = [];
  originalCustomerData = [];
  salesDataById = [];
  paymentModeList = [
    {
      paymentMode: "Cash",
    },
    {
      paymentMode: "Online",
    },
  ];
  maxDate = new Date();
  notesRegex = /^(?:.{2,100})$/;
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  noPaymentsAvailable: boolean;

  constructor(
    private customerService: CustomersdataService,
    private Service: PaymentInService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.addPaymentInForm = this.fb.group({
      sales: this.fb.array([]),
      customer: ["", [Validators.required]],
      paymentDate: ["", [Validators.required]],
      taxablePaymentAmount:[''],
      nonTaxablePaymentAmount: [''],
      taxablePaymentMode: [""],
      nonTaxablePaymentMode: [""],
      note: ["", [Validators.pattern(this.notesRegex)]],
    });
  }
  get sales(): FormArray {
    return this.addPaymentInForm.get("sales") as FormArray;
  }

  addSalesControls() {
    this.sales.clear();
    this.salesDataById.forEach((sale) => {
      this.sales.push(
        this.fb.group({
          _id: [sale._id],
          salesInvoiceNumber: [sale.salesInvoiceNumber],
          taxablePaymentAmount: [
            sale.taxablePaymentAmount || '', 
            [
              Validators.required,
              Validators.min(0),
              Validators.max(sale.taxableDue) // Set max value to taxableDue
            ]
          ],
          taxablePaymentMode: [sale.taxablePaymentMode , Validators.required],  
          nonTaxablePaymentAmount: [
            sale.nonTaxablePaymentAmount || '', 
            [
              Validators.required,
              Validators.min(0),
              Validators.max(sale.nonTaxableDue) // Set max value to nonTaxableDue
            ]
          ],
          nonTaxablePaymentMode: [sale.nonTaxablePaymentMode , Validators.required], 
        })
      );
    });
  }


  getSalesControl(index: number): FormGroup {
    return (this.addPaymentInForm.get('sales') as FormArray).controls[index] as FormGroup;
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
  onCustomerSelect(customerId: any) {
    console.log("Customer Id", customerId);

    this.Service.getSalesByCustomerId(customerId).subscribe(
      (resp: any) => {
        if (resp && Array.isArray(resp.data)) {
          this.salesDataById = resp.data;
          console.log("this is data",this.salesDataById)
          if (this.salesDataById.length === 0) {
            this.noPaymentsAvailable = true; // Set flag to true if no payments are found
            console.log("No payments available for this Customer");
            // const message = "No payments available for this Customer";
            //   this.messageService.add({ severity: "warn", detail: message });
          } else {
            this.noPaymentsAvailable = false;
            this.addSalesControls();
            console.log("Payments found", this.salesDataById);
          }
        } else {
          this.salesDataById = [];
          this.noPaymentsAvailable = true; // No data returned, treat as no payments available
          console.log("No payments available or response is invalid");
          const message = "No payments available for this Customer";
          this.messageService.add({ severity: "warn", detail: message });
        }
      },
      (error) => {
        console.error("Error fetching payment data", error);
        this.salesDataById = [];
        this.noPaymentsAvailable = true; // Handle error scenario
        const message = error.message;
        this.messageService.add({ severity: "warn", detail: message });
      }
    );
  }

  addPaymentInFormSubmit() {
    const formData = this.addPaymentInForm.value;
    console.log("Submitted data:", formData);

    const payload = {
      customer: formData.customer,
      sales: formData.sales,
      paymentDate: formData.paymentDate,
      // paymentMode: formData.paymentMode,
      note: formData.note,
    };

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
    } else {
      console.log("invalid form");
    }
  }
}
