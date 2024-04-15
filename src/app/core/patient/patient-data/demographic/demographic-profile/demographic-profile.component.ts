import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-demographic-profile',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
  ],
  templateUrl: './demographic-profile.component.html',
  styleUrl: './demographic-profile.component.scss',
})
export class DemographicProfileComponent {
  data: any = null;
  isEditMode = false;
  demographicForm: FormGroup;
  formData: any = {
    personalInformation: {
      name: 'John Doe',
      dob: '1980-05-25',
      maritalStatus: 'Married',
      sex: 'Male',
      sexualOrientation: 'Heterosexual',
      genderIdentity: 'Male',
      language: 'English',
    },
    additionalInformation: {
      mrn: '123456789',
      previousLast: 'Smith',
      maidenLast: 'Johnson',
      ssn: '123-45-6789',
      driversLicense: '123456789',
      hispanicOrLatino: false,
      ethnicities: ['Caucasian'],
      race: 'White',
      specificRaces: ['Irish'],
      preferredCommunication: 'Email',
      sendRemindersBy: 'Email',
      homeAddress: '123 Main St, Anytown, USA',
      homePhone: '(123) 456-7890',
      mobilePhone: '(234) 567-8901',
      personalEmail: 'john.doe@example.com',
      otherEmail: 'johndoe@gmail.com',
      priorAddress: '456 Elm St, Anytown, USA',
      disclosureNotes: 'No special notes',
      mailAddress: 'PO Box 789, Anytown, USA',
      workPhone: '(345) 678-9012',
      otherPhone: '(456) 789-0123',
      workEmail: 'john.doe@company.com',
    },
  };

  constructor(private formBuilder: FormBuilder) {
    // Initialize the form with default values and validators
    this.demographicForm = this.formBuilder.group({
      personalInformation: this.formBuilder.group({
        name: ['', Validators.required],
        dob: ['', Validators.required],
        maritalStatus: ['', Validators.required],
        sex: ['', Validators.required],
        sexualOrientation: ['', Validators.required],
        genderIdentity: ['', Validators.required],
        language: ['', Validators.required],
      }),
      additionalInformation: this.formBuilder.group({
        mrn: ['', Validators.required],
        previousLast: [''],
        maidenLast: [''],
        ssn: ['', Validators.required],
        driversLicense: [''],
        hispanicOrLatino: [false],
        ethnicities: [[]],
        race: [''],
        specificRaces: [[]],
        preferredCommunication: [''],
        sendRemindersBy: [''],
        homeAddress: [''],
        homePhone: [''],
        mobilePhone: [''],
        personalEmail: ['', Validators.email],
        otherEmail: ['', Validators.email],
        priorAddress: [''],
        disclosureNotes: [''],
        mailAddress: [''],
        workPhone: [''],
        otherPhone: [''],
        workEmail: ['', Validators.email],
      }),
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  submitForm() {
    if (this.demographicForm.valid) {
      // Form is valid, submit data
      console.log('Form data:', this.demographicForm.value);
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid. Please check all fields.');
    }
  }
}
