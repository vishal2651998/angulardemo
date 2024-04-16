import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { RoleMappingComponent } from './system-settings/role-mapping/role-mapping.component';
import { MessageComponent } from './system-settings/message/message.component';
import { AllowedDomainsComponent } from './system-settings/allowed-domains/allowed-domains.component';
import { LoginbgDomainComponent } from './system-settings/loginbg-domain/loginbg-domain.component';
import { RecentThreadTabComponent } from './system-settings/recent-thread-tab/recent-thread-tab.component';
import { WelcomeMessageComponent } from './system-settings/welcome-message/welcome-message.component';
import { DirectoryConfigComponent } from './system-settings/directory-config/directory-config.component';
import { MessagePopupComponent } from './system-settings/message-popup/message-popup.component';

const routes: Routes = [
  {path: '', component: SystemSettingsComponent, children: [
    {path: '', component: MessageComponent},   
    {path: 'messages', component: MessageComponent},
    {path: 'roles-mapping', component: RoleMappingComponent},
    {path: 'allowed-domains', component: AllowedDomainsComponent},
    {path: 'loginbg-domain', component: LoginbgDomainComponent},
    {path: 'recent-thread-tab', component: RecentThreadTabComponent},
    {path: 'welcome-message', component: WelcomeMessageComponent},
    {path: 'directory', component: DirectoryConfigComponent},
    {path: 'message-popup', component: MessagePopupComponent},
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule { }
