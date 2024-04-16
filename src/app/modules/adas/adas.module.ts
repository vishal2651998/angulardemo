import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AdasRoutingModule } from './adas-routing.module';
import { AdasComponent } from './adas/adas.component';
import { IndexComponent } from './adas/index/index.component';
import { ManageComponent } from './adas/manage/manage.component';
import { ViewComponent } from './adas/view/view.component';


@NgModule({
  declarations: [
    AdasComponent,
    IndexComponent,
    ManageComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdasRoutingModule
  ]
})
export class AdasModule { }
