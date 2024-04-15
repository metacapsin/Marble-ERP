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
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-past-surgical-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    DropdownModule,
    DialogModule,
    FormsModule,
  ],
  templateUrl: './past-surgical-history.component.html',
  styleUrl: './past-surgical-history.component.scss',
})
export class PastSurgicalHistoryComponent {
  formGroup: UntypedFormGroup;
  EditCustomitems = false;
  AddCustomitems = false;
  AddComments = false;
  AddCommentsItema: any;
  Secondcomments: any;
  comments: any;
  ArrayCheckBox:any[] = [];
  submitFrom() {
    console.log(this.formGroup.value);
  }
  AddDialog() {
    this.AddCustomitems = true;
  }
  saveIT() {
    // console.log(this.formGroup.value);
    this.EditCustomitems = false;
  }
  EditDialog() {
    this.EditCustomitems = true;
  }
  closeDialog() {
    this.AddCustomitems = false;
  }
  DialogComments() {
    this.AddComments = false;
    this.AddComments = true;
  }
  closeIt() {
    this.AddComments = false;
  }
  addcoustomCheckBoxItem() {
    console.log(this.formGroup.value);
    const item = this.fb.group({
      checkBox: [false, [Validators.required]],
    });
    this.coustomCheckBox.push(item);
    this.closeDialog();
    console.log(this.AddCommentsItema);
  }
  get coustomCheckBox() {
    return this.formGroup.controls['coustomCheckBox'] as FormArray;
  }
  deleteEducation(Index: number) {
    this.coustomCheckBox.removeAt(Index);
  }
  
  data = [
    {
      title: 'Common Surgeries',
      subCategory: [
        {
          title: 'Aneurysm_repair',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Appendectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Back_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Bariatric_surgery_gastric_bypass',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Bilateral_tubal_ligation',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Breast_resection_mastectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'CABG',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Carotid_endarterectomy_stent',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Carpal_tunnel_release_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Cataract_lens_surgery',
          isSelected: false,
          comments: '',
        },

        {
          title: 'Cesarean_section',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Cholecystectomy_bile_duct_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Dilation_and_curettage',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hemorrhoid_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hip_arthroplasty',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hip_replacement',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Hysterectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Inguinal_hernia_repair',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Knee_arthroplasty',
          isSelected: false,
          comments: '',
        },
      ],
    },
  ];
  dataSecond = [
    {
      title: 'Common Surgeries',
      subCategory: [
        {
          title: 'LASIK',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Laminectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Nasal_surgery',
          isSelected: true,
          comments: '',
        },
        {
          title: 'PTCA_PCI',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Pacemaker_defibrillator',
          isSelected: true,
          comments: '',
        },
        {
          title: 'Prostate_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Prostatectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Rotator_cuff_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Sinus_surgery',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Skin_cancer_excision',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Spinal_fusion',
          isSelected: false,
          comments: '',
        },
        {
          title: 'TAH_BSO',
          isSelected: false,
          comments: '',
        },
        {
          title: 'TURP',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Tonsillectomy_Adenoidectomy',
          isSelected: false,
          comments: '',
        },
        {
          title: 'Vasectomy',
          isSelected: false,
          comments: '',
        },
      ],
    },
  ];
  
  onCheckboxChange(event: any) {
    console.log(
      'Checkbox state changed:',
      event,
      'form',
      this.data,
      this.dataSecond,
    );
  }
  constructor(private fb: UntypedFormBuilder) {
    this.formGroup = this.fb.group({
      AddCommentsItema: ['', [Validators.required]],
      Secondcomments: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      coustomCheckBox: this.fb.array([]),
    });
  }
  goBack() {
    window.history.back();
  }
}
