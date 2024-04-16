import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from '../../services/scroll-top.service';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  public bodyClass:string = "landing-page";
  public bodyElem;
  public footerElem;
  constructor(
    private scrollTopService: ScrollTopService
  ) { }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    //this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    //this.footerElem.classList.remove("sidebar");
    //this.footerElem.classList.remove("sidebar-active");
  }

}
