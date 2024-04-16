import { Component, ViewChild, Renderer2, ElementRef, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//for selectbox search
import { Title } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant,windowHeight } from '../../../common/constant/constant';
import { MessageService } from 'primeng/api';
import { SuccessComponent } from '../../../components/common/success/success.component';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
import { ProductMakeComponent } from '../../common/product-make/product-make.component';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
declare var $:any;
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [MessageService]
})
export class IndexComponent implements OnInit {

  resultsModel=[];

  totalRecords: number;
  public title:string = 'Product Matrix';


  public selectedModelMatrix=[];
  public sortFieldEvent: string='';
    public dataFilterEvent;
    public isFilterApplied=false;
    public isFilterAppliedLoad=false;
    public sortorderEvent;
    public refreshOption:boolean=false;
  public checkedOptActDeAct:boolean=false;
  public bodyClass:string = "product-matrix-list";
  public defaultValue:string = 'defaultValue';
  public pageaccesstitle:string = "Product Matrix";
  public displayattributes1:boolean = false;
  public modelChangedFlag:boolean = false;
  public savedisabledflag:boolean = false;
  public headerChangedFlag:boolean = false;
  public teamSystem=localStorage.getItem('teamSystem');
  public changedinputValueFlag:string = '';
  public changedinputValueFlagvs:string = '';
  public IncrementAlchangeAdd:number=0;
  public shownewcolresponsefromapi:string = '';
  public uniqueproductId='';
  public pagecreatenew:string = "Add New";
  public disableOptionCentering:boolean = false;
  public productMatrix_array=[];
  public filteredlookupIds=[];
  public productsubcatDropdata=[];
  public productsubcatptDropdata=[];

  public productMatrix_headerarr=[];
  public attripopupTitle:string ="";
  public selectTitle:string ="Add Make/Model";
  public displaymodelmodel:boolean=false;
  public displayattributes2:boolean = false;
  public displayattributes1column:boolean = false;
  public displayEditHeaderCol:boolean = false;
  public attributesArr = ['Attribute1','Attribute2','Attribute3','Attribute4'];
  public bodyElem;
  value2: string;
  public attripopupTitleVal;
  public footerElem;
  //public showproductactiveinflag='';
  public showuserdashboarddata=true;
  public showuserdashboarddataflag='1';
  public showuserdashboarddataflagUpdate='0';
  public actionactivatedeact='deactive';
  public activeTab='active';
  public inActiveTab='';
  public textActivateDeactivate:string ='Deactivate';
  public makeArrayval=[];
  public regionselectVal=[];
  public matrixActionFlag: boolean = false;
  public edittableHeader: boolean = false;
  public publishbutton: boolean = false;
  public headerFlag: boolean = false;
  public addednewProduct: boolean = false;
  public checkedItemBox:boolean=false;
  primetablerowdata: {workstreamArr: Array<any>,workstreamName: string,makeName: string};
  public headerData: Object;
  public ItemEmpty: boolean;
  public createAccess: boolean;
  public pmtTooltip: boolean = false;
  public wsTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public pmtActionPosition: string;
  public submitFlag: boolean = false;
  public submitActionFlag: boolean = false;
  public matrixSuccess: boolean = false;
  public successMsg: string = "";
  public matrixFlag: any = null;
  public emptyIndex: any = '-1';
  @ViewChild('el') elRefs: ElementRef;
 @ViewChild('ptabletdata', { static: false }) tdptabletdata: ElementRef;

  public searchVal: string = '';
  public pageloadedhere: string;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public apiData: Object;
  public make: string = "";
  public productListColumns = [];
  public productMakeList = [];
  selectedCountry: string;
  addnewrowbgcolor: string;
  public productMakeListdrop = [];
  public productinputTypeListdrop = [];
  public productinputTypeListdropvs = [];
  public makeItemList = [];
  public makeItems = [];
  public workstreamLists = [];
  public matrixSelectionList = [];
  public bodyHeight: number;
  public innerHeight: number;
  public innerHeightFix: string='';
  public innerHeightnew: number;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public resize: boolean = false;
  public gtsSelectAll: boolean = false;
  public thumbView: boolean = false;
  public itemLength: number = 0;
  public itemTotal: number;
  public itemList: object;
  public itemResponse = [];
  public productsList = [];
  public displayNoRecords: boolean;
  public loading: boolean = true;
  public loadDataEvent: boolean=false;
  public lazyloadDataEvent: boolean=false;
  public isModelDatachanged: boolean=false;
  public isHeaderDatachanged: boolean=false;
  userListColumns: string[];
  //cols: any[];
  public attrivaluesinfo: any = {};
  public attrivaluesinfo1 = {};
  public atrivaluesinfoval=[];;
  //public attrivaluesinfo: any = {};
  public attrivalues = [];
  public regionvalues = [];
  public prodTypevalues = [];
  public catIdvalues = [];
  public subcatIdvalues = [];
  public attr3values = [];
  public attr4values = [];
  _selectedColumns: any[];
  _selectedhideColumns: any[];
  //frozenCols: any[];
  frozenCols=[];
  cols=[];
  showhidecols=[];
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public modelVal: string = "";
  public makeVal: string = "0";
  public predefined: boolean = false;
  public editAccess: boolean = false;
  public matrixId: number = 0;
  public matrixIndex: number;
  public navUrl: string = 'product-matrix/inactive';
 public colaccountTypesNewUser=[];
 public attripopupTitleValArr :any = [];
 public updateHeaderTextFlag: boolean = false;
  pageAccess: string = "productList";
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  @ViewChild("dt", { static: false }) public dt: Table;
  constructor(
    private titleService: Title,
    private router: Router,
    private scrollTopService: ScrollTopService,
    private ProductMatrixApi: ProductMatrixService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private elRef : ElementRef,
    private renderer: Renderer2,
    private config: NgbModalConfig,

    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) {
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

//let inputTypeArr=['Input TextBox','Dropdown(Single Select)','Dropdown(Multi Select)','Read Only'];
    this.pageloadedhere = '';
    this.colaccountTypesNewUser = [{label: 'Fuel filters', value: 'Fuel filters'},{label: 'Air filters', value: 'Fuel filters'},{label: 'Oil filters', value: 'Oil filters'}]
    window.addEventListener('scroll', this.scroll, true); //third parameter
    let takva='Select option';
    this.attrivalues.push({name:takva});

    /*
    for (let ip in inputTypeArr)
    {

      this.productinputTypeListdrop.push({name:inputTypeArr[ip]});
    }
    */

    this.user = this.authenticationService.userValue;
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
      'search': true
    };
    this.showuserdashboarddataflag='1';
    //this.getProductLists(this.showuserdashboarddataflag);
    this.getproductmakeLists(0, 0);
    this.getProductMatrixColumn();
    this.getWorkstreamLists();
    this.getProductMatrixColumnValues();
    this.getproductcategoryandsubcatefilter();

