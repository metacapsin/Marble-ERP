import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersdataService } from '../usersdata.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'primeng/api';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { routes } from 'src/app/shared/routes/routes';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    DropdownModule,
    CheckboxModule
  ],
  providers:[MessageService]
})
export class EditUserComponent implements OnInit {
  public routes = routes;
  id = '';
  EditUserData: any;
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
  ]

  ngOnInit(): void {
    this.UserEditData.GetUserDataByID(this.id).subscribe((resp: any) => {
      this.EditUserData = resp.data;
      this.patchForm();
    });
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private UserEditData: UsersdataService,
    private form: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    this.id = this.activeRoute.snapshot.params['id'];
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
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
      NPI: ['', [Validators.pattern(/^\d{10}$/)]],
      ProviderSelect: ['',],
      SpecialtySelect: [''],
      SystemAdminCheckBox: [''],
      ClinicalAssistantCheckBox: [''],
      ProviderRole: [''],
      isUserLocked: ['']
    });
  }
  patchForm() {
    this.ProviderGroup.patchValue({
      TaxonomyCode: this.EditUserData[0].taxonomyCode,
      FirstName: this.EditUserData[0].firstName,
      MiddleName: this.EditUserData[0].middleName,
      LastName: this.EditUserData[0].lastName,
      NPI: this.EditUserData[0].npi,
      ssn: this.EditUserData[0].ssn,
      Email: this.EditUserData[0].email,
      PhoneNumber: this.EditUserData[0].phoneNumber,
      Password: null,
      ProviderSelect: this.EditUserData[0].providerType,
      SpecialtySelect: this.EditUserData[0].speciality,
      SystemAdminCheckBox: this.EditUserData[0].role.indexOf('admin') != -1 ? true : false,
      ClinicalAssistantCheckBox: this.EditUserData[0].role.indexOf('help-desk') > -1 ? true : false,
      ProviderRole: this.EditUserData[0].role.indexOf('provider') > -1 ? true : false,
      isUserLocked: this.EditUserData[0].isUserLocked ? true : false,
    });
  }


  ProviderForm() {
    const formData = this.ProviderGroup.value;
    const _roles = [];
    if (formData.SystemAdminCheckBox) {
      _roles.push('admin')
    } if (formData.ProviderRole) {
      _roles.push('provider')
    } if (formData.ClinicalAssistantCheckBox) {
      _roles.push('help-desk')
    }
    const payload = {
      id: this.id,
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
      isUserLocked: formData.isUserLocked
    };
    console.log(payload);

    if (this.ProviderGroup.value) {
      this.UserEditData.UpDateUserApi(this.id, payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === 'success') {
            const message = "User has been updated";
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
    } else {
      console.log('Form is invalid!');
    }
  }
}