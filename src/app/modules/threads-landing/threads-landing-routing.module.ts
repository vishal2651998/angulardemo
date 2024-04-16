import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadspageComponent } from './threadspage/threadspage.component';
import { IndexComponent } from './threadspage/index/index.component';
import { ManageComponent } from './threadspage/manage/manage.component';
import { ViewComponent } from './threadspage/view/view.component';
import { ViewV2Component } from './threadspage/view-v2/view-v2.component';
import { ViewNewComponent } from './threadspage/view-new/view-new.component';
import { ViewV3Component } from './threadspage/view-v3/view-v3.component';

const routes: Routes = [
    {path: '', component: ThreadspageComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/new', component: ManageComponent},
    {path: 'manage/edit/:id', component: ManageComponent},
    {path: 'view/:id', component: ViewComponent},  
    {path: 'view-v2/:id', component: ViewV2Component},
    {path: 'view-v3/:id', component: ViewV3Component},
    {path: 'view/:id/:domainId', component: ViewComponent},
    {path: 'view-v2/:id/:domainId', component: ViewV2Component},
    {path: 'view-v3/:id/:domainId', component: ViewV3Component},
    {path: 'view/:id/:domainId/:userId', component: ViewComponent},
    {path: 'view-v2/:id/:domainId/:userId', component: ViewV2Component},
    {path: 'view-v3/:id/:domainId/:userId', component: ViewV3Component},
    {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
    {path: 'view-v2/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewV2Component},
    {path: 'view-v3/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewV3Component},
    {path: 'view-new/:id', component: ViewNewComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreadsLandingRoutingModule { }
