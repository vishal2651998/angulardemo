import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-dtc',
  templateUrl: './dtc.component.html',
  styleUrls: ['./dtc.component.scss']
})
export class DtcComponent implements OnInit {
  public bodyClass:any = "dtc";
  public bodyElem;
  public footerElem;
  public platformId: number = 0;
  public domainId;
  public userId;
  public tvsFlag: boolean = false;
  public user: any;


  constructor() { }

  ngOnInit(): void {
  }

}
