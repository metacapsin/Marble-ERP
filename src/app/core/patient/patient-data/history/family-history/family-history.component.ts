import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-family-history',
  standalone: true,
  imports: [DropdownModule,RadioButtonModule,CheckboxModule,FormsModule,CommonModule,ReactiveFormsModule,DialogModule],
  templateUrl: './family-history.component.html',
  styleUrl: './family-history.component.scss',
})
export class FamilyHistoryComponent implements OnInit {
  blood: any;
  formGroup!: UntypedFormGroup;
  AddComments = false;
  EditCustomitems = false;
  AddCustomitems = false;
  AddCustomitemsModel:any  
  FamilyMember:any 
  radioButton:any
  checkBox:any
  comments:any
  Secondcomments:any
  ngOnInit(): void {
    this.blood = [{ name: 'mother' }, { name: 'father' }, { name: 'son' }];
    this.blood = [{ name: 'mother' }, { name: 'father' }, { name: 'son' }];
  }
  DialogComments(){
    this.AddComments = false;
    this.AddComments = true
  }
  closeIt(){
    this.AddComments = false;
  }
  EditDialog() {
    this.EditCustomitems = true;
  }
  closeDialog() {
    this.AddCustomitems = false;
  }
  addcoustomCheckBoxItem() {
    console.log(this.formGroup.value);
    const item = this.fb.group({
      checkBox: [false, [Validators.required]],
    });
    this.coustomCheckBox.push(item);
    this.closeDialog();
    // console.log(this.AddCommentsItema);
  }
  get coustomCheckBox() {
    return this.formGroup.controls['coustomCheckBox'] as FormArray;
  }
  deleteEducation(Index: number) {
    this.coustomCheckBox.removeAt(Index);
  }
  AddDialog() {
    this.AddCustomitems = true;
  }
  saveIT() {
    // console.log(this.formGroup.value);
    this.EditCustomitems = false;
  }
  onCheckboxChange(event: any) {
    console.log(
      'Checkbox state changed:',
      event,
      'form',
      this.data1,
  
    );
  }
  constructor(private fb: UntypedFormBuilder) {
    this.formGroup = this.fb.group({
      coustomCheckBox: this.fb.array([]),
    })
  }

  submitFrom(){
    console.log("from",this.formGroup.value);
  }

  data1 = [
    {
      title: 'General',
      subCategory: [
        {
          title: 'No Health Concern',
          fromControl: 'no_Health_Concern',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Arthritis',
          fromControl: 'arthritis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Asthma',
          fromControl: 'asthma',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Bleeding Disorder',
          fromControl: 'bleeding_Disorder',
          isSelected: true,
          comments: '',
        },
        {
          title: 'CAD < age 55',
          fromControl: 'cad',
          isSelected: false,
          comments: '',
        },
        {
          title: 'COPD',
          fromControl: 'COPD',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Diabetes',
          fromControl: 'diabetes',
          isSelected: false,
          comments: '',
        },

        {
          title: 'Heart Attack',
          fromControl: 'heart_Attack',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Heart Disease',
          fromControl: 'heart_Disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'High Cholesterol',
          fromControl: 'high_Cholesterol',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hypertension',
          fromControl: 'hypertension',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Mental Lllness',
          fromControl: 'mental_Lllness',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Osteoporosis',
          fromControl: 'osteoporosis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Stroke',
          fromControl: 'stroke',
          isSelected: false,
          comments: '',
        },
        
        {
          title: 'Alzheimer"s Dse',
          fromControl: 'Alzheimer',
          isSelected: true,
          comments: '',
        },
        {
          title: 'Deymentia',
          fromControl: 'deymentia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hyperlipidemia',
          fromControl: 'hyperlipidemia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Lung disease',
          fromControl: 'lung_disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Parkinson"s',
          fromControl: 'parkinson',
          isSelected: false,
          comments: '',
        },

        {
          title: 'Anxiety',
          fromControl: 'anxiety',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Gastric reflux',
          fromControl: 'gastric_reflux',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Kidney Disease',
          fromControl: 'kidney_Disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Mastectomy',
          fromControl: 'mastectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Throid Problems',
          fromControl: 'throid_Problems',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Cancer',
      subCategory: [
        {
          title: 'Breast CA',
          fromControl: 'Breast_CA',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Colon CA',
          fromControl: 'Colon_CA',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Other CA',
          fromControl: 'Other_CA',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Ovarian CA',
          fromControl: 'Ovarian_CA',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Prostate CA',
          fromControl: 'Prostate_CA',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Uterine CA',
          fromControl: 'Uterine_CA',
          isSelected: false,
          comments: '',
        },

        {
          title: 'Ataxia',
          fromControl: 'ataxia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Gout',
          fromControl: 'gout',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Kidney failure',
          fromControl: 'kidney_Failure',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Multiple Medical Lssues',
          fromControl: 'multiple_Medical_Lssues',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Clotting disorder',
          fromControl: 'clotting_Disorder',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hx of falls',
          fromControl: 'hx_Of_Falls',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Liver Disease',
          fromControl: 'liver_Disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Pancreatic Cancer',
          fromControl: 'pancreatic_Cancer',
          isSelected: false,
          comments: '',
        },
      ],
    },
  ];

  goBack() {
    window.history.back();
  }
}
