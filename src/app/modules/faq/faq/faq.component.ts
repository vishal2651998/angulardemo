import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from 'src/app/services/scroll-top.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;

  constructor(
    private scrollTopService: ScrollTopService,
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.scrollTopService.setScrollTop();
    this.bodyClass = "faq";
    this.wrapperClass = "wrapper-landingpage";
    this.bodyElem.classList.add(this.bodyClass);
  }

}
