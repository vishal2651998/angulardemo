import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BugsAndFeaturesRoutingModule} from './bugs-and-features-routing.module'
import { BugsAndFeaturesComponent } from './bugs-and-features/bugs-and-features.component';
import { IndexComponent } from './bugs-and-features/index/index.component';
import { ManageComponent } from './bugs-and-features/manage/manage.component';
import { ViewComponent } from './bugs-and-features/view/view.component';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPrintModule } from 'ngx-print';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {EditorModule} from 'primeng/editor';
import { ReactiveFormsModule  } from "@angular/forms";
import { FileUploadModule } from "primeng/fileupload";



@NgModule({
    declarations: [BugsAndFeaturesComponent ,IndexComponent, ManageComponent, ViewComponent],
    imports: [
      CommonModule,
      BugsAndFeaturesRoutingModule,
      SharedModule,
      DropdownModule,
      NgxPrintModule,
      EditorModule,
      ReactiveFormsModule,
      FileUploadModule
    
      
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
  
  })
  export class BugsAndFeaturesModule { }