import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportOptionService } from '../.../../../services/export-option/export-option.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppUserNotificationsComponent } from '../../components/common/app-user-notifications/app-user-notifications.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Constant } from '../../common/constant/constant';

@Component({
  selector: 'app-export-option-header',
  templateUrl: './export-option-header.component.html',
  styleUrls: ['./export-option-header.component.scss']
})
export class ExportOptionHeaderComponent implements OnInit {
  @Input() pageData;
  @Output() search: EventEmitter<any> = new EventEmitter();
  public countryId;
  public user: any;
  public domainId;
  public userId;
  public apiData: Object;
  public access: string;
  public welcomeProfileFlag: boolean;
  public profileFlag: boolean;
  public productListFlag: boolean = false;
  public searchFlag: boolean;

  public headTitleFlag: boolean = false;
  public headTitle: string;

  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;

  public userName: string = "";
  public profileImage: string = "";
  constructor(
    private exportOptionAPI: ExportOptionService,
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

  get f() { return this.searchForm.controls; }
  ngOnInit(): void {

    let options = this.pageData;
    //alert(options);
    console.log(options);
    this.access = options.access;
    this.searchFlag = options.search;
    this.profileFlag = options.profile;
    this.welcomeProfileFlag = options.welcomeProfile;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
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
      case 'exportoption':
        this.productListFlag = true;
        break;

    }

  }

  tapnotifications() {
    let bodyElem = document.getElementsByTagName('body')[0];
    bodyElem.classList.add('top-right-notifications-popup');
    const modalRef = this.modalService.open(AppUserNotificationsComponent, this.config);
  }
  getUserProfile() {
    let userData = {
      'api_key': Constant.ApiKey,
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.exportOptionAPI.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.userName = resultData.username;
      this.profileImage = resultData.profile_image;
      localStorage.setItem('userRole', resultData.userRole);
      localStorage.setItem('roleId', resultData.role_id);
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
    if (searchValue.length == 0) {
      this.submitted = false;
      this.clearSearch();
    }
  }
  // Submit Search
  submitSearch() {
    //alert(111);
    this.search.emit(this.searchVal);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.search.emit(this.searchVal);
  }

}
