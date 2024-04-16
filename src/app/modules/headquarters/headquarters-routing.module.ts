import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeadquartersComponent } from './headquarters/headquarters.component';
import { IndexComponent } from './headquarters/index/index.component';
import { HomeComponent } from './headquarters/home/home.component';
import { RegionsComponent } from './regions/regions.component';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { HeadquarterToolsAndEquipmentsComponent } from './headquarter-tools-and-equipments/headquarter-tools-and-equipments.component';
import { HeadquarterShopComponent } from './headquarter-shop/headquarter-shop.component';
import { HeadquarterSummaryComponent } from './headquarter-summary/headquarter-summary.component';
import { HeadquartersShopDetailsComponent } from './headquarters-shop-details/headquarters-shop-details.component';
import { ShopDetailSummaryComponent } from '../shop/shop-detail-summary/shop-detail-summary.component';
import { ShopDetailToolsComponent } from '../shop/shop-detail-tools/shop-detail-tools.component';
import { ShopDetailUsersComponent } from '../shop/shop-detail-users/shop-detail-users.component';
import { ShopDetailFacilityComponent } from '../shop/shop-detail-facility/shop-detail-facility.component';
import { ShopDetailInspectionComponent } from '../shop/shop-detail-inspection/shop-detail-inspection.component';
import { AllUsersHeadquarterComponent } from './all-users-headquarter/all-users-headquarter.component';
import { AllToolsHeadquarterComponent } from './all-tools-headquarter/all-tools-headquarter.component';
import { AllShopsHeadquarterComponent } from './all-shops-headquarter/all-shops-headquarter.component';
import { InspectionSummaryComponent } from './inspection-summary/inspection-summary.component';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';
import { InspectionComponent } from './inspection/inspection.component';
import { AuditInspectionComponent } from './headquarters/audit-inspection/audit-inspection.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GtsSampleComponent } from './runtime-gts-sample/runtime-gts.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { GtsViewQuestionComponent } from './runtime-gts-view-question/runtime-gts-view-question.component';
import { AllNetworksComponent } from './all-networks/all-networks.component';

const routes: Routes = [
  {
    path: '', component: HeadquartersComponent, children: [
      { path: '', component: IndexComponent, data: { reuseRoute: false } },
      { path: 'index', component: IndexComponent, data: { reuseRoute: false } },
      { path: 'system-settings', component: SystemSettingsComponent, data: { reuseRoute: false } },
      { path: 'network', component: IndexComponent, data: { reuseRoute: false } },
      { path: 'home', component: HomeComponent, data: { reuseRoute: false } },
      { path: 'home/filled', component: HomeComponent, data: { reuseRoute: false } },
      { path: 'audit', component: AuditInspectionComponent, data: { reuseRoute: false } },
      { path: 'audit/inspection/:id', component: InspectionSummaryComponent, data: { reuseRoute: false } },
      { path: 'audit/inspection/:id/detail/:shopId', component: InspectionDetailComponent, data: { reuseRoute: false } },
      { path: 'audit/inspection/:id/detail-blank', component: InspectionDetailComponent, data: { reuseRoute: false } },
      {
        path: 'inspection', component: InspectionComponent, data: { reuseRoute: false }, children: [
          { path: 'summary/:id', component: InspectionSummaryComponent, data: { reuseRoute: false } },
          { path: 'summary/:id/blank', component: InspectionSummaryComponent, data: { reuseRoute: false } },
          { path: 'summary/:id/detail/:shopId', component: InspectionDetailComponent, data: { reuseRoute: false } },
          { path: 'summary/:id/detail-blank', component: InspectionDetailComponent, data: { reuseRoute: false } },
        ]
      },
      
      { path: 'all-users', component: AllUsersHeadquarterComponent, data: { reuseRoute: false } },
      { path: 'all-networks', component: AllNetworksComponent, data: { reuseRoute: false } },
      { path: 'user/:userid', component: UserProfileComponent, data: { reuseRoute: false } },
      { path: 'user/:userid/:sectionid', component: UserProfileComponent, data: { reuseRoute: false } },
      { path: 'all-tools', component: AllToolsHeadquarterComponent, data: { reuseRoute: false, canShowBreadcrumb: true } },
      { path: 'tools-equipment', component: AllToolsHeadquarterComponent, data: { reuseRoute: false } },
      { path: 'all-shops', component: AllShopsHeadquarterComponent, data: { reuseRoute: false } },
      {
        path: 'level-details/:level/:subLevel', component: RegionsComponent, data: { reuseRoute: false },
        children: [
          { path: '', redirectTo: 'summary', pathMatch: 'full' },
          { path: 'summary', component: HeadquarterSummaryComponent },
          { path: 'shops', component: HeadquarterShopComponent, data: { reuseRoute: false } },
          { path: 'tools-equipment', component: HeadquarterToolsAndEquipmentsComponent, data: { reuseRoute: false } },
          {
            path: 'shop/:id', component: HeadquartersShopDetailsComponent, data: { reuseRoute: false }, children: [
              { path: '', redirectTo: 'summary', pathMatch: 'full' },
              { path: 'summary', component: ShopDetailSummaryComponent, data: { reuseRoute: false } },
              { path: 'users', component: ShopDetailUsersComponent, data: { reuseRoute: false } },
              { path: 'user/:userid', component: UserProfileComponent, data: { reuseRoute: false } },
              { path: 'user/:userid/:sectionid', component: UserProfileComponent, data: { reuseRoute: false } },
              { path: 'facility', component: ShopDetailFacilityComponent, data: { reuseRoute: false } },
              { path: 'inspection', component: ShopDetailInspectionComponent, data: { reuseRoute: false } },
              { path: 'tools-equipment', component: ShopDetailToolsComponent, data: { reuseRoute: false } },
            ]
          },
        ],
      },
      {
        path: 'all-shops', component: RegionsComponent, data: { reuseRoute: false },
        children: [
          {
            path: 'shop/:id', component: HeadquartersShopDetailsComponent, data: { reuseRoute: false }, children: [
              { path: '', redirectTo: 'summary', pathMatch: 'full' },
              { path: 'summary', component: ShopDetailSummaryComponent, data: { reuseRoute: false } },
              { path: 'users', component: ShopDetailUsersComponent, data: { reuseRoute: false } },
              { path: 'user/:userid', component: UserProfileComponent, data: { reuseRoute: false } },
              { path: 'user/:userid/:sectionid', component: UserProfileComponent, data: { reuseRoute: false } },
              { path: 'facility', component: ShopDetailFacilityComponent, data: { reuseRoute: false } },
              { path: 'inspection', component: ShopDetailInspectionComponent, data: { reuseRoute: false } },
              { path: 'tools-equipment', component: ShopDetailToolsComponent, data: { reuseRoute: false } },
            ]
          },
        ]
      },
      { path: "start-inspection/:title/:id/:locationId", component: GtsSampleComponent },
      { path: "start-inspection/:title/:id/:locationId/:gtsId", component: GtsSampleComponent },
      { path: "gts-view-question/:id/:title", component: GtsViewQuestionComponent },
      { path: "start-inspection/:title/:id/:locationId/:gtsId/:readonly", component: GtsSampleComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeadquartersRoutingModule { }
