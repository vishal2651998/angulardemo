import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-techsupport-team',
  templateUrl: './techsupport-team.component.html',
  styleUrls: ['./techsupport-team.component.scss']
})
export class TechsupportTeamComponent implements OnInit {

  public bodyClass: string;
  public bodyElem;
  //public footerElem;
  constructor( ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    //this.footerElem = document.getElementsByClassName('footer-content')[0];    
    this.bodyClass = "techsupport";
    this.bodyElem.classList.add(this.bodyClass);
  }
  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
  }

}

