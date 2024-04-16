import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from '../../components/user-dashboard/user-dashboard.component';
import { IndexComponent } from '../../components/user-dashboard/index/index.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UserDashboardHeaderComponent } from '../../layouts/user-dashboard-header/user-dashboard-header.component';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatButtonModule, MatIconModule } from '@angular/material';
@NgModule({
  declarations: [UserDashboardHeaderComponent,UserDashboardComponent,IndexComponent],
  imports: [
    SharedModule,
    UserDashboardRoutingModule,
    NgxMatSelectSearchModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    MatButtonModule, 
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule

  ]
})
export class UserDashboardModule { }
