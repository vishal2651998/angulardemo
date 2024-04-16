import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { RoleMappingComponent } from './system-settings/role-mapping/role-mapping.component';
import { MessageComponent } from './system-settings/message/message.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { AllowedDomainsComponent } from './system-settings/allowed-domains/allowed-domains.component';
import { LoginbgDomainComponent } from './system-settings/loginbg-domain/loginbg-domain.component';
import { RecentThreadTabComponent } from './system-settings/recent-thread-tab/recent-thread-tab.component';
import { WelcomeMessageComponent } from './system-settings/welcome-message/welcome-message.component';
import { DirectoryConfigComponent } from './system-settings/directory-config/directory-config.component';
import { MessagePopupComponent } from './system-settings/message-popup/message-popup.component';

@NgModule({
  declarations: [
    SystemSettingsComponent,
    RoleMappingComponent,
    MessageComponent,
    AllowedDomainsComponent,
    LoginbgDomainComponent,
    RecentThreadTabComponent,
    WelcomeMessageComponent,
    DirectoryConfigComponent,
    MessagePopupComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemSettingsRoutingModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
  ]
})
export class SystemSettingsModule { }
