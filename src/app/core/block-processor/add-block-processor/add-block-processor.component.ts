import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
@Component({
  selector: 'app-add-block-processor',
  standalone: true,
  imports: [
    SharedModule, 
  ],
  templateUrl: './add-block-processor.component.html',
  styleUrl: './add-block-processor.component.scss',
  providers: [MessageService],
})
export class AddBlockProcessorComponent implements OnInit{
  addBlockProcessorForm: FormGroup;
  public routes = routes;
  returnUrl: any;
  personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  phoneRegex = /^[0-9]{10}$/;
  descriptionRegex = /^.{3,500}$/s;  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: blockProcessorService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.addBlockProcessorForm = this.fb.group({
      companyName: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNo: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      address: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }
  ngOnInit(): void {
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    console.log(this.returnUrl);
  }
  addBlockProcessorFormSubmit() {
    const payload = {
      name: this.addBlockProcessorForm.value.companyName, 
      email: this.addBlockProcessorForm.value.email, 
      status: true, 
      phoneNo: this.addBlockProcessorForm.value.phoneNo,
      address: this.addBlockProcessorForm.value.address,
    };
    
    if (this.addBlockProcessorForm.valid) {
      this.Service.creatBlockProcessor(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Block Processor has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
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
