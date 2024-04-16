import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceLandingComponent } from './marketplace-landing/marketplace-landing.component';
import { IndexComponent } from './marketplace-landing/index/index.component';

const routes: Routes = [
  {path: '', component: MarketplaceLandingComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceLandingRoutingModule { }
