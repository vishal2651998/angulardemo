import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaManagerComponent } from './components/media-manager/media-manager.component';
import { IndexComponent } from './components/media-manager/index/index.component';

const routes: Routes = [
  {
    path: '', component: MediaManagerComponent, children: [
      {path: '', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'index', component: IndexComponent, data: {reuseRoute: true}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaManagerRoutingModule { }
