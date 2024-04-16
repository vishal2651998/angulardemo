import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceMarketPlaceRoutingModule } from './service-market-place-routing.module';
import { ServiceMarketPlaceComponent } from 'src/app/components/service-market-place/service-market-place.component';
import { IndexComponent } from 'src/app/components/service-market-place/index/index.component';
import { CardModule } from 'primeng/card';
import { MarketPlaceInnerPageComponent } from 'src/app/components/service-market-place/market-place-inner-page/market-place-inner-page.component';
import { MarketPlaceManualsComponent } from 'src/app/components/service-market-place/market-place-manuals/market-place-manuals.component';
import { ManageNewComponent } from 'src/app/components/service-market-place/manage-new/manage-new.component';
import { ViewComponent } from 'src/app/components/service-market-place/view/view.component';
import { ViewManualComponent } from 'src/app/components/service-market-place/view-manual/view-manual.component';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { TabViewModule } from 'primeng/tabview';
import { ManageDomainComponent } from 'src/app/components/service-market-place/manage-domain/manage-domain.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MarketPlaceQuizTopicsComponent } from 'src/app/components/service-market-place/market-place-quiz-topics/market-place-quiz-topics.component';
import { MarketPlaceQuizQuestionsListComponent } from 'src/app/components/service-market-place/market-place-quiz-questions-list/market-place-quiz-questions-list.component';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from 'primeng/sidebar';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ManageRepairfyDomainComponent } from 'src/app/components/service-market-place/manage-repairfy-domain/manage-repairfy-domain.component';
import { MarketPlaceCustomersComponent } from 'src/app/components/service-market-place/market-place-customers/market-place-customers.component';
import { MarketPlaceSettingsComponent } from 'src/app/components/service-market-place/market-place-settings/market-place-settings.component'; 
import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { MarketPlacePoliciesComponent } from 'src/app/components/service-market-place/market-place-policies/market-place-policies.component';
import { ManageNewManualComponent } from 'src/app/components/service-market-place/manage-new-manual/manage-new-manual.component';
import { MarketPlaceReportsComponent } from 'src/app/components/service-market-place/market-place-reports/market-place-reports.component';
import { MarketPlaceReportDetailsComponent } from 'src/app/components/service-market-place/market-place-report-details/market-place-report-details.component';
import { TooltipModule } from 'primeng/tooltip';
import { CartComponent } from 'src/app/components/service-market-place/cart/cart.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
};

@NgModule({
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  declarations: [
    ServiceMarketPlaceComponent,
    ManageDomainComponent,
    IndexComponent,
    MarketPlaceInnerPageComponent,
    MarketPlaceManualsComponent,
    MarketPlaceQuizTopicsComponent,
    ManageRepairfyDomainComponent,
    MarketPlaceQuizQuestionsListComponent,
    ManageNewComponent,
    ManageNewManualComponent,
    MarketPlaceCustomersComponent,
    MarketPlaceSettingsComponent,
    MarketPlacePoliciesComponent,
    MarketPlaceReportsComponent,
    MarketPlaceReportDetailsComponent,
    ViewComponent,
    ViewManualComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    ServiceMarketPlaceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CarouselModule,
    GalleriaModule,
    TabViewModule,
    MultiSelectModule,
    InputSwitchModule,
    TableModule,
    RadioButtonModule,
    CheckboxModule,
    SidebarModule,
    CKEditorModule,
    PerfectScrollbarModule,
    TooltipModule
  ],
  exports: [
    PerfectScrollbarModule,
  ]
})
export class ServiceMarketPlaceModule { }
