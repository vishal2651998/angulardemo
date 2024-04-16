import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop/shop.component';
import { IndexComponent } from './shop/index/index.component';
import { ViewComponent } from './shop/view/view.component';
import { AddShopPopupComponent } from './shop/add-shop/add-shop.component';
import { PaginatorModule } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DmsSmsModalComponent } from './dms-sms-modal/dms-sms-modal.component';
import { NewCertificationModalComponent } from './new-certification-modal/new-certification-modal.component';
import { NewSubscriptionModalComponent } from './new-subscription-modal/new-subscription-modal.component';
import { FranchiseModalComponent } from './franchise-modal/franchise-modal.component';
import { CheckboxModule } from 'primeng/checkbox';
@NgModule({
  declarations: [
    ShopComponent,
    IndexComponent,
    ViewComponent,
    AddShopPopupComponent,
    DmsSmsModalComponent,
    NewCertificationModalComponent,
    NewSubscriptionModalComponent,
    FranchiseModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule,
    PaginatorModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    CheckboxModule

  ]
})
export class ShopModule { }
