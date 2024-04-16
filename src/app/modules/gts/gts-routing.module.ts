import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditComponent } from "./gts/edit/edit.component";
import { GtsComponent } from "./gts/gts.component";
import { IndexComponent } from "./gts/index/index.component";
import { NewComponent } from "./gts/new/new.component";
import { StartComponent } from './gts/start/start.component';
import { ViewComponent } from "./gts/view/view.component";
import { LayoutComponent } from './layout/layout.component';
import { GtsSessionsComponent } from './gts/gts-sessions/gts-sessions.component';
import { SessionsListComponent } from "./gts/sessions-list/sessions-list.component";
import { SessionSummaryComponent } from "./gts/session-summary/session-summary.component";

const routes: Routes = [
  {
    path: "",
    component: GtsComponent,
    children: [
      { path: "", component: IndexComponent, data: { reuseRoute: true } },
      { path: "new", component: NewComponent },
      { path: "view/:gid", component: ViewComponent },
      { path: "session-list/:gid", component: SessionsListComponent },
      { path: "edit/:gid", component: EditComponent },
      { path: "edit/:gid/:actionId", component: EditComponent },
      { path: "duplicate/:gid", component: EditComponent },
      { path: 'start/:gid', component: LayoutComponent },
      { path: 'session/:sessionid', component: GtsSessionsComponent },
      { path: 'summary/:sessionId/:summaryId', component: SessionSummaryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GtsRoutingModule { }
