import { Component, ViewChild, HostListener,Directive,Renderer2,ElementRef,AfterViewInit, OnInit,Input,OnDestroy, NgModuleRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { ScrollTopService } from '../../../../../services/scroll-top.service';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { Constant,windowHeight, IsOpenNewTab} from '../../../../../common/constant/constant';
import { MessageService } from 'primeng/api';
import { SuccessComponent } from '../../../../../components/common/success/success.component';
import { EscalationsService } from '../../../../../services/escalations/escalations.service';
import { ManageListComponent } from '../../../../../components/common/manage-list/manage-list.component';
import { ExportFileComponent } from '../../../../../components/common/export-file/export-file.component';
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CommonService } from '../../../../../services/common/common.service';
declare var $:any;
import * as moment from 'moment';
import { ConditionalExpr } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [MessageService]
})
export class IndexComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  frozenCols=[];
  cols=[];
  primetablerowdata: {productOptions: Array<any>,productModelsCount: string,L1esc: Array<any>,L2esc: Array<any>,L3esc: Array<any>,L4esc: Array<any>,L5esc: Array<any>,L6esc: Array<any>,qadL1: Array<any>,qadL2: Array<any>,qadL3: Array<any>};
  resultsModel=[];
  public itemLength: number = 0;
  public toggleClassMapping='tab-1';
  public globalCountrySelected='';
  public itemTotal: number;
  public escalationType:string = "";
  public itemList: object;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public countryDropDownList=[];
  totalRecords: number;
  public headerData: Object;
  public displayUnknownUsersPopup:boolean=false;
  public listItems = [];
  public unKnownUsersArr=[];
  pageAccess: string = "escalation-product";
  public ItemEmpty: boolean = false;
  public title:string = 'Escalation management';
  public searchVal: string = '';
  public pageloadedhere: string;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public loading: boolean = true;
  public displayNoRecords: string = '0';
  public matrixActionFlag: boolean;
  public loadDataEvent: boolean=false;
  public lazyloadDataEvent: boolean=false;
  public escalationMatrix_array=[];
  public recentSelectionParam = false;
  public recentSelectionParamValue = '';
  public isModelDatachanged: boolean=false;
  public isHeaderDatachanged: boolean=false;
  public publishbutton: boolean = false;
  public headerFlag: boolean = false;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public apiData: Object;
  public bodyElem;
  public productsList = [];
  public addednewProduct: boolean = false;
  public innerHeightFix: string='';
  public innerHeight: number;
  public emptyHeight: number;
  value2: string;
  public footerElem;
  public matrixFlag: any = null;
  public addnewrowbgcolor:string;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public bodyClass:string = "product-matrix-list";
  public defaultValue:string = 'defaultValue';
  public pageaccesstitle:string = "Escalation management";
  public IncrementAlchangeAdd:number=0;
  public checkedOptActDeAct:boolean=false;
  public selectedModelMatrix=[];
  public sortFieldEvent: string='';
  _selectedColumns: any[];
  _selectedhideColumns: any[];
    public dataFilterEvent;
    public isFilterApplied=false;
    public sortorderEvent;
    public productAttributesValues=[];
    public showuserdashboarddata=true;
    public configurationdata=false;
  showDealerShipData: boolean = false;
  showDealerShipDataNew: boolean = false;
  public edittableHeader: boolean = false;
  public headerChangedFlag: boolean = false;
  public escStopStatus = [];
  public days = [];
  public selectedDay;
  public escStopStatusVal;
  public bodyHeight: number;
  public hours = [];
  public hoursAlert = [];
  public escConfigList = [];
  public escConfigTotal;
  public escConfigAlertList = [];
  public escConfigAlertTotal;
  public levels = [];
  public matrixOffset: number = 0;
  public matrixLimit: number = 10;
  public defaultCountry={id:"49",name:"Colombia"};

  apiFormData: FormData;
  dealerShipLevelOffset: any = 0;
  public escLevelParam = [];
  public alertLevelParam = [];
  public stopStatus: string = '';

  public hardResetDealerShipLevelOffset: boolean = false;

  public bodyClass3:string = "profile";
  public downloadExcel:string = "";
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public unknownempty: boolean = false;
  get f() { return this.searchForm.controls; }

  @ViewChild('el') elRefs: ElementRef;
 @ViewChild('ptabletdata', { static: false }) tdptabletdata: ElementRef;
 public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  @ViewChild("dt", { static: false }) public dt: Table;

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private scrollTopService: ScrollTopService,
    private EscalationApi: EscalationsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private elRef : ElementRef,
    private renderer: Renderer2,
    private config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
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
    this.addnewrowbgcolor='addnewrow';
    this.user = this.authenticationService.userValue;
    this.globalCountrySelected=localStorage.getItem('countryId')
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.add(this.bodyClass);
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
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': true,
      'searchBg': false
    };
    this.productsList = [];
    this.productAttributesValues = [];
    this.dealerShipLevelOffset = 0;
    this.matrixOffset = 0;

    this.showuserdashboarddata = true;
    this.showDealerShipData = false;
    this.showDealerShipDataNew = false;
    this.configurationdata = false;
    this.loadCountryList();
    if(this.domainId!=97)
    {
      this.getProductMatrixColumn();
      this.getEmployeeEscalation();
    }


    setTimeout(() => {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
    }, 1000);



  }
  countryDataFilter(event)
  {
    let country_id=event.value.id;
    this.loading = true;
    this.globalCountrySelected=country_id;
    this.itemOffset = 0;
    this.toggleTab(this.toggleClassMapping);

  }
