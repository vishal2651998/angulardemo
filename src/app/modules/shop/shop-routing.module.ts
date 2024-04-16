import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './shop/index/index.component';
import { ShopComponent } from './shop/shop.component';
import { ViewComponent } from './shop/view/view.component';

const routes: Routes = [
  {path: '', component: ShopComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'view/:id', component: ViewComponent},  
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
