import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { HeadquartersRoutingModule } from './headquarters-routing.module';
import { HeadquartersComponent } from './headquarters/headquarters.component';
import { IndexComponent } from './headquarters/index/index.component';
import { HomeComponent } from './headquarters/home/home.component';
import { ListShopComponent } from '../shop/shop/list-shop/list-shop.component';
import { TableModule } from 'primeng/table';
import { ShopDetailSummaryComponent } from '../shop/shop-detail-summary/shop-detail-summary.component';
import { ShopDetailUsersComponent } from '../shop/shop-detail-users/shop-detail-users.component';
import { ShopDetailFacilityComponent } from '../shop/shop-detail-facility/shop-detail-facility.component';
import { ShopDetailToolsComponent } from '../shop/shop-detail-tools/shop-detail-tools.component';
import { ShopDetailInspectionComponent } from '../shop/shop-detail-inspection/shop-detail-inspection.component';
import { SidebarModule } from 'primeng/sidebar';
import { RegionsComponent } from './regions/regions.component';
import { HeadquarterSidebarComponent } from './headquarter-sidebar/headquarter-sidebar.component';
import { HeadquarterShopComponent } from './headquarter-shop/headquarter-shop.component';
import { HeadquarterSummaryComponent } from './headquarter-summary/headquarter-summary.component';
import { HeadquarterToolsAndEquipmentsComponent } from './headquarter-tools-and-equipments/headquarter-tools-and-equipments.component';
import { HeadquartersShopDetailsComponent } from './headquarters-shop-details/headquarters-shop-details.component';
import { ShopDetailsSidebarComponent } from '../shop/shop-details-sidebar/shop-details-sidebar.component';
import { AllUsersHeadquarterComponent } from './all-users-headquarter/all-users-headquarter.component';
import { AllShopsHeadquarterComponent } from './all-shops-headquarter/all-shops-headquarter.component';
import { AllToolsHeadquarterComponent } from './all-tools-headquarter/all-tools-headquarter.component';
import { InspectionSummaryComponent } from './inspection-summary/inspection-summary.component';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';
import { InspectionComponent } from './inspection/inspection.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddToolsComponent } from './add-tools/add-tools.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuditInspectionComponent } from './headquarters/audit-inspection/audit-inspection.component';
import { AddSectionComponent } from './add-section/add-section.component';
import { AddTemplateComponent } from './add-template/add-template.component';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';
import { SectionComponent } from './section/section.component';
import { TemplateComponent } from './template/template.component';
import { InspectionsComponent } from './inpsections/inpsections.component';
import { ToastModule } from 'primeng/toast';
import { FollowUpPopupComponent } from './follow-up-popup/follow-up-popup.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GtsSampleComponent } from './runtime-gts-sample/runtime-gts.component';
import { RomanizePipe } from 'src/app/common/pipes/romanize.pipe';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ServiceProviderRoutingModule } from '../service-provider/service-provider-routing.module';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { SetPasswordModelComponent } from './set-password-model/set-password-model.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { SystemSettingsSidebarComponent } from './system-settings-sidebar/system-settings-sidebar.component';
import { StriphtmlPipe } from 'src/app/common/pipes/striphtml.pipe';
import { AlternateModelPopupComponent } from './alternate-model-popup/alternate-model-popup.component';
import { GtsViewQuestionComponent } from './runtime-gts-view-question/runtime-gts-view-question.component';
import { AllNetworksComponent } from './all-networks/all-networks.component';

@NgModule({
  declarations: [
    HeadquartersComponent,
    IndexComponent,
    HomeComponent,
    ListShopComponent,
    ShopDetailSummaryComponent,
    ShopDetailUsersComponent,
    ShopDetailFacilityComponent,
    ShopDetailInspectionComponent,
    ShopDetailToolsComponent,
    RegionsComponent,
    HeadquarterSidebarComponent,
    HeadquarterShopComponent,
    HeadquarterSummaryComponent,
    HeadquarterToolsAndEquipmentsComponent,
    HeadquartersShopDetailsComponent,
    ShopDetailsSidebarComponent,
    AllUsersHeadquarterComponent,
    AllShopsHeadquarterComponent,
    AllToolsHeadquarterComponent,
    InspectionSummaryComponent,
    InspectionDetailComponent,
    InspectionComponent,
    AddToolsComponent,
    AuditInspectionComponent,
    AddSectionComponent,
    AddTemplateComponent,
    AddInspectionComponent,
    SectionComponent,
    TemplateComponent,
    InspectionsComponent,
    FollowUpPopupComponent,
    UserProfileComponent,
    GtsSampleComponent,
    RomanizePipe,
    StriphtmlPipe,
    SetPasswordModelComponent,
    SystemSettingsComponent,
    SystemSettingsSidebarComponent,
    AlternateModelPopupComponent,
    GtsViewQuestionComponent,
    AllNetworksComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HeadquartersRoutingModule,
    TableModule,
    SidebarModule,
    CheckboxModule,
    RadioButtonModule,
    ToastModule,
    CommonModule,
    ServiceProviderRoutingModule,
    SharedModule,
    MenuModule,
    CardModule,
    NgxDaterangepickerMd.forRoot(),
    InputTextModule,
    RadioButtonModule,
    CarouselModule,
    GalleriaModule,
    TabViewModule,
    DialogModule,
    TooltipModule,
    NgCircleProgressModule.forRoot({
      backgroundStrokeWidth: 6,
      backgroundPadding: -45,
      radius: 48,
      space: -8,
      outerStrokeWidth: 10,
      outerStrokeColor: "#469073",
      innerStrokeColor: "#d6e6e0",
      innerStrokeWidth: 4,
      showSubtitle: false,
      titleFontSize: '13'
    }),
  ]
})
export class HeadquartersModule { }
