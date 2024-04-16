import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from '../../../../services/scroll-top.service';

@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent implements OnInit {

  public bodyClass:string = "parts";
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
