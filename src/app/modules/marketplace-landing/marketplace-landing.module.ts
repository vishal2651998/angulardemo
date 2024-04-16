import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { MarketplaceLandingRoutingModule } from './marketplace-landing-routing.module';
import { MarketplaceLandingComponent } from './marketplace-landing/marketplace-landing.component';
import { IndexComponent } from './marketplace-landing/index/index.component';


@NgModule({
  declarations: [
    MarketplaceLandingComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MarketplaceLandingRoutingModule
  ]
})
export class MarketplaceLandingModule { }
