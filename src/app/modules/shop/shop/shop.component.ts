import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;
  constructor() { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "shop"; 
    this.bodyElem.classList.add(this.bodyClass);        
  }
  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
