import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DtcRoutingModule } from './dtc-routing.module';
import { DtcComponent } from './components/dtc/dtc.component';
import { IndexComponent } from './components/dtc/index/index/index.component';
import { TableModule } from "primeng/table";


@NgModule({
  declarations: [
    DtcComponent,
    IndexComponent
  ],
  imports: [
    SharedModule,
    TableModule,
    DtcRoutingModule
  ]
})
export class DtcModule { }
