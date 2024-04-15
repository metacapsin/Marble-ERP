import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { UsersdataService } from 'src/app/core/users/services/usersdata.service';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-providers-profile-edit',
  templateUrl: './providers-profile-edit.component.html',
  styleUrls: ['./providers-profile-edit.component.scss'],
  standalone: true,
  imports:[CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ButtonModule,
  ToastModule,
DropdownModule],
  providers: [MessageService]
})
export class ProvidersProfileEditComponent implements OnInit {
  public routes = routes;
  ProviderProfileEditForm!: FormGroup;
  data: any;
  id: any;
  providerData: any;
  AssociataionForm!: FormGroup;
  providerPrefix=[
    { label: 'Choose a Prefix', value: 'Choose a Prefix' },
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Ms.', value: 'Ms.' },
    { label: 'Dr.', value: 'Dr.' },
  ]
  providerSuffix=[
    { label: 'Choose a Suffix', value: 'Choose a Suffix' },
    { label: 'Jr.', value: 'Jr.' },
    { label: 'Sr.', value: 'Sr.' },
    { label: 'II', value: 'II' },
    { label: 'III', value: 'III' },
    { label: 'IV', value: 'IV' },
  ]
  
  
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
  
  // Regex for validations
  websiteRegex = /^((https?:\/\/)?(www\.)?(google|twitter|facebook)\.(com|in|edu|org|net|gov|io|xyz))(\/[^\s]*)?$/  ;
  customWebRegex =/^(https?:\/\/)?([\da-z.-]+)\.(com|edu|org|net|gov|io|xyz|in)([/\w.-]*)*\/?$/  ;

