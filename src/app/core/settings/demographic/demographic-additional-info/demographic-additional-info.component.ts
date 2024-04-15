import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demographic-additional-info',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './demographic-additional-info.component.html',
  styleUrl: './demographic-additional-info.component.scss',
})
export class DemographicAdditionalInfoComponent implements OnInit {
  EditButton: any = false;

  AdditionalInfoEditGroup: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder) {
    this.AdditionalInfoEditGroup = this.formBuilder.group({
      motherFirstName: ['', Validators.required],
      birthOrder: ['', Validators.required],
      multipleBirthMembers: ['', Validators.required],
      citizenship: ['', Validators.required],
      education: ['', Validators.required],
      dateandTimeofDeath: ['', Validators.required],
      pharmacies: ['', Validators.required],
      primaryProvider: ['', Validators.required],
      referredBy: ['', Validators.required],
      referringProvider: ['', Validators.required],
      referralSource: ['', Validators.required],
      notes: ['', Validators.required],
      motherMaidenName: ['', Validators.required],
      birthPlace: ['', Validators.required],
      nationality: ['', Validators.required],
      religiousAffiliation: ['', Validators.required],
      causeOfDeath: ['', Validators.required],
    });
  }
  GridFormOne: any = [
    {
      motherFirstName: 'Self',
      dateofBirth: '26093 DUMONT RD',
      multipleBirthMembers: 'test',
      citizenship: 'test',
      education: 'test',
      dateandTimeofDeath: 'test',
      primaryProvider: 'test',
      referredBy: 'test',
      referringProvider: 'test',
      referralSource: 'test',
      notes: 'test',
      pharmacies: 'test',
    },
  ];
  GridFormSecond: any = [
    {
      motherMaidenName: 'test',
      birthPlace: 'test',
      nationality: 'test',
      religiousAffiliation: 'test',
      causeOfDeath: 'test',
    },
  ];

  ngOnInit(): void {
    this.AdditionalInfoEditGroup.patchValue({
      motherFirstName: this.GridFormOne[0].motherFirstName,
      birthOrder: this.GridFormOne[0].dateofBirth,
      multipleBirthMembers: this.GridFormOne[0].multipleBirthMembers,
      citizenship: this.GridFormOne[0].citizenship,
      education: this.GridFormOne[0].education,
      dateandTimeofDeath: this.GridFormOne[0].dateandTimeofDeath,
      pharmacies: this.GridFormOne[0].pharmacies,
      primaryProvider: this.GridFormOne[0].primaryProvider,
      referredBy: this.GridFormOne[0].referredBy,
      referringProvider: this.GridFormOne[0].referringProvider,
      referralSource: this.GridFormOne[0].referralSource,
      notes: this.GridFormOne[0].notes,
      motherMaidenName: this.GridFormSecond[0].motherMaidenName,
      birthPlace: this.GridFormSecond[0].birthPlace,
      nationality: this.GridFormSecond[0].nationality,
      religiousAffiliation: this.GridFormSecond[0].religiousAffiliation,
      causeOfDeath: this.GridFormSecond[0].causeOfDeath,
    });
  }

  toggleEditMode() {
    this.EditButton = !this.EditButton;
  }
  AdditionalInfoEdit() {
    console.log(this.AdditionalInfoEditGroup.value);
  }
}
