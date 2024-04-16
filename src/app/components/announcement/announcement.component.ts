import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit, OnDestroy {

  public bodyClass:string = "announcement";
  public bodyElem;
  public footerElem;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);    
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
  }

}
