import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;
  
  constructor() { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "inspection"; 
    this.bodyElem.classList.add(this.bodyClass); 
  }

}
