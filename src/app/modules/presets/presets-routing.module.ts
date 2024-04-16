import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './presets/index/index.component';
import { PresetsComponent } from './presets/presets.component';

const routes: Routes = [
  {path: '', component: PresetsComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresetsRoutingModule { }
