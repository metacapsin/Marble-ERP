import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { validationRegex } from 'src/app/core/validation';
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
    password: new FormControl('', [Validators.required, Validators.pattern(validationRegex.passwordRegex)]),
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

  onSubmit() {
    this.submitted = true;
    
    if (this.authForm.invalid) {
      // Display validation errors
      Object.keys(this.authForm.controls).forEach(key => {
        const control = this.authForm.get(key);
        if (control && control.invalid) {
          const errors = control.errors;
          if (errors) {
            Object.keys(errors).forEach(errorKey => {
              let errorMessage = '';
              switch (errorKey) {
                case 'required':
                  errorMessage = 'Password is required.';
                  break;
                case 'pattern':
                  errorMessage = 'Password must contain 8-16 characters and at least one number, one uppercase letter, ' +
                                 'one lowercase letter, and one special character.';
                  break;
                default:
                  errorMessage = 'Invalid password.';
              }
              this.messageService.add({ severity: "error", detail: errorMessage });
            });
          }
        }
      });
      return;
    }
    
    this.loading = true;
    this.authService
      .resetPassword(this.authForm.value.password!, this.token)
      .subscribe({
        next: (res: any) => {
          if (res.status !== 'error') {
            this.router.navigate(['/login']);
            this.messageService.add({ severity: "success", detail: res.message });
          } else {
            this.error = 'Invalid Token';
            this.messageService.add({ severity: "error", detail: res.message });
          }
        },
        error: (error) => {
          this.error = error.error.message || "An error occurred";
          this.messageService.add({ severity: "error", detail: this.error });
          this.loading = false;
        },
      });
  }
}
