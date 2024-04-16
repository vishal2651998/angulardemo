import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit, OnDestroy {

  public bodyClass:string = "dashboard";
public showDefaultMsg=true;
public originURL;
  constructor() { }

  ngOnInit() {
   // alert(window.location.href);
    let currentURL=window.location.href;
    let str1 = new String(currentURL); 
    let indexStr = str1.indexOf("cbt-v2"); 
    console.log("indexOf found String :" + indexStr );
   let platformId= localStorage.getItem("platformId");
  if(indexStr!=-1)
  {
this.showDefaultMsg=false;
this.originURL=window.location.origin;
  }
    let body = document.getElementsByTagName('body')[0];
    body.classList.add(this.bodyClass);
  }
  bookmarkURL(){
    alert('Press ' + (/Mac/i.test(navigator.platform) ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
  }
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove(this.bodyClass);
  }

}
