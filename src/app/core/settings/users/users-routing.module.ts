import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './add-users/add-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ListUsersComponent } from './list-users/List-users.component';

const routes: Routes = [
  { path: '', component: ListUsersComponent },
  { path: 'add-users', component: AddUsersComponent },
  { path: 'edit-users/:id', component: EditUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}  