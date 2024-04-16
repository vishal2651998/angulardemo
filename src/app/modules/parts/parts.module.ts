import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PartsRoutingModule } from './parts-routing.module';
import { PartsComponent } from '../../components/parts/parts.component';
import { IndexComponent } from '../../components/parts/index/index.component';
import { ManageComponent } from '../../components/parts/manage/manage.component';
import { ViewComponent } from '../../components/parts/view/view.component';
import { PartTypesComponent } from '../../components/common/part-types/part-types.component';
import { PartCatgComponent } from '../../components/common/part-catg/part-catg.component';
import { PartSubCatgComponent } from '../../components/common/part-sub-catg/part-sub-catg.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    PartsComponent,
    IndexComponent,
    ManageComponent,
    ViewComponent,    
    PartTypesComponent,
    PartCatgComponent,
    PartSubCatgComponent
  ],
  imports: [
    SharedModule,
    PartsRoutingModule,
    DropdownModule    
  ]
})
export class PartsModule { }
