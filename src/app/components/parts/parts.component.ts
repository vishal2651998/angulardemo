import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScrollTopService } from '../../services/scroll-top.service';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit, OnDestroy {
  public bodyClass:string = "parts";
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
