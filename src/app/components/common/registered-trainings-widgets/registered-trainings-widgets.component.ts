import { Component, OnInit, NgZone, ViewChild, Input } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { NgxMasonryComponent } from "ngx-masonry";
import { Router } from "@angular/router";
import * as moment from "moment";
import { CommonService } from '../../../services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ViewTraningDetailComponent } from '../../../components/common/view-traning-detail/view-traning-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
interface groupOption {
  name: string;
  code: string;
}
@Component({
  selector: 'app-registered-trainings-widgets',
  templateUrl: './registered-trainings-widgets.component.html',
  styleUrls: ['./registered-trainings-widgets.component.scss'],
  styles: [
    `.masonry-item {
        width: 200px;
        margin: 20px 20px 20px 0px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class RegisteredTrainingsWidgetsComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() fromPage = '';
  @Input() mobileBrowser;
  atgTheme:any = [];
  public updateMasonryLayout: boolean = false;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public expandplus;
  public expandminus;
  public optionsval1;
  public optionsval2;
  public expandminus1;
  public domainId;
  public roleId;
  public userId;
  public countryId;
  public apiData: Object;
  public seemore:boolean=false;
  public user: any;
  selectedGroupOptions: groupOption[];
  public selectedGroup: object;
  public teamId: string = "";
  memberStatus=[];
  public fromMarketplaceLanding: boolean = false;

  public loading: boolean = true;

  reparifyDomain: boolean = false;
  public serviceProviderData = [];
  public serviceProviderPastData = [];
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public bodyClass: string;
  public bodyElem;
  constructor(
    private router: Router,
    private threadApi: ThreadService,
    private LandingpagewidgetsAPI: LandingpageService,
    private ngZone:NgZone,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    public apiUrl: ApiService,
    private modalService: NgbModal,
  ) { }


  ngOnInit(): void {
    this.fromMarketplaceLanding = this.fromPage == 'training' || this.authenticationService.userValue == null ? true : false;
    if(!this.fromMarketplaceLanding){
      this.user = this.authenticationService.userValue;
      this.domainId = this.user.domain_id;
      this.userId = this.user.Userid;
      this.roleId = this.user.roleId;
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.countryId = localStorage.getItem('countryId');
      this.loadTeams();
      this.optionsval1 = [];
      this.optionsval2 = [];   
      var landingpage_attr1=localStorage.getItem('landingpage_attr30');
      this.optionsval1=JSON.parse(landingpage_attr1);
      var landingpage_attr2=localStorage.getItem('landingpage_attr31');
      this.optionsval2=JSON.parse(landingpage_attr2);
      this.trainingData();  
      this.trainingDataPast();  
    }
    else{
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.countryId = localStorage.getItem('countryId');     
      this.trainingData();
      this.mobileBrowser = (this.mobileBrowser) ? true : false;
    }
  }
  setScrollingLocalStorage() {
    let navFrom = this.commonService.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == 'marketplace') ? false : true;
    this.commonService.setListPageLocalStorage(wsFlag, navFrom, 0);
  }
  redirectToInnerDetailPage(id: any, training: any) {
   this.setScrollingLocalStorage();
    //window.open('marketplace/domain/' + training?.domainID + '/detail/' + id,"_blank");
    let url = 'marketplace/domain/' + training?.domainID + '/detail/' + id;
    window.open(url,url);
  }
  redirectToInnerDetailPageByRouter(id: any, training: any) {
    if(!this.fromMarketplaceLanding){    
    this.bodyElem.classList.add("view-modal-popup"); 
    this.bodyElem.classList.add("view-training-detail"); 
    const modalRef = this.modalService.open(ViewTraningDetailComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.trainingId = id; 
    modalRef.componentInstance.trainingServices.subscribe((receivedService) => {      
      if(receivedService){  
        this.bodyElem.classList.remove("view-modal-popup"); 
        this.bodyElem.classList.remove("view-training-detail"); 
        modalRef.dismiss('Cross click');  
        console.log(receivedService);  
      }
    });
  }
  else{
    this.setScrollingLocalStorage();
    //this.router.navigateByUrl('marketplace/domain/' + training?.domainID + '/detail/' + id);
    let url = 'marketplace/domain/' + training?.domainID + '/detail/' + id;
    window.open(url,url);
  }
  }
  redirectToDomainTrainingByRouter(id: any) {
    this.setScrollingLocalStorage();
    //this.router.navigateByUrl('marketplace/domain/' + id);
    let url = 'marketplace/domain/' + id;
    window.open(url,url);
  }
  innerDetailPage() {
    //this.router.navigateByUrl('market-place/training');
    let url = 'market-place/training';
    window.open(url,url);
  }
  checkBirdPriceAvailablity(date: any) {
    let currentDate: any = new Date();
    currentDate.setHours(0,0,0,0)
    let checkDate: any = new Date(date);
    checkDate.setHours(0,0,0,0)
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }
  getDateFormat(value: any) {
    if (value) {
      return moment.utc(value).format('MMM DD, YYYY')
    } else {
      return '';
    }
  }
  
  getStartDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD');
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A')
    } else {
      return '';
    }
  }
  checkShowSeatsLeft(training: any) {
    let pendingParticipant: any = parseInt(training?.maxParticipants) - parseInt(training?.signedupUsers ? training?.signedupUsers : "0");
    if (pendingParticipant < 10) {
      return true;
    } else {
      return false;
    }
  }
  pendingParticipantsCount(training: any) {
    let pendingParticipant: any = parseInt(training?.maxParticipants) - parseInt(training?.signedupUsers ? training?.signedupUsers : "0");
    return pendingParticipant;
  }
  selectEvent(event)
  {       
      this.teamId = this.selectedGroup['id'];
  }
  loadTeams(){   
    this.selectedGroupOptions = [];
    this.selectedGroupOptions.push({
      name: "All",
      code:"0"
    });  
  }
  trainingData(){
    let payload: any;
    if(this.fromMarketplaceLanding){   
      payload = {
        apiKey: Constant.ApiKey,
        userId: '',
        domainId: '', 
        countryId: this.countryId,      
        limit: 8,
        offset: 0,
        startDate: '',
        endDate: '',
        state: '',
        search: '',
        keyword: '',
        isFront: true,
      }  
    }
    else{
      payload = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId, 
        countryId: this.countryId,   
        fromTechDomain: 1,
        trainingType: 1,    
        limit: 5,
        offset: 0,
        startDate: '',
        endDate: '',
        state: '',
        search: '',
        keyword: '',
        isFront: true,
      }
  
    }   
    let url: any;
    url = this.threadApi.apiGetMarketPlaceData(payload);   
    url.subscribe((response: any) => {
      
      if (response && response.data && response.data.marketPlaceData && response.data.marketPlaceData.length) {
        response.data.marketPlaceData.forEach((data: any) => {
          this.serviceProviderData.push(data);
        });
        
      }else{
        this.serviceProviderData = [];
      }
      console.log(this.serviceProviderData);
      setTimeout(() => {
        this.loading = false;
      }, 300);
      this.updateMasonryLayout = true;
    }, (error: any) => {
      this.serviceProviderData = [];
    })
  }

  trainingDataPast(){
    let payload: any = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId, 
      countryId: this.countryId,   
      fromTechDomain: 1,   
      trainingType: 2,   
      limit: 5,
      offset: 0,
      startDate: '',
      endDate: '',
      state: '',
      search: '',
      keyword: '',
      isFront: true,
    }

    let url: any;
    url = this.threadApi.apiGetMarketPlaceData(payload);   
    url.subscribe((response: any) => {
      
      if (response && response.data && response.data.marketPlaceData && response.data.marketPlaceData.length) {
        response.data.marketPlaceData.forEach((data: any) => {
          this.serviceProviderPastData.push(data);
        });
      }else{
        this.serviceProviderPastData = [];
      }
      console.log(this.serviceProviderPastData);
      this.loading = false;
      this.updateMasonryLayout = true;
    }, (error: any) => {
      this.serviceProviderPastData = [];
    })
  }
  
}

