import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from "primeng/inputswitch";

import { UserSettingsV2RoutingModule } from './user-settings-v2-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { IndexComponent } from './user-settings/index/index.component';


@NgModule({
  declarations: [
    UserSettingsComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InputSwitchModule,
    RadioButtonModule,
    UserSettingsV2RoutingModule
  ]
})
export class UserSettingsV2Module { }
