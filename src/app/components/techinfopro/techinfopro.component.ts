import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScrollTopService } from '../../services/scroll-top.service';

@Component({
  selector: 'app-techinfopro',
  templateUrl: './techinfopro.component.html',
  styleUrls: ['./techinfopro.component.scss']
})
export class TechinfoproComponent implements OnInit, OnDestroy {
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  
  constructor(
    private scrollTopService: ScrollTopService,
  ) {}

  
  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }
 
  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
    //this.footerElem.classList.remove("sidebar");
    //this.footerElem.classList.remove("sidebar-active");
  }

}
