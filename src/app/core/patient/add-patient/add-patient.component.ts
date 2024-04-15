import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
interface data {
  value: string ;
}
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent {
  states: any;
  public routes = routes;
  public selectedValue! : string  ;


  PatientFrom:UntypedFormGroup
  constructor(private fv:UntypedFormBuilder,private AddPatientAip:SettingsService,private router: Router,private _snackBar: MatSnackBar,){
    this.PatientFrom = this.fv.group({
      // firstName:['',[Validators.required]],
      // middleName:[''],
      // lastName:['',[Validators.required]],
      // dob:['',[Validators.required]],
      // sex:[''],
      // phone:['', [Validators.required, Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
      // email:['',[Validators.required,Validators.email]],
      // address1:['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      // address2: [''],
      // aptSuite: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      // state:[''],
      // city:['',[Validators.required]],
      // zipCode: ['', [Validators.required, Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/))]],
      // ssn:['', [Validators.pattern(new RegExp(/^\d{9}$/))]],
      // isVisitngFirstTime:[''],
      // medicalID:['',[Validators.required]]
      firstName:['',[Validators.required]],
      middleName:[''],
      lastName:['',[Validators.required]],
      dob:['',[Validators.required]],
      sex:['male'],
      phone:['',[Validators.required, Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
      email:['',[Validators.required,Validators.email]],
      address1:['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      address2: [''],
      aptSuite: ['',[Validators.required]],
      state:[''],
      city:['',[Validators.required]],
      zipCode: ['',[Validators.required, Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/))]],
      ssn:['',[Validators.required,Validators.pattern(new RegExp(/^\d{9}$/))]],
      isVisitngFirstTime:[true],
      medicalID:['',[]]
    })
    this.AddPatientAip.getStateList().subscribe((resp: any) => {
      this.states = resp.data;
    });
  }


  PatientFromSubmit(){
    console.log(this.PatientFrom.value);
    this.AddPatientAip.patientCreateApi(this.PatientFrom.value).subscribe((resp) => {
      console.log(resp);
      if(resp){
        this.router.navigate(['/patient/patients-list'])
        const message = "Patient Information has been Created!"
        this._snackBar.open(message, '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'blue',
        });
      }
    })
  }
}
