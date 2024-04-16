import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProbingQuestionsService } from '../.../../../services/probing-questions/probing-questions.service';
import { AppUserNotificationsComponent } from '../../components/common/app-user-notifications/app-user-notifications.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Constant, PlatFormType, IsOpenNewTab } from '../../common/constant/constant';

@Component({
  selector: 'app-probing-header',
  templateUrl: './probing-header.component.html',
  styleUrls: ['./probing-header.component.scss']
})
export class ProbingHeaderComponent implements OnInit {

  @Input() pageData;
  @Output() search: EventEmitter<any> = new EventEmitter();
  public countryId;
  public user: any;
  public domainId;
  public userId;
  public apiData: Object;
  public platformName = 'Collabtic';
  public teamSystem = localStorage.getItem('teamSystem');

  public access: string;
  public probListFlag: boolean = false;
  public detFlag: boolean = false;
  public welcomeProfileFlag: boolean;
  public profileFlag: boolean;
  public searchFlag: boolean;
  public headTitleFlag: boolean = false;
  public headTitle: string;
  public displayLogoutPopup: boolean = false;

  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public showItemheader: boolean = true;
  public platformLogo;
  public assetPathplatform: string = "assets/images/";
  public userName: string = "";
  public profileImage: string = "";
  public dialogData: any = {
    access: '',
    navUrl: '',
    platformName: '',
    teamSystem: this.teamSystem,
    visible: true
  };

  constructor(
    private probingApi: ProbingQuestionsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,

  ) {

    config.backdrop = false;
    config.keyboard = false;
    config.size = 'dialog-top';
    // config.windowClass = 'top-right-notifications-popup-only';
  }


  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  closewindowPopup(data) {
    if (data.closeFlag) {
      window.close();
    }
    this.displayLogoutPopup = false;
    location.reload();
  }
  checkHiddenDocument() {
    if (document.hidden) {
    } else {
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }

      let notificationToggle = localStorage.getItem("notificationToggle");
      if (notificationToggle) {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'reload';
      }
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  ngOnInit() {
    this.platformName = localStorage.getItem('platformName');
    this.dialogData.platformName = this.platformName;
    let options = this.pageData;
    this.access = options.access;
    this.searchFlag = options.search;
    this.profileFlag = options.profile;
    this.welcomeProfileFlag = options.welcomeProfile;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');

    let teamSystem = localStorage.getItem('teamSystem');
    if (teamSystem) {
      this.showItemheader = false;
    }
    let platformId = localStorage.getItem('platformId');
    if (platformId == PlatFormType.Collabtic) {
      this.platformLogo = this.assetPathplatform + 'logo.png';
    }
    else if (platformId == PlatFormType.MahleForum) {
      this.platformLogo = this.assetPathplatform + 'mahle-logo.png';
    }
    else if (platformId == PlatFormType.CbaForum) {
      this.platformLogo = this.assetPathplatform + 'mahle-logo.png';
    }
    else if (platformId == PlatFormType.KiaForum) {
      this.platformLogo = this.assetPathplatform + 'mahle-logo.png';
    }
    else {
      this.platformLogo = this.assetPathplatform + 'logo.png';
    }

    if (this.domainId == 52 || this.domainId == 97) {
      this.platformLogo = 'https://mss.mahleforum.com/img/tvs_logo1.png';
    }
    if (this.searchFlag) {
      this.searchVal = options.searchKey;
      if (this.searchVal != undefined && this.searchVal != 'undefined' && this.searchVal != '') {
        this.searchTick = true;
        this.searchClose = this.searchTick;
      }
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
    }

    if (this.profileFlag) {
      this.getUserProfile();
    }

    switch (this.access) {
      case 'probingList':
      case 'newProbing':
      case 'managePart':
      case 'editProbing':
      case 'newWorkstream':
      case 'editWorkstream':
        this.probListFlag = true;
        break;
      case 'partView':
        this.detFlag = true;
        this.headTitle = options.title;
        this.headTitleFlag = true;
        this.showItemheader = false;
        break;
    }

    //console.log(this.access+'::'+this.detFlag)
  }
  tapnotifications() {
    let bodyElem = document.getElementsByTagName('body')[0];
    bodyElem.classList.add('top-right-notifications-popup');
    const modalRef = this.modalService.open(AppUserNotificationsComponent, this.config);
  }
  // Get User Profile
  getUserProfile() {
    let userData = {
      'api_key': Constant.ApiKey,
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.userName = resultData.username;
      this.profileImage = resultData.profile_image;
      localStorage.setItem('userRole', resultData.userRole);
      localStorage.setItem('userProfile', this.profileImage);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
  }

  // Submit Search
  submitSearch() {
    this.search.emit(this.searchVal);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.search.emit(this.searchVal);
  }

  // Close Current Window
  closeWindow() {
    if (this.access != 'partView') {
      window.close();
    } else {
      if (this.teamSystem) {
        window.open('parts', IsOpenNewTab.teamOpenNewTab);
      } else {
        window.close();
      }
    }


  }

}