    setTimeout(() => {
      if(this.teamSystem)
      {
        this.innerHeightFix = windowHeight.height-60+'px';
      }
      else
      {
       // this.innerHeightFix = windowHeight.height-120 +'px';
        let headerHeight =
          document.getElementsByClassName("prob-header")[0].clientHeight;
        this.innerHeight = windowHeight.height - (headerHeight + 78);
        console.log(headerHeight);
        console.log(this.innerHeight);
        this.innerHeightFix = this.innerHeight +'px';
        console.log(this.innerHeightFix);
        //this.innerHeightFix = windowHeight.height-120 +'px';
        //console.log(this.innerHeightFix);
      }
    }, 500);


  }

  getWorkstreamLists() {
    let type:any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', type);
    apiFormData.append('productMatrix', '1');

    this.ProductMatrixApi.getWorkstreamLists(apiFormData).subscribe((response) => {
      let resultData = response.workstreamList;
      for(let ws of resultData) {
        this.workstreamLists.push({workstreamId: ws.id, workstreamName: ws.name});
      }
    });
  }
  getproductcategoryandsubcatefilter()
  {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    this.ProductMatrixApi.getproductCategandSubcat(apiFormData).subscribe((response) => {
      this.productsubcatDropdata.push({name:'All',id:"0"});
      if(response.status == "Success") {
        let catsubcatDta=response.modelData.subCategory;
        let catsubcatptDta=response.modelData.productType;
        console.log(catsubcatptDta);
        for (let cdta in catsubcatDta) {
          let cdatasid = catsubcatDta[cdta].id;
          let cdatasname = catsubcatDta[cdta].name;
          this.productsubcatDropdata.push({name:cdatasname,id:cdatasid});

         }
         for (let cptdta in catsubcatptDta) {
          let cptdatasid = catsubcatptDta[cptdta].id;
          let cptdatasname = catsubcatptDta[cptdta].name;
          this.productsubcatptDropdata.push({name:cptdatasname,id:cptdatasid});

         }

    }
      });
  }
 // @HostListener("click", ["$event"])
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}
@Input() get selectedhideColumns(): any[] {
  return this._selectedhideColumns;
}
insert1 = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
]



newColumn(ec)
{

  this.displayattributes1column=true;

  //alert(ssvar);
  //const result = this.insert1(this.cols, ssvar, { width:'50px',field: 'aat1',header: 'Attribures',columnpclass:'normalptabletow' })
  //this.cols.push( { width:'50px',field: 'aat1',header: 'Attribures',columnpclass:'normalptabletow' });

}

searchModel(event,uId)
{

  //$('#userdefindModeldiv'+uId+'').html('');
 // alert(uId);
  let resultsModelarr=[];
  let query=event.target.value;
  const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);

    apiFormData.append('searchKey', query);



    this.ProductMatrixApi.checkModelAutoComplete(apiFormData).subscribe((response) => {
      if(response.status == "Success") {
        this.loadDataEvent=false;
        this.loading = false;
        let resultData = response.modelData;
        console.log(resultData);

        for(let i = 0; i < resultData.length; i++) {
          let country = resultData[i];
         // resultsModelarr +='<div>'+country.name+'</div>';
         this.resultsModel.push(country);
         /*
          if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              this.resultsModel.push(country);
          }
          */
      }
      }
      });
  // alert(resultsModelarr);
  console.log(this.resultsModel);
//$('#userdefindModeldiv'+uId+'').html(resultsModelarr);
//$('#userdefindModeldiv'+uId+'').show();
$('#userdefindModel'+uId+'').show(); // hide test11
//alert(event.target.value);
  //event.target.value='dsdddd';
  //alert(event.target.value);
var scrollTop = $(window).scrollTop();
// get the top offset of the dropdown (distance from top of the page)

//var topOffset = $('#userdefindModeldiv'+uId+'').offset().top; // hide test11
var topOffset = $('#userdefindModel'+uId+'').offset().top;

// calculate the dropdown offset relative to window position
var relativeOffset = topOffset-scrollTop;
// get the window height
var windowHeight = $(window).height();

// if the relative offset is greater than half the window height,
// reverse the dropdown.
if(relativeOffset > windowHeight/2){
  //$('#userdefindModeldiv'+uId+'').addClass("reverse"); // hide test11
  $('#userdefindModel'+uId+'').addClass("reverse");
}
else{
  //$('#userdefindModeldiv'+uId+'').removeClass("reverse"); // hide test11
  $('#userdefindModel'+uId+'').removeClass("reverse");
}



}
clickModeldiv(mId,pId,Pname)
{
 // pordLis.ModelName="sdddd";
 // this.productsList[0].modelName="sdddd";
//$('#userdefindModel'+pId+'').val(Pname);
}
manageLookupData(cId,colName) {
  let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
  let footerHeight = 0;
  this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+20));
  this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;

  let apiData = {
    'apiKey': Constant.ApiKey,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'userId': this.userId,
    'lookUpdataId': cId,
    'lookupHeaderName': colName,
    'groupId': 0
  };

  const modalRef = this.modalService.open(ManageListComponent, this.config);
  modalRef.componentInstance.access = 'LookupDataPM';
  modalRef.componentInstance.accessAction = true;
  modalRef.componentInstance.headerPoint = 'LookupDataPM';
  modalRef.componentInstance.filteredTags = this.filteredlookupIds;
  modalRef.componentInstance.apiData = apiData;
  modalRef.componentInstance.height = innerHeight;
  modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
    modalRef.dismiss('Cross click');
    let tagItems = receivedService;

    if(tagItems==1)
    {

      this.getProductMatrixColumnValues();
    }

    //this.filteredTagIds = [];
    //this.filteredTags = [];
    /*
    for(let t in tagItems) {
      let chkIndex = this.filteredTagIds.findIndex(option => option == tagItems[t].id);
      if(chkIndex < 0) {
        this.filteredTagIds.push(tagItems[t].id);
        this.filteredTags.push(tagItems[t].name);
      }
    }
    */
  });
}

