import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { AddUsersComponent } from './add-users/add-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
  declarations: [
  ],
  imports: [
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }