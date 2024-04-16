import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerModule,
} from "@angular/platform-browser";
import { GestureConfig, MatDialogModule, MatGridListModule, MatSnackBarModule, MatTooltipModule } from "@angular/material";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './router-strategy';

import {
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
} from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./components/home/home.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { ForbiddenComponent } from "./components/forbidden/forbidden.component";
import { ScrollTopService } from "./services/scroll-top.service";
import { WebsiteComponent } from "./components/website/website/website.component";
import { DatePipe } from "@angular/common";
// import { ChatscrollDirective } from './common/directive/chatscroll.directive';
import { BaseModule } from "./modules/base/base.module";
import { UploadErrorComponent } from "./components/common/upload-error/upload-error.component";
import { AppPublisherComponent } from "./app-publisher/app-publisher.component";
import { AppSubscriberComponent } from "./app-subscriber/app-subscriber.component";
import { VideoCallComponent } from './video-call/video-call.component';
import { RejoinCallComponent } from './rejoin-call/rejoin-call.component';
import { ActiveUsersComponent } from "./modules/chat/active-users/active-users.component";
import { GlobalPopupComponent } from './global-popup/global-popup.component';
import { DeepLinkComponent } from './components/deep-link/deep-link.component';
import { EmailNotFoundComponent } from './components/common/email-not-found/email-not-found.component';
import { UnderMaintenanceComponent } from './components/under-maintenance/under-maintenance.component';
import { NoPermissionComponent } from './components/common/no-permission/no-permission.component';
import { NoActiveUsersComponent } from './components/common/no-active-users/no-active-users.component';
import { ConvertComponent } from './components/common/convert/convert.component';
import { CheckboxModule } from "primeng/checkbox";
import { MenuModule } from 'primeng/menu';
import { localDatePipe } from "./modules/headquarters/headquarters/locaDatePipe";
import { RuntimeCardWrapperComponent } from './runtime/runtime-card-wrapper/runtime-card-wrapper.component';
import { RuntimeInfoComponent } from './runtime/runtime-info/runtime-info.component';
import { RuntimeInputsComponent } from './runtime/runtime-inputs/runtime-inputs.component';
import { RuntimeChecksComponent } from './runtime/runtime-checks/runtime-checks.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PagenotfoundComponent,
    ForbiddenComponent,
    WebsiteComponent,
    UploadErrorComponent,
    DeepLinkComponent,    
    EmailNotFoundComponent,        
    AppPublisherComponent,
    AppSubscriberComponent,
    VideoCallComponent,
    RejoinCallComponent,
    GlobalPopupComponent,
    DeepLinkComponent,
    UnderMaintenanceComponent,
    NoPermissionComponent,
    NoActiveUsersComponent,
    ConvertComponent,
    RuntimeCardWrapperComponent,
    RuntimeInfoComponent,
    RuntimeInputsComponent,
    RuntimeChecksComponent,
    //ChatscrollDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    BaseModule,
    HammerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatGridListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MenuModule,
    CheckboxModule ,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
          clientId: '4e835741-d75c-4fbe-bf8a-13f6a7788ddd',
          postLogoutRedirectUri: 'https://collabtic.fieldpulse.co/auth/integration'
      }
  }), null, null)
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},

    MatMomentDateModule,
    MatDatepickerModule,
    MatDialogModule,
    ScrollTopService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ActiveUsersComponent]
})
export class AppModule { }
