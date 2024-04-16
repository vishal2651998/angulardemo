import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  PlatFormType
} from "../../common/constant/constant";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public bodyClass:string = "dashboard";
  public bodyClass1:string = "misdashboard";
  public bodyElem = document.getElementsByTagName('body')[0];
  public dashboardFlag: boolean;
  public isCollabtic: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    console.log(this.router.url)
    this.dashboardFlag = (this.router.url == 'mis/dashboard/escalation') ? false : true;
    const platformId = localStorage.getItem('platformId');

    if (platformId == PlatFormType.Collabtic) {
      this.isCollabtic = true;
    }
   }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
  }

}
