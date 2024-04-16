import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { trigger, transition, style, animate,sequence } from '@angular/animations';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant,forumPageAccess,RedirectionPage,windowHeight } from '../../../common/constant/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';

declare var $:any;
@Component({
  selector: 'app-recent-searches-widgets',
  templateUrl: './recent-searches-widgets.component.html',
  styleUrls: ['./recent-searches-widgets.component.scss'],
  animations: [
    trigger('anim', [
       transition('* => void', [
         style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
         sequence([
           animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
           animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none'  }))
         ])
       ]),
       transition('void => active', [
         style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
         sequence([
           animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
           animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'  }))
         ])
       ])
   ])
  ]
})
export class RecentSearchesWidgetsComponent implements OnInit {
  @Input() fromSearchPage:any;
  @Output() search: EventEmitter<any> = new EventEmitter();
  public expandplus;
  public fromSearchPageHeight;
  public expandminus;
  public optionsval;
  public expandminus1;
  public domainId;
  public countryId;
  public userId;
  public nosearchresText='';
  public loadingrs:boolean=false;
  public nosearchres:boolean=false;
  public searchseemore:boolean=false;
  public currPage: string = "";

  public roleId;
  public landingsearchHistory=[];
  public apiData: Object;
  public escTotal;
  public noescText:string='';
  public user: any;
  public userProfileID;
  public technicianId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private LandingpagewidgetsAPI: LandingpageService,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
  ) { }

  ngOnInit(): void {
    if(this.fromSearchPage) {
      this.fromSearchPageHeight=windowHeight.heightMsTeam;
    }

    let currUrl = this.router.url.split('/');
    this.currPage = currUrl[1];
    console.log(this.currPage)

    this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
      var setdata= JSON.parse(JSON.stringify(r));
      var checkpushtype=setdata.pushType;
      if(checkpushtype == 4) {
        if(this.landingsearchHistory.length>9) {
          this.landingsearchHistory.splice(-1, 1);
        }
        this.getrecentsearchresultwidgets(1);
      }
    });

    var landingpage_attr1=localStorage.getItem('landingpage_attr4');
    this.optionsval=JSON.parse(landingpage_attr1);

    this.route.params.subscribe( params => {
      this.userProfileID = params.puid;
    });

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.userId = (this.userProfileID!='' && this.userProfileID!='undefined' && this.userProfileID!= undefined ) ? this.userProfileID : this.userId;
    let technicianId = localStorage.getItem('technicianId');
    this.technicianId = (technicianId != '' && technicianId != undefined && technicianId != 'undefined' && technicianId != 'null' && technicianId != null) ? technicianId : '';
    this.countryId = localStorage.getItem('countryId');

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'technicianId': this.technicianId,
      'domainId': this.domainId,
      'countryId': this.countryId,
    'limit': 10,
      'offset': 0

    }
    this.apiData = apiInfo;
    this.getrecentsearchresultwidgets('');
  }


  taponclearhistory(event)
  {
    const apiFormData = new FormData();
    apiFormData.append('api_key', this.apiData['apiKey']);
    apiFormData.append('domain_id', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('user_id', this.apiData['userId']);

    this.LandingpagewidgetsAPI.apiclearsearchhistory(apiFormData).subscribe((response) => {
      this.landingsearchHistory=[];
     this.getrecentsearchresultwidgets('');
    });
    event.stopPropagation();
  }

  getrecentsearchresultwidgets(limitVal) {
    if(limitVal) {
      this.apiData['limit']=1;
    }
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('technicianId', this.apiData['technicianId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('escalationType', this.apiData['escalationType']);

    this.LandingpagewidgetsAPI.getusersearchHistory(apiFormData).subscribe((response) => {
      let rstatus=response.status;
      let rresult=response.result;
      //this.nosearchresText=rresult;
      let rsdata=response.searchResults;
      let rstotal=response.total;
      if(rstotal==0) {
        this.loadingrs=false;
        this.nosearchresText=rresult;
        this.nosearchres=true;
      } else {
        this.nosearchres=false;
        //$('.clear-history').removeClass('hide');
      }
      this.escTotal=rstotal;
      let rsthreaddata=rsdata;
      if(rstatus=='Success') {
        if(rsthreaddata.length>0) {
          for (let rs in rsthreaddata) {
            let searchKeyword=rsthreaddata[rs].searchKeyword;
            //let updatedOnDate = moment.utc(announce_updatedOnMobile).toDate();
            //let localupdatedOnDate = moment(updatedOnDate).local().format('MMM DD, YYYY h:mm A');
            if(limitVal) {
            this.landingsearchHistory.unshift({
              searchKey:searchKeyword,
              state: 'active'
              })
            } else {
              this.landingsearchHistory.push({
                searchKey:searchKeyword,
                state: 'active'
              });
            }
          }
          this.loadingrs=false;
        } else {
          this.loadingrs=false;
        }
      } else {
        this.loadingrs=false;
      }
    });
  }

  taponsearchres(value,event) {
    if(!this.fromSearchPage) {
      this.apiUrl.searchFromPageNameClose = true;
      localStorage.setItem('searchValue', value.searchKey);
      localStorage.setItem('currentContentType', '2');
      this.search.emit(value.searchKey);
      let url = this.router.url.split('/');
      let url1 = url[1];
      let url2 = url[2] == undefined ? '' : "/"+url[2];
      let urlVal = url1 + url2;
      this.sharedSvc.setSearchPageLocalStorage(urlVal, '');
      localStorage.setItem('search-router', 'true');
      setTimeout(() => {
        var aurl = 'search-page';
        this.router.navigate([aurl]);
      }, 600);
    }
    else{
      localStorage.setItem('searchValue',value.searchKey);
      this.sharedSvc.emitSearchValuetoHeader(value.searchKey);
      setTimeout(() => {
        this.search.emit(value.searchKey);
      }, 100);
    }
  }

  onTabClose4(event) {
    this.expandplus=event.index;
    $('.minusone4'+this.expandplus+'').removeClass('hide');
    $('.minusone4'+this.expandplus+'').addClass('showinline');
    $('.plusone4'+this.expandplus+'').addClass('hide');
    $('.plusone4'+this.expandplus+'').removeClass('showinline');

    //this.expandminusFlag=false;
    //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }

  onTabOpen4(event) {

    this.expandminus=event.index;
    $('.minusone4'+this.expandminus+'').addClass('hide');
    $('.minusone4'+this.expandminus+'').removeClass('showinline');
    $('.plusone4'+this.expandminus+'').removeClass('hide');
    $('.plusone4'+this.expandminus+'').addClass('showinline');
    this.expandplus=2222;

    // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }
}
