import { Component, Renderer2, EventEmitter, ViewChild, HostListener, OnInit, Output, Input, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { Constant,IsOpenNewTab,ManageTitle, DispatchText, ContentTypeValues } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { CommonService } from '../../../services/common/common.service';
import { Subscription } from "rxjs";
import * as moment from 'moment';
import { Table } from "primeng/table";
import { GoogleMap } from '@angular/google-maps';
import { RepairOrderService } from 'src/app/services/repair-order/repair-order.service';
import { ApiService } from '../../../services/api/api.service';
import { Title,DomSanitizer } from "@angular/platform-browser";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { settings } from 'cluster';

@Component({
  selector: 'app-ro-estimation',
  templateUrl: './ro-estimation.component.html',
  styleUrls: ['./ro-estimation.component.scss']
})
export class RoEstimationComponent implements OnInit {
  @Input() public roData;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @Output() roestimationActionEmit: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();

  public bodyClass1: string = "parts-list";
  public redirectionPage='';
  public pageTitleText='';
  public apiKey: string = Constant.ApiKey;
  public fromSearch = "";
  public filterOptions: any = [];

  public assetPath: string = "assets/images/";
  public assetShopPath: string = `${this.assetPath}shop`;
  public assetPartPath: string = `${this.assetPath}parts`;
  public redirectUrl: string = "shop/view/";
  public defShopBanner: string = `${this.assetPath}common/default-shop-banner.png`;

  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public expandFlag: boolean;
  public accessFrom: string = "";
  public shopApiCall;
  public shopWsApiCall;
  public shopType: string = "";
  public publishStatus: string = "";
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId='';
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;

  public groupId: number = 6;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public itemResponse = [];
  public shopSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public shopUrl='';
  public newPartInfo: string = "Get started by tapping on ‘New SHOP’.";
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public priorityIndexValue='';
  public shopIdArrayInfo: any=[];
  public shopAPICount: any="0";
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public filterrecords : boolean = false;

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;

  repairOrderListColumns: any = [];
  repairOrderList: any = [];

  detailRepairOrderList: any = [];

  estimationListArray: any = [];
  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";

  public showMap: any = false;
  public shopId: number;
  public businessName: string = '';
  public shopIndex: number;
  public updateMasonryLayout: boolean = false;
  public mapHeaderDate = '';
  public mapId = '';
  public center: google.maps.LatLngLiteral;
  public options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
  };
  mapData: any;
  mapValueData: any;
  mapHeight: any;

  public listView: boolean = true;
  public description: string = '';
  public odometerFlag: boolean = false;
  public problemDescFlag: boolean = false;
  public errroMsgFlag: boolean = false;
  public tax: number = 0;
  public taxView: number = 0;
  public totalInvoice: number = 0;
  public totalInvoiceShowOnly: number = 0;
  public totalInvoiceView: number = 0;
  public totalInvoiceViewOnly: number = 0;

  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault: this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loading,
    action: false,
    repairOrderList: this.repairOrderList,
    itemOffset: this.itemOffset,
    itemTotal: this.itemTotal,
    searchVal: this.searchVal,
    headerAction: false,
    filterrecords: this.filterrecords,
  };
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  public tvsDomain: boolean = false;
  public searchAction: boolean = false;
  public bodyElem;

  public repairOrderModal: boolean = false;
  public manageTitle: string = 'New Repair Order';
  serviceForm: FormGroup;
  serviceShopForm: FormGroup;
  serviceTechForm: FormGroup;
  serviceContactForm: FormGroup;
  public phoneNumberData:any;
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phonenoInputFlag:boolean = true;
  public phoneNumberValid:boolean = false;
  public invalidNumber:boolean = true;
  public emailValidationError:boolean = false;
  public emailValidationErrorMsg = "";

  selectedCustomer: any = [];
  selectedCustomerId: any = [];
  selectedContact: any = [];
  selectedContactId: any = [];
  selectedTech: any = [];
  selectedTechId: any = [];
  regContactId: any = [];
  serviceSubmit = false;
  serviceFormValid = false;
  Time: any = [];
  Status: any = [];
  contacts: any = [];
  bussContacts: any = [];
  bussCustomers: any = [];
  Technician: any = [];
  serviceTech: any = [];
  Models: any = [];
  Makes: any = [];
  Years: any = [];
  vinIsValid = false;
  public vinVerfied = true;
  makeList: any;
  public parkingLot: boolean = false;
  public vehicleFormInfo = [];
  public vinValid = true;
  public vinDisable = false;
  public modelDisable:boolean = true;
  public modelLoading:boolean = false;
  public vinData: any = [];
  public modelPlaceHoder = "Select";
  public serviceShopSubmit:boolean = false;
  public serviceContactSubmit:boolean = false;
  public serviceTechSubmit:boolean = false;
  submitClicked = false
  formProcessing: boolean = false;
  public actionForm = '';
  public actionTitle = '';
  public actionFlag:boolean = false;
  public modalState = 'new';
  public servicetype: string = '';
  public servicetypeOptions: any = [];

  public workstreamSelection: any = [];
  public workstreamValid: boolean = true;
  public defaultWSLabel: string = 'Select Workstream';
  public workstreamName = [];
  public workstreamItems: any = [];
  public workstreamId: any = [];
  public workstream: any = [];
  public currYear: any = moment().format('Y');
  public initYear = 1960;

  public postUploadActionTrue: boolean = false;
  public postUpload: boolean = true;
  public manageAction: string;
  public postApiData: object;
  public uploadedItems: any = [];
  public commentUploadedItemsFlag: boolean = false;
  public commentUploadedItemsLength: number = 0;
  public contentType: number = 50;
  public mediaUploadItems: any = [];
  public mediaAttachments: any = [];
  public mediaAttachmentsIds: any = [];
  public displayOrder: number = 0;
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};
  public unit: string = '';
  public unitOptions: any = [];

  public bussContact: string = '';
  public bussCustomer: string = '';
  public contactTechnician: string = '';
  public bodyClass2: string = "submit-loader";
  public bodyClass:string = "auth-index";

  public workOrderType: string = 'new';
  public workOrderId: string = '';
  public shopExist = true;
  public existError = '';
  public viewOptions: any = [];
  public view: any = '';
  public platform: any = 3;
  displayModal = false;
  displayNote = false;
  Shops: any = [];
  public empty: any = [];
  public contactDisable: boolean = true;
  public showClear = false;
  selectedShop;
  public serviceId: number = null;
  public odo;
  public pTableHeight = '280px';
  public estimationView: boolean = false;
  public estimationUpdate: boolean = false;
  public productsList = [];
  public escalationMatrix_array=[];
  public publishbutton: boolean = false;
  public addnewrowbgcolor:string;
  public dragdropbgcolor: string;
  public ItemEmpty: boolean = false;

  public jobCodeArray=[];
  public jobTitleArray=[];
  public jobDescArray=[];
  public jobqtyArray=[];
  public totalInvoice1: boolean = false;
  public totalInvoice2: boolean = false;
  public zeroVal: number = 0;

  constructor(
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public apiUrl: ApiService,
    private repairOrderApi: RepairOrderService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private LandingpagewidgetsAPI: LandingpageService,
    private authenticationService: AuthenticationService,
    private renderer: Renderer2,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  // convenience getters for easy access to form fields
  get sf() { return this.serviceForm.controls; }
  get stf() { return this.serviceTechForm.controls; }
  get scf() { return this.serviceContactForm.controls; }
  get shf() { return this.serviceShopForm.controls; }

  ngOnInit(): void {
    console.log(this.roData);

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    if(this.roData.access == 'new'){
      this.estimationView = false;
      this.estimationUpdate = true;
      this.productsList = [];
      this.escalationMatrix_array = [];
      this.itemEmpty = true;
      this.totalInvoice2 = false;
      this.totalInvoice = 0;
      this.totalInvoiceShowOnly = this.totalInvoice;
      this.getRepairOrderList(false);
    }
    else if(this.roData.access == 'edit'){
      this.productsList = [];
      this.escalationMatrix_array = [];
      this.getRepairOrderList(false);
      setTimeout(() => {
        this.estimationView = false;
        this.estimationUpdate = true;

        let itemArr = this.roData.selectedItems?.estimationArray ? this.roData.selectedItems.estimationArray : '' ;
        this.totalInvoice = itemArr?.length>0 ? this.roData.selectedItems?.estimationTotal : 0;
        this.totalInvoiceShowOnly = Math.abs(this.totalInvoice);
        this.productsList = itemArr?.length>0 ? itemArr : [];
        this.totalInvoice2 = itemArr?.length>0 ? true : false;
        console.log(this.productsList)
        if(this.totalInvoice2){
          for (let index in this.productsList){
            let overwrite = this.productsList[index].jobpriceOverwrite == '1' ? this.productsList[index].jobpriceOverwrite : '0';
            this.escalationMatrix_array.push({
              "id":this.productsList[index].id,
              "jobcode":this.productsList[index].jobcode,
              "jobtitle":this.productsList[index].jobtitle,
              "jobdesc":this.productsList[index].jobdesc,
              "jobprice":this.productsList[index].jobprice,
              "jobpriceShowOnly":this.productsList[index].jobpriceShowOnly,
              "jobpriceOverwrite":overwrite,              
              "jobqty":this.productsList[index].jobqty,
              "jobtotal":this.productsList[index].jobtotal,
            });
          }
          this.checkUpdateArray();
          console.log(this.escalationMatrix_array);
          let data = {
            estimationArray: this.escalationMatrix_array,
            estimationTotal: this.totalInvoice
          };
          this.roestimationActionEmit.emit(data);
        }

        this.itemEmpty = itemArr.length>0 ? false : true;
      }, 1);
    }
    else{
      if(this.roData.estimationData != ''){
        this.estimationView = true;
        this.estimationUpdate = false;
        let itemArr = this.roData.estimationData;
        this.detailRepairOrderList = itemArr['estimationArray'];
        console.log(this.detailRepairOrderList);
        this.loading = false;
        this.itemEmpty = false;
        this.displayNoRecords = false;
        this.itemTotal = this.detailRepairOrderList.length;
        if(this.detailRepairOrderList.length>0){
          this.totalInvoiceView = this.roData.estimationData['estimationTotal']
          this.totalInvoiceViewOnly = Math.abs(this.roData.estimationData['estimationTotal']);
        }
      }
      else{
        this.estimationView = false;
      }
    }

    for (let y = 1; y < 11; y++) {
      this.jobqtyArray.push(y);
    }

    this.servicetype = "Tech Support";
    this.servicetypeOptions = ["Tech Support" ,"remote"];

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    console.log(this.bodyHeight)
    this.repairOrderListColumns = [
      {field: 'id', columnName: 'id', header: 'Job', headerId: "1", inputType: "1", columnpredefind: "1", columnpclass: 'header ro-ta-col-1 col-sticky'},
      {field: 'jobcode', columnName: 'jobcode', header: 'Job Code', headerId: "2", columnpredefind: "1", inputType: "2", columnpclass: 'header ro-ta-col-2'},
      {field: 'jobtitle', columnName: 'jobtitle', header: 'Job Title', headerId: "3", columnpredefind: "1", inputType: "3", columnpclass: 'header ro-ta-col-3'},
      {field: 'jobdesc', columnName: 'jobdesc', header: 'Job Description', headerId: "4", columnpredefind: "1", inputType: "4", columnpclass: 'header ro-ta-col-4'},
      {field: 'jobprice', columnName: 'jobprice', header: 'Unit Price', headerId: "5", columnpredefind: "1", inputType: "5", columnpclass: 'header ro-ta-col-5'},
      {field: 'jobqty', columnName: 'jobqty', header: 'Qty', headerId: "6", inputType: "5", columnpredefind: "1", columnpclass: 'header ro-ta-col-6'},
      {field: 'jobtotal', columnName: 'jobtotal', header: 'Total', headerId: "7", inputType: "7", columnpredefind: "1", columnpclass: 'header ro-ta-col-7'},
    ];


  }

  // Get SHOP List
  getRepairOrderList(pushFlag,limit:any = '') {

    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    let formData = new FormData();
    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('contentTypeId', ContentTypeValues.RepairOrder);
    //formData.append('limit', this.itemLimit);
    //formData.append('offset', this.itemOffset);
    if(this.estimationUpdate){
      formData.append('fromRepairOrderPage', '1');
      formData.append('make', this.roData.make);
      formData.append('model', this.roData.model);
    }
    else{
      formData.append('workOrderId', this.roData.id );
    }

    formData.append('fromWorkOrder', '1' );    
    

    this.repairOrderApi.getJOBDetailsList(formData).subscribe(response => {
      console.log(response);
      let resultData = [];

      response = response.data;
      resultData = response.items;


      this.itemTotal = response.total;
      this.loading = false;
      this.lazyLoading = this.loading;

      this.jobCodeArray=[];
      this.jobTitleArray=[];
      this.jobDescArray=[];
      this.repairOrderList =[];

      if(this.itemTotal>0){
        if(resultData.length>0){

          for(let item in resultData){
            let overwrite = resultData[item].jobpriceOverwrite == '1' ? resultData[item].jobpriceOverwrite : '0';
            resultData[item].jobcode = resultData[item].jobCode;
            resultData[item].jobtitle = resultData[item].title;
            resultData[item].jobdesc = resultData[item].description;
            resultData[item].jobprice = resultData[item].unitPrice;
            resultData[item].jobpriceOverwrite = overwrite;
            resultData[item].jobpriceShowOnly = Math.abs(resultData[item].unitPrice);         
            resultData[item].jobqty = resultData[item].jobqty;
            resultData[item].jobtotal = resultData[item].jobtotal;

            this.jobCodeArray.push({
              name : resultData[item].jobcode
            });
            this.jobTitleArray.push({
              name:resultData[item].jobtitle
            });
            this.jobDescArray.push({
              name:resultData[item].jobdesc
            });

            this.repairOrderList.push(resultData[item]);

          }

          console.log(this.productsList)
          this.checkUpdateArray();

        }
      }
      else{
        this.itemEmpty = true;
      }


    });
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    this.innerHeight = 363;
  }

  addjob(){
    if(this.productsList?.length>0){
      this.addnewrowbgcolor='addnewrow';
      /*if(this.escalationMatrix_array.length == 0){
        this.addnewrowbgcolor='addnewrowerror';
        return false;
      } */

      if(this.productsList.length>0)
      {
        for (let wsd in this.productsList)
        {
          console.log(this.productsList[wsd]);
          if(this.productsList[wsd].jobqty=='' || this.productsList[wsd].jobprice==''){
            this.addnewrowbgcolor='addnewrowerror';
            return false;
          }
        }
      }

    }
    /*if(this.productsList?.length==0){
      this.itemEmpty = false;
      let idVal = this.productsList?.length + 1;
      this.productsList.push(
        { id: idVal, newmatrix: idVal, jobcode: "", jobtitle: "", jobdesc : '', jobprice : '', jobqty: 1, jobtotal: '' },
      );
    }
    else{ */
      let idVal = 1;
      this.itemEmpty = false;
      if(this.productsList){
        if(this.productsList?.length>1){
          let lastIdVal = this.productsList[this.productsList.length - 1].id;
          console.log(lastIdVal);
          idVal = lastIdVal + 1;          
        }
        else if(this.productsList?.length==1){
          let lastIdVal = this.productsList[0].id;
          idVal = lastIdVal + 1;          
        }
        else{
          idVal = 1;
        }
      }
      //alert(idVal)

      //let idVal = this.productsList?.length + 1;
      this.productsList.push(
        { id: idVal, newmatrix: idVal, jobcode: "", jobtitle: "", jobdesc : '', jobprice : '', jobpriceOverwrite: '0', jobqty: 1, jobtotal: '' },
      );
    //}

    console.log(this.productsList)

  }


  deleteAction(index){

    console.log(this.escalationMatrix_array);
    console.log(this.productsList);

    this.productsList.splice(index, 1);
    if(this.productsList?.length>0){
    this.escalationMatrix_array = [];
    for (let index1 in this.productsList){
      let overwrite = this.productsList[index1].jobpriceOverwrite == '1' ? this.productsList[index1].jobpriceOverwrite : '0';
      this.escalationMatrix_array.push({
        "id":this.productsList[index1].id,
        "jobcode":this.productsList[index1].jobcode,
        "jobtitle":this.productsList[index1].jobtitle,
        "jobdesc":this.productsList[index1].jobdesc,
        "jobprice":this.productsList[index1].jobprice,
        "jobpriceShowOnly":Math.abs(this.productsList[index1].jobprice),
        "jobpriceOverwrite":overwrite,
        "jobqty":this.productsList[index1].jobqty,
        "jobtotal":this.productsList[index1].jobtotal,
        "jobtotalShowOnly":Math.abs(this.productsList[index1].jobtotal),
      });
    }
  }
  else{
    this.escalationMatrix_array = [];
  }

    console.log(this.escalationMatrix_array);
    console.log(this.productsList);

    if(this.productsList?.length==0){
      this.itemEmpty = true;
      this.totalInvoice2 = false;
      this.totalInvoice = 0;
      this.totalInvoiceShowOnly = this.totalInvoice;
    }
    this.calculateAmt();

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

  setItemArray(value)
  {

    return value.map(e => e.name).join(", ");

  }
  setItemSpace(value)
  {

    return value.map(e => e).join(", ");

  }
  onChangeOption(event, productsLis, hId, colName,index='') {
    console.log(event);
    console.log(productsLis);
    console.log(this.productsList[index]);
    console.log(hId);
    console.log(colName);
    console.log(index);

    switch(colName){
      case 'jobcode':
        for(let rolist in this.repairOrderList) {
          if(this.repairOrderList[rolist].jobcode == productsLis.jobcode) {
            productsLis.jobtitle = this.repairOrderList[rolist].jobtitle;
            productsLis.jobdesc = this.repairOrderList[rolist].jobdesc;
            productsLis.jobprice = this.repairOrderList[rolist].jobprice;
            productsLis.jobpriceShowOnly = Math.abs(this.repairOrderList[rolist].jobprice);
            productsLis.jobtotal = productsLis.jobqty * productsLis.jobprice;
            productsLis.jobtotalShowOnly = Math.abs(productsLis.jobtotal);
          }
        }
        break;
      case 'jobdesc':
          for(let rolist in this.repairOrderList) {
            if(this.repairOrderList[rolist].jobdesc == productsLis.jobdesc) {
              productsLis.jobtitle = this.repairOrderList[rolist].jobtitle;
              productsLis.jobcode = this.repairOrderList[rolist].jobcode;
              productsLis.jobprice = this.repairOrderList[rolist].jobprice;
              productsLis.jobpriceShowOnly = Math.abs(this.repairOrderList[rolist].jobprice);
              productsLis.jobtotal = productsLis.jobqty * productsLis.jobprice;
              productsLis.jobtotalShowOnly = Math.abs(productsLis.jobtotal);
            }
          }
          break;
        case 'jobtitle':
            for(let rolist in this.repairOrderList) {
              if(this.repairOrderList[rolist].jobtitle == productsLis.jobtitle) {
                productsLis.jobcode = this.repairOrderList[rolist].jobcode;
                productsLis.jobdesc = this.repairOrderList[rolist].jobdesc;
                productsLis.jobprice = this.repairOrderList[rolist].jobprice;
                productsLis.jobpriceShowOnly = Math.abs(this.repairOrderList[rolist].jobprice);
                productsLis.jobtotal = productsLis.jobqty * productsLis.jobprice;
                productsLis.jobtotalShowOnly = Math.abs(productsLis.jobtotal);
              }
            }
            break;
      case  'jobqty':
        productsLis.jobtotal = productsLis.jobqty * productsLis.jobprice;
        productsLis.jobtotalShowOnly = Math.abs(productsLis.jobtotal);
      break;
    }

    console.log(productsLis);
    console.log(this.productsList[index]);
   
     
      if(this.escalationMatrix_array.length>0)
      {
        for (let wsd in this.escalationMatrix_array)
        {
          let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsLis.id);
          if(studentObj)
          {
            if(colName=='jobcode' || colName=='jobtitle' || colName=='jobdesc')
            {
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobcode = this.productsList[index].jobcode;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtitle = this.productsList[index].jobtitle;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobdesc = this.productsList[index].jobdesc;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobprice = this.productsList[index].jobprice;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobpriceShowOnly = Math.abs(this.productsList[index].jobprice);
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotal = this.productsList[index].jobtotal;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotalShowOnly = Math.abs(this.productsList[index].jobtotal);
            }            
            if(colName=='jobqty')
            {
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobqty = this.productsList[index].jobqty;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobprice = this.productsList[index].jobprice;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobpriceShowOnly = Math.abs(this.productsList[index].jobprice);
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotal = this.productsList[index].jobtotal;
              this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotalShowOnly = Math.abs(this.productsList[index].jobtotal);
            }
          }
          else
          {
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "jobcode":this.productsList[index].jobcode,
              "jobtitle":this.productsList[index].jobtitle,
              "jobdesc":this.productsList[index].jobdesc,
              "jobprice":this.productsList[index].jobprice,
              "jobpriceShowOnly":Math.abs(this.productsList[index].jobprice),
              "jobpriceOverwrite":this.productsList[index].jobpriceOverwrite,
              "jobqty":this.productsList[index].jobqty,
              "jobtotal":this.productsList[index].jobtotal,
              "jobtotalShowOnly":Math.abs(this.productsList[index].jobtotal),
            });
          }
        }
      }
      else
      {
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "jobcode":this.productsList[index].jobcode,
          "jobtitle":this.productsList[index].jobtitle,
          "jobdesc":this.productsList[index].jobdesc,
          "jobprice":this.productsList[index].jobprice,
          "jobpriceShowOnly":Math.abs(this.productsList[index].jobprice),
          "jobpriceOverwrite":this.productsList[index].jobpriceOverwrite,
          "jobqty":this.productsList[index].jobqty,
          "jobtotal":this.productsList[index].jobtotal,
          "jobtotalShowOnly":Math.abs(this.productsList[index].jobtotal),
        });
      }

      
      setTimeout(() => {
        console.log(this.escalationMatrix_array);
        this.calculateAmt();  
      }, 100);
        

  }
  checkUpdateArray(){
    this.jobCodeArray=[];
    this.jobTitleArray=[];
    this.jobDescArray=[];
    for(let item in this.repairOrderList){
      this.jobCodeArray.push({
        name:this.repairOrderList[item].jobcode
      });
      this.jobTitleArray.push({
        name : this.repairOrderList[item].jobtitle
      });
      this.jobDescArray.push({
        name : this.repairOrderList[item].jobdesc
      });
    }

    for(let rolist in this.escalationMatrix_array) {
      if(this.productsList.length>0)
      {
        for (let wsd in this.productsList)
        {
          if(this.escalationMatrix_array[rolist].jobcode == this.productsList[wsd].jobcode) {

            let index1 = this.jobCodeArray.findIndex(option => option.name == this.productsList[wsd].jobcode);
            if(index1 >= 0 ){
              this.jobCodeArray.splice(index1, 1);
            }

            let index2 = this.jobTitleArray.findIndex(option => option.name == this.productsList[wsd].jobtitle);
            if(index2 >= 0 ){
              this.jobTitleArray.splice(index2, 1);
            }

            let index3 = this.jobDescArray.findIndex(option => option.name == this.productsList[wsd].jobdesc);
            if(index3 >= 0 ){
              this.jobDescArray.splice(index3, 1);
            }

          }
        }
      }
    }

    //console.log(this.jobCodeArray);

  }
  calculateAmt(){
    let totalInvoice = 0;
    for(let item in this.escalationMatrix_array){
      totalInvoice +=  this.escalationMatrix_array[item].jobtotal;
    }

    this.totalInvoice = parseFloat(totalInvoice.toFixed(2));
    this.totalInvoiceShowOnly = Math.abs(parseFloat(totalInvoice.toFixed(2)));

   // this.totalInvoice = (totalInvoice);
    //this.totalInvoiceShowOnly = Math.abs((totalInvoice));

    this.totalInvoice2 = true;

    console.log(totalInvoice);

    setTimeout(() => {
      this.checkUpdateArray();
      
      console.log(this.escalationMatrix_array);
      let data = {
        estimationArray: this.escalationMatrix_array,
        estimationTotal: this.totalInvoice
      };
      this.roestimationActionEmit.emit(data);
    }, 300);

  }

  isNumberKey(key,value,columnName){    
    var keycode = (key.which) ? key.which : key.keyCode;
    console.log(keycode);
    console.log(value.length)
    console.log(columnName)
    if(value.length==0 && (columnName == 'jobprice')){
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

  inputChange(event, productsLis, hId, colName,index='')
{

  console.log(event.target.value);
    console.log(productsLis);
    console.log(hId);
    console.log(colName);
    console.log(index);

    if(colName=='jobprice'){
      this.productsList[index].jobprice =  event.target.value;
      this.productsList[index].jobpriceShowOnly =  Math.abs(event.target.value);
    }
    if(colName=='jobqty'){
      this.productsList[index].jobqty =  event.target.value;      
    }
    
    this.productsList[index].jobtotal = this.productsList[index].jobqty * this.productsList[index].jobprice;
    this.productsList[index].jobtotalShowOnly = Math.abs(this.productsList[index].jobtotal);

    console.log(this.escalationMatrix_array);
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        let studentObj =  this.escalationMatrix_array.find(t=>t.id==productsLis.id);
        if(studentObj)
        {
        
          if(colName=='jobqty')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobqty = this.productsList[index].jobqty;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotal = this.productsList[index].jobtotal;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotalShowOnly = this.productsList[index].jobtotalShowOnly;
          }
          if(colName=='jobprice')
          {
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobprice = this.productsList[index].jobprice;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobpriceShowOnly = this.productsList[index].jobpriceShowOnly;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotal = this.productsList[index].jobtotal;
            this.escalationMatrix_array.find(item => item.id == productsLis.id).jobtotalShowOnly = this.productsList[index].jobtotalShowOnly;
          }
                           
          
        }
        else
        {         
          if(colName=='jobqty'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "jobqty":this.productsList[index].jobqty,
              "jobtotal":this.productsList[index].jobtotal,
              "jobtotalShowOnly":this.productsList[index].jobtotalShowOnly
            });
          }
          if(colName=='jobprice'){
            this.escalationMatrix_array.push({
              "id":productsLis.id,
              "jobprice":this.productsList[index].jobprice,
              "jobpriceShowOnly":this.productsList[index].jobpriceShowOnly,
              "jobtotal":this.productsList[index].jobtotal,
              "jobtotalShowOnly":this.productsList[index].jobtotalShowOnly
            });
          }  
        }
      }
    }
    else
    {
      if(colName=='jobqty'){
        this.escalationMatrix_array.push({
          "id":productsLis.id,
          "jobqty":this.productsList[index].jobqty,
          "jobtotal":this.productsList[index].jobtotal,
          "jobtotalShowOnly":this.productsList[index].jobtotalShowOnly
        });
      }
      if(colName=='jobprice'){
        this.escalationMatrix_array.push({
            "id":productsLis.id,
            "jobprice":this.productsList[index].jobprice,
            "jobpriceShowOnly":this.productsList[index].jobpriceShowOnly,
            "jobtotal":this.productsList[index].jobtotal,
            "jobtotalShowOnly":this.productsList[index].jobtotalShowOnly
          });
        }      
    }
    console.log(this.escalationMatrix_array);

 
    if(this.escalationMatrix_array.length>0)
    {
      for (let wsd in this.escalationMatrix_array)
      {
        if(this.repairOrderList.length>0)
        {
          for (let swsd in this.repairOrderList)
          {
            if(this.escalationMatrix_array[wsd].jobcode == this.repairOrderList[swsd].jobcode){
              console.log(this.escalationMatrix_array[wsd].jobprice);
              console.log(this.repairOrderList[swsd].jobprice);
              if(this.escalationMatrix_array[wsd].jobprice != this.repairOrderList[swsd].jobprice){
                this.escalationMatrix_array[wsd].jobpriceOverwrite = '1';
              }
            }              
          }
        }
                 
      }
    }

    this.calculateAmt();

}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

