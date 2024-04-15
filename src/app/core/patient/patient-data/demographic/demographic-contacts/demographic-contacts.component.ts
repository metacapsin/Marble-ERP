import { Component } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-demographic-contacts',
  standalone: true,
  imports: [RadioButtonModule,FormsModule,SharedModule],
  templateUrl: './demographic-contacts.component.html',
  styleUrl: './demographic-contacts.component.scss'
})
export class DemographicContactsComponent {
  ResponsibleParty!:string;
  EmergencyContact!:string;
  handleClick(){  
    console.log(this.ResponsibleParty,this.EmergencyContact);
  }
}