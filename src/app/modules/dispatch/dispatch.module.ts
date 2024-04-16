import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import { IndexComponent } from './dispatch/index/index.component';
import { SharedModule } from '../shared/shared.module';
import {DragDropModule} from 'primeng/dragdrop';


@NgModule({
  declarations: [DispatchComponent, IndexComponent],
  imports: [
    CommonModule,
    DispatchRoutingModule,
    SharedModule,
    DragDropModule
  ]
})
export class DispatchModule { }
