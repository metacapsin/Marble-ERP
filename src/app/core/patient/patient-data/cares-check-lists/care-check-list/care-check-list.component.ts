import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-care-check-list',
  templateUrl: './care-check-list.component.html',
  styleUrl: './care-check-list.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class CareCheckListComponent {
  searchDataValue = "";
  selectedProducts = [];
  careCheckLists = [
    {
      careCheckListMeasure: "Tobacco Use Screening (Age 12+): tobacco use screening completed",
      careCheckListLastUpdate: "2024-03-25",
      careCheckListStatus: "Completed",
      careCheckListResult: "Okay",
    },
    {
      careCheckListMeasure: "Alcohol Use Screening & Follow-up (Age 18+):Standardized screening tool",
      careCheckListLastUpdate: "2024-03-25",
      careCheckListStatus: "Pending",
      careCheckListResult: "Done",
    },
    {
      careCheckListMeasure: "Alcohol Use Screening & Follow-up (Age 18+):Positive screening, counselling provided",
      careCheckListLastUpdate: "2024-03-25",
      careCheckListStatus: "Completed by Adnnan",
      careCheckListResult: "Okay Done",
    },
    {
      careCheckListMeasure: "Depression Screening & Follow-up (Age 18+):Standardized adult screening tool used",
      careCheckListLastUpdate: "",
      careCheckListStatus: "",
      careCheckListResult: "",
    },
    {
      careCheckListMeasure: "Depression Screening & Follow-up (Age 18+):Positive screening, follow-up plan provided",
      careCheckListLastUpdate: "",
      careCheckListStatus: "",
      careCheckListResult: "",
    },
    {
      careCheckListMeasure: "If patient BMI (kg/m^2) is >= 25, was follow-up plan provided? (Age >= 18 years)",
      careCheckListLastUpdate: "",
      careCheckListStatus: "",
      careCheckListResult: "",
    },
  ]


  searchData(value) {

  }
}
