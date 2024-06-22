import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from "primeng/button";


@Component({
  selector: "app-add-new-purchase",
  standalone: true,
  imports: [CommonModule, SharedModule,RouterModule, StepperModule, ButtonModule],
  templateUrl: "./add-new-purchase.component.html",
  styleUrl: "./add-new-purchase.component.scss",
})
export class AddNewPurchaseComponent {
  public routes = routes;
  constructor(private router: Router) {}
}
