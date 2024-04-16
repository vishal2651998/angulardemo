import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollTopService } from '../../services/scroll-top.service';
@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.scss']
})
export class ServiceProviderComponent implements OnInit {
  public bodyClass:string = "service-provider";
  public bodyElem;
  public footerElem;
  constructor(
    private scrollTopService: ScrollTopService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
  }

}
