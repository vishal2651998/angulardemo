import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
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
