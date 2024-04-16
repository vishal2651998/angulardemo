import {Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { Constant, DefaultNewImages, serviceDurations, DispatchText, ManageTitle, RedirectionPage, windowHeight } from 'src/app/common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { ManageUserComponent } from '../../../components/common/manage-user/manage-user.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { MatMenuTrigger } from '@angular/material';
import { countries } from 'country-data';
import * as moment from 'moment';
import * as ClassicEditor from "src/build/ckeditor";
import { GoogleMap } from '@angular/google-maps';
import { Subscription } from "rxjs";

interface Country {
  label: string;
  val: string;
}
@Component({
  selector: 'app-dispatch-page',
  templateUrl: './dispatch-page.component.html',
  styleUrls: ['./dispatch-page.component.scss'],
})
export class DispatchPageComponent implements OnInit {
  @Input() displayModalChanged = false;
  @Input() selectedDay;
  @Input() public filteredYears;
  @Output() dispatchComponentRef: EventEmitter<DispatchPageComponent> = new EventEmitter();
  @Output() callback: EventEmitter<DispatchPageComponent> = new EventEmitter();
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @ViewChild(MatMenuTrigger, { static: false }) matMenuTrigger: MatMenuTrigger;
  subscription: Subscription = new Subscription();
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  public sconfig: PerfectScrollbarConfigInterface = {};
  serviceForm: FormGroup;
  serviceCatgForm: FormGroup;
  serviceShopForm: FormGroup;
  serviceContactForm: FormGroup;
  public navTech: boolean = false;
  public thumbView = false;
  public emptyTech: boolean = false;
  public updateMasonryLayout = false;
  public displayNoRecords = false;
  public isMobileTech: boolean = false;
  public isAdminView: boolean = false;
  public serviceList: any = [];
  public unassignedList: any = [];
  public stateList: any = [];
  public emptyTechList: any = {NA: {items: [],total: 0}};
  public durationList: any = serviceDurations;
  public timeZoneList: any = [{id: 'EST', name: 'EST'},{id: 'CST', name: 'CST'},{id: 'MST', name: 'MST'},{id: 'PST', name: 'PST'}]
  public statusList: any = [];
  public profileImage = '';
  public mapHeaderDate = '';
  public mapId = '';
  public showClear = false;
  public vinVerfied = true;
  public isToday = false;
  public actionFlag:boolean = false;
  public roExist = true;
  public catgExist = true;
  public shopExist = true;
  public existError = '';
  public actionForm = '';
  public actionTitle = '';
  public viewOptions: any = [];
  public view: any = '';
  public platform: any = 3;
  displayModal = false;
  displayNote = false;
  Shops: any = [];
  mapOptions = {};
  mapOverlays = [];
  date3: Date;
  serviceSubmit = false;
  serviceFormValid = false;
  serviceCatgSubmit = false;
  submitClicked = false
  serviceShopSubmit = false;
  serviceContactSubmit = false;
  formProcessing: boolean = false;
  vinIsValid = false;
  rightPanelCollapse: boolean = true;
  Time: any = [];
  Status: any = [];
  contacts: any = [];
  Technician: any = [];
  Models: any = [];
  Makes: any = [];
  Years: any = [];
  serviceCategory: any = [];
  serviceDateConnect: any = [];
  techSelected: Country = this.Technician[0];
  techList: any = [];
  prevTechId: any = 0;
  currTechIndex: any = 0;
  selectedShop;
  selectedContact: any = [];
  selectedContactId: any = [];
  displayDetails = false;
  public modelPlaceHoder = "Select";
  public serviceAPIcall;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId;
  public itemLimit = 10;
  public itemOffset = 0;
  disableLoading = false;
  loadingDispatch = false;
  loadingUnassigned = false;
  today = moment().format('YYYY-MM-DD');
  @Output() selectedDayChange: EventEmitter<any> = new EventEmitter<any>();
  serviceData: any = [];
  makeList: any;
  public parkingLot: boolean = false;
  public vehicleFormInfo = [];
  public vinValid = true;
  public vinDisable = false;
  public modelDisable:boolean = true;
  public modelLoading:boolean = false;
  public techMultipleSelection: boolean = true;
  public yrData = [];
  dbSelectedYr = [];
  public currDate: any = '';
  public currYear: any = moment().format('Y');
  public initYear = 1960;
  public currentTime: string = new Date().toLocaleString();
  public ctime: string = moment(this.currentTime).format('hh:mm A');
  public currentTimeFormat: string = moment().format('A');
  public timeFormat: string = this.currentTimeFormat;
  public manageTitle = `${ManageTitle.actionNew} ${DispatchText.serviceReq}`;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public vinData: any = [];
  public editDate: any = '';
  public modalState = 'new';
  public serviceId: number = null;
  public notesDate: any;
  public selectedStatus: any;
  public empty: any = [];
  public openMenuItem: any = [];
  public showMap: any = false;
  public emptyBanner = DefaultNewImages.DispatchTech;

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
  public contactDisable: boolean = true;

  public center: google.maps.LatLngLiteral;
  public options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
  };
  mapData: any;
  mapValueData: any;
  innerHeight: number;
  bodyHeight: number;
  mapHeight: any;

  // This flag for debug purpose on local - It should be always true when taking production build
  pushFlag: boolean = true;

  public Editor = ClassicEditor;
  configCke: any = {
    placeholder: 'Enter additional notes',
    toolbar: {
      items: [
        "bold",
         "Emoji",
         "italic",
         "link",
        "strikethrough",
         "|",
         "fontSize",
         "fontFamily",
         "fontColor",
         "fontBackgroundColor",
         "|",
         "bulletedList",
         "numberedList",
         "todoList",
         "|",
         "uploadImage",
         "pageBreak",
         "blockQuote",
         "insertTable",
         "mediaEmbed",
         "undo",
         "redo",
        
       ],
    },
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }
  @HostListener('window:editServiceData', ['$event'])
  editService(event: any): void {
    console.log(event)
    this.editServiceData(event.detail.mapData, event.detail.type, event.detail.headerDate);
  }
  @HostListener('window:displayNotesData', ['$event'])
  displayNotes(event: any): void {
    this.displayNotesData(event.detail.headerDate, event.detail.mapData);
  }
  @HostListener('window:getTechnician', ['$event'])
  getTech(event: any): void {
    this.getTechnician(event.detail.mapData, event.detail.id);
  }
  @HostListener('window:displayServiceData', ['$event'])
  displayService(event: any): void {
    this.openDetails(event.detail.mapData);
  }

  @HostListener("document:visibilitychange", ["$event"])
  visibilitychange() {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log(event)
    });
    this.checkHiddenDocument();
  }
  
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private threadApi: ThreadService,
    private LandingpagewidgetsAPI: LandingpageService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig
  ) {
    config.backdrop = true;
    config.keyboard = true;
    config.size = 'dialog-top';
  }

  // convenience getters for easy access to form fields
  get sf() { return this.serviceForm.controls; }
  get shf() { return this.serviceShopForm.controls; }
  get sgf() { return this.serviceCatgForm.controls; }
  get scf() { return this.serviceContactForm.controls; }

  ngOnInit(): void {
    this.dispatchComponentRef.emit(this);
    this.currDate = this.commonApi.createDateAsUTC(new Date());
    let isMobileTech = parseInt(localStorage.getItem('isMobileTech'));
    this.isMobileTech = (isMobileTech == 1) ? true : false;
    this.isAdminView = (this.roleId == 3 && this.isMobileTech) ? true : false;
    this.createForm('service');
    this.createForm('serviceCatg');
    this.createForm('serviceShop');
    this.createForm('serviceContact');
    this.defaultData();
    console.log(this.emptyTechList)
    this.loadScript();
  }

  public dispatchBoardData(data, action='') {
    console.log(data);
    this.techMultipleSelection =  (data['techSelection'] == 1) ? true : false;
    this.rightPanelCollapse = true;
    this.loadingDispatch = true;
    this.viewOptions = data['options'];
    this.view = (this.roleId == 3 && data['initAction']) ? 3 : data['view'];
    //this.view = data['view'];
    this.selectedDay = data['range'];
    this.isAdminView = !data['isMobileTech'];
    if(action == 'init') {
      this.statusList = data['statusList'];
      console.log(this.statusList)
    }
    switch (this.view) {
      case 1:
        this.getTechnicianList();
        this.getDispatchList(this.currDate, -1, 0, false, data['isMobileTech']);
        break;
      case 4:
        this.getDispatchList(this.currDate);
        break;
      default:
        this.loadingUnassigned = true;
        this.unassignedList = [];
        this.getTechnicianList();
        break;
    }
  }

  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  setScreenHeight() {
    const headerHeight = 125;
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - headerHeight);
    this.mapHeight = this.innerHeight - 60 + 'px';
    const divHeight = this.innerHeight - 20 + 'px';
    (document.querySelectorAll('.map-card')[0] as HTMLElement).style.height = divHeight;
    (document.querySelectorAll('.map-card')[0] as HTMLElement).style.overflow = 'hidden';
  }

  createForm(action, item:any = '', date:any = '') {
    switch (action) {
      case 'service':        
        this.vinIsValid = false;
        this.vinValid = true;
        this.emptyContact();
        let techInfo:any = '';
        let statusId: any = 1;
        let prevTechId = [];
        let duration = this.durationList[0].id;
        switch (this.view) {
          case 1:
            let mdate:any = moment(date);
            date = new Date(mdate);
            break;
          case 2:
          case 3:
            let cid:any = (this.mapId == '') ? date : this.mapId;
            if(cid == 'Not Assigned' || cid == 'Parking Lot') {
              this.parkingLot = (cid == 'Not Assigned') ? false : true;
              techInfo = '';
            } else {
              techInfo = (this.mapId == '') ? String(date) : [this.mapId];
              if(this.techMultipleSelection) {
                techInfo = (!Array.isArray(techInfo)) ? [techInfo] : techInfo;
              }
            }
            techInfo = this.commonApi.isDate(date) ? '' : techInfo;
            date = this.currDate;
            break;
          case 4:
            statusId = (this.commonApi.isDate(date)) ? statusId : parseInt(date);
            console.log(statusId)
            date = this.currDate;           
            break;
        }
        console.log(techInfo)
        let timeZone = this.timeZoneList[0].id;        
        const empty = [];
        const vinPattern = `^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$`;
        this.serviceForm = this.formBuilder.group({
          shopId: ['', [Validators.required]],
          serviceContact: [empty],
          mapValue: [''],
          serviceDate: [date, [Validators.required]],
          serviceTime: [this.ctime, [Validators.required]],
          serviceDuration: [duration],
          timeZone: [timeZone],
          any_time: [false],
          parkingLot: [this.parkingLot],
          repairOrder: [''],
          technicianId: [techInfo],
          prevTechId: [prevTechId],
          vin: ['', [Validators.pattern(vinPattern)]],
          make: [''],
          model: [''],
          year: [''],
          serviceNotes: [''],
          statusId: [statusId],
          serviceCatg: [empty],
          techOrder: [0]
        });
        break;
      case 'serviceCatg':
        let catgId = (item == '') ? 0 : item.id;
        let catgName = (item == '') ?  '' : item.serviceName;
        this.serviceCatgForm = this.formBuilder.group({
          catgId: [catgId],
          catgName: [catgName, [Validators .required]]
        });
        console.log(this.serviceCatgForm)
        break;
      case 'serviceShop':
        let shopId = (item == '') ? 0 : item.id;
        let shopName = (item == '') ? '' :item.name;
        let addressLine1 = (item == '') ? '' : item.addressLine1;
        let addressLine2 = (item == '') ? '' : item.addressLine2;
        let city = (item == '') ? '' : item.city;
        let state = (item == '') ? '' : item.state;
        let zip = (item == '') ? '' : item.zip;
        let customerId = (item == '') ? '' : item.customerId;
        let scountryName = (item == '') ? '' : item.countryName;
        let scountryCode = (item == '') ? '' : item.countryCode;
        let sdialCode = (item == '') ? '' : item.dialCode;
        let phone = (item == '') ? '' : item.phone;
        let cemail = (item == '') ? '' : item.email;
        this.icountryName = (item = '' || scountryName) ? this.icountryName : scountryName;
        this.icountryCode = (item = '' || scountryCode == null) ? this.icountryCode : scountryCode;
        this.idialCode = (item = '' || sdialCode == '') ? this.idialCode : sdialCode;
        this.iphoneNumber = (item = '' || phone == null) ? this.iphoneNumber : phone;
        this.phoneNumberData = {  
          countryCode: this.icountryCode, 
          phoneNumber: this.iphoneNumber,
          country: this.icountryName, 
          dialCode: this.idialCode,
          access: 'phone'
        }
        this.serviceShopForm = this.formBuilder.group({
          shopId: [shopId],
          shopName: [shopName, [Validators .required]],
          addressLine1: [addressLine1],
          addressLine2: [addressLine2],
          city: [city],
          state: [state],
          zip: [zip],
          customerId: [customerId],
          countryName: [scountryName],
          countryCode: [scountryCode],
          dialCode: [sdialCode],
          phone: [phone],
          email: [cemail, [Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        });
        break;
      case 'serviceContact':
        console.log(item)
        let contactId = (item == '') ? 0 : item.id;
        let firstName = (item == '') ? '' : item.firstName;
        let lastName = (item == '') ? '' : item.lastName;
        let email = (item == '') ? '' : item.email;
        let countryName = (item == '') ? '' : item.countryName;
        let countryCode = (item == '') ? '' : item.countryCode;
        let dialCode = (item == '') ? '' : item.dialCode;
        let phoneNumber = (item == '') ? '' : item.phoneNumber;
        this.icountryCode = (item = '') ? this.icountryCode : countryCode;
        this.iphoneNumber = (item = '') ? this.iphoneNumber : phoneNumber;
        this.icountryName = (item = '') ? this.icountryName : countryName;
        this.idialCode = (item = '') ? this.idialCode : dialCode;
        this.phoneNumberData = {  
          countryCode: this.icountryCode, 
          phoneNumber: this.iphoneNumber,
          country: this.icountryName, 
          dialCode: this.idialCode,
          access: 'phone'
        }
        this.serviceContactForm = this.formBuilder.group({
          contactId: [contactId],
          firstName: [firstName, [Validators.required]],
          lastName: [lastName],
          email: [email, [Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          countryName: [countryName],
          countryCode: [countryCode],
          dialCode: [dialCode],
          phoneNumber: [phoneNumber]
        });
        break;  
    }
  }

  getDispatchList(date, view:any = -1, index = 0, navFlag = false, mobileTech = false) {
    console.log(index)
    this.hideMap();
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: localStorage.getItem('domainId'),
      userId: this.userId,
      view: this.view,
      /* offset: this.itemOffset,
      limit: this.itemLimit, */
      orderBy: 'asc',
      platform: this.platform
    };
    this.loadingDispatch = (this.disableLoading) ? false : true;
    switch (this.view) {
      case 1:
        this.navTech = false;
        apiInfo['startDate'] = moment(date).format('YYYY-MM-DD');
        if((this.roleId != 3 && this.isMobileTech) || mobileTech) {
          let techId = [this.userId];
          apiInfo['techList'] = JSON.stringify(techId);
        }
        break;

      default:
        if(view < 0) {
          this.navTech = navFlag;
          apiInfo['techList'] = JSON.stringify(this.techList[index]);
          setTimeout(() => {
            this.navTech = false;
          }, 100);
        }
        if(view >= 0) {
          this.loadingUnassigned = (this.disableLoading) ? false : true;
          apiInfo['view'] = view;          
        }
        break;
    }
    this.serviceAPIcall = this.LandingpagewidgetsAPI.serviceListAPI(apiInfo).subscribe((response) => {
      this.dataMappingByDates(response?.data, view, apiInfo['techList']);
    });
  }

  dataMappingByDates(cardData: any, view, techList) {
    console.log(cardData)
    const dview = (view == 0) ? view : this.view;
    this.serviceList = ((view < 0 || view == 1) && this.view > 0) ? [] : this.serviceList;
    this.unassignedList = (view == 0 || this.view > 1) ? this.unassignedList : [];
    if(this.disableLoading) {
      this.unassignedList = [];
    }
    Object.keys(cardData).forEach((element) => {
      let mapFlag = false;
      console.log(element)
      cardData[element].items.forEach(item => {
        let shopInfo = item.shopData;
        console.log(item)
        item.assignedTech.forEach(atech=> {
          if(element == atech.techId) {
            item.techId = parseInt(element);
          }
        });
        if(shopInfo.mapFlag) {
          mapFlag = true;
        }
      });
      const tempObj = {};
      tempObj['id'] = element;
      switch (dview) {
        case 0:
          tempObj['status'] = element;
          tempObj['display_date'] = element;
          tempObj['mapFlag'] = mapFlag;
          break;
        case 1:
          tempObj['display_date'] = moment(element).toISOString();
          tempObj['card_date'] = moment(element).format('ddd, MMM DD')
          tempObj['id'] = element;
          tempObj['date'] = element;
          tempObj['mapFlag'] = mapFlag;
          break;
        case 2:
        case 3:
          let ti = this.Technician.findIndex(option => option.userId == element);
          console.log(element, ti, this.Technician[ti])
          if(ti >= 0) {
            tempObj['display_date'] = this.Technician[ti].userName;
            tempObj['date'] = element;
            tempObj['profile'] = this.Technician[ti].profileImg;
            tempObj['mapFlag'] = mapFlag;
          }
          break;
        case 4:
          let sti = this.statusList.findIndex(option => option.itemId == element);
          console.log(element, sti, this.statusList[sti])
          if(sti >= 0) {
            tempObj['display_date'] = this.statusList[sti].name;
            tempObj['date'] = element;
            tempObj['profile'] = '';
            tempObj['mapFlag'] = mapFlag;
          }
          break;  
      }

      tempObj['total'] = cardData[element].total;
      tempObj['body'] = cardData[element].items;
      //console.log(tempObj)
      console.log(dview)
      if(dview > 0) {
        this.loadingDispatch = false;
        this.serviceList.push(tempObj);
        this.serviceDateConnect.push(tempObj['display_date']);
        //console.log(this.serviceList)
        //console.log(this.serviceDateConnect)
      } else {
        console.log(tempObj)
        this.loadingUnassigned = false;
        this.unassignedList.push(tempObj);
        this.serviceDateConnect.push(tempObj['display_date']);
        console.log(this.unassignedList)
      }
    });
    setTimeout(() => {
      this.disableLoading = false;
    }, 100);
    switch (this.view) {
      case 1:
        this.selectedDay = this.serviceList.length;
        this.selectedDayChange.emit(this.selectedDay);
        break;
      case 2:
      case 3:
        if(dview > 0 && techList) {
          console.log(techList)
          techList = techList.replace('[', '');
          techList = techList.replace(']', '');
          techList = techList.split(',');
          let serviceObj = [];
          techList.forEach((titem, tindex) => {
            let tech = this.preferredOrder(this.serviceList, titem, tindex, serviceObj);
            serviceObj = tech;
            console.log(tech)
          });
          this.serviceList = serviceObj;
        }
        if(view < 0) {
          let cardLen = Object.keys(cardData).length;
          let range:any = this.selectedDay - cardLen;
          //this.setupEmptyTechCard(range);
        } else {
          let trange = (this.view == 3) ? 1 : this.selectedDay;
          //this.setupEmptyTechCard(trange);
        }
        break;
    }
  }

  displayDate(date) {
    return moment(date).format('ddd, MMMM DD');
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    let serviceId = event.previousContainer.data[event.previousIndex]['serviceId'];
    let currItem:any = event.container.id;
    let prevItem:any = event.previousContainer.id;
    let svcId = event.previousContainer.data[event.previousIndex]['serviceId'];
    let duplicateCheck = false;
    let svcIndex = event.container.data.findIndex(option => option['serviceId'] == svcId);
    if(event.previousContainer !== event.container && svcIndex >= 0 && event.container.data[svcIndex]['serviceId'] == svcId) {
      duplicateCheck = true;
    }
    if(duplicateCheck || (this.view == 1 && ((this.roleId != 3 && this.isMobileTech) || (this.roleId == 3 && !this.isAdminView))) || 
      (this.view > 1 && event.container.id == 'NA') || (event.previousContainer === event.container && event.currentIndex == event.previousIndex) ||
      (this.view == 4 && (prevItem == 4 || currItem == 0 || (prevItem == 0 && currItem > 1) || (prevItem == 1 && currItem == 0)))) {       
      return false;
    }

    if (event.previousContainer === event.container) {
      const cid = event.container.id;
      if(cid != 'Not Assigned' && cid != 'Parking Lot') {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        let serviceList:any = event.container.data;
        serviceList.forEach((item, index) => {
          item.changeAction = (index == event.currentIndex) ? true : false;
        });
        switch (this.view) {
          case 4:
            let prevIndex = event.previousIndex+1;
            let currIndex =  event.currentIndex+1;
            let statusId = parseInt(cid);
            let isAssigned = (statusId == 0) ? 0 : 1;
            statusId = (statusId == 0) ? 1 : statusId;            
            let statusData:any = [{
              statusId,
              isAssigned,
              prevIndex,
              currIndex
            }]
            this.changeOrder(serviceList, this.view, statusData);   
            break;
        
          default:
            this.changeOrder(serviceList);
            break;
        }        
      }
    } else {
      let currIndex:any = '';
      event.container.data.forEach(item => {
        if(this.view == 1) {
          item['serviceDate'] = moment(currItem).format('MMM DD, YYYY');
          console.log(item['serviceId'], serviceId);
        }
      });
      if(this.view != 4 || (this.view == 4 && prevItem > 0 && currItem >= 1)) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
      const order = (this.view == 1) ? 'serviceOrder' : this.view == 4 ? 'statusOrder' : 'techOrder';
      let pid:any = event.previousContainer.id;
      if(pid != 'Not Assigned' && pid != 'Parking Lot') {
        event.previousContainer.data.forEach((item, index) => {
          item[order] = index+1;
        });
      }
      setTimeout(() => {
        if(this.view == 4) {
          let scurrData:any = event.container.data[event.currentIndex];
          let sprevData:any = event.previousContainer.data;
          if(prevItem == 0 && currItem == 1) {
            let svcItem;
            sprevData.forEach((item, index) => {
              if(event.currentIndex == index) {
                svcItem = item;
              }
            });
            setTimeout(() => {
              this.getTechnician(svcItem);  
            }, 500);
          } else {
            this.changeAction('change', 'status', currItem, scurrData);
          }
        } else {
          let techInfo:any = [];
          let ti = this.Technician.findIndex(option => option.userId == currItem);
          if(ti >= 0) {
            techInfo = {
              techId: this.Technician[ti].userId,
              techName: this.Technician[ti].userName,
              img: this.Technician[ti].profileImg
            };
          }
          event.container.data.forEach((item, index) => {
            item[order] = index+1;
            if(this.view > 1 && (serviceId == item['serviceId'])) {
              currIndex = index;
              item['techInfo'] = techInfo;
              if(event.container.id == 'Parking Lot') {
                item['parkingLot'] = true;
              }
            }
          });
          let currData:any = event.container.data;
          let prevData:any = event.previousContainer.data;
          let empty = '', date = '', csi, pti, psi;
          switch (this.view) {
            case 1:
              const serviceDate = moment(currItem).format('YYYY-MM-DD');
              const prevDate = moment(pid).format('YYYY-MM-DD');
              csi = this.serviceList.findIndex(option => option.date == serviceDate);
              psi = this.serviceList.findIndex(option => option.date == prevDate);
              this.serviceList[csi].total = parseInt(this.serviceList[csi].total)+1;
              this.serviceList[psi].total = parseInt(this.serviceList[psi].total)-1;
              this.changeAction('drag', 'serviceDate', serviceDate, serviceId, currItem, empty, currData, prevData);
              break;
            case 2:
            case 3:
              const techAction = (currItem == 'Not Assigned' || currItem == 'Parking Lot') ? 'remove-technician' : 'technician';
              prevData = (prevItem == 'Not Assigned' || prevItem == 'Parking Lot') ? [] : prevData;
              if(techAction == 'technician') {
                console.log(this.serviceList, currItem, prevItem)
                date = prevItem;
                csi = this.serviceList.findIndex(option => option.date == currItem);
                pti = this.serviceList.findIndex(option => option.date == prevItem);
                psi = this.unassignedList.findIndex(option => option.status == prevItem);
                console.log(csi, pti, psi)
                if(csi >= 0)
                  this.serviceList[csi].total = parseInt(this.serviceList[csi].total)+1;
                if(pti >= 0)
                  this.serviceList[pti].total = parseInt(this.serviceList[pti].total)-1;
                if(psi >= 0)
                  this.unassignedList[psi].total = parseInt(this.unassignedList[psi].total)-1;
              } else {
                csi = this.unassignedList.findIndex(option => option.status == currItem);
                psi = this.serviceList.findIndex(option => option.date == prevItem);
                if(csi >= 0)
                  this.unassignedList[csi].total = parseInt(this.unassignedList[csi].total)+1;
                if(psi >= 0)
                  this.serviceList[psi].total = parseInt(this.serviceList[psi].total)-1;
              }
              this.changeAction('drag', techAction, currItem, currData[currIndex], date, empty, currData, prevData);
              break;
          }
        }
      }, 100);
    }
  }

  ngAfterViewChecked () {
    this.cdRef.detectChanges();
  }

  openDetails(item) {
    this.serviceData = item;
    //this.serviceDetails(item.serviceId);
    this.displayDetails = true;
  }

  displayModel(date) {
    this.editDate = '';
    this.displayModal = true;
    this.roExist = false;
    this.serviceSubmit = false;
    this.serviceFormValid = false;
    this.contactDisable = true;
    this.showClear = false;
    this.vinDisable = false;
    this.modelLoading = false;
    this.modelDisable = true;
    this.prevTechId = 0;
    this.manageTitle = `${ManageTitle.actionNew} ${DispatchText.serviceReq}`;
    this.emptyContact();
    this.serviceForm.reset();
    this.currentTime = new Date().toLocaleString();
    this.ctime = moment(this.currentTime).format("hh:mm A");
    setTimeout(() => {
      this.createForm('service', '', date);
    }, 50);
  }

  displayNotesData(date, item) {
    this.notesDate = item;
    date = (this.view == 1) ? date : item.serviceDate;
    date = moment(date).format('ddd, MMMM DD'); 
    this.notesDate['date'] = date;
    this.displayNote = true;
  }

  defaultData() {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.itemOffset = 0;
    this.getShopList();
    this.getStatusList();
    this.getServiceCategory();
    this.getProductMakeList();
    this.loadCountryStateData();
    /* this.getMakeModelsList(); */
    this.getYearsList();
  }

  getShopList() {
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
    };
    this.LandingpagewidgetsAPI.shopListAPI(apiInfo).subscribe((response) => {
      this.Shops = response?.data;
      this.Shops.splice(0, 0, { id: 0, label: `${ManageTitle.actionNew} ${DispatchText.shop}` });
    });
  }

  getStatusList() {
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
    };
    this.LandingpagewidgetsAPI.statusListAPI(apiInfo).subscribe((response) => {
      this.Status = response?.data;
      this.Status.forEach(item => {
        item.label = item.name;
        item.title = '';
        item.icon = `custom-icon-${item.class}`;
      });
      // this.selectedStatus = this.Status[0];
    });
  }

  getContactList(shopId) {
    this.contacts = [];
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      shopId: shopId
    };
    this.LandingpagewidgetsAPI.serviceContactListAPI(apiInfo).subscribe((response) => {
      let contacts = response?.data;
      contacts.forEach(item => {
        let id = item.id;
        let itemVal = this.renderContact(item);
        this.contacts.push({
          id: id,
          name: itemVal,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          countryName: item.countryName,
          countryCode: item.countryCode,
          dialCode: item.dialCode,
          phoneNumber: item.phoneNumber
        });
        if(this.serviceId == 0) {
          setTimeout(() => {
            this.selectedContact = [];
            this.selectedContactId = [];
          }, 150);
        }
      });
    });
  }

  getTechnicianList() {
    const searchText = '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('isDispatch', '1');
    //apiFormData.append('limit', '20');
    //apiFormData.append('offset', '0');
    apiFormData.append('searchText', searchText);
    this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe(
      (response) => {
        console.log(response)
        this.Technician = response?.dataInfo;
        this.emptyTech = (this.Technician.length == 0) ? true : false;
        const view:any = 0;
        if(this.emptyTech && this.view > 1) {
          this.serviceList = [];
          this.getDispatchList(this.currDate, view);
          setTimeout(() => {
            this.loadingDispatch = false;
          }, 1000);
        }
        if(this.Technician.length > 0) {
          console.log(this.Technician, this.view)
          setTimeout(() => {
            let techList = [];
            this.Technician.forEach(item => {
              console.log(item)
              techList.push(parseInt(item.userId));
            });
            if(this.view == 3) {
              this.techList = [];
              this.techList.push(techList);
            } else {
              this.techList = this.commonApi.sliceIntoChunks(techList, this.selectedDay);
            }
            
            console.log(this.techList);
            if(this.view > 1) {
              setTimeout(() => {
                this.getDispatchList(this.currDate);
                setTimeout(() => {
                  this.getDispatchList(this.currDate, view);
                }, 100);
              }, 500);
            }
          }, 500);
        }
        setTimeout(() => {
          this.callback.emit(this);
        }, 600);
      }
    );
  }

  getServiceCategory() {
    const apiInfo = {
      apiKey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      limit: '20',
      offset: '0',
    };
    this.LandingpagewidgetsAPI.serviceCategory(apiInfo).subscribe(
      (response) => {
        this.serviceCategory = response?.data;
      }
    );
  }

  getProductMakeList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    this.LandingpagewidgetsAPI.getProductMakeListsAPI(apiFormData).subscribe(
      (response) => {
        if (response.status == 'Success') {
          const resultData = response.modelData;
          this.makeList = resultData;
        }
      }
    );
  }

  getMakeModelsList(makeName, access = '') {
    this.modelLoading = true;
    this.modelDisable = true;
    const apiInfo = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      displayOrder: 0,
      type: 1,
      makeName,
      offset: '',
      limit: '',
    };
    this.LandingpagewidgetsAPI.getMakeModelsList(apiInfo).subscribe(
      (response) => {
        this.modelDisable = (access == 'vin') ? true : false;
        this.modelLoading = false;
        this.Models = response?.modelData;
        setTimeout(() => {
          this.modelPlaceHoder = 'Select';  
        }, 50);        
      }
    );
  }

  serviceDetails(id, pushAction = '', push = false) {
    console.log(id, pushAction, push, this.view)
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      action: 'view',
      serviceId: id,
      platform: this.platform
    };
    this.LandingpagewidgetsAPI.manageServiceAPI(apiInfo).subscribe(
      (response) => {
        const serviceDetails = response?.data;
        console.log(serviceDetails)
        this.serviceData = serviceDetails;
        let serviceId = serviceDetails.serviceId;
        let serviceStatus = serviceDetails.serviceStatus;
        let statusId = serviceDetails.statusData.id;
        let techInfo = [];
        this.serviceData.assignedTech.forEach(techItem => {
          techInfo.push(techItem.techId);
        });
        this.displayDetails = !push;
        let total, optList, optionField, serviceIndex;
        switch (this.view) {
          case 1:
            optList = this.serviceList;
            optionField = moment(this.serviceData.serviceDate).format('YYYY-MM-DD');
            optionField = (serviceStatus == 1 && statusId > 3) ? [] : optionField;
            break;
          case 2:
          case 3:
            optList = this.serviceList;
            optionField = techInfo;
            if(techInfo.length == 0 && serviceStatus == 0 && statusId < 4) {
              optList = this.unassignedList;
              optionField = (this.serviceData.parkingLot) ? 'Parking Lot' : 'Not Assigned';
            }
            optionField = (serviceStatus == 1 && statusId > 3) ? [] : optionField;
            break;
          case 4:
            optList = this.serviceList;
            optionField = (techInfo.length == 0 && serviceStatus == 0) ? 0 : statusId;
            break;  
        }
        if((this.view == 4) || (this.view < 4 && serviceStatus == 0 && statusId < 4)) {
          optionField = (Array.isArray(optionField)) ? optionField : [optionField];
        }
        if(push) {
          this.removeCards(this.serviceList, this.serviceData);
          if(this.view != 4) {
            if(optionField.length > 0) {
              this.removeCards(this.serviceList, this.serviceData, true);
            }
            this.removeCards(this.unassignedList, this.serviceData);  
          }
          console.log('in Push', optionField, optList);
          optionField.forEach(item => {
            console.log(item)
            let itemIndex;
            if(item == 'Parking Lot' || item == 'Not Assigned') {
              serviceIndex = optList.findIndex(option => option.status == item);
              if(serviceIndex >= 0) {
                total = parseInt(optList[serviceIndex].total);
                itemIndex = optList[serviceIndex].body.findIndex(option => option.serviceId == serviceId);
                console.log(itemIndex, serviceId)
                let chkIndex = 0;
                if(itemIndex < 0) {
                  chkIndex = serviceIndex;
                  optList[serviceIndex].body.push(this.serviceData);
                  optList[serviceIndex].total = total+1;
                }                
                optList.forEach((optItem, index) => {
                  total = parseInt(optList[serviceIndex].total);
                  optItem.body.forEach((card, cindex) => {
                    console.log(card, id)
                    if(serviceIndex != index && card.serviceId == id) {
                      console.log('in', cindex)
                      optItem.body.splice(cindex, 1);
                      optItem.total = optItem.total - 1;
                      let orderAccess = (this.view == 1) ? 'service' : 'tech';
                      this.changeListOrder(orderAccess, optItem.body, false);
                    }
                  });
                });
              }
            } else {
              serviceIndex = optList.findIndex(option => option.date == item);
              console.log(serviceIndex)
              if(serviceIndex >= 0) {
                optList.forEach((optItem, index) => {
                  total = parseInt(optItem.total);
                  let sid = (this.view == 1) ? optItem.id : parseInt(optItem.id);
                  let chkId = 0;
                  let itemIndex;
                  if(this.view != 4) {
                    itemIndex = optItem.body.findIndex(option => option.serviceId == serviceId);
                  }                  
                  if(this.view == 4) {
                    itemIndex = optItem.body.findIndex(option => option.serviceId == serviceId && parseInt(item) == statusId);
                  }
                  let techExist = techInfo.includes(sid);
                  if(this.view == 1) {
                    console.log(this.userId, techInfo)
                    techExist = techInfo.includes(parseInt(this.userId));
                    console.log(techExist)
                  }
                  console.log(optItem, itemIndex, serviceStatus, statusId, sid, item, techExist);
                  if(((serviceStatus == 0 && statusId < 4) || (this.view == 4 && serviceStatus == 1 && statusId == 4)) && itemIndex < 0 && sid == item && ((this.view == 1 && techExist) || (this.view > 1 && techExist) || this.view == 4)) {
                    console.log('in push data')
                    chkId = sid;
                    optItem.body.push(this.serviceData);
                    optItem.total = total + 1;
                    if(this.view < 4) {
                      let orderAccess = (this.view == 1) ? 'service' : 'tech';
                      this.changeListOrder(orderAccess, optItem.body, false);
                    }
                  }
                  console.log(chkId, sid)
                  if(chkId != sid) {
                    optItem.body.forEach((card, cindex) => {
                      //console.log(card, serviceId)
                      let orderFlag = false;                    
                      //console.log(itemIndex, serviceStatus, statusId, techInfo);
                      if(serviceStatus == 0 && statusId < 4) {
                        console.log('in active service', optItem.id, item, techInfo.includes(item))
                        if(itemIndex >= 0 && card.serviceId == serviceId && optItem.id == item && (this.view == 1 || (this.view > 1 && techInfo.includes(item)) || this.view == 4)) {
                          console.log('update card')
                          optItem.body[itemIndex] = this.serviceData;
                          orderFlag = true;
                        }
                        if(this.view != 4 && itemIndex >= 0 && card.serviceId == serviceId && ((this.view == 1 && optItem.id != item) || (this.view > 1 && optItem.id == item && !techInfo.includes(item) || this.view == 4))) {
                          console.log('remove card')
                          optItem.body.splice(cindex, 1);
                          optItem.total = total - 1;
                          orderFlag = true;
                        }
                      }
                      console.log(orderFlag)
                      if(orderFlag) {
                        if(this.view < 4) {
                          let orderAccess = (this.view == 1) ? 'service' : 'tech';
                          this.changeListOrder(orderAccess, optItem.body, false);
                        } else {
                          let orderAccess = 'status';
                          this.changeListOrder(orderAccess, optItem.body, false);
                        }
                      }                    
                    });
                  }
                });
              }
            }
          });
          
          
        }
      }
    );   
  }

  getRecentVin() {
    const vinData = this.serviceForm.get('vin');
    const apiData = {
      apiKey: Constant.ApiKey,
      countryId: this.countryId,
      userId: this.userId,
      domainId: this.domainId,
      access: 'thread'
    };
    const inputData = {
      baseApiUrl: Constant.CollabticApiUrl,
      apiUrl: Constant.CollabticApiUrl + '/' + Constant.getRecentVins,
      field: 'vinNo',
      selectionType: 'single',
      filteredItems: [vinData.value],
      filteredLists: [vinData.value],
      actionApiName: '',
      actionQueryValues: '',
      title: 'Recent VINs'
    };
    const modalRef = this.modalService.open(ManageListComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.access = 'newthread';
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService);
      const response = receivedService[0];
      this.vinDisable = true;
      this.modelDisable = true;
      this.serviceForm.patchValue({vin: response.vinNo});
      this.vinData = {
        make: response.make,
        model: response.model,
        year: response.year,
      };
      this.vinIsValid = true;
      this.vinValid = true;
      this.vinVerfied = true;
      this.setVINValues('vin');
      modalRef.dismiss('Cross click');
    });
  }

  vinChanged(action, val= '') {
    const apiCall = false;
    const vinData = this.serviceForm.get('vin');
    console.log(vinData.value)
    this.vinIsValid = (action == 'api' || val.length == 17) ? true: vinData.valid;
    switch (action) {
      case 'change':
        this.vinIsValid = true;
        this.vinValid = (val.length == 17 && vinData.value == '') ? true : false;
        val = val.toUpperCase();
        this.vinVerfied = false;
        break;
      default:
        const svcFormData = new FormData();
        svcFormData.set('apiKey', Constant.ApiKey);
        svcFormData.set('countryId', this.countryId);
        svcFormData.set('domainId', this.domainId);
        svcFormData.set('userId', this.userId);
        svcFormData.set('vin', vinData.value);
        this.LandingpagewidgetsAPI.vehicleInfoByVIN(svcFormData).subscribe(
          (response) => {
            this.vinValid = (response.status == 'Success') ? true : false;
            if (this.vinValid) {
              this.vinDisable = true;
              this.vinVerfied = true;
              this.modelDisable = true;
              this.vinData = {
                make: response?.vinDetails[0]?.make,
                model: response?.vinDetails[0]?.model,
                year: response?.vinDetails[0]?.year,
              };
              this.setVINValues('vin');
            }
          }
        );
        break;
    }
  }

  setVINValues(access) {
    this.getMakeModelsList(this.vinData.make, access);
    this.serviceForm.patchValue({
      make: this.vinData?.make,
      model: this.vinData?.model,
      year: this.vinData?.year,
    });
  }

  shopChanged(action, event) {
    console.log(action,event)
    let value = (action == 'change') ? event.value : (event != null) ? event : -1;
    if(action == 'trigger') {
      this.actionFlag = false;
    }
    this.emptyContact();
    console.log(value)
    let address = '';
    let shopId: any = 0;
    let clearShop = (value == null) ? true: false;
    value = (value == null) ? -1 : value;
    this.showClear = false;
    switch(value) {
      case -1:
        clearShop = true;
        this.selectedShop = {};
        break;
      case 0:
        clearShop = true;
        this.serviceAction('new', 'shop');
        break;
      default:
        this.contactDisable = false;
        this.showClear = true;
        const selectedShop = this.Shops.filter(
          (element) => element.id == value
        );
        console.log(selectedShop);
        this.selectedShop = selectedShop[0];
        this.setupShopAddress(selectedShop[0]);        
        break;
    }
    if(clearShop) {
      this.contactDisable = clearShop;
      this.serviceForm.patchValue({
        shopId,
        mapValue: address,
        serviceContact: this.empty
      });
    }
  }

  // Contact Change
  contactChanged(item) {
    console.log(item)
    let itemVal = item.value;
    console.log(itemVal)
    this.selectedContact = [];
    this.selectedContactId = itemVal;
    itemVal.forEach(id => {
      let cindex = this.contacts.findIndex(option => option.id == id);
      this.selectedContact.push(this.contacts[cindex].name);
    });
  }

  timeChange(val) {
    const time = moment(val).format('hh:mm A');
    this.serviceForm.patchValue({serviceTime: time});
  }

  saveService() {
    if(this.serviceFormValid) {
      return;
    }

    this.serviceSubmit = true;
    for (const i in this.serviceForm.controls) {
      this.serviceForm.controls[i].markAsDirty();
      this.serviceForm.controls[i].updateValueAndValidity();
    }
    console.log(this.vinValid, this.vinVerfied);
    const formObj = this.serviceForm.value;
    const vinValid = (formObj.vin.length == 0 || (this.vinVerfied && this.vinValid)) ? true : false;
    console.log(vinValid, formObj.vin.length, this.vinVerfied, this.vinValid, formObj);

    if (this.serviceForm.valid && vinValid && !this.roExist) {
      formObj.serviceTime = (formObj.serviceTime.length < 10) ? formObj.serviceTime : moment(formObj.serviceTime).format('hh:mm A')
      this.serviceFormValid = true;
      //const serviceTime = (formObj.any_time) ? '' : formObj.serviceTime;
      const serviceTime = formObj.serviceTime;
      const serviceDuration = formObj.serviceDuration;
      const isFlexible = formObj.any_time;
      const timeZone = formObj.timeZone;
      const parkingLot = (formObj.parkingLot) ? 1 : 0;
      formObj.technicianId = (!this.techMultipleSelection) ? [formObj.technicianId] : formObj.technicianId;
      let techId = (formObj.technicianId == '' || formObj.technicianId == 0) ? [] : formObj.technicianId;
      techId.forEach((id, ti) => {
        techId[ti] = parseInt(id);
      });
      let removedTechId:any = [];
      let prevTechId = (formObj.prevTechId == '' || formObj.prevTechId == 0) ? [] : formObj.prevTechId;
      prevTechId.forEach((id, pti) => {
        prevTechId[pti] = parseInt(id);
      });
      console.log(techId, prevTechId)
      if(this.modalState == 'edit' && this.techMultipleSelection && prevTechId.length > 0) {
        if(formObj.statusId < 4) {
          removedTechId = prevTechId.filter(x => !techId.includes(x));
          prevTechId = prevTechId.filter(x => techId.includes(x));
        } else {
          techId = prevTechId;
        }
      }

      removedTechId = JSON.stringify(removedTechId);
      prevTechId = JSON.stringify(prevTechId);
      let statusId = formObj.statusId;
      const serviceContacts = Array.from(new Set(formObj.serviceContact));
      const apiInfo = {
        apikey: Constant.ApiKey,
        countryId: this.countryId,
        domainId: this.domainId,
        userId: this.userId,
        action: this.modalState /* edit in case of update */,
        shopId: formObj.shopId,
        serviceContacts: JSON.stringify(serviceContacts),
        serviceDate: moment(formObj.serviceDate).format('YYYY-MM-DD'),
        serviceTime,
        serviceDuration,
        isFlexible,
        timeZone,
        parkingLot,
        repairOrder: formObj.repairOrder,
        technicianId: JSON.stringify(techId),
        removedTechId,
        prevTechId, 
        statusId,
        vin: formObj.vin,
        make: formObj.make,
        model: formObj.model,
        year: formObj.year == '' ? '' : String(formObj.year),
        serviceCatg: JSON.stringify(formObj.serviceCatg),
        serviceNotes: formObj.serviceNotes,
        serviceId: this.modalState == 'new' ? '' : this.serviceId,
        platform: this.platform
      };
      console.log(apiInfo)
      let ptecTech = JSON.parse(prevTechId);
      let techOrder = this.serviceForm.get('techOrder').value;
      //let tech = this.serviceForm.get('technicianId').value;
      let plot = this.serviceForm.get('parkingLot').value;
      let removeFlag = (techId.length > 0 || (techId.length == 0 && ((this.parkingLot && !plot) || (!this.parkingLot && plot)))) ? true : false;
      removedTechId = JSON.parse(removedTechId);
      let removeAllFlag = false;
      if(this.techMultipleSelection) {
        removeAllFlag = (apiInfo.statusId > 3 && techId.length > 0) ? true : false;
        if(apiInfo.statusId > 3) {
          removedTechId = techId;
        }        
      }
      let naFlag = false;
      console.log(removeFlag)
      techId.forEach(techItem => {
        let rmFlag = false;
        if(removeAllFlag || removeFlag) {
          if(!this.techMultipleSelection) {
            console.log(this.prevTechId)
            rmFlag = (JSON.parse(prevTechId) != techItem && removeFlag) ? true : false;            
          } else {
            if(removeAllFlag) {
              rmFlag = true;
            } 
            if(removeFlag) {
              let rmIndex = removedTechId.findIndex(option => option == techItem);
              console.log(rmIndex)
              rmFlag = (rmIndex >= 0) ? true : false;
            }            
          }
          if(rmFlag) {
            console.log('in')
            naFlag = true;
            if(!this.techMultipleSelection) {
              techItem = (this.prevTechId != techItem) ? this.prevTechId : techItem;
            }
            // Remove from Tech List
            let tIndex = this.serviceList.findIndex(option => option.date == techItem);
            console.log(tIndex)
            if(tIndex >= 0) {
              this.removeFromList('tech', this.serviceList, tIndex, this.serviceId);
            } else {
              this.removeNonAssignedList();
            }        
          }
        }
      });
      if(!this.techMultipleSelection && this.view == 1 && ptecTech.length > 0) {
        ptecTech.forEach(ptechItem => {
          naFlag = (techId.length == 0) ? true : naFlag;
          // Remove from Tech List
          let tIndex = this.serviceList.findIndex(option => option.date == ptechItem);
          console.log(tIndex)
          if(tIndex >= 0) {
            this.removeFromList('tech', this.serviceList, tIndex, this.serviceId);
          } else {
            this.removeNonAssignedList();
          }
        });
      }
      if(removedTechId.length > 0) {
        removedTechId.forEach(techItem => {
          naFlag = true;
          // Remove from Tech List
          let tIndex = this.serviceList.findIndex(option => option.date == techItem);
          console.log(tIndex)
          if(tIndex >= 0) {
            this.removeFromList('tech', this.serviceList, tIndex, this.serviceId);
          } else {
            this.removeNonAssignedList();
          }
        });
      }
      if(this.modalState == 'edit') {
        if(this.serviceId > 0 && this.view > 1 && removeFlag) {
          if(techId.length == 0) {
            naFlag = true;
            this.removeNonAssignedList();
          }
          if(techId.length > 0 && formObj.statusId > 3) {
            techId.forEach(techItem => {
              // Remove from Tech List
              let tIndex = this.serviceList.findIndex(option => option.date == techItem);
              console.log(tIndex)
              if(tIndex >= 0) {
                this.removeFromList('tech', this.serviceList, tIndex, this.serviceId);
              }
            });
          }     
        }
        if(techId.length > 0) {
          setTimeout(() => {
            // Check & Remove Assinged Tech from NA or Parking Lot
            let coptionField = (formObj.parkingLot) ? 'Parking Lot' : 'Not Assigned';
            let cremoveIndex = this.unassignedList.findIndex(option => option.status == coptionField);
            if(cremoveIndex >= 0) {
              const citemIndex = this.unassignedList[cremoveIndex].body.findIndex(option => option.serviceId == formObj.serviceId);
              this.unassignedList[cremoveIndex].body.splice(citemIndex, 1);
              this.unassignedList[cremoveIndex].total = parseInt(this.unassignedList[cremoveIndex].total)-1;
            }  
          }, 700);
        }
      }

      this.LandingpagewidgetsAPI.manageServiceAPI(apiInfo).subscribe((response) => {
          console.log(response)
          this.displayModal = false;
          this.serviceSubmit = false;
          this.roExist = false;
          this.selectedContact = [];
          this.selectedContactId = [];
          let responseData = response.data;
          const successMsg = response.message;
          let cdata:any = [];
          let assignedTech = response.data.assignedTech;
          if(assignedTech.length == 0) {
            cdata.push(responseData)
          } else {
            assignedTech.forEach(aitem => {
              let tecOrder = aitem.techOrder;
              responseData.techOrder = tecOrder;
              cdata.push(responseData);
            });
            console.log(cdata)  
          }
          const modifiedData = response.modifiedItems;
          let total, optList, optionField, serviceIndex, svcIndex = [];
          let techList = [];
          switch (this.view) {
            case 1:
              optList = this.serviceList;
              console.log(optList)
              optionField = moment(cdata[0].serviceDate).format('YYYY-MM-DD');
              serviceIndex = this.serviceList.findIndex(option => option.date == optionField);
              svcIndex.push(serviceIndex);
              if(this.modalState != 'new') {
                optionField = moment(this.editDate).format('YYYY-MM-DD');                
              }
              if(cdata[0].techOrder > 0 && (Array.isArray(assignedTech) || !Array.isArray(assignedTech))) {
                if(Array.isArray(assignedTech)) {
                  assignedTech.forEach(titem => {
                    techList.push(titem.techId);
                  });
                }
              }
              let modifiedTech = modifiedData.technicianId;
              let modifiedPrevTech = modifiedData.prevTechnicianId;
              let modifiedChange = modifiedData.changeFlag;
              if(this.modalState == 'edit') {
                if(!this.techMultipleSelection && this.isMobileTech && modifiedTech.length > 0 && modifiedPrevTech.length > 0  && serviceIndex >= 0) {
                  this.removeFromList('service', this.serviceList, serviceIndex, this.serviceId);
                }
                if(modifiedChange && this.view == 1) {
                  let svcOptField = moment(cdata[0].serviceDate).format('YYYY-MM-DD');
                  let currOptionField = moment(this.editDate).format('YYYY-MM-DD'); 
                  console.log(svcOptField, currOptionField)
                  if(svcOptField != currOptionField) {
                    let csvcServiceIndex = this.serviceList.findIndex(option => option.date == currOptionField);
                    this.removeFromList('service', this.serviceList, csvcServiceIndex, this.serviceId);
                    let svcServiceIndex = this.serviceList.findIndex(option => option.date == svcOptField);
                    if (serviceIndex >= 0) {
                      const itemIndex = optList[svcServiceIndex].body.findIndex(option => option.serviceId == cdata[0].serviceId);
                      total = parseInt(optList[svcServiceIndex].total);
                      let cstatus = cdata[0].serviceStatus;
                      console.log(svcServiceIndex, itemIndex, cstatus, total, optList[svcServiceIndex].body.length)
                      if (itemIndex < 0 && cstatus < 1 && total == optList[svcServiceIndex].body.length) {
                        optList[svcServiceIndex].body.push(cdata[0]);
                        optList[svcServiceIndex].total = total+1;
                      }
                    }
                  }
                }
              }
              break;
            case 2:
            case 3:
              if(this.modalState == 'edit' && this.techMultipleSelection) {
                let coptionField = (responseData.parkingLot) ? 'Parking Lot' : 'Not Assigned';
                let cserviceIndex = this.unassignedList.findIndex(option => option.status == coptionField);
                setTimeout(() => {
                if(techId.length == 0) {
                    if(cserviceIndex >= 0) {
                      const citemIndex = this.unassignedList[cserviceIndex].body.findIndex(option => option.serviceId == responseData.serviceId);
                      if(citemIndex < 0) {
                        this.unassignedList[cserviceIndex].body.push(responseData);
                        this.unassignedList[cserviceIndex].total = parseInt(this.unassignedList[cserviceIndex].total)+1;
                      }
                    }
                  }
                }, 700);
              }
              if(cdata.techOrder < 0 && !cdata.parkingLot) {
                optionField = this.prevTechId;
                optList = this.serviceList;
              } else if(cdata[0].techOrder > 0 && (Array.isArray(assignedTech) || !Array.isArray(assignedTech))) {
                if(Array.isArray(assignedTech)) {
                  assignedTech.forEach(titem => {
                    techList.push(titem.techId);
                  });
                } else {
                  techList.push(cdata[0].assignedTech.techId);
                }
                //console.log(techList);
                optList = this.serviceList;
                techList.forEach((tech, index) => {
                  //console.log(tech)
                  optionField = tech;
                  naFlag = (this.prevTechId == 0) ? true : false;
                  serviceIndex = (!naFlag) ? this.serviceList.findIndex(option => option.date == optionField) : -1;
                  svcIndex.push(serviceIndex);
                  //console.log(serviceIndex)
                  if(naFlag || (!this.techMultipleSelection && this.prevTechId != optionField)) {
                    serviceIndex = this.serviceList.findIndex(option => option.date == optionField);
                    if (serviceIndex >= 0) {
                      total = parseInt(optList[serviceIndex].total);
                      if (total == optList[serviceIndex].body.length) {
                        const itemIndex = optList[serviceIndex].body.findIndex(option => option.serviceId == cdata[0].serviceId);
                        if(itemIndex < 0) {
                          cdata[index].techOrder = total+1;
                          optList[serviceIndex].body.push(cdata[index]);
                          optList[serviceIndex].total = total+1;
                        }
                      }
                      serviceIndex = (this.modalState == 'new') ? -1 : serviceIndex;
                    }
                  }
                });                
              } else {
                optList = this.unassignedList;
                optionField = (cdata[0].parkingLot) ? 'Parking Lot' : 'Not Assigned';
                serviceIndex = (!naFlag) ? this.unassignedList.findIndex(option => option.status == optionField) : -1;
                if(naFlag) {
                  serviceIndex = this.unassignedList.findIndex(option => option.status == optionField);
                  if (serviceIndex >= 0) {
                    const itemIndex = optList[serviceIndex].body.findIndex(option => option.serviceId == cdata[0].serviceId);
                    total = parseInt(optList[serviceIndex].total);
                    let cstatus = cdata[0].serviceStatus;
                    if (itemIndex < 0 && cstatus < 4 && total == optList[serviceIndex].body.length) {
                      optList[serviceIndex].body.push(cdata[0]);
                      optList[serviceIndex].total = total+1;
                    }
                  }
                }
                svcIndex.push(serviceIndex);
              }
              break;
            case 4:
              let soptList = this.serviceList;
              let optStatusFlag = (this.modalState == 'edit') ? modifiedData.statusFlag : true;
              console.log(soptList, statusId, optStatusFlag, responseData)
              if(statusId <= 5) {
                soptList.forEach((option, optIndex) => {
                  let optId = parseInt(option.id);
                  let optTotal = parseInt(option.total);
                  if (this.modalState == 'new') {
                    if(optId == statusId) {
                      soptList[optIndex].body.push(responseData);
                      soptList[optIndex].total = optTotal+1;             
                    } 
                  } else {
                    let svcItem = soptList[optIndex].body;
                    let optItemIndex = svcItem.findIndex(option => option.serviceId == this.serviceId);
                    if(optId == statusId) {
                      if(optItemIndex < 0) {
                        soptList[optIndex].body.push(responseData);
                        soptList[optIndex].total = optTotal+1;
                      } else {
                        soptList[optIndex].body[optItemIndex] = responseData;
                      }
                    } else {
                      if(optItemIndex >= 0) {
                        soptList[optIndex].body.splice(optItemIndex, 1);
                        soptList[optIndex].total = optTotal-1;  
                      }
                    }
                  }                  
                });
              }
              break;  
          }

          if(this.view != 4) {
            optionField = ((this.view == 2 || this.view == 3) && cdata[0].techOrder > 0 && (Array.isArray(assignedTech) || !Array.isArray(assignedTech))) ? techList : [optionField];
            console.log(optionField)

            optionField.forEach((option, optIndex) => {
              serviceIndex = svcIndex[optIndex];
              console.log(option, svcIndex, serviceIndex)
              if (serviceIndex >= 0) {
                total = parseInt(optList[serviceIndex].total);
                if (this.showMap) {
                  let id = (this.view == 1) ? '' : option;
                  this.callMap(option, id);
                }
                if (this.modalState == 'new') {
                  if (total == optList[serviceIndex].body.length) {
                    optList[serviceIndex].body.push(cdata[optIndex]);
                    optList[serviceIndex].total = total+1;
                  }
                } else {
                  console.log(optList[serviceIndex].body, this.serviceId)
                  const itemIndex = optList[serviceIndex].body.findIndex(option => option.serviceId == this.serviceId);
                  console.log(serviceIndex, this.editDate, itemIndex);
                  if (itemIndex >= 0 && cdata[optIndex].serviceStatus > 0) {
                    console.log(1)
                    let changeIndex;
                    if(this.view > 1 && (Array.isArray(cdata[optIndex].assignedTech))) {
                      changeIndex = optList.findIndex(option => option.status == option);
                    } else {
                      changeIndex = optList.findIndex(option => option.date == option);
                    }
                    if ((changeIndex < 0 && !this.techMultipleSelection && cdata[optIndex].serviceStatus > 0)) {
                      changeIndex = itemIndex;
                    }
                    if (changeIndex >= 0 && !this.techMultipleSelection) {
                      changeIndex = (changeIndex < 0 && !this.techMultipleSelection && cdata[optIndex].serviceStatus > 0) ? itemIndex : changeIndex;
                      const citemIndex = optList[changeIndex].body.findIndex(option => option.serviceId == cdata[optIndex].serviceId);
                      optList[changeIndex].body.splice(citemIndex, 1);
                      optList[serviceIndex].total = total-1;
                      if(option != 'Not Assigned' && option != 'Parking Lot') {
                        let orderAccess = (this.view == 1) ? 'service' : 'tech';
                        this.changeListOrder(orderAccess, optList[changeIndex].body);
                      }
                    }
                  } else {
                    console.log(2)
                    if (itemIndex >= 0) {
                      console.log(2.1, cdata[optIndex])
                      optList[serviceIndex].body[itemIndex] = cdata[optIndex]; 
                      this.changeListOrder('tech', optList[serviceIndex].body, false);
                    } else {
                      console.log(3, optList)
                      let changeIndex;
                      if(this.view == 1 || (this.view > 1 && !Array.isArray(cdata[optIndex].techInfo))) {
                        console.log(option)
                        changeIndex = optList.findIndex(option => option.date == option);
                      } else {
                        changeIndex = optList.findIndex(option => option.status == option);
                      }
                      if ((changeIndex < 0 && !this.techMultipleSelection && cdata[optIndex].serviceStatus > 0)) {
                        changeIndex = itemIndex;
                      }
                      console.log(changeIndex)
                      if (changeIndex >= 0 && (!this.techMultipleSelection || option == 'Not Assigned' || option == 'Parking Lot')) {
                        const citemIndex = optList[changeIndex].body.findIndex(option => option.serviceId == cdata[optIndex].serviceId);
                        optList[changeIndex].body.splice(citemIndex, 1);
                        changeIndex = (this.view == 1) ? serviceIndex : changeIndex;
                        if (total == optList[changeIndex].body.length) {
                          if(changeIndex < 0) {
                            optList[changeIndex].body.push(cdata[optIndex]);
                            optList[changeIndex].total = total+1;
                          }
                        }
                      }
                      if(changeIndex < 0 && this.techMultipleSelection && this.view > 1 && option != 'Not Assigned' && option != 'Parking Lot') {
                        let tindex = cdata[optIndex].assignedTech.findIndex(options => options.techId == option);
                        if(tindex >= 0) {
                          if (total == optList[serviceIndex].body.length) {
                            optList[serviceIndex].body.push(cdata[optIndex]);
                            optList[serviceIndex].total = total+1;
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                if(!naFlag && !this.techMultipleSelection) {
                  optList.forEach((item, index) => {
                    const checkIndex = item.body.findIndex(option => option.serviceId == cdata[optIndex].serviceId);
                    if (checkIndex >= 0) {
                      optList[index].body.splice(checkIndex, 1);
                      let chkTotal:any = parseInt(optList[index].total);
                      optList[index].total = chkTotal-1;
                      if(option != 'Not Assigned' && option != 'Parking Lot') {
                        let orderAccess = (this.view == 1) ? 'service' : 'tech';
                        this.changeListOrder(orderAccess, optList[index].body);
                      }
                    }
                  });
                }
              }
            });
          }

          //techId = responseData.assignedTech;
          console.log(techId)
          if(techId.length > 0) {
            let pushFlag = (this.modalState == 'new') ? true : false;
            let statusFlag = false;
            let techFlag = false;
            let techRemoveFlag = false;
            if(this.modalState == 'edit') {
              pushFlag = modifiedData.changeFlag;
              statusFlag = modifiedData.statusFlag;
              techFlag = modifiedData.techFlag;
              techRemoveFlag = modifiedData.removeTechFlag;
            }
            if(pushFlag) {
              this.pushApi(this.modalState, responseData, techId, removedTechId, modifiedData);
            }
            if(statusFlag) {
              let spushTimeout = (statusId == 4) ? 2000 : 0;
              setTimeout(() => {
                this.pushApi('status', responseData, techId, removedTechId, modifiedData);  
              }, spushTimeout);
            }
            if(techFlag) {
              let empty = [];
              if(this.techMultipleSelection) {
                techId = modifiedData.technicianId;
              }
              this.pushApi('technician', responseData, techId, empty, modifiedData);
            }
            console.log(this.techMultipleSelection, techRemoveFlag)
            if(this.techMultipleSelection && techRemoveFlag) {
              this.pushApi('remove-technician', responseData, techId, removedTechId, modifiedData);
            }
          }
          this.editDate = '';
          this.modalState = 'new';
          this.serviceId = null;
          this.prevTechId = 0;
          this.selectedShop = '';
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = successMsg;
          setTimeout(() => {
            this.serviceFormValid = false;
            msgModalRef.dismiss('Cross click');
          }, 1500);
        }
      );
    }
  }

  pushApi(action, data, techId, removedId = [], actionItems:any = []) {
    if(!this.pushFlag) {
      return false;
    }
    console.log(action, data, techId)
    if(action == 'tech-order') {
      let otechId = [];
      otechId.push(techId);
      techId = otechId;
    }
    let fcmToken = localStorage.getItem('fcm_token');
    let empty = [];
    let pushData = {
      apikey: Constant.ApiKey,
      domainId: localStorage.getItem('domainId'),
      userId: this.userId,
      deviceToken: fcmToken,
      action: action,
      serviceId: data.serviceId,
      prevTechnicianId: JSON.stringify(empty),
      technicianId: JSON.stringify(techId),
      statusId: data.statusData.id,
      prevStatusId: 0,
      technicianName: JSON.stringify(empty),
      prevTechnicianName: JSON.stringify(empty)
    }
    let techName:any = [];
    if(action != 'tech-order') {
      techId = (!Array.isArray(techId) && techId == 0) ? [] : techId;
      techId.forEach(item => {
        let techIndex = this.Technician.findIndex(option => option.userId == item);
        if(techIndex >= 0) {
          techName.push(this.Technician[techIndex].userName);
        }
      });
      pushData.technicianName = JSON.stringify(techName);
    }
    
    switch(action) {
      case 'edit':
        pushData['customerName'] = actionItems.customerName;
      case 'status':
        pushData['customerName'] = actionItems.customerName;
        pushData['currentStatusName'] = actionItems.currentStatusName;
        pushData['prevStatusName'] = actionItems.prevStatusName;
        pushData.prevStatusId = actionItems.prevStatusId;
        pushData.statusId = actionItems.statusId;
        break;
      case 'technician':
        pushData['customerName'] = data.shopData.name;
        let prevTechName = [];
        let prevTechId = actionItems.prevTechnicianId;
        prevTechId = (!Array.isArray(prevTechId) && prevTechId == 0) ? [] : prevTechId;
        prevTechId.forEach(item => {
          let prevTechIndex = this.Technician.findIndex(option => option.userId == item);
          if(prevTechIndex >= 0) {
            prevTechName.push(this.Technician[prevTechIndex].userName);
          }
        });
        pushData.prevTechnicianId = JSON.stringify(prevTechId);
        pushData.prevTechnicianName = JSON.stringify(prevTechName);
        if(!this.techMultipleSelection) {
          pushData.action = (techId[0] == prevTechId[0]) ? 'new' : 'reassign-technician';
        } else {
          pushData.action = 'new';
          if(techId.length == 1 && prevTechId.length == 1) {
            pushData.action = (techId[0] == prevTechId[0]) ? pushData.action : 'reassign-technician';
          }
        }
        
        break;
      case 'remove-technician':
        techName = [];
        pushData['customerName'] = data.shopData.name;
        removedId.forEach(item => {
          let removeTechIndex = this.Technician.findIndex(option => option.userId == item);
          if(removeTechIndex >= 0) {
            techName.push(this.Technician[removeTechIndex].userName);
          }
        });  
        pushData.technicianId = JSON.stringify(removedId);
        pushData.technicianName = JSON.stringify(techName);
        pushData.action = action;   
        break;  
    }
    console.log(pushData)
    this.LandingpagewidgetsAPI.cbtV3SendPush(pushData).subscribe((response) => {
      console.log(response)
    });
  }

  getYearsList() {
    const year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.Years.push({
        id: y,
        name: y.toString(),
      });
    }
  }

  editServiceData(item, state, date) {
    console.log(item)
    this.serviceData = item;
    this.displayDetails = (this.displayDetails) ? !this.displayDetails : this.displayDetails;
    this.selectedContact = [];
    this.selectedContactId = [];
    this.editDate = date;
    let prevTechId = [];
    let mdate:any = moment(date);
    date = new Date(mdate);
    this.manageTitle = `${ManageTitle.actionEdit} ${DispatchText.serviceReq}`;
    this.serviceId = item.serviceId;
    this.modalState = state;
    this.vinIsValid = true;
    this.vinVerfied = true;
    this.vinValid = true;
    this.roExist = false;
    this.showClear = true;
    this.contactDisable = false;
    this.serviceSubmit = false;
    let vin = (item.vin != '') ? 'vin' : '';
    if(item.make != '') {
      this.getMakeModelsList(item.make, vin);
      this.modelPlaceHoder = (item.model != '') ? item.model : this.modelPlaceHoder;
    }
    const selectedShop = item.shopData;
    this.selectedShop = selectedShop;
    const address = this.renderAdderss(selectedShop);
    const serviceCatt: any = [];
    item.serviceCatg.forEach((element) => {
      serviceCatt.push(element.id);      
    });
    // Get Contact List
    this.getContactList(item.shopData.id);
    let serviceTime = item.serviceTime;
    if (serviceTime == '') {
      this.currentTime = new Date().toLocaleString();
      this.ctime = moment(this.currentTime).format('hh:mm A');
      serviceTime = this.ctime;
    }
    let duration = item.serviceDuration;
    let serviceDuration = duration.id;
    let timeZone = (item.timeZone == '' || item.timeZone == null) ? this.timeZoneList[0].id : item.timeZone;
    this.parkingLot = item.parkingLot;
    let techId = [];
    if(item.assignedTech.length == 0) { 
      techId = [];
    } else {
      if((!Array.isArray(item.assignedTech))) { 
        techId.push(String(item.assignedTech.techId));
        prevTechId.push(String(item.assignedTech.techId));
      } else {
        item.assignedTech.forEach(titem => {
          console.log(titem)
          techId.push(String(titem.techId));
          prevTechId.push(String(titem.techId));
        });
      }
    }
    console.log(techId)
    if(!this.techMultipleSelection) {
      techId = (Array.isArray(techId) && techId.length == 0) ? '' : techId[0];
    }
    this.prevTechId = item.techId;
    this.displayModal = true;
    this.serviceForm.patchValue({
      shopId: item.shopData.id,
      mapValue: address,
      serviceContact: this.empty,
      serviceDate: date,
      serviceTime,
      serviceDuration,
      timeZone,
      repairOrder: item.repairOrder,
      technicianId: techId,
      prevTechId: prevTechId,
      vin: item.vin,
      make: item.make,
      model: item.model,
      year: item.year,
      serviceNotes: item.notes,
      statusId: item.statusData.id,
      serviceCatg: serviceCatt,
      any_time: item.anyTime,
      parkingLot: item.parkingLot,
      techOrder: item.techOrder
    });
    console.log(this.Shops)
    console.log(this.serviceForm.value)
    setTimeout(() => {
      const serviceContact: any = [];
      item.serviceContacts.forEach((element) => {
        serviceContact.push(element.id);
        this.setupSelectedContacts(element);
        this.serviceForm.patchValue({
          serviceContact: serviceContact
        });
      });  
    }, 500);
    // for update serviceId
    if(item.vin.length == 17) {
      this.vinChanged('api');
    }
  }

  // Get Tech Users List
  getTechnician(item, id = '') {
    console.log(item)
    let users:any = [];
    let techId = [], prevTechId = [];
    if (item.assignedTech.length > 0) {
      item.assignedTech.forEach(item => {
        users.push({
          id: item.techId,
          name: item.techName,
          img: item.img
        });
        if(this.techMultipleSelection) {
          prevTechId.push(String(item.techId));
        }        
      });
    }
    const apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      isDispatch: 1
    };
    let selectionType = (this.techMultipleSelection) ? 'multiple' : 'single';
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.access = 'dispatchTech';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = windowHeight.height;
    modalRef.componentInstance.action = 'new';
    modalRef.componentInstance.selectionType = selectionType;
    modalRef.componentInstance.selectedUsers = users;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      console.log(receivedService)
      const techData = (receivedService.length > 0) ? receivedService[0] : receivedService;
      const techFlag = (receivedService.length > 0) ? true : false;
      console.log(techData, techFlag, item.techInfo.techId)
      let prevId = item.techInfo.techId;
      let removedTechId = [];
      if(this.techMultipleSelection) {
        receivedService.forEach(item => {
          techId.push(String(item.id));
        })
        removedTechId = prevTechId.filter(x => !techId.includes(x));
        techId = techId.filter(x => !prevTechId.includes(x));
        console.log('Prev Tech:', prevTechId)
        console.log('Current Tech', techId)
        console.log('Removed Tech', removedTechId)
        if(techId.length > 0) {
          this.changeAction('change-tech', 'technician', techId, item);
        }
        if(removedTechId.length > 0) {
          removedTechId.forEach(ritem => {
            let tindex = item.assignedTech.findIndex(option => option.techId == ritem);
            item.assignedTech.splice(tindex, 1);
          });
          this.changeAction('change-remove-tech', 'remove-technician', removedTechId, item);
        }
      } else {
        if (techFlag && (item.techInfo.techId != techData['id'])) {
          if(this.showMap) {
            id = (id == '') ? prevId : id;
          }
          item.sectionId = (this.view == 1) ? 0 : id;
          item.techInfo = {
            techId: techData['id'],
            techName: techData['name'],
            img: techData['img']
          };
          const serviceIndex = this.serviceList.findIndex(option => option.date == item.techInfo.techId);
          console.log(item.techInfo.techId, id)
          let removeIndex;
          if(item.sectionId == 'Not Assigned' || item.sectionId == 'Parking Lot') {
            item.parkingLot = (item.sectionId == 'Parking Lot') ? 0 : item.parkingLot;
            removeIndex = this.unassignedList.findIndex(option => option.status == item.sectionId);
            const citemIndex = this.unassignedList[removeIndex].body.findIndex(option => option.serviceId == item.serviceId);
            this.unassignedList[removeIndex].body.splice(citemIndex, 1);
            this.unassignedList[removeIndex].total = parseInt(this.unassignedList[removeIndex].total)-1;
          }
          console.log(serviceIndex, item.sectionId)
          if((this.view > 1 && this.view != 4) && item.sectionId != 'Not Assigned' && item.sectionId != 'Parking Lot') {
            console.log(item)
            removeIndex = this.serviceList.findIndex(option => option.date == item.sectionId);
            const citemIndex = this.serviceList[removeIndex].body.findIndex(option => option.serviceId == item.serviceId);
            this.serviceList[removeIndex].body.splice(citemIndex, 1);
            this.serviceList[removeIndex].total = parseInt(this.serviceList[removeIndex].total)-1;
            this.changeListOrder('tech', this.serviceList[removeIndex].body, false);
          }
          if(serviceIndex >= 0) {
            if (parseInt(this.serviceList[serviceIndex].total) == this.serviceList[serviceIndex].body.length) {
              if(item.sectionId != 0) {
                item.techOrder = parseInt(this.serviceList[serviceIndex].total)+1;
              }
              this.serviceList[serviceIndex].body.push(item);
              this.serviceList[serviceIndex].total = parseInt(this.serviceList[serviceIndex].total)+1;
  
            }
            console.log(serviceIndex, removeIndex);          
          }
          this.changeAction('change', 'technician', techData['id'], item);
        }
      }
      modalRef.dismiss('Cross click');
    });
  }

  // Change Status
  changeStatus(id, status, item) {
    console.log(id, status, item);
    if (status.id != item.statusData.id) {
      this.changeAction('change', 'status', status.id, item);
    }
  }

  // Change Action
  changeAction(trigger, field, fieldId, item, date = '', order = '', currData = '', prevData = '') {
    console.log(field, fieldId, item, date, order);
    let serviceId;
    let assignedTech = item.assignedTech;
    let removedTechId:any = [];
    let techId:any = [];
    let techOrder: any = [];
    const formData = new FormData();
    formData.append('apikey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('countryId', this.countryId);
    formData.append('action', 'change');
    if (field != 'serviceDate') {
      serviceId = item.serviceId;
      formData.append('serviceId', serviceId);
      let status = (field == 'status') ? fieldId : item.statusData.id;
      formData.append('statusId', status);
      if(field == 'remove-technician') {
        if(trigger == 'change-remove-tech') {
          removedTechId = fieldId;
          fieldId = JSON.stringify(fieldId);
          if(item.assignedTech.length == 0) {
            fieldId = (item.parkingLot) ? 'Parking Lot' : 'Not Assigned';
          }          
        } else {
          if(assignedTech.length > 0) {
            item.assignedTech.forEach(titem => {
              removedTechId.push(titem.techId);
            });
          }
        }
        let empty:any = [];
        let parkingLot:any = (item.parkingLot) ? 1 : 0;
        formData.append('parkingLot', parkingLot);
        formData.append('technicianId', JSON.stringify(empty));
        formData.append('prevTechId', JSON.stringify(empty));
        formData.append('removedTechId', JSON.stringify(removedTechId));
      }
      if(field == 'status' && fieldId >= 4) {
        if(Array.isArray(item.assignedTech)) {
          item.assignedTech.forEach(titem => {
            techId.push(titem.techId);
            if(fieldId < 4) {
              techOrder.push(titem.techOrder);
            }            
          });
        }
      }
      if(field == 'technician') {
        let prevTechId:any = (date == '') ? 0 : date;
        formData.append('prevTechId', prevTechId);
        if(trigger == 'change-tech') {
          fieldId = JSON.stringify(fieldId);
        }  
      }
    } else {
      serviceId = item;
      formData.append('serviceId', serviceId);
      if (order != '') {
        formData.append('corder', order);
      }
    }
    formData.append('fieldId', fieldId);
    formData.append('field', field);
    formData.append('platform', this.platform);
    formData.forEach((value,key) => {
      console.log(key+" "+value)
      return false;
    });
    
    if(this.view > 1 && this.view != 4) {
      if(item.assignedTech.length == 0 && item.techOrder == 0) {
        let optionField = (item.parkingLot) ? 'Parking Lot' : 'Not Assigned';
        console.log(optionField)
        let optList = this.unassignedList;
        let optIndex = optList.findIndex(option => option.status == optionField);
        if(optIndex >= 0) {
          let svIndex = optList[optIndex].body.findIndex(option => option.serviceId == item.serviceId);
          optList[optIndex].body.splice(svIndex, 1);
        }
      }
      
      removedTechId.forEach(techItem => {
        let tIndex = this.serviceList.findIndex(option => option.date == techItem);
        if(tIndex >= 0) {
          this.removeFromList('tech', this.serviceList, tIndex, serviceId);
        }
      });
    }

    this.LandingpagewidgetsAPI.manageServiceAPI(formData).subscribe(
      (response) => {
        const successMsg = response.message;
        let data:any = response.data;
        const modifiedData = response.modifiedItems;
        
        let optionField = (this.view == 1) ? moment(data.serviceDate).format('YYYY-MM-DD') : fieldId;
        let serviceIndex = this.serviceList.findIndex(option => option.date == optionField);
        switch (field) {
          case 'serviceDate':
            if (serviceIndex >= 0) {
              this.serviceList[serviceIndex].body.forEach(item => {
                item.serviceDate = moment(date).format('MMM DD, YYYY');
              });
            }
            break;
          default:
            let optList;
            let naFlag = false;
            if(field == 'status' || field == 'technician') {
              console.log(optionField)
              if(this.view == 1) {
                optionField = optionField;
              } else if((Array.isArray(data.assignedTech) && data.assignedTech.length > 0) || techId.length > 0) {
                if(techId.length == 0) {
                  data.assignedTech.forEach(titem => {
                    techId.push(titem.techId);
                    if(data.serviceStatus < 4) {
                      if(fieldId < 4) {
                        techOrder.push(titem.techOrder);
                      }
                    }
                  });                  
                }                
                optionField = techId;
              } else {
                optionField = (data.parkingLot) ? ['Parking Lot'] : ['Not Assigned'];
              }
              console.log(optionField, Array.isArray(data.assignedTech))
              if((Array.isArray(data.assignedTech) && data.assignedTech.length > 0)  || modifiedData.pushClearFlag) {
                let atechId = [];
                let removedId = [];
                data.assignedTech.forEach(tech => {
                  atechId.push(tech.techId);
                });
                if(this.techMultipleSelection && field != 'status') {
                  techId = modifiedData.technicianId;
                }
                let tid = (modifiedData.pushClearFlag || this.techMultipleSelection) ? techId : atechId;
                this.pushApi(field, item, tid, removedId, modifiedData);
              }
            }
            
            if(field == 'remove-technician' && modifiedData.removeTechFlag) {
              let atechId = [];
              this.pushApi(field, item, atechId, modifiedData.removedTechnicianId, modifiedData);
            }
            if(this.view == 4) {
              this.serviceDetails(data.serviceId, 'silent-status', true);
            } else {
              optionField = (!Array.isArray(optionField)) ? [optionField] : optionField;
              console.log(optionField)
              optionField.forEach((item, optIndex) => {
                console.log(item)
                if(item == 'Not Assigned' || item == 'Parking Lot') {
                  naFlag = true;
                  optList = this.unassignedList;
                  serviceIndex = optList.findIndex(option => option.status == item);
                } else {
                  optList = this.serviceList;
                  serviceIndex = optList.findIndex(option => option.date == item);
                  if(this.showMap) {
                    optList[serviceIndex].mapFlag = true;
                  }
                }
                if (data.serviceStatus > 0) {
                  let changeIndex;
                  if(this.view > 1 && naFlag) {
                    changeIndex = optList.findIndex(option => option.status == item);
                    if(this.techMultipleSelection && changeIndex >= 0 && data.assignedTech == 0) {
                      let chkItemIndex = optList[changeIndex].body.findIndex(option => option.serviceId == data.serviceId);
                      if(chkItemIndex < 0) {
                        optList[chkItemIndex].body.push(data);
                      }
                    }
                  } else {
                    changeIndex = optList.findIndex(option => option.date == item);
                  }
                  if (changeIndex >= 0) {
                    const citemIndex = optList[changeIndex].body.findIndex(option => option.serviceId == data.serviceId);
                    optList[changeIndex].body.splice(citemIndex, 1);
                    optList[serviceIndex].total = parseInt(optList[serviceIndex].total)-1;
                    if(trigger == 'change' && !naFlag) {
                      optList[changeIndex].body.forEach((item, index) => {
                        item.techOrder = parseInt(index)+1;
                      });
                      let orderAccess = (this.view == 1) ? 'service' : 'tech';
                      this.changeListOrder(orderAccess, optList[changeIndex].body);
                    }
                  }                
                } else {
                  console.log(serviceIndex)
                  if(serviceIndex >= 0) {
                    let itemIndex = optList[serviceIndex].body.findIndex(option => option.serviceId == serviceId);
                    let techOrder:any;
                    if (itemIndex >= 0) {
                      if(techId.length > 0) {
                        if(data.serviceStatus < 4) {
                          console.log(optList[serviceIndex], itemIndex, optList[serviceIndex].body[itemIndex].techOrder)
                          let tindex = data.assignedTech.findIndex(options => options.techId == item);
                          if(tindex >= 0) {
                            //techOrder = data.assignedTech[tindex].techOrder;
                          }                        
                          console.log(itemIndex, data.techOrder)
                        }                                           
                      }
                      if(this.view > 1 && !naFlag && optionField.length > 0) {
                        techOrder = itemIndex+1;
                        data['techOrder'] = techOrder.toString();
                      }
                      optList[serviceIndex].body[itemIndex] = data;                    
                    }
                    console.log(123, serviceIndex, itemIndex)
                    if(this.techMultipleSelection && itemIndex < 0) {
                      optList[serviceIndex].body.push(data);                       
                    }
                  }                
                }
              });
            }
            break;
        }

        switch(trigger) {
          case 'drag':
            if(prevData.length > 0)
            this.changeOrder(prevData);
          
            if(field != 'remove-technician') {
              this.changeOrder(currData);              
            }
            break;
          case 'change':
            console.log(optionField)
            if(this.view > 1 && (optionField[0] != 'Not Assigned' && optionField[0] != 'Parking Lot') && optionField.length > 0) {
              optionField.forEach(item => {
                serviceIndex = this.serviceList.findIndex(option => option.date == item);
                if(serviceIndex >= 0)
                  this.changeListOrder('tech', this.serviceList[serviceIndex].body, false);
              });
            }
            break;
        }
        console.log(field+'::'+this.showMap)        
        this.showMap = (this.showMap && (field == 'technician' || field == 'remove-technician')) ? false : this.showMap;
        if (this.showMap) {
          if(this.view == 1) {
            this.callMap(moment(data.serviceDate).format('YYYY-MM-DD'));
          } else {
            let techIndex = this.Technician.findIndex(option => option.userId == item.sectionId);
            if(techIndex >= 0) {
              this.callMap(this.Technician[techIndex].userName, item.sectionId);
            }
          }
        } else {
          setTimeout(() => {
            this.directiveRef.update();  
          }, 100);  
        }
      }
    );
  }

  callMap(dispatchDate, id = '') {
    this.rightPanelCollapse = true;
    this.setScreenHeight();
    this.mapHeaderDate = dispatchDate;
    this.mapId = id;

    this.showMap = true;
    this.loadingDispatch = true;
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: localStorage.getItem('domainId'),
      userId: this.userId,
      /* offset: this.itemOffset,
      limit: this.itemLimit, */
      view: this.view,
      platform: this.platform
    };
    switch(this.view) {
      case 1:
        const todayDate = this.currDate;
        const   d = this.commonApi.createDateAsUTC(new Date(dispatchDate));
        // call setHours to take the time out of the comparison
        if (d.setHours(0, 0, 0, 0) == todayDate.setHours(0, 0, 0, 0)) {
          this.isToday = true;
        } else {
          this.isToday = false;
        }

        let     month = '' + (d.getMonth() + 1);
        let     day = '' + d.getDate();
        const   year = d.getFullYear();

        if (month.length < 2) {
          month = '0' + month;
        }
        if (day.length < 2) {
          day = '0' + day;
        }
        const finalDispatchDate = [year, month, day].join('-');
        apiInfo['startDate'] = finalDispatchDate;
        apiInfo['dayLimit'] = 1;
        if(this.isMobileTech) {
          let techId = [this.userId];
          apiInfo['techList'] = JSON.stringify(techId);
        }
        break;
      case 2:
      case 3:
        console.log(dispatchDate, id);
        if(id == 'Not Assigned' || id == 'Parking Lot') {
          apiInfo['view'] = 0;
          apiInfo['type'] = (id == 'Not Assigned') ? 1 : 2;
        } else {
          let techId = [id];
          apiInfo['orderBy'] = 'asc';
          apiInfo['techList'] = JSON.stringify(techId);
        }
        break;
    }
    const div = document.getElementById('map');
    const nodeList = document.getElementById('map').childNodes;
    if (nodeList.length) {
      div.removeChild(div.firstChild);
    }
    this.serviceAPIcall = this.LandingpagewidgetsAPI.serviceListAPI(
      apiInfo
    ).subscribe((response) => {
      this.mapData = response.data;
      if (response && response.code == 200 && response.data) {
        const itemsValue: any = Object.values(this.mapData);
        let mapItems = [];
        itemsValue[0].items.forEach(item => {
          if(item.shopData.mapFlag) {
            mapItems.push(item);
          }
        });
        this.mapValueData = mapItems;
        if (this.mapValueData && this.mapValueData.length) {
          this.renderMap();
        }
      }
      this.loadingDispatch = false;
    }, (error: any) => {
      this.loadingDispatch = false;
    });
  }

  callbackMap(item, head, id, type = 'single') {
    console.log(item, id)
    this.setScreenHeight();
    this.mapHeaderDate = head;
    this.mapId = head;
    this.rightPanelCollapse = true;
    this.loadingDispatch = true;
    this.mapValueData = [];
    if(type == 'single') {
      item.sectionId = id;
      //if(item.shopData.mapFlag) {
        this.mapValueData.push(item);
      //}
    } else {
      item.forEach(citem => {
        if(citem.shopData.mapFlag) {
          citem.sectionId = id;
          //if(item.shopData.mapFlag) {
            this.mapValueData.push(citem);
          //}          
        }
      });
    }
    
    setTimeout(() => {
      this.showMap = true;
      this.loadingDispatch = false;
      this.renderMap();
    }, 500);
  }

  loadMap = () => {
    console.log('in load map')
    const bounds = new google.maps.LatLngBounds();
    const map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      zoom: 8
    });

    let infowindow = null;
    console.log(this.mapValueData);
    this.mapValueData.forEach((mapData: any, index: number) => {
      const lat: any = parseFloat(mapData.shopData.lat);
      const lng: any = parseFloat(mapData.shopData.lng);
      const geocoder = new google.maps.Geocoder();
      const address = mapData.shopData.addressLine1 + mapData.shopData.addressLine2 + ',' + mapData.shopData.city + ',' + mapData.shopData.state + ',' + mapData.shopData.zip;
      const roWidth = (mapData.statusData?.statusClass == 'new') ? 60 : 50;
      const statusWidth = (mapData.statusData?.statusClass == 'new') ? 40 : 50;
      console.log(this.mapValueData);
      geocoder.geocode( {address}, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          const marker: any = new window['google'].maps.Marker({
            position: {lat, lng},
            map,
            title: mapData.shopData.name,
            draggable: false,
            animation: window['google'].maps.Animation.DROP,
            label: {color: '#fff', fontSize: '14px', fontWeight: 'normal',
              text: (index + 1).toString()}
          });
          if (!index) {
            bounds.extend(new google.maps.LatLng(marker.position));
            map.fitBounds(bounds);
            map.setZoom(12);
          }
          // notesFlag
          let noteIcon = '';
          if (mapData.notesFlag) {
            noteIcon = '<span id="callNoteFunction" style="cursor: pointer;"><img style="margin-right: 10px" width="22px"  height="22px" src="assets/images/dispatch/svg/service-card/h_notes_i.svg" onload="SVGInject(this)"></span>';
          }
          let contentString = '<div id="content" class="' + mapData?.statusData?.statusClass + '" style="padding: 12px; border-radius: 8px 0px 0px 0px; border-left: solid 3px '+mapData?.statusData?.statusColor+'; background-color:' + mapData?.statusData?.statusColor + '; color: #000; width: 300px; background-color: #FFF; background-image: url(assets/images/dispatch/svg/service_card_bg.svg)">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<div id="bodyContent">' +
          '<div class="display-flex" style="margin-bottom: 3px;">' +
          '<div class="right-panel" style="width: 65%">';
          if (mapData.shopData && mapData.shopData.name) {
            contentString += '<div class="flex-align-center"><img style="margin: 0 4px 0 0;" width="16px" height="16px" src="assets/images/dispatch/svg/service-card/v_i_service.svg" class="fill-999" onload="SVGInject(this)"><span style="font-weight: 500;font-size: 13px;">' + mapData?.shopData?.name + '</span></div>';
          }
          contentString += '</div>' +
          '<div class=left-panel style="width: 35%; margin-right: 10px">' +
          '<span style="justify-content: end;" class="flex-align-center"><span id="callEditFunction" style="cursor: pointer;"><img style="margin-right: 10px" width="22px" height="22px" src="assets/images/dispatch/svg/service-card/h_edit_i.svg" class="fill-999" onload="SVGInject(this)"></span>' + noteIcon + '<span id="callInfoFunction" style="cursor: pointer;"><img width="22px"  height="22px" src="assets/images/dispatch/map/vector-info-gray.png"></span></span>' +
          '</div>' +
          '</div>';
          if (mapData.serviceTime) {
            contentString += '<div style="width: 100%; margin-bottom: 3px; height: 21px;"><div class="flex-align-center"><img style="margin: 0 4px 0 0;" width="16px" height="16px" src="assets/images/dispatch/svg/service-card/v_i_clock.svg" class="fill-999" onload="SVGInject(this)"><span style="font-size: 13px; font-weight: 500;">' + mapData?.serviceTime + '</span></div></div>';
          }
          if (mapData.make) {
            contentString += '<div style="width: 100%; margin-bottom: 3px; height: 21px;"><div class="flex-align-center"><img style="margin: 0 4px 0 0;" width="17px" height="16px" src="assets/images/dispatch/svg/service-card/v_i_model.svg" onload="SVGInject(this)"><span style="font-size: 13px;font-weight: 500;">' + mapData?.make + '<i class="pi pi-angle-right icon-color-white" style="vertical-align: middle;"></i>' + mapData?.model + '<i class="pi pi-angle-right icon-color-white" style="vertical-align: middle;"></i>' + mapData?.year + '</span></div></div>';
          }
          if (mapData.serviceCatgName) {
            contentString += '<div style="width: 100%; margin-bottom: 3px; height: 21px;"><div class="flex-align-center"><img style="margin: 0 4px 0 0" width="18px" height="15px" src="assets/images/dispatch/svg/service-card/v_i_sct.svg" onload="SVGInject(this)"><span style="font-size: 13px; font-weight: 500;">' + mapData?.serviceCatgName + '</span></div></div>';
          }
          contentString += '<div class="display-flex">' +
          '<div class="right-panel" style="width: '+roWidth+'%">';
          if (mapData.repairOrder) {
            contentString += '<div class="flex-align-center"><img style="margin: 0 4px 0 0;" width="20px" height="19px" src="assets/images/dispatch/svg/service-card/v_i_ro_no.svg" onload="SVGInject(this)"><span style="font-size: 13px; font-weight: 500;"> RO# ' + mapData?.repairOrder + '</span></div>';
          }
          contentString += '</div>' +
          '<div class="left-panel" style="justify-content: end; width: '+statusWidth+'%; display: flex;">' +
          '<div class="service-status" style="cursor: pointer;width: auto;">' +
          '<div class="item-status" style="background-color:'+mapData.statusData?.statusColor+';border: 0;color:#FFF;display: flex; align-items: center;" id="callNewEditFunction">' +
          '<img src="assets/images/dispatch/svg/service-card/' + mapData.statusData?.statusClass + '.svg" onload="SVGInject(this)" />' +
          '<span>' + mapData.statusData?.name + '</span>' +
          '</div></div></div></div></div>' +
          '</div>' +
          '<div id="footerContent" class="display-flex" style="background-color: #fff; border-radius: 0px 0px 0px 8px; border-left: solid 3px '+mapData?.statusData?.statusColor+'; padding: 5px">' +
          '<div class="right-panel flex-align-center dropdown-div" style="width: 70%;">' +
          '<span id="selectTech" style="font-size: 12px; width: 100%;">' +
          '<button type="button" class="p-button-text new-button avatar-btn p-button p-component p-ripple">';
          if (mapData.techInfo && mapData.techInfo.img) {
            contentString += '<img style="margin-right: 10px" width="20px" height="20px" src="' + mapData?.techInfo?.img + '" />';
          } else {
            contentString += '<img style="margin-right: 10px" width="20px" height="20px" src="assets/images/thumb_profile_image.png" />';
          }
          if (mapData.techInfo && mapData.techInfo.techName) {
            contentString += '<span class="tech-field font-bold truncate text-left" ';
            contentString += 'style="color: #333333;margin-left: 0.25rem;" ';
            contentString += 'title="' + mapData?.techInfo?.techName + '">' + mapData?.techInfo?.techName + '</span>';
          } else {
            contentString += '<span class="tech-field font-bold truncate text-left" style="color: #333333;margin-left: 0.25rem; width: 110px;" title="Select Technician">Select Technician</span>';
          }
          contentString += '</button></span>' +
          '</div>' +
          '<div class="left-panel flex-align-center" style="width: 30%">' +
          '</div>' +
          '</div>';
          // let headerDate = this.mapHeaderDate;
          marker.addListener('click', () => {
            if (infowindow) {
              infowindow.close();
            }
            infowindow = new window['google'].maps.InfoWindow({
              content: contentString
            });
            infowindow.open(map, marker);
            setTimeout(() => {
              const cols: any = document.querySelectorAll('.gm-style-iw.gm-style-iw-c');
              for (let i = 0; i < cols.length; i++) {
                cols[i].style.backgroundColor = mapData?.statusData?.statusColor;
              }
              let sdate;
              if(this.view == 1 || this.mapId == 'Not Assigned' || this.mapId =='Parking Lot') {
                sdate = this.mapHeaderDate;
              } else {
                console.log(mapData)
                sdate = mapData.serviceDate;
              }              
              const editDetails: any = {
                mapData,
                type: 'edit',
                headerDate: sdate
              };
              const noteDetails: any = {
                mapData,
                headerDate: this.mapHeaderDate
              };
              const techDetails:any = {
                mapData,
                id: this.mapValueData.sectionId
              };
              (document.getElementById('callEditFunction') as HTMLInputElement).addEventListener('click', () => {
                const event = new CustomEvent('editServiceData',  {
                      detail: editDetails,
                  }
                );
                window.dispatchEvent(event);
              });
              (document.getElementById('callNewEditFunction') as HTMLInputElement).addEventListener('click', () => {
                const event = new CustomEvent('editServiceData',  {
                      detail: editDetails,
                  }
                );
                window.dispatchEvent(event);
              });
              if (mapData.notesFlag) {
                (document.getElementById('callNoteFunction') as HTMLInputElement).addEventListener('click', () => {
                  const event1 = new CustomEvent('displayNotesData',  {
                        detail: noteDetails,
                    }
                  );
                  window.dispatchEvent(event1);
                });
              }
              (document.getElementById('selectTech') as HTMLInputElement).addEventListener('click', () => {
                const event2 = new CustomEvent('getTechnician',  {
                      detail: techDetails,
                  }
                );
                window.dispatchEvent(event2);
              });
              (document.getElementById('callInfoFunction') as HTMLInputElement).addEventListener('click', () => {
                const event3 = new CustomEvent('displayServiceData',  {
                      detail: techDetails,
                  }
                );
                window.dispatchEvent(event3);
              });
            }, 500);
          });
        }
      });
    });
  }
  renderMap() {
    console.log('in render amp')
    window['initMap'] = () => {
      console.log(1)
      this.loadMap();
    };
    this.loadMap();
  }
  hideMap() {
    this.mapId = '';
    this.showMap = false;
  }

  // Create New Options
  serviceAction(action, field, item:any = '') {
    console.log(field);
    this.submitClicked = false;
    this.formProcessing = false;
    let formTimeout = (action == 'new') ? 0 : 500;
    switch (field) {
      case 'catg':
        let serviceCatg = DispatchText.serviceCatg; 
        this.actionTitle = (action == 'new') ? `${ManageTitle.actionNew} ${serviceCatg}` : `${ManageTitle.actionEdit} ${serviceCatg}`;
        if(action == 'edit') {          
          this.createForm('serviceCatg', item);
        } else {
          this.createForm('serviceCatg');
        }
        setTimeout(() => {
          this.catgExist = false;
          this.actionFlag = true;
          this.actionForm = field;  
        }, formTimeout);        
        break;
      case 'shop':
        this.showClear = false;
        let shopText = DispatchText.shop;
        this.actionTitle = (action == 'new') ? `${ManageTitle.actionNew} ${shopText}` : `${ManageTitle.actionEdit} ${shopText}`;
        this.emptyPhoneData();
        let sitem = (action == 'new') ? '' : item;
        this.createForm('serviceShop', sitem);
        setTimeout(() => {
          this.actionFlag = true;
          this.actionForm = field;  
        }, formTimeout);
        break;
      case 'contact':
        if(!this.contactDisable) {
          let contact = DispatchText.contact;
          this.actionTitle = (action == 'new') ? `${ManageTitle.actionNew} ${contact}` : `${ManageTitle.actionEdit} ${contact}`;
          this.actionTitle = `${this.actionTitle} - ${this.selectedShop.name}`;
          this.emptyPhoneData();
          let citem = (action == 'new') ? '' : item;
          this.createForm('serviceContact', citem);
          setTimeout(() => {
            this.actionFlag = true;
            this.actionForm = field;  
          }, formTimeout);
        }
        break;  
    }
  }

  // Form Action
  formAction(action) {
    console.log(action);
    switch (action) {
      case 'submit':
        this.submitClicked = true;
        this.formSubmit();
        break;

      default:
        this.formProcessing = false;
        this.formCancel();
        break;
    }
  }

  // Form Submit
  formSubmit() {
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      action: 'new',
    };
    console.log(this.actionForm)
    switch (this.actionForm) {
      case 'catg':
        this.catgExist = false;
        this.serviceCatgSubmit = true;
        for (const i in this.serviceCatgForm.controls) {
          this.serviceCatgForm.controls[i].markAsDirty();
          this.serviceCatgForm.controls[i].updateValueAndValidity();
        }
        const formObj = this.serviceCatgForm.value;
        console.log(this.catgExist, formObj)
        if (this.serviceCatgForm.valid && !this.catgExist) {
          this.formProcessing = true;
          let catgAction = (formObj.catgId == 0) ? apiInfo.action : 'edit';
          apiInfo.action = catgAction;
          apiInfo['catgName'] = formObj.catgName;
          apiInfo['catgId'] = formObj.catgId;
          this.LandingpagewidgetsAPI.manageServiceCatgAPI(apiInfo).subscribe((response) => {
            console.log(response);
            this.formProcessing = false;
            let error = response.error;
            if(!error) {
              this.actionTitle = '';
              this.serviceCatgSubmit = false;
              const serviceCatg = response.data;
              const catgId = serviceCatg.id;
              let formServiceCatg: any = this.serviceForm.get('serviceCatg');
              formServiceCatg = (formServiceCatg.value == null) ? [] : formServiceCatg.value;
              if(catgAction == 'new') {
                this.serviceCategory.unshift(serviceCatg);              
                formServiceCatg.push(catgId);
                this.serviceForm.patchValue({serviceCatg: formServiceCatg});
              } else {
                let catIndex = this.serviceCategory.findIndex(option => option.id == catgId);
                this.serviceCategory[catIndex].serviceName = serviceCatg.serviceName;
                let catgFormIndex = formServiceCatg.findIndex(option => option == catgId);
                formServiceCatg[catgFormIndex] = catgId;
                this.serviceForm.patchValue({serviceCatg: formServiceCatg});
                this.updateCardDetails('catg', this.serviceList, serviceCatg);
                if(this.view > 1) {
                  this.updateCardDetails('catg', this.unassignedList, serviceCatg);
                }
              }
              console.log(this.serviceForm);
              this.actionFlag = false;
              this.catgExist = false;
              this.existError = '';
              this.actionForm = '';
              this.serviceCatgForm.reset();
            } else {
              this.catgExist = true;
              this.existError = response.message;
            }
          });
        } else {
          this.formProcessing = false;
        }
        break;
      case 'shop':
        this.shopExist = false;
        this.serviceShopSubmit = true;
        for (const i in this.serviceShopForm.controls) {
          this.serviceShopForm.controls[i].markAsDirty();
          this.serviceShopForm.controls[i].updateValueAndValidity();
        }
        this.invalidNumber = (this.iphoneNumber.length > 0 && !this.phoneNumberValid) ? false : true;
        console.log(this.iphoneNumber, this.phoneNumberValid, this.invalidNumber)
        let shopObj = this.serviceShopForm.value;
        if (this.serviceShopForm.valid && (!this.shopExist || !this.invalidNumber)) {
          this.formProcessing = true;
          let phoneNumber = (shopObj.countryCode == 'IN' && shopObj.phone.length > 10) ? shopObj.phone.substring(1) : shopObj.phone;
          let shopAction = (shopObj.shopId == 0) ? apiInfo.action : 'edit';
          apiInfo.action = shopAction;
          apiInfo['shopId'] = shopObj.shopId;
          apiInfo['name'] = shopObj.shopName;
          apiInfo['customerId'] = shopObj.customerId;
          apiInfo['addressLine1'] = shopObj.addressLine1;
          apiInfo['addressLine2'] = shopObj.addressLine2;
          apiInfo['city'] = shopObj.city;
          apiInfo['state'] = shopObj.state;
          apiInfo['zip'] = shopObj.zip;
          apiInfo['countryName'] = shopObj.countryName;
          apiInfo['countryCode'] = shopObj.countryCode;
          apiInfo['dialCode'] = shopObj.dialCode;
          apiInfo['phone'] = phoneNumber;
          apiInfo['email'] = shopObj.email;
          console.log(shopObj);
          apiInfo['lat'] = "0";
          apiInfo['lng'] = "0";
          this.manageShop(apiInfo);
          /* const address = shopObj.addressLine1 + shopObj.addressLine2 + ',' + shopObj.city + ',' + shopObj.state + ',' + shopObj.zip;
          if(shopObj.addressLine1 != '' && shopObj.city != '' && shopObj.state != '' && shopObj.zip != '') {
            this.geocode(address).then(response => {
              this.formProcessing = false;
              console.log(response.geometry.location.lat());
              console.log(response.geometry.location.lng());
              let lat = response.geometry.location.lat();
              let lng = response.geometry.location.lng();
              apiInfo['lat'] = lat.toString();
              apiInfo['lng'] = lng.toString();
              this.manageShop(apiInfo);
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            apiInfo['lat'] = "0";
            apiInfo['lng'] = "0";
            this.manageShop(apiInfo);
          } */          
        } else {
          this.formProcessing = false;
        }
        break;
      case 'contact':
        this.serviceContactSubmit = true;
        for (const i in this.serviceContactForm.controls) {
          this.serviceContactForm.controls[i].markAsDirty();
          this.serviceContactForm.controls[i].updateValueAndValidity();
        }
        this.invalidNumber = (this.iphoneNumber.length > 0 && !this.phoneNumberValid) ? false : true;
        let contactObj = this.serviceContactForm.value;
        console.log(contactObj, this.scf.email.errors, this.serviceContactForm, this.invalidNumber)
        if (this.serviceContactForm.valid && (!this.scf.email.errors || this.scf.email.errors == null || !this.invalidNumber)) {
          this.formProcessing = true;
          let contactAction = (contactObj.contactId == 0) ? apiInfo.action : 'edit';
          let phoneNumber = (contactObj.countryCode == 'IN' && contactObj.phoneNumber.length > 10) ? contactObj.phoneNumber.substring(1) : contactObj.phoneNumber;
          apiInfo.action = contactAction;
          apiInfo['contactId'] = contactObj.contactId;
          apiInfo['firstName'] = contactObj.firstName;
          apiInfo['lastName'] = contactObj.lastName;
          apiInfo['email'] = contactObj.email;
          apiInfo['countryName'] = contactObj.countryName;
          apiInfo['countryCode'] = contactObj.countryCode;
          apiInfo['dialCode'] = contactObj.dialCode;
          apiInfo['phoneNumber'] = phoneNumber;
          apiInfo['shopId'] = this.selectedShop.id;
          console.log(apiInfo)
          this.LandingpagewidgetsAPI.manageServiceContactAPI(apiInfo).subscribe((response) => {
            this.actionTitle = '';
            this.serviceContactSubmit = false;
            this.formProcessing = false;
            const contact = response.data;
            let id = contact.id;
              let itemVal = this.renderContact(contact);
              let serviceContact = this.serviceForm.get('serviceContact');
            let contactVal = serviceContact.value;
            if(contactAction == 'new') {
              this.contacts.unshift({
                id: id,
                name: itemVal,
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                countryName: contact.countryName,
                countryCode: contact.countryCode,
                dialCode: contact.dialCode,
                phoneNumber: contact.phoneNumber
              });
              this.setupSelectedContacts(contact);
              console.log(serviceContact.value)
              contactVal.push(id);
              contactVal = Array.from(new Set(contactVal));
              this.serviceForm.patchValue({serviceContact: contactVal});
            } else {
              let contactIndex = this.contacts.findIndex(option => option.id == id);
              this.contacts[contactIndex].name = itemVal;
              this.contacts[contactIndex].firstName = contact.firstName;
              this.contacts[contactIndex].lastName = contact.lastName;
              this.contacts[contactIndex].email = contact.email;
              this.contacts[contactIndex].countryName = contact.countryName;
              this.contacts[contactIndex].countryCode = contact.countryCode;
              this.contacts[contactIndex].dialCode = contact.dialCode;
              this.contacts[contactIndex].phoneNumber = contact.phoneNumber;
              let contactFormIndex = contactVal.findIndex(option => option == id);
              contactVal[contactFormIndex] = id;
              this.serviceForm.patchValue({serviceContact: contactVal});
              let scIndex = this.selectedContactId.findIndex(option => option == id);
              this.selectedContact[scIndex] = this.renderContact(contact);
              this.updateCardDetails('contact', this.serviceList, contact);
              if(this.view > 1) {
                this.updateCardDetails('contact', this.unassignedList, contact);
              }
            }
            this.actionFlag = false;
            this.actionForm = '';
            this.serviceContactForm.reset();
          });
        } else {
          this.formProcessing = false;
        }        
        break;
    }
  }
  // Get Geo Code
  geocode(address): Promise<any> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({address: address},
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(new Error(status));
          }
        }
      );
    });
  }

  // Manage Shop
  manageShop(apiData) {
    this.LandingpagewidgetsAPI.manageServiceShopAPI(apiData).subscribe((response) => {
      this.formProcessing = false;
      let error = response.error;
      if(!error) {
        this.actionTitle = '';
        this.serviceShopSubmit = false;
        this.actionFlag = false;
        const serviceShop = response.data[0];
        if(apiData.action == 'new') {
          this.Shops.splice(0, 1, serviceShop);
          this.Shops.splice(0, 0, { id: 0, label: `${ManageTitle.actionNew} ${DispatchText.shop}` });
          this.shopChanged('trigger', serviceShop.id);
        } else {
          console.log(this.Shops)
          let shopIndex = this.Shops.findIndex(option => option.id == serviceShop.id);
          console.log(shopIndex)
          this.Shops[shopIndex] = serviceShop;
          let shopId = this.serviceForm.get('shopId');
          if(shopId.value == serviceShop.id) {
            this.selectedShop = serviceShop;
            this.serviceForm.patchValue({shopId: serviceShop.id});
            this.setupShopAddress(serviceShop, false);
          }
          this.updateCardDetails('shop', this.serviceList, serviceShop);
          if(this.view > 1) {
            this.updateCardDetails('shop', this.unassignedList, serviceShop);
          }
        }     
        this.shopExist = false;
        this.existError = '';
        this.actionForm = '';
        this.serviceShopForm.reset();
      } else {
        this.shopExist = true;
        this.existError = response.message;
      }
    });
  }

  // Form Cancel
  formCancel() {
    this.actionFlag = false;
    this.submitClicked = false;
    switch (this.actionForm) {
      case 'catg':
        this.catgExist = false;
        this.serviceCatgSubmit = false;
        this.existError = '';
        this.serviceCatgForm.reset();
        break;
      case 'shop':
        this.shopExist = false;
        this.existError = '';
        this.serviceShopSubmit = false;
        this.serviceShopForm.reset();
        break;
      case 'contact':
        this.emptyPhoneData();
        this.serviceContactSubmit = false;
        this.serviceContactForm.reset();
        break;  
    }
  }

  // Duplicate Check
  duplicateCheck(field, val, id = 0) {
    const apiInfo = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId,
      access: '',
      field: '',
      fieldVal: val,
      id: this.serviceId
    };
    switch (field) {
      case 'ro':
        apiInfo.access = 'service';
        apiInfo.field = 'repairOrder';
        break;
      case 'catg':
        apiInfo.id = id;
        apiInfo.access = 'service-type';
        apiInfo.field = 'serviceName';
        break;
      case 'shop':
        apiInfo.id = id;
        apiInfo.access = 'service-shop';
        apiInfo.field = 'name';
        break;
    }
    if(val == '')
      return;

    if(this.submitClicked)
      this.formProcessing = true;  

    this.LandingpagewidgetsAPI.checkDuplicate(apiInfo).subscribe((response) => {
      console.log(response);
      const flag = response.error;
      this.existError = response.message;
      let chkFlag = true;
      let callback = false;
      switch (field) {
        case 'ro':
          this.roExist = flag;
          callback = false;
          break;
        case 'catg':
          this.catgExist = flag;
          chkFlag = flag;
          callback = (flag) ? false : true;
          break;
        case 'shop':
          this.shopExist = flag;
          chkFlag = flag;
          callback = (flag) ? false : true;
          break;
      }
      console.log(this.catgExist)
      if(callback && !chkFlag && this.submitClicked) {
        this.formAction('submit');
      }  
    });
  }

  // Change Action
  change(field, val) {
    switch(field) {
      case 'tech':
        this.parkingLot = false;
        this.serviceForm.patchValue({parkingLot: this.parkingLot});
        break;
    }
  }

  // Get Tech Index
  getTechIndex() {
    return this.techList;
  }

  // Change Order
  changeOrder(serviceList, view = '', statusData = []) {
    if(serviceList.length > 0) {
      let actionView = (view == '') ? this.view : view;
      const serviceOrderArr: any = [];
      let order = 1;
      let sid = 0;
      let techId = [];
      let techInfo:any = [];
      let serviceData = [];
      let orderType = (actionView == 1) ? 'serviceOrder' : 'techOrder';
      if(this.view == 4) {
        orderType = 'serviceStatusOrder';        
      }
      
      serviceList.forEach(item => {
        console.log(item)
        if(this.view != 4) {
          item.changeAction = (item.changeAction == undefined && item.changeAction == 'undefined') ? false : item.changeAction;
          techId = (actionView == 1 && item.assignedTech.length == 0) ? techId : item.assignedTech[0].techId;
          if(item.changeAction) {
            sid = item.serviceId;
            techInfo = item.techInfo;
            serviceData = item;
          }
          setTimeout(() => {
            item.changeAction = false;
          }, 500);
          serviceOrderArr.push({
            serviceId: item['serviceId'],
            serviceOrder: order,
            techId
          });
        }
        
        switch(actionView) {
          case 1:
            item['serviceOrder'] = order;
            break;
          case 2:
          case 3:
            item['techOrder'] = order;
            break;
          case 4:
            item['statusOrder'] = order;
            break;  
        }
        order++;
      }); 
      const formData = new FormData();
      formData.append('apikey', Constant.ApiKey);
      formData.append('domainId', this.domainId);
      formData.append('userId', this.userId);
      formData.append('action', orderType);
      formData.append('platform', this.platform);
      if(this.view == 4) {
        formData.append('serviceOrderData', JSON.stringify(statusData));
      } else {
        formData.append('serviceOrderData', JSON.stringify(serviceOrderArr));
      }    
      
      this.LandingpagewidgetsAPI.manageServiceAPI(formData).subscribe(
        (response) => {
        console.log(response);
        console.log(actionView, sid)
        if(actionView > 1 && sid > 0) {
          let techId = techInfo.techId;
          let removedId = [];
          this.pushApi('tech-order', serviceData, techId, removedId);          
        }
      });
    }
  }

  // Remove From List
  removeFromList(access, optList, index, serviceId) {
    let sindex;
    if(index >= 0) {
      sindex = optList[index].body.findIndex(option => option.serviceId == serviceId);
      if(sindex >= 0) {
        optList[index].body.splice(sindex, 1);
        optList[index].total -= 1;
        if(access == 'tech') {
          optList[index].body.forEach((item, i) => {
            item.techOrder = parseInt(i)+1;
          });
        }
      }
    }
  }

  // Change Order
  changeListOrder(access, optList, action = true) {
    console.log(optList, action)
    optList.forEach((item, i) => {
      let order = parseInt(i)+1;
      switch(access) {
        case 'service':
          item.serviceOrder = order;
          break;
        case 'tech':
          console.log(order)
          item.techOrder = order;
          break;
        case 'status':
          item.statusOrder = order;
          break;  
      }
    });
    if(action) {
      let view:any = (access == 'service') ? 1 : 2;
      this.changeOrder(optList, view);
    }
  }

  // Remove Non Assigned List
  removeNonAssignedList(serviceId = '') {
    let sid = (serviceId == '') ? this.serviceId : serviceId;
    // Remove from non assigned list
    let naIndex = this.unassignedList.findIndex(option => option.status == 'Not Assigned');
    this.removeFromList('na', this.unassignedList, naIndex, sid);

    // Remove from parking lot list
    let plIndex = this.unassignedList.findIndex(option => option.status == 'Parking Lot');
    this.removeFromList('pl', this.unassignedList, plIndex, sid);
  }

  // Navigate Page
  navPage(access) {
    switch (access) {
      case 'user':
        this.router.navigate([RedirectionPage.ManageUser]);
        break;
    }
  }

  // Setup Empty Tech Card
  setupEmptyTechCard(range) {
    console.log(range)
    if(this.serviceList.length < range) {
      for(let i = 1; i <= range; i++) {
        const tempObj = {};
        tempObj['id'] = 'NA';
        tempObj['display_date'] = 'NA';
        tempObj['date'] = 'NA';
        tempObj['profile'] = 'assets/images/thumb_profile_image.png';
        tempObj['total'] = 0;
        tempObj['body'] = [];
        this.serviceList.push(tempObj);
      }
    }
  }

  // Toggle NA service List
  toggleNotCard() {
    setTimeout(() => {
      this.rightPanelCollapse = !this.rightPanelCollapse;
    }, 100);
  }

  // Render Title
  renderTitle(type, item) {
    let title = "";
    switch(type) {
      case 'make':
        if(item.make != '') {
          title = item.make;
        }
        if(item.model != '') {
          title = `${title}, ${item.model}`;
        }
        if(item.year != '') {
          let year = moment(item.year).format('YYYY');
          title = `${title}${year}`;
        }
        break;
      case 'catg':
        let sctgList = item.serviceCatg;
        let sep;
        sctgList.forEach((sc, index) => {
          sep = (sctgList.length == index+1) ? '' : ', ';
          title += `${sc.name}${sep}`
        });
        break;  
    }
    
    return title;
  }

  // Render Contact Info
  renderContact(item) {
    let fname = item.firstName;
    let lname = item.lastName;
    let name = (lname != '') ? `${fname} ${lname}` : fname;
    let email = item.email;
    let phoneNumber = (item.dialCode != '' && item.phoneNumber != '') ? `${item.dialCode} ${item.phoneNumber}` : '';
    let val = `${name}`;
    val = (email != '') ? `${val}, ${email}` : val;
    val = (phoneNumber != '') ? `${val}, ${phoneNumber}` : val;    
    return val;
  }

  removeSelection(form, controller, index) {
    console.log(form, controller, index)
    switch(controller) {
      case 'serviceContact':
        this.selectedContact.splice(index, 1);
        this.selectedContactId.splice(index, 1);
        this.serviceForm.patchValue({serviceContact: this.selectedContactId});
        break;
    }
    
  }

  // country & phone number update
  getPhoneNumberData(newValue){
    console.log(newValue)
    if(newValue != null){
      if(newValue.phoneVal != null){ 
        if(newValue.access == 'phone'){             
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0 ;
          let placeHolderValue = newValue.placeholderVal;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;   
          
          let currPhValueTrim = '';
          let currPhValueLen = 0 ;      
          if(newValue.phoneVal['number'] != ''){
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
            currPhValueLen = currPhValueTrim.length;   
          }     
        
          if(newValue.phoneVal['number'].length>0){
            this.phonenoInputFlag = (newValue.phoneVal['number'].length>0) ? true : false; 
            this.invalidNumber = (newValue.errorVal) ? true : false; 
            
            this.phoneNumberValid = true;
            this.emptyPhoneData();
            this.iphoneNumber = newValue.phoneVal.number;

            if(currPhValueLen == placeHolderValueLen){ 
              this.phoneNumberValid = false;

              let getCode = newValue.phoneVal.countryCode;        
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;            
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;              
            }
          }
          else{
            this.phonenoInputFlag = false;
            this.iphoneNumber = '';
          }       
        }
      }
      else{
        this.phonenoInputFlag = false;
        this.invalidNumber = (newValue.errorVal) ? true : false; 
        this.phoneNumberValid = true;
        this.emptyPhoneData();
      }
    }
    else{
      this.phonenoInputFlag = false;
      this.invalidNumber = (newValue.errorVal) ? true : false; 
      this.phoneNumberValid = true;
      this.emptyPhoneData();
    }
    setTimeout(() => {
      switch (this.actionForm) {
        case 'shop':
          this.serviceShopForm.patchValue({
            countryName: this.icountryName,
            countryCode: this.icountryCode,
            dialCode: this.idialCode,
            phone: this.iphoneNumber
          });
          break;
        case 'contact':
          this.serviceContactForm.patchValue({
            countryName: this.icountryName,
            countryCode: this.icountryCode,
            dialCode: this.idialCode,
            phoneNumber: this.iphoneNumber
          });
          break;
      }

    }, 150);
  }

  // check email validation
  checkEmailValition(){ 
    console.log(456)
    let emailVal = '';
    var emailError;
    emailVal = this.serviceContactForm.value.email.trim();
    emailError = this.serviceContactForm.controls.email.errors;
    console.log(emailVal)
    if(emailVal.length>0){   
      this.emailValidationError = false;
      this.emailValidationErrorMsg = "";
      if(emailError){
        this.emailValidationError = true;
        this.emailValidationErrorMsg = "Invalid Email";
      }            
    }
  }

  setupShopAddress(shop, callback = true) {
    let address = '';
    address = (shop.lat != '0') ? `${shop.addressLine1}, ${shop.addressLine2}, ${shop.city}, ${shop.state} ${shop.zip}` : address;
    let shopId = shop.id;
    this.serviceForm.patchValue({
      shopId,
      mapValue: address,
      serviceContact: this.empty
    });
    if(callback) {
      this.getContactList(shopId);
    }
  }

  setupSelectedContacts(item) {
    console.log(item)
    let citem = this.renderContact(item);
    console.log(citem)
    this.selectedContact.push(citem);
    this.selectedContactId.push(item.id);
  }

  emptyPhoneData() {
    this.icountryName = '';
    this.icountryCode = '';          
    this.idialCode = '';
    this.iphoneNumber = '';
    this.serviceContactForm.patchValue({
      countryName: this.icountryName,
      countryCode: this.icountryCode,
      dialCode: this.idialCode,
      phoneNumber: this.iphoneNumber
    });
    this.phoneNumberData = {  
      countryCode: this.icountryCode, 
      phoneNumber: this.iphoneNumber,
      country: this.icountryName, 
      dialCode: this.idialCode,
      access: 'phone'
    }
  }

  emptyContact() {
    this.selectedContact = [];
    this.selectedContactId = [];
    this.contacts = [];    
  }

  updateCardDetails(field, serviceList, data) {
    let shopId;
    switch(field) {
      case 'shop':
        shopId = data.id;
        break;
    }
    console.log(field, serviceList, data);
    serviceList.forEach(sitem => {
      sitem.body.forEach(item => {
        switch(field) {
          case 'shop':
            if(item.shopId == shopId) {
              item.shopData = data;
            }
            break;
          case 'catg':
            if(item.serviceCatg.length > 0) {
              let catgId = data.id;
              let catgIndex = item.serviceCatg.findIndex(option => option.id == catgId);
              if(catgIndex >= 0) {              
                item.serviceCatg[catgIndex].id = data.id;
                item.serviceCatg[catgIndex].name = data.serviceName;
                if(catgIndex == 0) {
                  item.serviceCatgName = data.serviceName;
                }
              }
            }          
            break;
          case 'contact':
            let cid = data.id;
            let cindex = item.serviceContacts.findIndex(option => option.id == cid);
            console.log(cindex)
            if(cindex >= 0) {
              item.serviceContacts[cindex] = data;
            }
            break;
        }        
      });
    });
  }

  renderAdderss(address) {
    const sep = (address.addressLine2 != '') ? ',' : '';
    address.addressLine1 = address.addressLine1.replace(/,*$/, '')
    address.addressLine2 = address.addressLine2.replace(/,*$/, '')
    const addr = (!address.mapFlag) ? '' :
      `${address.addressLine1}, ${address.addressLine2}${sep} ${address.city}, ${address.state} ${address.zip}`;
    return addr;
  }

  preferredOrder(obj, item, index, newObject) {
    obj.forEach(sitem => {
      if(sitem.id == item) {
        newObject[index] = sitem;  
      }
    });
    return newObject;
  }

  setupActiveCard(serviceData) {
    serviceData.isActive = true;
    setTimeout(() => {
      serviceData.isActive = false;
    }, 500);
  }

  removeCards(optList, serviceData, checkTech = false) {
    // Check and Remove card in Assigned Service list
    let removeFlag = !checkTech;
    let serviceId = serviceData.serviceId;
    optList.forEach((optItem, index) => {
      let total = parseInt(optList[index].total);
      let sid = parseInt(optItem.id);
      let assignedTech = serviceData.assignedTech;
      let statusId = serviceData.statusData.id;
      if(!removeFlag) {
        let techIndex = assignedTech.findIndex(option => option.techId == sid);
        removeFlag = (techIndex < 0) ? true : removeFlag;
      }
      if(removeFlag) {
        optItem.body.forEach((card, cindex) => {
          //console.log(card, serviceId)
          let removeItem = false;
          if(card.serviceId == serviceId) {
            switch (this.view) {
              case 1:
              case 2:
              case 3:
                removeItem = true;
                break;
              case 4:
                removeItem = ((sid != statusId) || (sid == statusId && assignedTech.length == 0)) ? true : removeItem;
                break;
            }            
          }
          if(removeItem) {
            optItem.body.splice(cindex, 1);
            optItem.total = total - 1;
            let orderAccess = (this.view == 1) ? 'service' : (this.view == 4) ? 'status' : 'tech';
            this.changeListOrder(orderAccess, optItem.body, false);
          }
        });
      }
    });
  }

  checkHiddenDocument() {
    if (!document.hidden) {
      console.log(this.currDate)
      const view:any = 0;
      this.disableLoading = true;
      switch (this.view) {
        case 1:
          this.getDispatchList(this.currDate, -1, 0, false, !this.isAdminView);
          break;
        case 2:
          let techViewIndex = -1;
          this.getDispatchList(this.currDate, techViewIndex, this.currTechIndex, true);
          setTimeout(() => {
            this.getDispatchList(this.currDate, view);
          }, 100);
          break;
        case 3:
          console.log(this.techList)
          this.rightPanelCollapse = (this.view == 3) ? true : this.rightPanelCollapse;
          this.unassignedList = [];
          setTimeout(() => {
            this.getDispatchList(this.currDate);
            setTimeout(() => {
              this.disableLoading = true;
              this.getDispatchList(this.currDate, view);
            }, 1000);
          }, 800);
          break;  
        case 4:
          this.getDispatchList(this.currDate);
          break;    
      }
    }
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.stateList = response.data.stateData;
        console.log(this.stateList)
      }
    }, (error: any) => {
    });
  }
}
