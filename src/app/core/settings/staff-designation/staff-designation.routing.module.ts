import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ListStaffDesignationComponent } from "./list-staff-designation/list-staff-designation.component";
import { AddStaffDesignationComponent } from "./add-staff-designation/add-staff-designation.component";
import { EditStaffDesignationComponent } from "./edit-staff-designation/edit-staff-designation.component";

const routes: Routes = [{ path: "", component: ListStaffDesignationComponent },
  { path: "add-staff-Designation", component: AddStaffDesignationComponent },
  { path: "'edit-staff-Designation/:id'", component: EditStaffDesignationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffDesignationRoutingModule {}
