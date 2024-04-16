import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { IndexComponent } from './user-settings/index/index.component';
import { DispatchConfigComponent } from './user-settings/dispatch-config/dispatch-config.component';
import { ThreadConfigComponent } from './user-settings/thread-config/thread-config.component';
import { PushConfigComponent } from './user-settings/push-config/push-config.component';
import { EmailNotificationsComponent } from './user-settings/email-notifications/email-notifications.component';
import { PushNotificationsComponent } from './user-settings/push-notifications/push-notifications.component';
import { MakeNotificationsComponent } from './user-settings/make-notifications/make-notifications.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
    UserSettingsComponent,
    IndexComponent,
    DispatchConfigComponent,
    ThreadConfigComponent,
    PushConfigComponent,
    EmailNotificationsComponent,
    PushNotificationsComponent,
    MakeNotificationsComponent
  ],
  imports: [
    RadioButtonModule,
    CommonModule,
    SharedModule,
    UserSettingsRoutingModule
  ]
})
export class UserSettingsModule { }
