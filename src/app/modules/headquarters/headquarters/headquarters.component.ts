import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-headquarters',
  templateUrl: './headquarters.component.html',
  styleUrls: ['./headquarters.component.scss']
})
export class HeadquartersComponent implements OnInit {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;
  
  constructor() { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "headquarters"; 
    this.bodyElem.classList.add(this.bodyClass); 
  }

}


