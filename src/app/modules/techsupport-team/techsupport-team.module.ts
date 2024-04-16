import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TechsupportTeamRoutingModule } from './techsupport-team-routing.module';
import { TechsupportTeamComponent } from './techsupport-team/techsupport-team.component';
import { IndexComponent } from './techsupport-team/index/index.component';
import {MatMenuModule} from '@angular/material/menu';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { ManageComponent } from './techsupport-team/manage/manage.component';

@NgModule({
  declarations: [
    TechsupportTeamComponent,
    IndexComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TechsupportTeamRoutingModule,
    MatMenuModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
  ]
})
export class TechsupportTeamModule { }