getupdatevalcol(event)
{
//alert(event.value.id);
this.changedinputValueFlag=event.value.id;
}
getupdatevalcol2(event)
{
//alert(event.value.id);
this.changedinputValueFlagvs=event.value.id;
}
newColumnadd()
{

  this.loading=true;

 var attr_new_col= $('#attr_new_col').val();
 var attr_dropd=this.changedinputValueFlag;
 var attr_dropd2=this.changedinputValueFlagvs;
 //alert(attr_dropd);
 // this.displayattributes1column=true;
  let ssvar=this.cols.length-1;

  this.makeItemList = [];
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('columnName', attr_new_col);
  apiFormData.append('inputType', attr_dropd);
  apiFormData.append('columnType', attr_dropd2);


  this.ProductMatrixApi.AddNewColumn(apiFormData).subscribe((response) => {
    if(response.status == "Success") {
      this.displayattributes1column=false;
      this.changedinputValueFlag='';
      this.changedinputValueFlagvs='';
      this.shownewcolresponsefromapi='';
     // this.loading=false;
      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = response.result;
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');

       this.loading=false;
       this.getProductMatrixColumn();
       this.getProductMatrixColumnValues();
       //this.publishbutton=false;

      }, 2000);
    }
    else
    {
      this.shownewcolresponsefromapi=response.result;
//alert(response.result);
this.loading=false;
    }
    });

  //alert(ssvar);
  //const result = this.insert1(this.cols, ssvar, { width:'50px',field: 'aat1',header: 'Attribures',columnpclass:'normalptabletow' })
  //this.cols.push( { width:'50px',field: 'aat1',header: 'Attribures',columnpclass:'normalptabletow' });
 // this.cols.splice(ssvar, 0, { width:'200px',field: 'aat1',header: attr_new_col,columnpclass:'normalptabletow' });


  }
  alphaOnly(event) {
    var key = event.keyCode;
    console.log(key);
    return ((key >= 65 && key <= 90) || key == 8 || key == 32 || key ==189);
  };
checkAllp(event)
{
//alert(1);
}
  applySearch(val) {
    this.searchVal = val;
    this.apiData['searchKey'] = this.searchVal;
    this.itemLimit = 20;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.itemTotal = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.loading = true;
    this.displayNoRecords = false;
    this.matrixActionFlag = false;
  //  this.productsList = [];
    this.headerData['searchKey'] = this.searchVal;
    this.headerFlag = true;
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    //this.matrixChangeSelection('empty');
    this.getProductLists(this.showuserdashboarddataflag);
  }

  attAttr1(event)
  {
    //alert(2);
    this.attripopupTitle="Attributes";
    this.displayattributes1=true;
event.preventDefault();
event.stopPropagation();
  }

  attAttr2(event)
  {
    //alert(2);
    this.displayattributes2=true;
    this.attripopupTitle="Region";
event.preventDefault();
event.stopPropagation();
  }

  addtexttopopup(event)
  {
    var attr22=$('#attr22').val();

    this.attrivalues.push({name:attr22});
    this.displayattributes1=false;
    $('#attr22').val('');
    console.log(event);
    //this.displayattributes1=false;
  }

  addtexttopopup2(event)
  {
    var attr22=$('#attr23').val();

    this.regionvalues.push({name:attr22});
    this.displayattributes2=false;
    $('#attr23').val('');
    console.log(event);
    //this.displayattributes1=false;
  }

  onRowSelect(event)
  {
    //event.data.workstreamName='ddasdadsddadd';
   this.primetablerowdata=event.data;
  //console.log(event.data);
  //event.data.FirstName='ddasdadsddadd';
  }
  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.matrixSelectionList = [];
   // this.matrixChangeSelection(this.headerCheck);
  }

  // Edit Make
  editMake() {
    this.displaymodelmodel=false;
    const modalRef = this.modalService.open(ProductMakeComponent, this.config);
    console.log(this.itemResponse);
    modalRef.componentInstance.makeList = this.itemResponse;
    modalRef.componentInstance.workstreams = this.workstreamLists;
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.height = innerHeight-140;
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      let result = receivedService;
      console.log(result);
      if(result.flag) {
        if(result.action == 'edit') {
          let val = '';
          if(this.searchVal)
          {
            val=this.searchVal;
          }
          this.applySearch(val);
        } else {
          this.makeItemList = [];
          this.getproductmakeLists(0, 0);
        }
      }
    });
  }
  editHeader(hId)
  {
    this.edittableHeader=true;
    setTimeout(()=>{
$('#edittableHeader'+hId+'').trigger('click');
    //alert(hId);
    },500);

  }

getProductMatrixColumnValues(cvId='') {
 // alert(cvId);
  //this.attrivaluesinfoval = new Map();
  this.makeItemList = [];
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  if(cvId)
  {
    apiFormData.append('lookUpDataId', cvId);
  }
 this.ProductMatrixApi.getPMColumnsValues(apiFormData).subscribe((response) => {
    if(response.status == "Success") {
     let columndataVals= response.columnDataValues;
     this.atrivaluesinfoval=response.columnDataValues;
    }
  });

  }
  getProductMatrixColumn() {
    this.cols=[];
    this.frozenCols=[];
    this.makeItemList = [];
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);


    this.ProductMatrixApi.getPMColumns(apiFormData).subscribe((response) => {
      if(response.status == "Success") {
       let columnVals= response.columnValues;
       let visibilityValuesvals= response.visibilityValues;
       let inputValuesval= response.inputValues;
       this.productinputTypeListdropvs.push({name:'System Defined',id:'1'});
        this.productinputTypeListdropvs.push({name:'User Defined',id:'2'});
       for (let ipt in inputValuesval) {
        let iptplaceholder = inputValuesval[ipt].placeholder;
        let ipttype = inputValuesval[ipt].type;
        this.productinputTypeListdrop.push({name:iptplaceholder,id:ipttype});

       }
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
       if(colsfrozenColumns==1)
       {
        this.frozenCols.push({columnName:colsname,headerId:colsid,width:colscolumnWidth,field: colsfieldName,header:colsplaceholder,inputType:colsinputType ,columnpclass:colscustomStyleClass,columnpredefind:colspredefind});

       }

       else
       {
        let colscolumnWidth = "250px";
        this.cols.push({columnName:colsname,headerId:colsid,width:colscolumnWidth,field: colsfieldName,header: colsplaceholder,inputType:colsinputType,columnpclass:colscustomStyleClass,columnpredefind:colspredefind});
       }


      }


      for (let vc in visibilityValuesvals) {
        let vcolsname = visibilityValuesvals[vc].name;
        let vcolsfieldName = visibilityValuesvals[vc].fieldName;
        let vcolsplaceholder = visibilityValuesvals[vc].placeholder;
        let vcolsinputType = visibilityValuesvals[vc].inputType;
        let vcolsfrozenColumns = visibilityValuesvals[vc].frozenColumns;
        let vcolscolumnWidth = visibilityValuesvals[vc].columnWidth;
        let vcolscustomStyleClass = visibilityValuesvals[vc].customStyleClass;
        let vcolspredefind = visibilityValuesvals[vc].isPredefind;
        let vcolsid = visibilityValuesvals[vc].id;

        this.showhidecols.push({columnName:vcolsname,headerId:vcolsid,width:vcolscolumnWidth,field: vcolsfieldName,header: vcolsplaceholder,inputType:vcolsinputType,columnpclass:vcolscustomStyleClass,columnpredefind:vcolspredefind});



      }

       }
       this._selectedColumns = this.cols;
       this._selectedhideColumns = this.showhidecols;
    });
  }

  set selectedColumns(val: any[]) {

    //console.log(val);
    //console.log(JSON.stringify(val));
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
   // alert(this._selectedColumns);
}

