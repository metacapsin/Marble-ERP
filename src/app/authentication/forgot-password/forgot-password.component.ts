import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/shared/auth/auth.service";
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {
  public routes = routes;
  submitted: boolean = false;
  loading: boolean = false;
  error: string = "";
  setError: boolean = false;
  setEmailError: boolean = false;
  authForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"),
    ]),
  });

  constructor(
    public router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}
  direction() {
    this.router.navigate([routes.login]);
  }

  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    const email = this.f["email"].value;

    if (!email) {
      console.error("Email is required");
      return;
    }

    this.authService.forgotPassword(email).subscribe(
      (resp: any) => {
        console.log("Password reset email sent successfully:", resp);
        // const message = "Password has been sent to your email";
        this.messageService.add({ severity: "success", detail: "Password reset email sent to your email successfully" }); 
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2000);
      },
      (error: any) => {
        console.error("An error occurred:", error);
        if (error.status === 401) {
          console.error("Unauthorized access. Please check your credentials.");
          alert("You are not authorized. Please check your credentials.");
          // No navigation to login page
        } else if (error.status === 400) {
          console.error("Bad request:", error.error.message);
          // Handle bad request (e.g., validation issues)
        } else {
          this.router.navigate(["/forgot-password"]);
          setTimeout(() => {
            this.messageService.add({
              severity: "error",
              detail: "Email does not exist",
            });
          }, 500);
          console.error("Unexpected error:", error.message || error);
          // alert("Something went wrong. Please try again later.");
        }
      }
    );
  }

  // onSubmit() {
  // this.submitted = true;
  // if (this.f.email.errors?.["required"] && this.f.email.touched) {
  //   this.setError = true;
  // }
  // if (this.f.email.errors?.["email"] && this.f.email.touched) {
  //   this.setError = false;
  //   this.setEmailError = true;
  //   console.log("object");
  // }
  // if (this.authForm.invalid) {
  //   return;
  // }
  // this.loading = true;
  // if (this.authForm.invalid) {
  //   this.error = "Email is not valid !";
  //   return;
  // } else {
  //   this.setError = false;
  //   this.setEmailError = false;
  //   console.log(this.f["email"].value);
  //   this.authService.forgotPassword(this.f["email"].value).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       if (res) {
  //         const message = "Password has been sent to your email";
  //         this.messageService.add({ severity: "success", detail: message }); // Use MessageService
  //         // setTimeout(() => {
  //         //   this.router.navigate(["/login"]);
  //         // }, 2000);
  //       } else {
  //         this.error = "Invalid Token";
  //         const message = "Invalid Login";
  //         this.messageService.add({ severity: "error", detail: message }); // Use MessageService
  //       }
  //     },
  //     error: (error) => {
  //       this.error = error.message;
  //       this.submitted = false;
  //       this.loading = false;
  //       const message =
  //         error.message ?? "No account found with the given email.";
  //       setTimeout(() => {
  //         this.messageService.add({ severity: "error", detail: message }); // Use MessageService
  //       }, 2000);
  //       console.log(message)
  //     },
  //   });
  // }
  // }
}
