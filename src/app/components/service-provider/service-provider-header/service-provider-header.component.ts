import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-service-provider-header',
  templateUrl: './service-provider-header.component.html',
  styleUrls: ['./service-provider-header.component.scss']
})

export class ServiceProviderHeaderComponent implements OnInit {
  menu: any = [];
  atgTheme:string = "";
  reparifyDomain: boolean = false;
  showMobileMenu: boolean = false;
  openCartPopup: boolean = false;
  openCartClearPopup: boolean = false;
  removeTrainingConfirmation: boolean = false;
  cart:any;
  removeCartItem: { itemId: any; itemType: string; };
  cartUpdatedMessage: string = null;
  oldCart: any;
  removeManualIndex: number = null;
  removeTrainingIndex: number = null;
  manualpopup: boolean = false;
  trainingpopup: boolean = false;
  
  constructor(
    private titleService: Title,
    private router: Router,
    private threadApi: ThreadService,
    private commonService: CommonService
  ) {
    let host = window.location.host
    let subdomain = host.split('.')[0];
    // let subdomain = 'atgtraining-stage';
    if (subdomain == "atgtraining-stage") {
      this.reparifyDomain = true;
      this.atgTheme = "atgThemeColor"
    } else {
      this.reparifyDomain = false;
    }
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Service Provider');
  }
  ngOnInit(): void {
    if (!this.reparifyDomain) {
      this.menu = [
        {
          label: "HOME",
          routerLink: '/marketplace'
        },
        {
          label: "CONTACT US",
          command: () => { window.open("https://collabtic.com/contact-us/", "_blank") },
        },
      ];
    }
    this.getCart();
    /* listens to cart Update from other pages */
    this.commonService.cartUpdateSubject.subscribe((cart) => {
      this.oldCart = this.cart;
      this.getCart(cart ? true : false)});
  }
  
  getCart(updateCart = false) {
    let cartId = this.cart?.cartId || localStorage.getItem('marketplaceCartId');
    if (cartId) {
      this.threadApi.getCart({ cartId: cartId }).subscribe((resp) => {
        this.setCart(resp.data, updateCart);
        this.commonService.cartProductsList.next({
          domainId: (resp.data?.trainings[0]?.domainID || resp.data?.manuals[0]?.domainID), trainingIds: resp.data?.trainingIds?.split(','), manualIds: resp.data?.manualIds?.split(',')
        });
      })
    } else {
      this.cart = {};
    }
  }

  
  removeTraining() {
    const itemId = this.cart.trainings[this.removeTrainingIndex].id;
    this.removeCartItem = { itemId: itemId, itemType: 'training' };
    this.removeTrainingIndex = null;
    // this.cart.trainings.splice(index, 1);
    this.trainingpopup = false;
    this.updateCart();
  }

  removeTrainingPopup(index:number) {
    this.removeTrainingIndex = index;
    this.trainingpopup = true;
 
  }
  removeManualPopup(index:number) {
    this.removeManualIndex = index;
    this.manualpopup = true;
 
  }
  removeManual() {
    const itemId = this.cart.manuals[this.removeManualIndex].id;
    this.removeCartItem = { itemId: itemId, itemType: 'manual' };
    this.removeManualIndex = null;
    this.manualpopup = false;
    // this.cart.manuals?.splice(index, 1);
    this.updateCart();
  }

  clearCart() {
    this.openCartClearPopup = false
    this.threadApi.emptyCart({cartId: this.cart?.cartId}).subscribe((res) => {
      this.commonService.cartUpdateSubject.next(null);
    }, (error: any) => {
      console.error("error: ", error);
    })
  }
  
  updateCart() {
    this.threadApi.updateCartItemsWithDetails({cartId: this.cart?.cartId,  ...this.removeCartItem}).subscribe((resp: any) => {
      // this.setCart(resp?.data);
      this.commonService.cartUpdateSubject.next(resp.data);
    }, (error: any) => {
      console.error("error: ", error);
    });
  }

  setCart(data, updatecart = false) {
    this.cart = {
      cartId: data?.id,
      email: data?.email,
      trainingIds: data?.trainingIds ? data?.trainingIds.split(',') : [],
      manualIds: data?.manualIds ? data?.manualIds.split(',') : [],
      phoneNumber: {
        countryCode: data?.countryCode,
        dialCode: data?.dialCode,
        e164Number: data?.e164Number,
        internationalNumber: data?.internationalNumber,
        phoneNumber: data?.phoneNumber,
      },
      totalAmount: 0,
      manuals:  data.manuals.length> 0 ? data.manuals : [],
      trainings: data.trainings.length > 0 ? data.trainings : [],
    };
    this.cart['totalItems'] = this.cart?.trainings?.length + this.cart?.manuals.length;
    if(data?.userId) {
      localStorage.removeItem('marketplaceCartId');
      this.cart = null;
    } else {
      localStorage.setItem('marketplaceCartId', this.cart.cartId);
    }
    if (updatecart) {
      let oldManualsLength = this.oldCart?.manuals?.length || 0;
      let oldTrainingsLength = this.oldCart?.trainings?.length || 0;
      let manualsLength = this.cart?.manuals?.length || 0;
      let trainingsLength = this.cart?.trainings?.length || 0;
      let actionOn = oldTrainingsLength != trainingsLength ? 'Training' : 'Manual';
      let action = '';
      if (actionOn == 'Training') { action = trainingsLength > oldTrainingsLength ? 'added' : 'removed' };
      if (actionOn == 'Manual') { action = manualsLength > oldManualsLength ? 'added' : 'removed' };
      this.cartUpdatedMessage = `${actionOn} ${action} ${action == 'added' ? 'to' : 'from'} cart`
      setTimeout(() => {
        this.cartUpdatedMessage = null;
      }, 2000);
    }
  }

  goToLink(section: any) {
    this.showMobileMenu = false;
    if(section == 'home') this.router.navigate(['/marketplace']);
    else if(section == 'contact-us') window.open("https://collabtic.com/contact-us/", '_blank').focus();
  }

  onClickedOutside() {
      this.openCartPopup = false;
  }
  
  redirectToInnerDetailPageByRouter(data, isManual = false) {
    this.openCartPopup = false;
    if (isManual) this.router.navigateByUrl('marketplace/domain/' + data?.domainID + '/manual/' + data?.id);
    else this.router.navigateByUrl('marketplace/domain/' + data?.domainID + '/detail/' + data?.id);
  }
}
