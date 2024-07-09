import { NgModule } from "@angular/core";
import { CategoriesRoutingModule } from "./categories-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [],
  imports: [SharedModule, CategoriesRoutingModule],
})
export class CategoriesModule {}
