import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Constant } from 'src/app/common/constant/constant';
import { ManageUserComponent } from 'src/app/components/common/manage-user/manage-user.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { GtsService } from 'src/app/services/gts/gts.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { LOCALSTORAGE } from 'src/app/utils/constants';
import { convertDate, countDaysBetweenDates } from 'src/app/utils/helper';
import * as moment from 'moment';

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.scss']
})
export class InspectionDetailComponent implements OnInit {
  public bodyElem;
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public pageAccess: string = this.router.url.includes("audit") ? "dekra-audit" : "home";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string;
  public wrapperClass: string;
  public apiKey: string = Constant.ApiKey;
  public isAssigned = false;
  public isAudit = this.router.url.includes("audit");
  public isBlank = false;
  public teamId: string = localStorage.getItem('defaultTechSupportTeamId');
  public loading = false;
  public apiData: any;
  public currentTemplateDetail: any = {}
  public staticData = {
    shopDetails: {
      name: "Fix Auto San Leandro (ID# 10050)",
      address1: "1970 Republic Ave, San Leandro, CA 94577",
      email: "support@fixauto.com",
      contact: "+1 (866) 925-7996"
    },
    contactDetails: {
      contact1: "roque.moya@fixauto.com",
      contact2: "craig.teague@volvocars.com"
    }
  }
  user: any
  sidebarActiveClass;
  sidebarRef: SidebarComponent;
  isUserAdded = false;

