import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExportOptionComponent } from '../../components/export-option/export-option.component';
import { IndexComponent } from '../../components/export-option/index/index.component';
const routes: Routes = [
  {path: '', component: ExportOptionComponent, children: [
    {path: '', component: IndexComponent},
   // {path: 'inactive', component: InactiveComponent}
  ]}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportOptionRoutingModule { }
