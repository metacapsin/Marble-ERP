import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SharedModule, RouterModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  id:any
  history = [
    {
      id: 1,
      title:"Past Medical History (PMHx)",
      dis:"No past medical history has been documented for this patient"
    },
    {
      id: 2,
      title:"Past Surgical History (PSHx)",
      dis:"No past surgical history has been documented for this patient"
    },
    {
      id: 3,
      title:"Family History (FHx)",
      dis:"No social history has been documented for this patient"
    },
    {
      id: 4,
      title:"Social History (SHx)",
      dis:"No Family history has been documented for this patient"
    },
    {
      id: 5,
      title:"Hospitalizations / Procedures",
      dis:"No hospitalizations / procedures have been documented for this patient"
    },
    {
      id: 6,
      title:"Long Term Care Facility",
      dis:"No Long Term Care Facilities have been documented for this patient"
    },
    {
      id: 7,
      title:"Hospice",
      dis:"No hospices have been documented for this patient"
    },
    {
      id: 8,
      title:"Implantable Devices",
      dis:"No implantable devices have been documented for this patient"
    },
  ];
  constructor(public routes: Router,private activeRoute: ActivatedRoute){
    this.activeRoute.parent.params.subscribe(
      (params:any) => {
        console.log(params?.id);
      });
  }
  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("patient id in history",this.id);
    });

  }
  editButton(type){
    if (type=="1") {
      this.routes.navigate([`/patient/facesheet/${this.id}/history/past-Medical-History`]);
    }else if(type == "2"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/past-Surgical-History`]);
    }
    else if(type == "3"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/family-History`]);
    }
    else if(type == "4"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/social-History`]);
    }
    else if(type == "5"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/hospitalizations-Procedures`]);
    }
    else if(type == "6"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/long-Term-Care-Facility`]);
    }
    else if(type == "7"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/Hospice`]);
    }
    else if(type == "8"){
      this.routes.navigate([`/patient/facesheet/${this.id}/history/implantable-Devices`]);
    }
  }
}

