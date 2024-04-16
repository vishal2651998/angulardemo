import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscalationsComponent } from './components/escalations/escalations.component';
import { IndexComponent } from './components/escalations/index/index.component';
import { ManageComponent } from './components/escalations/manage/manage.component';
import { ManageFormComponent } from './components/escalations/manage-form/manage-form.component';

const routes: Routes = [
  {
    path: '', component: EscalationsComponent, children: [
      {path: '', component: IndexComponent},
      {path: 'manage', component: ManageComponent},      // tvs
      {path: 'form', component: ManageFormComponent},    // tvsib
      {path: 'form/:ppfrid', component: ManageFormComponent},    // tvsib
      {path: 'index', component: IndexComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscalationsPpfrRoutingModule { }
