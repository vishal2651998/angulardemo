import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesAndPermissionsRoutingModule } from './roles-and-permissions-routing.module';
import { RolesAndPermissionsComponent } from 'src/app/components/roles-and-permissions/roles-and-permissions.component';
import { SharedModule } from '../shared/shared.module';
import { IndexComponent } from 'src/app/components/roles-and-permissions/index/index.component';

@NgModule({
  declarations: [RolesAndPermissionsComponent, IndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    RolesAndPermissionsRoutingModule,
  ]
})
export class RolesAndPermissionsModule { }

