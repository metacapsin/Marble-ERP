import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomersdataService } from "../../Customers/customers.service";
import { PaymentOutService } from "../payment-out.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Router } from "@angular/router";
import { min } from "rxjs";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { PurchaseService } from "../../purchase/purchase.service";

@Component({
  selector: "app-payment-in-add",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./payment-out-add.component.html",
  styleUrl: "./payment-out-add.component.scss",
  providers: [MessageService],
})
export class PaymentOutAddComponent {
  public routes = routes;
  addPaymentOutForm!: FormGroup;
  SuppliersList = [];
  originalSuppliersData = [];
  maxDate = new Date();
  selectedCustomer: any;
  purchaseDataById = [];
  paymentModeList = [
    {
      paymentMode: "Cash",
    },
    {
      paymentMode: "Online",
    },
  ];

  notesRegex = /^(?:.{2,100})$/;
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  constructor(
    private SuppliersService: SuppliersdataService,
    private PurchaseService: PurchaseService,
    private Service: PaymentOutService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.addPaymentOutForm = this.fb.group({
      purchase: this.fb.array([]),
      supplier: ["", [Validators.required]],
      paymentDate: ["", [Validators.required]],
      paymentMode: ["", [Validators.required]],
      note: ["", [Validators.pattern(this.notesRegex)]],
    });
  }

  get purchase(): FormArray {
    return this.addPaymentOutForm.get('purchase') as FormArray;
  }
  addpurchaseControls() {
    this.purchase.clear();
    this.purchaseDataById?.forEach((purchase) => {
      this.purchase.push(
        this.fb.group({
          _id: [purchase._id],
          amount: ["", [Validators.required, Validators.min(1), Validators.max(purchase.dueAmount)]],
        })
      );
    });
  }

  // enableSaveButton(id, value){
  //   this.purchaseDataById?.forEach((purchase) => {
  //     console.log(this.purchaseDataById);
  //     if(id != purchase._id && value){
  //     this.purchase.push(
  //       this.fb.group({
  //         _id: [purchase._id],
  //         amount: ["", [Validators.min(0), Validators.max(purchase.dueAmount)]],
  //       })
  //     );
  //   }
  //   });
  // }

  ngOnInit(): void {
    this.SuppliersService.GetSupplierData().subscribe((resp: any) => {
      this.originalSuppliersData = resp;
      console.log("sfnsn", this.originalSuppliersData);
      this.SuppliersList = [];
      this.originalSuppliersData.forEach((element) => {
        this.SuppliersList.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
  }
  onSuppliersSelect(customerId: any) {
    console.log("hrlk adnns", customerId);
    this.PurchaseService.getPendingPurchaseBySupplierId(customerId).subscribe((resp: any) => {
      this.purchaseDataById = resp.data;
      this.addpurchaseControls();
      console.log(this.purchaseDataById);
    });
  }

  addPaymentOutFormSubmit() {
    const formData = this.addPaymentOutForm.value;
    console.log("Submitted data:", formData);

    const payload = {
      supplier: formData.supplier,
      purchase: formData.purchase,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      note: formData.note
    };
    console.log(payload);

    if (this.addPaymentOutForm.valid) {
      console.log("valid form");

      this.Service.createPayment(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Payment has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/payment-out"]);
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
