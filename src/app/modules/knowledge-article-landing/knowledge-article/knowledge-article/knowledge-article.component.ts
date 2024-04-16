import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ScrollTopService } from "../../../../services/scroll-top.service";

@Component({
  selector: "app-knowledge-article",
  templateUrl: "./knowledge-article.component.html",
  styleUrls: ["./knowledge-article.component.scss"],
})
export class KnowledgeArticleComponent implements OnInit {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;
  public footerElem;
  constructor(
    private scrollTopService: ScrollTopService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.init();
  }
  init() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.scrollTopService.setScrollTop();
    let url = this.router.url;
    this.bodyClass = "landing-page";
    this.wrapperClass = "wrapper-landingpage";
    this.bodyElem.classList.add(this.bodyClass);
  }
  ngOnDestroy(): void {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
