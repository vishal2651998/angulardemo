import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { IndexComponent } from './components/knowledge-base/index/index.component';
import { ManageComponent } from './components/knowledge-base/manage/manage.component';
import { ViewComponent } from './components/knowledge-base/view/view.component';

const routes: Routes = [
  {
    path:'', component:KnowledgeBaseComponent, children: [
      {path: '', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'index', component: IndexComponent},
      {path: 'manage', component: ManageComponent},
      {path: 'manage/new', component: ManageComponent},
      {path: 'manage/edit/:kbid', component: ManageComponent},      
      {path: 'view/:kbid', component: ViewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowledgeBaseRoutingModule { }
