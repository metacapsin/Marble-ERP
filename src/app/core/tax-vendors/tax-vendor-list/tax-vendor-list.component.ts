import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { TaxVendorsService } from "../tax-vendors.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-tax-vendor-list",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./tax-vendor-list.component.html",
  styleUrl: "./tax-vendor-list.component.scss",
})
export class TaxVendorListComponent {
  public routes = routes;
  searchDataValue: string = "";
  taxVendorList = [];

  modalData: any = {};
  showDialoge = false;
  taxVendorId: any;

  constructor(
    private router: Router,
    private TaxVendorsService: TaxVendorsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
  this.getTaxVendorsList();

  }

  getTaxVendorsList(){
    this.TaxVendorsService.getTaxVendorList().subscribe((resp: any) => {
      this.taxVendorList = resp.data;
    });
  }

  goToTaxVendorAdd() {
    this.router.navigate(["/tax-vendors/add-tax-vendor"]);
  }
  goToTaxVendorEdit(_id: any) {
    this.router.navigate([`/tax-vendors/edit-tax-vendor/${_id}`]);
  }
  goToTaxVendorView(_id: any) {
    this.router.navigate([`/tax-vendors/view-tax-vendor/${_id}`]);
  }
  deleteTaxVendors(_id: any) {
    console.log("delete dialog open")
    console.log(_id._id)
    this.taxVendorId = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Tax Vendors",
    };
    this.showDialoge = true;
  }

  close() {
    this.showDialoge = false;
  }
  callBackModal() {
    this.TaxVendorsService.deleteTaxVendor(this.taxVendorId._id).subscribe((resp:any) => {
      let message = "Tax Vendors has been Deleted"
      this.messageService.add({ severity: 'success', detail:message });
      this.getTaxVendorsList();
      this.showDialoge = false;
    })


  }
}
