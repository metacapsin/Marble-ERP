import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { SharedModule } from "src/app/shared/shared.module";
import { blockCustomersDataService } from "../../processing/block-customer/block-customer.service";
import { blockProcessorService } from "../block-processor.service";
@Component({
  selector: 'app-add-block-processor',
  standalone: true,
  imports: [
    RouterModule,
    DropdownModule,
    CommonModule,
    SharedModule, 
    ToastModule
  ],
  templateUrl: './add-block-processor.component.html',
  styleUrl: './add-block-processor.component.scss',
  providers: [MessageService],
})
export class AddBlockProcessorComponent {
  addBlockProcessorForm: FormGroup;
  public routes = routes;

  personNameRegex = /^(?! )[A-Za-z]{3,50}(?: [A-Za-z]{3,50})?$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: blockProcessorService,
    private router: Router,
  ) {
    this.addBlockProcessorForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNo: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      taxNo: ["", [Validators.pattern(this.shortNameRegex)]],
      // openingBalance: ["", [Validators.min(0)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(120)]],
      creditLimit: ["", [Validators.min(0), Validators.max(5000000)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
    });
  }

  addBlockProcessorFormSubmit() {
    const payload = {
      name: this.addBlockProcessorForm.value.name, 
      email: this.addBlockProcessorForm.value.email, 
      status: true, 
      phoneNo: this.addBlockProcessorForm.value.phoneNo,
      taxNo: this.addBlockProcessorForm.value.taxNo,
      creditPeriod: this.addBlockProcessorForm.value.creditPeriod,
      creditLimit: this.addBlockProcessorForm.value.creditLimit,
      billingAddress: this.addBlockProcessorForm.value.billingAddress,
      shippingAddress: this.addBlockProcessorForm.value.shippingAddress,
      openingBalance: this.addBlockProcessorForm.value.openingBalance,
    };
    
    if (this.addBlockProcessorForm.valid) {
      console.log("form is valid",payload);
      // debugger
      this.Service.creatBlockProcessor(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Block Processor has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/block-processor"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  }
}
