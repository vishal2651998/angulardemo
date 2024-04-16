import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardReportComponent } from './standard-report/standard-report.component';
import { IndexComponent } from './standard-report/index/index.component';

const routes: Routes = [
  {path: '', component: StandardReportComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandardReportRoutingModule { }
