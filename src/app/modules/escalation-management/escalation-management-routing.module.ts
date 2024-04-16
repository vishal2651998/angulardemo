import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EscalationMatrixComponent } from './components/escalation-matrix/escalation-matrix.component';
import { IndexComponent } from './components/escalation-matrix/index/index.component';
import { SeeMoreComponent } from './components/escalation-matrix/see-more/see-more.component';
import { EscalationLevelComponent } from './components/escalation-level/escalation-level.component';

const routes: Routes = [
  {
    path: '', component: EscalationMatrixComponent, children: [
      {path: '', component: IndexComponent},
      {path: 'escalation-matrix', component: IndexComponent},
      {path: 'escalation-tvs', component: SeeMoreComponent, data: {reuseRoute: true}},
      {path: 'escalation', component: SeeMoreComponent, data: {reuseRoute: true}},
      {path: 'escalation-level', component: EscalationLevelComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscalationManagementRoutingModule { }
