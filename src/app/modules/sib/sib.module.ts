import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SibRoutingModule } from './sib-routing.module';
import { SibComponent } from './components/sib/sib.component';
import { IndexComponent } from './components/sib/index/index.component';
import { ManageComponent } from './components/sib/manage/manage.component';
import { ViewComponent } from './components/sib/view/view.component';


@NgModule({
  declarations: [
    SibComponent,
    IndexComponent,
    ManageComponent,
    ViewComponent,
  ],
  imports: [
    SharedModule,
    SibRoutingModule
  ]
})
export class SibModule { }
