import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-service-location-add',
  templateUrl: './service-location-add.component.html',
  styleUrls: ['./service-location-add.component.scss'],
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
export class ServiceLocationAddComponent {
  public routes = routes;
  ServiceLocationsForm!: FormGroup;
  states: any;

  constructor(
    private service: SettingsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.ServiceLocationsForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      address: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      address2: ['', [Validators.pattern(new RegExp(/^.{1,50}$/))]],
      city: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      state: ['', Validators.required],
      zip: [
        '',
        [
          Validators.required,
          Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/)),
        ],
      ],
      country: [''],
      allowAppointmentReminder: [''],
      includeAddressAppointmentReminder: [''],
      displayLocationOnPracticeScheduling: [''],
      placeServiceCode: ['Default', []],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
          ),
        ],
      ],
      fax: [
        '',
        [
          Validators.pattern(
            new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
          ),
        ],
      ],
    });

    this.service.getStateList().subscribe((resp: any) => {
      this.states = resp.data;
    });
  }

  get f() {
    return this.ServiceLocationsForm.controls;
  }

  ServiceLocationsFormSubmit() {
    if (this.ServiceLocationsForm.valid) {
      this.service
        .CreateServiceLocation(this.ServiceLocationsForm.value)
        .subscribe((resp:any) => {
          if (resp.status === 'success') {
            const message = "Service Location has been added";
            this.messageService.add({ severity: 'success', detail: message });
            setTimeout(() => {
              this.router.navigate(['/settings/service-locations']);
            }, 400);
          } else {
            const message = resp.message
            this.messageService.add({ severity: 'error', detail: message });
          }
        });
    } else {
      console.log('Form is invalid!');
    }
  }
}
