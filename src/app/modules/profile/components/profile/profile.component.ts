import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public bodyClass:string = "profile";
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

