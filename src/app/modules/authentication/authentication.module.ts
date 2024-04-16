import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { AuthSuccessComponent } from './components/auth/auth-success/auth-success.component';
import { EmailverificationComponent } from './components/auth/emailverification/emailverification.component';
import { LoginComponent } from './components/auth/login/login.component';
import { UrlnotfoundComponent } from './components/auth/urlnotfound/urlnotfound.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { IntegrationComponent } from './components/auth/integration/integration.component';

import { BaseModule } from '../base/base.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';
import { TvsssoComponent } from './components/auth/tvssso/tvssso.component';
import { LoginLandingComponent } from './components/auth/login-landing/login-landing.component';
import { IndexComponent } from './components/auth/index/index.component';
import { SignupServicesComponent } from './components/auth/signup-services/signup-services.component';
import { ViewPublicComponent } from './components/auth/view-public/view-public.component';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.auth.clientId,
      authority: environment.auth.authority,
      redirectUri: environment.auth.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: ['user.read']
    }
  };
}
@NgModule({
  declarations: [
    AuthComponent,
    AuthSuccessComponent,
    EmailverificationComponent,
    LoginComponent,
    UrlnotfoundComponent,
    ResetpasswordComponent,
    SignupComponent    ,
    IntegrationComponent,
    TvsssoComponent,
    LoginLandingComponent,
    IndexComponent,
    SignupServicesComponent,
    ViewPublicComponent
  ], 
  imports: [
    SharedModule,
    BaseModule,
    AuthenticationRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
      MsalService,
      MsalGuard,
      MsalBroadcastService
  ],
  bootstrap: [MsalRedirectComponent]
})
export class AuthenticationModule { }
