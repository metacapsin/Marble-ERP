import { Component} from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.scss'],
  standalone: true,
  imports: [CommonModule,SharedModule,]
})
export class PracticeListComponent {
  public routes = routes;
  data: any = null;
  Editdata: any = null;
  loading = false;
  searchDataValue = "";

  constructor(public dialog: MatDialog, public router: Router, private service: SettingsService) { }

  getPracticeListData() {
    this.loading = true;
    this.service.getPracticeInformationList().subscribe((resp: any) => {
      this.data = resp.data;
      this.loading = false;
    })
  }

  ngOnInit(): void {
    this.getPracticeListData();
  }

  // deletePracticeInformation(id: string) {
  //   this.service.deletePracticeInformationById(id).subscribe(resp => {
  //   })
  // }

}