loadCountryList()
{
  let apiData = {
    apiKey: Constant.ApiKey,
    domainId: this.domainId,
    countryId: this.countryId,
    userId: this.userId,
    lookUpdataId: "29",
    loopUpData: "29",
    searchKey: "",
    fromPPFR: 1,



  }

    this.commonApi.getLoopUpDataList(apiData).subscribe((response) => {
      // let resultData = response.data;
      this.countryDropDownList = [];
      this.countryDropDownList = response.loopUpData;
     let countryData= response.loopUpData;
      if(countryData)
      {
        for (let cdta in countryData)
        {
          if(cdta=='0')
          {

            if(!this.globalCountrySelected)
            {
              this.globalCountrySelected=countryData[cdta].id;
            }

this.defaultCountry={id:countryData[cdta].id,name:countryData[cdta].name};
this.getProductMatrixColumn();
    this.getEmployeeEscalation();
          }
        }
      }



      console.log(this.countryDropDownList);
  });
  }


  checkHeaderchange(event) {
    console.log(event.target.value);
    this.isHeaderDatachanged = true;
  }

  headerValueEvent(event, colLis, defaultValue) {
    if (this.isHeaderDatachanged) {
      this.headerChangedFlag = false;
      this.isModelDatachanged = false;
      //this.publishbutton=true;
      //console.log(JSON.stringify(productuserLis)+'--'+JSON.stringify(event));
      // this.checkHeaderExists(colLis.id, colLis);
    }
  }

  onclickToolbar(event, productList) {
    let mkevar = '';
    let mkevar1 = '';
    this.loading = true;
    let sss = "{makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar}";
    //this.productsList.push(sss);
    this.addednewProduct = true;
    // this.uniqueproductId = productList.uId;
    // this.getProductLists();
    //this.productsList.unshift({uId:mkevar1,makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar,attributes1:mkevar,attributes2:mkevar,attributes3:mkevar,attributes4:mkevar});
    this.addnewrowbgcolor = 'addnewrow';
    this.publishbutton = true;
    setTimeout(() => {
      $(".addnewrow td").removeClass('frozenptabletow');
    }, 300);

  }

  toggleTab(_class) {
    if(_class == 'tab-3'){
      let url = `escalation-management/escalation-level`;
      let navHome = window.open(url, url);
      navHome.focus();
    }
    else{
      this.productsList = [];
      this.productAttributesValues = [];
      this.dealerShipLevelOffset = 0;
      this.toggleClassMapping=_class;
      this.matrixOffset = 0;
      this.itemLength = 0;
      switch (_class) {
        case 'tab-1':
          this.showuserdashboarddata = true;
          this.showDealerShipData = false;
          this.showDealerShipDataNew = false;
          this.configurationdata = false;
          this.getProductMatrixColumn();
          this.getEmployeeEscalation();
          break;
        case 'tab-2':
          this.showuserdashboarddata = false;
          this.showDealerShipData = true;
          this.showDealerShipDataNew = false;
          this.configurationdata = false;
          this.dealerShipLevelEscalation();
          break;
        case 'tab-3':
          this.showuserdashboarddata = false;
          this.showDealerShipData = false;
          this.showDealerShipDataNew = false;
          this.configurationdata = true;
          this.bodyHeight = window.innerHeight;
          this.setScreenHeight();
          this.configurationEscalation();
          this.getAlertEscalationConfigData();
          break;
        case 'tab-7':
          this.showuserdashboarddata = false;
          this.showDealerShipData = false;
          this.showDealerShipDataNew = true;
          this.configurationdata = false;
          this.getProductMatrixColumn();
          this.dealerShipLevelEscalationNew();
          break;

        default:
          break;
      }
    }
  }

  setItemArray(value)
  {

    return value.map(e => e.name).join(", ");

  }

  manageOption(eventData, prodList, hId, colName) {
    let hId2 = parseInt(hId) + 1;
    this.primetablerowdata = prodList;
    console.log(eventData);

    //  data.push();


    let elss1=document.getElementById('product_options'+prodList.uId+hId);




    //var yourElm = document.getElementById("yourElm"); //div in your original code
  var selector = "td";

  var parent_2 = this.findParentBySelector(elss1, selector);
   // let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
  //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
  //this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+20));
  //this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;
  let apiData = {
    'apiKey': Constant.ApiKey,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'userId': this.userId,
    'field':'escalationLookup',
    'commonApiValue': eventData[0].commonApiValue,
    'lookupHeaderName': eventData[0].attrName,

  };
  let dataId = [];
  let dataName = [];
  let dataModelsCount = [];
  for (let ist in eventData)
  {
    if(eventData[ist].name == 'Select Options'){
      dataId = [];
      dataName = [];
    }
    else{
      dataId.push(eventData[ist].id);
      dataName.push(eventData[ist].name);
      dataModelsCount.push(eventData[ist].productModelsCount);
    }
  }


  console.log(eventData);
  console.log(dataId);
  console.log(dataName);
  console.log(dataModelsCount);

    const modalRef = this.modalService.open(ManageListComponent, { backdrop: 'static', keyboard: false, centered: true });
  modalRef.componentInstance.accessAction = false;
  modalRef.componentInstance.access = 'newthread';
  modalRef.componentInstance.apiData = apiData;
  modalRef.componentInstance.filteredTags = dataId;
  modalRef.componentInstance.filteredLists = dataName;
  modalRef.componentInstance.filteredModelsCount = dataModelsCount;
  modalRef.componentInstance.height = innerHeight;

  let title="";
  if(this.showDealerShipDataNew){
    title = eventData[0].attrName;
  }
  else{
    title = 'Product Model';
  }
  //modalRef.componentInstance.access = eventData.name;
  let inputData1 = {
    actionApiName: "",
    actionQueryValues: "",
    selectionType: "multiple",
    field:'escalationLookup',
    //title: eventData[0].name,
    title: title,
    filteredItems: dataId,
    filteredLists: dataName,
    filteredModelsCount: dataModelsCount,
    baseApiUrl: Constant.TechproMahleApi,
    apiUrl: Constant.TechproMahleApi+""+Constant.filterCommonAttributeApiUrl,
 };
  modalRef.componentInstance.inputData = inputData1;

  modalRef.componentInstance.selectedItems.subscribe((receivedService) => {

    let prodoptionInfoId=[];
    modalRef.dismiss('Cross click');
    let tagItems = receivedService;
    console.log(receivedService);
    let modelsCount = '';
    let id = '';
    let name = '';
    let productModelsCount=0;
    this.primetablerowdata.productOptions=[];
    if(receivedService){
      this.publishbutton=true;
      console.log(tagItems.length);
      if(tagItems.length>0){
        for(let tst in tagItems){
          id = tagItems[tst].id;
          prodoptionInfoId.push(id);
          name = tagItems[tst].name;
          modelsCount = tagItems[tst].productModelsCount;
          console.log(modelsCount);
          if(tagItems[tst].productModelsCount>0){
            productModelsCount += parseInt(tagItems[tst].productModelsCount);
          }
          console.log(productModelsCount);
          let chkIndex = this.primetablerowdata.productOptions.findIndex(
            (option) => option.id == id
          );
          if (chkIndex < 0) {
            this.primetablerowdata.productOptions.push({id:id,name:name,modelsCount:modelsCount,productOptionDataJSON:JSON.stringify(prodoptionInfoId),attrName:eventData[0].attrName,commonApiValue:eventData[0].commonApiValue});
            if(productModelsCount>0){
              this.primetablerowdata.productModelsCount = productModelsCount.toString();
            }
            else{
              this.primetablerowdata.productModelsCount = '';
            }
          }
        }
        console.log(this.primetablerowdata.productOptions);
      }
      else{
        this.primetablerowdata.productOptions.push({id:id,name:'Select Options',modelsCount:modelsCount,productOptionDataJSON:'',attrName:eventData[0].attrName,commonApiValue:eventData[0].commonApiValue});
        this.primetablerowdata.productModelsCount = '';
      }

    }
    //this.primetablerowdata.productOptions=[{id:1,name:typeval,attrId:1,attrName:typeval,commonApiValue:1}];
    //this.primetablerowdata.productOptions=[{id:eventData.id,name:typeval,attrId:1,attrName:eventData.attrName,commonApiValue:eventData.commonApiValue}];
    this.renderer.addClass(parent_2, 'selectedItemp-table-light');
    this.renderer.addClass(elss1, 'selectedItemp-tabletdcolor-light');
    this.renderer.removeClass(parent_2, 'selectedItemp-table-border');
    this.renderer.removeClass(elss1, 'selectedItemp-tabletdcolor-border');

    let elss2=document.getElementById('product_models'+prodList.uId+hId);
    console.log(elss2);
    if(elss2 != null){
      var selector = "td";
      var parent_3 = this.findParentBySelector(elss2, selector);
      this.renderer.addClass(parent_3, 'selectedItemp-table');
      this.renderer.removeClass(parent_3, 'selectedItemp-table-border');
    }

    let modelInfoId='';

if(eventData[0].productAttribueId=='5')
{
//modelInfoId=id;
//prodoptionInfoId=[];
}
if(this.escalationMatrix_array.length>0)
{
for (let wsd in this.escalationMatrix_array)
{
  let studentObj =  this.escalationMatrix_array.find(t=>t.id==prodList.uId);
  if(studentObj)
  {
    this.escalationMatrix_array.find(item => item.id == prodList.uId).productAttributes = eventData[0].productAttribueId;
    this.escalationMatrix_array.find(item => item.id == prodList.uId).productOptions = JSON.stringify(prodoptionInfoId);
    if(this.showuserdashboarddata ){
      this.escalationMatrix_array.find(item => item.id == prodList.uId).modelId = modelInfoId;
    }
    else{
      this.escalationMatrix_array.find(item => item.id == prodList.uId).dealerId = modelInfoId;
    }
  }
  else
  {

    if(this.showuserdashboarddata ){
      this.escalationMatrix_array.push({
        "id":prodList.uId,
        "productAttributes":eventData[0].productAttribueId,
        [colName]:JSON.stringify(prodoptionInfoId),
        "modelId":modelInfoId
      });
    }
    else{
      this.escalationMatrix_array.push({
        "id":prodList.uId,
        "productAttributes":eventData[0].productAttribueId,
        [colName]:JSON.stringify(prodoptionInfoId),
        "dealerId":modelInfoId
      });
    }
  }
}
}
else
{
  if(this.showuserdashboarddata ){
    this.escalationMatrix_array.push({
      "id":prodList.uId,
      "productAttributes":eventData[0].productAttribueId,
      [colName]:JSON.stringify(prodoptionInfoId),
      "modelId":modelInfoId
    });
  }
  else{
    this.escalationMatrix_array.push({
      "id":prodList.uId,
      "productAttributes":eventData[0].productAttribueId,
      [colName]:JSON.stringify(prodoptionInfoId),
      "dealerId":modelInfoId
    });
  }
}

  console.log(this.escalationMatrix_array);

});

setTimeout(() => {
  this.makeRowsSameHeight();
}, 500);

  }


  newMatrix(index) {
   if(this.itemTotal == 0){
    this.ItemEmpty = false;
   }
    //alert(this.innerHeightFix);


    let mkevar='';
    let mkevar1='';
let sss="{makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar}";
   //this.productsList.push(sss);
   this.addednewProduct=true;

   this.productsList.unshift({uId:mkevar1,productAttributes:mkevar,productOptions:'',L1esc:[],L2esc:[],L3esc:[],L4esc:[],L5esc:[],L6esc:[],qadL1:[],qadL2:[],qadL3:[],productModelsCount:mkevar,productOptionDataJSON:'',editAccess:1});
this.addnewrowbgcolor='addnewrow';
this.publishbutton=true;
setTimeout(() => {
$(".addnewrow td").removeClass('frozenptabletow');
},300);
//$('#productmatrix-table-data').closest('tbody').children('tr:first').addClass('frozenptabletow');
  }

  dealerShipLevelEscalation() {
    console.log(this.dealerShipLevelOffset);
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    if(this.globalCountrySelected)
    {
      this.apiData['countryId']=this.globalCountrySelected;
    }
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', '2');
    apiFormData.append('limit', '10');
    apiFormData.append('offset', this.dealerShipLevelOffset);
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }
    if(this.sortFieldEvent) {
      apiFormData.append('sortOrderField', this.sortFieldEvent);
    }
    if(this.sortorderEvent) {
      apiFormData.append('sortOrderBy', this.sortorderEvent);
    }
    this.frozenCols = [
      // {
      // columnName: "id",
      // columnpclass: "frozenptabletow",
      // columnpredefind: "1",
      // field: "id",
      // header: "",
      // headerId: "8",
      // inputType: "4",
      // width: "50px"
      // },
      {
        columnName: "dealerName",
        columnpclass: "frozenptabletow text-uppercase dealerName",
        columnpredefind: "1",
        field: "dealerName",
        header: "Dealer Name",
        headerId: "2",
        inputType: "2",
        width: "200px"
      }];

    this.cols = [
      {
        "columnName": "dealerCode",
        "headerId": "2",
        "width": "180px",
        "field": "dealerCode",
        "header": "Dealer Code",
        "inputType": "5",
        "columnpclass": " text-uppercase text-center",
        "columnpredefind": "1"
      },
      {
        "columnName": "Zone",
        "headerId": "3",
        "width": "120px",
        "field": "Zone",
        "header": "Zone",
        "inputType": "5",
        "columnpclass": " text-uppercase text-center",
        "columnpredefind": "1"
      },
      {
        "columnName": "area",
        "headerId": "4",
        "width": "160px",
        "field": "area",
        "header": "Area",
        "inputType": "5",
        "columnpclass": " text-uppercase",
        "columnpredefind": "1"
      },
      {
        "columnName": "territory",
        "headerId": "5",
        "width": "180px",
        "field": "territory",
        "header": "Territory",
        "inputType": "5",
        "columnpclass": " text-uppercase",
        "columnpredefind": "1"
      },
      {
        "columnName": "userDname",
        "headerId": "6",
        "width": "250px",
        "field": "userDname",
        "header": "Dealer Name-User",
        "inputType": "5",
        "columnpclass": " text-uppercase",
        "columnpredefind": "1"
      },
      {
        "columnName": "userZone",
        "headerId": "7",
        "width": "180px",
        "field": "userZone",
        "header": "Zone-User",
        "inputType": "5",
        "columnpclass": " text-uppercase text-center",
        "columnpredefind": "1"
      },
      {
        "columnName": "userArea",
        "headerId": "8",
        "width": "180px",
        "field": "userArea",
        "header": "Area-User",
        "inputType": "5",
        "columnpclass": " text-uppercase text-center",
        "columnpredefind": "1"
      },
      {
        "columnName": "userTerritory",
        "headerId": "9",
        "width": "200px",
        "field": "userTerritory",
        "header": "Territory-User",
        "inputType": "5",
        "columnpclass": " text-uppercase text-center",
        "columnpredefind": "1"
      },
      {
        "columnName": "L1esc",
        "headerId": "10",
        "width": "300px",
        "field": "L1esc",
        "header": "L1 Name / Role",
        "inputType": "7",
        "columnpclass": "",
        "columnpredefind": "1"
      },
      {
        "columnName": "L2esc",
        "headerId": "11",
        "width": "300px",
        "field": "L2esc",
        "header": "L2 Name / Role",
        "inputType": "7",
        "columnpclass": "",
        "columnpredefind": "1"
      },
      {
        "columnName": "L3esc",
        "headerId": "12",
        "width": "300px",
        "field": "L3esc",
        "header": "L3 Name / Role",
        "inputType": "7",
        "columnpclass": "",
        "columnpredefind": "1"
      },
      {
        "columnName": "L4esc",
        "headerId": "13",
        "width": "300px",
        "field": "L4esc",
        "header": "L4 Name / Role",
        "inputType": "7",
        "columnpclass": "",
        "columnpredefind": "1"
      },
      // {
      //   "columnName": "toolbar",
      //   "columnpclass": "normalptabletow",
      //   "columnpredefind": "1",
      //   "field": "toolbar",
      //   "header": "Menu",
      //   "headerId": "9",
      //   "inputType": "6",
      //   "width": "50px"
      // }
    ]

    this._selectedColumns = this.cols;

    this.EscalationApi.GetProductEscalation(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        setTimeout(() => {
          this.makeRowsSameHeight();
        }, 500);
        this.itemTotal = response.total;
        let resultData = response.dealerDataInfo;
        this.downloadExcel = response.downloadExcel;
        let productAttributes = response.productAttributes;
        if(this.dealerShipLevelOffset === 0) {
            this.productsList = [];
            this.productAttributesValues = [];
        }
        for (let i in resultData) {
          this.productsList.push(resultData[i]);
        }

        for (let p in productAttributes) {
          this.productAttributesValues.push(productAttributes[p]);
        }
      }
      this.loading = false;
      this.loadDataEvent=false;

    }, err => {
      this.loading = false;
      this.loadDataEvent=false;

      console.error(err);
    });
  }

  dealerShipLevelEscalationNew() {

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);

    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);

    this.apiData['limit'] = this.matrixLimit;
    apiFormData.append('limit', this.apiData['limit']);
    this.apiData['offset'] = this.matrixOffset;
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('type', '2');
    apiFormData.append('version', '2');

    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }

  this.EscalationApi.GetProductEscalation(apiFormData).subscribe((response) => {
    if(response.status == "Success") {
      setTimeout(() => {
        this.makeRowsSameHeight();
      }, 500);
          this.itemTotal = response.total;
          console.log(this.itemTotal);
          if(this.itemTotal > 0){
            this.ItemEmpty = false;
            console.log(response.dataInfo);
            let resultData = response.dataInfo;
            let productAttributes = response.productAttributes;
            if(this.matrixOffset === 0) {
              this.itemLength = 0;
              this.productsList = [];
              this.productAttributesValues = [];
            }
            for (let i in resultData) {
              this.productsList.push(resultData[i]);
            }

            for (let p in productAttributes) {
              this.productAttributesValues.push(productAttributes[p]);
            }
            this.matrixOffset += this.matrixLimit;
            this.itemLength += this.productsList.length;
            this.displayNoRecords = '0';
            console.log(this.displayNoRecords);
          }
          else{
            this.ItemEmpty = true;
            this.matrixOffset = 0;
            this.itemLength = 0;
            this.itemLength = 0;
            this.productsList = [];
            this.productAttributesValues = [];

            let productAttributes = response.productAttributes;
            for (let p in productAttributes) {
              this.productAttributesValues.push(productAttributes[p]);
            }

            this.displayNoRecords = (this.apiData['searchKey'] =='' ) ? '1' : '2';
            console.log(this.displayNoRecords);
          }
    }
    this.loading = false;
    this.loadDataEvent=false;
    }, err => {
      this.loading = false;
      this.loadDataEvent=false;

      console.error(err);
    });

}

  getEmployeeEscalation() {

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    if(this.globalCountrySelected)
    {
      this.apiData['countryId']=this.globalCountrySelected;
    }
    else
    {
      this.apiData['countryId']=this.countryId;

    }
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);

    this.apiData['limit'] = this.matrixLimit;
    apiFormData.append('limit', this.apiData['limit']);
    this.apiData['offset'] = this.matrixOffset;
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('version', '2');

    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }

  this.EscalationApi.GetProductEscalation(apiFormData).subscribe((response) => {
    if(response.status == "Success") {
      setTimeout(() => {
        this.makeRowsSameHeight();
      }, 500);
          this.itemTotal = response.total;
          console.log(this.itemTotal);
          if(this.itemTotal > 0){
            this.ItemEmpty = false;
            console.log(response.dataInfo);
            let resultData = response.dataInfo;
            let productAttributes = response.productAttributes;
            if(this.matrixOffset === 0) {
              this.itemLength = 0;
              this.productsList = [];
              this.productAttributesValues = [];
            }
            for (let i in resultData) {
              this.productsList.push(resultData[i]);
            }

            for (let p in productAttributes) {
              this.productAttributesValues.push(productAttributes[p]);
            }
            this.matrixOffset += this.matrixLimit;
            this.itemLength += this.productsList.length;
            this.displayNoRecords = '0';
            console.log(this.displayNoRecords);
          }
          else{
            this.ItemEmpty = true;
            this.matrixOffset = 0;
            this.itemLength = 0;
            this.itemLength = 0;
            this.productsList = [];
            this.productAttributesValues = [];

            let productAttributes = response.productAttributes;
            for (let p in productAttributes) {
              this.productAttributesValues.push(productAttributes[p]);
            }

            this.displayNoRecords = (this.apiData['searchKey'] =='' ) ? '1' : '2';
            console.log(this.displayNoRecords);
          }
    }
    this.loading = false;
    this.loadDataEvent=false;
    }, err => {
      this.loading = false;
      this.loadDataEvent=false;

      console.error(err);
    });

}


