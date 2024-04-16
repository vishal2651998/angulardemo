import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { OpportunityRoutingModule } from './opportunity-routing.module';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { IndexComponent } from './opportunity/index/index.component';
import { ManageComponent } from './opportunity/manage/manage.component';
import { ViewComponent } from './opportunity/view/view.component';


@NgModule({
  declarations: [
    OpportunityComponent,
    IndexComponent,
    ManageComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OpportunityRoutingModule
  ]
})
export class OpportunityModule { }
