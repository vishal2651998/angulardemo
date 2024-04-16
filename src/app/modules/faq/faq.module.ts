import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq/faq.component';
import { IndexComponent } from './faq/index/index.component';


@NgModule({
  declarations: [
    FaqComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FaqRoutingModule
  ]
})
export class FaqModule { }
