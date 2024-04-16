import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss']
})
export class EscalationMatrixComponent implements OnInit {
  public bodyClass:string = "product-matrix";
  public bodyElem;
  public footerElem;
  constructor() { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
  }
  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
