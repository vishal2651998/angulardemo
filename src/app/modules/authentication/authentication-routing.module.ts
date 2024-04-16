import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { EmailverificationComponent } from './components/auth/emailverification/emailverification.component';
import { UrlnotfoundComponent } from './components/auth/urlnotfound/urlnotfound.component';
import { IntegrationComponent } from './components/auth/integration/integration.component';
import { LoginLandingComponent } from './components/auth/login-landing/login-landing.component';
import { IndexComponent } from './components/auth/index/index.component';
import { SignupServicesComponent } from './components/auth/signup-services/signup-services.component';
import { ViewPublicComponent } from './components/auth/view-public/view-public.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      {path: '', component: LoginComponent},
      {path: 'login', component: LoginComponent},
      {path: 'login-index', component: LoginComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'signup-services', component: SignupServicesComponent},
      {path: 'resetpassword', component: ResetpasswordComponent},
      {path: 'emailverification', component: EmailverificationComponent},
      {path: 'urlnotfound', component: UrlnotfoundComponent},
      {path: 'integration', component: IntegrationComponent},
      {path: 'login-type', component: LoginLandingComponent},         
      {path: 'login-index/:id', component: IndexComponent},  
      {path: 'thread-view', component: ViewPublicComponent},       
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
