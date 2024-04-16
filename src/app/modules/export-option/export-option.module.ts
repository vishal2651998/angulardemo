import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExportOptionRoutingModule } from './export-option-routing.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {MatRadioModule} from '@angular/material/radio';
import {CalendarModule} from 'primeng/calendar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { ExportOptionComponent } from '../../components/export-option/export-option.component';
import { IndexComponent } from '../../components/export-option/index/index.component';
import { ExportOptionHeaderComponent } from '../../layouts/export-option-header/export-option-header.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {DialogModule} from 'primeng/dialog';
@NgModule({
  declarations: [ExportOptionComponent,IndexComponent,ExportOptionHeaderComponent],
  imports: [
  ExportOptionRoutingModule,
    SharedModule,
   NgxMatSelectSearchModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    MatButtonModule, 
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    ProgressBarModule,
    DialogModule,
    CalendarModule
    
  ]
})
export class ExportOptionModule { }