onChangehideselect(event,hidecol)
{

//  console.log(JSON.stringify(event)+'--'+JSON.stringify(hidecol));
 // console.log(JSON.stringify(event));
  console.log(JSON.stringify(event.itemValue.columnName));
  //console.log(JSON.stringify(event.value));
  var allevnetval=event.value;
  var oneevnetval=event.itemValue.columnName;
  let columnshown=false;
  for (let h in allevnetval)
  {
    if(allevnetval[h].columnName==oneevnetval)
    {
      columnshown=true;
    }

//console.log(allevnetval[h].columnName);
  }
  //alert(columnshown+'--'+oneevnetval);
  //console.log(JSON.stringify(val));
}
set selectedhideColumns(val: any[]) {
 // alert(val);
// console.log(val);
   // console.log(JSON.stringify(val));
  //restore original order
  this._selectedhideColumns = this.showhidecols.filter(showhidecols => val.includes(showhidecols));
  //console.log(JSON.stringify(this._selectedhideColumns));
  // alert(this._selectedColumns);
}

  funcall(hId,rowdata='')
  {
    //this.regionvalues=[];
    let columndataVals= this.atrivaluesinfoval;
    for (let cv in columndataVals) {





      let colscvname = columndataVals[cv].id;
      //var fieldName1 = columndataVals[cv].fieldName;
      var fieldName=columndataVals[cv].fieldName;

      //var key = columndataVals[cv].fieldName;
     if(colscvname==hId)
     {

      this.regionvalues = columndataVals[cv].values;
     // this.regionvalues.push({label:  columndataVals[cv].id, value: columndataVals[cv].values});
     }

      //this.regionvalues+colscvname = columndataVals[cv].values;
     // this.atrivaluesinfoval.push(this.attrivaluesinfo1);




      //console.log(something);


    }

   // this.getProductMatrixColumnValues(hId);
  }
  getproductmakeLists(id, index) {

    this.makeItemList = [];
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('fromProductMatrix', '1');
    if(id > 0) {
      this.productsList[index].makeLoader = true;
      apiFormData.append('makeId', id);
    }
    //apiFormData.append('searchKey', this.apiData['searchKey']);
    //apiFormData.append('limit', this.apiData['limit']);
    //apiFormData.append('offset', this.apiData['offset']);
    this.ProductMatrixApi.fetchProductMakeListsUpdate(apiFormData).subscribe((response) => {
      if(response.status == "Success") {

        let resultData = response.modelData;
        if(id == 0) {
          this.itemResponse = resultData;
          this.makeItems = resultData;
          if(this.makeItems.length>0)
          {
            this.productMakeListdrop=[];
          }
          for (let i in resultData) {
            let makeName = resultData[i].makeName;
            this.productMakeList.push(makeName);
            this.productMakeListdrop.push({name:makeName});
            this.makeItemList.push(makeName);
          }
        } else {
          this.productsList[index].makeLoader = false;
          let wsList = resultData[0].workstreamList;
          let wsName = (wsList.length > 0 && wsList.length < 2) ? wsList[0].name : 'None';
          if(wsList.length > 1) {
            wsName = (wsList.length > 1) ? 'Multiple' : wsList[0].name;
          }
          this.productsList[index].workstreamArr = wsList;
          this.productsList[index].workstreamName = wsName;
        }
      }
    });
  }
  // Matrix Cancel Action
  matrixCancelAction(index, id) {

  }


  binSelect(event)
  {
this.makeArrayval=event.value;


  }
  onConfirm() {
    this.messageService.clear('c');
}
  onReject() {
    this.messageService.clear('c');
}
  showError(resdata) {

    this.messageService.add({severity:'error', summary: 'Error', detail: resdata});
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

onChangeSelection(productsLis,colval)
{

  console.log(productsLis[colval.field]);
  console.log(colval);

  let cId = colval.headerId;
  let colName = colval.header;
  let eventData = productsLis[colval.field];
  let dataId = [];
  let dataName = [];

  if(eventData != undefined ){
    if(eventData.length>0){
      for (let ist in eventData){
        dataId.push(eventData[ist].id);
        dataName.push(eventData[ist].name);
      }
    }
  }

  let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
  let footerHeight = 0;
  this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+20));
  this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;

  let apiData = {
    'apiKey': Constant.ApiKey,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'userId': this.userId,
    'lookUpdataId': cId,
    'lookupHeaderName': colName,
    'groupId': 0,
    'loopUpData':  cId,
    'isActivetrue': true
  };

  let inputData = {
    actionApiName: "",
    actionQueryValues: "",
    selectionType: "multiple",
    field:'countryList',
    title: colName,
    filteredItems: dataId,
    filteredLists: dataName,
    baseApiUrl: Constant.TechproMahleApi,
    apiUrl: Constant.TechproMahleApi+""+Constant.getLookupTableData,
 };

  const modalRef = this.modalService.open(ManageListComponent, this.config);
  modalRef.componentInstance.access = 'newthread';
  modalRef.componentInstance.accessAction = false;
  modalRef.componentInstance.headerPoint = 'LookupDataPM';
  modalRef.componentInstance.apiData = apiData;
  modalRef.componentInstance.inputData = inputData;
  modalRef.componentInstance.filteredTags = dataId;
  modalRef.componentInstance.filteredLists = dataName;
  modalRef.componentInstance.height = innerHeight;
  modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
    modalRef.dismiss('Cross click');
    let tagItems = receivedService;

    console.log(tagItems);
    let id = '';
    let name = '';
    let arr_obj_r=[];
    productsLis[colval.field] = [];
    if(receivedService){
      this.publishbutton=true;
      console.log(tagItems.length);
      if(tagItems.length>0){
        for(let tst in tagItems){
          id = tagItems[tst].id;
          arr_obj_r.push(id);
          name = tagItems[tst].name;

          let chkIndex = productsLis[colval.field].findIndex(
            (option) => option.id == id
          );

          if (chkIndex < 0) {
            productsLis[colval.field].push({id:id,name:name,editAccess:true});
          }

        }
      }
    }

    console.log(arr_obj_r);
    console.log(productsLis[colval.field]);

  if(Array.isArray(productsLis[colval.field]))
  {
    let arr_obj_r=[];
    for (let rr in productsLis[colval.field])

    arr_obj_r.push (productsLis[colval.field][rr].id);
    this.productMatrix_array.push({
      "id":productsLis.uId,
      [colval.columnName]:JSON.stringify(arr_obj_r)
    });
  }
  else
  {
    let fid1='';
    if(colval.headerId==19)
    {
     fid1= productsLis[colval.field].id;
    }
    else
    {
      fid1='["'+productsLis[colval.field].id+'"]';
    }

    this.productMatrix_array.push({
      "id":productsLis.uId,
      [colval.columnName]:fid1
    });
  }
  console.log(productsLis);

  console.log(this.productMatrix_array);

  setTimeout(()=>{                           //<<<---using ()=> syntax
    let elss=document.getElementById('userdefindMake'+productsLis.uId+colval.headerId);

    //var yourElm = document.getElementById("yourElm"); //div in your original code
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss);

   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
    this.renderer.removeClass(parent, 'selectedItemp-table-border');
    this.renderer.removeClass(elss, 'selectedItemp-tabletdcolor-border');

    this.publishbutton=true;
  }, 300);


    });
}

