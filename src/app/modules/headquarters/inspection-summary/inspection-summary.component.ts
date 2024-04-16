import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Constant } from 'src/app/common/constant/constant';
import { ManageUserComponent } from 'src/app/components/common/manage-user/manage-user.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { GtsService } from 'src/app/services/gts/gts.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-inspection-summary',
  templateUrl: './inspection-summary.component.html',
  styleUrls: ['./inspection-summary.component.scss']
})
export class InspectionSummaryComponent implements OnInit {
  public bodyElem;
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public isAudit = this.router.url.includes("audit");
  public pageAccess: string = this.router.url.includes("audit") ? "dekra-audit" : "home";
  public donutChart1: any
  public donutChart1Config: any
  public donutChart2: any
  public donutChart2Config: any
  sidebarRef: SidebarComponent;
  sidebarActiveClass
  headerData = {
    access: this.pageAccess,
    profile: true,
    welcomeProfile: true,
    search: true,
    searchVal: "",
  };
  selectedFilter = "1";
  headTitle: any;
  user: any;
  userId: any;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string;
  public wrapperClass: string;
  staticData: any = {
    customerName: "Volvo"
  };
  public apiKey: string = Constant.ApiKey;
  inspectionDetail: any;
  currentTemplateDetail: any;
  breadCrumb: any;
  domainId: any;
  countryId: string;
  userData: {};
  addUserVisible: boolean;
  descriptionPopup: boolean;
  editDescriptionValue: string;
  DescriptionValue: any;
  isBlank = false;
  userAdded = false;
  selectedDekraUsers: any = [];
  selectedCustomerUsers: any = [];
  shopList: any = [];
  backupshopList: any = [];

  loading: boolean = false;
  locationProgress: any = []
  totalCompliant: number = 0;
  totalNonCompliant: number = 0;

  constructor(
    private titleService: Title,
    private router: Router,
    private authenticationService: AuthenticationService,
    private headquarterService: HeadquarterService,
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal,
    private gtsService: GtsService
  ) { }


  ngOnInit(): void {
    this.getCurrentInspectionStatus()

    if (this.router.url.includes("audit")) {
      this.pageAccess = "dekra-audit"
    }
    if (this.router.url.includes("blank")) {
      this.isBlank = true;
    }
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid
    this.domainId = this.user.domain_id;
    if (this.user && this.user.domain_id && this.user.domain_id == 5) {
      this.staticData = {
        customerName: "Caliber Collision - Auto Body Repair Shop in Ferndale"
      }
      this.grid1Data = [
        {
          listoflocations: {
            name: "Auto Body Repair Shop in Ferndale",
            address1: "22031 Woodward Ave, Ferndale, MI 48220",
          },
          progress: 1, laststatus: "4", elapsed: "12"
        },
        {
          listoflocations: {
            name: "Latuff Brothers Auto Body",
            address1: "25825 Gratiot Ave, Roseville, MI 48066",
          },
          progress: 2, laststatus: "4", elapsed: "12"
        },
        {
          listoflocations: {
            name: "Auto Body Repair Shop in Dearborn Heights",
            address1: "25114 Fo, rd RdDearborn Heights, MI 48127"
          },
          progress: 3, laststatus: "5", elapsed: "73"
        }, {
          listoflocations: {
            name: "Auto Body Repair Shop in Ypsilanti",
            address1: "5133 Carpenter Rd Ste A, Ypsilanti, MI 48197"
          },
          progress: 4, laststatus: "4", elapsed: "33"
        }
      ]

    }

    if (this.isBlank) {
      this.grid1Data = [
        { listoflocations: { name: "Latuff Brothers Auto Body", address1: '880 University Ave West, St. Paul, MN 55104', address2: " Schmelz Countryside Volkswagen", address3: "(402402)-CER 4L" }, progress: 0, laststatus: "-", elapsed: "-" },
        { listoflocations: { name: "Depalo & Sons Auto Body", address1: '25 New York Ave #4, Huntington, NY 11743', address2: "Volkswagen of Smithtown", address3: "(408359)-NER 1G" }, progress: 0, laststatus: "-", elapsed: "-" },
        { listoflocations: { name: "Ozzie's Body Shop", address1: '5280 N Garfield Ave, Loveland, CO 80538', address2: "Ed Carroll Motor Company, Inc", address3: "(420112)-CER 4G" }, progress: 0, laststatus: "-", elapsed: "-" },
        { listoflocations: { name: "Schaefer Auto Body Center - Maplewood", address1: '7920 Jaguar Trail, St. Louis, MO 63143', address2: " The Dean Team of Ballwin", address3: "(424140)-CER 4P" }, progress: 0, laststatus: "-", elapsed: "-" },
        { listoflocations: { name: "Woburn Foreign Auto Body", address1: '80-82 Olympia Ave, Woburn, MA 01801', address2: "Minuteman Volkswagen, Inc", address3: "(401057)-NER 1M" }, progress: 0, laststatus: "-", elapsed: "-" },
      ]
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
    }, 2000);



