import { Component } from "@angular/core";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DropdownModule } from "primeng/dropdown";
@Component({
  selector: "app-add-taxes",
  templateUrl: "./add-taxes.component.html",
  styleUrl: "./add-taxes.component.scss",
  standalone: true,
  imports: [ SharedModule],
})
export class AddTaxesComponent {
  addTaxesForm!: FormGroup;
  taxesTypes = [{ value: "Single" }, { value: "Multiple" }];
  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddTaxesComponent>
  ) {
    this.addTaxesForm = this.fb.group({
      name: ["", [Validators.required]],
      taxRate: ["", [Validators.required, Validators.min(1), Validators.max(99)]],
    });
  }
  addTaxesFormSubmit() {
    if (this.addTaxesForm.valid) {
      this.dialogRef.close(this.addTaxesForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
