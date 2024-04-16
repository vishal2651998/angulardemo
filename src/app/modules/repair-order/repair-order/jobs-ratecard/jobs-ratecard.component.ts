import { Subscription } from "rxjs";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { Component, ViewChild, HostListener,Directive,Renderer2,ElementRef,AfterViewInit, OnInit,Input,OnDestroy, NgModuleRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Constant,windowHeight, PlatFormType,ContentTypeValues} from '../../../../common/constant/constant';
import { CommonService } from '../../../../services/common/common.service';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { ManageListComponent } from '../../../../components/common/manage-list/manage-list.component';
import { ManageUserComponent } from '../../../../components/common/manage-user/manage-user.component';
import { SuccessComponent } from '../../../../components/common/success/success.component';
import { ApiService } from 'src/app/services/api/api.service';
import { RepairOrderService } from 'src/app/services/repair-order/repair-order.service';
import { ThreadService } from "src/app/services/thread/thread.service";

interface statusList {
  id: string;
  name: string;
}

declare var $:any;

@Component({
  selector: 'app-jobs-ratecard',
  templateUrl: './jobs-ratecard.component.html',
  styleUrls: ['./jobs-ratecard.component.scss']
})
export class JobsRatecardComponent implements OnInit {
  subscription: Subscription = new Subscription();
  sidebarRef: SidebarComponent;

  public headerFlag: boolean = false;
  public headerData: Object;
  public pageAccess: string = "jobs-ratecard";
  public sidebarActiveClass: Object;
  public title: string = "Jobs and Rate Card";
  public bodyClass: string = "jobs-ratecard";
  public bodyClass2: string = "parts-list";
  public bodyClass1: string = "product-matrix-list";
  public headTitle: string = "";
  public memberSelectFlag: boolean = false;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public apiData: Object;
  public loading: boolean = true;
  public initLoading: boolean = true;
  public bodyHeight: number;
  public addednewProduct: boolean = false;
  public innerHeightFix: string='';
  public innerHeight: number = window.innerHeight - 200;
  public emptyHeight = window.innerHeight - 200;
  public bodyElem;
  public productAttributesValues = [];
  public addnewrowbgcolor:string;
  public dragdropbgcolor: string;
  public ItemEmpty: boolean = false;
  public itemLimit: number = 30;
  public itemOffset: number = 0;
  public itemTotal: number;
  public itemLength: number = 0;
  public displayNoRecords: string = '0';
  public publishbutton: boolean = false;
  public searchVal: string = '';
  public productsList = [];
  public workstreamListsOptions = [];
  public priorityLists = [];
  public statusLists: statusList[];
  primetablerowdata: {p1esc: Array<any>,p2esc: Array<any>,p3esc: Array<any>,p4esc: Array<any>,p5esc: Array<any>};
  frozenCols=[];
  cols=[];
  public teamName: string = '';
  public teamId: string = localStorage.getItem('defaultTechSupportTeamId');
  public rulesMatrix_array=[];
  public baseApiUrl: string = "";
  public collabticApi: string = Constant.CollabticApiUrl;
  public escalationMatrix_array=[];
  public recentSelectionParam = false;
  public recentSelectionParamValue = '';
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public loadDataEvent: boolean=false;
  public lazyloadDataEvent: boolean=false;
  public updateTitleDescModal: boolean = false;
  public jobtitle: string = '';
  public jobdescription: string = '';
  public manageTitle: string = 'Job Title and Description';
  public jobindex: string = '0';
  public loadjobs: boolean = true;
  stateDropDownOptions: any;
  public descMoreModal: boolean = false;
  public moreTitle: string = '';
  public moreDesc: string = '';
  public zeroVal: number = 0;
  public saveFlag: boolean = false;

   // Resize Widow
   @HostListener('window:resize', ['$event'])
   onResize(event) {
    this.bodyHeight = window.innerHeight;
     this.setScreenHeight();
   }

