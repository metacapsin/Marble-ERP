import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Validators } from 'ngx-editor';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

interface Bloods {
  name: string;
}

interface BloodsSecond {
  name: string;
}

@Component({
  selector: 'app-past-medical-history-edit',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    TableModule
  ],
  templateUrl: './past-medical-history-edit.component.html',
  styleUrl: './past-medical-history-edit.component.scss',
})
export class PastMedicalHistoryEditComponent {
  formGroup: UntypedFormGroup;
  blood: Bloods[] | undefined;
  bloodCity: Bloods | undefined;
  AddComments = false;
  bloodSecond: BloodsSecond[] | undefined;
  BloodsSecondCity: BloodsSecond | undefined;
  EditCustomitems = false;
  AddCustomitems = false;
  AddCustomitemsModel:any
  selectedCity: string;
  comments:any
  AddCommentsItema:any
  AddDialog() {
    this.AddCustomitems = true;
  }
  saveIT() {
    console.log(this.selectedCity);
  }
  EditDialog() {
    this.EditCustomitems = true;
  }
  closeDialog() {
    this.AddCustomitems = false;
  }
  DialogComments(){
    this.AddComments = false;
    this.AddComments = true
  }
  ngOnInit() {
    this.blood = [{ name: 'A' }, { name: 'B' }, { name: 'BO' }, { name: 'O' }];
    this.bloodSecond = [{ name: '+ve' }, { name: '_ve' }];
  }
  value:any;
  data = [
    {
      id:"1",
      title: 'Head',
      subCategory: [
        {
          id:"1",
          title: 'Trauma',
          formtitle: 'Trauma',
          isSelected: true,
          comments: '',
        },
      ],
    },
    {
      id:"2",
      title: 'Eyes',
      subCategory: [
        {
          id:"1",
          title: 'Blindness',
          formtitle: 'Blindness',
          isSelected: false,
          comments: '',
        },
        {
          id:"2",
          title: 'Cataracts',
          formtitle: 'Cataracts',
          isSelected: false,
          comments: '',
        },
        {
          
          title: 'Glaucoma',
          formtitle: 'Glaucoma',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Wears Glasses Contacts',
          formtitle: 'WearsGlassesContacts',
          isSelected: false,
          comments: '',
        },
      ],
    },

    {
      title: 'Ears',
      subCategory: [
        {
          title: 'Hearing Aids',
          formtitle: 'HearingAids',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Nose/Sinuses',
      subCategory: [
        {
          title: 'Allergic Rhinitis',
          formtitle: 'Allergic_Rhinitis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Sinus infections',
          formtitle: 'Sinus_infections',
          isSelected: false,
          comments: '',
        },
      ],
    },

    {
      title: 'Mouth/Throat/Teeth',
      subCategory: [
        {
          title: 'Dentures',
          formtitle: 'Dentures',
          isSelected: false,
          comments: '',
        },
      ],
    },

    {
      title: 'Cardiovascular',
      subCategory: [
        {
          title: 'Aneurysm',
          formtitle: 'Aneurysm',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Angina',
          formtitle: 'Angina',
          isSelected: false,
          comments: '',
        },
        {
          title: 'DVT',
          formtitle: 'DVT',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Dysrhythmia',
          formtitle: 'Dysrhythmia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'HTN',
          formtitle: 'HTN',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Murmur',
          formtitle: 'Murmur',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Myocardial infarction',
          formtitle: 'Myocardial_infarction',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Other heart disease',
          formtitle: 'Other_heart_disease',
          isSelected: false,
          comments: '',
        },
      ],
    },

    {
      title: 'Respiratory',
      subCategory: [
        {
          title: 'Asthma',
          formtitle: 'Asthma',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Bronchitis',
          formtitle: 'Bronchitis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'COPD Bronchitis Emphysema',
          formtitle: 'COPD_Bronchitis_Emphysema',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Pleuritis',
          formtitle: 'Pleuritis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Pneumonia',
          formtitle: 'Pneumonia',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Gastrointestinal',
      subCategory: [
        {
          title: 'Cirrhosis',
          formtitle: 'Cirrhosis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'GERD',
          formtitle: 'GERD',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Gallbladder disease',
          formtitle: 'Gallbladder_disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Heartburn',
          formtitle: 'Heartburn',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hemorrhoids',
          formtitle: 'Hemorrhoids',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hepatitis',
          formtitle: 'Hepatitis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hiatal hernia',
          formtitle: 'Hiatal_hernia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Jaundice',
          formtitle: 'Jaundice',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Ulcer',
          formtitle: 'Ulcer',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Genitourinary',
      subCategory: [
        {
          title: 'Hernia',
          formtitle: 'Hernia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Incontinence',
          formtitle: 'Incontinence',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Nephrolithiasis',
          formtitle: 'Nephrolithiasis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Other kidney disease',
          formtitle: 'Other_kidney_disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'STD s',
          formtitle: 'STDs',
          isSelected: false,
          comments: '',
        },
        {
          title: 'UTI s',
          formtitle: 'UTIs',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Musculoskeletal',
      subCategory: [
        {
          title: 'Arthritis',
          formtitle: 'Arthritis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Gout',
          formtitle: 'Gout',
          isSelected: false,
          comments: '',
        },
        {
          title: 'M S injury',
          formtitle: 'M_S_injury',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Skin',
      subCategory: [
        {
          title: 'Dermatitis',
          formtitle: 'Dermatitis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Mole s',
          formtitle: 'Mole_s',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Other skin condition',
          formtitle: 'Other_skin_condition',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Psoriasis',
          formtitle: 'Psoriasis',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Neurological',
      subCategory: [
        {
          title: 'Epilepsy',
          formtitle: 'Epilepsy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Seizures',
          formtitle: 'Seizures',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Severe headaches migraines',
          formtitle: 'Severe_headaches_migraines',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Stroke',
          formtitle: 'Stroke',
          isSelected: false,
          comments: '',
        },
        {
          title: 'TIA',
          formtitle: 'TIA',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Psychiatric',
      subCategory: [
        {
          title: 'Bipolar disorder',
          formtitle: 'Bipolar_disorder',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Depression',
          formtitle: 'Depression',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hallucinations delusions',
          formtitle: 'Hallucinations_delusions',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Suicidal ideation',
          formtitle: 'Suicidal_ideation',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Suicide attempts',
          formtitle: 'Suicide_attempts',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Endocrine',
      subCategory: [
        {
          title: 'Goiter',
          formtitle: 'Goiter',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hyperlipidemia',
          formtitle: 'Hyperlipidemia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hypothyroidi sm',
          formtitle: 'Hypothyroidism',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Thyroid disease',
          formtitle: 'Thyroid_disease',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Thyroiditis',
          formtitle: 'Thyroiditis',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Type I DM',
          formtitle: 'Type_I_DM',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Type II DM',
          formtitle: 'Type_II_DM',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Heme/Onc',
      subCategory: [
        {
          title: 'Anemia',
          formtitle: 'Anemia',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Cancer',
          formtitle: 'Cancer',
          isSelected: false,
          comments: '',
        },
      ],
    },
    {
      title: 'Infectious',
      subCategory: [
        {
          title: 'HIV',
          formtitle: 'HIV',
          isSelected: false,
          comments: '',
        },
        {
          title: 'STD ss',
          formtitle: 'STDss',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Tuberculosis dz',
          formtitle: 'Tuberculosis_dz',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Tuberculosis exposure',
          formtitle: 'Tuberculosis_exposure',
          isSelected: false,
          comments: '',
        },
      ],
    },
  ];

  onCheckboxChange(event: any) {
    console.log('Checkbox state changed:', event, "form", this.data);
  }

  constructor(private fb: UntypedFormBuilder) {
    this.formGroup = this.fb.group({
      Secondcomments: ['',[Validators.required]],
      comments: ['', [Validators.required]], 
      coustomCheckBox: this.fb.array([]),
    });
    // this.formGroup = this.fb.group({
    //   hospitalizations: this.fb.array([
    //     // this.fb.group({
    //     //   graduatedyear: [null, [Validators.required]],
    //     //   areaOfStudy: [null, [Validators.required]],
    //     //   instuteName: [null, [Validators.required]],
    //     // }),
    //   ]),
    // });  
  }
  // first Form
  addcoustomCheckBoxItem() {
    const item = this.fb.group({
      checkBox: [false, [Validators.required]],
    });
    this.coustomCheckBox.push(item);
    console.log(this.AddCustomitemsModel);
    this.closeDialog()  
  }
  get coustomCheckBox() {
    return this.formGroup.controls['coustomCheckBox'] as FormArray;
  }
  deleteEducation(Index: number) {
    this.coustomCheckBox.removeAt(Index);
  }
  submitFrom() {
    console.log(this.value);
  }
  goBack() {
    window.history.back();
  }
  closeIt(){
    this.AddComments = false;
  }
}
