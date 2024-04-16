import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "../../components/service-provider/index/index.component";
import { ServiceProviderInnerDetailComponent } from "../../components/service-provider/service-provider-inner-detail/service-provider-inner-detail.component";
import { ServiceProviderDetailComponent } from "../../components/service-provider/service-provider-detail/service-provider-detail.component";
import { ServiceProviderComponent } from "../../components/service-provider/service-provider.component";
import { ManualDetailComponent } from "src/app/components/service-provider/manual-detail/manual-detail.component";
import { CartComponent } from "src/app/components/service-provider/cart/cart.component";
import { PolicyComponent } from "src/app/components/service-provider/policy/policy.component";
import { GtsSampleComponent } from "src/app/components/service-provider/gts-sample/gts-sample.component";

const routes: Routes = [
  { path: "start-inspection/:title/:id", component: GtsSampleComponent },
  {
    path: "",
    component: ServiceProviderComponent,
    children: [
      { path: "", component: IndexComponent, data: { reuseRoute: true } },
      { path: "cart", component: CartComponent },
      {
        path: ":section",
        component: IndexComponent,
        data: { reuseRoute: true },
      },
      {
        path: "domain/:id",
        component: ServiceProviderDetailComponent,
        data: { reuseRoute: true },
      },
      {
        path: "domain/:domainId/detail/:id",
        component: ServiceProviderInnerDetailComponent,
      },
      { path: "domain/:domainId/manual/:id", component: ManualDetailComponent },
      { path: "policy/:type", component: PolicyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderRoutingModule {}
