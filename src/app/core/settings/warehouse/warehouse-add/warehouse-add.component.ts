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
  selector: 'app-warehouse-add',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
  ToastModule],
  providers: [MessageService],
  templateUrl: './warehouse-add.component.html',
  styleUrl: './warehouse-add.component.scss'
})
export class WarehouseAddComponent {

  public routes = routes;
  warehouseForm!: FormGroup;
  states: any;

  constructor(
    private service: SettingsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.warehouseForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      slug: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))],
      ],
      showEmail:[],
      showPhone:[],
      billingAddress:[
        '',
        [Validators.required, Validators.pattern(new RegExp(/^^\s*(\w+\s+){10,100}\w+.*$/))
      ],
      ],
      bankDetails:[ '',
      [Validators.required, Validators.pattern(new RegExp(/^[A-Za-z0-9\s-]+$/))
    ],],
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
      TnC: [
       '"1. Goods once sold will not be taken back or exchanged" "  2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only"',
        [
          Validators.pattern(
            new RegExp(/^.{10,500}$/)
          ),
        ],
      ],
    });

    this.service.getStateList().subscribe((resp: any) => {
      this.states = resp.data;
    });
  }

  get f() {
    return this.warehouseForm.controls;
  }

  WarehouseFormSubmit() {
    if (this.warehouseForm.valid) {
      this.service
        .CreateWarehouse(this.warehouseForm.value)
        .subscribe((resp:any) => {
          if (resp.status === 'success') {
            const message = "Warehouse has been added";
            this.messageService.add({ severity: 'success', detail: message });
            setTimeout(() => {
              this.router.navigate(['/settings/warehouse']);
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