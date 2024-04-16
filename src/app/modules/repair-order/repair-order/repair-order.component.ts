import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repair-order',
  templateUrl: './repair-order.component.html',
  styleUrls: ['./repair-order.component.scss']
})
export class RepairOrderComponent implements OnInit {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;
  constructor() { }
  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "audit"; 
    this.bodyElem.classList.add(this.bodyClass); 
  }
}
