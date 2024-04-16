import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollTopService } from '../../../services/scroll-top.service';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent implements OnInit, OnDestroy {

  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;

  constructor(
    private scrollTopService: ScrollTopService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.scrollTopService.setScrollTop();
    let url = this.router.url;
    switch (url) {
      case '/opportunity':
        this.bodyClass = "landing-page";
        this.wrapperClass = "wrapper-landingpage";
        break;
    
      default:
        this.bodyClass = "manage-thread";
        this.wrapperClass = "wrapper";
        break;
    }
    this.bodyElem.classList.add(this.bodyClass);
  }

  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