funcall(hId,rowdata='')
  {
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
  saveproductItemsMatrix(resetOffset = false) {
    this.escalationType = '2';
    if (this.showuserdashboarddata) {
      this.escalationType = '1';
    }

    this.loading=true;
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'escalationType': this.escalationType,

      'countryId': this.globalCountrySelected,
      'params': JSON.stringify(this.escalationMatrix_array)
    };
    let matrixData = new FormData();
    matrixData.append('apiKey', apiData.apiKey);
    matrixData.append('userId', apiData.userId);
    matrixData.append('domainId', apiData.domainId);
    matrixData.append('type', apiData.escalationType);
    matrixData.append('countryId', apiData.countryId);
    matrixData.append('params', apiData.params);
    //if(this.recentSelectionParam){
      matrixData.append('recentselection', this.recentSelectionParamValue);
    //}
    if (this.showDealerShipData) {
      if (resetOffset) {
        this.hardResetDealerShipLevelOffset = true;
      }
      matrixData.append('type', '2');
    }

    //new Response(matrixData).text().then(console.log)

    this.matrixFlag = this.EscalationApi.SaveProductEscalationDataV2(matrixData).subscribe((response) => {

      if(response.status=='Success')
      {
        this.escalationMatrix_array=[];

        const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalMsgRef.componentInstance.msg = 'Escalation saved';
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
          $( "td" ).removeClass( "selectedItemp-table" );
          $( "td" ).removeClass( "selectedItemp-table-border" );
          $( "td" ).removeClass( "selectedItemp-table-light" );
          $( "td" ).removeClass( "selectedItemp-table-border-light" );
          $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor" );
          $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor-border" );
          $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor-light" );
          $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor-border-light" );

         this.loading=true;
         this.publishbutton=false;
         this.productsList=[];
          if (this.showDealerShipData) {
            this.dealerShipLevelOffset = 0;
            this.dealerShipLevelEscalation();
          } else if (this.showuserdashboarddata) {
            this.matrixOffset = 0;
            this.itemLength = 0;
            this.getProductMatrixColumn();
            this.getEmployeeEscalation();
          }
          else{
            this.matrixOffset = 0;
            this.itemLength = 0;
            this.getProductMatrixColumn();
            this.dealerShipLevelEscalationNew();
          }

        }, 2000);

      }
      else
  {
    this.loading=false;
  }
    });

    setTimeout(() => {
      this.makeRowsSameHeight();
    }, 500);
  }
  cancelproductItems() {
    // this.dt.reset();
    this.loading = true;
    this.itemOffset = 0;
    this.dealerShipLevelOffset = 0;
    this.matrixOffset = 0;
    this.itemLength = 0;
    this.checkedOptActDeAct = false;
    this.publishbutton = false;
    this.productsList = [];
    this.productAttributesValues = [];
    if (this.showuserdashboarddata) {
      this.getProductMatrixColumn();
      this.getEmployeeEscalation();
    } else if (this.showDealerShipData) {
      this.dealerShipLevelEscalation();
    }
    else if (this.showDealerShipDataNew) {
      this.getProductMatrixColumn();
      this.dealerShipLevelEscalationNew();
    }
    else{
      this.configurationEscalation();
      this.getAlertEscalationConfigData();
    }
  }

  saveConfiguration() {
    if(this.globalCountrySelected)
    {
      this.countryId=this.globalCountrySelected;
    }
    this.loading=true;
    console.log(this.escLevelParam.length);
    console.log(this.alertLevelParam.length);

    let escLevelParam = this.escLevelParam.length == 0 ? '' : JSON.stringify(this.escLevelParam);
    let alertLevelParam = this.alertLevelParam.length == 0 ? '' : JSON.stringify(this.alertLevelParam);

    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'escalationType': '3',
      'countryId': this.countryId,
      'stopStatus': this.stopStatus,
      'escLevelParam': escLevelParam,
      'alertLevelParam': alertLevelParam
    };
    let matrixData = new FormData();
    matrixData.append('apiKey', apiData.apiKey);
    matrixData.append('userId', apiData.userId);
    matrixData.append('domainId', apiData.domainId);
    matrixData.append('type', apiData.escalationType);
    matrixData.append('countryId', apiData.countryId);
    matrixData.append('stopStatus', apiData.stopStatus);
    matrixData.append('escLevelParam', apiData.escLevelParam);
    matrixData.append('alertLevelParam', apiData.alertLevelParam);

    console.log("stopStatus:"+apiData.stopStatus);
    console.log("escLevelParam:"+apiData.escLevelParam);
    console.log("alertLevelParam:"+apiData.alertLevelParam);

    this.matrixFlag = this.EscalationApi.SaveProductEscalationData(matrixData).subscribe((response) => {

      if(response.status=='Success')
      {
        const modalMsgRef = this.modalService.open(SuccessComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalMsgRef.componentInstance.msg = 'Escalation Configuration Updated';
        setTimeout(() => {
          this.loading=true;
          this.publishbutton=false;
          this.configurationEscalation();
          this.getAlertEscalationConfigData();
          modalMsgRef.dismiss('Cross click');
        }, 2000);
      }
      else
      {
        this.loading=false;
      }
        });
  }

  onChangemake(event, productsLis, hId, colName) {
    console.log(event);
    this.primetablerowdata = productsLis;
    setTimeout(() => {
      let hId2 = parseInt(hId) + 1;                           //<<<---using ()=> syntax
      let elss = document.getElementById('product_attributes' + productsLis.uId + hId);

      let elss1=document.getElementById('product_options'+productsLis.uId+hId2);




      //var yourElm = document.getElementById("yourElm"); //div in your original code
    var selector = "td";
    var parent = this.findParentBySelector(elss, selector);

    var parent_2 = this.findParentBySelector(elss1, selector);

     // alert(elss);

     //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
     // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

      this.renderer.addClass(parent, 'selectedItemp-table');
      this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
      this.renderer.removeClass(parent, 'selectedItemp-table-border');
      this.renderer.removeClass(elss, 'selectedItemp-tabletdcolor-border');

      this.renderer.addClass(parent_2, 'selectedItemp-table-light');
      this.renderer.addClass(elss1, 'selectedItemp-tabletdcolor-light');
      this.renderer.removeClass(parent_2, 'selectedItemp-table-border');
      this.renderer.removeClass(elss1, 'selectedItemp-tabletdcolor-border');

      this.publishbutton=true;

      //this.primetablerowdata.productOptions=[{id:event.value.id,name:'Select '+event.value.name,modelsCount:0,attrId:1,attrName:event.value.name,commonApiValue:event.value.commonApiValue,productAttribueId:event.value.id}];
      this.primetablerowdata.productOptions=[{id:event.value.id,name:'Select Options',modelsCount:0,productOptionDataJSON:'',attrId:1,attrName:event.value.name,commonApiValue:event.value.commonApiValue,productAttribueId:event.value.id}];
      this.primetablerowdata.productModelsCount='';


    }, 300);

    setTimeout(() => {
      this.makeRowsSameHeight();
    }, 500);
  }

  getProductMatrixColumn() {

    this.escalationType = '2';
    if (this.showuserdashboarddata) {
      this.escalationType = '1';
    }
    this.cols=[];
    this.frozenCols=[];
    //this.makeItemList = [];
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', this.escalationType);
    apiFormData.append('escalationType', this.escalationType);

    this.EscalationApi.getEscalationColumns(apiFormData).subscribe((response) => {


      if(response.status == "Success") {
       let columnVals= response.columnValues;
       let visibilityValuesvals= response.visibilityValues;
       let inputValuesval= response.inputValues;
     //  this.productinputTypeListdropvs.push({name:'System Defined',id:'1'});
        //this.productinputTypeListdropvs.push({name:'User Defined',id:'2'});
        for (let ipt in inputValuesval) {
          let iptplaceholder = inputValuesval[ipt].placeholder;
          let ipttype = inputValuesval[ipt].type;
          //this.productinputTypeListdrop.push({name:iptplaceholder,id:ipttype});

        }
        this.frozenCols = [];
        this.cols = [];
        for (let c in columnVals) {
          let colsname = columnVals[c].name;
          let colsfieldName = columnVals[c].fieldName;
          let colsplaceholder = columnVals[c].placeholder;
          let colsinputType = columnVals[c].inputType;
          let colsfrozenColumns = columnVals[c].frozenColumns;
          let colscolumnWidth = columnVals[c].columnWidth;
          let colscustomStyleClass = columnVals[c].customStyleClass;
          let colspredefind = columnVals[c].isPredefind;
          let colsid = columnVals[c].id;
          if (colsfrozenColumns == 1) {
            this.frozenCols.push({ columnName: colsname, headerId: colsid, width: colscolumnWidth, field: colsfieldName, header: colsplaceholder, inputType: colsinputType, columnpclass: colscustomStyleClass, columnpredefind: colspredefind });
          }
          else {
            this.cols.push({ columnName: colsname, headerId: colsid, width: colscolumnWidth, field: colsfieldName, header: colsplaceholder, inputType: colsinputType, columnpclass: colscustomStyleClass, columnpredefind: colspredefind });
          }
        }




       }
       this._selectedColumns = this.cols;
      // this._selectedhideColumns = this.showhidecols;
    });
  }

  openProfile(id) {
    window.open(`profile/${id}`,'_blank')
  }

  selectRow(checkValue,event) {



    //alert(checkValue.uId);
     if(checkValue.uId)
     {
       this.selectedModelMatrix.push(checkValue.uId);
       //this.updateMatrixValues(0);
     }


     console.log(event);
     if(event)
     {
       this.checkedOptActDeAct=true;
       this.IncrementAlchangeAdd= this.IncrementAlchangeAdd+1;
       this.publishbutton=true;
     }
     else
     {
       if(this.IncrementAlchangeAdd)
       {
         this.IncrementAlchangeAdd= this.IncrementAlchangeAdd-1;
       }
      if(!this.IncrementAlchangeAdd)
      {
       this.publishbutton=false;
       this.checkedOptActDeAct=false;
      }


     }
     console.log(checkValue);

   }

   checkAllp(event)
{
//alert(1);
}

  navigatePage(url) {
    this.router.navigate([url]);
  }

  loadPage(event)
  {
    console.log(event);
    this.itemOffset = 0;
    this.sortFieldEvent=event.sortField;
    this.sortorderEvent=event.sortOrder;
    this.dataFilterEvent=event.filters;
    this.isFilterApplied=true;
    this.dealerShipLevelOffset = 0;

    if(this.showDealerShipData) {
      this.loading=true;
      this.dealerShipLevelEscalation();
    }


   //this.getProductLists(this.showuserdashboarddataflag,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
  }
  scroll = (event: any): void => {
    //console.log(event);
    //console.log(event.target.className);
    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
    {



    let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-10;
      this.scrollTop = event.target.scrollTop-90;
      this.makeRowsSameHeight();
     //console.log(this.scrollTop +'--'+ this.lastScrollTop +'--'+ this.scrollInit);
  /*
      if(this.scrollTop >= this.lastScrollTop && this.scrollInit > 0) {
        console.log(inHeight +'--'+ totalHeight +'--'+ this.scrollCallback +'--'+ this.itemTotal +'--'+ this.itemLength);
        if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
          this.scrollCallback = false;
          this.loading=true;
          this.getuserDashboard();
        }
      }
      this.lastScrollTop = this.scrollTop;
      */
     //console.log(this.userdashboardparam);
     //console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+event.target.scrollHeight);
     if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
     {
     // table.reset()
      //this.dt.reset();
      console.log(event.target.scrollTop+event.target.offsetHeight +'--'+ event.target.scrollHeight);
      console.log(this.itemTotal +'--'+ this.itemLength);
      if(this.showDealerShipData && !this.loading) {
        this.loading=true;
        this.loadDataEvent=true;
        if(this.hardResetDealerShipLevelOffset) {
          this.hardResetDealerShipLevelOffset = false;
          this.dealerShipLevelOffset = 0;
        } else {
          this.dealerShipLevelOffset = Number(this.dealerShipLevelOffset) + 10;
        }
        this.dealerShipLevelEscalation();
      }
      if(this.showuserdashboarddata && !this.loading) {
        this.loading=true;
        this.loadDataEvent=true;
        //this.getProductMatrixColumn();
        this.getEmployeeEscalation();
      }
      if(this.showDealerShipDataNew && !this.loading) {
        this.loading=true;
        this.loadDataEvent=true;
        //this.getProductMatrixColumn();
        this.dealerShipLevelEscalationNew();
      }
      this.lastScrollTop = this.scrollTop;

      event.preventDefault;
     }
    }
  };

  makeRowsSameHeight() {
    setTimeout(() => {
        if (document.getElementsByClassName('p-datatable-scrollable-wrapper').length) {
            let wrapper = document.getElementsByClassName('p-datatable-scrollable-wrapper');
            for (let i = 0; i < wrapper.length; i++) {
               let w = wrapper.item(i) as HTMLElement;
               let frozen_rows: any = w.querySelectorAll('.p-datatable-frozen-view tr');
               let unfrozen_rows: any = w.querySelectorAll('.p-datatable-unfrozen-view tr');
               for (let i = 0; i < frozen_rows.length; i++) {
                 const frozenRow = frozen_rows[i].getBoundingClientRect();
                 const unfrozenRow = unfrozen_rows[i].getBoundingClientRect();

                 if (frozenRow.height > unfrozenRow.height) {
                     unfrozen_rows[i].style.height = frozenRow.height + 'px';
                  } else if (frozenRow.height < unfrozenRow.height)
                  {
                     frozen_rows[i].style.height = unfrozenRow.height + 'px';
                  }
                }
              }
            }
         });
       }
  applySearch(val) {
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
    this.matrixActionFlag = false;
  //  this.productsList = [];
    this.headerData['searchKey'] = this.searchVal;
    this.headerFlag = true;
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    //this.matrixChangeSelection('empty');
  //  this.getProductLists(this.showuserdashboarddataflag);
    if(this.showDealerShipData) {
      this.dealerShipLevelOffset = 0;
      this.dealerShipLevelEscalation();
    }
    if(this.showDealerShipDataNew) {
      this.matrixOffset = 0;
      this.getProductMatrixColumn();
      this.dealerShipLevelEscalationNew();
    }
    if(this.showuserdashboarddata) {
      this.matrixOffset = 0;
      this.getProductMatrixColumn();
      this.getEmployeeEscalation();
    }
  }


  checkallcheckbox(prodList,event)
  {

    if(prodList.length>0)
    {
      this.IncrementAlchangeAdd=0;
      for (let pl of prodList)
      {
        this.IncrementAlchangeAdd= this.IncrementAlchangeAdd+1;

      }
    }

    if(event.checked)
    {
      this.publishbutton=true;
      this.checkedOptActDeAct=true;
    }
    else
    {
      this.IncrementAlchangeAdd=0;
      this.publishbutton=false;
      this.checkedOptActDeAct=false;
    }
    console.log(event);

  }
  onRowSelect(event)
  {
    //event.data.workstreamName='ddasdadsddadd';
   this.primetablerowdata=event.data;
  //console.log(event.data);
  //event.data.FirstName='ddasdadsddadd';
  }
  set selectedColumns(val: any[]) {

    //console.log(val);
    //console.log(JSON.stringify(val));
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
   // alert(this._selectedColumns);
}
 // @HostListener("click", ["$event"])
 @Input() get selectedColumns(): any[] {
  return this._selectedColumns;
}
@Input() get selectedhideColumns(): any[] {
return this._selectedhideColumns;
}

