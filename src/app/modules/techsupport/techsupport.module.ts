import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TechsupportRoutingModule } from './techsupport-routing.module';
import { TechsupportComponent } from './components/techsupport/techsupport.component';
import { IndexComponent } from './components/techsupport/index/index.component';
import {MatMenuModule} from '@angular/material/menu';
import { AssignmentRulesComponent } from './components/techsupport/assignment-rules/assignment-rules.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    TechsupportComponent,
    IndexComponent,
    AssignmentRulesComponent
  ],
  imports: [
    CommonModule,
    TechsupportRoutingModule,
    SharedModule,
    MatMenuModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
  ]
})
export class TechsupportModule { }
