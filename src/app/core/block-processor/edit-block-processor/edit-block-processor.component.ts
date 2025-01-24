import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { SharedModule } from "src/app/shared/shared.module";
import { blockCustomersDataService } from "../../processing/block-customer/block-customer.service";
import { blockProcessorService } from "../block-processor.service";
import { validationRegex } from "../../validation";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: 'app-edit-block-processor',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './edit-block-processor.component.html',
  styleUrl: './edit-block-processor.component.scss',
  providers: [MessageService],
})
export class EditBlockProcessorComponent {
  editBlockProcessorForm: FormGroup;
  routes = routes;
  blockProcessorData: any;
  id: any;

  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;
  taxNumberRegex = /^[A-Za-z0-9]{15}$/;
  emailRegex: string = "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;
  phoneRegex = /^[0-9]{10}$/;
  returnUrl: any;
  constructor(
    private fb: FormBuilder,
    private Service: blockProcessorService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.editBlockProcessorForm = this.fb.group({
      companyName: ["", [Validators.required, Validators.pattern(validationRegex.companyNameRGEX)]],
      phoneNo: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      address: ["", [Validators.pattern(this.billingAddressRegex)]],
      openingBalance: [0],
      balanceType: ["Pay"],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getblockProcessor();
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    console.log(this.returnUrl);
  }
  getblockProcessor() {
    this.Service.getBlockProcessorDataById(this.id).subscribe((data: any) => {
      this.blockProcessorData = data;
      console.log(this.blockProcessorData);
      this.patchForm();
    });
  }
  onCancel(){
    this.router.navigateByUrl(this.returnUrl);
  }
  patchForm() {
    this.editBlockProcessorForm.patchValue({
      companyName: this.blockProcessorData.name,
      phoneNo: this.blockProcessorData.phoneNo,
      email: this.blockProcessorData.email,
      status: true,
      address: this.blockProcessorData.address,
      openingBalance : this.blockProcessorData.openingBalance,
    });
  }
  editBlockProcessorFormSubmit() {

    const payload = {
      _id: this.id,
      name: this.editBlockProcessorForm.value.companyName,
      phoneNo: this.editBlockProcessorForm.value.phoneNo,
      email: this.editBlockProcessorForm.value.email,
      status: this.editBlockProcessorForm.value.status,
      address: this.editBlockProcessorForm.value.address,
      openingBalance:Number(this.editBlockProcessorForm.value.openingBalance),
    };
    if (this.editBlockProcessorForm.valid) {
      this.Service.updateBlockProcessorData(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Form is invalid!");
    }
  }
}
