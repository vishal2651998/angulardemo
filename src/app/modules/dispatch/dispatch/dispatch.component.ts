import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollTopService } from '../../../services/scroll-top.service';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit, OnDestroy {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;

  constructor(   private scrollTopService: ScrollTopService, private router: Router) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.scrollTopService.setScrollTop();
    let url = this.router.url;
    
    switch (url) {
      case '/dispatch':
        this.bodyClass = "dispatch";
        this.wrapperClass = "wrapper-landingpage";
        break;
    
      default:
        this.bodyClass = "dispatch";
        this.wrapperClass = "wrapper";
        break;
    }
    this.bodyElem.classList.add(this.bodyClass);
  }

  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
