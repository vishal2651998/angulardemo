import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TechsupportComponent } from './components/techsupport/techsupport.component';
import { IndexComponent } from './components/techsupport/index/index.component';
import { AssignmentRulesComponent } from './components/techsupport/assignment-rules/assignment-rules.component';

const routes: Routes = [
  {path: '', component: TechsupportComponent, children: [
      {path: '', component: IndexComponent, data: {reuseRoute: true}},
      {path: 'assignment-rules', component: AssignmentRulesComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechsupportRoutingModule { }
