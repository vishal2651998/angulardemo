import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FaqComponent } from './faq/faq.component';
import { IndexComponent } from './faq/index/index.component';

const routes: Routes = [
  {path: '', component: FaqComponent, children: [
    {path: '', component: IndexComponent},  
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
