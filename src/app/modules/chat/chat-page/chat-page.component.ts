import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {

  public bodyClass: string = "landing-page";
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
