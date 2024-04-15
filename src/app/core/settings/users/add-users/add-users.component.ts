import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersdataService } from '../usersdata.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { routes } from 'src/app/shared/routes/routes';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-add-users',
  standalone: true,
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
  imports: [
    SharedModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    DropdownModule,
    ToastModule,
    CheckboxModule
  ],
  providers: [MessageService]
})
export class AddUsersComponent {
  public routes = routes;
  ProviderGroup: UntypedFormGroup;
  providerSpeciality = [
    { label: 'Acupuncture', value: 'Acupuncture' },
    { label: 'Allergy/Immunology', value: 'Allergy/Immunology' },
    { label: 'Alternative Medicine', value: 'Alternative Medicine' },
    { label: 'Ambulance', value: 'Ambulance' },
    { label: 'Anesthesiology', value: 'Anesthesiology' },
    { label: 'Audiology', value: 'Audiology' },
    { label: 'Bariatric Surgery', value: 'Bariatric Surgery' },
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Chiropractic', value: 'Chiropractic' },
    { label: 'Dentists', value: 'Dentists' },
    { label: 'Dermatology', value: 'Dermatology' },
    { label: 'Diagnostic Radiology', value: 'Diagnostic Radiology' },
    { label: 'DME', value: 'DME' },
    { label: 'Emergency Medicine', value: 'Emergency Medicine' },
    { label: 'Endocrinology', value: 'Endocrinology' },
    { label: 'Family Medicine & GP', value: 'Family Medicine & GP' },
    { label: 'Gastroenterology', value: 'Gastroenterology' },
    { label: 'Genetics', value: 'Genetics' },
    { label: 'Geriatric', value: 'Geriatric' },
    { label: 'Hematology', value: 'Hematology' },
    { label: 'Home Health', value: 'Home Health' },
    { label: 'Hospitalist', value: 'Hospitalist' },
    { label: 'Infectious Disease', value: 'Infectious Disease' },
    { label: 'Internal Medicine', value: 'Internal Medicine' },
    { label: 'IT Consultant', value: 'IT Consultant' },
    { label: 'Laboratory', value: 'Laboratory' },
    { label: 'Medical Genetics', value: 'Medical Genetics' },
    { label: 'Mental Health', value: 'Mental Health' },
    { label: 'Nephrology', value: 'Nephrology' },
    { label: 'Not Classified', value: 'Not Classified' },
    { label: 'Nurse Practitioner', value: 'Nurse Practitioner' },
    { label: 'Nursing Home', value: 'Nursing Home' },
    { label: 'Nutritionist', value: 'Nutritionist' },
    { label: 'Obstetrics/Gynecology', value: 'Obstetrics/Gynecology' },
    { label: 'Occupational Therapy', value: 'Occupational Therapy' },
    { label: 'Oncology', value: 'Oncology' },
    { label: 'Ophthalmology', value: 'Ophthalmology' },
    { label: 'Optometry', value: 'Optometry' },
    { label: 'Orthopedic', value: 'Orthopedic' },
    { label: 'Osteopathic Medicine', value: 'Osteopathic Medicine' },
    { label: 'Other', value: 'Other' },
    { label: 'Otolaryngology', value: 'Otolaryngology' },
    { label: 'Pain Medicine', value: 'Pain Medicine' },
    { label: 'Palliative Medicine', value: 'Palliative Medicine' },
    { label: 'Pathology', value: 'Pathology' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'Physical Medicine and Rehabilitation (MD)', value: 'Physical Medicine and Rehabilitation (MD)' },
    { label: 'Physical Therapy', value: 'Physical Therapy' },
    { label: 'Plastic & Reconstructive Surgery', value: 'Plastic & Reconstructive Surgery' },
    { label: 'Podiatry', value: 'Podiatry' },
    { label: 'Preventive Medicine', value: 'Preventive Medicine' },
    { label: 'Psychiatry & Neurology', value: 'Psychiatry & Neurology' },
    { label: 'Psychologist', value: 'Psychologist' },
    { label: 'Pulmonary Disease', value: 'Pulmonary Disease' },
    { label: 'Radiation Oncology', value: 'Radiation Oncology' },
    { label: 'Respiratory Therapist', value: 'Respiratory Therapist' },
    { label: 'Rheumatology', value: 'Rheumatology' },
    { label: 'Sleep Medicine', value: 'Sleep Medicine' },
    { label: 'Social Work/Counselor/Behavior Health', value: 'Social Work/Counselor/Behavior Health' },
    { label: 'Speech Language Pathology', value: 'Speech Language Pathology' },
    { label: 'Student/Academic Institution', value: 'Student/Academic Institution' },
    { label: 'Surgery (any)', value: 'Surgery (any)' },
    { label: 'Thoracic Surgery', value: 'Thoracic Surgery' },
    { label: 'Urgent Care', value: 'Urgent Care' },
    { label: 'Urology', value: 'Urology' },
    { label: 'Vascular Surgery', value: 'Vascular Surgery' },
    { label: 'Wound Care', value: 'Wound Care' }
  ];
  providerType = [
    {label: "Orthopedics", value: "Orthopedics"},
    {label: "Radiology", value: "Radiology"},
    {label: "Dentist", value: "Dentist"}
  ];
  public passwordClass = false;
  

  constructor(
    private fb: UntypedFormBuilder,
    private Addusersdata: UsersdataService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    
    this.ProviderGroup = this.fb.group({
      TaxonomyCode:['', [Validators.pattern(new RegExp(/^\d{10}$/))]],
      FirstName: ['', 
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
    ],
      MiddleName: ['', 
        [Validators.pattern(new RegExp(/^.{1,50}$/))],
    ],
      LastName: ['', 
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
    ],
      ssn: ['', [Validators.pattern(new RegExp(/^\d{9}$/))]],
      Email: ['', [Validators.required,Validators.email]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
      Password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16), Validators.pattern( /[!$%^()_+*<>#@]/)]],
      NPI: ['', [Validators.pattern(/^\d{10}$/)]],
      ProviderSelect: [''],
      SpecialtySelect: [''],
      SystemAdminCheckBox:[''],
      ClinicalAssistantCheckBox:[''],
      ProviderRole:[''],
    });
  }


  ProviderForm() {
    const formData = this.ProviderGroup.value;
    const _roles = [];
    if(formData.SystemAdminCheckBox){
      _roles.push('admin')
    } if(formData.ProviderRole){
      _roles.push('provider')
    }  if(formData.ClinicalAssistantCheckBox){
      _roles.push('help-desk')
    }
    const payload = {
      firstName: formData.FirstName,
      middleName: formData.MiddleName,
      lastName: formData.LastName,
      email: formData.Email,
      phoneNo: formData.PhoneNumber,
      password: formData.Password,
      role: _roles,
      taxonomyCode: formData.TaxonomyCode,
      providerType: formData.ProviderSelect,
      speciality: formData.SpecialtySelect,
      ssn: formData.ssn,
      npi: formData.NPI,
    };

    console.log(payload);
    this.Addusersdata.AddUserdata(payload).subscribe((resp:any) => {
      if (resp) {
        if (resp.status === 'success') {
          const message = "User has been added";
          this.messageService.add({ severity: 'success', detail: message });
          setTimeout(() => {
            this.router.navigate(['settings/users'])
          }, 400);
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      }
    });
  }
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}