setItemArray(value)
{

  return value.map(e => e.name).join(", ");

}
onChangeselect(event,productsLis,colval)
{

if(colval.columnName=='status')
{
  this.refreshOption=true;
}
  if(Array.isArray(productsLis[colval.field]))
  {
    let arr_obj_r=[];
    //this.productMatrix_array = [];
    for (let rr in productsLis[colval.field])

    arr_obj_r.push (productsLis[colval.field][rr].id);
    this.productMatrix_array.push({
      "id":productsLis.uId,
      [colval.columnName]:JSON.stringify(arr_obj_r)
    });
  }
  else
  {
    let fid1='';
    //this.productMatrix_array = [];
    if(colval.headerId==19)
    {
     fid1= productsLis[colval.field].id;
    }
    else
    {
      fid1='["'+productsLis[colval.field].id+'"]';
    }

    this.productMatrix_array.push({
      "id":productsLis.uId,
      [colval.columnName]:fid1
    });
  }
  console.log(productsLis);

  console.log(this.productMatrix_array);

  setTimeout(()=>{                           //<<<---using ()=> syntax
    let elss=document.getElementById('userdefindMake'+productsLis.uId+colval.headerId);

    //var yourElm = document.getElementById("yourElm"); //div in your original code
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss);

   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
    this.renderer.removeClass(parent, 'selectedItemp-table-border');
    this.renderer.removeClass(elss, 'selectedItemp-tabletdcolor-border');

    this.publishbutton=true;
  }, 300);
}
onChangemake(event,productsLis,hId,colName)
  {

    //console.log(JSON.stringify(productsLis.makeName.name));
    console.log(productsLis.makeName.name);





    let makeVal=event.value.name;
    let mi = this.itemResponse.findIndex(option => option.makeName == makeVal);
        this.getproductmakeLists(this.itemResponse[mi].id,0);


        this.productMatrix_array.push({
          "id":productsLis.uId,
          [colName]:productsLis.makeName.name
        });

        console.log(this.productMatrix_array);

        setTimeout(()=>{                           //<<<---using ()=> syntax
          let elss=document.getElementById('userdefindMake'+productsLis.uId+hId);

          //var yourElm = document.getElementById("yourElm"); //div in your original code
        var selector = "td";
        var parent = this.findParentBySelector(elss, selector);
         // alert(elss);

         //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
         // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

          this.renderer.addClass(parent, 'selectedItemp-table');
          this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
          this.renderer.removeClass(parent, 'selectedItemp-table-border');
          this.renderer.removeClass(elss, 'selectedItemp-tabletdcolor-border');

          this.publishbutton=true;
        }, 300);


  }
//header change event

checkHeaderchange(event)
{
  console.log(event.target.value);
this.isHeaderDatachanged=true;
}

headerValueEvent(event,colLis,defaultValue)
{
  if(this.isHeaderDatachanged)
  {
    this.headerChangedFlag=false;
    this.isModelDatachanged=false;
    //this.publishbutton=true;
    //console.log(JSON.stringify(productuserLis)+'--'+JSON.stringify(event));
    this.checkHeaderExists(colLis.id,colLis);
  }





}


checkHeaderExists(index, value) {


  let apiData = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'placeholder': value.header
  };


  let matrixData = new FormData();
  matrixData.append('apiKey', apiData.apiKey);
  matrixData.append('userId', apiData.userId);
  matrixData.append('domainId', apiData.domainId);
  matrixData.append('countryId', apiData.countryId);
  matrixData.append('placeholder', apiData.placeholder);

  if(value.headerId)
  {
    let id:any = value.headerId;
    matrixData.append('id', id);
  }



  this.matrixFlag = this.ProductMatrixApi.checkHeaderExists(matrixData).subscribe((response) => {

    if(response.status=='Failure')
    {
      this.headerChangedFlag=false;
      this.showError(response.result);
      setTimeout(()=>{                           //<<<---using ()=> syntax
        let elss=document.getElementById('headeredit'+value.headerId);

        //var yourElm = document.getElementById("yourElm"); //div in your original code
      var selector = "th";
      var parent = this.findParentBySelector(elss, selector);
       // alert(elss);

       //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
       // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

        this.renderer.addClass(parent, 'selectedItemp-table-border');
        this.renderer.addClass(elss, 'selectedItemp-tabletdcolor-border');

        this.displayEditHeaderCol=false;
        this.updateHeaderTextFlag=false;
        //this.publishbutton=true;
      }, 300);
    }
    else
    {
      this.modelChangedFlag=true;

      if(this.modelChangedFlag)
      {

        this.productMatrix_headerarr.push({
          "id":value.headerId,
          "placeholder":value.header
        });
       // console.log(this.productMatrix_array);

        setTimeout(()=>{                           //<<<---using ()=> syntax
          let elss=document.getElementById('headeredit'+value.headerId);

          //var yourElm = document.getElementById("yourElm"); //div in your original code
        var selector = "th";
        var parent = this.findParentBySelector(elss, selector);
         // alert(elss);

         //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
         // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

          //this.renderer.addClass(parent, 'selectedItemp-table');
          //this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
         // this.renderer.removeClass(parent, 'selectedItemp-table-border');
          //this.renderer.removeClass(elss, 'selectedItemp-tabletdcolor-border');

          //this.publishbutton=true;
          let index = this.cols.findIndex(
            (option) => option.headerId == value.headerId
          );
          this.cols[index].header = value.header;
          this.updateHeaderTextFlag=false;
          this.displayEditHeaderCol=false;
          this.loading = true;
          setTimeout(()=>{
            this.saveHeaderItemsMatrix();
          },1000);

        }, 300);
      }
    }

    /*
    this.productsList[index].modelExists = (response.status == 'Success') ? false : true;
    if(!this.productsList[index].modelExists) {
      this.modelVal = apiData.ModelName;
      let makeVal:any = this.makeVal;
      this.submitActionFlag = (this.modelVal !='' && (makeVal != 0 && makeVal != '')) ? true : false;
    } else {
      this.submitActionFlag = false;
    }
    */
  });

}


