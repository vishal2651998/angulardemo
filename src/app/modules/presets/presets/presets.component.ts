import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.scss']
})
export class PresetsComponent implements OnInit,OnDestroy {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;
  constructor( private router: Router) { }
  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "presets"; 
    this.bodyElem.classList.add(this.bodyClass);        
  }
  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
