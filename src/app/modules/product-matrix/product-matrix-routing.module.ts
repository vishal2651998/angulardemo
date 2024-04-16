import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductMatrixComponent } from '../../components/product-matrix/product-matrix.component';
import { IndexComponent } from '../../components/product-matrix/index/index.component';
const routes: Routes = [
  {path: '', component: ProductMatrixComponent, children: [
    {path: '', component: IndexComponent},
    {path: 'landing', component: IndexComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMatrixRoutingModule { }
