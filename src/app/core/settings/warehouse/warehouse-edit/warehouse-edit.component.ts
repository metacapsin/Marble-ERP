import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-warehouse-edit',
  templateUrl: './warehouse-edit.component.html',
  styleUrl: './warehouse-edit.component.scss',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    ToastModule],
  providers: [MessageService]
})

export class WarehouseEditComponent {

  public routes = routes;
  warehouseForm!: FormGroup;
  data: any;
  warehouseId: any;

  constructor(
    private service: SettingsService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      address: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      address2: ['', [Validators.pattern(new RegExp(/^.{5,50}$/))]],
      city: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      state: ['', Validators.required,],
      zip: ['', [Validators.required, Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/))]],
      country: [''],
      allowAppointmentReminder: [''],
      includeAddressAppointmentReminder: [''],
      displayLocationOnPracticeScheduling: [''],
      placeServiceCode: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      phone: ['', [Validators.required, Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
      fax: ['', [Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.warehouseId = params['id']
      console.log("user id ", this.warehouseId)
    })
    this.service.getWarehouseById(this.warehouseId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("User Data", this.data)
      this.warehouseForm.patchValue({
        name: this.data.name,
        slug: this.data.slug,
        email: this.data.email,
        showEmail: this.data.showEmail,
        phone: this.data.phone,
        showPhone: this.data.showPhone,
        billingAddress: this.data.billingAddress,
        bankDetails: this.data.bankDetails,

      });

    })

  }


  get f() {
    return this.warehouseForm.controls;
  }

  WarehouseFormSubmit() {
    if (this.warehouseForm.valid) {
      const requestBody = { ...this.warehouseForm.value };
      requestBody.id = this.warehouseId;
      this.service.updateWarehouseById(requestBody).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === 'success') {
            const message = "Warehouse has been updated";
            this.messageService.add({ severity: 'success', detail: message });
            setTimeout(() => {
              this.router.navigate(['/settings/warehouse']);
            }, 400);
          } else {
            const message = resp.message
            this.messageService.add({ severity: 'error', detail: message });
          }
        }
      }, error => {
        console.error("Error occured while updating Warehouse:", error);
      });

    } else {
      console.log('Form is invalid!');
    }
  }

}