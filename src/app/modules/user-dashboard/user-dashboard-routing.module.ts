import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDashboardComponent } from '../../components/user-dashboard/user-dashboard.component';
import { IndexComponent } from '../../components/user-dashboard/index/index.component';
const routes: Routes = [
  {path: '', component: UserDashboardComponent, children: [
    {path: '', component: IndexComponent},
   // {path: 'inactive', component: InactiveComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
