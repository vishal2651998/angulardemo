import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Constant } from 'src/app/common/constant/constant';

@Component({
  selector: 'app-deep-link',
  templateUrl: './deep-link.component.html',
  styleUrls: ['./deep-link.component.scss']
})
export class DeepLinkComponent implements OnInit, OnDestroy {

  public bodyClass:string = "deep-link";
  public bodyElem;
  public title:string = "";
  public deepLinkText = Constant.DeepLinkText;

  constructor(private titleService: Title) { this.titleService.setTitle( localStorage.getItem('platformName')) }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);    
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass); 
  }


}
