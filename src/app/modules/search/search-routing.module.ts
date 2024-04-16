import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { IndexComponent } from './search-page/index/index.component';
const routes: Routes = [
  {path: '', component: SearchPageComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
   // {path: 'inactive', component: InactiveComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
