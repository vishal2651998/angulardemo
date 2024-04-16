import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './components/profile/profile.component';
import { IndexComponent } from './components/profile/index/index.component';

const routes: Routes = [
  {
    path: '', component: ProfileComponent, children: [
      {path: '', component: IndexComponent, data: {reuseRoute: true}},      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
