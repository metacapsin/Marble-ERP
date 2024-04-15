import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderNowFormComponent } from '../cumponents/order-now-form/order-now-form.component';
import { AdministerNewFormComponent } from '../cumponents/administer-new-form/administer-new-form.component';
import { AddHistoricalFormComponent } from '../cumponents/add-historical-form/add-historical-form.component';
import { NotAdministeredFormComponent } from '../cumponents/not-administered-form/not-administered-form.component';

@Component({
  selector: 'app-add-immunizations',
  templateUrl: './add-immunizations.component.html',
  styleUrl: './add-immunizations.component.scss',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    RadioButtonModule,
    OrderNowFormComponent,
    AdministerNewFormComponent,
    AddHistoricalFormComponent,
    NotAdministeredFormComponent
  ],
})
export class AddImmunizationsComponent {
  selectedOption: string = "orderNow";
}
