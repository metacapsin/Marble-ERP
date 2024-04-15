import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: 'app-add-customers',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './add-customers.component.html',
  styleUrl: './add-customers.component.scss'
})
export class AddCustomersComponent {
  addcustomerGroup:UntypedFormGroup
  routes = routes;

  constructor( private fb: UntypedFormBuilder,) {
    this.addcustomerGroup = this.fb.group({
      
    })
  }



  addcustomerForm(){
    console.log("ho");
    
  }
}