modelsDisplay(productAttribute){

  console.log(productAttribute);
  console.log(productAttribute.productAttributeId);
  console.log(productAttribute.productOptionData);
  console.log(productAttribute.productOptions[0].productOptionDataJSON);

  let productOptionData;
  let attrId = productAttribute.productAttributeId;

  if(productAttribute.productOptions[0].productOptionDataJSON == undefined){
    productOptionData = productAttribute.productOptionData;
  }
  else{
    if(attrId == undefined ){
      attrId = productAttribute.productAttributes.id;
    }
    let len = productAttribute.productOptions.length;
    len = len - 1;
    productOptionData = productAttribute.productOptions[len].productOptionDataJSON;
  }
  console.log(attrId);
  console.log(productOptionData);
  if(this.globalCountrySelected)
  {
    this.countryId=this.globalCountrySelected;
  }
  let apiData = {
    apiKey: Constant.ApiKey,
    userId: this.userId,
    domainId: this.domainId,
    countryId: this.countryId,

    productAttributeId: attrId,
    productOptionData: productOptionData,
  };
  let users=[];
  let title="";
  if(this.dealerShipLevelEscalationNew){
    title="Dealers";
  }
  else{
    title="Models";

  }
  const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
  modalRef.componentInstance.accessTitle = title;
  modalRef.componentInstance.access = "escalation-models";
  modalRef.componentInstance.apiData = apiData;
  modalRef.componentInstance.height = innerHeight;
  modalRef.componentInstance.action = 'view';
  modalRef.componentInstance.selectedUsers = users;
  modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
    console.log(receivedService);
    modalRef.dismiss('Cross click');
  });

}

