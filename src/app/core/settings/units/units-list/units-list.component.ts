import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [CommonModule, SharedModule, TableModule, ButtonModule, DialogModule],
  templateUrl: './units-list.component.html',
  styleUrl: './units-list.component.scss'
})
export class UnitsListComponent {
  public routes = routes
  addUnitForm! : FormGroup;
  editUnitForm! : FormGroup;
  
  addvisible: boolean = false;
  editvisible: boolean = false;


  searchDataValue= "";
  selectedUnit= ""
  unitListData =[
    
    {
      unitName: "Sequre per Feet",
      unitShortName: "sqrt",
    },
    {
      unitName: "Meter",
      unitShortName: "mtr",
    },
    {
      unitName: "kilogram",
      unitShortName: "kg",
    }
  ]

  constructor(private fb: FormBuilder){
    this.addUnitForm = this.fb.group({
      unitName: [''],
      unitShorName: ['']
    });
    this.editUnitForm = this.fb.group({
      unitName: [''],
      unitShorName: ['']
    })
  }
 

  openAddDialog(){
    this.addvisible = true;
 }
  openEditDialog(){
    this.editvisible = true;
 }

  public searchData(value: any): void {
    // this.taxesListData = this.originalData.map(i => {
    //   if (i.name.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }

  addUnitFormSubmit(){
    
  }

  editUnitFormSubmit(){

  }
}
