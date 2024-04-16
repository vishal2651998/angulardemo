import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProductMatrixRoutingModule } from './product-matrix-routing.module';
import { ProductMatrixComponent } from '../../components/product-matrix/product-matrix.component';
import { IndexComponent } from '../../components/product-matrix/index/index.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';

@NgModule({
  declarations: [ProductMatrixComponent,IndexComponent],
  imports: [   
    SharedModule,
    NgxMatSelectSearchModule,
    ProductMatrixRoutingModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    RippleModule,
    AutoCompleteModule
  ]
})
export class ProductMatrixModule { }
