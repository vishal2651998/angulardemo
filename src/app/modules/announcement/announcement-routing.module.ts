import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '../../components/announcement/index/index.component';
import { AnnouncementComponent } from '../../components/announcement/announcement.component';
import { DismissedComponent } from '../../components/announcement/dismissed/dismissed.component';
import { ViewComponent } from '../../components/announcement/view/view.component';
import { DashboardComponent } from '../../components/announcement/dashboard/dashboard.component';
import { ArchiveComponent } from '../../components/announcement/archive/archive.component';
import { ManageComponent } from '../../components/announcement/manage/manage.component';

const routes: Routes = [
  {
      path: '', component: AnnouncementComponent, children: [
          { path: '', component: IndexComponent },
          { path: 'dismissed', component: DismissedComponent },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'view/:id', component: ViewComponent },
          {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
          { path: 'archive', component: ArchiveComponent },
          { path: 'manage', component: ManageComponent },          
          { path: 'manage/edit/:id', component: ManageComponent }
        ]
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
