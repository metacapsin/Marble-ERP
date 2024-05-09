import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService, SelectItem } from "primeng/api";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BlocksService } from "../blocks.service";

@Component({
  selector: 'app-edit-blocks',
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
  templateUrl: './edit-blocks.component.html',
  styleUrl: './edit-blocks.component.scss'
})
export class EditBlocksComponent {


  public routes = routes;
  blocksEditForm!: FormGroup;
  data: any;
  blocksId: any;

  lotNoList: any = [];
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15)$/;
  vehicleNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private service: BlocksService
  ) {
    this.blocksEditForm = this.fb.group({
      lotNo: ["", [Validators.required ]],
      blocksNo: ["", [Validators.required ,Validators.pattern(this.shortNameRegex)]],
      processingCharge: ["", [Validators.required ,Validators.min(0)]],
      height: ["", [Validators.required,Validators.min(0)]],
      width: ["", [Validators.required, Validators.min(0)]],
      length: ["", [Validators.required, Validators.min(0)]],
      totalTransportation: ["", [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.blocksId = params["id"];
      console.log("Blocks id ", this.blocksId);
    });

    this.service.getBlocksById(this.blocksId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("Blocks Data", this.data);
      this.blocksEditForm.patchValue({
        lotNo: this.data.lotNo,
        blocksNo: this.data.blocksNo,
        processingCharge: this.data.processingCharge,
        height: this.data.height,
        width: this.data.width,
        length: this.data.length,
        totalTransportation: this.data.totalTransportation,
      });
    });
  }
  get f() {
    return this.blocksEditForm.controls;
  }

  BlocksEditFormSubmit() {
    console.log(this.blocksEditForm.value);
    if (this.blocksEditForm.valid) {
      const requestBody = this.blocksEditForm.value;
      requestBody.id = this.blocksId;
      this.service.updateBlocksById(requestBody).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              const message = "Blocks has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/blocks/"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        },
        (error) => {
          console.error("Error occured while updating Blocks:", error);
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
