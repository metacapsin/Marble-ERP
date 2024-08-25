import { Component } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SettingsService } from "src/app/shared/data/settings.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { AuthService } from "src/app/shared/auth/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-practice-list",
  templateUrl: "./practice-list.component.html",
  styleUrls: ["./practice-list.component.scss"],
  standalone: true,
  imports: [SharedModule],
})
export class PracticeListComponent {
  public routes = routes;
  changePasswordForm: FormGroup;
  data: any = null;
  Editdata: any = null;
  loading = false;
  searchDataValue = "";
  userData: any;
  warehouseName: any;
  changePasswordVisible: boolean = false;
  passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private service: SettingsService,
    public auth: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ["", [Validators.required]],
      newPassword: [
        "",
        [Validators.required, Validators.pattern(this.passwordRegex)],
      ],
      confirmNewPassword: [
        "",
        [Validators.required, Validators.pattern(this.passwordRegex)],
      ],
    });
    this.changePasswordForm
      .get("confirmNewPassword")
      ?.valueChanges.subscribe(() => {
        this.checkPasswords();
      });
  }
  checkPasswords() {
    const newPassword = this.changePasswordForm.get("newPassword")?.value;
    const confirmNewPasswordControl =
      this.changePasswordForm.get("confirmNewPassword");

    // Clear custom errors first, but retain other errors
    // Clear custom errors first, but retain other errors
    if (confirmNewPasswordControl?.errors && !confirmNewPasswordControl.errors['passwordMismatch']) {
      confirmNewPasswordControl.setErrors(confirmNewPasswordControl.errors);
  }

  // Check if confirmNewPassword field has a value
  if (confirmNewPasswordControl?.value) {
      // Add password mismatch error if passwords don't match
      if (newPassword !== confirmNewPasswordControl.value) {
          confirmNewPasswordControl.setErrors({
              ...confirmNewPasswordControl.errors,
              passwordMismatch: true,
          });
      } else {
          // If passwords match, clear the passwordMismatch error
          if (confirmNewPasswordControl.errors) {
              const { passwordMismatch, ...otherErrors } = confirmNewPasswordControl.errors;
              confirmNewPasswordControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
          }
      }
  } else {
      // If no value is present in confirmNewPassword, only keep existing non-passwordMismatch errors
      if (confirmNewPasswordControl.errors?.['passwordMismatch']) {
          const { passwordMismatch, ...otherErrors } = confirmNewPasswordControl.errors;
          confirmNewPasswordControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
  }
  }
  isNameArray(data: any): boolean {
    return Array.isArray(data.name);
  }

  ngOnInit(): void {
    this.auth.getUserProfile().subscribe((user: any) => {
      this.userData = user.data;
      if (this.userData?.warehouse && Array.isArray(this.userData.warehouse)) {
        this.warehouseName = this.userData.warehouse
          .map((wh) => wh.name)
          .join(", ");
      }
    });
  }

  changePassword() {
    this.changePasswordForm.reset();
    this.changePasswordVisible = true;
  }
  changePasswordFormSubmit() {
    if (this.changePasswordForm.valid) {
      const payload = {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        confirmNewPassword: this.changePasswordForm.value.confirmNewPassword,
      };
      this.auth.changePassword(payload).subscribe((resp: any) => {
        console.log("resp", resp);
        if (resp.status === "success") {
          const message = resp.message;
          this.messageService.add({ severity: "success", detail: message });
          this.changePasswordVisible = false;
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    } else {
      console.log("invalid form");
    }
  }
}
