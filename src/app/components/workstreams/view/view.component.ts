import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { WorkstreamService } from '../../.../../../services/workstream/workstream.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public title:string = 'View Workstream';
  public bodyElem;
  public footerElem;
  public bodyHeight: number;
  public innerHeight: number;
  public countryId;
  public user: any;
  public domainId;
  public userId;
  public wsId;

  public editAccess: boolean = false;
  public loading: boolean = true;
  public headerData: Object;
  public imgURL: any;

  public workstreamVal: string = "";
  public descriptionVal: string = "";
  public contentTypes: object;
  public selectedUsers = [];
  public createdBy: string = "";
  public createdDate;
  public updatedBy: string = "";
  public updatedDate;
  public notifyFlag: boolean = false;
  public workstreamUserEmpty: boolean = false;

  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemLoading: boolean = true;
  public itemTotal: number;
  public itemEmpty: boolean = false;
  public itemList: any = [];

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  
  public editRedirect: string;
  public pageAccess: string = "newWorkstream";

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-10;
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        this.getWorkstreamUserLists();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = screen.height;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private wsApi: WorkstreamService,
    private authenticationService: AuthenticationService, 
    
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
  }

  ngOnInit() {
    
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;

    if(authFlag) {
      this.wsId = this.route.snapshot.params['wid'];
      this.editRedirect = `workstreams/edit/${this.wsId}`;
      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': false,
        'search': false
      };

      this.bodyHeight = screen.height;
      setTimeout(() => {
        this.setScreenHeight();  
      }, 500);
      
      this.getWorkstreamData();
    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  // Get Workstream Data
  getWorkstreamData() {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'action': 'view',
      'workstreamId': this.wsId
    };

    this.wsApi.getWorkstreamDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let resultData = response.workstreamDetails;
        this.editAccess = (resultData.editAccess == 1) ? true : false;

        if(resultData.viewAccess == 1) {
          this.workstreamVal = resultData.workstreamName;
          this.descriptionVal = resultData.description;
          this.contentTypes = resultData.contentTypes;
          for(let c in this.contentTypes) {
            let defaultSelection = this.contentTypes[c].isDefault;
            if(defaultSelection == 1) {
              this.contentTypes[c].isDisabled = true;
            } else {
              this.contentTypes[c].isDisabled = false;
            }
          }
          this.createdBy = resultData.createdByUserName;
          let createdDate = moment.utc(resultData.createdOn).toDate();
          let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
          this.createdDate = localCreatedDate;
          this.updatedBy = (resultData.UpdatedByuserName == '') ? '-' : resultData.UpdatedByuserName;
          let updatedDate = moment.utc(resultData.updatedOn).toDate(); 
          let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
          this.updatedDate = (resultData.updatedOn == '') ? '-' : localUpdatedDate;
          this.imgURL = (resultData.workstreamImg == "") ? null : resultData.workstreamImg;
          this.getWorkstreamUserLists();
        } else {
          this.router.navigate(['/forbidden']);
        }
      }
    });  
  }

  // Get Workstream User Lists
  getWorkstreamUserLists() {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'action': 'view',
      'searchKey': '',
      'workstreamId': this.wsId,
      'limit': this.itemLimit,
      'offset': this.itemOffset,
      'type': 1
    };

    this.wsApi.getWorkstreamUsers(apiData).subscribe((response) => {
      if(response.status == "Success") {
        this.loading = false;
        let resultData = response.workstreamUsers;

        if (resultData == '') {
          this.itemEmpty = true;
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          this.itemEmpty = false;
          this.itemTotal = response.totalworkstreamMembers;
          this.itemLength += this.itemLimit;
          this.itemOffset += this.itemLimit;

          for(let ws of resultData) {
            let uname = (this.userId == ws.userId) ? 'You' : ws.userName.trim();
            ws.userName = uname;
            let userStatus = ws.availability;
            let availStatus = '';
            switch(userStatus) {
              case 1:
                availStatus = 'online';
                break;
              case 2:
                availStatus = 'inactive';
                break; 
              default:
                availStatus = 'offline';
                break;    
            }
            ws.availStatus = availStatus;
            this.selectedUsers.push({
              userIndex: 0,
              userId: ws.uid,
              uname: uname,
              userName: ws.userName,
              workstreamRole: ws.workstreamRole,  
              profileImg: ws.profileImg,
              availStatus: ws.availStatus,
              role: ws.userRole,
              displayFlag: true
            });
          }
        }
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+72));
  }

  // Page Navigation
  navigatePage(url){
    this.router.navigate([url]);
  }
  
}