checkModelchange(event)
{
  console.log(event.target.value);
this.isModelDatachanged=true;
//this.searchModel(event.target.value,uId);
}
saveHeaderItemsMatrix()
{


  this.loading=true;
  console.log(this.productMatrix_headerarr);
if(this.productMatrix_headerarr)
{
  let apiData = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'params': JSON.stringify(this.productMatrix_headerarr)
  };


  let matrixData = new FormData();
  matrixData.append('apiKey', apiData.apiKey);
  matrixData.append('userId', apiData.userId);
  matrixData.append('domainId', apiData.domainId);
  matrixData.append('countryId', apiData.countryId);
  matrixData.append('params', apiData.params);

  this.matrixFlag = this.ProductMatrixApi.updatePlaceholderByHeader(matrixData).subscribe((response) => {

    if(response.status=='Success')
    {
      this.productMatrix_headerarr=[];

      this.loading=false;
      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'Product Matrix Header successfully updated';
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');
        $( "th" ).removeClass( "selectedItemp-table" );
        $( "th" ).removeClass( "selectedItemp-table-border" );
        $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor" );
        $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor-border" );


      }, 2000);

    }
    else
{
  this.loading=false;
  this.displayEditHeaderCol=false;
}
  });
}

}
onclickToolbar(event,productList)
{
  let mkevar='';
  let mkevar1='';
  this.loading=true;
let sss="{makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar}";
 //this.productsList.push(sss);
 this.addednewProduct=true;
this.uniqueproductId=productList.uId;
this.getProductLists();
 //this.productsList.unshift({uId:mkevar1,makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar,attributes1:mkevar,attributes2:mkevar,attributes3:mkevar,attributes4:mkevar});
this.addnewrowbgcolor='addnewrow';
this.publishbutton=true;
setTimeout(() => {
$(".addnewrow td").removeClass('frozenptabletow');
},300);

}
saveproductItemsMatrix()
{
  if(!this.productMatrix_headerarr && !this.savedisabledflag)
{
  this.loading=true;
   this.saveHeaderItemsMatrix();

}
if(this.addednewProduct && !this.savedisabledflag)
{
  this.loading=true;
  this.saveproductItems();
}

if(this.savedisabledflag)
{
  this.showError('Model already Exist');
}


  console.log(this.productMatrix_array);
if(this.productMatrix_array && !this.addednewProduct)
{


  this.loading=true;
  let apiData = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'params': JSON.stringify(this.productMatrix_array)
  };


  let matrixData = new FormData();
  matrixData.append('apiKey', apiData.apiKey);
  matrixData.append('userId', apiData.userId);
  matrixData.append('domainId', apiData.domainId);
  matrixData.append('countryId', apiData.countryId);
  matrixData.append('params', apiData.params);

  this.matrixFlag = this.ProductMatrixApi.UpdateProductMatrixByModel(matrixData).subscribe((response) => {

    if(response.status=='Success')
    {
      this.productMatrix_array=[];

      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'Product Matrix data successfully updated';
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');
        $( "td" ).removeClass( "selectedItemp-table" );
        $( "td" ).removeClass( "selectedItemp-table-border" );
        $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor" );
        $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor-border" );

       this.loading=false;
       this.publishbutton=false;
       if(this.refreshOption==true)
       {
         this.refreshOption=false;
          this.itemOffset = 0;
          setTimeout(() => {
            this.productsList = [];
          }, 250);
          this.getProductLists();
       }

      }, 2000);

    }
    else
{
  this.loading=false;
}
  });
}


}
modelValueEvent(event,productuserLis,defaultValue)
{

  if(this.isModelDatachanged)
  {
    this.modelChangedFlag=false;
    this.isModelDatachanged=false;
    this.publishbutton=true;
    console.log(JSON.stringify(productuserLis)+'--'+JSON.stringify(event));
    this.checkModelExists(productuserLis.uId,productuserLis);
  }





}


checkModelExists(index, value) {

  this.productMatrix_array=[];
  let apiData = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'ModelName': value.modelName,
    'MakeName': value.makeName.name
  };


  let matrixData = new FormData();
  matrixData.append('apiKey', apiData.apiKey);
  matrixData.append('userId', apiData.userId);
  matrixData.append('domainId', apiData.domainId);
  matrixData.append('countryId', apiData.countryId);
  matrixData.append('ModelName', apiData.ModelName);
  matrixData.append('makeInfo', apiData.MakeName);

  if(value.uId)
  {
    let id:any = value.uId;
    matrixData.append('modelId', id);
  }



  this.matrixFlag = this.ProductMatrixApi.checkModelExists(matrixData).subscribe((response) => {

    if(response.status=='Failure')
    {

      this.modelChangedFlag=false;
      this.savedisabledflag=true;
     // this.pulishflagDisabled=true;
      this.showError(response.result);
      setTimeout(()=>{                           //<<<---using ()=> syntax
        let elss=document.getElementById('userdefindModel'+value.uId);

        //var yourElm = document.getElementById("yourElm"); //div in your original code
      var selector = "td";
      var parent = this.findParentBySelector(elss, selector);
       // alert(elss);

       //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
       // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

        this.renderer.addClass(parent, 'selectedItemp-table-border');
        this.renderer.addClass(elss, 'selectedItemp-tabletdcolor-border');

        //this.publishbutton=true;
      }, 300);
    }
    else
    {
    this.savedisabledflag=false;
      this.modelChangedFlag=true;

      if(this.modelChangedFlag)
      {

        this.productMatrix_array.push({
          "id":value.uId,
          "model_name":value.modelName
        });
       // console.log(this.productMatrix_array);

        setTimeout(()=>{                           //<<<---using ()=> syntax
          let elss=document.getElementById('userdefindModel'+value.uId);

          //var yourElm = document.getElementById("yourElm"); //div in your original code
        var selector = "td";
        var parent = this.findParentBySelector(elss, selector);
         // alert(elss);

         //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
         // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

          this.renderer.addClass(parent, 'selectedItemp-table');
          this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
          this.renderer.removeClass(parent, 'selectedItemp-table-border');
          this.renderer.removeClass(elss, 'selectedItemp-tabletdcolor-border');

          this.publishbutton=true;
        }, 300);
      }
    }

    /*
    this.productsList[index].modelExists = (response.status == 'Success') ? false : true;
    if(!this.productsList[index].modelExists) {
      this.modelVal = apiData.ModelName;
      let makeVal:any = this.makeVal;
      this.submitActionFlag = (this.modelVal !='' && (makeVal != 0 && makeVal != '')) ? true : false;
    } else {
      this.submitActionFlag = false;
    }
    */
  });

}

