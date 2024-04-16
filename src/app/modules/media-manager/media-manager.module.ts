import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MediaManagerRoutingModule } from './media-manager-routing.module';
import { MediaManagerComponent } from './components/media-manager/media-manager.component';
import { IndexComponent } from './components/media-manager/index/index.component';
import { GalleryListComponent } from './components/media-manager/gallery-list/gallery-list.component';

@NgModule({
  declarations: [MediaManagerComponent, IndexComponent, GalleryListComponent],
  imports: [
    SharedModule,
    MediaManagerRoutingModule
  ]
})
export class MediaManagerModule { }
