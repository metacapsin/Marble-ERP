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

@Component({
  selector: 'app-edit-block-processor',
  standalone: true,
  imports: [
    RouterModule,
    DropdownModule,
    CommonModule,
    SharedModule,
    ToastModule,
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

  personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^.{3,500}$/s;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: FormBuilder,
    private Service: blockProcessorService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.editBlockProcessorForm = this.fb.group({
      companyName: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNo: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      address: ["", [Validators.pattern(this.shortNameRegex)]],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getblockProcessor();
  }
  getblockProcessor() {
    this.Service.getBlockProcessorDataById(this.id).subscribe((data: any) => {
      this.blockProcessorData = data;
      console.log(this.blockProcessorData);
      this.patchForm();
    });
  }
  patchForm() {
    this.editBlockProcessorForm.patchValue({
      companyName: this.blockProcessorData.name,
      phoneNo: this.blockProcessorData.phoneNo,
      email: this.blockProcessorData.email,
      status: true,
      address: this.blockProcessorData.address,
    });
  }
  editBlockProcessorFormSubmit() {

    const payload = {
      id: this.id,
      name: this.editBlockProcessorForm.value.companyName,
      phoneNo: this.editBlockProcessorForm.value.phoneNo,
      email: this.editBlockProcessorForm.value.email,
      status: this.editBlockProcessorForm.value.status,
      address: this.editBlockProcessorForm.value.address,
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
              this.router.navigate(["/block-processor"]);
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