   languageRegex = /^[a-zA-Z\s'-]+$/;
   addressRegex = /^(?=(?:\S+\s*){1,100}$)[\w\s,'.-]+$/;
   currentYear = new Date().getFullYear();
   yearRegex = new RegExp(`^(19[5-9]\\d|20[0-${this.currentYear.toString().slice(2)}]\\d|20${this.currentYear.toString().slice(2)}[0-${this.currentYear.toString().slice(3)}])$`);



  
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: SettingsService,
    private userService: UsersdataService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
    ) {
      this.ProviderProfileEditForm = this.fb.group({
        prefix: ['Mr.', [Validators.required]],
      profileUrl:['',[]],
      suffix: ['Jr.', [Validators.required]],
      firstName: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      gender: ['male',[Validators.required]],
      npi: ['', [Validators.pattern(/^\d{10}$/)]], // USA License format (10 digits)
      speciality: [
        '',
        [Validators.required],
      ],
      practicingYear: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(50)]],
      google: ['www.google.com', [Validators.pattern(this.websiteRegex)]],
      twitter: ['www.twitter.com', [Validators.pattern(this.websiteRegex)]],
      facebook: ['www.facebook.com', [Validators.pattern(this.websiteRegex)]],
      website: ['www.website.com', [Validators.pattern(this.customWebRegex)]],
      language: this.fb.array([]),
      education: this.fb.array([]),
      award: this.fb.array([]),
      Associataion: this.fb.array([]),
      affiliationHospital: this.fb.array([]),
    });
  }
  // language array group
  get language() {
    return this.ProviderProfileEditForm.controls['language'] as FormArray;
  }
  deleteLanguage(languagesIndex: number) {
    this.language.removeAt(languagesIndex);
  }
  addLanguageItem() {
    const item = this.fb.group({
      code: [null, [Validators.required, Validators.pattern(this.languageRegex)]],
      name: [null, [Validators.required, Validators.min(1),Validators.pattern(this.languageRegex)]],
    });
    this.language.push(item);
  }
  // EducationForm
  addEducationItem() {
    const item = this.fb.group({
      graduatedyear: [null, [Validators.required, Validators.pattern(this.yearRegex)]],
      areaOfStudy: [null, [Validators.required, Validators.pattern(this.addressRegex)]],
      instuteName: [null, [Validators.required, Validators.pattern(this.addressRegex)]],
    });
    this.education.push(item);
  }
  get education() {
    return this.ProviderProfileEditForm.controls['education'] as FormArray;
  }
  deleteEducation(EducationIndex: number) {
    this.education.removeAt(EducationIndex);
  }
  // AwardFrom
  addAwardsItem() {
    const item = this.fb.group({
      year: [null, [Validators.required, Validators.pattern(this.yearRegex)]],
      title: [null, [Validators.required, Validators.pattern(this.addressRegex)]],
    });
    this.award.push(item);
  }
  get award() {
    return this.ProviderProfileEditForm.controls['award'] as FormArray;
  }
  deleteAwarded(AwardsIndex: number) {
    this.award.removeAt(AwardsIndex);
  }
  // AssociataionFrom
  get Associataion() {
    return this.ProviderProfileEditForm.controls['Associataion'] as FormArray;
  }
  addAssociataionItem() {
    const item = this.fb.group({
      association: [null, [Validators.required, Validators.pattern(this.addressRegex)]],
    });
    this.Associataion.push(item);
  }
  deleteAssociataion(AssociataionIndex: number) {
    this.Associataion.removeAt(AssociataionIndex);
  }
  // affiliation
  get affiliationHospital() {
    return this.ProviderProfileEditForm.controls[
      'affiliationHospital'
    ] as FormArray;
  }
  affiliationItem() {
    const item = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(this.addressRegex)]],
      year: [null, [Validators.required, Validators.pattern(this.yearRegex)]],  
      address: [null, [Validators.required, Validators.pattern(this.addressRegex)]],
    });
    this.affiliationHospital.push(item);
  }
  deleteaffiliation(affiliationIndex: number) {
    this.affiliationHospital.removeAt(affiliationIndex);
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.id = params['id']; // Assuming your route parameter is named 'id'
      this.service.getProviderProfileById(this.id).subscribe((resp: any) => {
        this.data = resp.data;
        this.data?.profileDetails?.language?.forEach(lang => {
          this.addLanguageItem()
        });
        this.data?.otherInformation?.forEach(edu => {
          this.addEducationItem()
        });
        this.data?.award?.forEach(award => {
          this.addAwardsItem()
        });
        this.data?.affiliationHospital?.forEach(aff => {
          this.affiliationItem()
        });
        this.getFormValues();
      });
    });
    
  }

  ProviderProfileEditSubmit() {
    const GetFormData = this.ProviderProfileEditForm.value
    const paylode = {
      id: this.id,
      bio: 'test bio jkh',
      careConnectStatus: 'published',
      profileDetails: {
        npi: GetFormData.npi,
        prefix: GetFormData.prefix,
        firstName: GetFormData.firstName,
        lastName: GetFormData.lastName,
        suffix: GetFormData.suffix,
        gender: GetFormData.gender,
        practicingYear: GetFormData.practicingYear,
        speciality: GetFormData.speciality,
        language: GetFormData.language,
        profileUrl: 'https://example.com/profile',
      },
      onlineBooking: {
        enableOnlineBooking: true,
        appoitmentIncrements: '30 Minutes',
        allowSameDay: true,
        earlierThanSchedule: '30 Minutes',
        acceptSelfPayOnly: true,
        sameAsOfficeHours: false,
      },
      servicesProcedures: {
        title: 'Cardiology Consultation',
        description: 'Comprehensive consultation for cardiology issues.',
      },
      socialMedia: {
        google: GetFormData.google,
        facebook: GetFormData.facebook,
        twitter: GetFormData.twitter,
        personalWebsite: GetFormData.website,
      },
      insurance: {
        overview: 'Accepts most major insurance plans.',
        network: [
          {
            name: 'Med Pay',
            code: 'mp',
          },
        ],
      },
      otherInformation:  GetFormData.education,
        award: GetFormData.award,
        affiliationHospital:GetFormData.affiliationHospital,
        association:  GetFormData.association,
      }
    
  
    if (this.ProviderProfileEditForm.value) {
      this.service.updateProviderProfileById(paylode).subscribe((resp:any) => {
        if (resp.status === 'success') {
          const message = "Provider Profile has been updated";
          this.messageService.add({ severity: 'success', detail: message });
          
          setTimeout(() => {
            this.router.navigate(['/settings/providers-profiles']);
          }, 400);
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }

      }, error => {
        console.error("Error occured while updating provider profiles details:", error);
        this._snackBar.open("An error occurred. Please try again later.", '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: "red",
        });
      });
     
    } else {
      console.log('Form is invalid!');
    }
  }

  getFormValues()
   {
    this.ProviderProfileEditForm.patchValue({
      prefix: this.data.profileDetails.prefix,
      suffix: this.data.profileDetails.suffix,
      // profileUrl:this.data.profileDetails.profileUrl,
      firstName: this.data.profileDetails.firstName,
      lastName: this.data.profileDetails.lastName,
      gender: this.data.profileDetails.gender,
      npi: this.data.profileDetails.npi,
      speciality: this.data.profileDetails.speciality,
      practicingYear: this.data.profileDetails.practicingYear,
      google: this.data.socialMedia?.google,
      twitter: this.data.socialMedia?.twitter,
      facebook: this.data.socialMedia?.facebook,
      website: this.data.socialMedia?.personalWebsite,
    });
    
    this.language.patchValue(this.data.profileDetails.language);
    this.education.patchValue(this.data.otherInformation);
    this.award.patchValue(this.data.award);
    this.Associataion.patchValue([
      { association: this.data.association },
    ]);
    this.affiliationHospital.patchValue(
      this.data.affiliationHospital
    );
  }
  
}
