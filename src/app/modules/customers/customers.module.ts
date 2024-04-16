import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { IndexComponent } from './customers/index/index.component';
import { GoogleMapsModule } from "@angular/google-maps";


@NgModule({
  declarations: [
    CustomersComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GoogleMapsModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
