import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkstreamsLandingRoutingModule } from './workstreams-landing-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LandingLeftSideMenuComponent } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { WorkstreamPageComponent } from './workstream-page/workstream-page.component';
import { IndexComponent } from './workstream-page/index/index.component';

@NgModule({
  declarations: [WorkstreamPageComponent,IndexComponent],
  imports: [
    CommonModule,
    WorkstreamsLandingRoutingModule,
    SharedModule
  ]
})
export class WorkstreamsLandingModule { }
