import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingpageComponent } from '../../components/landingpage/landingpage.component';
import { IndexComponent } from '../../components/landingpage/index/index.component';
import { AddManagerComponent } from '../../components/landingpage/add-manager/add-manager.component';
const routes: Routes = [
  {path: '', component: LandingpageComponent, children: [
    {path: '', component: IndexComponent},
    {path: 'add-manager', component: AddManagerComponent},
   // {path: 'inactive', component: InactiveComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingpageRoutingModule { }
