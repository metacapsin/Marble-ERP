import { NgModule } from "@angular/core";
import { subCategoriesRoutingModule } from "./sub-categories-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [],
  imports: [SharedModule, subCategoriesRoutingModule],
})
export class SubCategoriesModule {}
