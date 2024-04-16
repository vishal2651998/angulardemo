import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { IndexComponent } from './components/knowledge-base/index/index.component';
import { ManageComponent } from './components/knowledge-base/manage/manage.component';
import { ViewComponent } from './components/knowledge-base/view/view.component';

@NgModule({
  declarations: [
    KnowledgeBaseComponent,
    IndexComponent,
    ManageComponent,
    ViewComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    KnowledgeBaseRoutingModule
  ]
})
export class KnowledgeBaseModule { }
