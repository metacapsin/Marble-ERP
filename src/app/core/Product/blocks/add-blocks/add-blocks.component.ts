import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService, SelectItem } from "primeng/api";
import { BlocksService } from "../blocks.service";

interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[];
}

@Component({
  selector: 'app-add-blocks',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-blocks.component.html',
  styleUrl: './add-blocks.component.scss'
})
export class AddBlocksComponent {

  public routes = routes;
  blocksAddForm!: FormGroup;
  
  lotNoList: any = [];
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15)$/;
  vehicleNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private service: BlocksService,

  ) {
    this.blocksAddForm = this.fb.group({
      lotNo: ["", [Validators.required ]],
      blocksNo: ["", [Validators.required ,Validators.pattern(this.shortNameRegex)]],
      processingCharge: ["", [Validators.required ,Validators.min(0)]],
      height: ["", [Validators.required,Validators.min(0)]],
      width: ["", [Validators.required, Validators.min(0)]],
      length: ["", [Validators.required, Validators.min(0)]],
      totalTransportation: ["", [Validators.required, Validators.min(0)]],
    });
  }
  get f() {
    return this.blocksAddForm.controls;
  }
  ngOnInit(): void {

   
  }
  BlocksAddFormSubmit() {
    console.log(this.blocksAddForm.value);
    if (this.blocksAddForm.valid) {
      this.service
        .CreateBlocks(this.blocksAddForm.value)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Blocks has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/blocks/"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        });
    } else {
      console.log("Form is invalid!");
    }
  }
}