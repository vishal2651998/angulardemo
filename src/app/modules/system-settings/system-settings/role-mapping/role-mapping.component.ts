import { Component, Renderer2, EventEmitter, OnInit, Output, ViewChild, HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant, ContentTypeValues, FilterGroups, filterNames, filterFields, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AddLinkComponent } from '../../../../components/common/add-link/add-link.component';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.scss'],
  providers: [MessageService]
})
export class RoleMappingComponent implements OnInit {
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public headerData: Object;
  public headTitle: string = "System Settings";
  public bodyClass: string = "rolemapping";
  public apiKey: string = Constant.ApiKey;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public apiInfo: Object;
  public loading: boolean = true;
  public itemEmpty: boolean = false;
  public bodyHeight: number;
  public bodyElem;
  public systemMsg: Message[];
  public rmHeight: any = 115;
  public expandFlag: boolean = true;
  public pageAccess: string = "rolemapping";
  public initLoading: boolean = true;
  public addnewrowbgcolor:string;
  public dragdropbgcolor: string;
  public ItemEmpty: boolean = false;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemTotal: number;
  public itemLength: number = 0;
  public displayNoRecords: string = '0';
  public publishbutton: boolean = false;
  public searchVal: string = '';
  public  productsList = [];
  cols=[];
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public loadDataEvent: boolean=false;
  public lazyloadDataEvent: boolean=false;
  public accountTypes = [];
  public businessRoles = [];
  public escalationMatrix_array=[];
  public innerHeightFix: string='';
  public innerHeight: number = window.innerHeight - 300;
  public emptyHeight = window.innerHeight - 300;
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private activteRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private renderer: Renderer2,
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = 'dialog-centered';
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
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {


      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'searchKey': this.searchVal,
        'limit': this.itemLimit,
        'offset': this.itemOffset
      }
      this.apiData = apiInfo;

