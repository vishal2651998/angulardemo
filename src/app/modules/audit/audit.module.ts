import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditComponent } from './audit/audit.component';
import { IndexComponent } from './audit/index/index.component';
import { ViewComponent } from './audit/view/view.component';
import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    AuditComponent,
    IndexComponent,
    ViewComponent
  ],
  imports: [
    TreeModule,
    CommonModule,
    SharedModule,
    AuditRoutingModule
  ]
})
export class AuditModule { }
