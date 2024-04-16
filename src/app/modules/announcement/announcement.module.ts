import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TableModule as PrimeNGTableModule } from 'primeng/table';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { IndexComponent } from '../../components/announcement/index/index.component';
import { AnnouncementComponent } from '../../components/announcement/announcement.component';
import { DismissedComponent } from '../../components/announcement/dismissed/dismissed.component';
import { DashboardComponent } from '../../components/announcement/dashboard/dashboard.component';
import { ViewComponent } from '../../components/announcement/view/view.component';
import { ArchiveComponent } from '../../components/announcement/archive/archive.component';
import { ManageComponent } from '../../components/announcement/manage/manage.component';

@NgModule({
  declarations: [
    IndexComponent,
    AnnouncementComponent,
    DismissedComponent,
    DashboardComponent,
    ViewComponent,
    ArchiveComponent,
    ManageComponent    
  ],
  imports: [
    SharedModule,
    AnnouncementRoutingModule ,
    PrimeNGTableModule  
  ]
})
export class AnnouncementModule { }
