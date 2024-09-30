import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-change-password2',
  templateUrl: './change-password2.component.html',
  styleUrls: ['./change-password2.component.scss'],
  providers:[MessageService]
})
export class ChangePassword2Component {
  public routes = routes;
  submitted: boolean = false;
  loading: boolean = false;
  error: string = "";
  token:string = "";
  authForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern( /[!$%^()_+*<>#@]/)]),
  });

  constructor(public router: Router, private authService: AuthService, private messageService: MessageService, public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
  });
  }
  direction() {
    this.router.navigate([routes.login]);
  }

  get f() {
    return this.authForm.controls;
  }

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.authForm.invalid) {
  //     return;
  //   }
  //   this.loading = true;
  //   if (this.authForm.invalid) {
  //     this.error = 'Email is not valid !';
  //     this._snackBar.open(this.error, '', {
  //       duration: 2000,
  //       verticalPosition: 'top',
  //       horizontalPosition: 'right',
  //       panelClass: "blue",
  //     });
  //     return;
  //   } else {
  //     this.authService
  //       .resetPassword(this.f['password'].value, this.token)
  //       .subscribe({
  //         next: (res: any) => {
  //           if (res.status !== 'error') {
  //             this.router.navigate(['/login']);
  //             this._snackBar.open("Password has been sent to your email", '', {
  //               duration: 2000,
  //               verticalPosition: 'top',
  //               horizontalPosition: 'right',
  //               panelClass: "blue",
  //             });
  //           } else {
  //             this.error = 'Invalid Token';
  //             this._snackBar.open(res.message, '', {
  //               duration: 2000,
  //               verticalPosition: 'top',
  //               horizontalPosition: 'right',
  //               panelClass: "blue",
  //             });
  //           }
  //         },
  //         error: (error) => {
  //           this.error = error.error.message;
  //           this.submitted = false;
  //           this.loading = false;
  //           this._snackBar.open(error.error.message ?? "Error Occured ", '', {
  //             duration: 2000,
  //             verticalPosition: 'top',
  //             horizontalPosition: 'right',
  //             panelClass: "blue",
  //           });
  //         },
  //       });
  //   }
  // }

  onSubmit(){
    
    if (this.authForm.value.password === "") {
      this.error = 'Password is required!';
      const message= this.error
        this.messageService.add({ severity: "warn", detail: message });
      return;
    } else {
      this.authService
        .resetPassword(this.authForm.value.password, this.token)
        .subscribe({
          next: (res: any) => {
            if (res.status !== 'error') {
              this.router.navigate(['/login']);
              const message= res.message
            this.messageService.add({ severity: "warn", detail: message });
            } else {
              this.error = 'Invalid Token';
              const message= res.message
              console.log(message)
            this.messageService.add({ severity: "warn", detail: message });
            }
          },
          error: (error) => {
            const message= error.message
            this.messageService.add({ severity: "warn", detail: message });
          },
        });
    }
    
  }
}
