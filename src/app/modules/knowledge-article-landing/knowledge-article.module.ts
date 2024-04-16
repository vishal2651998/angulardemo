import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { KnowledgeArticleComponent } from "./knowledge-article/knowledge-article/knowledge-article.component";
import { KnowledgeArticleRoutingModule } from "./knowledge-article-routing.module";
import { IndexComponent } from './knowledge-article/index/index.component';
import { ViewComponent } from './knowledge-article/view/view.component';
import { ManageComponent } from './knowledge-article/manage/manage.component';
import { ViewOldComponent } from './knowledge-article/view-old/view-old.component';
import { IndexSolrComponent } from './knowledge-article/index-solr/index-solr.component';

@NgModule({
  declarations: [KnowledgeArticleComponent, IndexComponent, ViewComponent, ManageComponent, ViewOldComponent, IndexSolrComponent],
  imports: [CommonModule, SharedModule, KnowledgeArticleRoutingModule],
})
export class KnowledgeArticleModule {}
