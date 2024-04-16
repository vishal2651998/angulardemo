import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { IndexComponent } from './opportunity/index/index.component';
import { ManageComponent } from './opportunity/manage/manage.component';
import { ViewComponent } from './opportunity/view/view.component';

const routes: Routes = [
  {path: '', component: OpportunityComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/new', component: ManageComponent},
    {path: 'manage/edit/:id', component: ManageComponent},
    {path: 'view/:id', component: ViewComponent},
    {path: 'view/:id/:domainId', component: ViewComponent},
    {path: 'view/:id/:domainId/:userId', component: ViewComponent},
    {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityRoutingModule { }
