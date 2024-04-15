import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrl: './patient-data.component.scss'
})
export class PatientDataComponent {
  items: MenuItem[] = [];
  settingCategory = ""
  routes = routes
  currentRoute!: string;
  id:any
  routerChangeSubscription: Subscription;
  constructor(private router: Router,private activeRoute: ActivatedRoute) {
    this.id = this.activeRoute.snapshot.params['id'];
    this.routerChangeSubscription = this.router.events.subscribe(
      (event) => {
        this.currentRoute = this.router.url
      }
    )
  }
  ngOnInit() {
    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video'
              }
            ]
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          }
        ]
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ]
      }
    ];
  }

  vitalsSettings(){
    this.router.navigate([`/patient/facesheet/${this.id}/vitals`])
  }

  demographic(){
    this.router.navigate([`/patient/facesheet/${this.id}/demographic`])
  }

  history(){
    this.router.navigate([`/patient/facesheet/${this.id}/history`])
  }
  problems(){
    this.router.navigate([`/patient/facesheet/${this.id}/problems`])
  }
  allergies(){
    this.router.navigate([`/patient/facesheet/${this.id}/allergies`])
  }
  documents(){
    this.router.navigate([`/patient/facesheet/${this.id}/documents`])
  }
  careCheckLists(){
    this.router.navigate([`/patient/facesheet/${this.id}/carechecklists`])
  }
  flowsheets(){
    this.router.navigate([`/patient/facesheet/${this.id}/flowsheets`])
  }
  immunizations(){
    this.router.navigate([`/patient/facesheet/${this.id}/immunizations`])
  }
  account(){
    this.router.navigate([`/patient/facesheet/${this.id}/account`])
  }

  ngOnDestroy() {
    this.routerChangeSubscription.unsubscribe();
  }

  isRouteActive(text) {
    if(!this.currentRoute) return ''
    let str = this.currentRoute?.includes(text)
    if (str) {
        return 'active'
    } else {
        return 'non-active'
    }
}

}
