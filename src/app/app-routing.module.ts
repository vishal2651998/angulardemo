import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { ForbiddenComponent } from "./components/forbidden/forbidden.component";
import { AuthGuard } from "./components/_helpers/auth.guard";
import { VideoCallComponent } from './video-call/video-call.component';
import { DeepLinkComponent } from './components/deep-link/deep-link.component';
import { EscalationWidgetsComponent } from './components/common/escalation-widgets/escalation-widgets.component';
import { UnderMaintenanceComponent } from './components/under-maintenance/under-maintenance.component';
import { NoPermissionComponent } from "./components/common/no-permission/no-permission.component";
import { NoActiveUsersComponent } from './components/common/no-active-users/no-active-users.component';
import { AddSectionComponent } from "./modules/headquarters/add-section/add-section.component";
import { AddTemplateComponent } from "./modules/headquarters/add-template/add-template.component";
import { AddInspectionComponent } from "./modules/headquarters/add-inspection/add-inspection.component";
import { InspectionLocationListComponent } from './modules/headquarters/inspection-location-list/inspection-location-list.component';
import { SectionComponent } from "./modules/headquarters/section/section.component";
import { TemplateComponent } from "./modules/headquarters/template/template.component";
import { InspectionsComponent } from "./modules/headquarters/inpsections/inpsections.component";
import { InspectionSummaryComponent } from "./modules/headquarters/inspection-summary/inspection-summary.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      (window.location.hostname === 'marketplace.collabtic.com' || window.location.hostname === 'atgtraining-stage.collabtic.com') ? import('./modules/service-provider/service-provider.module').then(
        (m) => m.ServiceProviderModule
      ) : import('./modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId",
    component: HomeComponent,
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId/:workstreamId",
    component: HomeComponent,
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId/:action/:actionId",
    component: HomeComponent,
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "mis/dashboard",
    loadChildren: () =>
      import("./modules/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard-v2",
    loadChildren: () =>
      import("./modules/dashboard-v2/dashboard-v2.module").then(
        (m) => m.DashboardV2Module
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "workstreams",
    loadChildren: () =>
      import("./modules/workstreams/workstreams.module").then(
        (m) => m.WorkstreamsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forbidden",
    component: ForbiddenComponent,
  },
  {
    path: "product-matrix",
    loadChildren: () =>
      import("./modules/product-matrix/product-matrix.module").then(
        (m) => m.ProductMatrixModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "parts",
    loadChildren: () =>
      import("./modules/parts/parts.module").then((m) => m.PartsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "user-dashboard",
    loadChildren: () =>
      import("./modules/user-dashboard/user-dashboard.module").then(
        (m) => m.UserDashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "export-option",
    loadChildren: () =>
      import("./modules/export-option/export-option.module").then(
        (m) => m.ExportOptionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "landing-page",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/landingpage/landingpage.module").then(
        (m) => m.LandingpageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "marketplace",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/service-provider/service-provider.module").then(
        (m) => m.ServiceProviderModule
      ),
  },
  {
    path: "market-place",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/service-market-place/service-market-place.module").then(
        (m) => m.ServiceMarketPlaceModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "media-manager",
    loadChildren: () =>
      import("./modules/media-manager/media-manager.module").then(
        (m) => m.MediaManagerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "escalations",
    loadChildren: () =>
      import("./modules/escalations/escalations.module").then(
        (m) => m.EscalationsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ppfr",
    loadChildren: () =>
      import("./modules/escalations-ppfr/escalations-ppfr.module").then(
        (m) => m.EscalationsPpfrModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "chat-page",
    loadChildren: () =>
      import("./modules/chat/chat.module").then((m) => m.ChatModule),
    canActivate: [AuthGuard],
  },
  {
    path: "workstreams-page",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/workstreams-landing/workstreams-landing.module").then(
        (m) => m.WorkstreamsLandingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "search-page",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/search/search.module").then((m) => m.SearchModule),
    canActivate: [AuthGuard],
  },
  {
    path: "threads",
    loadChildren: () =>
      import("./modules/threads-landing/threads-landing.module").then(
        (m) => m.ThreadsLandingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "threads/shareFix",
    loadChildren: () =>
      import("./modules/threads-landing/threads-landing.module").then(
        (m) => m.ThreadsLandingModule
      ),
    canActivate: [AuthGuard],
  },
  
  {
    path: "knowledgearticles",
    loadChildren: () =>
      import(
        "./modules/knowledge-article-landing/knowledge-article.module"
      ).then((m) => m.KnowledgeArticleModule),
    canActivate: [AuthGuard],
  },
  {
    path: "gts",
    loadChildren: () => import("./modules/gts/gts.module").then((m) => m.GtsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "new-section",
    component:AddSectionComponent
  },
  {
    path: "edit-section/:id",
    component:AddSectionComponent
  },
  {
    path: "section/:networkId/:id",
    component:SectionComponent
  },
  {
    path: "template/:id",
    component:TemplateComponent
  },
  {
    path: "inspection/:id",
    component:InspectionsComponent
  },
  {
    path: "inspection/:id/summary",
    component:InspectionSummaryComponent
  },
  {
    path: "new-template",
    component:AddTemplateComponent
  },
  {
    path: "edit-template/:id",
    component:AddTemplateComponent
  },
  {
    path: "new-inspection",
    component:AddInspectionComponent
  },
  {
    path: "edit-inspection/:id",
    component:AddInspectionComponent
  },
  {
    path: "inspection-location",
    component:InspectionLocationListComponent
  },
  {
    path: "profile/:puid",
    loadChildren: () =>
      import("./modules/profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: "documents",
    loadChildren: () =>
      import("./modules/techinfopro/techinfopro.module").then(
        (m) => m.TechinfoproModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "announcements",
    loadChildren: () =>
      import("./modules/announcement/announcement.module").then(
        (m) => m.AnnouncementModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'escalation-tvs',
    component: EscalationWidgetsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "sib",
    loadChildren: () =>
      import("./modules/sib/sib.module").then((m) => m.SibModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'video-call',
    component: VideoCallComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'video-call/:sessionId/:token',
    component: VideoCallComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "knowledge-base",
    loadChildren: () =>
      import("./modules/knowledge-base/knowledge-base.module").then((m) => m.KnowledgeBaseModule),
    canActivate: [AuthGuard],
  },
  {
    path: "escalation-management",
    loadChildren: () =>
      import("./modules/escalation-management/escalation-management.module").then((m) => m.EscalationManagementModule),
    canActivate: [AuthGuard],
  },
  {
    path: "under-maintenance",
    component: UnderMaintenanceComponent,
  },
  {
    path: "deep-link",
    component: DeepLinkComponent,
  },
  {
    path: "dtc",
    loadChildren: () =>
      import("./modules/dtc/dtc.module").then((m) => m.DtcModule),
    canActivate: [AuthGuard],
  },
  {
    path: "directory",
    loadChildren: () =>
      import("./modules/directory/directory.module").then((m) => m.DirectoryModule),
    canActivate: [AuthGuard],
  },
  {
    path: "dispatch",
    loadChildren: () =>
      import("./modules/dispatch/dispatch.module").then(
        (m) => m.DispatchModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "standard-reports",
    loadChildren: () =>
      import("./modules/standard-report/standard-report.module").then(
        (m) => m.StandardReportModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "roles-permissions",
    loadChildren: () => import("./modules/roles-and-permissions/roles-and-permissions.module").then((m) => m.RolesAndPermissionsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "techsupport",
    loadChildren: () =>
      import("./modules/techsupport/techsupport.module").then((m) => m.TechsupportModule),
    canActivate: [AuthGuard],
  },
  {
    path: "kaizen",
    loadChildren: () =>
      import("./modules/kaizen/kaizen.module").then(
        (m) => m.KaizenModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "opportunity",
    loadChildren: () =>
      import("./modules/opportunity/opportunity.module").then(
        (m) => m.OpportunityModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "presets",
    loadChildren: () =>
      import("./modules/presets/presets.module").then(
        (m) => m.PresetsModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "bug_and_features",
    loadChildren: () =>
    import("./modules/bugs_and_features/bugs-and-features.module").then(
      (m) => m.BugsAndFeaturesModule),
      canActivate: [AuthGuard],
  },
  {
    path: "system-settings",
    loadChildren: () =>
      import("./modules/system-settings/system-settings.module").then(
        (m) => m.SystemSettingsModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "techsupport-team",
    loadChildren: () =>
      import("./modules/techsupport-team/techsupport-team.module").then((m) => m.TechsupportTeamModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "shops",
    loadChildren: () => import("./modules/shop/shop.module").then((m) => m.ShopModule),
    canActivate: [AuthGuard],
  },
  {
    path: "audit",
    loadChildren: () => import("./modules/audit/audit.module").then((m) => m.AuditModule),
    canActivate: [AuthGuard],
  },
  {
    path: "inspection",
    loadChildren: () => import("./modules/inspection/inspection.module").then((m) => m.InspectionModule),
    canActivate: [AuthGuard],
  },
  {
    path: "user-settings",
    loadChildren: () =>
      import("./modules/user-settings/user-settings.module").then(
        (m) => m.UserSettingsModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "user-settings-v2",
    loadChildren: () =>
      import("./modules/user-settings-v2/user-settings-v2.module").then(
        (m) => m.UserSettingsV2Module
      ),
      canActivate: [AuthGuard],
  },
  {
    path: "repair-order",
    loadChildren: () =>
      import("./modules/repair-order/repair-order.module").then(
        (m) => m.RepairOrderModule
      )
  },
  {
    path: "faq",
    loadChildren: () => import("./modules/faq/faq.module").then((m) => m.FaqModule),
    canActivate: [AuthGuard],
  },
  {
    path: "customers",
    loadChildren: () => import("./modules/customers/customers.module").then((m) => m.CustomersModule),
    canActivate: [AuthGuard],
  },
  {
    path: "adas-procedure",
    loadChildren: () => import("./modules/adas/adas.module").then((m) => m.AdasModule),
    canActivate: [AuthGuard],
  },
  {
    path: "no-permission",
    component : NoPermissionComponent
  },
  {
    path: "no-active-users",
    component : NoActiveUsersComponent
  },
  {
    path: "marketplacelanding",
    loadChildren: () =>
    import("./modules/marketplace-landing/marketplace-landing.module").then(
      (m) => m.MarketplaceLandingModule
    ),    
  },
  {
    path: "headquarters",
    loadChildren: () => import("./modules/headquarters/headquarters.module").then((m) => m.HeadquartersModule),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: "legacy",
      scrollPositionRestoration: "disabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
