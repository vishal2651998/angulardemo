
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $: any;
declare var window: any;
@Component({
  selector: 'app-marketplace-sidebar',
  templateUrl: './marketplace-sidebar.component.html',
  styleUrls: ['./marketplace-sidebar.component.scss'],
})
export class MarketplaceSidebarComponent implements OnInit, OnDestroy {
  routeSubscription: Subscription;
  @Input() accessModule;
  @Input() activeMenuItem;
  @Output() sidebarComponentRef: EventEmitter<any> = new EventEmitter();
  @Output() resetTrainingType: EventEmitter<any> = new EventEmitter();
  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
  ) {
  }
  ngOnDestroy(): void {
    if(this.routeSubscription) this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        let url = evt.url.toString();
        if (localStorage.getItem('selected-menu')){
          let currentUrl = url.slice(1);
          this.activeMenuItem = currentUrl;
        }
        if(url.includes('market-place/training')) this.resetTrainingType.emit(true);
        this.ref.detectChanges();
      }
    });
  }


  // Page Navigation
  navigatePageUrl(url) {
    this.sidebarComponentRef.emit(url);
    // Get the source element
    this.activeMenuItem = url;
    localStorage.setItem('selected-menu', url);
    setTimeout(() => {
      this.ref.detectChanges();
      this.router.navigateByUrl(url);
    }, 500);
  }

}