  headerData = {
    access: this.pageAccess,
    profile: true,
    welcomeProfile: true,
    search: true,
    searchVal: "",
  };
  headTitle: any;
  countryId: string;
  threadLevelType: string;
  platformId: any;
  dekraNetworkId: string;
  domainId: any;
  networkName: string;
  userId: any;
  addUserVisible: boolean = false;
  userData = {}
  selectedShopId: string;
  selectedShop: any;
  selectedCustomerUsers: any;
  selectedContactUsers: any;
  currentUser: any;
  public currentExitStatus: any = null
  public currentGts: any = null;
  public currentProgress: any = 0
  public inspectionStatus: any = {}
  public inspectionApiResponse: any = {}
  onSiteInformation: any = []
  currentTemplate: any = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private LandingpagewidgetsAPI: LandingpageService,
    private headquarterService: HeadquarterService,
    private gtsService: GtsService
  ) {
  }

  ngOnInit(): void {

    this.countryId = localStorage.getItem('countryId');
    this.threadLevelType = localStorage.getItem('defaultEscalation');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';

    if (this.router.url.includes("blank")) {
      this.isBlank = true;
    }
    if (this.route.snapshot.params.shopId) {
      this.selectedShopId = this.route.snapshot.params.shopId;
    }
    this.user = this.authenticationService.userValue
    if (this.user && this.user.domain_id && this.user.domain_id == 5) {
      this.staticData = {
        shopDetails: {
          name: "Caliber Collision - Auto Body Repair Shop in Ferndale ",
          address1: "22031 Woodward Ave, Ferndale, MI 48220",
          email: "support@caliber.com",
          contact: "248-541-5193"
        },
        contactDetails: {
          contact1: "roque.moya@caliber.com",
          contact2: "craig.teague@caliber.com"
        }
      };
    }
    let url: any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyClass = "parts-list";
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 2000)
    this.getShopList();
    if (this.isBlank) {
      this.grid2Data = [];
    }

    this.getDekraUsers()
    let id = this.route.snapshot.params["id"];
    this.getData(id);
    this.getOnsiteInformation()
  }

  getData(id: string) {
    this.loading = true;
    this.getCurrentInspectionStatus()
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("id", id);

    const localstorageResponse: any = localStorage.getItem(
      LOCALSTORAGE.CURRENT_SECTION_LIST
    );
    const parsedResponse = JSON.parse(localstorageResponse)
    this.headquarterService.getInspectionList(apiFormData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.status == "Success") {
          this.apiData = response.items[0];
          this.currentTemplateDetail = this.apiData.templates?.[0]
          console.log(" ==== == user detail assessor ===> ", this.apiData)
          if (this.apiData?.assessor_id) {
            this.selectedCustomerUsers = JSON.parse(this.apiData?.assessor_detail)
          }
          localStorage.setItem(
            LOCALSTORAGE.CURRENT_SECTION_LIST,
            JSON.stringify({
              ...parsedResponse,
              [id]: this.apiData?.sections ?? []
            })
          );
        }
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  /**
   * Get the current status of inspection section
   */
  getCurrentInspectionStatus() {
    const inspectionId = this.route.snapshot.params['id']
    const locationId = this.route.snapshot.params['shopId']
    const statusFormData = new FormData()
    statusFormData.append('apiKey', this.apiKey);
    statusFormData.append('inspectionId', inspectionId);
    statusFormData.append('locationId', locationId);

    this.gtsService.apiGetruntimeExitstatus(statusFormData).subscribe((response) => {
      console.log(" ==== success 176 ==> ", response.data?.[0])
      if ((response?.data ?? []).length > 0) {
        const responseData = response.data?.[0]
        this.inspectionApiResponse = responseData
        localStorage.setItem(LOCALSTORAGE.CURRENT_RUNTIME_STATUS, JSON.stringify(responseData))
        this.currentExitStatus = responseData?.exitStatus;
        this.currentGts = responseData?.gtsId
        this.currentProgress = responseData?.progress;
        this.inspectionStatus = responseData
      }

    }, (error: any) => {
      console.log(" ==== error 178 ==> ", error)
    })
  }

  onEdit() {
    const inspectionStatusForm = new FormData();
    inspectionStatusForm.append('gtsId', this.inspectionApiResponse?.gtsId)
    inspectionStatusForm.append('exitStatus', this.inspectionApiResponse?.exitStatus)
    inspectionStatusForm.append('progress', this.inspectionApiResponse?.progress)
    inspectionStatusForm.append('locationId', this.inspectionApiResponse?.locationId)
    inspectionStatusForm.append('inspectionId', this.inspectionApiResponse?.inspectionId)
    inspectionStatusForm.append('section_json', this.inspectionApiResponse?.section_json)
    this.gtsService.gtsUpdateInspectionStatus(inspectionStatusForm).subscribe(
      (res: any) => {
        console.log(" ==== insepection status ===> ", res);
      },
      (error) => {
        console.log(" ==== insepection status error ===> ", error);
      }
    )

    const navigateUrl = `/headquarters/start-inspection/${this.apiData?.title}/${this.apiData?.id}/${this.selectedShopId}/${this.currentGts}`
    this.router.navigate([navigateUrl])
  }

  // assignToMe(){
  //   this.isAssigned = true;
  // }

  getShopList() {
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("shopIds", "[" + this.selectedShopId + "]");
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("networkId", this.user.networkId.toString());
    this.headquarterService.getShopList(apiFormData).subscribe((res: any) => {
      this.loading = false;
      localStorage.setItem(LOCALSTORAGE.CURRENT_SECTION_LOCATION, JSON.stringify(res?.items[0]))
      if (res && res.items && res.items.length > 0) {
        this.selectedShop = res.items[0]
        this.selectedShop = this.selectedShop.map((e) => {
          e['progress'] = Math.floor(Math.random() * 5) + 1;
          e['laststatus'] = "-"
          e['elapsed'] = "-"
          return e;
        })


      }
    })
  }

  menuNav(item) {
    console.log(item)
    console.log(this.sidebarRef)
    let section = item.slug;
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case 'headquarters':
        this.router.navigate(["/headquarters/index"]);
        return false;
      case 'home':
        this.router.navigate(["/headquarters/home"]);
        return false;
        break;
      case 'tools':
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
        break;
      case 'dekra-audit':
        this.router.navigate(["/headquarters/audit"]);
        return false;
        break;
      case 'facility-layout':
        this.router.navigate(["/headquarters/facility-layout"]);
        return false;
        break;
      case 'all-users':
        this.router.navigate(["/headquarters/all-users"]);
        return false;
        break;
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;
      default:
        break;
    }
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? 30 : 0;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    console.log(headerHeight);

    // this.emptyHeight = headerHeight + 46;
    this.emptyHeight = headerHeight + 130;
  }

  grid1Columns = [
    { field: 'progress', header: 'Progress', columnpclass: 'w1 header thl-col-15 ' },
    { field: 'status', header: '', columnpclass: 'w1 header thl-col-1' },
    { field: 'totalTime', header: '', columnpclass: 'w1 header thl-col-1' },
  ]
  grid1Data = [
    { progress: '', totalTime: '40 days' }
  ]

  grid2Columns = [
    { field: 'section', header: 'Section', columnpclass: 'w1 header thl-col-4 ' },
    { field: 'questionhere', header: 'Question here', columnpclass: 'w1 header thl-col-6 ' },
    { field: 'Answerhere', header: 'Answer here', columnpclass: 'w1 header thl-col-6 ' },
    { field: 'Actionhere', header: 'Action here', columnpclass: 'w1 header thl-col-6 ' },
    { field: 'Assigned', header: 'Assigned', columnpclass: 'w1 header thl-col-6 ' },
    { field: 'Duedate', header: 'Due date', columnpclass: 'w1 header thl-col-3 ' }
  ]

  grid2Data = this.isBlank ? [] : [
    { section: '1.3', questionhere: 'Question 1', Answerhere: 'Answer 1', Actionhere: 'Action 1', Assigned: '-', Duedate: 'Oct 20, 2023' },
    { section: '2.3', questionhere: 'Question 2', Answerhere: 'Answer 2', Actionhere: 'Action 2', Assigned: '-', Duedate: 'Oct 22, 2023' },
    { section: '3.3', questionhere: 'Question 3', Answerhere: 'Answer 3', Actionhere: 'Action 3', Assigned: '-', Duedate: 'Oct 23, 2023' }
  ]

  actionStatus(data, type) {
    let thradIdData = [];
    thradIdData.push(data.threadId);
    switch (type) {
      case 'assignme':
        this.assign(thradIdData, this.userId);
        break;
      case 'assignmember':
        this.assignMember(thradIdData);
        break;
      // case 'close':
      //   this.closeThreadConfirm(data);
      // break;
      // case 'delete':
      //   this.threadDeleteConfirm(data);
      // break;
      default:
        break;
    }

  }

  assignToMe() {
    this.selectedCustomerUsers = this.currentUser;
    this.assignUserAction()
  }

  assignContactToMe() {
    this.selectedContactUsers = this.currentUser;
  }



  openAddUser(hid: any = '') {
    let id = 1;
    let actiontype = "new";
    let actionFormType = "hq";
    let item = '';
    let titletext = 'sdfgdsgf';
    let primaryLocaion = false;

    this.userData = {};
    this.userData = {
      parentId: id,
      actiontype: actiontype,
      actionFormType: actionFormType,
      item: item,
      titletext: titletext,
      primaryLocaion: primaryLocaion,
      formType: "",
    }
    this.addUserVisible = true;
  }

  onDrawerDismiss(event: any) {
    this.addUserVisible = false;
    this.isUserAdded = true;
  }

  closeAddUser() {
    this.addUserVisible = false;
  }

  assignMember(threadId) {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 157);
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
    };
    let techSupportUserId = [];
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "dekraUsers";
    if (this.selectedCustomerUsers) {
      modalRef.componentInstance.selectedList = [JSON.parse(JSON.stringify(this.selectedCustomerUsers))];
    }
    modalRef.componentInstance.accessTitle = "Dekra Users";
    modalRef.componentInstance.userType = "dekra"
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = '';
    modalRef.componentInstance.singleUser = true;
    modalRef.componentInstance.escalationFlag = false;
    modalRef.componentInstance.selectedUsers = techSupportUserId;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (receivedService && receivedService.length > 0) {
        this.selectedCustomerUsers = receivedService[0];
        // this.assign(threadId,receivedService.mId,receivedService.mName);
        this.assignUserAction()
      }
    });
  }

  assignContact() {

    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 157);
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
    };
    let techSupportUserId = [];
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "dekraUsers";
    if (this.selectedContactUsers) {
      modalRef.componentInstance.selectedList = [JSON.parse(JSON.stringify(this.selectedContactUsers))];
    }
    modalRef.componentInstance.accessTitle = "Contact at Location";
    modalRef.componentInstance.userType = "customer"
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = '';
    modalRef.componentInstance.singleUser = true;
    modalRef.componentInstance.escalationFlag = false;
    modalRef.componentInstance.selectedUsers = techSupportUserId;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (receivedService && receivedService.length > 0) {
        this.selectedContactUsers = receivedService[0];
        // this.assign(threadId,receivedService.mId,receivedService.mName);
      }
    });
  }


  assign(thradIdData, tsuid, tsuname = '') {
    const apiFormData = new FormData();
    let thradIdDataJSON = JSON.stringify(thradIdData);
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("techSupportUserId", tsuid);
    if (tsuname != '') {
      apiFormData.append("techSupportUserName", tsuname);
    }
    apiFormData.append("teamId", "1");
    apiFormData.append("threadId", thradIdDataJSON);
    this.LandingpagewidgetsAPI.updateThreadTechSupportAPI(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
      }
    });
  }

  getDekraUsers() {

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append("networkId", this.user.networkId.toString());
    apiFormData.append('userId', this.user.Userid);
    this.headquarterService.getUserList(apiFormData).subscribe((res: any) => {
      if (res && res.items && res.items.length > 0) {
        this.currentUser = res.items[0]
      }
    })
  }

  renderDate(date: any) {
    return convertDate(date)
  }

  countDays() {
    const startDate = new Date(this.inspectionStatus?.created_at);
    const endDate = new Date(this.inspectionStatus?.complete_at);
    const daysBetweenDates = this.inspectionStatus?.complete_at ? countDaysBetweenDates(startDate, endDate) : 0
    return daysBetweenDates ? daysBetweenDates == 0 ? 1 : daysBetweenDates : 0
  }

  assignUserAction() {
    const insepectionId = this.route.snapshot.params['id']

    const formData = new FormData();
    formData.append('inspectionId', insepectionId)
    formData.append('user_id', this.selectedCustomerUsers?.id)
    formData.append('user_detail', JSON.stringify(this.selectedCustomerUsers))
    this.gtsService.addAssessor(formData).subscribe((res: any) => {
      console.log(" ==== response ==> ", res)
    }, (err) => {
      console.log(" ==== Error ==> ", err)
    })
  }

  getOnsiteInformation() {
    const inspectionId = this.route.snapshot.params['id']
    const locationId = this.route.snapshot.params['shopId']
    const statusFormData = new FormData()
    statusFormData.append('inspection_id', inspectionId);
    statusFormData.append('location_id', locationId);
    this.gtsService.getOnsiteInformation(statusFormData).subscribe((res: any) => {
      console.log(" === resposne ====> ", res.data)
      this.onSiteInformation = (res?.data ?? [])
    }, (err: any) => {
      console.log(" === Error ====> ", err)
    })
  }


  getPerItemPercentage(answer: any, total: any) {
    let percentage = 0
    percentage =
      parseInt(answer) /
      parseInt(total) *
      100;

    if (percentage >= 100) {
      percentage = 100
    }

    return percentage
  }

  getDetailFromLocationId(id: any) {
    return this.inspectionStatus.find((i: any) => i?.locationId == id)
  }

}
