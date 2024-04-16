import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;

  constructor() { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "customers"; 
    this.bodyElem.classList.add(this.bodyClass); 
  }

}