  constructor(
    private threadApi: ThreadService,
    private titleService: Title,
    private ProductMatrixApi: ProductMatrixService,
    private router: Router,
    private commonApi: CommonService,
    private renderer: Renderer2,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private elRef : ElementRef,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private apiUrl: ApiService,
    private repairOrderApi: RepairOrderService,
    ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.keyboard = true;
  }
  ngAfterViewInit(): void {
    const frozenBody: HTMLElement | null = document.querySelector('.ui-table-frozen-view .ui-table-scrollable-body');
    const scrollableArea: HTMLElement | null = document.querySelector('.ui-table-scrollable-view.ui-table-unfrozen-view .ui-table-scrollable-body');
    if (frozenBody && scrollableArea) {
      frozenBody.addEventListener('wheel', e => {
        const canScrollDown = scrollableArea.scrollTop < (scrollableArea.scrollHeight - scrollableArea.clientHeight);
        const canScrollUp = 0 < scrollableArea.scrollTop;

        if (!canScrollDown && !canScrollUp) {
          return;
        }

        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        const scrollDelta = 100;

        if (canScrollDown && scrollingDown) {
          e.preventDefault();
          scrollableArea.scrollTop += scrollDelta;
        } else if (canScrollUp && scrollingUp) {
          e.preventDefault();
          scrollableArea.scrollTop -= scrollDelta;
        }
      });
    }
  }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scroll, true);

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');

    let platformId = localStorage.getItem("platformId");
    if (platformId == null || platformId == 'null') {
      platformId = PlatFormType.Collabtic;
      //platformId=PlatFormType.MahleForum;
      //platformId=PlatFormType.CbaForum;
    }
    if (platformId == PlatFormType.Collabtic) {
      this.collabticApi = Constant.CollabticApiUrl;
    } else if (platformId == PlatFormType.MahleForum) {
      this.collabticApi = Constant.TechproMahleApi;
    } else if (platformId == PlatFormType.CbaForum) {
      this.collabticApi = Constant.CbaApiUri;
    } else if (platformId == PlatFormType.KiaForum) {
      this.collabticApi = Constant.KiaApiUri;
    } else {
      this.collabticApi = Constant.CollabticApiUrl;
    }

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'isActive': 1,
      'searchKey': this.searchVal,
      'limit': this.itemLimit,
      'offset': this.itemOffset
    }

    this.apiData = apiInfo;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
      searchVal: "",
    };

    this.getWorkstreamLists();
    this.loadCountryStateData();
    setTimeout(() => {
      this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    }, 900);

    setTimeout(() => {
      this.setScreenHeight();
    }, 2000);

    this.subscription.add(
      this.commonApi.NewButtonHeaderCallReceivedSubject.subscribe((r) => {
        if(r == 'jobs-ratecard'){
          this.newMatrix(true);
        }
      })
    );

  }

  getWorkstreamLists() {
    let type:any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', type);
    this.workstreamListsOptions = [];
    this.ProductMatrixApi.getWorkstreamLists(apiFormData).subscribe((response) => {
      let resultData = response.workstreamList;
      this.workstreamListsOptions = resultData;
      console.log(this.workstreamListsOptions);
      this.getJobsData();
    });



  }
  setHeaderColumns(){
    this.cols = [
      {
        columnName: "optionTypeName",
        columnpredefind: "1",
        field: 'optionTypeName',
        header: 'Option Name',
        columnpclass: "tech-sticky-col job-col-2" ,
        headerId: "2",
        inputType: "2",
      },
      {
        columnName: "optionValue",
        columnpredefind: "1",
        field: 'optionValue',
        header: 'Option Value',
        columnpclass: "job-col-3",
        headerId: "3",
        inputType: "3",
      },
      {
        columnName: "jobCode",
        columnpredefind: "1",
        field: 'jobCode',
        header: 'Job Code',
        columnpclass: "job-col-4",
        headerId: "4",
        inputType: "4",
      },
      {
        columnName: "jobtitle",
        columnpredefind: "1",
        field: 'jobtitle',
        header: 'Job Title',
        columnpclass: "job-col-5",
        headerId: "5",
        inputType: "5",
      },
      {
        columnName: "jobdescription",
        columnpredefind: "1",
        field: 'jobdescription',
        header: 'Job Description',
        columnpclass: "job-col-6",
        headerId: "6",
        inputType: "5",
      },      
      {
        columnName: "price",
        columnpredefind: "1",
        field: 'price',
        header: 'Price',
        columnpclass: "job-col-7",
        headerId: "7",
        inputType: "4",
      },
      {
        columnName: "hours",
        columnpredefind: "1",
        field: 'hours',
        header: 'Qty',
        columnpclass: "job-col-10",
        headerId: "10",
        inputType: "4",
      },
    ];
  }

  setRateCardHeaderColumns(){
    this.cols = [
      {
        columnName: "stateStr",
        columnpredefind: "1",
        field: 'stateStr',
        header: 'State',
        columnpclass: "tech-sticky-col job-col-8",
        headerId: "8",
        inputType: "5",
      },
      {
        columnName: "hourlyrate",
        columnpredefind: "1",
        field: 'hourlyrate',
        header: 'Hourly Rate',
        columnpclass: "job-col-9",
        headerId: "9",
        inputType: "6",
      },
    ];
  }
  inputChange(event, productsLis, hId, colName,index='')
{

  console.log(event.target.value);
    console.log(productsLis);
    console.log(hId);
    console.log(colName);
    console.log(index);
    let columnValue = '';
    let strJSON = '';
    this.primetablerowdata = productsLis;
    setTimeout(() => {
      hId = parseInt(hId);
      let elss=document.getElementById('product_options'+productsLis.id+''+hId);
      var selector = "td";
      var parent = this.findParentBySelector(elss, selector);
      this.renderer.addClass(parent, 'selectedItemp-table-light');
      this.publishbutton=true;
    }, 100);


    if(colName == 'jobCode'){
      this.productsList[index].jobCode =  event.target.value;
    }
    if(colName == 'hours'){
      this.productsList[index].hours =  event.target.value;
    }
    if(colName == 'price'){
      this.productsList[index].price =  event.target.value;
      this.productsList[index].priceShowOnly =  Math.abs(event.target.value);
    }    
    if(colName == 'hourlyrate'){
      this.productsList[index].hourlyrate =  event.target.value;
      this.productsList[index].hourrateShowOnly =  Math.abs(event.target.value);
      if(this.productsList[index].stateStr?.length>0){
        strJSON = JSON.stringify(this.productsList[index].stateStr);
      }
      else{
        strJSON = '';
      }
      console.log(this.productsList[index].stateStr);
    }
    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsLis.id);
        if(studentObj)
        {
          if(colName=='jobCode')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobcode = this.productsList[index].jobCode;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).hours = this.productsList[index].hours;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).price = this.productsList[index].price;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).priceShowOnly = this.productsList[index].priceShowOnly;
          }
          if(colName=='hours')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).hours = this.productsList[index].hours;
          }
          if(colName=='price')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).price = this.productsList[index].price;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).priceShowOnly = this.productsList[index].priceShowOnly;
          }          
          if(colName=='hourlyrate')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).hourrate = this.productsList[index].hourlyrate;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).hourrateShowOnly = this.productsList[index].hourrateShowOnly;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).stateVal = strJSON;
          }
        }
        else
        {
          if(colName=='jobCode'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "jobcode":this.productsList[index].jobCode,
              "hours":this.productsList[index].hours,
              "price":this.productsList[index].price,
              "priceShowOnly": this.productsList[index].priceShowOnly
            });
          }
          if(colName=='hours'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "hours":this.productsList[index].hours
            });
          }
          if(colName=='price'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "price":this.productsList[index].price,
              "priceShowOnly": this.productsList[index].priceShowOnly,
             
            });
          }
          if(colName=='hourlyrate'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "hourrate":this.productsList[index].hourlyrate,
              "hourrateShowOnly": this.productsList[index].hourrateShowOnly,
              "stateVal":strJSON
            });
          }
        }
      }
    }
    else
    {
      if(colName=='jobCode'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "jobcode":this.productsList[index].jobCode,
          "hours":this.productsList[index].hours,
          "price":this.productsList[index].price,
          "priceShowOnly":this.productsList[index].priceShowOnly
        });
      }
      if(colName=='hours'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "hours":this.productsList[index].hours
        });
      }
      if(colName=='price'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "price":this.productsList[index].price,
          "priceShowOnly": this.productsList[index].priceShowOnly
        });
      }
      if(colName=='hourlyrate'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "hourrate":this.productsList[index].hourlyrate,
          "hourrateShowOnly": this.productsList[index].hourrateShowOnly,
          "stateVal":strJSON
        });
      }
    }
    console.log(this.escalationMatrix_array);

}
  getJobsData(){

    this.setHeaderColumns();
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('teamId', this.teamId);
    apiFormData.append('limit', this.apiData['limit']);
    this.apiData['offset'] = this.itemOffset;
    apiFormData.append('offset', this.apiData['offset']);
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }
    /*if(this.sortorderEvent) {
      apiFormData.append('sortOrderBy', this.sortorderEvent);
    }*/
    this.repairOrderApi.getJOBDetailsList(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.items;
        this.itemTotal = response.total;
        if(this.itemTotal>0){
          this.ItemEmpty = false;
          if(this.itemOffset == 0){
            this.itemLength = 0;
            this.productsList = [];

            this.publishbutton = false;
            this.addednewProduct = false;
            this.apiUrl.jobandratecardNewButton = this.addednewProduct;
            this.escalationMatrix_array = [];
            
          }
          for (let i in resultData) {
            resultData[i].optionValue=[];
            resultData[i].optionValueId=[];
            resultData[i].optionValueName=[];
            let optionValueName = [];
            let optionValue = [];
            let optionValueId = [];
            let optionValues = (resultData[i].optionValues) ? JSON.parse(resultData[i].optionValues) : [];
            //console.log(optionValues)
            if(optionValues?.length>0){
              if(optionValues){
                for(let opvn of optionValues) {
                  optionValueName.push({ id: opvn.id, name: opvn.name });
                  optionValue.push(opvn.name);
                  optionValueId.push(opvn.id);
                }
                resultData[i].optionValueName=(optionValueName);
                resultData[i].optionValueId=(optionValueId);
                resultData[i].optionValue=(optionValue);
              }
            }

            resultData[i].optionNameListsArr=[];
            resultData[i].optionIdListsArr=[];
            resultData[i].workstreamId=[];
            //console.log(this.workstreamListsOptions)
            resultData[i].workstreamId.push(this.workstreamListsOptions[0].id);
            let options = this.workstreamListsOptions[0].options;
            let optionNameLists = [];
              let optionIdLists = [];
            for(let opt of options) {
              if(opt.id == resultData[i].optionType){
                resultData[i].optionTypeName = opt.name;
              }
              optionNameLists.push(opt.name);
              optionIdLists.push(opt.id);
            }
            resultData[i].optionNameListsArr=optionNameLists;
            resultData[i].optionIdListsArr=optionIdLists;

            if(resultData[i].optionType < 1){
              resultData[i].optionType = '4';
              resultData[i].optionTypeName = 'Any';
            }            

            resultData[i].price = resultData[i].unitPrice;
            resultData[i].priceShowOnly = Math.abs(resultData[i].price);
            resultData[i].jobtitle = resultData[i].title;
            resultData[i].jobdescription = resultData[i].description;

            this.productsList.push(resultData[i]);
            //if(this.itemOffset == 0){
              setTimeout(() => {
                this.loading = false;
                this.initLoading = false;
              }, 1000);
            //}

          }

          this.itemOffset += this.itemLimit;
          this.itemLength += this.productsList.length;
          //console.log(this.productsList);
        }
        else{
          setTimeout(() => {
            this.loading = false;
            this.initLoading = false;
          }, 1000);
          this.itemOffset = 0;
          this.itemLength = 0;
          this.productsList = [];
          this.ItemEmpty = true;
          this.displayNoRecords = (this.apiData['searchKey'] =='' ) ? '1' : '2';
        }

      }

      setTimeout(() => {
        this.loadDataEvent=false;
        //this.loading = false;
        //this.initLoading = false;
      }, 1000);


      }, err => {
        this.loading = false;
        this.initLoading = false;
        console.error(err);
      });

  }

  getRateCardData(){
    this.setRateCardHeaderColumns();
    this.publishbutton = false;
    this.addednewProduct = false;
    this.apiUrl.jobandratecardNewButton = this.addednewProduct;
    this.escalationMatrix_array = [];

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('teamId', this.teamId);
    apiFormData.append('limit', this.apiData['limit']);
    this.apiData['offset'] = this.itemOffset;
    apiFormData.append('offset', this.apiData['offset']);
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }
    /*if(this.sortorderEvent) {
      apiFormData.append('sortOrderBy', this.sortorderEvent);
    }*/
    this.repairOrderApi.getRateCardList(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.items;
        this.itemTotal = response.total;
        if(this.itemTotal>0){
          this.ItemEmpty = false;
          if(this.itemOffset == 0){
            this.itemLength = 0;
            this.productsList = [];
          }
          for (let i in resultData) {
            resultData[i].stateStr = [];
            let stateStrValues = [];
            resultData[i].stateStr = [];
            stateStrValues = (resultData[i].stateName) ? JSON.parse(resultData[i].stateName) : [];
            resultData[i].stateStr =  stateStrValues;
            resultData[i].hourlyrate = resultData[i].amount;
            resultData[i].hourrateShowOnly = Math.abs(resultData[i].hourlyrate);

            this.productsList.push(resultData[i]);
            //if(this.itemOffset == 0){
              setTimeout(() => {
                this.loading = false;
                this.initLoading = false;
              }, 1000);
            //}
          }
          this.itemOffset += this.itemLimit;
          this.itemLength += this.productsList.length;
          //console.log(this.productsList);
        }
        else{
          setTimeout(() => {
            this.loading = false;
            this.initLoading = false;
          }, 1000);
          this.itemOffset = 0;
          this.itemLength = 0;
          this.productsList = [];
          this.ItemEmpty = true;
          this.displayNoRecords = (this.apiData['searchKey'] =='' ) ? '1' : '2';
        }
      }
      setTimeout(() => {
        this.loadDataEvent=false;
        //this.loading = false;
        //this.initLoading = false;
      }, 1000);
      }, err => {
        this.loading = false;
        this.initLoading = false;
        console.error(err);
      });
  }

  collectionHas(a, b) { //helper function (see below)
    for (let i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
  }
  findParentBySelector(elm, selector) {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode;
    while(cur && !this.collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur; //will return null if not found
  }
  onChangeOption(event, productsLis, hId, colName,index='') {
    //console.log(event);
    //console.log(productsLis);
    //console.log(hId);
    //console.log(colName);
    //console.log(index);
    let columnValue = '';
    let stateStr = '';
    this.primetablerowdata = productsLis;
    setTimeout(() => {
      hId = parseInt(hId);
      let elss=document.getElementById('product_options'+productsLis.id+''+hId);
      var selector = "td";
      var parent = this.findParentBySelector(elss, selector);
      this.renderer.addClass(parent, 'selectedItemp-table-light');
      this.publishbutton=true;
    }, 100);

    if(colName == 'optionTypeName'){
      columnValue = event.value.name;
      this.productsList[index].optionValue = [];
      this.productsList[index].optionValueId = [];
      this.productsList[index].optionValueName = [];
      for(let ws of this.workstreamListsOptions) {
        for(let pws of this.productsList[index].workstreamId) {
          if(ws.id == pws){
            let options = ws.options
            for(let opt of options) {
              if(opt.name == this.productsList[index].optionTypeName){
                this.productsList[index].optionType = opt.id;
              }
            }
          }
        }
      }
    }
    if(colName == 'stateStr'){
      columnValue = event.value;

      //console.log(event.value.length);
      //console.log(this.stateDropDownOptions.length);
      if(event.value.length == 0){
        this.productsList[index].stateStr = '';
        stateStr = '';
      }
      else{
        this.productsList[index].stateStr = columnValue;
        stateStr = JSON.stringify(productsLis.stateStr)
      }
      this.productsList[index].hourlyrate = productsLis.hourlyrate;
      this.productsList[index].hourrateShowOnly = Math.abs(productsLis.hourlyrate);
      //console.log(this.productsList[index]);
    }

    //console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsLis.id);
        if(studentObj)
        {
          if(colName == 'optionTypeName'){
            if(this.productsList[index].optionType == '4'){
              this.productsList[index].optionValue = [];
              this.productsList[index].optionValueId = [];
              this.productsList[index].optionValueName = [];
              this.escalationMatrix_array.find(item => item.id == productsLis.id).optionValueName = '';
              this.escalationMatrix_array.find(item => item.id == productsLis.id).optionType = this.productsList[index].optionType;
            }
            else{
              this.escalationMatrix_array.find(item => item.id == productsLis.id).optionType = this.productsList[index].optionType;
            }
          }
          if(colName == 'stateStr'){
            this.escalationMatrix_array.find(item => item.id == productsLis.id).stateVal = stateStr;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).hourrate = this.productsList[index].hourlyrate;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).hourrateShowOnly = this.productsList[index].hourrateShowOnly;
          }
        }
        else
        {

          if(colName=='optionTypeName'){
            if(this.productsList[index].optionType == '4'){
              this.escalationMatrix_array.push({
                "id":productsLis.id,
                "optionType":this.productsList[index].optionType ,
                "optionValueName":''
              });
            }
            else{
              this.escalationMatrix_array.push({
                "id":productsLis.id,
                "optionType":this.productsList[index].optionType
              });
            }
          }
          if(colName=='stateStr'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "stateVal":stateStr,
              "hourrate":this.productsList[index].hourlyrate,
              "hourrateShowOnly":this.productsList[index].hourrateShowOnly
            });
          }
        }
      }
    }
    else
    {

      if(colName=='optionTypeName'){
        if(this.productsList[index].optionType == '4'){
          this.escalationMatrix_array.push({
            "id":productsLis.id,
            "optionType":this.productsList[index].optionType,
            "optionValueName":''
          });
        }
        else{
          this.escalationMatrix_array.push({
            "id":productsLis.id,
            "optionType":this.productsList[index].optionType,
          });
        }
      }
      if(colName=='stateStr'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "stateVal":stateStr,
          "hourrate":this.productsList[index].hourlyrate,
          "hourrateShowOnly":this.productsList[index].hourrateShowOnly
        });
      }

    }
    //console.log(this.escalationMatrix_array);
  }

  moreClick(prodList){
    this.descMoreModal = true;
    this.moreTitle = prodList.jobtitle;
    this.moreDesc =  prodList.jobdescription;
  }
  updateTitleDesc(fieldName, prodList, hId, colName,index=''){
    this.jobtitle = prodList.jobtitle == '' ? '' : prodList.jobtitle ;
    this.jobdescription = prodList.jobdescription== '' ? '' : prodList.jobdescription;
    this.jobindex = index;
    this.updateTitleDescModal = true;
  }

  manageOption(eventData,prodList, hId, colName,index='') {
    //console.log( eventData);
    //console.log(prodList);
    //console.log(hId);
    //console.log(colName);
    //console.log(this.productsList[index]);
    //console.log(prodList);
    //console.log(hId);
    //console.log(colName);

    if((this.productsList[index].optionType == '' || this.productsList[index].optionType == '4') && (colName=='optionValue')){
      return false
    }

    let inputData = {};
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.apiData["domainId"],
      countryId: this.apiData["countryId"],
      userId: this.apiData["userId"],
      access: 'thread',
    };
    let url = '';
    let title = '';
    if(this.productsList[index].optionType == '3' && (colName=='optionValue')){
      url = '/Productmatrix/getproductmakeList';
      title = this.productsList[index].optionTypeName;
      apiData['workstreamsList'] = JSON.stringify(this.productsList[index].workstreamId);
      inputData = {
        baseApiUrl: this.collabticApi,
        apiUrl: this.collabticApi+"/"+url,
        field: 'make',
        selectionType: "multiple",
        filteredItems: this.productsList[index].optionValueId,
        filteredLists: this.productsList[index].optionValue,
        actionApiName: "",
        actionQueryValues: "",
        title: title
      };

    }
    if(this.productsList[index].optionType == '2' && (colName=='optionValue')){
      url = '/Productmatrix/getManufacturerList';
      title = this.productsList[index].optionTypeName;
      apiData['workstreamsList'] = JSON.stringify(this.productsList[index].workstreamId);
      inputData = {
        baseApiUrl: this.collabticApi,
        apiUrl: this.collabticApi+"/"+url,
        field: 'manufacturer',
        selectionType: "multiple",
        filteredItems: this.productsList[index].optionValueId,
        filteredLists: this.productsList[index].optionValue,
        actionApiName: "",
        actionQueryValues: "",
        title: title
      };

    }
    if(this.productsList[index].optionType == '1' && (colName=='optionValue')){
      url = '/forum/GetThreadCategory';
      title = this.productsList[index].optionTypeName;
      apiData['workstreamsList'] = JSON.stringify(this.productsList[index].workstreamId);
      inputData = {
        baseApiUrl: this.collabticApi,
        apiUrl: this.collabticApi+"/"+url,
        field: 'threadcategory',
        selectionType: "multiple",
        filteredItems: this.productsList[index].optionValueId,
        filteredLists: this.productsList[index].optionValue,
        actionApiName: "",
        actionQueryValues: "",
        title: title
      };
    }
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = this.innerHeight;
    modalRef.componentInstance.access = "newthread";

    modalRef.componentInstance.filteredTags = this.productsList[index].optionValueId;
    modalRef.componentInstance.filteredLists = this.productsList[index].optionValue;

    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {

    let tagItems = receivedService;
    console.log(tagItems)
    let idArr = [];
    let idNameArr = [];
    let nameArr = [];
    if(tagItems.length>0){
      for (let t in tagItems) {
        nameArr.push(tagItems[t].name);
        idArr.push(tagItems[t].id);
        idNameArr.push({id:tagItems[t].id, name: tagItems[t].name});
        if(colName=='optionValue'){
          this.productsList[index].optionValueId=idArr;
          this.productsList[index].optionValue=nameArr;
          this.productsList[index].optionValueName=idNameArr;
        }
      }
    }
    else{
      if(colName=='optionValue'){
        this.productsList[index].optionValueId=idArr;
        this.productsList[index].optionValue=nameArr;
        this.productsList[index].optionValueName=idNameArr;
      }
    }

    //console.log(prodList);
    //console.log(this.productsList[index]);
    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        //this.escalationMatrix_array[wsd] = this.productsList[index];
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==prodList.id);
        if(studentObj)
        {
          if(colName=='optionValue' )
          {
            this.escalationMatrix_array.find(item => item.id == prodList.id).optionValueName = JSON.stringify(this.productsList[index].optionValueName);
          }
        }
        else
        {
          if(colName=='optionValue'){
            this.escalationMatrix_array.push({
              "id":prodList.id,
              "optionValueName":JSON.stringify(this.productsList[index].optionValueName)
            });
          }
        }
      }
    }
    else
    {
      if(colName=='optionValue'){
        this.escalationMatrix_array.push({
          "id":prodList.id,
          "optionValueName":JSON.stringify(this.productsList[index].optionValueName)
        });
      }
    }
    setTimeout(() => {
      let elss = document.getElementById('product_options' + prodList.id + hId);
      //document.querySelector('.selectedItemp-table-light')?.classList.remove('selectedItemp-table-light')
      //console.log(elss);
      if(elss != null){
        var selector = "td";
        var parent = this.findParentBySelector(elss, selector);
        this.renderer.addClass(parent, 'selectedItemp-table-light');
      }
      this.publishbutton=true;

      //console.log(this.productsList);
      console.log(this.escalationMatrix_array);

    }, 100);

  });


  }

  // Allow only numeric
  restrictNumeric(e) {
    let res = this.commonApi.restrictNumeric(e);
    return res;
  }

  onRowReorder(event){

    //console.log(event); //{dragIndex: 1, dropIndex: 2}
    //console.log(this.productsList)
/*
    for (let pl in this.productsList)
      {

        let elss = document.getElementById('product_options' + this.productsList[pl].id + '3');
        if(elss != null){
           var selector = "td";
           var parent = this.findParentBySelector(elss, selector);
           this.renderer.addClass(parent, 'selectedItemp-table-light');
         }

    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {



        let studentObj =  this.escalationMatrix_array.find(t=>t.id==this.productsList[pl].id);
        if(studentObj)
        {

          this.escalationMatrix_array.find(item => item.id ==this.productsList[pl].id).displayPriority = parseInt(pl)+1;


        }
        else
        {

            this.escalationMatrix_array.push({
              "id":this.productsList[pl].id,
              "displayPriority":parseInt(pl)+1
            });

        }




      }
    }
    else
    {

        this.escalationMatrix_array.push({
          "id":this.productsList[pl].id,
          "displayPriority":parseInt(pl)+1
        });

    }
    this.publishbutton = true;
  }
*/


  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    let headerHeight1 = 0;
    headerHeight = (document.getElementsByClassName('prob-header')[0]) ? document.getElementsByClassName('prob-header')[0].clientHeight : headerHeight;
    headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    headerHeight = headerHeight1 +  headerHeight1;

    this.innerHeight = 0;
    this.innerHeightFix = '';

    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight;
    this.innerHeightFix = (this.bodyHeight - (headerHeight + 190)) + 'px';
    this.emptyHeight =(this.bodyHeight - (headerHeight + 135));
  }

  scroll = (event: any): void => {
     if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
     {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-10;
      this.scrollTop = event.target.scrollTop-90;

      //console.log(event.target.scrollTop+event.target.offsetHeight +'--'+ event.target.scrollHeight);
      //console.log(this.itemTotal +'--'+ this.itemLength);

      if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
      //{
      //if(this.itemTotal > this.itemLength && this.loadDataEvent==false)
      {
      this.loading=true;
      this.loadDataEvent=true;
      if(this.loadjobs){
        this.getJobsData();
      }
      else{
        this.getRateCardData();
      }

      this.lastScrollTop = this.scrollTop;
      event.preventDefault;
     }
    }
  };
  newMatrix(event) {
    if(this.itemTotal == 0){
     this.ItemEmpty = false;
    }
    this.addednewProduct=true;
    this.apiUrl.jobandratecardNewButton = this.addednewProduct;

    if(this.loadjobs){
      if(this.productsList?.length == 0){
        this.escalationMatrix_array = [];
        this.productsList = [];
      }
      this.productsList.unshift(
        { id: "", newmatrix: "0", optionType: "", optionTypeName: "", optionValue:[], optionValueId: [], optionValueName: [], jobCode: "", title: "", description : "", price:"0", priceShowOnly:"0", hours : "1" },
      );

      this.productsList[0].optionNameListsArr=[];
      this.productsList[0].optionIdListsArr=[];

      let optionNameLists = [];
      let optionIdLists = [];
      this.productsList[0].workstreamId=[];
      this.productsList[0].workstreamId.push(this.workstreamListsOptions[0].id);
      let options = this.workstreamListsOptions[0].options
      for(let opt of options) {
        optionNameLists.push(opt.name);
        optionIdLists.push(opt.id);
      }
      this.productsList[0].optionNameListsArr=optionNameLists;
      this.productsList[0].optionIdListsArr=optionIdLists;
    }
    else{
      if(this.productsList?.length == 0){
        this.escalationMatrix_array = [];
        this.productsList = [];
      }
      this.productsList.unshift(
        { id: "", newmatrix: "0", stateStr:[], hourlyrate : '' }
      );

      this.productsList[0].optionNameListsArr=[];
      this.productsList[0].optionIdListsArr=[];

      let optionNameLists = [];
      let optionIdLists = [];
      this.productsList[0].workstreamId=[];
      this.productsList[0].workstreamId.push(this.workstreamListsOptions[0].id);
      let options = this.workstreamListsOptions[0].options;
      for(let opt of options) {
        optionNameLists.push(opt.name);
        optionIdLists.push(opt.id);
      }
      this.productsList[0].optionNameListsArr=optionNameLists;
      this.productsList[0].optionIdListsArr=optionIdLists;
    }

    this.addnewrowbgcolor='addnewrow';
    this.publishbutton=true;
  }

  saveAssignmentRules(event) {
    if(this.loadjobs){
      this.saveJobDetails(event)
    }
    else{
      this.saveRatecardDetails(event)
    }
  }

  saveJobDetails(event) {

    console.log(this.escalationMatrix_array);
    this.addnewrowbgcolor='addnewrow';
    if(this.escalationMatrix_array.length == 0){
      this.addnewrowbgcolor='addnewrowerror';
      return false;
    }
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {

        console.log(this.escalationMatrix_array[wsd]);

          if(this.escalationMatrix_array[wsd].jobcode==0 ||
          this.escalationMatrix_array[wsd].jobcode=='' ||
          this.escalationMatrix_array[wsd].hours==0 ||
          this.escalationMatrix_array[wsd].hours=='' ||
          this.escalationMatrix_array[wsd].optionType=='' ||
          this.escalationMatrix_array[wsd].jobtitle=='' ||
          this.escalationMatrix_array[wsd].jobdescription==''){
            this.addnewrowbgcolor='addnewrowerror';
            return false;
          }
          else{
            if((this.escalationMatrix_array[wsd].id=='')){
              if((this.escalationMatrix_array[wsd].jobcode) &&
              (this.escalationMatrix_array[wsd].hours) &&
              (this.escalationMatrix_array[wsd].optionType) &&
              (this.escalationMatrix_array[wsd].jobtitle) &&
              (this.escalationMatrix_array[wsd].jobdescription)){
                if(this.escalationMatrix_array[wsd].jobcode==0 ||
                  this.escalationMatrix_array[wsd].jobcode=='' ||
                  this.escalationMatrix_array[wsd].hours==0 ||
                  this.escalationMatrix_array[wsd].hours=='' ||
                  this.escalationMatrix_array[wsd].optionType=='' ||
                  this.escalationMatrix_array[wsd].jobtitle=='' ||
                  this.escalationMatrix_array[wsd].jobdescription==''){
                    this.addnewrowbgcolor='addnewrowerror';
                    return false;
                  }
              }
              else{
                this.addnewrowbgcolor='addnewrowerror';
                return false;
              }
            }
          }

      }
    }


    if(this.escalationMatrix_array.length>0 && !this.saveFlag)
    {
    this.publishbutton = false;
    this.saveFlag = true;
    this.loading=true;
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'contentTypeId': ContentTypeValues.RepairOrder,
      'params': JSON.stringify(this.escalationMatrix_array)
    };
    let matrixData = new FormData();
    matrixData.append('apiKey', apiData.apiKey);
    matrixData.append('userId', apiData.userId);
    matrixData.append('domainId', apiData.domainId);
    matrixData.append('contentTypeId', ContentTypeValues.RepairOrder);
    matrixData.append('params', apiData.params);
    //if(this.recentSelectionParam){
      //matrixData.append('recentselection', this.recentSelectionParamValue);
    //}
    //new Response(matrixData).text().then(console.log)
    //return false;
    this.repairOrderApi.updateJOBDetailsList(matrixData).subscribe((response) => {

      console.log(this.escalationMatrix_array);
      //return false;

      if(response.status=='Success')
      {
        const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalMsgRef.componentInstance.msg = response.message;
        setTimeout(() => {
          this.loading=true;
          this.saveFlag = false;
          //this.initLoading = true;
          this.publishbutton = false;
          this.addednewProduct = false;
          this.apiUrl.jobandratecardNewButton = this.addednewProduct;
          this.escalationMatrix_array = [];
          //this.productsList = [];
          this.itemOffset = 0;
          this.getJobsData();
          modalMsgRef.dismiss('Cross click');
        }, 2000);
      }
      else
      {
        this.loading=false;
        this.saveFlag = false;
        this.publishbutton = false;
      }
        });
      }

  }

  saveRatecardDetails(event) {
    this.addnewrowbgcolor='addnewrow';
    if(this.escalationMatrix_array.length == 0){
      this.addnewrowbgcolor='addnewrowerror';
      return false;
    }
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {

        //console.log(this.escalationMatrix_array[wsd].stateVal);
        //console.log(this.escalationMatrix_array[wsd].stateVal?.length);

        if(this.escalationMatrix_array[wsd].stateVal && this.escalationMatrix_array[wsd].hourrate){
          if(this.escalationMatrix_array[wsd].stateVal?.length == 0 || this.escalationMatrix_array[wsd].hourrate=='' || this.escalationMatrix_array[wsd].hourrate==0){
            this.addnewrowbgcolor='addnewrowerror';
            return false;
          }
        }
        else{
          if((this.escalationMatrix_array[wsd].id!='')){}
          else{
            this.addnewrowbgcolor='addnewrowerror';
            return false;
          }
        }
      }
    }
    console.log(this.escalationMatrix_array);

    if(this.escalationMatrix_array.length>0 && !this.saveFlag)
    {
      this.publishbutton = false;
      this.saveFlag = true;
    this.loading=true;
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'contentTypeId': ContentTypeValues.RepairOrder,
      'params': JSON.stringify(this.escalationMatrix_array)
    };
    let matrixData = new FormData();
    matrixData.append('apiKey', apiData.apiKey);
    matrixData.append('userId', apiData.userId);
    matrixData.append('domainId', apiData.domainId);
    matrixData.append('contentTypeId', ContentTypeValues.RepairOrder);
    matrixData.append('params', apiData.params);
    //if(this.recentSelectionParam){
      //matrixData.append('recentselection', this.recentSelectionParamValue);
    //}
    //new Response(matrixData).text().then(console.log)
    //return false;
    this.repairOrderApi.updatRateCardList(matrixData).subscribe((response) => {

      console.log(this.escalationMatrix_array);
      //return false;

      if(response.status=='Success')
      {
        const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalMsgRef.componentInstance.msg = response.message;
        setTimeout(() => {
          this.loading=true;
          this.saveFlag = false;
          //this.initLoading = true;
          this.publishbutton = false;
          this.addednewProduct = false;
          this.apiUrl.jobandratecardNewButton = this.addednewProduct;
          this.escalationMatrix_array = [];
          //this.productsList = [];
          this.itemOffset = 0;
          this.getRateCardData();
          modalMsgRef.dismiss('Cross click');
        }, 2000);
      }
      else
      {
        this.loading=false;
        this.saveFlag = false;
        this.publishbutton = false;
      }
        });
      }

  }

  cancelAssignmentRules() {
    this.publishbutton = false;
    this.addednewProduct = false;
    this.apiUrl.jobandratecardNewButton = this.addednewProduct;
    this.escalationMatrix_array = [];
    this.itemOffset = 0;
    this.saveFlag = false;
    if(this.loadjobs){
      this.getJobsData();
    }
    else{
      this.getRateCardData();
    }
  }
  oninputChange(event,type){
    if(type == 'title'){
      this.jobtitle = event.target.value;
    }
    else{
      this.jobdescription = event.target.value;
    }
  }
  saveContent(){
    if(this.jobdescription.trim() != '' && this.jobtitle.trim() != ''){

        let index = this.jobindex;

        if(this.jobdescription.trim() != ''){
          this.productsList[index].jobdescription = this.jobdescription;
        }
        if(this.jobtitle.trim() != ''){
          this.productsList[index].jobtitle = this.jobtitle;
        }

        console.log(this.escalationMatrix_array);
        if(this.escalationMatrix_array.length>0)
        {
          for (let wsd in this.escalationMatrix_array)
          {
            let studentObj =  this.escalationMatrix_array.find(t=>t.id==this.productsList[index].id);
            if(studentObj)
            {
              if(this.jobdescription.trim() != '')
              {
                this.escalationMatrix_array.find(item => item.id == this.productsList[index].id).jobdescription = this.productsList[index].jobdescription;
              }
              if(this.jobtitle.trim() != '')
              {
                this.escalationMatrix_array.find(item => item.id == this.productsList[index].id).jobtitle = this.productsList[index].jobtitle;
              }
            }
            else
            {
              if(this.jobdescription.trim() != ''){
                this.escalationMatrix_array.push({
                  "id":this.productsList[index].id,
                  "jobtitle":this.productsList[index].jobtitle,
                  "jobdescription":this.productsList[index].jobdescription
                });
              }
            }
          }
        }
        else
        {
          if(this.jobdescription.trim() != ''){
            this.escalationMatrix_array.push({
              "id":this.productsList[index].id,
              "jobtitle":this.productsList[index].jobtitle,
              "jobdescription":this.productsList[index].jobdescription
            });
          }
        }
        console.log(this.escalationMatrix_array);

         setTimeout(() => {
          let elss = document.getElementById('product_options' + this.productsList[index].id5);
          //document.querySelector('.selectedItemp-table-light')?.classList.remove('selectedItemp-table-light')
          //console.log(elss);
          if(elss != null){
            var selector = "td";
            var parent = this.findParentBySelector(elss, selector);
            this.renderer.addClass(parent, 'selectedItemp-table-light');
          }

          let elss1 = document.getElementById('product_options' + this.productsList[index].id6);
          //document.querySelector('.selectedItemp-table-light')?.classList.remove('selectedItemp-table-light')
          //console.log(elss);
          if(elss1 != null){
            var selector = "td";
            var parent = this.findParentBySelector(elss1, selector);
            this.renderer.addClass(parent, 'selectedItemp-table-light');
          }
          this.publishbutton=true;

          console.log(this.productsList);
          console.log(this.escalationMatrix_array);

        }, 100);

        this.updateTitleDescModal = false;
        this.jobindex = '';
        this.jobdescription = '';
        this.jobtitle = '';

    }


  }

  applySearch(action,val) {
    if(action == 'emit'){
        this.loading = true;
        this.searchVal = val;
        this.apiData['searchKey'] = this.searchVal;
        this.itemLimit = 20;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        this.scrollInit = 0;
        this.lastScrollTop = 0;
        this.scrollCallback = true;
        this.displayNoRecords = '0';
        this.escalationMatrix_array = [];
        this.itemOffset = 0;
        this.getJobsData();
        this.headerData['searchKey'] = this.searchVal;
        this.headerFlag = true;
    }
  }
  menuNav(item) {
    console.log(item)
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    if(item.slug == "repairorder"){
      this.addednewProduct = false;
      this.apiUrl.jobandratecardNewButton = this.addednewProduct;
      this.router.navigate(["/repair-order"]);
      return false;
    } 
  }

  tabonpage(type){
    if(type == 'jobs'){
      this.loadjobs = true;
      this.loading = true;
      this.initLoading = true;
      this.publishbutton = false;
      this.addednewProduct = false;
      this.apiUrl.jobandratecardNewButton = this.addednewProduct;
      this.escalationMatrix_array = [];
      this.itemOffset = 0;
      this.getJobsData();
      this.saveFlag = false;
    }
    else{
      this.loadjobs = false;
      this.loading=true;
      this.initLoading = true;
      this.publishbutton = false;
      this.addednewProduct = false;
      this.apiUrl.jobandratecardNewButton = this.addednewProduct;
      this.escalationMatrix_array = [];
      this.itemOffset = 0;
      this.getRateCardData();
      this.saveFlag = false;
    }
  }

  testJSON(text){
    if (typeof text!=="string"){
        return false;
    }
    try{
        var json = JSON.parse(text);
        return (typeof json === 'object');
    }
    catch (error){
        return false;
    }
  }

  loadCountryStateData() {
    this.stateDropDownOptions = [];
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        //this.countryDropDownOptions = response.data.countryData;
        this.stateDropDownOptions = response.data.stateData;
      }
    }, (error: any) => {
    });
  }

  setItemArray(value)
  {

    return value.map(e => e.name).join(", ");

  }
  setItemSpace(value)
  {

    return value.map(e => e).join(", ");

  }

  deleteAction(id,type){
    let matrixData = new FormData();
    matrixData.append('apiKey', Constant.ApiKey);
    matrixData.append('userId', this.userId);
    matrixData.append('domainId', this.domainId);
    matrixData.append('contentTypeId', ContentTypeValues.RepairOrder);
    matrixData.append('action', 'delete');
    matrixData.append('id', id);

    //new Response(matrixData).text().then(console.log)
    //return false;

    if(type == 'jobs'){
      this.repairOrderApi.updateJOBDetailsList(matrixData).subscribe((response) => {
        if(response.status=='Success')
        {
          const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
          modalMsgRef.componentInstance.msg = response.message;
          setTimeout(() => {
            this.loading=true;
            //this.initLoading = true;
            this.publishbutton = false;
            this.addednewProduct = false;
            this.apiUrl.jobandratecardNewButton = this.addednewProduct;
            this.escalationMatrix_array = [];
            //this.productsList = [];
            this.itemOffset = 0;
            this.getJobsData();
            modalMsgRef.dismiss('Cross click');
          }, 2000);
        }
      });
    }
    else{
      this.repairOrderApi.updatRateCardList(matrixData).subscribe((response) => {
        const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalMsgRef.componentInstance.msg = response.message;
        setTimeout(() => {
          this.loading=true;
          //this.initLoading = true;
          this.publishbutton = false;
          this.addednewProduct = false;
          this.apiUrl.jobandratecardNewButton = this.addednewProduct;
          this.escalationMatrix_array = [];
          //this.productsList = [];
          this.itemOffset = 0;
          this.getRateCardData();
          modalMsgRef.dismiss('Cross click');
        }, 2000);
      });
    }

  }

  isNumberKey(key,value,columnName){    
    var keycode = (key.which) ? key.which : key.keyCode;
    console.log(keycode);
    console.log(value.length)
    console.log(columnName)
    if(value.length==0 && (columnName == 'price' || columnName == 'hourlyrate')){
      if (keycode != 45 && keycode != 46 && keycode > 31
        && (keycode < 48 || keycode > 57))
         return false;
    }
    else{
      if (keycode != 46 && keycode > 31
        && (keycode < 48 || keycode > 57))
         return false;
    }
   
  }


}

