import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartsComponent } from '../../components/parts/parts.component';
import { IndexComponent } from '../../components/parts/index/index.component';
import { ManageComponent } from '../../components/parts/manage/manage.component';
import { ViewComponent } from '../../components/parts/view/view.component';

const routes: Routes = [
  {
    path:'', component:PartsComponent, children: [
      {path: '', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'index', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'index/:pid', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'manage', component: ManageComponent},
      {path: 'manage/new', component: ManageComponent},
      {path: 'manage/edit/:pid', component: ManageComponent},
      {path: 'manage/duplicate/:pid', component: ManageComponent},
      {path: 'view/:pid', component: ViewComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }
