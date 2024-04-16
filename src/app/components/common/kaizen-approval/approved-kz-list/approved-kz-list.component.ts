import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from "@angular/core";
import { NgxMasonryComponent } from "ngx-masonry";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { AppService } from 'src/app/modules/base/app.service';
import { CommonService } from "src/app/services/common/common.service";
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { LandingpageService }  from 'src/app/services/landingpage/landingpage.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThreadService } from '../../../../services/thread/thread.service';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { Constant} from '../../../../common/constant/constant';
import { AnnouncementService } from '../../../../services/announcement/announcement.service';
import { PrimeNGConfig } from 'primeng/api';
import { AddLinkComponent } from 'src/app/components/common/add-link/add-link.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';

@Component({
  selector: 'app-approved-kz-list',
  templateUrl: './approved-kz-list.component.html',
  styleUrls: ['./approved-kz-list.component.scss']
})
export class ApprovedKzListComponent implements OnInit {

  @Input() items = [];
@Input() thumbView: boolean = true;
@Input() access: string = "doc";
public sconfig: PerfectScrollbarConfigInterface = {};
public teamSystem=localStorage.getItem('teamSystem');
public assetPartPath: string = "assets/images/kaizen/";
public chevronImg: string = `${this.assetPartPath}chevron.png`;
public userId: any;
public roleId: any;
public apiData: any = [];
public domainId : string = "1";
public countryId;
public apiKey: string = this.appService.appData.apiKey;
public docInfoData: any = {};
public panelFlag: boolean = false;
public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
public bodyElem;

@ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
@Output() scrollActionEmit: EventEmitter<any> = new EventEmitter();
@Output() emptyActionEmit: EventEmitter<any> = new EventEmitter();

  constructor(
    private primengConfig: PrimeNGConfig,
    private router : Router,
    private authenticationService: AuthenticationService,
    private documentationService: DocumentationService,
    private landingpageService: LandingpageService,      
    private commonService: CommonService,
    private modalService: NgbModal,
    private appService: AppService,
    private announcementService: AnnouncementService,
    private threadApi: ThreadService
  ) { }

  ngOnInit(): void {
    console.log(this.items);
    this.bodyElem = document.getElementsByTagName('body')[0];   
    window.addEventListener('scroll', this.scroll, true); 
    this.countryId = localStorage.getItem('countryId');
    let user: any = this.authenticationService.userValue;
    if (user) {
        this.domainId = user.domain_id;
        this.userId = user.Userid;
        this.roleId = user.roleId;        
        this.apiData = {
            apiKey: this.apiKey,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId,
            dataId: 0,
            platformId: 3,
        }; 
      }
      this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => { //Right side panel show & hide
        console.log(r)
    });
  }

  actionClick(id){          
    let navFrom = this.commonService.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' kaizen') ? false : true;
    let scrollTop:any = 0;
    localStorage.setItem('kaizenId', id);
    localStorage.setItem('kaizenIddetail', id);
    localStorage.setItem('kaizenInfoNav', 'true');
    this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    let nav = `kaizen/view/${id}`;
    this.router.navigate([nav]);    
  }

  scroll = (event: any): void => {    
    this.scrollActionEmit.emit(event);
    event.preventDefault;
  }
  

}
