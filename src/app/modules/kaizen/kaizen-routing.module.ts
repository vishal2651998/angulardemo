import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KaizenComponent } from './kaizen/kaizen.component';
import { IndexComponent } from './kaizen/index/index.component';
import { ManageComponent } from './kaizen/manage/manage.component';
import { ViewComponent } from './kaizen/view/view.component';

const routes: Routes = [
  {path: '', component: KaizenComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/edit/:id', component: ManageComponent},
    {path: "view/:id", component: ViewComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KaizenRoutingModule { }
