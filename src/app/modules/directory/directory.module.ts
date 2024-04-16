import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DirectoryRoutingModule } from './directory-routing.module';
import { IndexComponent } from './components/directory/index/index.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    IndexComponent,
    DirectoryComponent
  ],
  imports: [
    DropdownModule,
    SharedModule,
    DirectoryRoutingModule
  ]
})
export class DirectoryModule { }
