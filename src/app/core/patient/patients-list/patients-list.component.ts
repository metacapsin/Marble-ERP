import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  public routes = routes;
  patientsApiData:any = [];
  data :any = []
  filteredData:any
  modalData: any = {}
  showDialog = false;
  patientId = "";
  originalData:any = []
  searchDataValue = "";
  selectedProducts = [];
  product = ""

  constructor(public AddPatientAips:SettingsService, private router:Router,private _snackBar: MatSnackBar,){}
  ngOnInit():void {
    this.getAllPatientData()
  }
  getAllPatientData(){
    this.AddPatientAips.AllpatientApi().subscribe((resp)=>{
      this.patientsApiData = resp;
      this.data = this.patientsApiData.data
      this.originalData = this.patientsApiData.data
      console.log(this.data);
    })
  }

  // patientDelete(id:any){
  //   this.AddPatientAips.patientDeleteApi(id).subscribe((resp)=>{
  //     console.log(resp);
  //     this.getAllPatientData();
  //     if (resp) {
  //       this._snackBar.open('Your Information is Deleted!', '', {
  //         duration: 2000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'right',
  //         panelClass: 'red',
  //       });
  //     }
  //   })
  // }
  patientEdit(id:any){
    console.log(id);
    this.router.navigate(['/patient/edit-patient/'+id])
  }
  patientView(id:any){
    console.log(id);
    this.router.navigate(['/patient/facesheet/'+id+'/vitals'])
  }


  patientDelete(reasonId: any) {
    console.log("Delete Call");

    this.patientId = reasonId;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Patient Details"
    }
    this.showDialog = true;
  }
  showNewDialog() {
    this.showDialog = true;
  }
  callBackModal() {
    this.AddPatientAips.patientDeleteApi(this.patientId).subscribe((resp)=>{
      console.log(resp);
      this.getAllPatientData();
      if (resp) {
        this._snackBar.open('Your Patient Details has been Deleted!', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'red',
        });
        this.getAllPatientData();
        this.showDialog = false;
      }
    })
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.data = this.originalData.map(i => {
        if(i.fullName.toLowerCase().includes(value.trim().toLowerCase())){
          return i;
        }
    });
  }
}
