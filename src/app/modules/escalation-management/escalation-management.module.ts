import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

import { EscalationManagementRoutingModule } from './escalation-management-routing.module';
import { ComponentsComponent } from './components/components.component';
import { EscalationMatrixComponent } from './components/escalation-matrix/escalation-matrix.component';
import { IndexComponent } from './components/escalation-matrix/index/index.component';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';
import { MatTooltipModule } from '@angular/material';
import { SeeMoreComponent } from './components/escalation-matrix/see-more/see-more.component';
import { EscalationLevelComponent } from './components/escalation-level/escalation-level.component';
@NgModule({
  declarations: [
    ComponentsComponent,
    EscalationMatrixComponent,
    IndexComponent,
    SeeMoreComponent,
    EscalationLevelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EscalationManagementRoutingModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    RippleModule,
    MatTooltipModule
  ]
})
export class EscalationManagementModule { }
