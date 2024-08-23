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
  setError:boolean = false;
  setEmailError:boolean = false;
  authForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
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
    if(this.f.email.errors?.['required'] && this.f.email.touched){
      this.setError = true;
    }
    if(this.f.email.errors?.['email'] && this.f.email.touched){
      this.setError = false;
      this.setEmailError = true;
      console.log("object");
    }
    if (this.authForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.authForm.invalid) {
      this.error = 'Email is not valid !';
      return;
    } else {
      this.setError = false;
      this.setEmailError = false;
      console.log(this.f['email'].value);
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
            this.error = error.message;
            this.submitted = false;
            this.loading = false;
            this._snackBar.open(error.message ?? "No account found with the given email.", '', {
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
