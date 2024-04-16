import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from './components/profile/profile.component';
import { IndexComponent } from './components/profile/index/index.component';

@NgModule({
  declarations: [   
    ProfileComponent,
    IndexComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
