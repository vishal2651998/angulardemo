import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './components/directory/index/index.component';
import { DirectoryComponent } from './components/directory/directory.component';

const routes: Routes = [{
  path:'', component:DirectoryComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'index', component: IndexComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectoryRoutingModule { }
