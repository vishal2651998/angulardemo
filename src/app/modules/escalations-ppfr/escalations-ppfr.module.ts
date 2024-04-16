import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TableModule as PrimeNGTableModule } from 'primeng/table';

import { EscalationsPpfrRoutingModule } from './escalations-ppfr-routing.module';
import { EscalationsComponent } from './components/escalations/escalations.component';
import { IndexComponent } from './components/escalations/index/index.component';
import { ManageComponent } from './components/escalations/manage/manage.component';
import { ManageFormComponent } from './components/escalations/manage-form/manage-form.component';


@NgModule({
  declarations: [
    EscalationsComponent,
    IndexComponent,
    ManageComponent,
    ManageFormComponent
  ],
  imports: [
    SharedModule,
    EscalationsPpfrRoutingModule,
    PrimeNGTableModule  
  ]
})
export class EscalationsPpfrModule { }
