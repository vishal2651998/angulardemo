import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { IndexComponent } from './user-settings/index/index.component';

const routes: Routes = [
  { path: '', component: UserSettingsComponent, children: [
      { path: '', component: IndexComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsV2RoutingModule { }
