import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SibComponent } from './components/sib/sib.component';
import { IndexComponent } from './components/sib/index/index.component';
import { ManageComponent } from './components/sib/manage/manage.component';
import { ViewComponent } from './components/sib/view/view.component';

const routes: Routes = [
  {
    path:'', component:SibComponent, children: [
      {path: '', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'index', component: IndexComponent},
      {path: 'manage', component: ManageComponent},
      {path: 'manage/new', component: ManageComponent},
      {path: 'manage/edit/:sid', component: ManageComponent},
      {path: 'manage/duplicate/:sid', component: ManageComponent},
      {path: 'view/:sid', component: ViewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SibRoutingModule { }