manageUserSelection(action,productsList,fieldName,hId){
  let userListArr=[];
  console.log(productsList);
  this.primetablerowdata=productsList;
  let users = [];
  console.log(this.primetablerowdata.L1esc);
  if(fieldName=='L1esc')
  {
    for(let usrs in this.primetablerowdata.L1esc){
      users.push({
        id: (!this.primetablerowdata.L1esc[usrs]?.userId) ? this.primetablerowdata.L1esc[usrs].L1escLoginId :this.primetablerowdata.L1esc[usrs].userId,
        name: (!this.primetablerowdata.L1esc[usrs]?.email) ? this.primetablerowdata.L1esc[usrs].L1esc: this.primetablerowdata.L1esc[usrs].email,
        img: (!this.primetablerowdata.L1esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.L1esc[usrs].profileImg,
        role: (!this.primetablerowdata.L1esc[usrs]?.role) ? this.primetablerowdata.L1esc[usrs].L1esc: this.primetablerowdata.L1esc[usrs].role,
      });
    }
  }
  if(fieldName=='L2esc')
  {
    for(let usrs in this.primetablerowdata.L2esc){
      users.push({
        id: (!this.primetablerowdata.L2esc[usrs]?.userId) ? this.primetablerowdata.L2esc[usrs].L2escLoginId :this.primetablerowdata.L2esc[usrs].userId,
        name: (!this.primetablerowdata.L2esc[usrs]?.email) ? this.primetablerowdata.L2esc[usrs].L2esc: this.primetablerowdata.L2esc[usrs].email,
        img: (!this.primetablerowdata.L2esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.L2esc[usrs].profileImg,
        role: (!this.primetablerowdata.L2esc[usrs]?.role) ? this.primetablerowdata.L2esc[usrs].L2esc: this.primetablerowdata.L2esc[usrs].role,
      });
    }
  }
  if(fieldName=='L3esc')
  {
    for(let usrs in this.primetablerowdata.L3esc){
      users.push({
        id: (!this.primetablerowdata.L3esc[usrs]?.userId) ? this.primetablerowdata.L3esc[usrs].L3escLoginId :this.primetablerowdata.L3esc[usrs].userId,
        name: (!this.primetablerowdata.L3esc[usrs]?.email) ? this.primetablerowdata.L3esc[usrs].L3esc: this.primetablerowdata.L3esc[usrs].email,
        img: (!this.primetablerowdata.L3esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.L3esc[usrs].profileImg,
        role: (!this.primetablerowdata.L3esc[usrs]?.role) ? this.primetablerowdata.L3esc[usrs].L3esc: this.primetablerowdata.L3esc[usrs].role,
      });
    }
  }
  if(fieldName=='L4esc')
  {
    for(let usrs in this.primetablerowdata.L4esc){
      users.push({
        id: (!this.primetablerowdata.L4esc[usrs]?.userId) ? this.primetablerowdata.L4esc[usrs].L4escLoginId :this.primetablerowdata.L4esc[usrs].userId,
        name: (!this.primetablerowdata.L4esc[usrs]?.email) ? this.primetablerowdata.L4esc[usrs].L4esc: this.primetablerowdata.L4esc[usrs].email,
        img: (!this.primetablerowdata.L4esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.L4esc[usrs].profileImg,
        role: (!this.primetablerowdata.L4esc[usrs]?.role) ? this.primetablerowdata.L4esc[usrs].L4esc: this.primetablerowdata.L4esc[usrs].role,
      });
    }
  }
  if(fieldName=='L5esc')
  {
    for(let usrs in this.primetablerowdata.L5esc){
      users.push({
        id: (!this.primetablerowdata.L5esc[usrs]?.userId) ? this.primetablerowdata.L5esc[usrs].L5esc :this.primetablerowdata.L5esc[usrs].userId,
        name: (!this.primetablerowdata.L5esc[usrs]?.email) ? this.primetablerowdata.L5esc[usrs].L5esc: this.primetablerowdata.L5esc[usrs].email,
        img: (!this.primetablerowdata.L5esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.L5esc[usrs].profileImg,
        role: (!this.primetablerowdata.L5esc[usrs]?.role) ? this.primetablerowdata.L5esc[usrs].L5esc: this.primetablerowdata.L5esc[usrs].role,
      });
    }
  }
  if(fieldName=='L6esc')
  {
    for(let usrs in this.primetablerowdata.L6esc){
      users.push({
        id: (!this.primetablerowdata.L6esc[usrs]?.userId) ? this.primetablerowdata.L6esc[usrs].L6esc :this.primetablerowdata.L6esc[usrs].userId,
        name: (!this.primetablerowdata.L6esc[usrs]?.email) ? this.primetablerowdata.L6esc[usrs].L6esc: this.primetablerowdata.L6esc[usrs].email,
        img: (!this.primetablerowdata.L6esc[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.L6esc[usrs].profileImg,
        role: (!this.primetablerowdata.L6esc[usrs]?.role) ? this.primetablerowdata.L6esc[usrs].L6esc: this.primetablerowdata.L6esc[usrs].role,
      });
    }
  }
  if(fieldName=='qadL1')
  {
    for(let usrs in this.primetablerowdata.qadL1){
      users.push({
        id: (!this.primetablerowdata.qadL1[usrs]?.userId) ? this.primetablerowdata.qadL1[usrs].qadL1LoginId :this.primetablerowdata.qadL1[usrs].userId,
        name: (!this.primetablerowdata.qadL1[usrs]?.email) ? this.primetablerowdata.qadL1[usrs].qadL1: this.primetablerowdata.qadL1[usrs].email,
        img: (!this.primetablerowdata.qadL1[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.qadL1[usrs].profileImg,
        role: (!this.primetablerowdata.qadL1[usrs]?.role) ? this.primetablerowdata.qadL1[usrs].qadL1: this.primetablerowdata.qadL1[usrs].role,
      });
    }
  }
  if(fieldName=='qadL2')
  {
    for(let usrs in this.primetablerowdata.qadL2){
      users.push({
        id: (!this.primetablerowdata.qadL2[usrs]?.userId) ? this.primetablerowdata.qadL2[usrs].qadL1LoginId :this.primetablerowdata.qadL2[usrs].userId,
        name: (!this.primetablerowdata.qadL2[usrs]?.email) ? this.primetablerowdata.qadL2[usrs].qadL1: this.primetablerowdata.qadL2[usrs].email,
        img: (!this.primetablerowdata.qadL2[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.qadL2[usrs].profileImg,
        role: (!this.primetablerowdata.qadL2[usrs]?.role) ? this.primetablerowdata.qadL2[usrs].qadL1: this.primetablerowdata.qadL2[usrs].role,
      });
    }
  }
  if(fieldName=='qadL3')
  {
    for(let usrs in this.primetablerowdata.qadL3){
      users.push({
        id: (!this.primetablerowdata.qadL3[usrs]?.userId) ? this.primetablerowdata.qadL3[usrs].qadL3LoginId :this.primetablerowdata.qadL3[usrs].userId,
        name: (!this.primetablerowdata.qadL3[usrs]?.email) ? this.primetablerowdata.qadL3[usrs].qadL3: this.primetablerowdata.qadL3[usrs].email,
        img: (!this.primetablerowdata.qadL3[usrs]?.profileImg) ? 'https://tpa-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png' : this.primetablerowdata.qadL3[usrs].profileImg,
        role: (!this.primetablerowdata.qadL3[usrs]?.role) ? this.primetablerowdata.qadL3[usrs].qadL3: this.primetablerowdata.qadL3[usrs].role,
      });
    }
  }
  if(this.globalCountrySelected)
  {
    this.countryId=this.globalCountrySelected;
  }
  console.log(users);
  let apiData = {
    apiKey: Constant.ApiKey,
    userId: this.userId,
    domainId: this.domainId,
    countryId: this.countryId,
  };
    if (this.showDealerShipData) {
      apiData['type'] = 2;
    }
    if (this.showDealerShipDataNew) {
      apiData['type'] = 2;
    }
  switch (action) {
    case 'new':
    case 'view':
      const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
      modalRef.componentInstance.access = this.pageAccess;
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.height = innerHeight;
      modalRef.componentInstance.action = action;
      modalRef.componentInstance.selectedUsers = users;
      modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
        console.log(receivedService);
        if(receivedService.empty == true) {
          modalRef.dismiss('Cross click');
          return false;
        }
        if(action == 'view'){
          modalRef.dismiss('Cross click');
        }
        if(!receivedService.empty){
          this.recentSelectionParam = false;
          this.recentSelectionParamValue = '';
          if(fieldName=='L1esc')
          {
            this.primetablerowdata.L1esc=[];
          }
          if(fieldName=='L2esc')
          {
            this.primetablerowdata.L2esc=[];
          }
          if(fieldName=='L3esc')
          {
            this.primetablerowdata.L3esc=[];
          }
          if(fieldName=='L4esc')
          {
            this.primetablerowdata.L4esc=[];
          }
          if(fieldName=='L5esc')
          {
            this.primetablerowdata.L5esc=[];
          }
          if(fieldName=='L6esc')
          {
            this.primetablerowdata.L6esc=[];
          }
          if(fieldName=='qadL1')
          {
            this.primetablerowdata.qadL1=[];
          }
          if(fieldName=='qadL2')
          {
            this.primetablerowdata.qadL2=[];
          }
          if(fieldName=='qadL3')
          {
            this.primetablerowdata.qadL3=[];
          }
        }
        this.publishbutton = true;
        for (let usrs in receivedService) {
          if (fieldName == 'L1esc') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.L1esc.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.L1esc) {
                  let studentObj = this.primetablerowdata.L1esc.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.L1esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L1esc: receivedService[usrs].name, L1escLoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.L1esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.L1esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L1esc: receivedService[usrs].name, L1escLoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.L1esc.push({role:receivedService[usrs].role,profileImg:receivedService[usrs].img,email:receivedService[usrs].name,userId:receivedService[usrs].id});
              }
            }
          }
          if (fieldName == 'L2esc') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.L2esc.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.L2esc) {
                  let studentObj = this.primetablerowdata.L2esc.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.L2esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L2esc: receivedService[usrs].name, L2escLoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.L2esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.L2esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L2esc: receivedService[usrs].name, L2escLoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.L2esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
            }
          }
          if (fieldName == 'L3esc') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.L3esc.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.L3esc) {
                  let studentObj = this.primetablerowdata.L3esc.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.L3esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L3esc: receivedService[usrs].name, L3escLoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.L3esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.L3esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L3esc: receivedService[usrs].name, L3escLoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.L3esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
              }
            }
          }
          if (fieldName == 'L4esc') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.L4esc.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.L4esc) {
                  let studentObj = this.primetablerowdata.L4esc.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.L4esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L4esc: receivedService[usrs].name, L4escLoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.L4esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.L4esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L4esc: receivedService[usrs].name, L4escLoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.L4esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
            }
          }
          if (fieldName == 'L5esc') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.L5esc.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.L5esc) {
                  let studentObj = this.primetablerowdata.L5esc.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.L5esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L5esc: receivedService[usrs].name, L5escLoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.L5esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.L5esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L5esc: receivedService[usrs].name, L5escLoginId: receivedService[usrs].id });
              } else {
                this.primetablerowdata.L5esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
              }
            }
          }
          if (fieldName == 'L6esc') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.L6esc.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.L6esc) {
                  let studentObj = this.primetablerowdata.L6esc.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.L6esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L6esc: receivedService[usrs].name, L6escLoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.L6esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.L6esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, L6esc: receivedService[usrs].name, L6escLoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.L6esc.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
            }
          }

          if (fieldName == 'qadL1') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.qadL1.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.qadL1) {
                  let studentObj = this.primetablerowdata.qadL1.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.qadL1.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, qadL1: receivedService[usrs].name, qadL1LoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.qadL1.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.qadL1.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, qadL1: receivedService[usrs].name, qadL1LoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.qadL1.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
            }
          }

          if (fieldName == 'qadL2') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.qadL2.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.qadL2) {
                  let studentObj = this.primetablerowdata.qadL2.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.qadL2.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, qadL2: receivedService[usrs].name, qadL2LoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.qadL2.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.qadL2.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, qadL2: receivedService[usrs].name, qadL2LoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.qadL2.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
            }
          }


          if (fieldName == 'qadL3') {
            if (receivedService[usrs].name) {
              if (this.primetablerowdata.qadL3.length > 0 && !this.showDealerShipData) {
                for (let userIdp in this.primetablerowdata.qadL3) {
                  let studentObj = this.primetablerowdata.qadL3.find(t => t.userId == receivedService[usrs].id);
                  if (studentObj) { }
                  else {
                    if (this.showDealerShipData) {
                      this.primetablerowdata.qadL3.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, qadL3: receivedService[usrs].name, qadL3LoginId: receivedService[usrs].id });
                    } else {
                      this.primetablerowdata.qadL3.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                    }
                  }
                }
              }
              else if (this.showDealerShipData) {
                  this.primetablerowdata.qadL3.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, qadL3: receivedService[usrs].name, qadL3LoginId: receivedService[usrs].id });
                } else {
                  this.primetablerowdata.qadL3.push({role:receivedService[usrs].role,profileImg: receivedService[usrs].img, email: receivedService[usrs].name, userId: receivedService[usrs].id });
                }
            }
          }
          if(!receivedService.empty){
          userListArr.push(receivedService[usrs].id)
          //alert((userListArr));
          this.publishbutton=true;

          let elss = document.getElementById('product_users' + productsList.uId + hId);
          document.querySelector('.selectedItemp-table')?.classList.remove('selectedItemp-table')
          console.log(elss);
          if(elss != null){
            var selector = "td";
            var parent = this.findParentBySelector(elss, selector);
            this.renderer.addClass(parent, 'selectedItemp-table');
            this.renderer.removeClass(parent, 'selectedItemp-table-border');
          }

          }
        }


        if(this.escalationMatrix_array.length>0)
{
for (let wsd in this.escalationMatrix_array)
{
  let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsList.uId);
  if(studentObj)
  {
    if(fieldName=='L1esc')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).L1esc = JSON.stringify(userListArr);
    }
    if(fieldName=='L2esc')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).L2esc = JSON.stringify(userListArr);
    }
    if(fieldName=='L3esc')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).L3esc = JSON.stringify(userListArr);
    }
    if(fieldName=='L4esc')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).L4esc = JSON.stringify(userListArr);
    }
     if(fieldName=='qadL1')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).qadL1 = JSON.stringify(userListArr);
    }
    if(fieldName=='qadL2')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).qadL2 = JSON.stringify(userListArr);
    }
    if(fieldName=='qadL3')
    {
      this.escalationMatrix_array.find(item => item.id == productsList.uId).qadL3 = JSON.stringify(userListArr);
    }
    this.recentSelectionParamValue = JSON.stringify(userListArr);


  }
  else
  {
    this.escalationMatrix_array.push({
      "id":productsList.uId,
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
    "id":productsList.uId,
    [fieldName]:JSON.stringify(userListArr)
  });
  this.recentSelectionParam = true;
  this.recentSelectionParamValue = JSON.stringify(userListArr);
}

  console.log(this.escalationMatrix_array);
  this.makeRowsSameHeight();
        modalRef.dismiss('Cross click');
      });
      break;
    }
  }




  configurationEscalation(){
    this.loading = true;
    if(this.globalCountrySelected)
    {
      this.apiData['countryId']=this.globalCountrySelected;
    }
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);

    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', '10');
    apiFormData.append('offset', '0');
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }
     this.EscalationApi.getEscalationConfigData(apiFormData).subscribe((response) => {
      if (response.status == "Success") {

        let resultData = response.data;
        console.log(resultData);
        let days = resultData.days;
        let hours = resultData.hours;
        this.escConfigList = resultData.escLists;
        this.escConfigTotal = resultData.total;

        this.escStopStatus =  resultData.escStopStatus;
        for (let status in this.escStopStatus)
        {
          if(this.escStopStatus[status].status == '1'){
              this.escStopStatusVal = this.escStopStatus[status].id.toString();
              console.log(this.escStopStatusVal);
          }
        }

        let name = '';
        for (let day in days)
        {
          if(days[day] == 0){
            name = '-';
          }
          else if(days[day] == 1000){
            name = 'None (Immediate)';
          }
          else if(days[day] == 1001){
            name = 'In active';
          }
          else{
            name = days[day] == 1 && days[day] != 0 && days[day] < 11 ? days[day] +' day' : days[day] +' days';
          }
         //console.log(name);
          this.days.push({
            name: name,
            id: days[day].toString()
          });
        }

        let hname = '';
        for (let hour in hours)
        {
          if(hours[hour] == 0){
            hname = '-';
          }
          else if(hours[hour] == 1000){
            hname = 'None (Immediate)';
          }
          else if(hours[hour] == 1001){
            hname = 'In active';
          }
          else{
            hname = hours[hour] == 1 && hours[hour] != 0 && hours[hour] < 11 ? hours[hour] +' hour' : hours[hour] +' hours';
          }
         //console.log(hours);
          this.hours.push({
            name: hname,
            id: hours[hour].toString()
          });
        }
        console.log(this.days);
        //console.log(this.hours);
        //console.log(this.escStopStatus);

      }
      this.loading = false;
      this.loadDataEvent=false;

    }, err => {
      this.loading = false;
      this.loadDataEvent=false;

      console.error(err);
    });
  }

  getAlertEscalationConfigData(){

    if(this.globalCountrySelected)
    {
      this.apiData['countryId']=this.globalCountrySelected;
    }
    //this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', '10');
    apiFormData.append('offset', '0');
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }
     this.EscalationApi.getAlertEscalationConfigData(apiFormData).subscribe((response) => {
      if (response.status == "Success") {

        let resultData = response.data;
        console.log(resultData);
        this.escConfigAlertList = resultData.escLists;
        for (let list in this.escConfigAlertList)
        {
          this.escConfigAlertList[list].levels =  this.escConfigAlertList[list].levels == '' ? '' : JSON.parse(this.escConfigAlertList[list].levels);
        }
        console.log(this.escConfigAlertList);

        this.escConfigAlertTotal = resultData.total;
        let levels =  resultData.escLevel;
        this.levels = [];

        let hours = resultData.hours;
        for (let hour in hours)
        {
          this.hoursAlert.push({
            name: hours[hour],
            id: hours[hour]
          });
        }
        this.hoursAlert.push({
          name: 'None',
          id: ''
        });
        console.log(this.hoursAlert);

        let lname = '';
        for (let level in levels)
        {
          if(levels[level] == '1'){
            lname = '1 Level';
          }
          if(levels[level] == '2'){
            lname = '2 Level';
          }
          if(levels[level] == '3'){
            lname = '3 Level';
          }
          this.levels.push({
            name: lname,
            value: JSON.stringify(levels[level])
          });

        }
        this.levels.push({
          name: 'None Selected',
          value: ""
        });
        console.log(this.levels);
        console.log(this.escConfigAlertList)
      }
      this.loading = false;
      this.loadDataEvent=false;

    }, err => {
      this.loading = false;
      this.loadDataEvent=false;

      console.error(err);
    });
  }

  // Set Screen Height
