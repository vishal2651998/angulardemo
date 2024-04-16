import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollTopService } from "src/app/services/scroll-top.service";

@Component({
  selector: "app-service-market-place",
  templateUrl: "./service-market-place.component.html",
  styleUrls: ["./service-market-place.component.scss"],
})
export class ServiceMarketPlaceComponent implements OnInit, OnDestroy {
  public bodyClass: string;
  public wrapperClass: string;
  public cartClass: boolean = false;
  public bodyElem;

  constructor(
    private scrollTopService: ScrollTopService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.scrollTopService.setScrollTop();
    let url = this.router.url;
    
    switch (url) {
      case '/market-place/manage':
        this.bodyClass = "manage-thread";
        this.wrapperClass = "wrapper";
        break;

      case '/market-place/cart':
        this.bodyClass = "landing-page";
        this.wrapperClass = "wrapper-landingpage";
        this.cartClass = true;
        this.bodyElem.classList.add('responsive-cart');
        break;
    
      default:
        this.bodyClass = "landing-page";
        this.wrapperClass = "wrapper-landingpage";
        break;
    }
    this.bodyElem.classList.add(this.bodyClass);
  }

  ngOnDestroy() {
  }
}
