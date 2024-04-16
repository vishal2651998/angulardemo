import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { IndexComponent } from './chat-page/index/index.component';


const routes: Routes = [
  {path: '', component: ChatPageComponent, children: [
    {path: '', component: IndexComponent},
    // {path: ':id/:id1', component: IndexComponent},
    {path: ':type/:id', component:IndexComponent}
   // {path: 'inactive', component: InactiveComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