setScreenHeight() {
  this.innerHeight = (this.bodyHeight - 157 );
  this.innerHeightFix = windowHeight.height - 150 + 'px';
  this.emptyHeight = windowHeight.height - 80;
}

onChangeSec1(rowid,helptype,type,val){
  this.publishbutton = true;

  //console.log(rowid);
  //console.log(helptype)
  //console.log(val);
  //console.log(type);

  let rowAID = rowid+"##"+helptype;
  let data;
  if(type == 'days'){
    data = {"id": rowAID,"days":val};
  }
  if(type == 'hours'){
    data = {"id": rowAID,"hours":val};
  }
  /*let rmIndex = this.escLevelParam.findIndex(option => option.id == rowAID);
  this.escLevelParam.splice(rmIndex, 1);*/
  this.escLevelParam.push(data);
  console.log(JSON.stringify(this.escLevelParam));
}
onChangeSec2(val){
  this.publishbutton = true;
  console.log(val);
  this.stopStatus = val;
}
onChangeSec3(rowid,type,val){
  this.publishbutton = true;

  //console.log(rowid);
  //console.log(JSON.stringify(val));
  //console.log(type);

  let rowAID = rowid;
  let data;

  if(type == 'levels'){
    let value;
    value = val == '' ? "" : JSON.stringify(val);
    data = {"id": rowAID,"levels": value};
  }
  if(type == 'hours_selection'){
    data = {"id": rowAID,"hours_selection":val};
  }
  this.alertLevelParam.push(data);
  console.log(JSON.stringify(this.alertLevelParam));
}

