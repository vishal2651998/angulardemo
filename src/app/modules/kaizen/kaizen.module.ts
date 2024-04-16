import { NgModule } from '@angular/core';
import { KaizenRoutingModule } from './kaizen-routing.module';
import { KaizenComponent } from './kaizen/kaizen.component';
import { IndexComponent } from './kaizen/index/index.component';
import { SharedModule } from '../shared/shared.module';
import { BaseModule } from "../base/base.module";
import { TableModule } from "primeng/table";
import { ManageComponent } from './kaizen/manage/manage.component';
import { ViewComponent } from './kaizen/view/view.component';
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  declarations: [
    KaizenComponent,
    IndexComponent,
    ManageComponent,
    ViewComponent
  ],
  imports: [
    SharedModule,
    BaseModule,
    TableModule,
    KaizenRoutingModule,
    MultiSelectModule
  ]
})
export class KaizenModule { }
