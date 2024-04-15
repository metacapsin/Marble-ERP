import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-immunizations-list',
  templateUrl: './immunizations-list.component.html',
  styleUrl: './immunizations-list.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, TabViewModule, DialogModule, RadioButtonModule, DropdownModule, CalendarModule],
})
export class ImmunizationsListComponent {
  immunizationForm : FormGroup;
  addImmunizationsDialog = false;
provider=[{
  label:"", value:""
}]
  status!: string;
  searchDataValue = "";
  selectedProducts = [];
  immunizationList = [
    { immunizationName: 'MMR Vaccine', immunizationadministered: '2023-05-15' },
    { immunizationName: 'Tetanus Vaccine', immunizationadministered: '2023-08-20' },
    { immunizationName: 'Influenza Vaccine', immunizationadministered: '2023-11-10' },
    { immunizationName: 'Hepatitis B Vaccine', immunizationadministered: '2024-02-05' },
    { immunizationName: 'Varicella Vaccine', immunizationadministered: '2024-04-30' },
    { immunizationName: 'Pneumococcal Vaccine', immunizationadministered: '2024-07-22' }
];
settingCategory = ""
routes = routes
currentRoute!: string;
id:any
routerChangeSubscription: Subscription;


constructor(private router: Router,private activeRoute: ActivatedRoute, private fb: FormBuilder){
    this.id = this.activeRoute.snapshot.params['id'];
    this.routerChangeSubscription = this.router.events.subscribe(
      (event) => {
        this.currentRoute = this.router.url
      }
    )

    this.immunizationForm = this.fb.group({
      immunizationType: [''],
  
    })

  }
 
  addImmunizations(){
    this.router.navigate([`/patient/facesheet/${this.id}/immunizations/add-immunization`])
  }

  public searchData(value: any): void {
    // this.problemsList = this.problemsList.map(i => {
    //   if (i.allergyAllergen.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }

  immunizationFormSubmit(){
    if(this.immunizationForm.valid){
      console.log("Form is Valid");
      this.addImmunizationsDialog = false;
    }

  }
}
