import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PresetsRoutingModule } from './presets-routing.module';
import { IndexComponent } from './presets/index/index.component';
import { PresetsComponent } from './presets/presets.component';


@NgModule({
  declarations: [
    IndexComponent,
    PresetsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PresetsRoutingModule
  ]
})
export class PresetsModule { }
