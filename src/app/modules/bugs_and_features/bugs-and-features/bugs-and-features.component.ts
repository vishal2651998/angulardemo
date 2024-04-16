import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormGroup,FormControl,FormArray,FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-bugs-and-features',
  templateUrl: './bugs-and-features.component.html',
  styleUrls: ['./bugs-and-features.component.scss']
})
export class BugsAndFeaturesComponent implements OnInit {

  
  public title: String="Bugs or Features"
  public bodyClass: string;
  public bodyElem;
  public footerElem;
  public wrapperClass;
  public bodyfooter: string;

  constructor(
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) { 
    // this.titleService.setTitle(localStorage.getItem('platformName')+ ' - '+ this.title)
  }
  
  

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyClass = "manage-thread";
    this.wrapperClass = "wrapper-landingpage";
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyfooter= "BugorFeature";
  }
  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
    this.footerElem.classList.remove("sidebar");
    this.footerElem.classList.remove("sidebar-active");
  }
 

  }
