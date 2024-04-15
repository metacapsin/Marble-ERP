import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AESEncryptDecryptService } from 'src/app/shared/auth/AESEncryptDecryptService ';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public passwordClass = false;
  submitted: boolean = false;
  error: string = "";
  loading: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('admin@123', [Validators.required]),
  });


  get f() {
    return this.form.controls;
  }

  constructor(public auth: AuthService, private router: Router, private _snackBar: MatSnackBar, private crypto: AESEncryptDecryptService) { }
  ngOnInit(): void {
    if (localStorage.getItem('authenticated')) {
      localStorage.removeItem('authenticated');
      localStorage.removeItem("token");
    }
  }

  loginFormSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.loading = true;

      this.auth
        .login(this.f.email?.value, this.f.password?.value)
        .subscribe({
          next: (res: any) => {
            if (res) {
              this.crypto.setToken(res.token)
              this.auth.getUserProfile().subscribe((user: any) => {
                this.crypto.setData("currentUser", user.data);
                this.loading = false;
                this.router.navigate([routes.adminDashboard]);
              })
            } else {
              this.error = 'Invalid Login';
              this._snackBar.open("Credentials are not matched", '', {
                duration: 2000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: "blue",
              });
            }
          },
          error: (error) => {
            this.loading = false;
            this._snackBar.open(error, '', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: "blue",
            });
          },
        });
    }
  }
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
