import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { EscalationsService } from '../../../services/escalations/escalations.service';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { forumPageAccess, Constant } from 'src/app/common/constant/constant';
import { CodeChallengeMethodValues } from '@azure/msal-common/dist/utils/Constants';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { UserListComponent } from 'src/app/modules/headquarters/user-list/user-list.component';

@Component({
  selector: 'app-manage-user',
  templateUrl:
    './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  @Input() access: any;
  @Input() accessTitle: any;
  @Input() apiData: any;
  @Input() selectedUsers: any;
  @Input() selectionType: string = "single";
  @Input() height: number;
  @Input() action: string = "";
  @Input() preferenceTitle: string = "";
  @Output() filteredUsers: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass: string = "manage-user";
  public title: string = "Users";
  public selectedList = [];
  public manageList = [];
  public listItems = [];
  public removeUserList = [];
  public listLength: number = 0;
  public maxLength: number = 10;
  public availLength: number = 0;
  public exRecentList = [];
  public techsupportrulesBtn: boolean = false;
  public loading: boolean = true;
  public searchLoading: boolean = true;
  public lazyLoading: boolean = false;
  public singleUser = false;
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public empty: boolean = false;
  public actionFlag: boolean = false;
  public removedFlag: boolean;
  public moreActiveFlag: boolean = false;
  public clearFlag: boolean = false;
  public tagusersFlag: boolean = false;
  public uTypeEmployeeFlag: boolean = false;

  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';
  public successMsg: string = "User added successfully";
  userListPageRef: UserListComponent;
  public offset: number = 0;
  public limit: any = 20;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;
  public searchUserFlag: any = null;
  public managerFlag: boolean = false;
  public ppfrFlag: boolean = false;
  public langFlag: boolean = false;
  public uTypeFlag: boolean = false;
  public uTypeDealerFlag: boolean = false;
  public escalationFlag: boolean = false;
  public actionPlanId: string = "0";
  public newSelectionFlag: boolean = false;
  public recentSelectionFlag: boolean = false;
  public innerHeight: number = 0;
  public escalationModelFlag: boolean = false;
  public popupHeight: number = 0;
  showSearchBar: boolean = true;
  public productOwner = [];
  showEmptyRecent: boolean = false;
  showEmptyEscList: boolean = false;
  public emptyEs: boolean = false;
  public saveBtnText: string = '';
  public exRecentListFlag: boolean = false;
  public tvsProdOwner: boolean = false;
  public oldHeight: number = 0;
  currentRequest: any
  user: any
  userType: string = "dekra";
  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (this.action == 'new' || this.escalationModelFlag || this.access == 'dekraUsers') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - 10;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          if (this.managerFlag) {
            this.getManagers();
          }
          else if (this.ppfrFlag) {
            this.getDealerCityArea();
          }
          else if (this.langFlag) {
            if (this.title == "Select Language") {
              this.getLangList();
            }
            else {
              this.userTypeEmployeeList();
            }
          }
          else if (this.escalationFlag && !this.escalationModelFlag) {
            this.exRecentListFlag = false;
            this.getEsclationProductUsers();
          }
          else if (this.escalationFlag && this.escalationModelFlag) {
            this.limit = 20;
            this.getEscalationModels();
          }
          else if (this.tagusersFlag) {
            this.getTaggedUsers();
          }
          else if (this.uTypeEmployeeFlag) {
            this.userTypeEmployeeList();
          }
          else {
            if (this.access == 'techsupportrules') {
              this.getUsersTechSupportRules();
            } else if (this.access == 'dekraUsers') {
              this.getDekraUsers(true);
            }
            else {
              this.getUsers();
            }
          }
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  public userPageData: Object;
  public apiKey: string = Constant.ApiKey;
  public roleId;
  public countryId = '';
  public dekraNetworkId: any;
  constructor(
    public activeModal: NgbActiveModal,
    private escalationApi: EscalationsService,
    private landingApi: LandingpageService,
    private authenticationService: AuthenticationService,
    private threadPostService: ThreadPostService,
    private formBuilder: FormBuilder,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private hqService: HeadquarterService,

  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    this.tvsProdOwner = this.access == "tvs-tag-users" ? true : false;
    this.accessTitle = this.accessTitle != '' ? this.accessTitle : '';
    this.saveBtnText = "Save";
    if (this.action == 'view') {
      this.showSearchBar = false;
    }
    this.removeUserList = [];
    this.removedFlag = false;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.user = this.authenticationService.userValue;
    localStorage.removeItem('searchVal');
    this.height = this.height - 120;
    this.innerHeight = this.height - 130;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';

    this.userPageData = {
      roaccess: 'shop-users',
      domainId: this.user.domain_id,
      userId: this.user.Userid,
      apiKey: this.apiKey,
      roleId: this.user?.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: this.hqService.currentShopName,
      shopId: this.hqService.currentShopId,
    }

    switch (this.access) {
      case 'escalation-level-config':
      case 'escalation':
      case 'dispatchTech':
      case 'techsupport':
        this.height = this.height + 50;
        this.innerHeight = this.height - 95;
        this.availLength = this.maxLength - this.selectedUsers.length;
        this.actionPlanId = this.apiData.actionPlanId;
        if (this.action == 'view') {
          this.manageList = this.selectedUsers;
          this.initList('view', this.manageList);
        } else {
          console.log(this.selectedUsers)
          if (this.access == 'dispatchTech') {
            this.selectedList = this.selectedUsers;
            this.innerHeight = this.height - 185;
          }
          if (this.access == 'techsupport' || this.access == 'escalation-level-config') {
            this.selectedList = this.selectedUsers;
          }
          // Get Domain Users
          this.getUsers();
        }
        break;
      case 'techsupportrules':
        this.oldHeight = this.height + 50;
        this.height = this.height + 50;
        this.innerHeight = this.selectedUsers.length ? this.height - 195 : this.height - 95;
        this.availLength = this.maxLength - this.selectedUsers.length;
        this.selectedList = this.selectedUsers;
        this.getUsersTechSupportRules();
        break;
      case 'escalation-models':
        this.height = this.height;
        this.innerHeight = this.height - 130;
        this.availLength = this.maxLength - this.selectedUsers.length;
        this.limit = 40;
        this.getEscalationModels();
        break;
      case 'escalation-product':
        this.maxLength = 100;
        this.availLength = this.maxLength - this.selectedUsers.length;
        if (this.action == 'view') {
          this.height = this.height;
          this.innerHeight = this.height - 46;
          this.manageList = this.selectedUsers;
          this.initListEsc(this.manageList);
        } else {
          this.height = this.height;
          this.innerHeight = this.height - 122;
          // Get Domain Users 
          this.selectedList = this.selectedUsers;
          this.exRecentListFlag = true;
          this.getEsclationProductUsers();
        }
        break;
      case 'tag-users':
      case 'tvs-tag-users':
        this.maxLength = 100;
        this.title = 'Tag Users';
        this.availLength = this.maxLength - this.selectedUsers.length;
        if (this.action == 'view') {
          this.height = this.height;
          this.innerHeight = this.height - 130;
          this.manageList = this.selectedUsers;
          this.initListEsc(this.manageList);
        } else {
          this.height = this.height;
          this.innerHeight = this.tvsProdOwner ? this.height - 187 : this.height - 87;
          // Get Domain Users 
          this.selectedList = this.selectedUsers;
          this.getTaggedUsers();
        }
        break;
      case 'addmanager':
        this.availLength = this.maxLength - this.selectedUsers.length;
        this.height = this.height - 140;
        this.innerHeight = this.height - 130;
        this.getManagers();
        break;
      case 'ppfr':
        this.availLength = this.maxLength - this.selectedUsers.length;
        this.height = this.height + 100;
        this.innerHeight = this.height - 46;
        this.getDealerCityArea();
        break;
      case 'login':
        this.height = this.height;
        this.innerHeight = this.height - 50;
        this.getLangList();
        break;
      case 'tvssso':
        this.height = this.height;
        this.innerHeight = this.height - 50;
        this.userTypeList();
        break;
      case 'tvsssoDealer':
        this.height = this.height;
        this.innerHeight = this.height - 50;
        this.userTypeDealerList();
        break;
      case 'tvsssoEmployee':
        this.height = this.height;
        this.innerHeight = this.height - 100;
        this.selectedList = this.selectedUsers;
        this.userTypeEmployeeList();
        break;
      case 'profile':
      case 'translate-language':
        this.height = this.height;
        this.innerHeight = this.height - 50;
        if (this.access == 'translate-language') {
          this.selectedList = this.selectedUsers;
        }
        this.getLangList();
        break;
      case 'dekraUsers':
        this.getDekraUsers();
        break;

    }
  }

  switchDekraUser() {
    this.userType = "dekra";
    this.offset = 0;
    if (this.currentRequest) {
      this.currentRequest.unsubscribe()
    }
    this.getDekraUsers();
  }

  switchCustomerUser() {
    this.userType = "customer";
    this.offset = 0;
    if (this.currentRequest) {
      this.currentRequest.unsubscribe()
    }
    this.getDekraUsers();
  }

  getDekraUsers(lazy = false, loading = false) {
    if (!lazy) {
      this.listItems = [];
      this.itemLength = 0;
      if (!loading) {
        this.loading = true;
      }
      this.scrollCallback = true;
    }




    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    if (this.userType == 'dekra' && this.singleUser) {
      apiFormData.append('domainId', "1");
      apiFormData.append("networkId", "1");
    } else {
      apiFormData.append('domainId', this.apiData['domainId']);
      apiFormData.append("networkId", this.user.networkId.toString());
    }
    apiFormData.append('offset', this.offset.toString());
    apiFormData.append('limit', this.limit);

    if (this.listItems.length == 0) {
      this.scrollInit = 1;
      this.offset += this.limit;
    } else {
      this.offset += this.limit;
    }

    if (this.searchVal) {
      apiFormData.append('searchKey', this.searchVal);
    }
    this.currentRequest = this.hqService.getUserList(apiFormData).subscribe((res: any) => {
      if (res && res.items && res.items.length > 0) {
        this.manageList = this.manageList.concat(res.items);
        this.listItems = this.listItems.concat(res.items);
        this.listItems.forEach(e => {
          if (this.selectedList.find(s => s.id == e.userId)) {
            e["checkFlag"] = true;
          }
        })
        // this.manageList = res;
      }
      this.itemTotal = res.total;
      this.itemLength += Number(this.listItems.length);
      this.loading = false;
      this.lazyLoading = false;
    })
  }

  // Get Domain Users
  getUsers() {
    if (this.access == 'techsupport') {
      this.title = this.accessTitle;
    }
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('searchText', this.searchVal);
    if (this.access != 'dispatchTech' && this.access != 'techsupport' && this.access != 'escalation-level-config') {
      this.apiData['offset'] = this.offset;
      apiFormData.append('equipmentNo', this.apiData['equipmentNo']);
      apiFormData.append('limit', this.limit);
      apiFormData.append('offset', this.apiData['offset']);
    }
    if (this.access == 'techsupport') {
      this.apiData['offset'] = this.offset;
      apiFormData.append('techSupport', "1");
      apiFormData.append('teamId', this.apiData['teamId']);
      apiFormData.append('limit', this.limit);
      apiFormData.append('offset', this.apiData['offset']);
    }
    if (this.access == 'dispatchTech') {
      apiFormData.append('isDispatch', this.apiData['isDispatch']);
    }
    if (this.access == 'escalation-level-config') {
      apiFormData.append('fromEscalationConfig', this.apiData['fromEscalationConfig']);
      apiFormData.append('escalationLevelId', this.apiData['escalationLevelId']);
      apiFormData.append('businessRole', this.apiData['businessRole']);
      apiFormData.append('limit', this.limit);
      apiFormData.append('offset', this.apiData['offset']);
    }
    this.searchUserFlag = this.landingApi.getAlldomainUsers(apiFormData).subscribe((response) => {
      //console.log(response)
      this.loading = false;
      this.searchLoading = this.loading;
      this.lazyLoading = this.loading;
      let manageList = response.dataInfo;
      this.listLength += manageList.length;
      if (manageList.length == 0) {
        setTimeout(() => {
          this.empty = true;
        }, 50);

        if (this.apiData['searchKey'] != '' || response.total == 0) {
          this.manageList = [];
          this.listItems = this.manageList;
          this.empty = false;
          this.empty = true;
          this.successMsg = "No Result Found";
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.empty = false;
        this.itemTotal = response.total;
        this.itemLength += manageList.length;
        this.offset += this.limit;
        for (let res in manageList) {
          this.manageList.push(manageList[res]);
          if (this.access == 'dispatchTech' && this.selectedUsers.id == manageList[res].userId) {
            this.selectedList['img'] = manageList[res].profileImage;
          }
        }
        setTimeout(() => {
          this.initList('get', this.manageList);
        }, 50);
      }
    });
  }

  getUsersTechSupportRules() {
    if (this.access == 'techsupportrules') {
      this.title = this.preferenceTitle;
    }
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;
    let preferenceUsers = "";
    preferenceUsers = this.apiData['preferenceUsers'].length > 0 ? JSON.stringify(this.apiData['preferenceUsers']) : "";
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('searchText', this.searchVal);
    this.apiData['offset'] = this.offset;
    apiFormData.append('teamMemberId', this.apiData['teamMemberId']);
    apiFormData.append('type', this.apiData['type']);
    apiFormData.append('teamId', this.apiData['teamId']);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('preferenceUsers', preferenceUsers);

    this.searchUserFlag = this.landingApi.getTechSupportCommonAPIs(apiFormData).subscribe((response) => {
      //console.log(response)
      this.loading = false;
      this.searchLoading = this.loading;
      this.lazyLoading = this.loading;
      let manageList = response.teamMembers;
      this.listLength += manageList.length;
      if (manageList.length == 0) {
        setTimeout(() => {
          this.empty = true;
        }, 50);

        if (this.apiData['searchKey'] != '' || response.teamMembers.length == 0) {
          this.manageList = [];
          this.listItems = this.manageList;
          this.empty = false;
          this.empty = true;
          this.successMsg = "No Result Found";
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.empty = false;
        this.itemTotal = response.totalTeamMembers;
        this.itemLength += manageList.length;
        this.offset += this.limit;
        for (let res in manageList) {
          this.manageList.push(manageList[res]);
        }
        setTimeout(() => {
          this.initList('get', this.manageList);
        }, 50);
      }
    });
  }

  // Get Domain Managers
  getManagers() {
    this.managerFlag = true;
    this.title = 'Select Manager';
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', '1');
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);

    this.searchUserFlag = this.landingApi.getManagerList(apiFormData).subscribe((response) => {
      //console.log(response)
      this.loading = false;
      this.searchLoading = this.loading;
      this.lazyLoading = this.loading;
      let manageList = response.managerList;
      this.listLength += manageList.length;
      if (manageList.length == 0) {
        setTimeout(() => {
          this.empty = true;
        }, 50);

        if (response.total == 0) {
          this.manageList = [];
          this.listItems = this.manageList;
          this.empty = false;
          this.empty = true;
          this.successMsg = "No Result Found";
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.empty = false;
        this.itemTotal = response.total;
        this.itemLength += manageList.length;
        //console.log(manageList.length);
        this.offset += this.limit;
        for (let res in manageList) {
          manageList[res].profileImg = manageList[res].profileImage;
          this.manageList.push(manageList[res]);
        }
        setTimeout(() => {
          this.initList('gets', this.manageList);
        }, 50);
      }
    });
  }



  // Get Domain Users
  getDealerCityArea() {
    this.ppfrFlag = true;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;

    if (this.action == 'city') {
      this.title = 'Select Dealer City';
    }
    else {
      this.title = 'Select Dealer Area';
    }
    const apiFormData = new FormData();
    let countryId = localStorage.getItem('countryId');
    console.log(countryId);
    apiFormData.append('api_key', this.apiData['api_key']);
    apiFormData.append('domain_id', this.apiData['domain_id']);
    apiFormData.append('user_id', this.apiData['user_id']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);

    this.searchUserFlag = this.escalationApi.getUsagemetricsfiltercontent(apiFormData).subscribe(res => {
      if (res.status == 'Success') {
        //console.log(res)
        this.loading = false;
        this.searchLoading = this.loading;
        this.lazyLoading = this.loading;
        let manageList = [];
        if (this.action == 'city') {
          manageList = res.data[0].cityContent;
        }
        else {
          manageList = res.data[0].areaContent;
        }
        this.listLength += manageList.length;
        if (manageList.length == 0) {
          setTimeout(() => {
            this.empty = true;
          }, 50);

          if (this.apiData['searchKey'] != '' || manageList.length == 0) {
            this.manageList = [];
            this.listItems = this.manageList;
            this.empty = false;
            this.empty = true;
            this.successMsg = "No Result Found";
          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          this.empty = false;
          this.itemTotal = manageList.length;
          this.itemLength += manageList.length;
          this.offset += this.limit;
          for (let res in manageList) {
            //this.manageList.push(manageList[res]);
            this.manageList.push({
              id: manageList[res],
              name: manageList[res],
              displayFlag: true
            });
          }
          setTimeout(() => {
            this.listItems = [];
            this.listItems = this.manageList;
            //console.log(this.listItems)
          }, 50);
        }
      }
    });
  }

  // Get Domain Users
  getLangList() {
    this.langFlag = true;
    this.title = 'Select Language';
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;

    const apiFormData = new FormData();
    let countryId = localStorage.getItem('countryId');
    console.log(countryId);
    apiFormData.append('apiKey', this.apiData['api_key']);
    apiFormData.append('domainId', this.apiData['domain_id']);
    apiFormData.append('userId', this.apiData['user_id']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);
    if (this.apiData['translate'] == "1") {
      apiFormData.append('translate', this.apiData['translate']);
    }

    this.searchUserFlag = this.authenticationService.getLanguageList(apiFormData).subscribe(res => {
      if (res.status == 'Success') {
        console.log(res.data.items)
        this.loading = false;
        this.searchLoading = this.loading;
        this.lazyLoading = this.loading;
        let manageList = [];
        manageList = res.data.items;
        this.listLength += manageList.length;
        if (manageList.length == 0) {
          setTimeout(() => {
            this.empty = true;
          }, 50);

          if (this.apiData['searchKey'] != '' || manageList.length == 0) {
            this.manageList = [];
            this.listItems = this.manageList;
            this.empty = false;
            this.empty = true;
            this.successMsg = "No Result Found";
          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          this.empty = false;
          this.itemTotal = manageList.length;
          this.itemLength += manageList.length;
          this.offset += this.limit;
          for (let res in manageList) {
            manageList[res].displayFlag = true;
            this.manageList.push(manageList[res]);
          }
          setTimeout(() => {
            this.initListLang('get', this.manageList);
          }, 50);
        }
      }
    });
  }

  // Get escalation-product Users
  getEsclationProductUsers() {
    this.escalationFlag = true;
    this.saveBtnText = 'ADD';
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;
    const apiFormData = new FormData();
    apiFormData.append('api_key', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);

    this.searchUserFlag = this.escalationApi.getAllEscalationUsers(apiFormData).subscribe((response) => {
      console.log(response)
      this.loading = false;
      this.searchLoading = this.loading;
      this.lazyLoading = this.loading;
      let manageList = response.data.usersList == undefined ? '' : response.data.usersList;
      if (this.exRecentListFlag) {
        let exRecentList = (response.data.recentSelection == undefined) ? '' : response.data.recentSelection;
        //if(exRecentList != ''){
        if (exRecentList.length > 0) {
          let exRecentListPush = [];
          for (let esres in exRecentList) {
            exRecentList[esres].displayFlag = true;
            exRecentListPush.push(exRecentList[esres]);
          }
          setTimeout(() => {
            this.initListRecentEscal('get', exRecentListPush);
          }, 50);
        }
        else {
          let exRecentListPush = [];
          setTimeout(() => {
            this.initListRecentEscal('get', exRecentListPush);
          }, 50);
        }
      }
      //}
      console.log(manageList);
      if (manageList != '') {
        this.listLength += manageList.length;
        if (manageList.length == 0) {
          setTimeout(() => {
            //this.empty = true;
            this.emptyEs = true;
          }, 50);

          if (this.apiData['searchKey'] != '' || response.data.total == 0) {
            this.manageList = [];
            this.listItems = this.manageList;
            //this.empty = true;
            this.emptyEs = true;
            this.successMsg = "No Result Found";
          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          //this.empty = false;
          this.emptyEs = false;
          this.itemTotal = response.data.total;
          this.itemLength += manageList.length;
          this.offset += this.limit;
          for (let res in manageList) {
            manageList[res].displayFlag = true;
            this.manageList.push(manageList[res]);
          }
          setTimeout(() => {
            this.initList('get', this.manageList);
            this.newSelectionFlag = true;
          }, 50);
        }
      }
      else {
        if (this.apiData['offset'] == 0) {
          this.emptyEs = true;
          //this.innerHeight = this.height - 20;
        }
      }
    });
  }


  getTaggedUsers() {
    this.tagusersFlag = true;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;

    this.productOwner = this.apiData['productOwner'];
    console.log(this.productOwner);

    let fromTechSupport = this.apiData['fromTechSupport'] != undefined ? this.apiData['fromTechSupport'] : '';
    let fromEscalationSupport = this.apiData['fromEscalationSupport'] != undefined ? this.apiData['fromEscalationSupport'] : '';

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('threadId', this.apiData['threadId']);
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('searchKey', this.searchVal);

    if (fromTechSupport == '1') {
      apiFormData.append("teamId", this.apiData['teamId']);
      apiFormData.append("fromTechSupport", this.apiData['fromTechSupport']);
    }

    if (fromEscalationSupport == '1') {

    }

    this.searchUserFlag = this.threadPostService.getAllTagUsersList(apiFormData).subscribe((response) => {
      console.log(response)
      this.loading = false;
      this.searchLoading = this.loading;
      this.lazyLoading = this.loading;
      let manageList = response.items;

      /*let exRecentList = (response.data.recentSelection == undefined) ? '' : response.data.recentSelection;
      if(exRecentList != ''){
          if(exRecentList.length>0){
            let exRecentListPush = [];
            for(let esres in exRecentList) {
              exRecentList[esres].displayFlag = true;
              exRecentListPush.push(exRecentList[esres]);
            }
            setTimeout(() => {
              this.initListRecentEscal('get', exRecentListPush);
            }, 50);
          }
      }  */

      this.listLength += manageList.length;
      if (manageList.length == 0) {
        setTimeout(() => {
          this.empty = true;
        }, 50);

        if (this.apiData['searchKey'] != '' || response.data.total == 0) {
          this.manageList = [];
          this.listItems = this.manageList;
          this.empty = false;
          this.empty = true;
          this.successMsg = "No Result Found";
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.empty = false;
        this.itemTotal = response.data.total;
        this.itemLength += manageList.length;
        this.offset += this.limit;
        for (let res in manageList) {
          manageList[res].displayFlag = true;
          this.manageList.push(manageList[res]);
        }

        console.log(this.manageList);
        setTimeout(() => {
          this.initList('get', this.manageList);
          //this.newSelectionFlag = true; 
        }, 50);
      }
    });
  }

  // Get escalation-Models
  getEscalationModels() {
    this.title = this.accessTitle;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;
    this.escalationFlag = true;
    this.escalationModelFlag = true;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('productAttributeId', this.apiData['productAttributeId']);
    apiFormData.append('productOptionData', this.apiData['productOptionData']);

    this.searchUserFlag = this.escalationApi.getEscalationLookupTableData(apiFormData).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.searchLoading = this.loading;
      this.lazyLoading = this.loading;
      let manageList = [];
      manageList = response.items;
      console.log(manageList);

      this.listLength += manageList.length;
      if (manageList.length == 0) {
        setTimeout(() => {
          this.empty = true;
        }, 50);

        if (this.apiData['searchKey'] != '' || response.data.total == 0) {
          this.manageList = [];
          this.listItems = this.manageList;
          this.empty = false;
          this.empty = true;
          this.successMsg = "No Result Found";
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.itemTotal = response.total;
        this.itemLength += manageList.length;
        this.offset += this.limit;
        for (let res in manageList) {
          manageList[res].displayFlag = true;
          this.manageList.push(manageList[res]);
        }
        setTimeout(() => {
          this.initList('view', this.manageList);
        }, 50);
      }

    });
  }


  userTypeList() {
    this.uTypeFlag = true;
    this.title = 'Select User Types';
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.loading = false;
    this.searchLoading = this.loading;
    this.lazyLoading = this.loading;
    let manageList = [];
    manageList = this.apiData;
    if (manageList.length == 0) {
      setTimeout(() => {
        this.empty = true;
      }, 50);

      if (this.apiData['searchKey'] != '' || manageList.length == 0) {
        this.manageList = [];
        this.listItems = this.manageList;
        this.empty = false;
        this.empty = true;
        this.successMsg = "No Result Found";
      }
    } else {
      this.scrollCallback = true;
      this.scrollInit = 1;

      this.empty = false;
      this.itemTotal = manageList.length;
      this.itemLength += manageList.length;
      this.offset += this.limit;
      for (let res in manageList) {
        manageList[res].displayFlag = true;
        this.manageList.push(manageList[res]);
      }
      setTimeout(() => {
        this.initListuType('get', this.manageList);
      }, 50);
    }

  }

  userTypeDealerList() {
    this.uTypeDealerFlag = true;
    this.title = this.accessTitle;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.loading = false;
    this.searchLoading = this.loading;
    this.lazyLoading = this.loading;
    let manageList = [];
    manageList = this.apiData;
    if (manageList.length == 0) {
      setTimeout(() => {
        this.empty = true;
      }, 50);

      if (this.apiData['searchKey'] != '' || manageList.length == 0) {
        this.manageList = [];
        this.listItems = this.manageList;
        this.empty = false;
        this.empty = true;
        this.successMsg = "No Result Found";
      }
    } else {
      this.scrollCallback = true;
      this.scrollInit = 1;

      this.empty = false;
      this.itemTotal = manageList.length;
      this.itemLength += manageList.length;
      this.offset += this.limit;
      for (let res in manageList) {
        manageList[res].displayFlag = true;
        if (this.title == 'Select Role') {
          manageList[res].id = manageList[res].roleId;
          manageList[res].name = manageList[res].roleName;
          manageList[res].shortName = '';
        }
        else if (this.title == 'Select Branch') {
          manageList[res].id = manageList[res].branchId;
          manageList[res].name = manageList[res].branchName;
          manageList[res].shortName = '';
        }
        else if (this.title == 'Select Industry') {
          manageList[res].id = manageList[res].id;
          manageList[res].name = manageList[res].name;
          manageList[res].shortName = '';
        }
        else {
          manageList[res].id = manageList[res].id;
          manageList[res].name = manageList[res].name;
          manageList[res].shortName = manageList[res].shortName;
        }
        this.manageList.push(manageList[res]);
      }
      setTimeout(() => {
        this.initListuTypeDealer('get', this.manageList);
      }, 50);
    }

  }

  userTypeEmployeeList() {
    this.langFlag = true;
    if (this.apiData['requestType'] == '1') {
      this.title = "Select Designation";
    }
    else {
      this.title = "Select User Name";
    }
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.offset;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('dealerCode', this.apiData['dealerCode']);
    apiFormData.append('roleName', this.apiData['roleName']);
    apiFormData.append('branchId', this.apiData['branchId']);
    apiFormData.append('roleId', this.apiData['roleId']);
    apiFormData.append('designation', this.apiData['designation']);
    apiFormData.append('requestType', this.apiData['requestType']);
    apiFormData.append('searchText', this.searchVal);
    apiFormData.append('limit', this.limit);
    apiFormData.append('offset', this.apiData['offset']);

    this.searchUserFlag = this.authenticationService.getEmployeeInfoTVSSSO(apiFormData).subscribe(res => {
      if (res.status == 'Success') {
        console.log(res.dealerEmployees)
        this.loading = false;
        this.searchLoading = this.loading;
        this.lazyLoading = this.loading;
        let manageList = [];
        if (this.apiData['requestType'] == '1') {
          manageList = res.designation;
        }
        else {
          manageList = res.dealerEmployees;
        }
        this.listLength += manageList.length;
        if (manageList.length == 0) {
          setTimeout(() => {
            this.empty = true;
          }, 50);

          if (this.apiData['searchKey'] != '' || manageList.length == 0) {
            this.manageList = [];
            this.listItems = this.manageList;
            this.empty = false;
            this.empty = true;
            this.successMsg = "No Result Found";
          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.empty = false;
          this.itemTotal = res.total;
          this.itemLength += manageList.length;
          this.offset += this.limit;
          if (this.apiData['requestType'] == '1') {
            for (let res in manageList) {
              manageList[res].displayFlag = true;
              manageList[res].id = manageList[res].name;
              manageList[res].namme = manageList[res].name;
              this.manageList.push(manageList[res]);
            }
          }
          else {
            for (let res in manageList) {
              manageList[res].displayFlag = true;
              manageList[res].id = manageList[res].employeeId;
              manageList[res].namme = manageList[res].name;
              this.manageList.push(manageList[res]);
            }
          }
          setTimeout(() => {
            this.initListLang('get', this.manageList);
          }, 50);
        }
      }
    });
  }

  // Initiate User List
  initList(action, manageList) {
    let start = 0;
    let end = 0;
    this.listItems = [];
    this.listItems = manageList;
    let checkDisplayFlag = (action == 'get') ? true : false;

    switch (action) {
      case 'get':
        start = this.offset - this.limit
        end = this.offset - 1;
        break;

      default:
        //console.log(this.manageList.length)
        end = manageList.length - 1;
        break;
    }
    for (let m in this.listItems) {
      let displayFlag = true;
      if (start <= parseInt(m) && end >= parseInt(m)) {
        if (this.selectedList.length > 0) {
          let chkIndex = this.selectedList.findIndex(option => option.id == this.listItems[m].userId);
          displayFlag = (chkIndex < 0) ? true : false;
        }
        else {
          if (this.escalationModelFlag) {
            this.innerHeight = 0;
            this.innerHeight = this.height - 50;
          }
          if (this.access == 'techsupportrules') {
            this.innerHeight = this.height + 95;
          }
        }

        this.listItems[m]['action'] = "";
        this.listItems[m]['displayFlag'] = displayFlag;
        this.listItems[m]['checkDisplayFlag'] = checkDisplayFlag;
        this.listItems[m]['checkFlag'] = !displayFlag;
        this.listItems[m]['itemExists'] = false;
        this.listItems[m]['activeMore'] = false;
        this.listItems[m]['actionFlag'] = false;
        this.listItems[m]['itemClass'] = '';
        if (action == 'view') {
          this.listItems[m]['itemClass'] = (this.listItems[m]['isDefault'] == 1) ? 'default' : '';
        }
      }
    }
    console.log(this.listItems);
    if (action == 'view') {
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }

  }


  // Initiate User List
  initListLang(action, manageList) {
    this.listItems = [];
    this.listItems = manageList;
    for (let m in this.listItems) {
      this.listItems[m]['action'] = "";
      this.listItems[m]['displayFlag'] = true;
      this.listItems[m]['checkFlag'] = false;
      this.listItems[m]['itemExists'] = false;
      this.listItems[m]['activeMore'] = false;
      this.listItems[m]['actionFlag'] = false;

      if (action == 'get') {
        if (this.title == "Select Language") {
          if (this.access != 'translate-language') {
            let id = localStorage.getItem('languageId');
            let name = localStorage.getItem('languageName');
            this.selectedList.push({
              id: id,
              name: name
            });
          }
          for (let st of this.selectedList) {
            if (st.id == this.listItems[m].id) {
              this.listItems[m]['checkFlag'] = true;
            }
          }
        }
        else {
          for (let st of this.selectedList) {
            if (st.id == this.listItems[m].id) {
              this.listItems[m]['checkFlag'] = true;
            }
          }
        }
      }
    }
  }

  // Initiate User List
  initListuType(action, manageList) {

    this.listItems = [];
    this.listItems = manageList;
    let countAllDisplayFlag = 0;
    for (let m in this.listItems) {
      let displayFlag = true;
      if (this.selectedList.length > 0) {
        let chkIndex = this.selectedList.findIndex(option => option.id == this.listItems[m].userId);
        displayFlag = (chkIndex < 0) ? true : false;
      }
      if (!displayFlag) {
        countAllDisplayFlag++;
      }
      this.listItems[m]['action'] = "";
      this.listItems[m]['displayFlag'] = true;
      this.listItems[m]['checkFlag'] = false;
      this.listItems[m]['itemExists'] = false;
      this.listItems[m]['activeMore'] = false;
      this.listItems[m]['actionFlag'] = false;

      if (action == 'get') {
        console.log(this.selectedUsers['userTypeName']);
        if (this.selectedUsers['userTypeName'] != '') {
          console.log(this.selectedUsers['userTypeName']);
          let id = this.selectedUsers['userTypeId'];
          let name = this.selectedUsers['userTypeName'];
          this.selectedList.push({
            id: id,
            name: name
          });
        }
        for (let st of this.selectedList) {
          if (st.id == this.listItems[m].id) {
            this.listItems[m]['checkFlag'] = true;
          }
        }
      }
    }
    if (countAllDisplayFlag == this.listItems.length) {
      this.showEmptyEscList = true;
    } else {
      this.showEmptyEscList = false;
    }
  }

  // Initiate User List
  initListuTypeDealer(action, manageList) {

    this.listItems = [];
    this.listItems = manageList;
    let countAllDisplayFlag = 0;
    for (let m in this.listItems) {
      let displayFlag = true;
      if (this.selectedList.length > 0) {
        let chkIndex = this.selectedList.findIndex(option => option.id == this.listItems[m].id);
        displayFlag = (chkIndex < 0) ? true : false;
      }
      if (!displayFlag) {
        countAllDisplayFlag++;
      }
      this.listItems[m]['action'] = "";
      this.listItems[m]['displayFlag'] = true;
      this.listItems[m]['checkFlag'] = false;
      this.listItems[m]['itemExists'] = false;
      this.listItems[m]['activeMore'] = false;
      this.listItems[m]['actionFlag'] = false;

      if (action == 'get') {
        console.log(this.selectedUsers['name']);
        if (this.selectedUsers['name'] != '') {
          console.log(this.selectedUsers['name']);
          let id = this.selectedUsers['id'];
          let name = this.selectedUsers['name'];
          this.selectedList.push({
            id: id,
            name: name
          });
        }
        for (let st of this.selectedList) {
          if (st.id == this.listItems[m].id) {
            this.listItems[m]['checkFlag'] = true;
          }
        }
      }
    }
    if (countAllDisplayFlag == this.listItems.length) {
      this.showEmptyEscList = true;
    } else {
      this.showEmptyEscList = false;
    }
  }

  // Initiate User List
  initListRecentEscal(action, manageList) {
    this.exRecentList = [];
    this.exRecentList = manageList;
    let checkDisplayFlag = (action == 'get') ? true : false;
    let countAllDisplayFlag = 0;
    for (let m in this.exRecentList) {
      let displayFlag = true;
      if (this.selectedList.length > 0) {
        let chkIndex = this.selectedList.findIndex(option => option.id == this.exRecentList[m].userId);
        displayFlag = (chkIndex < 0) ? true : false;
      }
      if (!displayFlag) {
        countAllDisplayFlag++;
      }
      this.exRecentList[m]['action'] = "";
      this.exRecentList[m]['displayFlag'] = displayFlag;
      this.exRecentList[m]['checkDisplayFlag'] = checkDisplayFlag;
      this.exRecentList[m]['checkFlag'] = !displayFlag;
      this.exRecentList[m]['itemExists'] = false;
      this.exRecentList[m]['activeMore'] = false;
      this.exRecentList[m]['actionFlag'] = false;
      this.exRecentList[m]['itemClass'] = '';
    }
    if (countAllDisplayFlag == this.exRecentList.length) {
      this.showEmptyRecent = true;
    } else {
      this.showEmptyRecent = false;
    }
    this.recentSelectionFlag = true;
  }


  // Initiate User List
  initListEsc(manageList) {
    this.escalationFlag = true;
    this.loading = false;
    this.searchLoading = this.loading;
    this.lazyLoading = this.loading;
    this.listItems = [];
    this.listItems = manageList;
    console.log(this.listItems);
  }

  // Item Selection
  itemSelection(type, index, id, flag) {
    type = (this.access == 'dispatchTech') ? this.selectionType : type;
    this.clearFlag = false;
    console.log(this.action + '::' + type + '::' + id + '::' + index + '::' + flag)
    if (this.action == 'new') {
      switch (type) {
        case 'single':
          if (!flag) {
            this.listItems[index].displayFlag = !flag;
            this.listItems[index].checkFlag = flag;
            let rmIndex = this.selectedList.findIndex(option => option.id == id);
            this.selectedList.splice(rmIndex, 1);
            setTimeout(() => {
              this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
            }, 100);
          } else {
            if (this.access == 'dispatchTech') {
              this.selectedList = [];
              let id = this.listItems[index].userId;
              let name = this.listItems[index].userName;
              let img = this.listItems[index].profileImg;
              this.selectedList.push({
                id: id,
                name: name,
                img: img
              });
              this.applyTech();
            }
            else if (this.access == 'techsupportrules') {
              this.selectedList = [];
              let id = this.listItems[index].userId;
              let name = this.listItems[index].emailAddress != '' && this.listItems[index].emailAddress != undefined ? this.listItems[index].emailAddress : this.listItems[index].userName;
              let img = this.listItems[index].profileImg;
              let role = this.listItems[index].title;
              this.selectedList.push({
                id: id,
                name: name,
                img: img,
                role: role
              });
              this.applyTech();
            } else {
              if (this.selectedList.length < this.availLength) {
                console.log(this.listItems)
                this.listItems[index].displayFlag = !flag;
                this.listItems[index].checkFlag = flag;
                let id = parseInt(this.listItems[index].userId);
                let name = this.listItems[index].userName;
                let img = this.listItems[index].profileImg;
                this.selectedList.push({
                  id: id,
                  name: name,
                  img: img
                });
                this.headerCheck = 'checked';
              }
            }
          }
          break;
        case 'multiple':
          if (this.access == 'dispatchTech') {
            this.listItems[index].displayFlag = !flag;
            this.listItems[index].checkFlag = flag;
            let id = this.listItems[index].userId;
            let name = this.listItems[index].userName;
            let img = this.listItems[index].profileImg;
            this.selectedList.push({
              id: id,
              name: name,
              img: img
            });
          }
          break;
      }
    } else {
      if (!flag) {
        this.listItems[index].displayFlag = !flag;
        this.listItems[index].checkFlag = flag;
        let rmIndex = this.selectedList.findIndex(option => option.id == id);
        this.selectedList.splice(rmIndex, 1);
      } else {
        if (this.selectedList.length < this.availLength) {
          this.listItems[index].displayFlag = !flag;
          this.listItems[index].checkFlag = flag;
          let name = this.listItems[index].userName;
          let uid = this.listItems[index].userId;
          let data = {
            mId: uid,
            mName: name
          };
          this.filteredUsers.emit(data);
          console.log(name);
        }
      }
    }
  }

  itemSelectionPPFR(item) {
    this.filteredUsers.emit(item);
    console.log(item);
  }


  itemSelectionuType(index, id, flag, type) {
    if (type != 0) {
      this.clearFlag = false;
      for (let t in this.listItems) {
        this.listItems[t].checkFlag = false;
      }
      this.listItems[index].checkFlag = flag;
      if (!flag) {
        let rmIndex = this.selectedList.findIndex(option => option.id == id);
        this.selectedList.splice(rmIndex, 1);
      } else {
        console.log(this.listItems[index])
        let id = this.listItems[index].id;
        let name = this.listItems[index].name;
        this.selectedList.push({
          id: id,
          name: name
        });
        let data = {
          'uTypeId': id,
          'uTypeName': name
        }
        setTimeout(() => {
          this.filteredUsers.emit(data);
        }, 350);
      }
    }
  }


  itemSelectionuTypeDealer(index, id, flag) {

    this.clearFlag = false;
    for (let t in this.listItems) {
      this.listItems[t].checkFlag = false;
    }
    this.listItems[index].checkFlag = flag;
    if (!flag) {
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
    } else {
      console.log(this.listItems[index])
      let id = this.listItems[index].id;
      let name = this.listItems[index].name;
      let shortName = this.listItems[index].shortName;
      this.selectedList.push({
        id: id,
        name: name,
        shortName: shortName
      });
      let data = {
        'id': id,
        'name': name,
        shortName: shortName
      }
      setTimeout(() => {
        this.filteredUsers.emit(data);
      }, 350);
    }

  }
  clearDekraSelection() {
    this.selectedList = [];
    this.listItems.forEach(e => {
      if (this.selectedList.find(s => s.id == e.userId)) {
        e["checkFlag"] = true;
      } else {
        e["checkFlag"] = false
      }
    })
  }

  itemSelectionuTypeDekraUser(index, id, flag) {

    if (this.singleUser) {
      this.selectedList = [];
      this.listItems.forEach(e => {
        if (this.selectedList.find(s => s.id == e.userId)) {
          e["checkFlag"] = true;
        } else {
          e["checkFlag"] = false
        }
      })
    }
    setTimeout(() => {
      this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
    }, 100);

    this.clearFlag = false;
    for (let t in this.listItems) {
      // this.listItems[t].checkFlag = false;
      if (this.listItems[t].userId) {
        this.listItems[t]["id"] = this.listItems[t].userId;
      }
    }
    this.listItems[index].checkFlag = flag;
    if (!flag) {
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
      // setTimeout(() => {
      //   this.filteredUsers.emit({}); 
      // }, 350);
    } else {
      console.log(this.listItems[index])
      let id = this.listItems[index].id;
      let userName = this.listItems[index].userName;
      let phoneNo = this.listItems[index].phoneNo;
      let email = this.listItems[index].email;
      let businessRoleStr = this.listItems[index].businessRoleStr;
      this.selectedList.push({
        'id': id,
        'userName': userName,
        'phoneNo': phoneNo,
        'email': email,
        'businessRoleStr': businessRoleStr,
        'profileImage': this.listItems[index].profileImage,
        'firstName': this.listItems[index].firstName,
        'lastName': this.listItems[index].lastName

      });
      let data = {
        'id': id,
        'userName': userName,
        'phoneNo': phoneNo,
        'email': email,
        'businessRoleStr': businessRoleStr,
        'profileImage': this.listItems[index].profileImage,
        'firstName': this.listItems[index].firstName,
        'lastName': this.listItems[index].lastName
      }
      if (this.singleUser) {
        setTimeout(() => {
          this.filteredUsers.emit([data]);
        }, 350);
      }
    }

  }

  itemSelectionuTypeEmployee(index, id, flag) {

    this.clearFlag = false;
    for (let t in this.listItems) {
      this.listItems[t].checkFlag = false;
    }
    this.listItems[index].checkFlag = flag;
    if (!flag) {
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
    } else {
      console.log(this.listItems[index])
      let id = this.listItems[index].id;
      let name = this.listItems[index].name;
      this.selectedList.push({
        id: id,
        name: name
      });
      let data = {
        'id': id,
        'name': name,
      }
      setTimeout(() => {
        this.filteredUsers.emit(data);
      }, 350);
    }

  }

  // Item Selection lang
  itemSelectionLang(index, id, flag) {
    if (this.title != "Select Language") {
      this.itemSelectionuTypeEmployee(index, id, flag);
    }
    else {
      this.clearFlag = false;
      for (let t in this.listItems) {
        this.listItems[t].checkFlag = false;
      }
      this.listItems[index].checkFlag = flag;
      if (!flag) {
        let rmIndex = this.selectedList.findIndex(option => option.id == id);
        this.selectedList.splice(rmIndex, 1);
      } else {
        if (this.access == 'translate-language') {
          let id = this.listItems[index].id;
          let name = this.listItems[index].name;
          let languageCode = this.listItems[index].languageCode;
          this.selectedList.push({
            id: id,
            name: name,
            languageCode: languageCode
          });
          let data = {
            id: id,
            name: name,
            languageCode: languageCode
          }
          this.filteredUsers.emit(data);
        }
        else {
          let id = this.listItems[index].id;
          let name = this.listItems[index].name;
          this.selectedList.push({
            id: id,
            name: name
          });

          let data = {
            'langId': id,
            'langName': name
          }
          setTimeout(() => {
            this.filteredUsers.emit(data);
          }, 350);
          const apiFormData = new FormData();
          let countryId = localStorage.getItem('countryId');
          let countryName = localStorage.getItem('countryName');
          console.log(countryId);
          apiFormData.append('apiKey', this.apiData['api_key']);
          apiFormData.append('domainId', this.apiData['domain_id']);
          apiFormData.append('userId', this.apiData['user_id']);
          apiFormData.append('countryId', countryId);
          apiFormData.append('countryName', countryName);
          apiFormData.append('languageId', id);
          apiFormData.append('languageName', name);

          if (this.apiData['user_id'] == 'undefined' || this.apiData['user_id'] == undefined) { }
          else {
            this.searchUserFlag = this.authenticationService.saveUserLanguageOption(apiFormData).subscribe(res => {
              console.log(res.result);
            });
          }
        }

      }

    }
  }

  // Item Selection
  itemSelectionEscUsers(type, index, id, flag) {
    this.clearFlag = false;
    console.log(this.action + '::' + type + '::' + id + '::' + index + '::' + flag)
    if (!flag) {
      this.listItems[index].displayFlag = !flag;
      this.listItems[index].checkFlag = flag;
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
      setTimeout(() => {
        this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
        //this.clearFlag = (this.selectedList.length == 0) ? true : false;
      }, 100);
    } else {
      if (this.selectedList.length < this.availLength) {
        this.listItems[index].displayFlag = !flag;
        this.listItems[index].checkFlag = flag;
        let id = this.listItems[index].userId;
        let name = this.listItems[index].emailAddress;
        let img = this.listItems[index].profileImage;
        let role = this.listItems[index].assigneeRole;
        this.selectedList.push({
          id: id,
          name: name,
          img: img,
          role: role
        });
        this.headerCheck = 'checked';
      }
    }
    let countAllDisplayFlag = 0;
    for (let m in this.listItems) {
      if (!this.listItems[m].displayFlag) {
        countAllDisplayFlag++;
      }
    }
    if (countAllDisplayFlag == this.listItems.length) {
      this.showEmptyEscList = true;
    } else {
      this.showEmptyEscList = false;
    }
  }

  // Item Selection
  itemSelectionTagsUsers(type, index, id, flag) {
    this.clearFlag = false;
    console.log(this.action + '::' + type + '::' + id + '::' + index + '::' + flag)
    if (!flag) {
      this.listItems[index].displayFlag = !flag;
      this.listItems[index].checkFlag = flag;
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
      setTimeout(() => {
        this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
        //this.clearFlag = (this.selectedList.length == 0) ? true : false;
      }, 100);
    } else {
      if (this.selectedList.length < this.availLength) {
        this.listItems[index].displayFlag = !flag;
        this.listItems[index].checkFlag = flag;
        let id = this.listItems[index].userId;
        let name = this.listItems[index].name;
        let email = this.listItems[index].emailAddress;
        let img = this.listItems[index].profileImage;
        let role = this.listItems[index].assigneeRole;
        this.selectedList.push({
          id: id,
          name: name,
          img: img,
          email: email,
          role: role
        });
        this.headerCheck = 'checked';
      }
    }
    setTimeout(() => {
      if (this.tagusersFlag) {
        if (this.selectedList.length > 0) {
          //this.innerHeight = this.height-107; 
          this.innerHeight = this.tvsProdOwner ? this.height - 259 : this.height - 159;
        }
        else {
          //this.innerHeight = this.height-187;  
          this.innerHeight = this.tvsProdOwner ? this.height - 187 : this.height - 87;
        }
        console.log(this.innerHeight);
      }
    }, 100);
  }
  // Item Selection
  itemRecentSelectionEscUsers(type, index, id, flag) {
    this.clearFlag = false;
    console.log(this.action + '::' + type + '::' + id + '::' + index + '::' + flag);
    //console.log(this.exRecentList);
    if (!flag) {
      this.exRecentList[index].displayFlag = !flag;
      this.exRecentList[index].checkFlag = flag;
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
      setTimeout(() => {
        this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
        //this.clearFlag = (this.selectedList.length == 0) ? true : false;
      }, 100);
    } else {
      if (this.selectedList.length < this.availLength) {
        this.exRecentList[index].displayFlag = !flag;
        this.exRecentList[index].checkFlag = flag;
        let id = this.exRecentList[index].userId;
        let name = this.exRecentList[index].emailAddress;
        let img = this.exRecentList[index].profileImage;
        let role = this.exRecentList[index].assigneeRole;
        this.selectedList.push({
          id: id,
          name: name,
          img: img,
          role: role
        });
        this.headerCheck = 'checked';
      }
    }

    let countAllDisplayFlag = 0;
    for (let m in this.exRecentList) {
      if (!this.exRecentList[m].displayFlag) {
        countAllDisplayFlag++;
      }
    }
    if (countAllDisplayFlag == this.exRecentList.length) {
      this.showEmptyRecent = true;
    } else {
      this.showEmptyRecent = false;
    }
  }

  removeDekraUser(id) {
    let index = this.listItems.findIndex(option => option.userId == id);
    if (index !== -1) {
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
      this.listItems[index].checkFlag = false;
    }
  }

  // Remove selected Users
  removeSelection(id) {
    console.log(this.selectedList, this.listItems, id)
    let index = this.listItems.findIndex(option => option.userId == id);
    console.log(index)
    if (index < 0) {
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      console.log(this.access, this.selectionType)
      this.selectedList.splice(rmIndex, 1);
      if (this.selectionType == 'multiple') {
        this.listItems[index].checkFlag = false;
        this.listItems[index].displayFlag = true;
      }
      setTimeout(() => {
        this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
      }, 100);
    } else {
      if (this.access == 'dispatchTech' && this.selectionType == 'multiple') {
        let rmIndex = this.selectedList.findIndex(option => option.id == id);
        this.selectedList.splice(rmIndex, 1);
        this.listItems[index].checkFlag = false;
        this.listItems[index].displayFlag = true;
      } else {
        let rid = this.listItems[index].userId;
        let flag = this.listItems[index].checkFlag;
        this.itemSelection('single', index, rid, !flag);
      }
    }
    setTimeout(() => {
      if (this.access == 'techsupportrules') {
        this.techsupportrulesBtn = true;
        this.height = this.oldHeight;
        this.innerHeight = this.selectedUsers.length ? this.height - 195 : this.height - 95;
      }
    }, 100);
  }

  removeEscSelection(id) {
    this.showEmptyEscList = false;
    let index = this.listItems.findIndex(option => option.userId == id);
    if (index < 0) {
      let index1 = this.exRecentList.findIndex(option => option.userId == id);
      if (index1 < 0) {
        let rmIndex = this.selectedList.findIndex(option => option.id == id);
        this.selectedList.splice(rmIndex, 1);
        setTimeout(() => {
          this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
        }, 100);
      }
      else {
        let rid = this.exRecentList[index1].userId;
        let flag = this.exRecentList[index1].checkFlag;
        this.itemRecentSelectionEscUsers('single', index1, rid, !flag);
      }
    } else {
      let rid = this.listItems[index].userId;
      let flag = this.listItems[index].checkFlag;
      this.itemSelectionEscUsers('single', index, rid, !flag);
    }
  }

  removeTagSelection(id) {
    let index = this.listItems.findIndex(option => option.userId == id);
    if (index < 0) {
      let rmIndex = this.selectedList.findIndex(option => option.id == id);
      this.selectedList.splice(rmIndex, 1);
      setTimeout(() => {
        this.headerCheck = (this.selectedList.length == 0) ? 'unchecked' : 'checked';
      }, 100);
      setTimeout(() => {
        if (this.tagusersFlag) {
          if (this.selectedList.length > 0) {
            //this.innerHeight = this.height-107; 
            this.innerHeight = this.tvsProdOwner ? this.height - 259 : this.height - 159;
          }
          else {
            //this.innerHeight = this.height-187;  
            this.innerHeight = this.tvsProdOwner ? this.height - 187 : this.height - 87;
          }
          console.log(this.innerHeight);
        }
      }, 100);
    } else {
      let rid = this.listItems[index].userId;
      let flag = this.listItems[index].checkFlag;
      this.itemSelectionTagsUsers('single', index, rid, !flag);
    }
  }

  // On Submit
  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.searchKey;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if (!this.ppfrFlag && !this.langFlag && !this.uTypeFlag && !this.uTypeDealerFlag || (this.langFlag && this.title != "Select Language")) {
      this.searchUser();
    }
    else {
      if (searchValue.length == 0) {
        this.submitted = false;
        this.empty = false;
      }
      let filteredList = this.manageList.filter(option => option.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
      if (filteredList.length > 0) {
        this.empty = false;
        for (let t in this.listItems) {
          this.listItems[t].displayFlag = false;
          for (let f in filteredList) {
            if (this.listItems[t] == filteredList[f]) {
              this.listItems[t].displayFlag = true;
            }
          }
        }
      } else {
        this.empty = true;
        this.successMsg = "No Result Found";
        for (let t in this.listItems) {
          this.listItems[t].displayFlag = true;
        }

      }
    }
  }

  // Search User
  searchUser() {
    if (this.langFlag) {
      if (this.title == "Select Language") {
        this.limit = 20;
      }
      else {
        this.limit = 20;
      }
    }
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    this.searchLoading = true;
    this.empty = false;
    if (this.searchVal.length > 0) {
      this.submitSearch();
    } else {
      if (this.searchUserFlag) {
        this.searchUserFlag.unsubscribe();
      }
      this.submitSearch();
    }
  }

  // Submit Search
  submitSearch() {
    if (this.searchUserFlag) {
      this.searchUserFlag.unsubscribe();
      if (this.managerFlag) {
        this.getManagers();
      }
      else if (this.ppfrFlag) {
        this.getDealerCityArea();
      }
      else if (this.langFlag) {
        if (this.title == "Select Language") {
          this.getLangList();
        }
        else {
          this.userTypeEmployeeList();
        }
      }
      else if (this.escalationFlag && !this.escalationModelFlag) {
        this.exRecentListFlag = false;
        this.getEsclationProductUsers();
      }
      else if (this.escalationFlag && this.escalationModelFlag) {
        this.getEscalationModels();
      }
      else if (this.tagusersFlag) {
        this.getTaggedUsers();
      }
      else {
        if (this.access == 'techsupportrules') {
          this.getUsersTechSupportRules();
        }
        else {
          this.getUsers();
        }

      }
    } else {
      if (this.managerFlag) {
        this.getManagers();
      }
      else if (this.ppfrFlag) {
        this.getDealerCityArea();
      }
      else if (this.langFlag) {
        if (this.title == "Select Language") {
          this.getLangList();
        }
        else {
          this.userTypeEmployeeList();
        }
      }
      else if (this.escalationFlag && !this.escalationModelFlag) {
        this.exRecentListFlag = false;
        this.getEsclationProductUsers();
      }
      else if (this.escalationFlag && this.escalationModelFlag) {
        this.getEscalationModels();
      }
      else {
        if (this.access = "dekraUsers") {
          this.getDekraUsers(false, true);
        } else {
          this.getUsers();
        }
      }
    }
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.submitted = this.searchTick;
    this.empty = this.searchTick;
    if (!this.ppfrFlag && !this.langFlag && !this.uTypeFlag && !this.uTypeDealerFlag || (this.langFlag && this.title != "Select Language")) {
      this.searchUser();
    }
    else {
      for (let m in this.listItems) {
        this.listItems[m].displayFlag = true;
      }
    }
  }

  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    for (let m of this.listItems) {
      m.displayFlag = true;
      m.checkFlag = false;
    }

    this.exRecentList.map(list => {
      list.displayFlag = true;
      list.checkFlag = false
    })
  }

  // Apply Dispatch Tech Users
  applyTech() {
    this.filteredUsers.emit(this.selectedList);
  }

  // Apply Tag Selection
  applySelection() {
    if (this.access == 'dispatchTech') {
      console.log(this.selectedList)
      this.applyTech();
    } else {
      if (this.escalationFlag) {
        let data = this.selectedList;
        this.filteredUsers.emit(data);
      }
      else if (this.tagusersFlag) {
        console.log(this.selectedList);
        let data = this.selectedList;
        this.filteredUsers.emit(data);
      }
      else {
        if (this.access == 'techsupportrules') {
          let data = this.selectedList;
          this.filteredUsers.emit(data);
        }
        else if (this.access == 'escalation-level-config') {
          let data = this.selectedList;
          this.filteredUsers.emit(data);
        } else if (this.access == 'dekraUsers') {
          let data = this.selectedList;
          setTimeout(() => {
            this.filteredUsers.emit(data);
          }, 350);
        }
        else {
          this.loading = true;
          let newUsers = [];
          for (let u of this.selectedList) {
            newUsers.push(u.id)
          }
          this.selectedList = [];
          const apiFormData = new FormData();
          apiFormData.append('apiKey', this.apiData['apiKey']);
          apiFormData.append('domainId', this.apiData['domainId']);
          apiFormData.append('countryId', this.apiData['countryId']);
          apiFormData.append('userId', this.apiData['userId']);
          apiFormData.append('equipmentNo', this.apiData['equipmentNo']);
          apiFormData.append('type', this.apiData['type']);
          apiFormData.append('newMembers', JSON.stringify(newUsers));
          apiFormData.append('actionPlanId', this.actionPlanId);

          this.escalationApi.saveEscalation(apiFormData).subscribe((response) => {
            console.log(response)
            this.loading = false;
            let data = response;
            data['newUsers'] = JSON.stringify(newUsers);
            data['init'] = false;
            data['empty'] = false;
            this.filteredUsers.emit(data);
          });
        }
      }
    }
  }

  // Clear Selection
  clearSelection() {
    this.clearFlag = true;
    this.headerCheck = 'unchecked';
    this.selectedList = [];
    this.itemChangeSelection(this.headerCheck);
    this.showEmptyRecent = false;
    this.showEmptyEscList = false;
    setTimeout(() => {
      if (this.tagusersFlag) {
        //this.innerHeight = this.height-187;  
        this.innerHeight = this.tvsProdOwner ? this.height - 187 : this.height - 87;
      }
    }, 100);
  }

  // Close
  close() {
    this.searchVal = '';
    this.bodyElem.classList.remove(this.bodyClass);
    this.selectedList = [];
    if (this.access == 'dispatchTech') {
      if (this.selectionType == 'multiple') {
        this.activeModal.dismiss('Cross click');
      } else {
        this.applyTech();
      }
    } else {
      let data = {
        empty: true,
        init: false
      };
      this.filteredUsers.emit(data);
    }
  }

  // Remove User
  removeUser(i, uid) {
    this.removedFlag = true;
    this.listItems[i]['displayFlag'] = false;
    let removeUser = [];
    removeUser.push(uid);
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('equipmentNo', this.apiData['equipmentNo']);
    apiFormData.append('type', this.apiData['type']);
    apiFormData.append('removeMembers', JSON.stringify(removeUser));
    this.escalationApi.saveEscalation(apiFormData).subscribe((response) => {
      let data = response;
      data['init'] = true;
      data['empty'] = false;
      data['uid'] = uid;
      this.filteredUsers.emit(data);
      console.log(response)
    });
  }

  // Profile Navigation
  navProfile(userId) {
    if (!this.escalationModelFlag) {
      let url = forumPageAccess.profilePage + userId;
      window.open(url, '_blank');
    }
  }

  addNewUser() {
    this.userListPageRef.openUserPOPUP('new', '');
  }

  userIndexListPageCallback(data) {
    this.userListPageRef = data;
    this.itemTotal = this.userListPageRef.itemTotal;
    console.log(this.userListPageRef);
  }



}