downloadFilesDealer(url){
  window.open(url, '_blank');
}
importDealer(){
  // Update Manufacturer Logo
  this.bodyElem = document.getElementsByTagName('body')[0];
  this.bodyElem.classList.add(this.bodyClass3);
  const modalRef = this.modalService.open(ExportFileComponent, {backdrop: 'static', keyboard: false, centered: true});
  modalRef.componentInstance.userId = this.userId;
  modalRef.componentInstance.domainId = this.domainId;
  modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
    console.log(receivedService);
    if (receivedService) {

      if(receivedService.unKnownUsers && receivedService.unKnownUsers.length>0)
      {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.unKnownUsersArr=receivedService.unKnownUsers;
        this.bodyElem.classList.remove(this.bodyClass3);
        modalRef.dismiss('Cross click');
        if(this.unKnownUsersArr){
          let dindex = this.unKnownUsersArr.findIndex(option => option == "vacant");
          if(dindex >= 0) {
            this.unKnownUsersArr.splice(dindex, 1);
          }
          this.displayUnknownUsersPopup=true;
          this.searchForm = this.formBuilder.group({
            searchKey: [this.searchVal, [Validators.required]],
          });
          this.listItems = [];
          for(let m in this.unKnownUsersArr) {
            this.listItems.push({
              name : this.unKnownUsersArr[m],
              displayFlag : true
            });
          }
          console.log(this.listItems);
        }

        //this.dealerShipLevelOffset = 0;
       // this.productsList = [];
       // this.productAttributesValues = [];
       // this.dealerShipLevelEscalation();
      }
      else
      {
        const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', '10');
    apiFormData.append('offset', '0');
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }


    setTimeout(() => {
      this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass3);
        modalRef.dismiss('Cross click');
        this.dealerShipLevelOffset = 0;
        this.productsList = [];
        this.productAttributesValues = [];
        this.dealerShipLevelEscalation();
    }, 9000);

     this.EscalationApi.UpdateDealerEscalationData(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass3);
        modalRef.dismiss('Cross click');
        this.dealerShipLevelOffset = 0;
        this.productsList = [];
        this.productAttributesValues = [];
        this.dealerShipLevelEscalation();
      }
    });
      }

    }
    else{
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove(this.bodyClass3);
      modalRef.dismiss('Cross click');
    }
  });
}

  // Search Onchange
  onSearchChange(searchValue : string ) {
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if(searchValue.length == 0) {
      this.submitted = false;
      this.unknownempty = false;
    }
    let filteredList = this.listItems.filter(option => option.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
    if(filteredList.length > 0) {
      this.unknownempty = false;
      for(let t in this.listItems) {
        this.listItems[t]['displayFlag'] = false;
        for(let f in filteredList) {
          if(this.listItems[t] == filteredList[f]) {
            this.listItems[t]['displayFlag'] = true;
          }
        }
      }
    } else {
      this.unknownempty = true;
    }

}

onSubmit(){
  this.submitted = true;
  if (this.searchForm.invalid) {
    return;
  } else {
    this.searchVal = this.searchForm.value.searchKey;
    this.onSearchChange(this.searchVal);
  }
}

clearSearch(){
  this.searchVal = '';
  this.searchClose = false;
  this.unknownempty = false;
  if(this.listItems.length>0){
    for(let m in this.listItems) {
      this.listItems[m]['displayFlag'] = true;
    }
  }
}

}
export class listItems {
  displayFlag: boolean;
  name: string;
}

