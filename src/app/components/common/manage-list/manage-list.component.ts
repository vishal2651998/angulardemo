import { Component, OnInit, ElementRef, HostListener, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../../../services/common/common.service';
import { frameRange, countryCodes } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { KnowledgeArticleService } from "../../../services/knowledge-article/knowledge-article.service";
import { Router,NavigationEnd } from '@angular/router';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import * as moment from 'moment';

interface ActiveListdrop {
  name: string,
  code: string
}
@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.scss']
})
export class ManageListComponent implements OnInit {
  @ViewChild('focusInput') focusInput: ElementRef;
  productActiveListdrop: ActiveListdrop[];

  //selectedCity1: ActiveListdrop;
  //@Input() manageList: any;
  @Input() access: any;
  @Input() accessAction: boolean;
  @Input() apiData: any;
  @Input() inputData: any = [];
  @Input() saveButtonColor: any = '';
  @Input() checkboxColor: any = '';
  @Input() checkboxFlag: boolean = true;
  @Input() emissionType: string = "";
  @Input() gtsAccess: boolean = false;
  @Input() height: number;
  @Input() filteredTags: any;
  @Input() filteredLists: any;
  @Input() filteredErrorCodes: any;
  @Input() commonApiValue: any = '';
  @Input() filteredModelsCount: any = '';
  @Input() pageType: any = '';
  @Input() filterCall: boolean = false;
  @Input() set allowAdd(val: boolean) {
    if (val === false) {
      this.canAdd = false
    } else {
      this.canAdd = true;
    }
  };
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();

  public pageAccess: string = "";
  public initSelectedObj: any;
  public countryCode: any;
  public addAllow = true;
  canAdd = true;
  public countryCodeLists: any;
  public bodyElem;
  public selectedCity1;
  public bodyClass: string = "manage-list";
  public bodyClass1: string = "thread-detail";
  public title: string = "";
  public addTxt: string = "New";
  public itemCode: string = "";
  public itemVal: string = "";
  public manageList = [];
  public listItems = [];
  public selectionList = [];
  public actionItems = [];
  public newTagOptFlag: boolean = false;

  public clearFlag: boolean = false;
  public actionFlag: boolean = false;
  public activeListshow: boolean = true;
  public submitActionFlag: boolean = false;
  public listFlag: any = null;
  public itemAction: string = "";
  public successMsg: string = "Data saved";
  public success: boolean = false;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public empty: boolean = false;
  public searchNew: boolean = false;
  public listTotal: number;
  public ws = [];
  public vehicle: string = "";

  public techInfoFlag: boolean = false;
  public tagFlag: boolean = false;
  public vinFlag: boolean = false;
  public dynamicOptions: boolean = false;
  public errorCodeFlag: boolean = false;
  public lookUpdataFlag: boolean = false;
  public escloopUpFlag: boolean = false;
  public franchiesFlag: boolean = false;

