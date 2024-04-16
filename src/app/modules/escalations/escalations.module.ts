import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { EscalationsRoutingModule } from './escalations-routing.module';
import { EscalationsComponent } from './components/escalations/escalations.component';
import { IndexComponent } from './components/escalations/index/index.component';


@NgModule({
  declarations: [EscalationsComponent, IndexComponent],
  imports: [
    SharedModule,
    EscalationsRoutingModule
  ]
})
export class EscalationsModule { }
