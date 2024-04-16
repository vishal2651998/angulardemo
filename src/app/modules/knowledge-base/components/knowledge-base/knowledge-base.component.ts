import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseComponent implements OnInit, OnDestroy{ 

  public bodyClass:string = "parts";
  public bodyClass1:string = "knowledge-base";
  public bodyElem;
  public footerElem;
   
    constructor(
    
    ) { }
  
    ngOnInit(): void {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.footerElem = document.getElementsByClassName('footer-content')[0];
      this.bodyElem.classList.add(this.bodyClass); 
      this.bodyElem.classList.add(this.bodyClass1);   
    }
   
    ngOnDestroy() {
      this.bodyElem.classList.remove(this.bodyClass);
      this.bodyElem.classList.remove(this.bodyClass1);
    }
  
  }
  