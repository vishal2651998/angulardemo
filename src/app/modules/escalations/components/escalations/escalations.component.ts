import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from '../../../../services/scroll-top.service';

@Component({
  selector: 'app-escalations',
  templateUrl: './escalations.component.html',
  styleUrls: ['./escalations.component.scss']
})
export class EscalationsComponent implements OnInit {

  public bodyClass:string = "escalations";
  public bodyElem;
  public footerElem;

  constructor(
    private scrollTopService: ScrollTopService
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.footerElem.classList.remove("sidebar");
    this.footerElem.classList.remove("sidebar-active");
  }

}