import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { BugsAndFeaturesComponent } from "./bugs-and-features/bugs-and-features.component";
import { IndexComponent } from "./bugs-and-features/index/index.component";
import { ManageComponent } from "./bugs-and-features/manage/manage.component";
import { ViewComponent } from "./bugs-and-features/view/view.component";

const routes: Routes = [
    {path: '', component: BugsAndFeaturesComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/new', component: ManageComponent},
    {path: 'manage/edit/:id', component: ManageComponent},
    {path: 'view/:id', component: ViewComponent},
    {path: 'view/:id/:domainId/:userId', component: ViewComponent},
    {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
  ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BugsAndFeaturesRoutingModule { }
  