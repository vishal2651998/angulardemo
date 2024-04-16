import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechsupportTeamComponent } from './techsupport-team/techsupport-team.component';
import { IndexComponent } from './techsupport-team/index/index.component';
import { ManageComponent } from './techsupport-team/manage/manage.component';

const routes: Routes = [
  {path: '', component: TechsupportTeamComponent, children: [
    {path: '', component: IndexComponent},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/new', component: ManageComponent},
    {path: 'manage/edit/:tid', component: ManageComponent},
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechsupportTeamRoutingModule { }
