import { ActionButtonComponent } from './gts/action-button/action-button.component';
import { CommonModule } from "@angular/common";
import { EditComponent } from "./gts/edit/edit.component";
import { FileAttachmentComponent } from "./gts/file-attachment/file-attachment.component";
import { GtsComponent } from "./gts/gts.component";
import { GtsRoutingModule } from "./gts-routing.module";
import { GtsSidebarComponent } from 'src/app/layouts/gts-sidebar/gts-sidebar.component';
import { IndexComponent } from "./gts/index/index.component";
import { LayoutComponent } from './layout/layout.component';
import { MatDividerModule } from '@angular/material/divider';
import { NewComponent } from "./gts/new/new.component";
import { NgModule } from "@angular/core";
import { PopupComponent } from './gts/popup/popup.component';
import { ProcedureComponent } from './gts/procedure/procedure.component';
import { SharedModule } from "../shared/shared.module";
import { StartComponent } from './gts/start/start.component';
import { SummaryFormComponent } from './gts/summary-form/summary-form.component';
import { UserInputComponent } from './gts/user-input/user-input.component';
import { ViewComponent } from "./gts/view/view.component";
import { GtsSessionsComponent } from './gts/gts-sessions/gts-sessions.component';
import { SessionsListComponent } from './gts/sessions-list/sessions-list.component';
import { TableModule } from 'primeng/table';
import { SessionSummaryComponent } from './gts/session-summary/session-summary.component';

@NgModule({
  declarations: [
    GtsComponent,
    IndexComponent,
    NewComponent,
    EditComponent,
    ViewComponent,
    StartComponent,
    GtsSidebarComponent,
    LayoutComponent,
    ProcedureComponent,
    ActionButtonComponent,
    PopupComponent,
    SummaryFormComponent,
    UserInputComponent,
    FileAttachmentComponent,
    GtsSessionsComponent,
    SessionsListComponent,
    SessionSummaryComponent
  ],
  imports: [SharedModule, CommonModule, GtsRoutingModule,
    MatDividerModule, TableModule
  ],
  providers: [],
})
export class GtsModule { }
