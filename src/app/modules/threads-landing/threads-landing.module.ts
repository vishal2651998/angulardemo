import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {ToastModule} from 'primeng/toast';
import { ThreadsLandingRoutingModule } from './threads-landing-routing.module';
import { ThreadspageComponent } from './threadspage/threadspage.component';
import { IndexComponent } from './threadspage/index/index.component';
import {DropdownModule} from 'primeng/dropdown';
import { ManageComponent } from './threadspage/manage/manage.component';
import { ViewComponent } from './threadspage/view/view.component';
import {NgxPrintModule} from 'ngx-print';
import { ViewV2Component } from './threadspage/view-v2/view-v2.component';
import { ViewNewComponent } from './threadspage/view-new/view-new.component';
import { ViewV3Component } from './threadspage/view-v3/view-v3.component';

@NgModule({
  declarations: [ThreadspageComponent,IndexComponent, ManageComponent, ViewComponent, ViewV2Component, ViewNewComponent, ViewV3Component],
  imports: [
    CommonModule,
    ThreadsLandingRoutingModule,
    SharedModule,
    DropdownModule,
    NgxPrintModule,
    ToastModule
  ]
})
export class ThreadsLandingModule { }
