import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

import { LandingpageComponent } from '../../components/landingpage/landingpage.component';
import { IndexComponent } from '../../components/landingpage/index/index.component';
import { LandingpageRoutingModule } from './landingpage-routing.module';
import { AddManagerComponent } from '../../components/landingpage/add-manager/add-manager.component';

import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [LandingpageComponent,IndexComponent,AddManagerComponent],
  imports: [
    CommonModule,
    LandingpageRoutingModule,
    SharedModule,
    InputTextModule
    
  ]
})
export class LandingpageModule { }
