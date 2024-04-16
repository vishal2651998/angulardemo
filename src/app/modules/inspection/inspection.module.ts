import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionComponent } from './inspection/inspection.component';
import { IndexComponent } from './inspection/index/index.component';

@NgModule({
  declarations: [
    InspectionComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InspectionRoutingModule
  ]
})
export class InspectionModule { }