  public partFlag: boolean = false;
  public searchVal: string = '';
  public searchValOld: string = '';
  public searchForm: FormGroup;
  public searchInputFlag: boolean = false;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public listAction: boolean = false;
  public assetPath: string = 'assets/images';
  public separatorPath: string = `${this.assetPath}/matrix/chevron.png`;
  public separatorImg: any;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';
  public countryAllFlag : boolean = false;
  public industryType: any = [];
  public inputMaxLen: any = '50';
  public offset: number = 0;
  public DisableText: string = 'Disable';
  public limit: number = 20;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public closeFlag: boolean = false;
  public selection: string = "multiple";
  public TVSDomain: boolean = false;
  public TVSIBDomain: boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public certificationLayout: boolean = false;
  public templateLayout: boolean = false;
  public startDateHead: string ='';
  public endDateHead: string ='';
  public cError: boolean = false;
  public cErrorMsg: string ='';
  modelIdDuplicate: boolean = false;
  oemDuplicate: boolean = false;
  responseData: any;
  specData: any;
  unitData: any;
  oemDuplicateCheckKey: any = [];
  neawlyCreatedIds = [];

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) { console.log(1);
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - (this.offset * 8);
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) { console.log(2);
      console.log(inHeight);
      console.log(totalHeight);
      console.log(this.scrollCallback);
      console.log(this.itemTotal);
      console.log(this.itemLength);
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) { 
        this.lazyLoading = true;
        this.scrollCallback = false;
        let i = -2;
        switch (this.access) {
          
          case 'Tags':
          case 'New Thread Tags':
            this.getTagInfo(i);
            break;
          case 'Error Codes':
          case 'New Thread Error Codes':
            this.errorCodeFlag = true;
            if(!this.filterCall) {
              this.getErrorCodes(i);
            }          
            break;
          case 'New Parts':
            this.partFlag = true;
            this.getData(i);
            break;
          case 'techinfo':
            this.techInfoFlag = true;
            this.getData(i);
            break;
          case 'mediaUpload':
            this.tagFlag = true;
            this.getData(i);
            break;
          case 'newthread':
          case 'newAdasSystem':  
            if (this.title != 'Frame Range') {
              if(this.inputData.field == 'category'){
                this.getCatgInfo(i);
              }
              else if(this.inputData.field == 'keyword'){
                this.getKeywordInfo(i);
              }              
              else if(this.inputData.field == 'folders'){
                this.getFolderInfo(i);
              }
              else if(this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-subscriptionPolicy' 
              || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' ){
                this.getDekraCommonInfo(i);
              }
              else{
                this.getData(i);
              }
            }
            break;
          case 'gtsDynamicOptions':
            //
            break;
          case 'Franchise':
            this.franchiesFlag = true;
            break
        }
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private scrollTopService: ScrollTopService,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private knowledgeArticleService: KnowledgeArticleService,
    private router: Router,
    private config: NgbModalConfig,
    private headquarterService: HeadquarterService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  ngOnInit() {
    let platformId = localStorage.getItem("platformId");
    let domainId = localStorage.getItem("domainId");
    this.TVSDomain = (platformId == '2' && domainId == '52') ? true : false;
    this.TVSIBDomain = (platformId == '2' && domainId == '97') ? true : false;
    this.industryType = this.commonApi.getIndustryType();
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.separatorImg = `<img src="${this.separatorPath}" />`;
    this.selectedCity1 = 'Active';
    this.countryCodeLists = countryCodes;
    this.countryCode = this.countryCodeLists[5];
    //console.log(this.countryCodeLists)
    // this.productActiveListdrop = [{label: 'Active', value: 'Active'},{label: 'In Active', value: 'In Active'}]
    this.productActiveListdrop = [
      { name: 'Active', code: 'NY' },
      { name: 'In Active', code: 'RM' }
    ];
    this.bodyElem.classList.add(this.bodyClass);
    let url = this.router.url.split('/');
    if(url[1] == 'documents') {
      if(document.body.classList.contains(this.bodyClass1)) {
        //document.body.classList.remove(this.bodyClass1);
      }
    }
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.listTotal = this.manageList.length;
    localStorage.removeItem('newItem');
    localStorage.removeItem('searchVal');

    this.searchValOld = "";
    this.selectionList = [];
      
    this.listAction = this.accessAction;
    this.height = this.height - 120;
    let index = 0;
    setTimeout(() => {
      this.searchInputFlag = true;
    }, 100);
    console.log(this.access, this.inputData, Object.keys(this.inputData).length, this.filteredTags, this.filteredLists)
    this.selection = (Object.keys(this.inputData).length > 0) ? this.inputData.selectionType : this.selection;
    this.pageAccess = (this.inputData.pageAccess) ? this.inputData.pageAccess : '';
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.tagFlag = true;
        this.title = (this.access == 'Tags' || this.access == 'Countries') ? this.access : this.inputData.title;
        if (this.access == 'New Thread Tags') {
          this.filteredTags = this.inputData.filteredItems;
          this.filteredLists = this.inputData.filteredLists;
        } else {
          this.filteredTags = (this.filteredTags.length == 0) ? [] : this.filteredTags;
        }
        console.log(this.filteredTags)

        this.getTagInfo(index);
        break;
      case 'Franchise':
          this.franchiesFlag = true;
          this.title = this.inputData.title;
          this.loading = false;
          this.listItems = [];  
          break;
      case 'Error Codes':
      case 'New Thread Error Codes':
        console.log(this.inputData)
        //alert(this.filterCall);
        this.title = (this.access == 'Error Codes') ? this.access : this.inputData.title;
        this.errorCodeFlag = true;
        if (this.access == 'New Thread Error Codes') {
          this.filteredErrorCodes = this.inputData.filteredItems;
          this.filteredLists = this.inputData.filteredLists;
        } else {
          this.filteredErrorCodes = (this.filteredErrorCodes.length == 0) ? [] : this.filteredErrorCodes;
          this.filteredLists = this.filteredErrorCodes;
        }
        if(!this.filterCall) {
          this.getErrorCodes(index);
        } else {
          this.manageList = this.inputData.errorCodes;
          this.itemTotal = this.manageList.length;
          this.itemLength = this.itemTotal;
          this.empty = (this.itemTotal == 0) ? true : this.empty;
          if(this.itemTotal > 0)
            this.initList('init', this.manageList);
        }        
        break;
      //for Product matrix
      case 'LookupDataPM':
        case 'Countries':
        this.title = this.apiData.lookupHeaderName;
        this.lookUpdataFlag = true;
        if(this.access=='Countries')
        {
          this.lookUpdataFlag = false;
          this.tagFlag = true;
          this.title = this.access;
        }

        this.getLookUpInfo(index);
        break;
      case 'newthread':
      case 'newAdasSystem':  
        this.title = this.inputData.title;
        this.tagFlag = (this.title == 'Recent VINs') ? false : true;
        this.vinFlag = (this.title == 'Recent VINs') ? true : false;
        this.filteredTags = (this.inputData.filteredItems == '') ? [] : this.inputData.filteredItems;
        this.filteredLists = (this.inputData.filteredLists == '') ? [] : this.inputData.filteredLists;
        console.log(this.filteredModelsCount);
        this.filteredModelsCount = (this.inputData.filteredModelsCount == '') ? [] : this.inputData.filteredModelsCount;
        this.inputMaxLen = (this.inputData.field == 'complaintCategory') ? '100' : this.inputMaxLen;
        if (this.title != 'Frame Range') {
          if(this.inputData.field == 'category'){
            this.getCatgInfo(index);
          }
          else if(this.inputData.field == 'keyword'){
            this.getKeywordInfo(index);
          }
          else if(this.inputData.field == 'folders'){
            this.getFolderInfo(index);
          }
          else if(this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy'
          || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification'){
            if(this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification'){
              this.certificationLayout = true;
              this.tagFlag = false;
            }
            if(this.inputData.field == 'dekra-template'){
              this.templateLayout = true;
              this.tagFlag = false;
            }
            if(this.inputData.field == 'dekra-subscription'){
              this.startDateHead = "Enrolled Date";
              this.endDateHead = "Renewal Date";
            }
            if(this.inputData.field == 'dekra-certification'){
              this.startDateHead = "Certification Date";
              this.endDateHead = "Expiration Date";
            }
            this.getDekraCommonInfo(index);
          }
          else{
            if(this.inputData.field == 'dekra-template'){
              this.templateLayout = true;
              this.tagFlag = false;
            }
            this.getData(index);
          }
        } else {
          this.manageList = frameRange;
          this.initList('init', this.manageList);
        }
        break;
      case 'gtsDynamicOptions':
        this.title = this.inputData.title;
        this.dynamicOptions = true;
        this.getData(index);
        break;
      case 'Error Codes':
      case 'New Parts':
        console.log(this.inputData)
        this.title = this.inputData.title;
        this.partFlag = true;
        this.filteredErrorCodes = this.inputData.filteredItems;
        this.filteredLists = this.inputData.filteredLists;
        this.getData(index);
        break;
      case 'techinfo':
        this.title = this.inputData.title;
        this.techInfoFlag = true;
        this.filteredTags = this.inputData.filteredItems;
        this.filteredLists = this.inputData.filteredLists;
        this.getData(index);
        break;
      case 'PartType':
      case 'PartAssembly':
      case 'PartSystem':
        this.tagFlag = true;
        this.title = this.inputData.title;
        this.getData(index);
        break;
      case 'mediaUpload':
        this.tagFlag = true;
        this.title = this.inputData.title;
        this.filteredTags = this.inputData.filteredItems;
        this.filteredLists = this.inputData.filteredLists;
        this.getData(index);
        break;
    }
  
    // used remove selection(button save enable)
    let initSelectedObj = {
      length : this.filteredTags.length
    }
    this.initSelectedObj = initSelectedObj;

    setTimeout(() => {
      //this.initList('init', this.manageList);
    }, 500);
  }

  // Get Catg Info
  getCatgInfo(index) {
    console.log(index)
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      /*let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        searchKey: this.searchVal,
        offset: this.offset,
        limit: this.limit
      }*/

      this.apiData["offset"] = this.offset;
      this.apiData["limit"] = this.limit;

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiData["apiKey"]);
      apiFormData.append("domainId", this.apiData["domainId"]);
      apiFormData.append("countryId", this.apiData["countryId"]);
      apiFormData.append("userId", this.apiData["userId"]);
      apiFormData.append("searchKey", this.searchVal);
      apiFormData.append("limit", this.apiData["limit"]);
      apiFormData.append("offset", this.apiData["offset"]);
      apiFormData.append("isNew", "1");

      this.knowledgeArticleService.getAllKnowledgeArticleCategory(apiFormData).subscribe((response) => {
        let resultData = response;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = response.category;
        for (let res in list) {
          this.manageList.push({
            id: list[res].id,
            name: list[res].categoryName,
          });
        }
        let initText = (index == 0) ? 'init' : 'get';

        //console.log(this.selectionList);
        if (index <= 0) {
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += itemListLen;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          this.manageItem('new', 0);
        }
      });
    }
  }

  getDekraCommonInfo(index){
    console.log(index)  
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      /*let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        searchKey: this.searchVal,
        offset: this.offset,
        limit: this.limit
      }*/

      this.apiData["offset"] = this.offset;
      this.apiData["limit"] = this.limit;

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiData["apiKey"]);
      apiFormData.append("domainId", this.apiData["domainId"]);
      apiFormData.append("countryId", this.apiData["countryId"]);
      apiFormData.append("userId", this.apiData["userId"]);
      apiFormData.append("networkId", this.apiData["networkId"]);
      apiFormData.append("type", this.apiData["type"]);
      apiFormData.append("label", this.apiData["label"] ? this.apiData["label"] : '');
      apiFormData.append("searchKey", this.searchVal);
      apiFormData.append("limit", this.apiData["limit"]);
      apiFormData.append("offset", this.apiData["offset"]);
      if(this.apiData["vendorId"]){
        apiFormData.append("vendorId", this.apiData["vendorId"]);
      }
      if(this.apiData["modelId"]){
        apiFormData.append("modelId", this.apiData["modelId"]);
      }
      this.headquarterService.getCommonList(apiFormData).subscribe((response: any) => {
        console.log(response);
        // if(this.title == "Spec Name"){
        //   response = {items:this.specData};
        // }
        // if(this.title == "Unit"){
        //   response = {items:this.unitData};
        // }

        let resultData = response;
        this.responseData  = resultData
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = response.items;
        for (let res in list) {
          this.manageList.push({
            id: list[res].id,
            name: list[res].name,
          });
        }
        let initText = (index == 0) ? 'init' : 'get';

        //console.log(this.selectionList);
        if (index <= 0) {
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += itemListLen;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          this.manageItem('new', 0);
        }
      });
    }
  }

  // Get Catg Info
  getKeywordInfo(index) {
    console.log(index)
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      /*let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        searchKey: this.searchVal,
        offset: this.offset,
        limit: this.limit
      }*/

      this.apiData["offset"] = this.offset;
      this.apiData["limit"] = this.limit;

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiData["apiKey"]);
      apiFormData.append("domainId", this.apiData["domainId"]);
      apiFormData.append("countryId", this.apiData["countryId"]);
      apiFormData.append("userId", this.apiData["userId"]);
      apiFormData.append("searchKey", this.searchVal);
      apiFormData.append("limit", this.apiData["limit"]);
      apiFormData.append("offset", this.apiData["offset"]);
      apiFormData.append("groupId", this.apiData["groupId"]);
      apiFormData.append("isNew", "1");

      this.commonApi.getKeyWordPriority(apiFormData).subscribe((response) => {
        let resultData = response;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = response.items;
        for (let res in list) {
          this.manageList.push({
            id: list[res].id,
            name: list[res].name,
          });
        }
        let initText = (index == 0) ? 'init' : 'get';

        //console.log(this.selectionList);
        if (index <= 0) {
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += itemListLen;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          this.manageItem('new', 0);
        }
      });
    }
  }
   // Get Catg Info
   getFolderInfo(index) {
    console.log(index)
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      /*let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        searchKey: this.searchVal,
        offset: this.offset,
        limit: this.limit
      }*/

      this.apiData["offset"] = this.offset;
      this.apiData["limit"] = this.limit;

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiData["apiKey"]);
      apiFormData.append("domainId", this.apiData["domainId"]);
      apiFormData.append("countryId", this.apiData["countryId"]);
      apiFormData.append("userId", this.apiData["userId"]);
      apiFormData.append("searchKey", this.searchVal);
      apiFormData.append("limit", this.apiData["limit"]);
      apiFormData.append("offset", this.apiData["offset"]);
      apiFormData.append("workstreamsList", this.apiData["workstreamsList"]);
      apiFormData.append("isNew", "1");
      apiFormData.append("createNew", "1");

      this.authenticationService.apiGetDocumentFolder(apiFormData).subscribe((response) => {
        let resultData = response.data;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = response.data.items;
        for (let res in list) {
          this.manageList.push({
            id: list[res].id,
            name: list[res].name,
          });
        }
        let initText = (index == 0) ? 'init' : 'get';

        //console.log(this.selectionList);
        if (index <= 0) {
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += itemListLen;
            this.offset += this.limit;
            console.log(this.itemTotal,this.itemLength,this.offset);
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          this.manageItem('new', 0);
        }
      });
    }
  }
  // Get Tag Info
  getTagInfo(index) {
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        thread_type: this.apiData.threadType,
        groupId: this.apiData.groupId,
        searchKey: this.searchVal,
        offset: this.offset,
        limit: this.limit
      }
      let callAbleUrl = this.commonApi.getTagList(apiData);
      if (this.pageType == 'market-place') {
        callAbleUrl = this.commonApi.getKeywordsList(apiData);
      }

      callAbleUrl.subscribe((response) => {
        console.log("response: ", response);
        let resultData = response.data;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = resultData.tags;
        for (let res in list) {
          this.manageList.push(list[res]);
        }
        let initText = (index == 0) ? 'init' : 'get';
        
        if (index <= 0) {
          let itemListLen = this.manageList.length;
          console.log(this.manageList.length);
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength = itemListLen;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          this.manageTag('new', 0);
        }
      });
    }
  }

  getLookUpInfo(index) {
let fromPPFR=0;
    if(this.access=='Countries')
    {
      this.apiData.lookUpdataId='29';
      fromPPFR=1;
    }
    this.loading = true;
    let apiData = {
      apiKey: this.apiData.apiKey,
      domainId: this.apiData.domainId,
      countryId: this.apiData.countryId,
      userId: this.apiData.userId,
      lookUpdataId: this.apiData.lookUpdataId,
      fromPPFR: fromPPFR,
      searchKey: this.searchVal,
      isInActive: this.activeListshow,
      offset: this.offset,
      limit: this.limit
    }

    this.commonApi.getLoopUpDataList(apiData).subscribe((response) => {
      // let resultData = response.data;
      this.manageList = [];
      this.manageList = response.loopUpData;

      let initText = (index == 0) ? 'init' : 'get';
      this.initList(initText, this.manageList);
      //console.log(this.selectionList);
      let itemListLen1 = this.manageList.length;
      this.empty = (itemListLen1 < 1) ? true : false;
      if (this.empty) {
        this.successMsg = response.result;
      }
      if (index < 0) {
        let itemListLen = this.manageList.length;
        this.empty = (itemListLen < 1) ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        }
      }

      if (this.searchNew) {
        this.manageTag('new', 0);
      }
    });
  }


  getEscLookUpInfo(index) {
    this.loading = true;
    let apiData = {
      apiKey: this.apiData.apiKey,
      domainId: this.apiData.domainId,
      countryId: this.apiData.countryId,
      userId: this.apiData.userId,
      commonApiValue: this.apiData.commonApiValue,
      searchKey: this.searchVal,

      offset: this.offset,
      limit: this.limit
    }

    this.commonApi.getEscalationLoopUpDataList(apiData).subscribe((response) => {
      // let resultData = response.data;
      this.manageList = [];
      this.manageList = response.items;

      let initText = (index == 0) ? 'init' : 'get';
      this.initList(initText, this.manageList);
      //console.log(this.selectionList);
      let itemListLen1 = this.manageList.length;
      this.empty = (itemListLen1 < 1) ? true : false;
      if (this.empty) {
        this.successMsg = response.result;
      }
      if (index < 0) {
        let itemListLen = this.manageList.length;
        this.empty = (itemListLen < 1) ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        }
      }

      if (this.searchNew) {
        this.manageTag('new', 0);
      }
    });
  }

  // Get Error Code
  getErrorCodes(index) {
    console.log(index)
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      console.log(this.apiData)
      this.apiData.type = (this.apiData.type == undefined || this.apiData.type == 'undefined') ? '' : this.apiData.type;
      this.apiData.typeId = (this.apiData.typeId == undefined || this.apiData.typeId == 'undefined') ? [] : this.apiData.typeId;
      this.apiData.threadCategoryId = (this.apiData.threadCategoryId == undefined || this.apiData.threadCategoryId == 'undefined') ? '' : this.apiData.threadCategoryId;
      let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        vehicleInfo: this.apiData.vehicleInfo,
        searchKey: this.searchVal,
        type: this.apiData.type,
        typeId: this.apiData.typeId,
        threadCategoryId: this.apiData.threadCategoryId,
        offset: this.offset,
        limit: this.limit
      }
      console.log(apiData, Array.isArray(this.apiData.typeId))

      this.commonApi.getErrorCodes(apiData).subscribe((response) => {
        let resultData = response;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = resultData.errorCodes;
        for (let res in list) {
          this.manageList.push(list[res]);
        }
        let initText = (index == 0) ? 'init' : 'get';
        console.log(index, this.selectionList)
        if (index <= 0) {
          //this.searchVal = '';
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += resultData.errorCodes.length;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          //this.manageErrorCode('new', 0);
        }
      });
    }
  }

  // Initiate Manage List
  initList(action, manageList) {
    if(this.newTagOptFlag){
      action = '';
      this.newTagOptFlag = false;
    }
    console.log(this.access, manageList, this.filteredTags, this.filteredModelsCount)
    let start = 0;
    let end = 0;
    this.listItems = [];
    this.listItems = manageList;
    let newFlag = localStorage.getItem('newItem');
    this.searchForm.value.searchKey = (newFlag) ? '' : this.searchForm.value.searchKey;
    this.searchVal = this.searchForm.value.searchKey;
    let checkDisplayFlag = (action == 'get') ? true : false;
    console.log(action, newFlag)
    console.log(this.offset, this.limit)
    switch (action) {
      case 'get':        
        start = this.offset - this.limit
        end = this.offset - 1;
        break;

      default:
        end = manageList.length - 1;
        break;
    }

    switch (this.access) {
      case 'Tags':
      case 'Countries':
      case 'New Thread Tags':
      case 'newthread':
      case 'newAdasSystem':
      case 'New Parts':
      case 'techinfo':
      case 'PartType':
      case 'PartAssembly':
      case 'PartSystem':
      case 'mediaUpload':
        console.log(this.listItems)
        console.log(start)
        console.log(end)
        for (let m in this.listItems) {
          console.log(this.listItems);
          if (start <= parseInt(m) && end >= parseInt(m)) {
            console.log(m)
            let i: any = m;
            this.listItems[m]['action'] = "";
            let field = this.inputData.field;
            console.log(field);
            switch (field) {
              case 'colour':
              case 'info-1':
              case 'info-2':
              case 'info-3':
              case 'info-4':
              case 'info-5':
              case 'info-6':
              case 'info-7':
                this.listItems[m]['editAccess'] = 1;
                break;
              case 'escalationLookup':
                this.listItems[m]['productModelsCount'] = this.listItems[m]['productModelsCount'];
                break;
              case 'dekra-template':
                if(this.listItems[m]['id'] && this.inputData.filteredItems.includes(this.listItems[m]['id'])){
                  this.listItems[m]['active'] = true;
                }
                break;
            }

            this.listItems[m]['displayFlag'] = true;
            this.listItems[m]['checkFlag'] = false;
            this.listItems[m]['itemExists'] = false;
            this.listItems[m]['activeMore'] = false;
            this.listItems[m]['actionFlag'] = false;
            if (this.access == 'newthread' && (this.inputData.field == 'folders' || this.inputData.field == 'keyword' || this.inputData.field == 'supplier' || this.inputData.field == 'vehicleManufector' || this.inputData.field == 'vehicleType' || this.inputData.field == 'EngineCode' || this.inputData.field == 'KBAnumber' || this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-subscriptionPolicy'
             || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' )) {
              this.listItems[m]['editAccess'] = 1;
            }
            if (this.access == 'newthread' && (this.inputData.field == 'escalationLookup' || this.inputData.field == 'model' || this.inputData.field == 'PartModel')) {
              switch (this.inputData.field) {
                case 'model':
                  let modelId = (this.pageAccess == 'adas-procedure') ? this.listItems[m]['id'] : this.listItems[m]['modelName'];
                  this.listItems[m]['id'] = modelId;
                  this.listItems[m]['name'] = this.listItems[m]['modelName'];
                  break;
                case 'escalationLookup':
                  this.listItems[m]['id'] = this.listItems[m]['id'];
                  this.listItems[m]['name'] = this.listItems[m]['name'];
                  this.listItems[m]['productModelsCount'] = this.listItems[m]['productModelsCount'];
                  break;
                default:
                  let modelData = this.listItems[m]['modelItems'][0];
                  this.listItems[m]['id'] = modelData.id;
                  this.listItems[m]['name'] = modelData.name;
                  break;
              }
            }

            if (this.access == 'techinfo') {
              this.listItems[m]['phoneNo'] = this.listItems[m]['phoneNo'];
            }
            let autoInc=0;
            console.log(this.filteredTags)
            for (let t of this.filteredTags) {
              let chkItem = (this.pageAccess == 'adas-procedure' && this.inputData.field == 'model') ? this.listItems[m].id : this.listItems[m].id;
              if (t == chkItem) {
                this.listItems[m]['checkFlag'] = true;
                if (this.access == 'newthread' && (this.inputData.field == 'escalationLookup')) {
                  this.selectionList.push({
                    id: t,
                    name: this.listItems[m].name,
                    productModelsCount: this.listItems[m]['productModelsCount']
                  });
                  console.log('in', t)
                  //this.setupFilteredItems(t);
                }
                else {
                  if(this.inputData.field == 'countries' && t == 0){
                    setTimeout(() => {
                      this.countryAllFlag = true;
                      this.selection = 'multiple';
                      this.itemSelection('all', '0', '0', 'checked');
                    }, 100);
                  }
                  else{
                   

                    if((this.inputData.field == 'folders' || this.inputData.field == 'category' 
                    || this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-subscriptionPolicy'
                    || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks') && t == 0){
                      let rmIndex = this.selectionList.findIndex(option => option.id == t);
                      if(rmIndex >= 0){ }
                      else{
                        console.log(this.selectionList);
                        this.selectionList.push({
                          id: t,
                          name: this.listItems[m].name
                        });
                        if( this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification'){                  
                          this.selectionList.push({
                            id: t,
                            name: this.listItems[m].name,
                            sdate: '',
                            edate: '',
                          });
                        }
                        else{

                          this.selectionList.push({
                            id: t,
                            name: this.listItems[m].name
                          });

                        }
                      }   
                      console.log(this.selectionList);
                    }

                    else{

                      if( this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification'){
                        console.log(this.inputData.filteredDate);
                        if(this.inputData.filteredDate != undefined){
                          let rmIndex22 = this.inputData.filteredDate.findIndex(option => option.id == t);
                          console.log(t,rmIndex22);
                          if(rmIndex22 != '-1'){
                            this.listItems[m].sdate = this.inputData.filteredDate[rmIndex22].startDate != undefined ? this.inputData.filteredDate[rmIndex22].startDate : '';
                            this.listItems[m].edate = this.inputData.filteredDate[rmIndex22].endDate != undefined ? this.inputData.filteredDate[rmIndex22].endDate : '';  
                          }
                          else{
                            this.listItems[m].sdate = '';
                            this.listItems[m].edate = '';
                          }                          
                        }
                        else{
                          this.listItems[m].sdate = '';
                          this.listItems[m].edate = '';
                        }
                         this.selectionList.push({
                          id: t,
                          name: this.listItems[m].name,
                          sdate: this.listItems[m].sdate,
                          edate: this.listItems[m].edate,
                        });
                      }

                    }
                  }

                  /* if(this.inputData.field == 'complaintCategory') {
                    console.log('in complaintCategory')
                    let sindex = this.selectionList.findIndex(option => option.id == t);
                    console.log(sindex)
                    if(sindex < 0) {
                      console.log('in push selection', this.listItems[m])
                      this.selectionList.push({
                        id: t,
                        name: this.listItems[m].name
                      });
                    }
                  } */
                  
                  console.log('in', t)
                  //this.setupFilteredItems(t);
                }

              }
              if (this.access == 'newthread' && (this.inputData.field == 'escalationLookup')) 
              {
                
              }
              else
              {
                if(this.inputData.field == 'countries' && t == 0)
                {

                }

                else
                {
                  if(this.inputData.field=='model')
                  {
                    this.selectionList.push({
                      id: t,
                      name: t
                    });
                  }
                  else
                  {
                    let studentObj = this.selectionList.find(s => s.id == t);
                    if (studentObj) 
                    {
                      this.selectionList.find(s => s.id == t).id=t;
                      this.selectionList.find(s => s.id == t).name=this.filteredLists[autoInc];

                    }
                    else
                    {
                      console.log('push 1');
                      this.selectionList.push({
                        id: t,
                        name: this.filteredLists[autoInc]
                      });
                    }
                    
                  }
                  
                }
               
              }
              autoInc++;
            }
            if (action == 'get' || action == 'init') {
              for (let st of this.selectionList) {
                if (st.id == this.listItems[m].id) {
                  this.listItems[m]['checkFlag'] = true;
                }
              }
            }
          }
        }

        if (action == 'get' && this.inputData.selectionType == 'single') {
          //this.selectedItems.emit(this.selectionList);
          //this.activeModal.dismiss('Cross click');
        }

        if (newFlag != null && newFlag != 'undefined' && newFlag != undefined) {
          let action = 'new';
          this.submitActionFlag = true;
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem('searchVal');
          console.log(sval)
          this.searchVal = "";
          this.submitActionFlag = (sval == null) ? false : true;
          this.itemVal = sval;
          let newTag = {
            id: 0,
            name: sval,
            editAccess: 0,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false
          };
          this.listItems.unshift(newTag);
          this.empty = false;
          localStorage.removeItem('newItem');
          if (action == 'new' && sval != null) {
            this.checkTagExists(0, sval);
          }
        }

        setTimeout(() => {
          if ((!this.countryAllFlag) && (this.selection == 'multiple' || this.selection == 'single')) {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
          }
        }, 500);
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        //this.listItems = manageList;
        for (let m in this.listItems) {
          if (start <= parseInt(m) && end >= parseInt(m)) {
            let i: any = m;
            this.listItems[m]['action'] = "";
            this.listItems[m]['editAccess'] = 1;
            this.listItems[m]['displayFlag'] = true;
            this.listItems[m]['checkFlag'] = false;
            this.listItems[m]['itemExists'] = false;
            this.listItems[m]['activeMore'] = false;
            this.listItems[m]['actionFlag'] = false;
            console.log(this.filteredLists, this.filteredErrorCodes)
            for (let t of this.filteredErrorCodes) {
              console.log(t, this.listItems[m].id)
              let eid = this.listItems[m].id;
              let name = this.listItems[m].code + ' - ' + this.listItems[m].desc;
              name = (this.gtsAccess) ? `${this.listItems[m].type_name} - ${name}` : name;
              if(this.filterCall) {
                name = eid;
              }
              if (t == eid) {
                let ename = `${this.listItems[m].code}##${this.listItems[m].desc}`;
                this.listItems[m]['checkFlag'] = true;
                this.selectionList.push({
                  id: t,
                  name: name,
                  ename: ename
                });
                //this.setupFilteredItems(t);
              }
            }
            if (action == 'get') {
              for (let st of this.selectionList) {
                if (st.id == this.listItems[m].id) {
                  this.listItems[m]['checkFlag'] = true;
                }
              }
            }
          }
        }

        if (newFlag != null && newFlag != 'undefined' && newFlag != undefined) {
          let action = 'new';
          this.submitActionFlag = true;
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem('searchVal');
          this.submitActionFlag = (sval == null) ? false : true;
          this.itemVal = sval;
          let newErrorCode = {
            id: 0,
            name: sval,
            editAccess: 1,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false
          };
          this.listItems.unshift(newErrorCode);
          localStorage.removeItem('newItem');
        }

        setTimeout(() => {
          if (this.selection == 'multiple' || this.selection == 'single') {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
          }
        }, 500);
        break;

      case 'LookupDataPM':


        this.listItems = manageList;


        for (let m in this.listItems) {
          let i: any = m;
          this.listItems[m]['action'] = "";
          this.listItems[m]['displayFlag'] = true;
          this.listItems[m]['checkFlag'] = false;
          this.listItems[m]['itemExists'] = false;
          this.listItems[m]['activeMore'] = false;
          this.listItems[m]['actionFlag'] = false;
          //console.log(this.filteredTags)
          /*for(let t of this.filteredTags) {
            if(t == this.listItems[m].id) {
              this.listItems[m]['checkFlag'] = true;
              this.selectionList.push({
                id: t,
                name: this.listItems[m].name
              });
            }
          }
          */
          if (action == 'get') {
            for (let st of this.selectionList) {
              if (st.id == this.listItems[m].id) {
                this.listItems[m]['checkFlag'] = true;
              }
            }
          }
        }

        setTimeout(() => {
          if (this.filteredTags.length > 0) {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
          }
        }, 500);
        break;
    }
    this.listItems = this.listItems.sort((x, y)=>{
      return Number(y?.checkFlag || false) - Number(x?.checkFlag  || false);
    })
    setTimeout(() => {
      this.loading = false;
      this.lazyLoading = this.loading;
    }, 500);
  }

  validateModel(value){
    let formData = new FormData();
    formData.append('apiKey', this.apiData.apiKey);
    formData.append('userId', this.apiData.userId);
    formData.append('domainId', this.apiData.domainId);
    formData.append('networkId', this.apiData.networkId);
    if(this.apiData.vendorId){
      formData.append('vendorId', this.apiData.vendorId);
    }
    if(this.apiData.toolProdId){
      formData.append('toolProdId', this.apiData.toolProdId);
    }
      formData.append('modelId', value);
      formData.append('type', "1");

    this.headquarterService.validateTools(formData).subscribe((e:any)=>{
      if(e && e.data && e.data.alreadyExist == 1){
        this.modelIdDuplicate = true;
        setTimeout(() => {
          this.modelIdDuplicate = false;
        }, 2000);
      }else{
        console.log(this.selectionList)
        // if(this.title == "Product Model"){
        //   this.selectedItems.emit({value:this.selectionList,res:this.responseData});
        // }else{
          this.selectedItems.emit(this.selectionList);
        // }
        this.title = "";
        this.activeModal.dismiss('Cross click');
      }
    })
  }

  // Item Selection
  itemSelection(type, index, id, flag) {
    this.clearFlag = false;
    console.log(this.access, this.selectionList);
    console.log(type + ' :: ' + index + ' :: ' + id + ' :: ' + flag + ' :: ' + this.selection)
    let field = this.inputData.field;
    if(type == 'single' && id == 0 && field == "countries"){
      type = 'all';
      flag = flag ? flag : 'all';
    }
    console.log(field);
    switch (type) {
      case 'single':
        if (this.selection == 'single') {
          let emitFlag = true;
          if (flag) {
            this.headerCheck = 'checked';
            this.selectionList = [];
            switch (field) {
              case 'model':
              case 'PartModel':
                let item = this.listItems[index];
                let additionalInfo1 = (item.additionalInfo) ? item.additionalInfo : [];
                let additionalInfo2 = (item.additionalInfo1) ? item.additionalInfo1 : [];
                let additionalInfo3 = (item.additionalInfo2) ? item.additionalInfo2 : [];
                let additionalInfo4 = (item.additionalInfo3) ? item.additionalInfo3 : [];
                let additionalInfo5 = (item.additionalInfo4) ? item.additionalInfo4 : [];
                console.log(item, this.listItems[index])
                let modId = (this.industryType.id == 2 || this.industryType.id == 3) ? this.listItems[index].uId : this.listItems[index].id;
                this.selectionList.push({
                  id: modId,
                  name: this.listItems[index].name,
                  catg: item.CategoryId,
                  subCatg: item.SubcategoryId,
                  prodType: item.productType,
                  regions: item.regions,
                  make: item.makeName,
                  makeItems: item.makeItems,
                  additionalInfo1,
                  additionalInfo2,
                  additionalInfo3,
                  additionalInfo4,
                  additionalInfo5
                });
                break;
              case 'vinNo':
              case 'vinNoScanTool':
                this.selectionList.push(this.listItems[index]);
                break;
              case 'dekra-template':
                console.log(this.listItems);
                this.selectionList.push(this.listItems[index]);
                break;
              default:
                this.selectionList.push({
                  id: this.listItems[index].id,
                  name: this.listItems[index].name,
                  isNewCreated : this.neawlyCreatedIds.includes(this.listItems[index].id)
                });
                break;
            }
          } else {
            switch (field) {
              case 'model':
              case 'PartModel':
              case 'vinNo':
              case 'vinNoScanTool':
              case 'category':
              case 'dekra-shoptype':
              case 'dekra-dms':
              case 'dekra-subscriptionPolicy':
              case 'dekra-franchise':    
              case 'dekra-subscription':
              case 'dekra-certification':         
              case 'keyword':
              case 'folders':
              case 'escalationLookup':
              case 'dekra-ServiceOffered':
              case 'dekra-FacilityFeatures':
              case 'dekra-webLinks':
                emitFlag = false;
                break;
              default:
                emitFlag = true;
                break;
            }
            this.headerCheck = 'checked';
            this.selectionList = [];
          }
          console.log(emitFlag)
          console.log(this.selectionList)
          if (emitFlag) {
            this.applySelection('trigger');
          }
        } else {
          this.listItems[index].checkFlag = flag;
          if (this.activeListshow == true) {
            this.DisableText = 'Disable';
          } else {
            this.DisableText = 'Enable';
          }
          if (!flag) {
            let rmIndex = this.selectionList.findIndex(option => option.id == id);
            this.selectionList.splice(rmIndex, 1);
            let rmIndex1 = this.filteredTags.findIndex(option => option.id == id);
            this.filteredTags.splice(rmIndex1, 1);
            if(this.apiData['domainId'] == 98 && this.access == 'Tags' || (this.access == 'newthread' && (field == 'Category' || field == 'Emissions'))) {
              this.filteredLists.splice(rmIndex1, 1);
            }
            //this.setupFilteredItems(this.listItems[index].id);
            setTimeout(() => {
              this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
              if (this.activeListshow == true) {
                this.DisableText = 'Disable';
              } else {
                this.DisableText = 'Enable';
              }
              this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : this.headercheckDisplay;
            }, 100);
          } else {
            console.log(this.listItems[index])
            let name = (this.access != 'Error Codes' && this.access != 'New Thread Error Codes') ? this.listItems[index].name : this.listItems[index].code + ' - ' + this.listItems[index].desc;
            name = (this.gtsAccess) ? `${this.listItems[index].type_name} - ${name}` : name;
            if (this.access == 'New Thread Error Codes') {
              let ename = `${this.listItems[index].code}##${this.listItems[index].desc}`;
              name = (this.filterCall) ? this.listItems[index].id : name;
              ename = (this.filterCall) ? name : ename;
              this.selectionList.push({
                id: this.listItems[index].id,
                name: name,
                ename: ename
              });
            } else {
              console.log(this.listItems[index].id)
              switch (field) {
                case 'prodCode':
                  let item = this.listItems[index];
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: this.listItems[index].name,
                    prodType: item.prodType,
                    model: item.model
                  });
                  break;
                case 'escalationLookup':
                  console.log(this.listItems);
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: name,
                    productModelsCount: this.listItems[index].productModelsCount
                  });
                  break;
                case 'dekra-subscription':
                case 'dekra-certification':
                  console.log(this.listItems);
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: name,
                    sdate: this.listItems[index].sdate,
                    edate: this.listItems[index].edate,
                  });
                  break;                
                default:
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: name
                  });
                  break;
              }
            }

            if (this.access == 'newthread' && this.selection == 'single') {
              let field = this.inputData.field;
              switch (field) {
                case 'model':
                case 'PartModel':
                  let item = this.listItems[index];
                  this.selectionList[0]['catg'] = item.CategoryId;
                  this.selectionList[0]['subCatg'] = item.SubcategoryId;
                  this.selectionList[0]['prodType'] = item.productType;
                  this.selectionList[0]['regions'] = item.regions;
                  this.selectionList[0]['make'] = item.makeName;
                  this.selectionList[0]['makeItems'] = item.makeItems;
                  break;
              }
            }
            this.headercheckDisplay = "checkbox-show";
            this.headerCheck = (this.selectionList.length == this.listItems.length) ? 'all' : 'checked';
            this.headercheckDisplay = (this.selectionList.length > 0) ? 'checkbox-show' : 'checkbox-hide';
          }
        }
        this.clearFlag = (this.selectionList.length == 0) ? true : false;
        break;
      case 'all':
        this.selectionList = [];
        if (this.activeListshow == true) {
          this.DisableText = 'Disable';
        } else {
          this.DisableText = 'Enable';
        }
        this.headercheckDisplay = 'checkbox-show';
        if (flag == 'checked') {
          if (this.listItems.length > 0) {
            this.headerCheck = 'all';
            this.itemChangeSelection(this.headerCheck);
          }
        } else if (flag == 'all') {
          this.headerCheck = 'unchecked';
          this.headercheckDisplay = 'checkbox-hide';
          this.clearFlag = true;
          this.itemChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = 'all';
          this.itemChangeSelection(this.headerCheck);
        }
        break;
    }
    console.log(this.selectionList)

    

  }

  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    if (this.access == 'LookupDataPM') {
      for (let m of this.listItems) {
        if (action != 'empty' && action != 'unchecked') {
          if (m.editAccess == 1) {
            this.selectionList.push({
              id: m.id,
              name: m.name
            });
          }
        }
        m.checkFlag = (action == 'all') ? true : false;
      }
    } else {
      console.log(action)
      for (let m of this.listItems) {
        if (action != 'empty' && action != 'unchecked') {
          if(this.inputData.field == 'countries' && action == 'all'){
            this.selectionList.push({
              id: '0',
              name: 'All'
            });
          }
          else{
            this.selectionList.push({
              id: m.id,
              name: m.name
            });
          }
        }
        m.checkFlag = (action == 'all') ? true : false;
      }
    }
  }

  // Manage List
  manageListItem(action, index) {
    console.log(this.access)
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.manageTag(action, index);
        break;
      case 'Franchise':
        this.manageFranchise(action, index);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
      case 'New Parts':
      case 'techinfo':
        this.itemCode = (action == 'new') ? "" : this.itemCode;
        this.manageErrorCode(action, index);
        break;
      case 'LookupDataPM':
        case 'Countries':
        this.manageLoopUpData(action, index);
        break;
      case 'newthread':
      case 'newAdasSystem':
        this.manageItem(action, index);
        break;
    }
  }

  // Add, Edit, Cancel Item
  manageItem(action, index) {
    console.log(action, index, this.empty, this.actionFlag);
    switch (action) {
      case 'new':
        if (this.empty) {
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          this.searchNew = true;
          this.clearSearch(action);
        }
        else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newTag = {
              id: 0,
              name: sval,
              editAccess: 0,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newTag);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            if (action == 'new' && sval != null) {
              this.checkItemExists(index, sval);
            }
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        console.log(this.apiData, this.itemVal)
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let editAction: any = (id > 0) ? 1 : 0;
         
          let apiData = {
            apiKey: this.apiData['apiKey'],
            userId: this.apiData['userId'],
            domainId: this.apiData['domainId'],
            countryId: this.apiData['countryId'],
            isValidate: 0,
            isEdit: editAction
          };

          if(this.apiData['vendorId']){
            apiData['vendorId'] = this.apiData['vendorId'];
          }

          if(this.apiData['modelId']){
            apiData['modelId'] = this.apiData['modelId'];
          }
          if (id > 0) {
            if(this.inputData.field == 'folders'){
              apiData['folderId'] = id;
              apiData['oldFolderName'] = this.listItems[index].name;
            }
            else{
              apiData['id'] = id;
            }
          }
          if(this.inputData.field == 'keyword'){
            apiData['tagName'] = this.itemVal;
            apiData['tagId'] = id;
          }
          if(this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy'
          || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template'){
            apiData['type'] = this.apiData['type'];
            apiData['label'] = this.apiData["label"] ? this.apiData["label"] : '';
            apiData['networkId'] = this.apiData['networkId'];
            apiData['name'] = this.itemVal;
            apiData['id'] = id;
          }
          
          switch (this.inputData.field) {
            case 'model':
            case 'PartModel':
              apiData['MakeName'] = this.apiData.makeName;
              apiData['ModelName'] = this.itemVal;
              break;
            case 'colour':
              if (id > 0) {
                apiData['colorValueId'] = id;
              }
              apiData['colorValueName'] = this.itemVal;
              apiData['workstreamList'] = [];
              break;
            case 'info-1':
            case 'info-2':
            case 'info-3':
            case 'info-4':
            case 'info-5':
            case 'info-6':
            case 'info-7':
              if (id > 0) {
                apiData['infoId'] = id;
              }
              apiData['infoName'] = this.itemVal;
              apiData['workstreamList'] = [];
              this.listItems[index].name = this.itemVal;
              break;
            case 'folders':
              if (id > 0) {
                //apiData['folderId'] = id;
              }
            default:
              let query = this.inputData.actionQueryValues;
              if (query != '') {
                let queryVal = JSON.parse(query);
                if (id > 0) {
                  apiData[queryVal[0]] = id;
                }
                apiData[queryVal[1]] = this.itemVal;
                apiData[queryVal[2]] = '';
                apiData['workstreamList'] = JSON.stringify(this.ws);
                queryVal.forEach(q => {
                  switch (q) {
                    case 'commonApiValue':
                      apiData[q] = this.commonApiValue;
                      break;
                  }
                });
              }
              break;
          }
          this.manageAction(index, apiData);
        }
        break;
    }
  }

  // Add, Edit, Cancel Tag
  manageTag(action, index) {
    console.log(this.actionFlag, action, this.empty)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.searchNew = true;
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          //if (!this.empty)
          this.clearSearch(action);
        } else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newTag = {
              id: 0,
              name: sval,
              editAccess: 0,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newTag);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            if (action == 'new' && sval != null) {
              this.checkTagExists(index, sval);
            }
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          this.listItems.splice(rmIndex, 1);
          index = index - 1;
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'tagName': this.itemVal,
            'id': id
          };
          this.manageAction(index, apiData);
        }
        break;
    }
  }

   // Add, Edit, Cancel Tag
   manageFranchise(action, index) {
    console.log(this.actionFlag, action, this.empty)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.searchNew = true;
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          //if (!this.empty)
          this.clearSearch(action);
        } else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newTag = {
              id: 0,
              name: sval,
              editAccess: 0,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newTag);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            if (action == 'new' && sval != null) {
              this.checkTagExists(index, sval);
            }
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          this.listItems.splice(rmIndex, 1);
          index = index - 1;
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'tagName': this.itemVal,
            'id': id
          };
          this.manageAction(index, apiData);
        }
        break;
    }
  }

  manageLoopUpData(action, index) {
    //console.log(action)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.searchNew = true;
          this.clearSearch();
          //this.getTagInfo(index);
          setTimeout(() => {
            this.empty = false;
            this.submitActionFlag = true;
          }, 750);
        }

        if (!this.actionFlag && !this.empty) {
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem('searchVal');
          this.submitActionFlag = (sval == null) ? false : true;
          this.itemVal = sval;
          let newTag = {
            id: 0,
            name: sval,
            editAccess: 0,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false
          };
          this.listItems.unshift(newTag);
          let el = document.getElementById('manageTable');
          el.scrollTo(0, 0);
          this.inputFocus();
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'lookUpdataName': this.itemVal,
            'lookUpTableId': this.apiData['lookUpdataId'],
            'selectionList': '',
            'isInActive': this.activeListshow,
            'id': id,
            'title': this.title
          };

          this.manageAction(index, apiData);
        }
        break;
      case 'disable':
        //console.log(this.listItems[index])
        //console.log(this.submitActionFlag)

        // let id = this.listItems[index].id;
        let apiData = {
          'apiKey': this.apiData['apiKey'],
          'userId': this.apiData['userId'],
          'domainId': this.apiData['domainId'],
          'countryId': this.apiData['countryId'],
          'lookUpdataName': '',
          'selectionList': JSON.stringify(this.selectionList),
          'isInActive': this.activeListshow,
          'lookUpTableId': this.apiData['lookUpdataId'],
          'title': this.title
        };

        this.manageAction(index, apiData);

        break;
    }
  }

  applychangeValue(event) {
    //alert(event.value.name);
    if (event.value.name == 'In Active') {
      this.activeListshow = false;
      this.getLookUpInfo(0);
      this.selectionList = [];
    }
    if (event.value.name == 'Active') {
      this.selectionList = [];
      this.activeListshow = true;
      this.getLookUpInfo(0);
    }

  }
  applySelectionActive() {
    this.selectionList = [];
    this.activeListshow = true;
    this.getLookUpInfo(0);
  }
  applySelectionInActive() {
    this.activeListshow = false;
    this.getLookUpInfo(0);
    this.selectionList = [];
  }

  // Add, Edit, Cancel Tag
  manageErrorCode(action, index) {
    //console.log(action)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.itemCode = "";
          this.itemVal = "";
          this.searchNew = true;
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          this.clearSearch(action);
        } else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newErrorCode = {
              id: 0,
              name: sval,
              editAccess: 1,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newErrorCode);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        console.log(this.listItems)
        this.itemCode = this.listItems[index].code;
        this.itemVal = this.listItems[index].desc;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemCode = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'id': id
          };

          if (this.access == 'New Parts' || this.access == 'techinfo') {
            let queryVal = JSON.parse(this.inputData.actionQueryValues);
            apiData[queryVal[1]] = this.itemCode;
            apiData[queryVal[2]] = this.itemVal;
            apiData[queryVal[3]] = this.access == 'techinfo' ? localStorage.getItem('dealerCode') : this.vehicle;
            apiData['isValidate'] = 0;
          }

          console.log(apiData)


          this.manageAction(index, apiData);
        }
        break;
    }
  }

  // Manage Action
  manageAction(index, apiData) {
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    console.log(index);
    switch (this.access) {
      case 'Tags':
      case 'Franchise':
      case 'New Thread Tags':
        let tagData = new FormData();
        let isValidate: any = 0;
        let name = this.itemVal;
        tagData.append('apiKey', apiData.apiKey);
        tagData.append('userId', apiData.userId);
        tagData.append('domainId', apiData.domainId);
        tagData.append('countryId', apiData.countryId);
        tagData.append('tagName', apiData.tagName);
        tagData.append('workstreamList', JSON.stringify(this.ws));
        tagData.append('vehicleInfo', this.vehicle);
        tagData.append('isValidate', isValidate);
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          tagData.append('tagId', apiData.id);
        }
        let callAbleUrl = this.commonApi.manageTag(tagData);
        if (this.pageType == 'market-place') {
          if (apiData.id > 0) {
            callAbleUrl = this.commonApi.updateTagMarketPlace(tagData);
          } else {
            callAbleUrl = this.commonApi.manageTagMarketPlace(tagData);
          }
        }

        callAbleUrl.subscribe((response) => {
          this.newTagOptFlag = true;
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;
          let successMessage = response.message;
          if (this.pageType == 'market-place') {
            this.success = true;
            /*const msgModalRef = this.modalService.open(
              SuccessModalComponent,
              this.config
            );
            msgModalRef.componentInstance.successMessage = successMessage;*/
            this.successMsg = successMessage;
            setTimeout(() => {
              this.success = false;
             // msgModalRef.dismiss("Cross click");
            }, 2000);
          }
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id = response.dataId || response.data;
          let actionFlag = (response.status == 'Success') ? true : false;
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(checkIndex + ' :: ' + this.itemVal + '::' + id)
          if (checkIndex < 0) {
            this.filteredTags.push(id);
            this.actionItems.push(id);
            //if (this.pageType != 'market-place') {
              this.filteredLists.push(this.itemVal);
            //}
          }
          let i = -1;
          this.getTagInfo(i);
        });
        break;

      case 'LookupDataPM':
        case 'Countries':
        let lookupData = new FormData();
        let isValidatev: any = 0;
        this.clearSelection();
        lookupData.append('apiKey', apiData.apiKey);
        lookupData.append('userId', apiData.userId);
        lookupData.append('domainId', apiData.domainId);
        lookupData.append('countryId', apiData.countryId);
        lookupData.append('lookUpdataName', apiData.lookUpdataName);
        lookupData.append('lookUpTableId', apiData.lookUpTableId);
        lookupData.append('disabledDomain', apiData.selectionList);
        lookupData.append('isInActive', apiData.isInActive);

        lookupData.append('title', apiData.title);

        lookupData.append('workstreamList', JSON.stringify(this.ws));
        lookupData.append('vehicleInfo', this.vehicle);
        lookupData.append('isValidate', isValidatev);
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          lookupData.append('lookUpdataId', apiData.id);
        }

        this.commonApi.ManageLookUpdata(lookupData).subscribe((response) => {
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
            this.selectionList = [];

          }, 3000);
          let id = response.dataId;
          let actionFlag = (response.status == 'Success') ? true : false;
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(checkIndex + ' :: ' + this.itemVal)
          if (checkIndex < 0) {
            this.filteredTags.push(id);
            this.actionItems.push(id);
          }
          this.getLookUpInfo(index);
        });
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        let errData = new FormData();
        let isValidateErr: any = 0;
        let code = this.itemCode;
        let desc = this.itemVal;
        errData.append('apiKey', apiData.apiKey);
        errData.append('userId', apiData.userId);
        errData.append('domainId', apiData.domainId);
        errData.append('countryId', apiData.countryId);
        errData.append('workstreamList', JSON.stringify(this.ws));
        errData.append('vehicleInfo', this.vehicle);
        errData.append('isValidate', isValidateErr);
        errData.append('errorCode', code);
        errData.append('errorDesc', desc);
        if(this.apiData.threadCategoryId != '') {
          errData.append('threadCategoryId', this.apiData.threadCategoryId);
        }
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          errData.append('errorCodeId', apiData.id);
        }

        this.commonApi.manageErrorCode(errData).subscribe((response) => {
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id = response.dataId;
          let actionFlag = (response.status == 'Success') ? true : false;
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(checkIndex + ' :: ' + this.itemVal)
          if (checkIndex < 0) {
            this.filteredErrorCodes.push(id);
            this.actionItems.push(id);
          }
          let i = -1;
          this.getErrorCodes(i);
        });
        break;

      case 'newthread':
      case 'newAdasSystem':
      case 'New Parts':
      case 'techinfo':
        console.log(apiData)
        let apiUrl = `${this.inputData.baseApiUrl}`;
        let body: HttpParams = new HttpParams();
        switch (this.inputData.field) {
          case 'category':
            apiData['categoryName'] = this.itemVal;
            apiUrl = `${apiUrl}/softwaredl/SaveCategoryFolder`;
          break;
          case 'dekra-shoptype':
          case 'dekra-shopList':
          case 'dekra-dms':
          case 'dekra-subscriptionPolicy':
          case 'dekra-franchise':
          case 'dekra-subscription':
          case 'dekra-certification':
          case 'dekra-template':
          case 'dekra-ServiceOffered':
          case 'dekra-FacilityFeatures':
          case 'dekra-webLinks':
            apiData['name'] = this.itemVal;
            apiUrl = `${apiUrl}network/managecommonvalue`;
            if(this.inputData.field == "dekra-shopList"){
                apiData["type"] = '36'
            }
            apiData['networkId'] = this.apiData['networkId'];
            break;
          case 'keyword':
            apiData['tagName'] = apiData.tagName;
            if(apiData.id>0){
              apiData['tagId'] = apiData.tagId;
            }
            apiData['groupId'] = this.apiData["groupId"];
            apiUrl = `${apiUrl}/forum/SaveKeyWordPriority`;
          break;
          case 'folders':
            apiData['workstreams'] = this.apiData["workstreamsList"];
            apiData['folderName'] = this.itemVal;
            apiUrl = `${apiUrl}/resources/SaveDocumentFolder`;
          break;
          case 'colour':
            apiUrl = `${apiUrl}/parts/SavecolorValue`;
            break;
          case 'model':
          case 'PartModel':
            apiUrl = `${apiUrl}/Productmatrix/SaveproductMatrix`;
            break;
          case 'info-1':
          case 'info-2':
          case 'info-3':
          case 'info-4':
          case 'info-5':
          case 'info-6':
          case 'info-7':
            apiUrl = `${apiUrl}/parts/SaveAdditionalInfo`;
            break;
          default:
            apiUrl = `${apiUrl}/${this.inputData.actionApiName}`;
            break;
        }
        Object.keys(apiData).forEach(key => {
          let value = apiData[key];
          body = body.append(key, value);
        });

        this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
          console.log(response);
          this.searchVal = '';
          this.success = true;
          if(this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-shopList' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy'
          || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template'){
            this.successMsg = response.message;
          }
          else{
            this.successMsg = response.result;
          }
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id;
          let flag = true;
          switch (this.inputData.field) {
            case 'model':
            case 'PartModel':
              id = response.modelId;
              break;
            case 'colour':
            case 'info-1':
            case 'info-2':
            case 'info-3':
            case 'info-4':
            case 'info-5':
            case 'info-6':
            case 'info-7':
              flag = false;
              id = response.dataId;
              break;
            default:
              flag = (this.inputData.selectionType == 'single') ? false : true;
              if(this.inputData.field == 'category'){
                id = response.dataId;
                //id = ""; // selection category if create new
              }
              else if(this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.field == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy'
              || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template'){
                id = response.data.id;
                //flag = (apiData.id>0) ? false : true;
                //id = ""; // selection category if create new
              }
              else{
                id = response.dataId;
                if(this.inputData.field === 'dekra-shopList'){
                  this.neawlyCreatedIds.push(response.data.id);
                }
              }
              break;
          }
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(this.filteredTags, checkIndex + ' :: ' + this.itemVal + '::' + id)
          if (checkIndex < 0 && flag) {            
            this.filteredTags.push(id);
            this.actionItems.push(id);
            switch(this.inputData.field) {
              case 'dekra-shoptype':
              case 'dekra-dms':
              case 'dekra-subscriptionPolicy':
              case 'dekra-franchise':
              case 'dekra-certification':
              case 'dekra-subscription':
              case 'dekra-template':
              case 'category':
              case 'folders':
              case 'complaintCategory':
              case 'symptom':
              case 'SystemSelection':
              case 'dekra-ServiceOffered':
              case 'dekra-FacilityFeatures':
              case 'dekra-webLinks':
                let filterIndex = this.filteredLists.findIndex(option => option == this.itemVal);
                if(filterIndex < 0) {
                  this.filteredLists.push(this.itemVal);
                }
                break;
              case 'keyword':
                if (this.pageType != 'market-place') {
                  this.filteredLists.push(this.itemVal);
                }
                break;  
            }            
          }

          if(this.inputData.field == 'category'){
            this.getCatgInfo(index);
          }
          else if(this.inputData.field == 'dekra-shoptype' || this.inputData.field == 'dekra-dms' || this.inputData.filld == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy'
          || this.inputData.field == 'dekra-subscription' || this.inputData.field == 'dekra-certification' || this.inputData.field == 'dekra-template'){
            let i = -1;
            this.getDekraCommonInfo(i);
          }
          else if(this.inputData.field == 'keyword'){
            this.getKeywordInfo(index);
          }
          else if(this.inputData.field == 'folders'){
            localStorage.setItem('documentRefresh','1');
            let i = -1;
            this.getFolderInfo(i);
          }
          else{
            this.getData(index);
          }
        });
        break;
    }
  }

  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.selectionList = [];
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
      case 'Error Codes':
      case 'New Thread Error Codes':
        this.clearFlag = true;
        break;
      case 'newthread':
      case 'newAdasSystem':
        if (this.inputData.field == 'escalationLookup') {
          this.clearFlag = true;
        }

        if(this.inputData.field == "dekra-shoptype"){
            this.filteredLists = [];
            this.filteredTags = [];
        }
    }
    this.itemChangeSelection(this.headerCheck);
  }

  // On Change
  onChange(field, index, value, vid = '') {
    let checkFlag;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        if (value.length > 0) {
          this.checkTagExists(index, value);
        } else {
          if (this.listFlag) {
            this.listFlag.unsubscribe();
          }
          this.itemVal = "";
          this.listItems[index].itemExists = false;
          this.submitActionFlag = false;
        }
        break;
        case 'Franchise':
          if (value.length > 0) {
            // this.checkTagExists(index, value);
            this.listItems[index].itemExists = false;
          } else {
            if (this.listFlag) {
              // this.listFlag.unsubscribe();
            }
            this.itemVal = "";
            this.listItems[index].itemExists = false;
            this.submitActionFlag = false;
          }
          break;
      case 'LookupDataPM':
        case 'Countries':
        if (value.length > 0) {
          this.checkLookupExists(index, value, vid);
        } else {
          if (this.listFlag) {
            this.listFlag.unsubscribe();
          }
          this.itemVal = "";
          this.listItems[index].itemExists = false;
          this.submitActionFlag = false;
        }
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
      case 'New Parts':
        this.listItems[index].itemExists = false;
        this.submitActionFlag = false;
        checkFlag = false;
        if (field == 'code') {
          this.itemCode = value;
          if (value.length > 0 && this.itemVal != null) {
            checkFlag = true;
          } else {
            this.listItems[index].itemExists = false;
            //this.submitActionFlag = false;
          }
        } else {
          this.itemVal = value;
          if (value.length > 0 && this.itemCode != null) {
            checkFlag = true;
          } else {
            this.listItems[index].itemExists = false;
            //this.submitActionFlag = false;
          }
        }

        if (checkFlag) {
          this.checkErrorCodeExists(index, this.itemCode, this.itemVal);
        }
        break;

      case 'techinfo':
        checkFlag = false;
        this.submitActionFlag = false;

        if (field == 'code') {
          this.itemCode = value;
          checkFlag = true;
          if (value.length > 0) {
            checkFlag = true;
          } else {
            this.listItems[index].itemExists = false;
            //this.submitActionFlag = false;
          }
        } else {
          if (value.length >= 10 && this.itemCode != '') {
            this.submitActionFlag = (!this.listItems[index].itemExists) ? true : this.submitActionFlag;
          }
          this.itemVal = value;
        }

        if (checkFlag) {
          this.checkTechInfoExists(index, this.itemCode, this.itemVal);
        }
        break;

      case 'newthread':
      case 'newAdasSystem':
        if (value.length > 0) {
          this.checkItemExists(index, value);
        } else {
          if (this.listFlag) {
            this.listFlag.unsubscribe();
          }
          this.itemVal = "";
          this.listItems[index].itemExists = false;
          this.submitActionFlag = false;
        }
        break;
    }
  }

  // Check Tag Exists
  checkTagExists(index, value) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId'],
      'name': value,
      'id': this.listItems[index].id
    };

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  checkLookupExists(index, value, vid) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId'],
      'lookUptableId': this.apiData['lookUpdataId'],
      'lookUpdataId': vid,
      'name': value
    };

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Error Code Exists
  checkErrorCodeExists(index, code, desc) {
    console.log(index)
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId']
    };
    if (this.access == 'New Parts') {
      let queryVal = JSON.parse(this.inputData.actionQueryValues);
      apiData[queryVal[1]] = code;
      apiData[queryVal[2]] = desc;
      apiData['isValidate'] = 1;
    } else {
      apiData['errorCode'] = code;
      apiData['errorDesc'] = desc;
    }
    apiData['errorCodeId'] = (index >= 0) ? this.listItems[index].id : 0;

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Technician Info Exists
  checkTechInfoExists(index, code, phone) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId']
    };
    let queryVal = JSON.parse(this.inputData.actionQueryValues);
    apiData[queryVal[0]] = 0;
    apiData[queryVal[1]] = code;
    apiData[queryVal[2]] = (phone == null) ? '' : phone;
    apiData[queryVal[3]] = localStorage.getItem('dealerCode');
    apiData['isValidate'] = 1;
    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Exists
  manageExist(index, apiData) {
    console.log(this.access, index)
    let isValidate: any = 1;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        let tagData = new FormData();
        tagData.append('apiKey', apiData.apiKey);
        tagData.append('userId', apiData.userId);
        tagData.append('domainId', apiData.domainId);
        tagData.append('countryId', apiData.countryId);
        tagData.append('tagName', apiData.name);
        tagData.append('workstreamList', JSON.stringify(this.ws));
        tagData.append('vehicleInfo', this.vehicle);
        tagData.append('isValidate', isValidate);
        let callAbleUrl = this.commonApi.manageTag(tagData);
        if (this.pageType == 'market-place') {
          console.log("apiData: ", apiData);
          if (apiData.id > 0) {
            tagData.append('tagId', apiData.id);
            callAbleUrl = this.commonApi.updateTagMarketPlace(tagData);
          } else {
            callAbleUrl = this.commonApi.manageTagMarketPlace(tagData);
          }
        }
        this.listFlag = callAbleUrl.subscribe((response) => {
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            this.itemVal = apiData.name;
            this.submitActionFlag = (this.itemVal != '') ? true : false;
          } else {
            this.submitActionFlag = false;
          }
        });
        break;
        case 'Franchise':
          let tagData1 = new FormData();
          tagData1.append('apiKey', apiData.apiKey);
          tagData1.append('userId', apiData.userId);
          tagData1.append('domainId', apiData.domainId);
          tagData1.append('countryId', apiData.countryId);
          tagData1.append('tagName', apiData.name);
          tagData1.append('workstreamList', JSON.stringify(this.ws));
          tagData1.append('vehicleInfo', this.vehicle);
          tagData1.append('isValidate', isValidate);
          let callAbleUrl1 = this.commonApi.manageTag(tagData1);
          if (this.pageType == 'market-place') {
            console.log("apiData: ", apiData);
            if (apiData.id > 0) {
              tagData1.append('tagId', apiData.id);
              callAbleUrl1 = this.commonApi.updateTagMarketPlace(tagData1);
            } else {
              callAbleUrl1 = this.commonApi.manageTagMarketPlace(tagData1);
            }
          }
          this.listFlag = callAbleUrl1.subscribe((response) => {
            this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
            if (!this.listItems[index].itemExists) {
              this.itemVal = apiData.name;
              this.submitActionFlag = (this.itemVal != '') ? true : false;
            } else {
              this.submitActionFlag = false;
            }
          });
          break;

      case 'LookupDataPM':
        let LookupData = new FormData();
        LookupData.append('apiKey', apiData.apiKey);
        LookupData.append('userId', apiData.userId);
        LookupData.append('domainId', apiData.domainId);
        LookupData.append('countryId', apiData.countryId);
        LookupData.append('lookUpdataName', apiData.name);
        LookupData.append('lookUpdataId', apiData.lookUpdataId);

        LookupData.append('lookUpTableId', apiData.lookUptableId);
        LookupData.append('workstreamList', JSON.stringify(this.ws));
        LookupData.append('vehicleInfo', this.vehicle);
        LookupData.append('isValidate', isValidate);

        this.listFlag = this.commonApi.ManageLookUpdata(LookupData).subscribe((response) => {
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            this.itemVal = apiData.name;
            this.submitActionFlag = (this.itemVal != '') ? true : false;
          } else {
            this.submitActionFlag = false;
          }
        });
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        let codeData = new FormData();
        codeData.append('apiKey', apiData.apiKey);
        codeData.append('userId', apiData.userId);
        codeData.append('domainId', apiData.domainId);
        codeData.append('countryId', apiData.countryId);
        codeData.append('errorCode', apiData.errorCode);
        codeData.append('errorDesc', apiData.errorDesc);
        codeData.append('workstreamList', JSON.stringify(this.ws));
        codeData.append('vehicleInfo', this.vehicle);
        codeData.append('isValidate', isValidate);
        if(apiData.errorCodeId > 0) {
          codeData.append('errorCodeId', apiData.errorCodeId);
        }
        if(this.apiData.threadCategoryId != '') {
          codeData.append('threadCategoryId', this.apiData.threadCategoryId);
        }
        this.listFlag = this.commonApi.manageErrorCode(codeData).subscribe((response) => {
          console.log(response, index)
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            this.itemCode = apiData.errorCode;
            this.itemVal = apiData.errorDesc;
            this.submitActionFlag = (this.itemVal != '') ? true : false;
          } else {
            this.submitActionFlag = false;
          }
        });
        break;

      case 'newthread':
      case 'newAdasSystem':
      case 'New Parts':
      case 'techinfo':
        console.log(this.inputData, apiData)
        let apiUrl = `${this.inputData.baseApiUrl}`;
        switch (this.inputData.title) {
          case 'Colours':
            apiUrl = `${apiUrl}/parts/SavecolorValue`;
            break;
          case 'Additional Model Info 1':
          case 'Additional Model Info 2':
          case 'Additional Model Info 3':
          case 'Additional Model Info 4':
          case 'Additional Model Info 5':
          case 'Additional Model Info 6':
          case 'Additional Model Info 7':
            apiUrl = `${apiUrl}/parts/SaveAdditionalInfo`;
            break;
          case 'Model':
          case 'model':
          case 'PartModel':
            apiUrl = `${apiUrl}/Productmatrix/CheckMakeModelExist`;
            break;
          case 'Category':
            apiUrl = `${apiUrl}/softwaredl/SaveCategoryFolder`;
            break;
          case 'Systems/Technology':
          case 'Subscriptions/Policies':
          case 'ShopType':
          case 'Shop Type':
          case "Vendor Name":
          case "Department":
          case "Product Model":
          case "Product Name":
          case "Brand":
          case "Tool Category":
          case "Spec Name":
          case "Unit":
          case "Type":
          case "Manufacturer":
          case 'Franchise':
          case 'Subscription':
          case 'Certification':
          case 'Tag':
          case 'Procedure Type':
          case 'Service Offered':
          case 'Facility Features':
          case 'Shop Name':
          case 'Web Links':
            apiUrl = `${apiUrl}network/managecommonvalue`;
            break;
          case 'Keyword':
            apiUrl = `${apiUrl}/forum/SaveKeyWordPriority`;
            break;
          case 'Folder':
            apiUrl = `${apiUrl}/resources/SaveDocumentFolder`;
            break;
          default:
            apiUrl = `${apiUrl}/${this.inputData.actionApiName}`;
            break;

        }

        let field = this.inputData.field;
        let body: HttpParams = new HttpParams();

        Object.keys(apiData).forEach(key => {
          let value = apiData[key];
          body = body.append(key, value);
        });
        this.listFlag = this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
          console.log(response, field);
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            let itemVal = '';
            switch (field) {
              case 'dekra-shoptype':
              case 'dekra-shopList':
              case 'dekra-dms':
              case 'dekra-subscriptionPolicy':
              case 'dekra-franchise':
              case 'dekra-subscription':
              case 'dekra-certification':
              case 'dekra-template':
              case 'dekra-ServiceOffered':
              case 'dekra-FacilityFeatures':
              case 'dekra-webLinks':
                itemVal = apiData.name;
                break;
              case 'category':
                itemVal = apiData.categoryName;
                break;
              case 'keyword':
                itemVal = apiData.tagName;
                if (apiData.id > 0) {
                  tagData.append('tagId', apiData.id);
                }
                break;
              case 'folders':
                itemVal = apiData.folderName;
                break;
              case 'colour':
                itemVal = apiData.colorValueName;
                break;
              case 'info-1':
              case 'info-2':
              case 'info-3':
              case 'info-4':
              case 'info-5':
              case 'info-6':
              case 'info-7':
                itemVal = apiData.infoName;
                break;
              case 'Model':
              case 'model':
              case 'PartModel':
                itemVal = apiData.ModelName;
                break;
              default:
                let query = this.inputData.actionQueryValues;
                if (query != '') {
                  let queryVal = JSON.parse(query);
                  if (field == 'parts' || field == 'technicianInfo') {
                    console.log(apiData, queryVal)
                    this.itemCode = apiData[queryVal[1]];
                    itemVal = apiData[queryVal[2]];
                  } else {
                    itemVal = apiData[queryVal[1]];
                  }
                }
                break;
            }
            this.itemVal = itemVal;
            if (field == 'technicianInfo') {
              this.submitActionFlag = (this.itemCode != '' && this.itemVal.length >= 10) ? true : false;
            } else {
              this.itemVal = itemVal;
              this.submitActionFlag = (this.itemVal != '') ? true : false;
            }
          } else {
            this.submitActionFlag = false;
          }
        });
        break;
    }
  }

  // Apply Tag Selection
  applySelection(actionType) {
    if (this.access == 'LookupDataPM') {
      console.log(this.selectionList);
      this.manageListItem('disable', '');
    }
    else {
      console.log(this.filteredTags, this.filteredLists, this.selectionList)
      switch (this.inputData.field) {
        case 'complaintCategory ':
          this.selectionList.forEach(item => {
            let id = item.id;
            let name = item.name;
            if(name == 'undefined' || name == undefined) {
              let listIndex = this.listItems.findIndex(option => option.id == id);
              if(listIndex >= 0) {
                item.name = this.listItems[listIndex].name;
              }
            }
          });
          break;      
      }
      if (this.clearFlag) {
        this.selectionList = [];
        // if(this.title == "Product Model"){
        //   this.selectedItems.emit({value:this.selectionList,res:this.responseData});
        // }else{
          this.selectedItems.emit(this.selectionList);
        // }
        this.activeModal.dismiss('Cross click');
      } else if ((this.headerCheck == 'checked' || this.headerCheck == 'all' || this.filteredTags.length > 0)) {
        console.log(this.access, this.filteredTags, this.filteredLists, this.selectionList)
        if (this.headerCheck != 'unchecked') {
          let checkArr = ['id', 'name'];
          let unique = this.commonApi.unique(this.selectionList, checkArr);
          if (this.access == 'Error Codes' || this.access == 'New Thread Error Codes') {
            console.log(this.filteredLists, this.selectionList, this.manageList);
            for (let t in this.filteredTags) {
              let eindex = this.manageList.findIndex(option => option.id == this.filteredTags[t]);
              let ename;
              console.log(eindex);
              if (eindex > 0) {
                ename = `${this.manageList[eindex].code}##${this.manageList[eindex].desc}`;
              }
              else {
                ename = '';
              }
              let sindex = this.selectionList.findIndex(option => option.id == this.filteredTags[t]);
              if (sindex < 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                  ename: ename
                });
                console.log(eindex);
              }
            }
          } else if (this.access == 'newthread' && this.inputData.field == 'prodCode') {
            for (let t in this.filteredTags) {
              if (this.filteredTags[t].length > 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                });
              }
            }
            this.selectionList = unique;
          }
          else if (this.access == 'newthread' && this.inputData.field == 'escalationLookup') {
            for (let t in this.filteredTags) {
              if (this.filteredTags[t].length > 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                  productModelsCount: this.filteredModelsCount[t],
                });
              }
            }
            this.selectionList = unique;
          }
          else if (this.access == 'newthread' && ( this.inputData.field == 'dekra-subscription' ||  this.inputData.field == 'dekra-certification')) {
                  let cdate = '';
                  let edate = '';
                  this.cError = false;
                  this.cErrorMsg = "";
                  let validationText1 = this.inputData.field == 'dekra-certification' ? 'Certification/Expiration' : 'Enrolled/Renewal';
                  let validationText2 = this.inputData.field == 'dekra-certification' ? 'Certification' : 'Enrolled';
                  let validationText3 = this.inputData.field == 'dekra-certification' ? 'Expiration' : 'Renewal';
                  for(let sl in this.selectionList) {        
                    cdate = ((document.getElementById("touchui-sdate-"+this.selectionList[sl].id) as HTMLInputElement).value);
                    edate = ((document.getElementById("touchui-edate-"+this.selectionList[sl].id) as HTMLInputElement).value);
                    
                    if(cdate == '' || edate == ''){  
                      // this.cError = true;
                      // this.cErrorMsg = "Please enter the valid "+validationText1+" for below selected items";
                      // return false;
                    } 
                    else{
                      var c1date = new Date(cdate);
                      var e1date = new Date(edate);
                      if (c1date.valueOf() > e1date.valueOf()) {
                        this.cError = true;
                        this.cErrorMsg = validationText2+" Date should be less than "+validationText3+" Date";
                        return false;
                      }                      
                    }       
                  }

                  for (let t in this.filteredTags) {
                    if (this.filteredTags[t].length > 0) {
                      this.selectionList.push({
                        id: this.filteredTags[t],
                        name: this.filteredLists[t],
                        sdate: this.selectionList[t].sdate,
                        edate: this.selectionList[t].edate,
                      });
                    }
                  }
            this.selectionList = unique;
          }
          else {
            for (let t in this.filteredTags) {
              if (this.filteredTags[t].length > 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                });
              }
            }
            this.selectionList = unique;
          }
          checkArr = ['id', 'name'];
          unique = this.commonApi.unique(this.selectionList, checkArr);
          this.selectionList = unique;
          if(this.pageAccess == 'adas-procedure' && this.inputData.field == 'model') {
            this.selectionList.forEach(item => {
              let id = item.id;
              let listIndex = this.listItems.findIndex(option => option.id == id);
              console.log(this.listItems[listIndex])
              if(listIndex >= 0) {
                item.name = this.listItems[listIndex].name;
                item.make = this.listItems[listIndex].makeItems[0].id;
              }
            });
          }
          if(this.title == "Product Model"){
            this.validateModel(this.selectionList[0].id)
          }else{
            if(this.oemDuplicateCheckKey.length > 0){
              if(this.oemDuplicateCheckKey.includes(this.selectionList[0].id)){
                this.oemDuplicate = true;
                setTimeout(() => {
                  this.oemDuplicate = false;
                }, 2000);
              }else{
                this.title = "";
                console.log(this.selectionList)
                this.selectedItems.emit(this.selectionList);
                this.activeModal.dismiss('Cross click');
              }
            }else{
              this.title = "";
              console.log(this.selectionList)
              this.selectedItems.emit(this.selectionList);
              this.activeModal.dismiss('Cross click');
            }
          }
        } else {
          if (this.closeFlag) {
            this.activeModal.dismiss('Cross click');
            setTimeout(() => {
              this.closeFlag = false;
            }, 20);
          }
        }
      } else {
        if (actionType == 'trigger') {
          this.activeModal.dismiss('Cross click');
        }
      }
    }
  }

  close() {
    this.title = "";
    switch (this.access) {
      case 'LookupDataPM':
        this.selectedItems.emit(1);
        break;

      /*case 'Tags':
      case 'New Thread Tags':
      case 'newthread':
        //this.activeModal.dismiss('Cross click');
        if(this.selectionList.length == 0 && this.filteredTags.length == 0 || this.clearFlag) {
          this.activeModal.dismiss('Cross click');
        } else {
          this.closeFlag = true;
          this.applySelection('trigger');
        }
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        console.log(this.selectionList.length, this.filteredErrorCodes.length);
        if(this.selectionList.length == 0 && this.filteredErrorCodes.length == 0 || this.clearFlag) {
          this.activeModal.dismiss('Cross click');
        } else {
          this.closeFlag = true;
          this.applySelection('trigger');
        }
        break;
      */
      case 'Error Codes':
      case 'New Thread Error Codes':
        console.log(this.selectionList, this.filteredErrorCodes)
        this.selectionList = [];
        this.filteredErrorCodes = [];
        this.activeModal.dismiss('Cross click');
        break;
      default:
        this.activeModal.dismiss('Cross click');
        break;
    }
  }

  // On Submit
  onSubmit() {
    /*this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.searchKey;
      this.submitSearch();
    }*/
    if(this.filterCall && this.access == 'New Thread Error Codes'){ return false ;}
    console.log(this.searchForm.value)
    this.searchVal = this.searchForm.value.searchKey;
    if (this.searchVal != '') {
      this.searchValOld = this.searchVal;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    if(this.searchValOld == '' && this.searchVal == ''){}
    else{
      this.searchForm.value.searchKey = searchValue;
      this.searchTick = (searchValue.length > 0) ? true : false;
      this.searchClose = this.searchTick;
      this.searchVal = searchValue;
      if(this.filterCall && this.access == 'New Thread Error Codes') {
        console.log(this.manageList)
        let filteredList = this.manageList.filter(option => option.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
        if(filteredList.length > 0) {
          this.empty = false;
          for(let t in this.listItems) {
            this.listItems[t].displayFlag = false;
            for(let f in filteredList) {
              if(this.listItems[t].name == filteredList[f].name) {
                this.listItems[t].displayFlag = true;
              }
            }
          }
        } else {
          this.empty = true;
          this.successMsg = "No Result Found";
        }
      } else {
        if (searchValue.length == 0) {
          this.submitted = false;
          if (this.listTotal != this.manageList.length || (this.listTotal == 0 && this.manageList.length == 0)) {
            this.clearSearch();
          }
        }
        if (this.listAction) {
          localStorage.setItem('searchVal', this.searchVal);
        }
      }    
    }
  }

  // Submit Search
  submitSearch() {
    
    let i = 0;
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    this.empty = false;

    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.getTagInfo(i);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
        this.getErrorCodes(i);
        break;
      case 'LookupDataPM':
        this.getLookUpInfo(i);
        break;
      case 'newthread':
      case 'newAdasSystem':
      case 'New Parts':
      case 'techinfo':
      case 'mediaUpload':
        let field = this.inputData.field;
        if(field == 'category'){
          this.getCatgInfo(i);
        }
        else if(field == 'keyword'){
          this.getKeywordInfo(i);
        }
        else if(field == 'dekra-shoptype' || field == 'dekra-dms' || field == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy' 
        || field == 'dekra-subscription' || field == 'dekra-certification' ){
          this.getDekraCommonInfo(i);
        }
        else if(field == 'folders'){
          this.getFolderInfo(i);
        }
        else{
          this.getData(i);
        }
        break;
    }
  }

  // Clear Search
  clearSearch(action = '') {
    if(this.filterCall && this.access == 'New Thread Error Codes') {
      this.empty = false;
      this.searchVal = '';
      this.listItems.forEach(item => {
        item.displayFlag = true;
      });
      return false;
    }
    let i = 0;
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    let newFlag = (action == 'new' && this.empty) ? true : false;
    this.empty = false;
    console.log(action, newFlag)
    this.searchVal = '';
    this.searchValOld = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.actionFlag = false;
    if (action == '') {
      localStorage.removeItem('searchVal');
    }
    let accessIndex = (this.listTotal != this.manageList.length) ? -1 : 0;
    accessIndex = (action == 'new' && newFlag) ? -3 : accessIndex;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.getTagInfo(accessIndex);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
        this.getErrorCodes(accessIndex);     
        break;
      case 'newthread':
      case 'newAdasSystem':
      case 'New Parts':
      case 'techinfo':
      case 'mediaUpload':
        let field = this.inputData.field;
        if(field == 'category'){
          this.getCatgInfo(accessIndex);
        }
        else if(field == 'dekra-shoptype' || field == 'dekra-dms' || field == 'dekra-franchise' || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy' 
        || field == 'dekra-subscription' || field == 'dekra-certification' || field == 'dekra-template'){
          this.getDekraCommonInfo(accessIndex);
        }
        else if(field == 'keyword'){
          this.getKeywordInfo(accessIndex);
        }
        else if(field == 'folders'){
          this.getFolderInfo(accessIndex);
        }
        else{
          this.getData(accessIndex);
        }
        break;
    }
  }

  // Disable Field
  disableSelection() {
    return this.actionFlag;
  }

  // Get Data
  getData(index) {
    // console.clear()
    console.log(index, this.inputData, this.apiData.data)

    if (this.access == 'gtsDynamicOptions') {
      this.listItems = this.apiData.data.actionOptions
      this.listItems.forEach((items) => {
        items.displayFlag = true;
        items.action = ''
      })
      this.loading = false;
      return
    }
    //this.listAction = false;
    this.loading = true;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;

    let apiData = this.apiData;
    let apiUrl = this.inputData.apiUrl;
    let field = this.inputData.field;
    let body: HttpParams = new HttpParams();
    if (field != "PartType") {
      apiData['offset'] = this.offset;
      apiData['limit'] = this.limit;
      apiData['searchKey'] = this.searchVal;
    }
    let newApiReq: any = false;

    Object.keys(apiData).forEach(key => {
      let value = apiData[key];
      body = body.append(key, value);
      if (key == 'commonApiValue') {
        newApiReq = true;
      }
    });
    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      console.log(response);
      let resultData;
      let item: any = [];
      this.manageList = (index >= -1) ? [] : this.manageList;
      let initText = (index >= 0) ? 'init' : 'get';
      switch (field) {
        case 'adasSystem':
          resultData = response.data.items;
          resultData.forEach(aitem => {
            this.manageList.push(aitem);
          });
          break;
        case 'model':
        case 'PartModel':
          resultData = response.modelData;
          for (let res in resultData) {
            resultData[res]['id'] = resultData[res]['uId'];
            this.manageList.push(resultData[res]);
          }
          break;
        case 'vinNo':
        case 'vinNoScanTool':
          resultData = response.vinDetails;
          for (let res in resultData) {
            this.manageList.push(resultData[res][0]);
          }
          break;
        case 'parts':
        case 'Media Manager':
          resultData = response.items;
          for (let res in resultData) {
            this.manageList.push(resultData[res]);
          }
          break;
        case 'prodCode':
          resultData = response.items;
          let total = response.total;
          item = [];
          if (total > 0) {
            for (let list of resultData) {
              let name = list.name.replace('###', '-')
              item.push({
                id: list.id,
                name: name,
                prodType: list.productType,
                model: list.modelName
              });
            }
            console.log(item)
            for (let res in item) {
              this.manageList.push(item[res]);
            }
          } else {
            this.manageList = item;
          }
          break;
        case 'countryList':
          resultData = response.loopUpData;
          for (let res in resultData) {
            this.manageList.push(resultData[res]);
          }
          break;
        case 'PartType':
        case 'PartAssembly':
        case 'PartSystem':
          resultData = response.attributesInfo;
          resultData = (field == 'PartType') ? resultData.PartType : (field == 'PartAssembly') ? resultData.partAssembly : resultData.partSystem;
          for (let res in resultData) {
            this.manageList.push(resultData[res]);
          }
          break;
        default:
          if(field == "category"){
            resultData = response.category;
            newApiReq = true;
          }
          else if(field == 'dekra-shoptype' || field == "dekra-dms" || field == "dekra-franchise" || this.inputData.field == 'dekra-ServiceOffered' || this.inputData.field == 'dekra-FacilityFeatures' || this.inputData.field == 'dekra-webLinks' || this.inputData.field == 'dekra-subscriptionPolicy'
          || field == 'dekra-subscription' || field == 'dekra-certification' || field == 'dekra-template'){
            resultData = response.items;
            newApiReq = true;             
          }
          else if(field == "keyword"){
            resultData = response.items;
            newApiReq = true;            
          }
          else if(field == "make"){
            resultData = response.modelData;
            newApiReq = true;
          }
          else if(field == "threadcategory" || field == 'Category' || field == 'Emissions'){
            resultData = response.items;
            newApiReq = true;
          }
          else if(field == "team"){
            resultData = response.teamList;
            newApiReq = true;            
          }  
          else if(field == "workstream"){
            resultData = response.items;
            newApiReq = true;            
          } 
          else if(field == "manufacturer"){
            resultData = response.items;
            console.log(resultData)
            newApiReq = true;            
          }
          else if(field == "dekra-shopList"){
            resultData = response.items;
            newApiReq = true;  
          }
          else{
            resultData = (newApiReq) ? response.items : response.data;
          }
          let itemTotal = (newApiReq) ? response.total : resultData.total;
          if(field == "team"){
            itemTotal = resultData.length;
          }
          console.log(resultData)
          console.log(itemTotal)
          let resItems = (newApiReq) ? resultData : resultData.items;
          item = [];
          if (itemTotal > 0) {
            for (let list of resItems) {
              if (this.access == 'techinfo') {
                item.push({
                  id: list.id,
                  name: `${list.name} - ${list.phoneNo}`,
                  phoneNo: list.phoneNo
                });
              }
              else if (this.access == 'newthread' && field == 'escalationLookup') {
                item.push({
                  id: list.id,
                  name: list.name,
                  productModelsCount: list.productModelsCount
                });
              }
              else if (this.access == 'newthread' && field == 'category') {
                item.push({
                  id: list.id,
                  name: list.categoryName,
                });
              }
              else if (this.access == 'newthread' && field == 'make') {
                item.push({
                  id: list.id,
                  name: list.makeName,
                });
              }
              else if(field == "dekra-template"){
                item.push(list);
              }
              else {
                let listId = (this.access == 'newthread' && field == 'Category') ? list.id.toString() : list.id;
                item.push({
                  id: listId,
                  name: list.name
                });
              }

            }
            for (let res in item) {
              this.manageList.push(item[res]);
            }
          } else {
            this.manageList = item;
          }
          break;
      }

      if (index <= 0) {
        let itemListLen = this.manageList.length;
        console.log(this.manageList);
        console.log(itemListLen)
        this.itemLength = itemListLen;
        this.empty = (itemListLen < 1) ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.itemTotal = response.total;
          if(field == "manufacturer"){
            this.itemLength = this.manageList.length;
          }
          else{
            this.itemLength += resultData.length;
          }
          

          console.log(this.itemTotal)
          console.log(this.itemLength)
          this.offset += this.limit;
        }
      } 

      setTimeout(() => {
        this.initList(initText, this.manageList);
      }, 100);

      if (this.searchNew) {
        this.manageTag('new', 0);
      }

    });
  }

  // Check Item Exists
  checkItemExists(index, value) {
    let apiData = {
      apiKey: this.apiData['apiKey'],
      userId: this.apiData['userId'],
      domainId: this.apiData['domainId'],
      countryId: this.apiData['countryId'],
      isValidate: 1
    };
    switch (this.inputData.field) {
      case 'category':
        apiData['categoryName'] = value;
        break;
      case 'dekra-shoptype':
      case 'dekra-shopList':
      case 'dekra-dms':
      case 'dekra-subscriptionPolicy':
      case 'dekra-franchise':
      case 'dekra-subscription':
      case 'dekra-certification':
      case 'dekra-template':
      case 'dekra-ServiceOffered':
      case 'dekra-FacilityFeatures':
      case 'dekra-webLinks':
        apiData['type'] = this.apiData['type'];
        apiData['label'] = this.apiData["label"] ? this.apiData["label"] : '';
        apiData['networkId'] = this.apiData['networkId'];
        apiData['name'] = value;
        break;
      case 'keyword':
        apiData['tagName'] = value;
        apiData['workstreams'] = this.apiData["groupId"];
        break;
      case 'make':
        apiData['makeName'] = value;
        break;
      case 'folders':
        apiData['workstreams'] = this.apiData["workstreamsList"];
        apiData['folderName'] = value;
        break;
      case 'model':
      case 'PartModel':
        apiData['ModelName'] = value;
        break;
      case 'colour':
        apiData['colorValueId'] = this.listItems[index].id;
        apiData['colorValueName'] = value;
        apiData['workstreamList'] = [];
        break;
      case 'info-1':
      case 'info-2':
      case 'info-3':
      case 'info-4':
      case 'info-5':
      case 'info-6':
      case 'info-7':
        apiData['infoId'] = this.listItems[index].id;
        apiData['infoName'] = value;
        apiData['workstreamList'] = [];
        break;
      default:
        let query = this.inputData.actionQueryValues;
        console.log(query)
        if (query != '') {
          let queryVal = JSON.parse(query);
          apiData[queryVal[0]] = this.listItems[index].id;
          apiData[queryVal[1]] = value;
          queryVal.forEach(q => {
            switch (q) {
              case 'commonApiValue':
                console.log(this.commonApiValue)
                apiData[q] = this.commonApiValue;
                break;
            }
          });
        }
        break;
    }

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  setupFilteredItems(id) {
    if (this.selection == 'multiple') {
      switch (this.access) {
        case 'Tags':
        case 'New Thread Tags':
        case 'newthread':
        case 'newAdasSystem':
          if (this.filteredTags.length > 0) {
            let rmIndex = this.filteredTags.findIndex(option => option == id);
            if (rmIndex >= 0) {
              this.filteredTags.splice(rmIndex, 1);
              this.filteredLists.splice(rmIndex, 1);
            }
          }
          console.log(this.filteredModelsCount.length);
          if (this.filteredModelsCount.length > 0) {
            let rmIndex1 = this.filteredTags.findIndex(option => option == id);
            if (rmIndex1 >= 0) {
              this.filteredModelsCount.splice(rmIndex1, 1);
            }
          }
          break;
        case 'Error Codes':
        case 'New Thread Error Codes':
          if (this.filteredErrorCodes.length > 0) {
            let rmIndex = this.filteredErrorCodes.findIndex(option => option == id);
            if (rmIndex >= 0) {
              this.filteredErrorCodes.splice(rmIndex, 1);
              this.filteredLists.splice(rmIndex, 1);
            }
          }
          break;
      }
    }
  }

  // remove option
  removeConfirm(index,id,name){
    this.bodyElem.classList.add("auth-open-remove-popup");
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'ppfrconfirmation';
    modalRef.componentInstance.title = '';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.deleteOption(index,id,name);
      }
    });
  }

  deleteOption(index,id,name){
    if(this.inputData.field == 'folders'){
      let formData = new FormData();
      formData.append("apiKey", this.apiData["apiKey"]);
      formData.append("domainId", this.apiData["domainId"]);
      formData.append("countryId", this.apiData["countryId"]);
      formData.append("userId", this.apiData["userId"]);
      formData.append("folderId", id);
      formData.append("folderName", name);
      formData.append("deleteStatus", "2");

      this.authenticationService.apiSaveDocumentFolder(formData).subscribe((response) => {
        if(response.status=='Success'){
          localStorage.setItem('documentRefresh','1');
          this.listItems.splice(index, 1);
          let rmIndex = this.selectionList.findIndex(option => option.id == id);
          this.selectionList.splice(rmIndex, 1);
          setTimeout(() => {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            if (this.activeListshow == true) {
              this.DisableText = 'Disable';
            } else {
              this.DisableText = 'Enable';
            }
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : this.headercheckDisplay;
          }, 100);
        }
        else{
          // error
        }
      });
    }
    else if(this.inputData.field == 'keyword'){
      return false;
    }
    else{
      let formData = new FormData();
      formData.append("apiKey", this.apiData["apiKey"]);
      formData.append("domainId", this.apiData["domainId"]);
      formData.append("countryId", this.apiData["countryId"]);
      formData.append("userId", this.apiData["userId"]);
      formData.append("tagId", id);
      let callableURL = this.commonApi.apiDeleteTag(formData);
      if (this.pageType == 'market-place') {
        callableURL = this.commonApi.deleteTagMarketPlace(id);
      }
      callableURL.subscribe((response) => {
        if(response.status=='Success'){
          this.listItems.splice(index, 1);
        }
        else{
          // error
        }
      });
    }


  }

  inputFocus() {
    setTimeout(() => {
      this.setFocusToInput();
    }, 400);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }

  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {
    //this.setFocusToInput();
  }

  setFocusToInput() {
    this.focusInput.nativeElement.focus();
  }

  // Editor Onchange
onTextChange(event,type,item) {
  console.log(item)
  console.log(type)
  //this.today = moment(event).format('YYYY-MM-DD');
 let val =  (moment(event).format('MMM DD, YYYY'));
 console.log(val)
  this.cError = false;
  this.cErrorMsg = "";
  console.log(this.selectionList)
  for (let st of this.selectionList) {
    console.log(st.id);
    if (st.id == item.id) {
      if(type == 'sdate'){
        st.sdate = val;
      }
      if(type == 'edate'){ 
        st.edate = val;
      }
    }
  }

  console.log(this.selectionList)

}

  ngOnDestroy() {
    document.body.classList.remove("manage-popup-new");
    let url = this.router.url.split('/');
    if(url[1] == 'documents') {
      if(!document.body.classList.contains(this.bodyClass1)) {
        document.body.classList.add(this.bodyClass1);
      }
    }
    if(url[1] == 'headquarters') {
      this.bodyElem.classList.remove("certification-modal");
      this.bodyElem.classList.remove("profile-certificate");  
    }

  }

}
