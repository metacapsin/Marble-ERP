import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public routes = routes;
  submitted: boolean = false;
  loading: boolean = false;
  error: string = "";
  authForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  });

  constructor(public router: Router, private authService: AuthService, private _snackBar: MatSnackBar) {

  }
  direction() {
    this.router.navigate([routes.login]);
  }

  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.authForm.invalid) {
      this.error = 'Email is not valid !';
      return;
    } else {
      this.authService
        .forgotPassword(this.f['email'].value)
        .subscribe({
          next: (res: any) => {
            if (res) {
              this.router.navigate(['/login']);
              this._snackBar.open("Password has been sent to your email", '', {
                duration: 2000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: "blue",
              });
            } else {
              this.error = 'Invalid Token';
              this._snackBar.open("Invalid Login", '', {
                duration: 2000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: "blue",
              });
            }
          },
          error: (error) => {
            this.error = error.error.message;
            this.submitted = false;
            this.loading = false;
            this._snackBar.open(error.error.message ?? "Error Occured ", '', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: "blue",
            });
          },
        });
    }
  }

}
