import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-social-history',
  standalone: true,
  imports: [ReactiveFormsModule, CheckboxModule, CommonModule, DialogModule,FormsModule],
  templateUrl: './social-history.component.html',
  styleUrl: './social-history.component.scss',
})
export class SocialHistoryComponent {
  formGroup!: UntypedFormGroup;
  // AddCustomitemsModel:any
  labal:any
  sideComments:any
  constructor(private fb: UntypedFormBuilder) {
    this.formGroup = this.fb.group({
        coustomCheckBox: this.fb.array([]),
        AddCustomitemsModel:['']
    });
}
  EditCustomitems = false;
  AddCustomitems = false;
  AddComments = false;
  submitFrom() {
    this.labal = this.formGroup.value.AddCustomitemsModel;
    console.log(this.formGroup.value.AddCustomitemsModel);
  }
  AddDialog() {
    this.AddCustomitems = true;
  }
  EditDialog() {
    this.EditCustomitems = true;
  }
  closeDialog() {
    this.AddCustomitems = false;
  }
  goBack(){
    window.history.back()
  }
  DialogComments(){
    this.AddComments = false;
    this.AddComments = true
  }
  closeIt(){
    this.AddComments = false;
  }
  addcoustomCheckBoxItem() {
    const item = this.fb.group({
      checkBox: [false, [Validators.required]],
    });
    this.coustomCheckBox.push(item);
    // console.log(this.AddCustomitemsModel);
    this.closeDialog()  
  }
  get coustomCheckBox() {
    return this.formGroup.controls['coustomCheckBox'] as FormArray;
  }
  deleteEducation(Index: number) {
    this.coustomCheckBox.removeAt(Index);
  }
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.DialogComments(); 
    }
  }
  data = [
    {
      title: 'Tobacco',
      subCategory: [
        { title: 'current_every_day_smoker', isSelected: true, comments: '' },
        { title: 'current_some_day_smoker', isSelected: false, comments: '' },
        { title: 'former_smoker', isSelected: false, comments: '' },
        { title: 'heavy_tobacco_smoker', isSelected: false, comments: '' },
        { title: 'light_tobacco_smoker', isSelected: false, comments: '' },
        { title: 'never_smoker', isSelected: true, comments: '' },
        {
          title: 'smoker_current_status_unknown',
          isSelected: false,
          comments: '',
        },
        { title: 'unknown_if_ever_smoked', isSelected: false, comments: '' },
      ],
    },
    {
      title: 'Alcohol',
      subCategory: [
        { title: 'do_not_drink', isSelected: false, comments: '' },
        { title: 'drink_daily', isSelected: false, comments: '' },
        { title: 'frequently_drink', isSelected: false, comments: '' },
        { title: 'hx_of_alcoholism', isSelected: false, comments: '' },
        { title: 'occasional_drink', isSelected: false, comments: '' },
      ],
    },
    {
      title: 'Drug Abuse',
      subCategory: [
        { title: 'ivdu', isSelected: false, comments: '' },
        { title: 'illicit_drug_use', isSelected: false, comments: '' },
        { title: 'no_illicit_drug_use', isSelected: false, comments: '' },
      ],
    },
    {
      title: 'Cardiovascular',
      subCategory: [
        { title: 'eat_healthy_meals', isSelected: false, comments: '' },
        { title: 'regular_exercise', isSelected: false, comments: '' },
        { title: 'take_daily_aspirin', isSelected: false, comments: '' },
      ],
    },
    {
      title: 'Safety',
      subCategory: [
        { title: 'household_smoke_detector', isSelected: false, comments: '' },
        { title: 'keep_firearms_in_home', isSelected: false, comments: '' },
        { title: 'wear_seatbelts', isSelected: false, comments: '' },
      ],
    },
    {
      title: 'Sexual Activity',
      subCategory: [
        { title: 'exposure_to_sti', isSelected: false, comments: '' },
        { title: 'homosexual_encounters', isSelected: false, comments: '' },
        { title: 'not_sexually_active', isSelected: false, comments: '' },
        { title: 'safe_sex_practices', isSelected: false, comments: '' },
        { title: 'sexually_active', isSelected: false, comments: '' },
      ],
    },
    {
      title: 'Birth Gender',
      subCategory: [
        { title: 'male', isSelected: false, comments: '' },
        { title: 'female', isSelected: false, comments: '' },
        { title: 'undifferentiated', isSelected: false, comments: '' },
      ],
    },
  ];
  onCheckboxChange(event: any) {
    console.log('Checkbox state changed:', event, "form", this.data);
  }
}
