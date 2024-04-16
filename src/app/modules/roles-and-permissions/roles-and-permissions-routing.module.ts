import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesAndPermissionsComponent } from 'src/app/components/roles-and-permissions/roles-and-permissions.component';
import { IndexComponent } from 'src/app/components/roles-and-permissions/index/index.component';

const routes: Routes = [
  {
    path: '', component: RolesAndPermissionsComponent, children: [
      {path: '', component: IndexComponent },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesAndPermissionsRoutingModule { }
