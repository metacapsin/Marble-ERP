import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { UsersdataService } from 'src/app/core/users/services/usersdata.service';
import { DataService } from 'src/app/shared/data/data.service';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { socialLinks } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-providers-profile-view',
  templateUrl: './providers-profile-view.component.html',
  styleUrls: ['./providers-profile-view.component.scss'],
  standalone: true,
  imports:[CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ButtonModule]
})
export class ProvidersProfileViewComponent implements OnInit {
  public routes = routes;
  id = '';
  providerData : any;
  data: any;
  public socialLinks: Array<socialLinks> = []

  constructor(
    private activeRoute: ActivatedRoute,
    private service: SettingsService,
    private router: Router,
    public _data: DataService
  ) {
    this.id = this.activeRoute.snapshot.params['id'];
    this.socialLinks = this._data.socialLinks;
  }
  ngOnInit(): void {
    this.service.getProviderProfileById(this.id).subscribe(
      (resp: any) => {
        this.providerData = resp.data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  goToEdit(id: any) {
    this.router.navigate(['/settings/providers-profiles/edit/' + id]);
  }
}
