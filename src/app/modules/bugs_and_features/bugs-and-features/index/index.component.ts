import { Component, OnInit, OnDestroy } from '@angular/core';
import { IsOpenNewTab, RedirectionPage } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Constant } from 'src/app/common/constant/constant';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  public newBugAndFeature: string= 'bug_and_features/manage'
  public pageAccess: string= "Bug or Feature"
  public headerData: any=[];
  public headerFlag: boolean= false;
  public userId: string = '';
  public domainId: string= '';
  public apiKey: string ='';
  public user: any=[];
  public dataDetails: any= [];
  public apiFormData: any =[];
  public dateTime: string = "";
  public bugflag: boolean = true;
  public featureflag: boolean = false;
  public buglist: boolean = false;
  public bugfeatureList: object = {};
  public bugswait: boolean= false;
  public toggleon: boolean = false;
  public docData: object = {};
  public rightPanel: boolean = false;
  public expandToggle: boolean = true;
  public emptyFlag: boolean = true;
  public data : any = [];
  public bodyElem;
  public footerElem;
  public bodyClass;
  public wrapperClass: string="wrapper";
  public featureStart: string;
  public title: string = "Bugs & Features"
    constructor(
    private commonService: CommonService,
    private authentificationService: AuthenticationService,
    private route:Router,
    private platformLoacation:PlatformLocation,
    private tileCard: Title
    ) {
     this.tileCard.setTitle(localStorage.getItem('platformName') + " - " + this.title)
    }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyClass = "parts-list";
    this.wrapperClass = "wrapper-landingpage";
    this.bodyElem.classList.add(this.bodyClass);
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    this.user = this.authentificationService.userValue;
    this.userId = this.user.Userid;
    this.domainId = this.user.domain_id;
    this.apiKey = Constant.ApiKey

    console.log(this.userId, this.domainId, this.apiKey);
    // this.getbugfeaturelist();
    setTimeout(() => {
      this.bugswait=true;
    }, 250);
    if(!this.bugswait){
      this.bugfeatureList = {
        action: true
      }
      // this.commonService.emitbugfeature(this.bugfeatureList);

    }
    const apiFormData = new FormData;
    apiFormData.set('apiKey', this.apiKey);
    apiFormData.set('userId', this.userId);
    apiFormData.set( 'domainId', this.domainId);
    this.apiFormData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId
    }
    // this.commonService.bugsfeaturelist(apiFormData).subscribe((response) => {
    //   console.log('success',response.result);
    //   console.log()
    //   this.dataDetails = response.items
    //   console.log(this.dataDetails,"")
    // })
    this.commonService.bugfeaturedataSubject.subscribe((data)=>{
      console.log(data);
      this.expandToggle = false;
      if(data['action'] == "load"){
        let id = data['Id'];
        this.docData = data['docdata']
        // for (let i of this.dataDetails){
        //   if(i['threadId'] == id){
        //     this.docData = i;
        //     console.log(this.docData)
        //   }
        // }
        this.toggleon = true;
        this.emptyFlag = true;
      }else {
        this.toggleon = false;
        this.emptyFlag = false;
      }
    })
    this.commonService.bugfeaturelistSubject.subscribe((data)=>{
      console.log(data)
    })
    this.featureStart = localStorage.getItem("feature")
    localStorage.removeItem("feature")
    if(this.featureStart == "2"){
      setTimeout(()=>{
        this.feature();
      },500)
    }
  }
  applySearch(action, val) {

  }
  toggleAction(): void{
    this.toggleon = !this.toggleon;
    if (this.toggleon) {
      this.data = {
        action: 'load',
        docdata: this.docData
      }
      this.emptyFlag =true;
      this.expandToggle = true;
    } else {
       this.data = {
        action: 'unload',
        docdata:this.docData
      }
    }
    this.commonService.emitbugfeaturedata(this.data);
  }

  // getbugfeaturelist() {
  //   const apiFormData = new FormData;
  //   apiFormData.set('apiKey', this.apiKey);
  //   apiFormData.set('userId', this.userId);
  //   apiFormData.set( 'domainId', this.domainId);
  //   this.apiFormData = {
  //     apiKey: this.apiKey,
  //     userId: this.userId,
  //     domainId: this.domainId
  //   }
  //   this.commonService.bugsfeaturelist(apiFormData).subscribe((response) => {
  //     console.log('success',response.result);
  //     console.log()
  //     this.dataDetails = response.items
  //     console.log(this.dataDetails,"")
  //   })

  // }

  bugs(): void {
    this.bugflag = !this.bugflag;
    this.bugfeatureList = {
      action: true
    }
    this.commonService.emitbugfeature(this.bugfeatureList);
    this.data = {
      action: 'unload',
      docdata:this.docData
    }
    this.commonService.emitbugfeaturedata(this.data);
    this.expandToggle = true;
  }

  feature() {
    this.bugflag = !this.bugflag;
    this.buglist =false;
    this.bugfeatureList = {
      action: false
    }
    this.commonService.emitbugfeature(this.bugfeatureList);
    this.data = {
      action: 'unload',
      docdata:this.docData
    }
    this.commonService.emitbugfeaturedata(this.data);
    this.expandToggle = true
  }


  newBugorFeature(){
    let url:string = this.newBugAndFeature;
    window.open(url, IsOpenNewTab.openNewTab);
  }
  ngOnDestroy(): void {
    // this.bodyElem.classList.remove(this.bodyClass);
  }

}