// Get Product Matrix Exists
getMatrixData(index, apiData) {

}


  binSelectmultiselect(event)
  {
this.regionselectVal=event.value;


  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    let footerHeight = 0;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+20));
    this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;


  }

  setScreenHeightnew() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = 0;
    this.innerHeightnew = (window.innerHeight-(headerHeight+footerHeight+40));
  }

  matrixListAction(status)
  {

  }
  selectmakemodel()
  {
    this.displaymodelmodel=true;

  }
  editHeaderNew(headerId,col)
  {
    this.displayEditHeaderCol=true;
    console.log(headerId);
    console.log(col);
    console.log(col.headerId);
    console.log(col.header);
    this.attripopupTitleVal = col.header;
    this.attripopupTitleValArr = [];
    this.attripopupTitleValArr = {
      headerId : headerId,
      header: this.attripopupTitleVal
    }

  }
  updateHeaderText(){
    this.updateHeaderTextFlag = true;
    console.log(this.attripopupTitleValArr);
    var headerId = this.attripopupTitleValArr.headerId;
    this.attripopupTitleValArr = {
      headerId : headerId,
      header: this.attripopupTitleVal
    }
    console.log(this.attripopupTitleValArr);

    this.checkHeaderExists(headerId,this.attripopupTitleValArr);
  }
  cancelEditHeaderPopup(){
    this.displayEditHeaderCol=false;
  }
  newMatrix(index) {

    //alert(this.innerHeightFix);
    this.displaymodelmodel=false;

    let mkevar='';
    let mkevar1='';
let sss="{makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar}";
   //this.productsList.push(sss);
   this.addednewProduct=true;

   this.productsList.unshift({uId:mkevar1,makeName:mkevar1,workstreamArr:[],workstreamName:mkevar,modelName:mkevar,attributes1:mkevar,attributes2:mkevar,attributes3:mkevar,attributes4:mkevar,isPredefined:0,editAccess:1});
this.addnewrowbgcolor='addnewrow';
this.publishbutton=true;
setTimeout(() => {
$(".addnewrow td").removeClass('frozenptabletow');
},300);
//$('#productmatrix-table-data').closest('tbody').children('tr:first').addClass('frozenptabletow');
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
    this.isFilterAppliedLoad=true;
    this.loading=true;
    this.getProductLists(this.showuserdashboarddataflag,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
  }
  scroll = (event: any): void => {
    console.log(event);
    console.log(event.target.className);
    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
    {



    let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-10;
      this.scrollTop = event.target.scrollTop-90;
      this.makeRowsSameHeight();
     // console.log(this.scrollTop +'--'+ this.lastScrollTop +'--'+ this.scrollInit);
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
     console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+event.target.scrollHeight);
     if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
     {
     // table.reset()
      //this.dt.reset();
      this.loading=true;
      this.loadDataEvent=true;
      this.getProductLists(this.showuserdashboarddataflag);
      //alert(1);
      event.preventDefault;
     }
    }
  };
  ngOnDestroy() {
    /*
    if (this._changeSubscription !== null) {
      this._changeSubscription.unsubscribe();
    }
    this.bodyElem.classList.remove(this.bodyClass);
    this.footerElem.classList.remove("sidebar");
    this.footerElem.classList.remove("sidebar-active");
    */
  }

  makeRowsSameHeight() {
    setTimeout(() => {
        if (document.getElementsByClassName('p-datatable-scrollable-wrapper').length) {
            let wrapper = document.getElementsByClassName('p-datatable-scrollable-wrapper');
            for (let i = 0; i < wrapper.length; i++) {
               let w = wrapper.item(i) as HTMLElement;
               let frozen_rows: any = w.querySelectorAll('.p-datatable-frozen-view tr');
               let unfrozen_rows: any = w.querySelectorAll('.p-datatable-unfrozen-view tr');
               for (let i = 0; i < frozen_rows.length; i++) {
                  if (frozen_rows[i].clientHeight > unfrozen_rows[i].clientHeight) {
                     unfrozen_rows[i].style.height = frozen_rows[i].clientHeight+"px";
                     }
                  else if (frozen_rows[i].clientHeight < unfrozen_rows[i].clientHeight)
                  {
                     frozen_rows[i].style.height = unfrozen_rows[i].clientHeight+"px";
                  }
                }
              }
            }
         });
       }

       showproductdashboard(param,orderby='',usersortField='',usersortOrder=0)
  {
    this.itemOffset=0;
    this.showuserdashboarddataflag=param;
    if(param==0)
    {
      this.textActivateDeactivate='Activate';
      this.showuserdashboarddataflagUpdate='1';
     this.actionactivatedeact='active';

    }
    if(param==1)
    {
      this.textActivateDeactivate='Deactivate';
      this.showuserdashboarddataflagUpdate='0';
      this.actionactivatedeact='deactive';


    }

    let elss=document.getElementsByClassName('tab-1');
    let el = this.elRef.nativeElement.querySelector(".tab-1");
    let el2 = this.elRef.nativeElement.querySelector(".tab-2");
    if(param==1)
    {
      if(el)

      {

        this.renderer.addClass(el, 'active');

      }
      if(el2)
      {
        this.renderer.removeClass(el2, 'active');

      }
    }
    if(param==0)
    {
      if(el)

      {

        this.renderer.removeClass(el, 'active');

      }
      if(el2)
      {
        this.renderer.addClass(el2, 'active');

      }
    }
    //alert(param);
    let orderbyparam='';
    if(orderby)
    {
  orderbyparam=orderby;
    }
    this.loading=true;

    this.getProductLists(param,orderbyparam,usersortField,usersortOrder);
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
  updateMatrixValues(status)
  {

    this.loading=true;
    let matrixSelectionList = JSON.stringify(this.selectedModelMatrix);
   console.log(matrixSelectionList);

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('status', status);
    apiFormData.append('modelArray', matrixSelectionList)
    this.ProductMatrixApi.actionProductMatrix(apiFormData).subscribe((response) => {
      //this.showuserdashboarddataflag=status;
      this.IncrementAlchangeAdd=0;
      this.matrixSuccess = true;
      if(response.status == 'Success') {
        this.addednewProduct=false;
        //this.loading=false;
        this.selectedModelMatrix=[];
        const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        modalMsgRef.componentInstance.msg = response.result;
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
        }, 2000);
        this.publishbutton=false;
        this.checkedOptActDeAct=false;
        this.successMsg = response.result;

        /*if(status==0)
        {
          this.textActivateDeactivate='Activate';
          this.showuserdashboarddataflagUpdate='1';
         this.actionactivatedeact='active';

        }
        if(status==1)
        {
          this.textActivateDeactivate='Deactivate';
          this.showuserdashboarddataflagUpdate='0';
          this.actionactivatedeact='deactive';


        }*/
        this.itemOffset = 0;
        setTimeout(() => {
          this.productsList = [];
        }, 250);
        this.getProductLists('1');
      }
      setTimeout(() => {
        this.matrixActionFlag = false;
        this.matrixSuccess = false;
      }, 2000);

    });
  }
  cancelproductItems()
  {
   // this.dt.reset();
    this.loading=true;
    this.itemOffset=0;
    this.checkedOptActDeAct=false;
    this.publishbutton=false;
    this.getProductLists();
  }

  saveproductItems() {
    if(this.addednewProduct)
    {
      console.log(this.productsList[0]);

    this.modelVal = this.productsList[0].modelName;
    if(this.productsList[0].makeName.name=='undefined' || this.productsList[0].makeName.name== undefined)
    {
      this.makeVal = this.productsList[0].makeName;
    }
    else{
      this.makeVal = this.productsList[0].makeName.name;
    }
    

   //this.checkModelExists('',this.productsList[0]);
    //alert(this.modelVal+'--'+this.makeVal)
    if(this.publishbutton && !this.savedisabledflag) {


      this.loading = true;
     // let editAction:any = (id > 0) ? 1 : 0;
      let matrixData = new FormData();
      matrixData.append('apiKey', Constant.ApiKey);
      matrixData.append('userId', this.userId);
      matrixData.append('domainId', this.domainId);
      matrixData.append('countryId', this.countryId);
      matrixData.append('ModelName', this.modelVal);
      matrixData.append('MakeName', this.makeVal);
      matrixData.append('makeInfo', this.makeVal);
      matrixData.append('params', JSON.stringify(this.productMatrix_array));
     // matrixData.append('isEdit', editAction);



      this.ProductMatrixApi.SaveproductMatrixBYModel(matrixData).subscribe((response) => {
        this.matrixSuccess = true;
        if(response.status == 'Success') {
          this.productMatrix_array = [];
          this.addednewProduct=false;
          this.publishbutton=false;
          this.successMsg = response.result;
          const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        modalMsgRef.componentInstance.msg = response.result;
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
        }, 2000);
          this.itemOffset = 0;
          setTimeout(() => {
            this.productsList = [];
          }, 250);
          this.getProductLists('1');
        }
        else
        {
          this.showError(response.result);
        }
        setTimeout(() => {
          this.matrixActionFlag = false;
          this.matrixSuccess = false;
        }, 2000);
      });
    }
  }

  }
  getProductLists(userparamData='',orderbyparam='',gusersortField='',gusersortOrder=0,dataFilterEvent='') {

    if(dataFilterEvent)
    {
      dataFilterEvent=JSON.stringify(dataFilterEvent);
      if(this.isFilterApplied || this.itemOffset==0)
      {
        this.itemOffset=0;
        this.productsList = [];
        this.itemTotal = 0;
        this.itemLength = 0;
      }
      this.isFilterApplied=false;
    }
    if(this.isFilterAppliedLoad){
      dataFilterEvent = this.dataFilterEvent;
      dataFilterEvent=JSON.stringify(dataFilterEvent);
    }


    let isActiveparam='';
  // alert(userparamData);
    if(this.itemOffset==0)
    {
      this.productsList = [];
      this.itemTotal = 0;
      this.itemLength = 0;
    }

  isActiveparam=this.showuserdashboarddataflag;
  if(isActiveparam=='1')
  {
    this.activeTab='active';
    this.inActiveTab='';
  }
  else
  {

    this.activeTab='';
    this.inActiveTab='active';

  }

//alert(isActiveparam);

    this.createAccess = true;
    this.headerFlag = false;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.itemOffset;
    let sortorderint:any=gusersortOrder;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('isActive', isActiveparam);
    apiFormData.append('searchKey', this.apiData['searchKey']);
    apiFormData.append('uniqueproductId', this.uniqueproductId);
    apiFormData.append('orderby', orderbyparam);
  apiFormData.append('sortOrderField', gusersortField);
  apiFormData.append('sortOrderBy', sortorderint);
  apiFormData.append('filterOptions', dataFilterEvent);

    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    this.ProductMatrixApi.fetchProductLists(apiFormData).subscribe((response) => {

      this.checkedItemBox=false;
      if(response.status == "Success") {


        this.loadDataEvent=false;
        this.loading = false;
        let resultData = response.modelData;
        if (resultData == '') {
          this.ItemEmpty = true;
          this.headercheckDisplay = 'checkbox-hide';
          if(this.apiData['searchKey'] != '') {
            this.productsList = [];
            this.ItemEmpty = false;
            this.displayNoRecords = true;

          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          this.ItemEmpty = false;
          this.itemTotal = response.total;
          this.itemLength += resultData.length;
          this.itemOffset += this.itemLimit;

          //console.log(this.matrixSelectionList.length)
          if(this.matrixSelectionList.length > 0) {
            this.headerCheck = 'checked';
          }

          let loadItems = false;
          for (let i in resultData) {
            if(this.uniqueproductId)
            {



              this.productsList.unshift(resultData[i]);
              this.uniqueproductId='';
            }
            else
            {
              if(resultData[i].updatedOn)
              {

                let proposedFixCreatedDate = moment.utc(resultData[i].updatedOn).toDate();
                resultData[i].updatedOn = moment(proposedFixCreatedDate).local().format('MMM DD, YYYY');
              }

              this.productsList.push(resultData[i]);
            }


          }

        }
      }
      else
      {
        this.loadDataEvent=false;
        this.loading=false;
        if(this.apiData['offset']==0)
        {
         // this.noUserListFound=true;
        }
      }
      //console.log(response+'---');
    });

    console.log(this.productsList[0]+'---');
    console.log(JSON.stringify(this.productsList)+'---');
  }

}
