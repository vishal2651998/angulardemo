import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { HeadquarterSidebarComponent } from '../headquarter-sidebar/headquarter-sidebar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddShopPopupComponent } from '../../shop/shop/add-shop/add-shop.component';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-headquarter-summary',
  templateUrl: './headquarter-summary.component.html',
  styleUrls: ['./headquarter-summary.component.scss']
})
export class HeadquarterSummaryComponent implements OnInit {
  @Output() headquartersComponentRef: EventEmitter<HeadquartersListComponent> = new EventEmitter();
  @ViewChild('headquarterSidebar', { static: false }) headquarterSidebar: HeadquarterSidebarComponent;

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2:string = "profile";
  public bodyClass3:string = "image-cropper";
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  public bodyElem;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public servicefacilityflagYes: boolean = true;
  public servicefacilityflagNo: boolean = false;
  public trainingCenterflagYes: boolean = false;
  public trainingCenterflagNo: boolean = true;
  public headquartersFlag: boolean = true;
  submitClicked = false
  formProcessing: boolean = false;
  public showClear = false;
  public fieldName: string = '';
  public actionTitle = '';
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phoneNumberData:any;
  public actionFlag:boolean = false;
  public actionForm = '';
  serviceShopForm: FormGroup;
  serviceContactForm: FormGroup;
  addUserVisible=false;
  public regionName: string="";
  level:string="";
  subLevel:string = "";

  headquartersPageRef: HeadquartersListComponent;
  @Output() onShopSelect = new EventEmitter();
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }
  constructor(private formBuilder: FormBuilder,
    private modalService:NgbModal,
    private router:Router,
    private route:ActivatedRoute,
    public headQuarterService: HeadquarterService
    ) { 
      router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          this.level =  event.url.split('/')[3];
          this.subLevel =  event.url.split('/')[4];     
        }
    })
  }

  ngOnInit(): void {

   /* this.route.params.subscribe( params => {
      this.level = params.level;
      this.subLevel = params.subLevel;
    });*/
    
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4);  
    window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500)

    setTimeout(() => {
      console.log(this.headquartersPageRef);
      if(this.level != '' && this.subLevel !=''){
        this.headquartersPageRef.level = this.level;
        this.headquartersPageRef.subLevel = this.subLevel;        
        this.headquartersFlag = false;
        this.headquartersPageRef.headquartersFlag = false;
        this.headquartersPageRef.loading = false;
        this.headquartersPageRef.getHqDetails(); 
        this.headquartersPageRef.showLevelDetail();                 
      }          
    }, 1000);

  }

  navigateToShops(arg:string){
    this.router.navigate([`/headquarters/region/${this.regionName}/shops`])
    // this.onShopSelect.emit(arg);
  }
  changeCheckbox(type,flag){ 
    if(type == 'yes-r1'){
      this.servicefacilityflagYes = flag;
      this.servicefacilityflagNo = this.servicefacilityflagYes ? false : true;
    }
    if(type == 'no-r1'){
      this.servicefacilityflagNo = flag;
      this.servicefacilityflagYes = this.servicefacilityflagNo ? false : true;
    }
    if(type == 'yes-r2'){
      this.trainingCenterflagYes = flag;
      this.trainingCenterflagNo = this.trainingCenterflagYes ? false : true;
    }
    if(type == 'no-r2'){
      this.trainingCenterflagNo = flag;
      this.trainingCenterflagYes = this.trainingCenterflagNo ? false : true;
    }
  }
  back(step){
    if(step == 'Headquarters'){  
      this.headQuarterService.levelName = '';  
      this.headQuarterService.sublevelName = '';     
      this.router.navigate([`headquarters/network`]);      
      setTimeout(() => {
        this.headquartersFlag = true;
        this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
        //this.headquartersPageRef.loading = false;
        //this.headquartersPageRef.getData('');
        //this.setScreenHeight();
      }, 100);
    }
  }

  headquartersCallback(data) {
    this.headquartersFlag = true;
    this.headquartersPageRef.headquartersFlag = this.headquartersFlag;  
  }

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
  }
  scroll = (event: any): void => {
  }
  addUsers(){
    this.serviceAction('new', 'contact');
  }

  // Create New Options
  serviceAction(action, field, item:any = '') {
    console.log(field);
    this.submitClicked = false;
    this.formProcessing = false;
    let formTimeout = (action == 'new') ? 0 : 500;
    switch (field) {
      case 'shop':
      case 'region':
      case 'zone':
      case 'territories':
        this.showClear = false;
        
        if(field == 'region'){
          this.fieldName = "Region";
        }
        else if(field == 'territories'){
          this.fieldName = "Territory";
        }
        else if(field == 'zone'){
          this.fieldName = "Zone";
        }
        else{
          this.fieldName = "HQ";          
        }
        this.actionTitle = (action == 'new') ? 'New '+this.fieldName : 'Edit '+this.fieldName;
        this.emptyPhoneData();
        let sitem = (action == 'new') ? '' : item;
        this.createForm('serviceShop', sitem);
        setTimeout(() => {
          this.actionFlag = true;
          this.actionForm = field;
        }, formTimeout);
      break;      
      case 'contact':
        this.actionTitle = (action == 'new') ? 'New HQ User' : 'Edit HQ User';
        this.emptyPhoneData();
        let citem = (action == 'new') ? '' : item;
        this.createForm('serviceContact', citem);
        setTimeout(() => {
          this.actionFlag = true;
          this.actionForm = field;
        }, formTimeout);          
      break;
    }
  }
  openAddShopModal(){
    const modalRef = this.modalService.open(AddShopPopupComponent, {backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
  }

  createForm(action, item:any = '', date:any = '') {
    switch (action) {
      case 'serviceShop':
        let shopId = (item == '') ? 0 : item.id;
        let shopName = (item == '') ? '' :item.name;
        let locationAddType = (item == '') ? '' :item.locationAddType;
        let addressLine1 = (item == '') ? '' : item.addressLine1;
        let addressLine2 = (item == '') ? '' : item.addressLine2;
        let city = (item == '') ? '' : item.city;
        let state = (item == '') ? '' : item.state;
        let zip = (item == '') ? '' : item.zip;
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
          locationAddType: [locationAddType],
          addressLine1: [addressLine1, [Validators .required]],
          addressLine2: [addressLine2],
          city: [city, [Validators .required]],
          state: [state, [Validators .required]],
          zip: [zip, [Validators .required]],
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
          lastName: [lastName, [Validators.required]],
          email: [email, [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          title: [],
          businessRole: [],
          dept: [],
          hquserId: [],
          managername: [],
          countryName: [countryName],
          countryCode: [countryCode],
          dialCode: [dialCode],
          phoneNumber: [phoneNumber]
        });
        break;
    }
  }
  
  emptyPhoneData(){
    this.icountryName = '';
    this.icountryCode = '';
    this.idialCode = '';
    this.iphoneNumber = '';
    this.phoneNumberData = {
      countryCode: this.icountryCode,
      phoneNumber: this.iphoneNumber,
      country: this.icountryName,
      dialCode: this.idialCode,
      access: 'phone'
    }
  }

  openAddUser(){
    this.addUserVisible = true;
  }

  closeAddUser(){
    this.addUserVisible = false;
  }
}
