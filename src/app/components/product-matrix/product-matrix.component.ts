import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-product-matrix',
  templateUrl: './product-matrix.component.html',
  styleUrls: ['./product-matrix.component.scss']
})
export class ProductMatrixComponent implements OnInit, OnDestroy {

  public bodyClass:string = "product-matrix";
  public bodyElem;
  public footerElem;

  constructor() { }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.footerElem.classList.remove("sidebar");
    this.footerElem.classList.remove("sidebar-active");
  }

}