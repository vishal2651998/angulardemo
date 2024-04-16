import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdasComponent } from './adas/adas.component';
import { IndexComponent } from './adas/index/index.component';
import { ManageComponent } from './adas/manage/manage.component';
import { ViewComponent } from './adas/view/view.component';

const routes: Routes = [
  {path: '', component: AdasComponent, children: [
    {path: '', component: IndexComponent},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/new', component: ManageComponent},
    {path: 'manage/edit/:id', component: ManageComponent},
    {path: 'view/:id', component: ViewComponent}  
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdasRoutingModule { }
