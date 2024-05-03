import { Component} from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/shared/auth/auth.service';

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
  userData:any

  constructor(public dialog: MatDialog, public router: Router, private service: SettingsService,public auth: AuthService) { }

  getPracticeListData() {
    this.loading = true;
    this.service.getPracticeInformationList().subscribe((resp: any) => {
      this.data = resp.data;
      this.loading = false;
    })
  }
  isNameArray(data: any): boolean {
    return Array.isArray(data.name);
  }
  
  ngOnInit(): void {
    this.auth.getUserProfile().subscribe((user: any) => {
      this.userData = user.data;
      console.log(this.userData);
            
    });
  // deletePracticeInformation(id: string) {
  //   this.service.deletePracticeInformationById(id).subscribe(resp => {
  //   })
  // }
  }

}

