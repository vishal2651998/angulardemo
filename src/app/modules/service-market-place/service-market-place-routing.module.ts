import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceMarketPlaceComponent } from 'src/app/components/service-market-place/service-market-place.component';
import { IndexComponent } from 'src/app/components/service-market-place/index/index.component';
import { MarketPlaceInnerPageComponent } from 'src/app/components/service-market-place/market-place-inner-page/market-place-inner-page.component';
import { MarketPlaceManualsComponent } from 'src/app/components/service-market-place/market-place-manuals/market-place-manuals.component';
import { ManageNewComponent } from 'src/app/components/service-market-place/manage-new/manage-new.component';
import { ViewComponent } from 'src/app/components/service-market-place/view/view.component';
import { ViewManualComponent } from 'src/app/components/service-market-place/view-manual/view-manual.component';
import { ManageDomainComponent } from 'src/app/components/service-market-place/manage-domain/manage-domain.component';
import { MarketPlaceQuizTopicsComponent } from 'src/app/components/service-market-place/market-place-quiz-topics/market-place-quiz-topics.component';
import { MarketPlaceQuizQuestionsListComponent } from 'src/app/components/service-market-place/market-place-quiz-questions-list/market-place-quiz-questions-list.component';
import { ManageRepairfyDomainComponent } from 'src/app/components/service-market-place/manage-repairfy-domain/manage-repairfy-domain.component';
import { MarketPlaceCustomersComponent } from 'src/app/components/service-market-place/market-place-customers/market-place-customers.component';
import { MarketPlaceSettingsComponent } from 'src/app/components/service-market-place/market-place-settings/market-place-settings.component';
import { MarketPlacePoliciesComponent } from 'src/app/components/service-market-place/market-place-policies/market-place-policies.component';
import { ManageNewManualComponent } from 'src/app/components/service-market-place/manage-new-manual/manage-new-manual.component';
import { MarketPlaceReportsComponent } from 'src/app/components/service-market-place/market-place-reports/market-place-reports.component';
import { MarketPlaceReportDetailsComponent } from 'src/app/components/service-market-place/market-place-report-details/market-place-report-details.component';
import { CartComponent } from 'src/app/components/service-market-place/cart/cart.component';

const routes: Routes = [
  {path: '', component: ServiceMarketPlaceComponent, children: [
    { path: "", component: IndexComponent, data: {reuseRoute: true} },
    { path: "training", component: MarketPlaceInnerPageComponent, data: {reuseRoute: true} },
    { path: "manuals", component: MarketPlaceManualsComponent, data: {reuseRoute: true} },
    { path: "quiz-topics", component: MarketPlaceQuizTopicsComponent },
    { path: "quiz-topics/:type", component: MarketPlaceQuizQuestionsListComponent },
    { path: "manage", component: ManageNewComponent },
    { path: "manage-manual", component: ManageNewManualComponent },
    { path: "domain", component: ManageDomainComponent },
    { path: "domain/repairfy", component: ManageRepairfyDomainComponent },
    { path: "manage/edit/:id", component: ManageNewComponent },
    { path: "manage-manual/edit/:id", component: ManageNewManualComponent },
    { path: "manage/duplicate/:id", component: ManageNewComponent },
    { path: "view/:id", component: ViewComponent },
    { path: "view-manual/:id", component: ViewManualComponent },
    { path: "customers", component: MarketPlaceCustomersComponent },
    { path: "settings", component: MarketPlaceSettingsComponent},
    { path: "policies", component: MarketPlacePoliciesComponent},
    { path: "reports", component: MarketPlaceReportsComponent},
    { path: "report-details/:id", component: MarketPlaceReportDetailsComponent},
    { path: "cart", component: CartComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ServiceMarketPlaceRoutingModule { }