      this.bodyHeight = window.innerHeight;
      this.getAccountypeandBussRoles();
      setTimeout(() => {
        this.setScreenHeight();
      }, 1000);

    }

    this.subscription.add(
      this.commonApi.NewButtonSSHeaderCallReceivedSubject.subscribe((r) => {
         if(r == 'new'){
          this.saveAssignmentRules();
         }
         else{
          this.cancelAssignmentRules();
         }
      })
    );



  }
  /**
   * Filter Expand/Collapse
   */
 expandAction() {
  this.expandFlag = this.expandFlag ? false : true;
 }

 setHeaderColumns(){
  this.cols = [
    {
      columnName: "name",
      columnpredefind: "1",
      field: 'name',
      header: 'Repairify Position',
      columnpclass: "tech-col-1",
      headerId: "1",
      inputType: "1",
    },
    {
      columnName: "businessRoleName",
      columnpredefind: "1",
      field: 'businessRoleName',
      header: 'Business Role',
      columnpclass: "tech-col-2" ,
      headerId: "2",
      inputType: "2",
    },
    {
      columnName: "accountTypeName",
      columnpredefind: "1",
      field: 'accountTypeName',
      header: 'Account Type',
      columnpclass: "tech-col-3",
      headerId: "3",
      inputType: "2",
    },
  ];
}

 getAccountypeandBussRoles(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);

    this.commonApi.getAccountypeandBussRoles(apiFormData).subscribe(res => {
      this.getRolesMappingList();
      if(res.status=='Success'){
         console.log(res.items);
         this.accountTypes = [];
         this.accountTypes  = res.accountTypes;
         this.businessRoles = [];
         this.businessRoles = res.businessRoles;
      }
      else{

      }
    },
    (error => {})
    );
  }

  getRolesMappingList(){

    this.setHeaderColumns();
    this.publishbutton = false;
    this.apiUrl.roleMapPublishbutton = this.publishbutton;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('limit', this.apiData['limit']);
    this.apiData['offset'] = this.itemOffset;
    apiFormData.append('offset', this.apiData['offset']);
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }

    this.commonApi.getRolesMappingList(apiFormData).subscribe(res => {

      if(res.status=='Success'){

        let resultData = res.items;
        this.itemTotal = res.total;

        if(this.itemTotal>0){
          this.ItemEmpty = false;
          if(this.itemOffset == 0){
            this.itemLength = 0;
            this.productsList = [];
          }
          for (let i in resultData) {

            // accountType
            if(resultData[i].accountType != "0"){
              for(let at of this.accountTypes) {
                if(at.id == resultData[i].accountType){
                  resultData[i].accountTypeName = at.name;
                }
              }
            }
            else{
              resultData[i].accountTypeName = "";
            }

            // businessRole
            if(resultData[i].businessRole != "0"){
              for(let br of this.businessRoles) {
                if(br.id == resultData[i].businessRole){
                  resultData[i].businessRoleName = br.name;
                }
              }
            }
            else{
              resultData[i].businessRoleName = "";
            }

            this.productsList.push(resultData[i]);

            }

            this.itemOffset += this.itemLimit;
            this.itemLength += this.productsList.length;
            console.log(this.productsList);

          }
          else{
            this.itemOffset = 0;
            this.itemLength = 0;
            this.productsList = [];
            this.ItemEmpty = true;
            this.displayNoRecords = '2';
          }
      }
      else{
        this.itemOffset = 0;
        this.itemLength = 0;
        this.productsList = [];
        this.ItemEmpty = true;
        this.displayNoRecords = '2';
      }

      setTimeout(() => {
        this.loadDataEvent=false;
        this.loading = false;
        this.initLoading = false;
      }, 1);

    },
    (error => {
      this.loading = false;
      this.initLoading = false;
      this.itemOffset = 0;
      this.itemLength = 0;
      this.productsList = [];
      this.ItemEmpty = true;
      this.displayNoRecords = '2';
      console.error(error);
    })
    );
  }

  onChangeOption(event, productsLis, hId, colName,index='') {
    console.log( event.value);
    console.log(productsLis);
    console.log(hId);
    console.log(colName);
    console.log(index);
    setTimeout(() => {
      hId = parseInt(hId);
      let elss=document.getElementById('product_options'+productsLis.id+''+hId);
      var selector = "td";
      var parent = this.findParentBySelector(elss, selector);
      this.renderer.addClass(parent, 'selectedItemp-table-light');
      this.publishbutton=true;
      this.apiUrl.roleMapPublishbutton = this.publishbutton;
    }, 100);

    if(colName == 'businessRoleName'){
      this.productsList[index].businessRole =  event.value.id;
      this.productsList[index].businessRoleName =  event.value.name;
    }

    if(colName == 'accountTypeName'){
      this.productsList[index].accountType =  event.value.id;
      this.productsList[index].accountTypeName =  event.value.name;
    }

    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsLis.id);
        if(studentObj)
        {
          if(colName == 'businessRoleName'){
            this.escalationMatrix_array.find(item => item.id == productsLis.id).businessRole = this.productsList[index].businessRole;
          }
          if(colName == 'accountTypeName'){
            this.escalationMatrix_array.find(item => item.id == productsLis.id).accountType = this.productsList[index].accountType;
          }
        }
        else
        {
          if(colName=='businessRoleName'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "businessRole":this.productsList[index].businessRole
            });
          }
          if(colName=='accountTypeName'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "accountType":this.productsList[index].accountType
            });
          }
        }
      }
    }
    else
    {

      if(colName=='businessRoleName'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "businessRole":this.productsList[index].businessRole
        });
      }
      if(colName=='accountTypeName'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "accountType":this.productsList[index].accountType
        });
      }

    }
    console.log(this.escalationMatrix_array);
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
    this.innerHeightFix = (this.bodyHeight - (headerHeight + 170)) + 'px';
    this.emptyHeight =(this.bodyHeight - (headerHeight + 135));
  }

  scroll = (event: any): void => {
     if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
     {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-10;
      this.scrollTop = event.target.scrollTop-90;

      console.log(event.target.scrollTop+event.target.offsetHeight +'--'+ event.target.scrollHeight);
      //console.log(this.itemTotal +'--'+ this.itemLength);

      if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
      //{
      //if(this.itemTotal > this.itemLength && this.loadDataEvent==false)
      {
      this.loading=true;
      this.loadDataEvent=true;
      this.getRolesMappingList();
      this.lastScrollTop = this.scrollTop;
      event.preventDefault;
     }
    }
  };


  saveAssignmentRules() {
    this.addnewrowbgcolor='addnewrow';
    if(this.escalationMatrix_array.length == 0){
      this.addnewrowbgcolor='addnewrowerror';
      return false;
    }
    console.log(this.escalationMatrix_array);
    //return false;
    if(this.escalationMatrix_array.length>0)
    {
      let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'params': JSON.stringify(this.escalationMatrix_array)
    };
    let matrixData = new FormData();
    matrixData.append('apiKey', apiData.apiKey);
    matrixData.append('userId', apiData.userId);
    matrixData.append('domainId', apiData.domainId);
    matrixData.append('params', apiData.params);

    this.commonApi.updateBussRoleSettings(matrixData).subscribe((response) => {
      console.log(this.escalationMatrix_array);
      //return false;
      if(response.status=='Success')
      {
        let msg = response.result;
        this.systemMsg = [{severity:'success', summary:'', detail: msg}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          //this.loading=true;
          this.systemMsg = [];
          this.cancelAssignmentRules();
        }, 2000);
      }
      else
      {
        this.loading=false;
      }
        });
      }

  }
  cancelAssignmentRules() {
    this.publishbutton = false;
    this.apiUrl.roleMapPublishbutton = this.publishbutton;
    this.escalationMatrix_array = [];
    this.itemOffset = 0;
    this.getRolesMappingList();
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

}

