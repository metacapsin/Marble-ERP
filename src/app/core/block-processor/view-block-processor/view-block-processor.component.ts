import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { routes } from "src/app/shared/routes/routes";
import { blockProcessorService } from "../block-processor.service";

@Component({
  selector: "app-view-block-processor",
  standalone: true,
  imports: [RouterModule, CommonModule, TabViewModule, TableModule],
  templateUrl: "./view-block-processor.component.html",
  styleUrl: "./view-block-processor.component.scss",
})
export class ViewBlockProcessorComponent {
  routes = routes;
  id: any;
  blockProcessorData:any;
  constructor(
    private activeRoute: ActivatedRoute,
    private blockProcessorService: blockProcessorService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }
  ngOnInit() {
    this.getBlockProcessor();

  }
  getBlockProcessor() {
    this.blockProcessorService.getBlockProcessorDataById(this.id).subscribe((data: any) => {
      this.blockProcessorData = [data]; 
      console.log(this.blockProcessorData);
    });
  }
}