    this.breadCrumb = JSON.parse(localStorage.getItem('breadCrumb'));
    console.log(this.breadCrumb)
    let id = this.activeRoute.snapshot.params['id'];
    if (this.breadCrumb) {
      localStorage.removeItem('breadCrumb');
    }
    this.getData(id);

  }
  // getMembers(){
  //   if(this.inspectionDetail.customerContacts && this.inspectionDetail.customerContacts.length > 0){
  //     let ids = this.inspectionDetail.customerContacts.map(e=>{
  //       return e.userId;
  //     })

  //     let apiFormData = new FormData()
  //     apiFormData.append("apiKey", Constant.ApiKey,);
  //     apiFormData.append("domainId", this.domainId);
  //     apiFormData.append("networkId", this.user.networkId.toString());
  //     apiFormData.append("userId", this.userId);
  //     apiFormData.append("id", this.inspectionDetail.id);
  //     apiFormData.append("type","1");
  //     apiFormData.append("userId","[" + ids + "]");
  //   }
  // }

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
    let slist = JSON.parse(JSON.stringify(this.selectedCustomerUsers.map(e => {
      if (e.userId) {
        e["id"] = e.userId;
      }
      return e;
    })))
    modalRef.componentInstance.selectedList = slist;
    modalRef.componentInstance.accessTitle = "Customer Contacts";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = '';
    modalRef.componentInstance.escalationFlag = false;
    modalRef.componentInstance.selectedUsers = techSupportUserId;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (!receivedService.empty) {
        // this.selectedCustomerUsers = receivedService;
        let ids = receivedService.map(e => {
          return e.id;
        })

        let ids1 = this.selectedDekraUsers.map(e => {
          return e.userId;
        })

        let apiFormData = new FormData()
        apiFormData.append("apiKey", Constant.ApiKey,);
        apiFormData.append("domainId", this.domainId);
        apiFormData.append("networkId", this.user.networkId.toString());
        apiFormData.append("userId", this.userId);
        apiFormData.append("id", this.inspectionDetail.id);
        apiFormData.append("type", "1");
        apiFormData.append("customerContacts", "[" + ids + "]");
        apiFormData.append("dekraContacts", "[" + ids1 + "]");

        this.headquarterService.updateInspectionDescription(apiFormData).subscribe(res => {
          let id = this.activeRoute.snapshot.params['id'];
          this.getData(id);
        });
        // this.assign(threadId,receivedService.mId,receivedService.mName);
      }
    });
  }

  assignDekraMember(threadId) {
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
    let slist = JSON.parse(JSON.stringify(this.selectedDekraUsers.map(e => {
      if (e.userId) {
        e["id"] = e.userId;
      }
      return e;
    })))
    modalRef.componentInstance.selectedList = slist;
    modalRef.componentInstance.accessTitle = "Dekra Contacts";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = '';
    modalRef.componentInstance.selectedUsers = techSupportUserId;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (!receivedService.empty) {
        // this.selectedDekraUsers = receivedService;
        let ids = receivedService.map(e => {
          return e.id;
        })
        let ids1 = this.selectedCustomerUsers.map(e => {
          return e.userId;
        })
        let apiFormData = new FormData()
        apiFormData.append("apiKey", Constant.ApiKey,);
        apiFormData.append("domainId", this.domainId);
        apiFormData.append("networkId", this.user.networkId.toString());
        apiFormData.append("userId", this.userId);
        apiFormData.append("id", this.inspectionDetail.id);
        apiFormData.append("type", "1");
        apiFormData.append("dekraContacts", "[" + ids + "]");
        apiFormData.append("customerContacts", "[" + ids1 + "]");

        this.headquarterService.updateInspectionDescription(apiFormData).subscribe(res => {
          let id = this.activeRoute.snapshot.params['id'];
          this.getData(id);
        });
      }
    });
  }

  getShopList() {
    if (this.inspectionDetail.locations && this.inspectionDetail.locations.length > 0) {
      this.loading = true;
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("shopIds", "[" + this.inspectionDetail.locations + "]");
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("networkId", this.user.networkId.toString());
      this.headquarterService.getShopList(apiFormData).subscribe((res: any) => {
        this.loading = false;
        if (res && res.items && res.items.length > 0) {
          this.shopList = res.items
          this.shopList = this.shopList.map((e) => {
            e['progress'] = Math.floor(Math.random() * 5) + 1;
            e['laststatus'] = "-"
            e['elapsed'] = "-"
            return e;
          })
          this.backupshopList = this.shopList
        }
      })
    }
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
    // this.LandingpagewidgetsAPI.updateThreadTechSupportAPI(apiFormData).subscribe((response) => {
    //   if (response.status == "Success") {
    //   }
    // });
  }

  changeFilter(id) {
    this.selectedFilter = id;
    this.shopList = this.backupshopList
    const updatedList = this.shopList.map((i: any) => ({
      ...i,
      locationDetail: this.getDetailFromLocationId(i?.id) ?? {}
    }))


    if (id == 5) {
      this.shopList = updatedList.filter((i: any) => i?.locationDetail?.created_at && !i?.locationDetail?.complete_at)
    } else if (id == 3) {
      this.shopList = updatedList.filter((i: any) => i?.locationDetail?.complete_at && i?.locationDetail?.total_no > 0)
    } else if (id == 6) {
      this.shopList = updatedList.filter((i: any) => i?.locationDetail?.complete_at && i?.locationDetail?.total_no == 0)
    }
    else {
      this.shopList = this.backupshopList
    }

    console.log(" ==== res =====> ", updatedList, id)
    this.grid1Data.sort(() => Math.random() - 0.5);
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
        this.router.navigate(["/headquarters/network"]);
        return false;
        break;
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
    { field: 'listoflocations', header: 'List of locations', columnpclass: 'w1 header thl-col-1 ', width: '50px' },
    { field: 'progress', header: 'Progress', columnpclass: 'w1 header thl-col-2', width: '220px' },
    { field: 'laststatus', header: 'Number of days since last status change', columnpclass: 'w1 header thl-col-3', width: '40px' },
    { field: 'elapsed', header: 'Time elapsed in days', columnpclass: 'w1 header thl-col-4', width: '40px' },
    // {filed : 'locinfo', columnpclass: 'w1 header thl-col-1'}
  ]

  grid1Data: any = [
    { listoflocations: { name: "Latuff Brothers Auto Body", address1: '880 University Ave West, St. Paul, MN 55104', address2: " Schmelz Countryside Volkswagen", address3: "(402402)-CER 4L" }, progress: 1, laststatus: "4", elapsed: "12" },
    { listoflocations: { name: "Depalo & Sons Auto Body", address1: '25 New York Ave #4, Huntington, NY 11743', address2: "Volkswagen of Smithtown", address3: "(408359)-NER 1G" }, progress: 2, laststatus: "5", elapsed: "73" },
    { listoflocations: { name: "Ozzie's Body Shop", address1: '5280 N Garfield Ave, Loveland, CO 80538', address2: "Ed Carroll Motor Company, Inc", address3: "(420112)-CER 4G" }, progress: 3, laststatus: "4", elapsed: "33" },
    { listoflocations: { name: "Schaefer Auto Body Center - Maplewood", address1: '7920 Jaguar Trail, St. Louis, MO 63143', address2: " The Dean Team of Ballwin", address3: "(424140)-CER 4P" }, progress: 4, laststatus: "9", elapsed: "35" },
    { listoflocations: { name: "Woburn Foreign Auto Body", address1: '80-82 Olympia Ave, Woburn, MA 01801', address2: "Minuteman Volkswagen, Inc", address3: "(401057)-NER 1M" }, progress: 5, laststatus: "7", elapsed: "03" },
  ]

  initDonutChart1() {
    this.donutChart1 = new google.visualization.PieChart(document.getElementById('donutChart1'));
    this.donutChart1.draw(this.donutChart1Config.data, this.donutChart1Config.options);
  }

  initDonutChart2() {
    this.donutChart2 = new google.visualization.PieChart(document.getElementById('donutChart2'));
    this.donutChart2.draw(this.donutChart2Config.data, this.donutChart2Config.options);
  }

  getData(id: string) {
    // this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("id", id);
    apiFormData.append("withSummary", '1');
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("networkId", this.user.networkId.toString());

    this.loading = true;
    this.headquarterService.getInspectionList(apiFormData).subscribe((response: any) => {
      console.log(response)
      // this.loading = false;
      if (response.status == 'Success' && response.items && response.items.length > 0) {
        this.inspectionDetail = response.items[0];
        this.currentTemplateDetail = this.inspectionDetail.templates?.[0]
        console.log(" ==== this.currentTemplateDetail ==== ", this.currentTemplateDetail)
        this.DescriptionValue = response.items[0].assessment;
        this.selectedCustomerUsers = this.inspectionDetail.customerContacts
        this.selectedDekraUsers = this.inspectionDetail.dekraContacts
      }
      this.getShopList()
    }, (error: any) => {
      this.loading = false;
    });
  }

  back(link: any) {
    let id = this.activeRoute.snapshot.params['id'];
    switch (link) {
      case 'list':
        this.router.navigate(["headquarters/audit"]);
        break;
      case 'detail':
        this.router.navigate([`inspection/${id}`]);
        break;
    }

  }

  addUser(formType) {
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
      formType: formType,
    }
    this.addUserVisible = true;
  }

  onDrawerDismiss(event: any) {
    this.addUserVisible = false;
  }

  editDescription() {
    this.descriptionPopup = true;
    this.editDescriptionValue = this.DescriptionValue;
  }

  saveDescription() {
    let id = this.activeRoute.snapshot.params['id'];

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("id", id);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("assessment", this.editDescriptionValue);

    this.headquarterService.updateInspectionDescription(apiFormData).subscribe((res: any) => {
      if (res.status == "Success") {
        this.DescriptionValue = this.editDescriptionValue;
        this.descriptionPopup = false;
      }
    })
  }

  closeDescriptionPopUp() {
    this.editDescriptionValue = ''
    this.descriptionPopup = false;
  }

  getDetailFromLocationId(id: any) {
    return this.locationProgress.find((i: any) => i?.locationId == id)
  }


  getCurrentInspectionStatus() {
    const inspectionId = this.activeRoute.snapshot.params['id']
    const statusFormData = new FormData()
    statusFormData.append('apiKey', this.apiKey);
    statusFormData.append('inspectionId', inspectionId);

    this.gtsService.apiGetruntimeExitstatus(statusFormData).subscribe((response) => {
      console.log(" ==== success 176 ==> ", response)

      if ((response?.data ?? []).length > 0) {
        this.locationProgress = response.data
      }

    }, (error: any) => {
      console.log(" ==== error 178 ==> ", error)
    })

    this.gtsService.getPiechartdetail(statusFormData).subscribe((response: any) => {
      if (response.status === 'Success') {
        console.log(" ===== Success 123 ====> ", response.data.filter((i: any) => i?.total > 0), response.data.filter((i: any) => i?.total == 0))
        this.totalCompliant = response.data.filter((i: any) => i?.total > 0).length
        this.totalNonCompliant = response.data.filter((i: any) => i?.total == 0).length

        this.chartSetup()
      }
      console.log(" ==== response ===> ", this.totalCompliant, this.totalNonCompliant)
    }, (error: any) => {
      console.log(" ==== error ===> ", error)
    });
  }


  chartSetup() {
    // chart related code
    google.load("visualization", "1", { packages: ["corechart"] });
    setTimeout(() => {
      let donutChart1Datatable = new google.visualization.DataTable();
      donutChart1Datatable.addColumn('string', 'Task');
      donutChart1Datatable.addColumn('number', 'Status');
      donutChart1Datatable.addColumn({ type: 'string', role: 'tooltip' });
      const totalInprogress = this.locationProgress.filter((i: any) => i?.created_at && !i?.complete_at).length
      const totalCompleted = this.locationProgress.filter((i: any) => i?.complete_at).length
      console.log(" === totalInprogress ====> ", totalInprogress, " === totalCompleted ==> ", totalCompleted, this.locationProgress)
      donutChart1Datatable.addRows([
        [`${totalCompleted} - Completed`, totalCompleted, `Completed - ${totalCompleted}`],
        [`${totalInprogress} - In-process`, totalInprogress, `In-process - ${totalInprogress}`],
        ['25 - Scheduled', 25, 'Scheduled - 25'],
        ['25 - Not-scheduled', 25, 'Not-scheduled - 25'],
      ])

      this.donutChart1Config = {
        data: donutChart1Datatable,
        options: {
          pieHole: 0.6, pieSliceText: 'value', colors: ['#3eb7a1', '#f7b94a', '#299cdb', '#444444'], 'chartArea': { 'height': '95%', 'width': '100%' },
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: { position: 'right', textStyle: { color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium' }, alignment: 'center' },
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' }, alignment: 'center' }
        }
      }

      let donutChart2Datatable = new google.visualization.DataTable();
      donutChart2Datatable.addColumn('string', 'Task');
      donutChart2Datatable.addColumn('number', 'Status');
      donutChart2Datatable.addColumn({ type: 'string', role: 'tooltip' });

      donutChart2Datatable.addRows(
        [
          [`${this.totalCompliant} - Compliant`, this.totalCompliant, `Compliant - ${this.totalCompliant}`],
          [`${this.totalNonCompliant} - Non-Compliant`, this.totalNonCompliant, `Non-Compliant - ${this.totalNonCompliant}`],
        ]
      )
      this.donutChart2Config = {
        data: donutChart2Datatable,
        options: {
          title: '', pieHole: 0.6, pieSliceText: 'value', colors: ['#3eb7a1', '#f36868', '#f0f2f4'], 'chartArea': { 'height': '95%', 'width': '100%' },
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: { position: 'right', textStyle: { color: '#777777', fontSize: 13, fontName: 'Roboto-Medium' }, alignment: 'center' },
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } }
        }
      }

      this.initDonutChart1()
      this.initDonutChart2()
    }, 2000);
  }

  getInsepectionPercentage() {
    const locationCount = this.inspectionDetail?.locations ?
      this.inspectionDetail?.locations.length : 0
    const allPercentages = (parseInt(locationCount) / parseInt(this.inspectionDetail?.shopsCount)) * 100;
    return allPercentages
  }

}
