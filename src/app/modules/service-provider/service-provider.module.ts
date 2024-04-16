import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { CommonModule } from "@angular/common";
import { ServiceProviderRoutingModule } from "./service-provider-routing.module";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { IndexComponent } from "src/app/components/service-provider/index/index.component";
import { ServiceProviderComponent } from "src/app/components/service-provider/service-provider.component";
import { ServiceProviderHeaderComponent } from "src/app/components/service-provider/service-provider-header/service-provider-header.component";
import { ServiceProviderDetailComponent } from "src/app/components/service-provider/service-provider-detail/service-provider-detail.component";
import { CardModule } from "primeng/card";
import { ServiceProviderFooterComponent } from "src/app/components/service-provider/service-provider-footer/service-provider-footer.component";
import { CarouselModule } from "primeng/carousel";
import { GalleriaModule } from "primeng/galleria";
import { ServiceProviderInnerDetailComponent } from "src/app/components/service-provider/service-provider-inner-detail/service-provider-inner-detail.component";
import { TabViewModule } from "primeng/tabview";
import { DialogModule } from "primeng/dialog";
import { ServiceDomainDetailComponent } from "src/app/components/service-provider/service-domain-detail/service-domain-detail.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { RadioButtonModule } from "primeng/radiobutton";
import { ManualDetailComponent } from "src/app/components/service-provider/manual-detail/manual-detail.component";
import { CartComponent } from "src/app/components/service-provider/cart/cart.component";
import { TooltipModule } from "primeng/tooltip";
import { PolicyComponent } from "src/app/components/service-provider/policy/policy.component";
import { GtsSampleComponent } from "src/app/components/service-provider/gts-sample/gts-sample.component";
import { NgCircleProgressModule } from "ng-circle-progress";
@NgModule({
  declarations: [
    ServiceProviderFooterComponent,
    IndexComponent,
    ServiceProviderComponent,
    ServiceProviderHeaderComponent,
    ServiceProviderDetailComponent,
    ServiceProviderInnerDetailComponent,
    ManualDetailComponent,
    CartComponent,
    ServiceDomainDetailComponent,
    PolicyComponent,
    GtsSampleComponent,
  ],
  imports: [
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
      titleFontSize:'13'
    }),
  ],
})
export class ServiceProviderModule {}
