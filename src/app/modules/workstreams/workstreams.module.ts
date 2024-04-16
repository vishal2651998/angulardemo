import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { WorkstreamsRoutingModule } from './workstreams-routing.module';
import { WorkstreamsComponent } from '../../components/workstreams/workstreams/workstreams.component';
import { IndexComponent } from '../../components/workstreams/index/index.component';
import { NewComponent } from '../../components/workstreams/new/new.component';
import { EditComponent } from '../../components/workstreams/edit/edit.component';
import { ViewComponent } from '../../components/workstreams/view/view.component';

@NgModule({
  declarations: [
    WorkstreamsComponent,
    IndexComponent,
    NewComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    SharedModule,
    WorkstreamsRoutingModule
  ]
})
export class WorkstreamsModule { }
