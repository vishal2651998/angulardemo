import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from "./knowledge-article/index/index.component";
import { KnowledgeArticleComponent } from "./knowledge-article/knowledge-article/knowledge-article.component";
import { ViewComponent } from "./knowledge-article/view/view.component";
import { ManageComponent } from './knowledge-article/manage/manage.component';
import { ViewOldComponent } from './knowledge-article/view-old/view-old.component';
import { IndexSolrComponent } from './knowledge-article/index-solr/index-solr.component';

const routes: Routes = [
  {
    path: "",
    component: KnowledgeArticleComponent,
    children: [
      //{path: "", component: IndexComponent, data: {reuseRoute: true}},
      {path: "", component: IndexSolrComponent, data: {reuseRoute: true}},
      {path: 'manage', component: ManageComponent},
      {path: 'manage/new', component: ManageComponent},
      {path: 'manage/edit/:id', component: ManageComponent},
      {path: "view/:id", component: ViewComponent},
      {path: "view-old/:id", component: ViewOldComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeArticleRoutingModule {}
