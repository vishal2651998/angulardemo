import { Component, ViewChild, HostListener,Directive,Renderer2,ElementRef,AfterViewInit, OnInit,Input,OnDestroy, NgModuleRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { Constant,windowHeight, PlatFormType,IsOpenNewTab} from '../../../../../common/constant/constant';
import { CommonService } from '../../../../../services/common/common.service';
import { ProductMatrixService } from '../../../../../services/product-matrix/product-matrix.service';
import { LandingpageService } from "../../../../../services/landingpage/landingpage.service";
import { ManageListComponent } from '../../../../../components/common/manage-list/manage-list.component';
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import { SuccessComponent } from '../../../../../components/common/success/success.component';
import { ApiService } from 'src/app/services/api/api.service';
import { isArray } from 'util';
import { Subscription } from "rxjs";
import * as moment from 'moment';

interface statusList {
  id: string;
  name: string;
}

declare var $:any;

@Component({
  selector: 'app-assignment-rules',
  templateUrl: './assignment-rules.component.html',
  styleUrls: ['./assignment-rules.component.scss']
})
export class AssignmentRulesComponent implements OnInit {
  subscription: Subscription = new Subscription();
  public title: string = "Tech Support - Assignment Rules";
  public bodyClass:string = "product-matrix-list";
  public memberSelectFlag: boolean = false;
  public headerFlag: boolean = false;
  public notesUpdatedByName: string = '';
  public notesUpdatedOnDate: string = '';
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public apiData: Object;
  public headerData: Object;
  public pageAccess: string = "techsupportrules";
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
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemTotal: number;
  public itemLength: number = 0;
  public displayNoRecords: string = '0';
  public publishbutton: boolean = false;
  public searchVal: string = '';
  public  productsList = [];
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

   // Resize Widow
   @HostListener('window:resize', ['$event'])
   onResize(event) {
    this.bodyHeight = window.innerHeight;
     this.setScreenHeight();
   }

  constructor(
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
    this.getTeamList();
    setTimeout(() => {
      this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
      this.getTechSupportPriorityData();
    }, 100);

    setTimeout(() => {
      this.setScreenHeight();
    }, 2000);

    this.subscription.add(
      this.commonApi.NewButtonHeaderCallReceivedSubject.subscribe((r) => {
        this.newMatrix(true);
      })
    );

  }
  setHeaderColumns(){
    this.cols = [
      {
        columnName: "workstreamName",
        columnpredefind: "1",
        field: 'workstreamName',
        header: 'Workstream',
        columnpclass: "tech-sticky-col tech-col-2",
        headerId: "2",
        inputType: "3",
      },
      {
        columnName: "displayPriority",
        columnpredefind: "1",
        field: 'displayPriority',
        header: 'Priority',
        columnpclass: "tech-sticky-col tech-col-3",
        headerId: "3",
        inputType: "2",
      },
      {
        columnName: "optionTypeName",
        columnpredefind: "1",
        field: 'optionTypeName',
        header: 'Option Name',
        columnpclass: "tech-col-4" ,
        headerId: "4",
        inputType: "2",
      },
      {
        columnName: "optionValue",
        columnpredefind: "1",
        field: 'optionValue',
        header: 'Option Value',
        columnpclass: "tech-col-5",
        headerId: "5",
        inputType: "3",
      },
      {
        columnName: "keyWordsPriorityName",
        columnpredefind: "1",
        field: 'keyWordsPriorityName',
        header: 'Keywords',
        columnpclass: "tech-col-6",
        headerId: "6",
        inputType: "3",
      },
      {
        columnName: "teamName",
        columnpredefind: "1",
        field: 'teamName',
        header: 'Team Name',
        columnpclass: "tech-col-7",
        headerId: "7",
        inputType: "3",
      },
      {
        columnName: "p1esc",
        columnpredefind: "1",
        field: 'p1esc',
        header: 'PREFERENCE 1',
        columnpclass: "tech-col-8",
        headerId: "8",
        inputType: "4",
      },
      {
        columnName: "p2esc",
        columnpredefind: "1",
        field: 'p2esc',
        header: 'PREFERENCE 2',
        columnpclass: "tech-col-9",
        headerId: "7",
        inputType: "4",
      },
      {
        columnName: "p3esc",
        columnpredefind: "1",
        field: 'p3esc',
        header: 'PREFERENCE 3',
        columnpclass: "tech-col-10",
        headerId: "9",
        inputType: "4",
      },
      {
        columnName: "p4esc",
        columnpredefind: "1",
        field: 'p4esc',
        header: 'PREFERENCE 4',
        columnpclass: "tech-col-11",
        headerId: "10",
        inputType: "4",
      },
      {
        columnName: "p5esc",
        columnpredefind: "1",
        field: 'p5esc',
        header: 'PREFERENCE 5',
        columnpclass: "tech-col-12",
        headerId: "11",
        inputType: "4",
      },
      {
        columnName: "isActiveText",
        columnpredefind: "1",
        field: 'isActiveText',
        header: 'STATUS',
        columnpclass: "tech-col-13",
        headerId: "12",
        inputType: "2",
      },
    ];
  }
  getTechSupportPriorityData(){

    this.setHeaderColumns();
    this.publishbutton = false;
    this.addednewProduct = false;
    this.apiUrl.techsupportNewButton = this.addednewProduct;
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
    this.landingpageServiceApi.techSupportPriorityDataList(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.items;
        this.itemTotal = response.total;
        if(this.itemTotal>0){          
          this.ItemEmpty = false;
          if(this.itemOffset == 0){
            this.itemLength = 0;
            this.productsList = [];
            this.priorityLists = [];
            this.statusLists = [];
          }
          for (let i in resultData) {
            if(resultData[i].isActive == '1'){
              resultData[i].isActiveText = 'Enabled';
            }
            else{
              resultData[i].isActiveText = 'Disabled';
            }
            resultData[i].workstreamName=[];
            let workstreamName = [];
            if(resultData[i].workstreamId.length>0){
            for(let ws of this.workstreamListsOptions) {
              for(let pws of resultData[i].workstreamId) {
                if(ws.id == pws){
                  console.log(ws.name);
                  workstreamName.push(ws.name);
                }
              }
            }
            resultData[i].workstreamName=(workstreamName);
            console.log(resultData[i].workstreamName);
            }

            let recentUpdatedInfo = response.recentUpdatedInfo != '' ? response.recentUpdatedInfo : '';
            if(recentUpdatedInfo){
              let editdate1 = recentUpdatedInfo['updatedOn'] != '' ? recentUpdatedInfo['updatedOn'] : '';
              let editdate2 = moment.utc(editdate1).toDate();
              this.notesUpdatedOnDate = moment(editdate2).local().format('MMM DD, YYYY h:mm A');
              this.notesUpdatedByName = recentUpdatedInfo['userName'] != '' ? recentUpdatedInfo['userName'] : '';
            }            

            if(resultData[i].optionType < 1){
              resultData[i].optionType = '4';
              resultData[i].optionTypeName = 'Any';
            }

            resultData[i].optionValue=[];
            resultData[i].optionValueId=[];
            let optionValue = [];
            let optionValueId = [];
            if(resultData[i].optionValueName){
              for(let opvn of resultData[i].optionValueName) {
                optionValue.push(opvn.name);
                optionValueId.push(opvn.id);
              }
              resultData[i].optionValueId=(optionValueId);
              resultData[i].optionValue=(optionValue);
            }

            // keyword
            resultData[i].keyWordsPriorityName=[];
            resultData[i].keyWordsPriorityId=[];
            let keyWordsPriorityName = [];
            let keyWordsPriorityId = [];
            if(resultData[i].keyWordsPriority){
              if(resultData[i].keyWordsPriority.length>0){
                for(let kp of resultData[i].keyWordsPriority) {
                  keyWordsPriorityName.push(kp.name);
                  keyWordsPriorityId.push(kp.id);
                }
                resultData[i].keyWordsPriorityId=(keyWordsPriorityId);
                resultData[i].keyWordsPriorityName=(keyWordsPriorityName);
              }
              else{
                keyWordsPriorityName.push('Any');
                resultData[i].keyWordsPriorityName=(keyWordsPriorityName);
              }
            }

            resultData[i].optionNameListsArr=[];
            resultData[i].optionIdListsArr=[];
            for(let ws of this.workstreamListsOptions) {
              let optionNameLists = [];
              let optionIdLists = [];
              for(let pws of resultData[i].workstreamId) {
                if(ws.id == pws){
                  let options = ws.options
                  for(let opt of options) {
                    optionNameLists.push(opt.name);
                    optionIdLists.push(opt.id);
                  }
                  resultData[i].optionNameListsArr=optionNameLists;
                  resultData[i].optionIdListsArr=optionIdLists;
                }
              }
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
          this.displayNoRecords = (this.apiData['searchKey'] =='' ) ? '1' : '2';
        }
        for (let i in this.productsList) {
          let j = parseInt(i)+1;
          this.priorityLists.push({id: j, name: j});
        }
        this.statusLists = [
          { id : '1',name: 'Enabled'},
          { id : '0',name: 'Disabled'}
        ];

      }

      setTimeout(() => {
        this.loadDataEvent=false;
        this.loading = false;
        this.initLoading = false;
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
    console.log( event.value);
    console.log(productsLis);
    console.log(hId);
    console.log(colName);
    console.log(index);
    let columnValue = '';
    this.primetablerowdata = productsLis;
    setTimeout(() => {
      hId = parseInt(hId);
      let elss=document.getElementById('product_options'+productsLis.id+''+hId);
      var selector = "td";
      var parent = this.findParentBySelector(elss, selector);
      this.renderer.addClass(parent, 'selectedItemp-table-light');
      this.publishbutton=true;
    }, 100);

    if(colName == 'isActiveText'){
      this.productsList[index].isActive =  event.value.id;
      this.productsList[index].isActiveText =  event.value.name;
    }
    if(colName == 'displayPriority'){
      this.productsList[index].displayPriority =  event.value.id;
    }
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

    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsLis.id);
        if(studentObj)
        {
          if(colName=='displayPriority')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).displayPriority = this.productsList[index].displayPriority;
          }
          if(colName == 'optionTypeName'){
            this.escalationMatrix_array.find(item => item.id == productsLis.id).optionType = this.productsList[index].optionType;
            if(this.productsList[index].optionType == '4'){
              this.productsList[index].optionValue = [];
              this.productsList[index].optionValueId = [];
              this.productsList[index].optionValueName = [];
              this.escalationMatrix_array.find(item => item.id == productsLis.id).optionValueName = JSON.stringify(this.productsList[index].optionValueName);
            }
          }
          if(colName == 'isActiveText'){
            this.escalationMatrix_array.find(item => item.id == productsLis.id).isActive = this.productsList[index].isActive;
          }

        }
        else
        {
          if(colName=='displayPriority'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "displayPriority":this.productsList[index].displayPriority
            });
          }
          if(colName=='optionTypeName'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "optionType":this.productsList[index].optionType
            });
            if(this.productsList[index].optionType == '4'){
              this.escalationMatrix_array.push({
                "id":productsLis.id,
                "optionValueName":JSON.stringify(this.productsList[index].optionValueName)
              });
            }
          }
          if(colName=='isActiveText'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "isActive":this.productsList[index].isActive
            });
          }
        }
      }
    }
    else
    {
      if(colName=='displayPriority'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "displayPriority":this.productsList[index].displayPriority
        });
      }
      if(colName=='optionTypeName'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "optionType":this.productsList[index].optionType,
        });
        if(this.productsList[index].optionType == '4'){
          this.escalationMatrix_array.push({
            "id":productsLis.id,
            "optionValueName":JSON.stringify(this.productsList[index].optionValueName)
          });
        }
      }
      if(colName=='isActiveText'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "isActive":this.productsList[index].isActive
        });
      }
    }
    console.log(this.escalationMatrix_array);
  }

  managePreference(action,productsList,fieldName,hId){
    let userListArr=[];
    console.log(fieldName);
    console.log(productsList);
    this.primetablerowdata=productsList;
    let users = [];
    let preferenceUsers = [];
    console.log(this.primetablerowdata.p1esc);
    let preferenceTitle = '';
    if(fieldName=='p1esc')
    {
      preferenceTitle = "Preference 1";
      for(let usrs in this.primetablerowdata.p1esc){
        users.push({
          id: (!this.primetablerowdata.p1esc[usrs]?.userId) ? this.primetablerowdata.p1esc[usrs].p1escLoginId :this.primetablerowdata.p1esc[usrs].userId,
          name: (!this.primetablerowdata.p1esc[usrs]?.email) ? this.primetablerowdata.p1esc[usrs].p1esc: this.primetablerowdata.p1esc[usrs].email,
          img: (!this.primetablerowdata.p1esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.p1esc[usrs].profileImg,
          role: (!this.primetablerowdata.p1esc[usrs]?.role) ? this.primetablerowdata.p1esc[usrs].p1esc: this.primetablerowdata.p1esc[usrs].role,
        });
      }
    }
    if(fieldName=='p2esc')
    {
      preferenceTitle = "Preference 2";
      for(let usrs in this.primetablerowdata.p2esc){
        users.push({
          id: (!this.primetablerowdata.p2esc[usrs]?.userId) ? this.primetablerowdata.p2esc[usrs].p2escLoginId :this.primetablerowdata.p2esc[usrs].userId,
          name: (!this.primetablerowdata.p2esc[usrs]?.email) ? this.primetablerowdata.p2esc[usrs].p2esc: this.primetablerowdata.p2esc[usrs].email,
          img: (!this.primetablerowdata.p2esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.p2esc[usrs].profileImg,
          role: (!this.primetablerowdata.p2esc[usrs]?.role) ? this.primetablerowdata.p2esc[usrs].L2esc: this.primetablerowdata.p2esc[usrs].role,
        });
      }
    }
    if(fieldName=='p3esc')
    {
      preferenceTitle = "Preference 3";
      for(let usrs in this.primetablerowdata.p3esc){
        users.push({
          id: (!this.primetablerowdata.p3esc[usrs]?.userId) ? this.primetablerowdata.p3esc[usrs].p3escLoginId :this.primetablerowdata.p3esc[usrs].userId,
          name: (!this.primetablerowdata.p3esc[usrs]?.email) ? this.primetablerowdata.p3esc[usrs].p3esc: this.primetablerowdata.p3esc[usrs].email,
          img: (!this.primetablerowdata.p3esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.p3esc[usrs].profileImg,
          role: (!this.primetablerowdata.p3esc[usrs]?.role) ? this.primetablerowdata.p3esc[usrs].p3esc: this.primetablerowdata.p3esc[usrs].role,
        });
      }
    }
    if(fieldName=='p4esc')
    {
      preferenceTitle = "Preference 4";
      for(let usrs in this.primetablerowdata.p4esc){
        users.push({
          id: (!this.primetablerowdata.p4esc[usrs]?.userId) ? this.primetablerowdata.p4esc[usrs].p4escLoginId :this.primetablerowdata.p4esc[usrs].userId,
          name: (!this.primetablerowdata.p4esc[usrs]?.email) ? this.primetablerowdata.p4esc[usrs].p4esc: this.primetablerowdata.p4esc[usrs].email,
          img: (!this.primetablerowdata.p4esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.p4esc[usrs].profileImg,
          role: (!this.primetablerowdata.p4esc[usrs]?.role) ? this.primetablerowdata.p4esc[usrs].p4esc: this.primetablerowdata.p4esc[usrs].role,
        });
      }
    }
    if(fieldName=='p5esc')
    {
      preferenceTitle = "Preference 5";
      for(let usrs in this.primetablerowdata.p5esc){
        users.push({
          id: (!this.primetablerowdata.p5esc[usrs]?.userId) ? this.primetablerowdata.p5esc[usrs].p5esc :this.primetablerowdata.p5esc[usrs].userId,
          name: (!this.primetablerowdata.p5esc[usrs]?.email) ? this.primetablerowdata.p5esc[usrs].p5esc: this.primetablerowdata.p5esc[usrs].email,
          img: (!this.primetablerowdata.p5esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.p5esc[usrs].profileImg,
          role: (!this.primetablerowdata.p5esc[usrs]?.role) ? this.primetablerowdata.p5esc[usrs].p5esc: this.primetablerowdata.p5esc[usrs].role,
        });
      }
    }
    console.log(users);
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      teamMemberId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      type: '2',
      teamId: productsList.teamId
    };


    if(this.primetablerowdata.p1esc!=undefined && fieldName!='p1esc'){
      if(this.primetablerowdata.p1esc.length>0){
        for(let usrs in this.primetablerowdata.p1esc){
          preferenceUsers.push(this.primetablerowdata.p1esc[usrs]?.userId)
        }
      }
    }
    if(this.primetablerowdata.p2esc!=undefined && fieldName!='p2esc'){
      if(this.primetablerowdata.p2esc.length>0){
        for(let usrs in this.primetablerowdata.p2esc){
          preferenceUsers.push(this.primetablerowdata.p2esc[usrs]?.userId)
        }
      }
    }
    if(this.primetablerowdata.p3esc!=undefined && fieldName!='p3esc'){
      if(this.primetablerowdata.p3esc.length>0){
        for(let usrs in this.primetablerowdata.p3esc){
          preferenceUsers.push(this.primetablerowdata.p3esc[usrs]?.userId)
        }
      }
    }
    if(this.primetablerowdata.p4esc!=undefined && fieldName!='p4esc'){
      if(this.primetablerowdata.p4esc.length>0){
        for(let usrs in this.primetablerowdata.p4esc){
          preferenceUsers.push(this.primetablerowdata.p4esc[usrs]?.userId)
        }
      }
    }
    if(this.primetablerowdata.p5esc!=undefined && fieldName!='p5esc'){
      if(this.primetablerowdata.p5esc.length>0){
        for(let usrs in this.primetablerowdata.p5esc){
          preferenceUsers.push(this.primetablerowdata.p5esc[usrs]?.userId)
        }
      }
    }

    console.log(preferenceUsers);
    apiData['preferenceUsers'] = preferenceUsers;
    console.log(apiData['preferenceUsers'] )

    switch (action) {
      case 'new':
        const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = "techsupportrules";
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.preferenceTitle = preferenceTitle;
        modalRef.componentInstance.height = this.innerHeight;
        modalRef.componentInstance.action = action;
        modalRef.componentInstance.selectedUsers = users;
        modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
          console.log(receivedService);
          if(receivedService.empty == true) {
            modalRef.dismiss('Cross click');
            return false;
          }
          if(!receivedService.empty){
            this.recentSelectionParam = false;
            this.recentSelectionParamValue = '';
            if(fieldName=='p1esc')
            {
              this.primetablerowdata.p1esc=[];
            }
            if(fieldName=='p2esc')
            {
              this.primetablerowdata.p2esc=[];
            }
            if(fieldName=='p3esc')
            {
              this.primetablerowdata.p3esc=[];
            }
            if(fieldName=='p4esc')
            {
              this.primetablerowdata.p4esc=[];
            }
            if(fieldName=='p5esc')
            {
              this.primetablerowdata.p5esc=[];
            }
          }
          this.publishbutton = true;
          for (let usrs in receivedService) {
            if (fieldName == 'p1esc') {
              if (receivedService[usrs].name) {
                if (this.primetablerowdata.p1esc.length > 0 ) {
                  for (let userIdp in this.primetablerowdata.p1esc) {
                    let studentObj = this.primetablerowdata.p1esc.find(t => t.userId == receivedService[usrs].id);
                    if (studentObj) { }
                    else {
                      this.primetablerowdata.p1esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });

                    }
                  }
               }
               else{
                this.primetablerowdata.p1esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
              }

              }
            }

            console.log(productsList);

            if (fieldName == 'p2esc') {
              if (receivedService[usrs].name) {
                if (this.primetablerowdata.p2esc.length > 0 ) {
                  for (let userIdp in this.primetablerowdata.p2esc) {
                    let studentObj = this.primetablerowdata.p2esc.find(t => t.userId == receivedService[usrs].id);
                    if (studentObj) { }
                    else {

                        this.primetablerowdata.p2esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });

                    }
                  }
                }
                else{
                  this.primetablerowdata.p2esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }

              }
            }
            if (fieldName == 'p3esc') {
              if (receivedService[usrs].name) {
                if (this.primetablerowdata.p3esc.length > 0 ) {
                  for (let userIdp in this.primetablerowdata.p3esc) {
                    let studentObj = this.primetablerowdata.p3esc.find(t => t.userId == receivedService[usrs].id);
                    if (studentObj) { }
                    else {

                        this.primetablerowdata.p3esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });

                    }
                  }
                }
                else{
                  this.primetablerowdata.p3esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }

              }
            }
            if (fieldName == 'p4esc') {
              if (receivedService[usrs].name) {
                if (this.primetablerowdata.p4esc.length > 0) {
                  for (let userIdp in this.primetablerowdata.p4esc) {
                    let studentObj = this.primetablerowdata.p4esc.find(t => t.userId == receivedService[usrs].id);
                    if (studentObj) { }
                    else {

                        this.primetablerowdata.p4esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });

                    }
                  }
                }
                else{
                  this.primetablerowdata.p4esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
              }
            }
            if (fieldName == 'p5esc') {
              if (receivedService[usrs].name) {
                if (this.primetablerowdata.p5esc.length > 0 ) {
                  for (let userIdp in this.primetablerowdata.p5esc) {
                    let studentObj = this.primetablerowdata.p5esc.find(t => t.userId == receivedService[usrs].id);
                    if (studentObj) { }
                    else {

                        this.primetablerowdata.p5esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });

                    }
                  }
                }
                else{
                  this.primetablerowdata.p5esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }

              }
            }

            //if(!receivedService.empty){
            userListArr.push(receivedService[usrs].id)
            //alert((userListArr));
            this.publishbutton=true;

            let elss = document.getElementById('product_options'+productsList.id+''+hId);
            //document.querySelector('.selectedItemp-table-light')?.classList.remove('selectedItemp-table-light')
            console.log(elss);
            if(elss != null){
              var selector = "td";
              var parent = this.findParentBySelector(elss, selector);
              this.renderer.addClass(parent, 'selectedItemp-table-light');
            }

            //}
          }


          if(this.escalationMatrix_array.length>0)
  {
  for (let wsd in this.escalationMatrix_array)
  {
    let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsList.id);
    if(studentObj)
    {
      if(fieldName=='p1esc')
      {
        this.escalationMatrix_array.find(item => item.id == productsList.id).p1esc = JSON.stringify(userListArr);
      }
      if(fieldName=='p2esc')
      {
        this.escalationMatrix_array.find(item => item.id == productsList.id).p2esc = JSON.stringify(userListArr);
      }
      if(fieldName=='p3esc')
      {
        this.escalationMatrix_array.find(item => item.id == productsList.id).p3esc = JSON.stringify(userListArr);
      }
      if(fieldName=='p4esc')
      {
        this.escalationMatrix_array.find(item => item.id == productsList.id).p4esc = JSON.stringify(userListArr);
      }
      if(fieldName=='p5esc')
      {
        this.escalationMatrix_array.find(item => item.id == productsList.id).p5esc = JSON.stringify(userListArr);
      }

      this.recentSelectionParamValue = JSON.stringify(userListArr);


    }
    else
    {
      this.escalationMatrix_array.push({
        "teamId":productsList.teamId,
        "id":productsList.id,
        [fieldName]:JSON.stringify(userListArr)
      });
      this.recentSelectionParam = true;
      this.recentSelectionParamValue = JSON.stringify(userListArr);
    }
  }
  }
  else
  {
    this.escalationMatrix_array.push({
      "teamId":productsList.teamId,
      "id":productsList.id,
      [fieldName]:JSON.stringify(userListArr)
    });
    this.recentSelectionParam = true;
    this.recentSelectionParamValue = JSON.stringify(userListArr);
  }

    console.log(this.escalationMatrix_array);

          modalRef.dismiss('Cross click');
        });
        break;
      }
    }

  manageOption(eventData,prodList, hId, colName,index='') {
    console.log( eventData);
    console.log(prodList);
    console.log(hId);
    console.log(colName);
    console.log(this.productsList[index]);
    console.log(prodList);
    console.log(hId);
    console.log(colName);

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
    if(colName == 'teamName'){
      let teamIdArr = [];
      let teamNameArr = [];

      teamIdArr.push(this.productsList[index].teamId);
      teamNameArr.push(this.productsList[index].teamId);

      apiData['teamId'] = this.productsList[index].teamId;
      apiData['teamMemberId'] = this.apiData["userId"];

      apiData['type'] = '1';
      url = '/forum/TechSupportCommonAPIs';
      title = "Team Name";
      inputData = {
        baseApiUrl: this.collabticApi,
        apiUrl: this.collabticApi+"/"+url,
        field: 'team',
        selectionType: "single",
        filteredItems: teamIdArr,
        filteredLists: teamNameArr,
        actionApiName: "",
        actionQueryValues: "",
        title: title
      };
    }
    if(colName == 'workstreamName'){
      apiData['type'] = '1';
      apiData['contentTypeId'] = '2';
      url = '/forum/GetworkstreamsList';
      title = "Workstreams";
      inputData = {
        baseApiUrl: this.collabticApi,
        apiUrl: this.collabticApi+"/"+url,
        field: 'workstream',
        selectionType: "multiple",
        filteredItems: this.productsList[index].workstreamId,
        filteredLists: this.productsList[index].workstreamName,
        actionApiName: "",
        actionQueryValues: "",
        title: title
      };

    }
    if(colName=='keyWordsPriorityName'){
      url = '/forum/getKeyWordPriority';
      title = "Keyword";
      apiData['groupId'] = JSON.stringify(this.productsList[index].workstreamId);
      inputData = {
        baseApiUrl: this.collabticApi,
        apiUrl: this.collabticApi+"/"+url,
        field: 'keyword',
        selectionType: "multiple",
        filteredItems: this.productsList[index].keyWordsPriorityId,
        filteredLists: this.productsList[index].keyWordsPriorityName,
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
    if(colName == 'teamName'){
      let teamIdArr = [];
      let teamNameArr = [];

      teamIdArr.push(this.productsList[index].teamId);
      teamNameArr.push(this.productsList[index].teamId);

      modalRef.componentInstance.filteredTags = teamIdArr;
      modalRef.componentInstance.filteredLists = teamNameArr;
    }
    else if(colName == 'workstreamName'){
      modalRef.componentInstance.filteredTags = this.productsList[index].workstreamId;
      modalRef.componentInstance.filteredLists = this.productsList[index].workstreamName;
    }
    else if(colName == 'keyWordsPriorityName'){
      modalRef.componentInstance.filteredTags = this.productsList[index].keyWordsPriorityId;
      modalRef.componentInstance.filteredLists = this.productsList[index].keyWordsPriorityName;
      modalRef.componentInstance.accessAction = true;
    }
    else{
      modalRef.componentInstance.filteredTags = this.productsList[index].optionValueId;
      modalRef.componentInstance.filteredLists = this.productsList[index].optionValue;
    }
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {

      let tagItems = receivedService;
      console.log(tagItems)
      let idArr = [];
      let idNameArr = [];
      let nameArr = [];
      if(tagItems.length>0){

        if(colName == 'teamName'){
          if(this.productsList[index].teamId != tagItems[0].id){
            this.productsList[index].p1esc = [];
            this.productsList[index].p2esc = [];
            this.productsList[index].p3esc = [];
            this.productsList[index].p4esc = [];
            this.productsList[index].p5esc = [];
          }
          this.productsList[index].teamId = tagItems[0].id;
          this.productsList[index].teamName = tagItems[0].name;
        }
        else{
          for (let t in tagItems) {
            nameArr.push(tagItems[t].name);
            idArr.push(tagItems[t].id);
            idNameArr.push({id:tagItems[t].id, name: tagItems[t].name});
            if(colName == 'workstreamName'){
              this.productsList[index].workstreamId = idArr;
              this.productsList[index].workstreamName = nameArr;
            }
            if(colName=='optionValue'){
              this.productsList[index].optionValueId=idArr;
              this.productsList[index].optionValue=nameArr;
              this.productsList[index].optionValueName=idNameArr;
            }
            if(colName=='keyWordsPriorityName'){
              this.productsList[index].keyWordsPriorityId=idArr;
              this.productsList[index].keyWordsPriorityName=nameArr;
              this.productsList[index].keyWordsPriority=idNameArr;
            }
          }
        }
      }
      else{
        if(colName == 'workstreamName'){
          this.productsList[index].workstreamId = idArr;
          this.productsList[index].workstreamName = nameArr;
        }
        if(colName=='optionValue'){
          this.productsList[index].optionValueId=idArr;
          this.productsList[index].optionValue=nameArr;
          this.productsList[index].optionValueName=idNameArr;
        }
        if(colName=='keyWordsPriorityName'){
          this.productsList[index].keyWordsPriorityId=idArr;
          this.productsList[index].keyWordsPriorityName=nameArr;
          this.productsList[index].keyWordsPriority=idNameArr;
        }
      }

    console.log(prodList);
    console.log(this.productsList[index]);
    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {

        //this.escalationMatrix_array[wsd] = this.productsList[index];
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==prodList.id);
        if(studentObj)
        {

          if(colName == 'teamName')
          {
            this.escalationMatrix_array.find(item => item.id == prodList.id).teamId = this.productsList[index].teamId;
          }
          if(colName == 'workstreamName')
          {
            this.escalationMatrix_array.find(item => item.id == prodList.id).workstreamId = JSON.stringify(this.productsList[index].workstreamId);
          }
          if(colName=='optionValue' )
          {
            this.escalationMatrix_array.find(item => item.id == prodList.id).optionValueName = JSON.stringify(this.productsList[index].optionValueName);
          }
          if(colName=='keyWordsPriorityName' )
          {
            this.escalationMatrix_array.find(item => item.id == prodList.id).keyWordsPriority = JSON.stringify(this.productsList[index].keyWordsPriority);
          }
        }
        else
        {
          if(colName=='teamName'){
            let emptyArr:any = [];
            emptyArr = JSON.stringify(emptyArr);
                this.escalationMatrix_array.push({
                  "id":prodList.id,
                  "teamId":prodList.teamId,
                  "p1esc" : emptyArr,
                  "p2esc" : emptyArr,
                  "p3esc" : emptyArr,
                  "p4esc" : emptyArr,
                  "pesc" : emptyArr,
                });
          }
          if(colName=='workstreamName'){
            if(prodList.id == ''){
              this.escalationMatrix_array.push({
                "id":prodList.id,
                "workstreamId":JSON.stringify(this.productsList[index].workstreamId),
                "isActive":this.productsList[index].isActive,
                "teamId":prodList[index].teamId,
                "displayPriority":this.productsList[index].displayPriority
              });
            }
            else{
              this.escalationMatrix_array.push({
                "id":prodList.id,
                "workstreamId":JSON.stringify(this.productsList[index].workstreamId)
              });
            }
          }
          if(colName=='optionValue'){
            this.escalationMatrix_array.push({
              "id":prodList.id,
              "optionValueName":JSON.stringify(this.productsList[index].optionValueName)
            });
          }
          if(colName=='keyWordsPriorityName'){
            this.escalationMatrix_array.push({
              "id":prodList.id,
              "keyWordsPriority":JSON.stringify(this.productsList[index].keyWordsPriority)
            });
          }
        }

      }
    }
    else
    {
      if(colName=='teamName'){

        let emptyArr:any = [];
            emptyArr = JSON.stringify(emptyArr);
                this.escalationMatrix_array.push({
                  "id":prodList.id,
                  "teamId":prodList.teamId,
                  "p1esc" : emptyArr,
                  "p2esc" : emptyArr,
                  "p3esc" : emptyArr,
                  "p4esc" : emptyArr,
                  "pesc" : emptyArr,
                });

      }
      if(colName=='workstreamName'){
        if(prodList.id == ''){
          this.escalationMatrix_array.push({
            "id":prodList.id,
            "workstreamId":JSON.stringify(this.productsList[index].workstreamId),
            "isActive":this.productsList[index].isActive,
            "teamId":this.productsList[index].teamId,
            "displayPriority":this.productsList[index].displayPriority
          });
        }
        else{
          this.escalationMatrix_array.push({
            "id":prodList.id,
            "workstreamId":JSON.stringify(this.productsList[index].workstreamId),
           });
        }

        setTimeout(() => {
          for(let ws of this.workstreamListsOptions) {
            let optionNameLists = [];
            let optionIdLists = [];
            for(let pws of this.productsList[index].workstreamId) {
              if(ws.id == pws){
                let options = ws.options
                for(let opt of options) {
                  optionNameLists.push(opt.name);
                  optionIdLists.push(opt.id);
                }
                this.productsList[index].optionNameListsArr=optionNameLists;
                this.productsList[index].optionIdListsArr=optionIdLists;
              }
            }
          }
        }, 1);
      }
      if(colName=='optionValue'){
        this.escalationMatrix_array.push({
          "id":prodList.id,
          "optionValueName":JSON.stringify(this.productsList[index].optionValueName)
        });
      }
      if(colName=='keyWordsPriorityName'){
        this.escalationMatrix_array.push({
          "id":prodList.id,
          "keyWordsPriority":JSON.stringify(this.productsList[index].keyWordsPriority)
        });
      }
    }
    if(tagItems.length>0){
      if(this.productsList[index].teamId != tagItems[0].id){
        if(this.productsList[index].p1esc?.length==0){
          this.escalationMatrix_array.push({
            "id":prodList.id,
            "p1esc": ""
          });
        }
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

      console.log(this.productsList);
      console.log(this.escalationMatrix_array);

    }, 100);

  });


  }
  onRowReorder(event){

    console.log(event); //{dragIndex: 1, dropIndex: 2}
    console.log(this.productsList)

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

      console.log(event.target.scrollTop+event.target.offsetHeight +'--'+ event.target.scrollHeight);
      //console.log(this.itemTotal +'--'+ this.itemLength);

      if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
      //{
      //if(this.itemTotal > this.itemLength && this.loadDataEvent==false)
      {
      this.loading=true;
      this.loadDataEvent=true;
      this.getTechSupportPriorityData();
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
    this.apiUrl.techsupportNewButton = this.addednewProduct;
    this.productsList.unshift(
      { id: "", newmatrix: "0", workstreamId: [], workstreamName: [], displayPriority: "", optionType: "", optionTypeName: "", optionValue:[], optionValueId: [], optionValueName: [], keyWordsPriority: [], keyWordsPriorityId: [], keyWordsPriorityName:[], teamName: "",teamId: "", isActive : '', isActiveText : '' },
    );

    this.productsList[0].teamId = this.teamId;
    this.productsList[0].teamName = this.teamName;
    this.productsList[0].isActive = '1';
    this.productsList[0].isActiveText = 'Enable';
    this.productsList[0].displayPriority = this.productsList.length.toString();
    this.priorityLists=[];
    for (let i in this.productsList) {
      let j = parseInt(i)+1;
      this.priorityLists.push({id: j, name: j});
    }

    this.addnewrowbgcolor='addnewrow';
    this.publishbutton=true;
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
    });
  }

  getTeamList() {
    let type:any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('teamId', '');
    apiFormData.append('teamMemberId', this.apiData['userId']);
    apiFormData.append('access', 'thread');
    apiFormData.append('type', type);
    this.workstreamListsOptions = [];
    this.landingpageServiceApi.getTechSupportCommonAPIs(apiFormData).subscribe((response) => {
      let teamList = [];
      teamList = response.teamList;
      for (let i in teamList) {
        if(teamList[i].isDefault == "1"){
          this.teamId = teamList[i].id;
          this.teamName = teamList[i].name;
        }
      }
    });
  }

  saveAssignmentRules(event) {
    this.addnewrowbgcolor='addnewrow';
    if(this.escalationMatrix_array.length == 0){
      this.addnewrowbgcolor='addnewrowerror';
      return false;
    }
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        if(this.escalationMatrix_array[wsd].workstreamId==''){
          this.addnewrowbgcolor='addnewrowerror';
          return false;
        }
      }
    }
    console.log(this.escalationMatrix_array);
    //return false;
    if(this.escalationMatrix_array.length>0)
    {
    this.loading=true;
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
    matrixData.append('teamId', this.teamId);
    matrixData.append('params', apiData.params);
    //if(this.recentSelectionParam){
      matrixData.append('recentselection', this.recentSelectionParamValue);
    //}
    this.landingpageServiceApi.updateTechSupportPriorityData(matrixData).subscribe((response) => {

      console.log(this.escalationMatrix_array);
      //return false;

      if(response.status=='Success')
      {
        const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalMsgRef.componentInstance.msg = 'Assignment Rules Updated';
        setTimeout(() => {
          this.loading=true;
          this.publishbutton = false;
          this.addednewProduct = false;
          this.apiUrl.techsupportNewButton = this.addednewProduct;
          this.escalationMatrix_array = [];
          this.itemOffset = 0;
          this.getTechSupportPriorityData();
          modalMsgRef.dismiss('Cross click');
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
    this.addednewProduct = false;
    this.apiUrl.techsupportNewButton = this.addednewProduct;
    this.escalationMatrix_array = [];
    this.itemOffset = 0;
    this.getTechSupportPriorityData();
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
        this.getTechSupportPriorityData();
        this.headerData['searchKey'] = this.searchVal;
        this.headerFlag = true;
    }
  }

}
