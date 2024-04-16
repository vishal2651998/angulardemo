import { Component, HostListener, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-inspection-location-list',
  templateUrl: './inspection-location-list.component.html',
  styleUrls: ['./inspection-location-list.component.scss']
})
export class InspectionLocationListComponent implements OnInit, OnDestroy{

  
  @Input() selectionData: any = [];
  @Output() saveData = new EventEmitter<Object>();
  @Input() selectedLocationList: any = [];

  
  public bodyHeight: number;
  public innerHeight: number;
  public scrollPos: any = 0;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public countryId;
  public domainId;
  public userId;
  dekraNetworkId:any;
  public bodyElem;
  public leftToggleBox: boolean = true;
  public leftSearchBox: string = "";
  public rightToggleBox: boolean = false;
  public apiKey: string = Constant.ApiKey;

  level1Data:any = {};
  level2Data:any = {};
  level3Data:any = {};
  level1lDropdownData:any = {};
  level2lDropdownData:any = {};
  level3lDropdownData:any = {};
  level1rDropdownData:any = {};
  level2rDropdownData:any = {};
  level3rDropdownData:any = {};


  level1l = ""
  level2l = ""
  level3l = ""
  level1r = ""
  level2r = ""
  level3r = ""

  isAlll = true;

  public searchForm: FormGroup;
  public searchInputFlag: boolean = false;
  public searchTick: boolean = false;
  public loading: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public selectNetworkName: string = '';
  public selectNetworkId: string = '';

  public locationList: any = [];
  filteredListr = [];
  filteredListl = [];
  user: any;
  rightSearchBox: any = "";

  constructor(private modalService: NgbModal,private modalConfig: NgbModalConfig,private headQuarterService:HeadquarterService,private authenticationService:AuthenticationService,
    private router: Router,) { 
    modalConfig.backdrop = 'static';
  modalConfig.keyboard = false;
  modalConfig.size = 'dialog-centered';
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add("dekra-audit-inloc"); 
    this.bodyHeight = window.innerHeight;

   this.selectNetworkId = this.selectionData.selectNetworkId;
   this.selectNetworkName =  this.selectionData.selectNetworkName;
   this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
   this.user = this.authenticationService.userValue;
   this.domainId = this.user.domain_id;
   this.userId = this.user.Userid;
  //  this.locationList = [
  //   {
  //     id: 1,
  //     name: '400 St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 2,
  //     name: '401 St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 3,
  //     name: '402 St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 4,
  //     name: '403 400th St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 5,
  //     name: '404 400th St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 6,
  //     name: '405 400th St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   }
  //  ]


  //  this.selectedLocationList = [
  //   {
  //     id: 1,
  //     name: '401 St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 2,
  //     name: '402 St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },
  //   {
  //     id: 3,
  //     name: '403 St, Susquehanna, PA 18847 (Level 1: North, Level 2: 4, Level 3: Northeast)',
  //     linkActive: false
  //   },

  //  ]
    this.getNetworkList();
   for (let ll in this.locationList) { 
      for (let sll in this.selectedLocationList) {
        if(this.locationList[ll].id == this.selectedLocationList[sll].id){
          this.locationList.splice(ll,1);
        }
      }
   }

   console.log(this.locationList)
   console.log(this.selectedLocationList)
   
  setTimeout(() => {
    this.setScreenHeight();
  }, 500);
  this.getShopList();
  }

   // Set Screen Height
   setScreenHeight() {
    let headerHeight1 = 0;
    let headerHeight2 = 0;
    let headerHeight3 = 0;
    // headerHeight1 = document.getElementsByClassName('prob-header')[0].clientHeight;
    // headerHeight2 = document.getElementsByClassName('prob-cont-1')[0].clientHeight;
    // headerHeight3 = document.getElementsByClassName('prob-cont-2')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight1+headerHeight2+headerHeight3+40));  
    console.log(this.innerHeight);
         
  }

  
  backToList(){
    this.saveData.emit(this.selectedLocationList);
  }

  getNetworkList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {    
      if(response && response.data && response.data.attributesInfo && response.data.attributesInfo.length > 0){
        response.data.attributesInfo.forEach(attribute=>{
          switch(attribute.displayOrder){
            case 1:
                this.level1Data = this.unlink(attribute);
                this.level1lDropdownData = this.level1Data.items;
                this.level1rDropdownData = this.level1Data.items;
                break;
            case 2:
              this.level2Data = this.unlink(attribute);
              break;
              case 3:
            this.level3Data = this.unlink(attribute);
            break;
            default:
            break
          }
        })
      }
    })
  }

  unlink(obj){
    return JSON.parse(JSON.stringify(obj))
  }

  onLevel1lChange(){
    this.leftToggleBox = false;
    this.level2lDropdownData = this.level2Data.items.filter(e=>e.levelOneId == this.level1l);
    this.level3lDropdownData = [];
    this.level2l = "";
    this.level3l = "";
    this.filterl();

  }

  onLevel2lChange(){
    this.leftToggleBox = false;
    this.level3lDropdownData = this.level3Data.items.filter(e=>e.levelOneId == this.level1l && e.levelTwoId == this.level2r);
    this.level3l = "";
    this.filterl();

  }

  onLevel1rChange(){
    this.level2rDropdownData = this.level2Data.items.filter(e=>e.levelOneId == this.level1r);
    this.level3rDropdownData = [];
    this.level2l = "";
    this.level3l = "";
    this.filterr();
  }

  onLevel2rChange(){
    this.level3rDropdownData = this.level3Data.items.filter(e=>e.levelOneId == this.level1r && e.levelTwoId == this.level2r);
    this.level3r = "";
    this.filterr();
  }

  filterr(){
    this.filteredListr = this.selectedLocationList.filter(e=>{
      // if(this.level1r && this.level1r != e.levelOneId){
      //   return false;
      // }

      // if(this.level2r && this.level2r != e.levelTwoId){
      //   return false;
      // }

      // if(this.level3r && this.level3r != e.levelThreeId){
      //   return false;
      // }
      if(e.name && !e.name.includes(this.rightSearchBox)){
        return false
      }
      return true
    })
  }

  filterl(init=true){
      this.filteredListl = this.locationList.filter(e=>{
        if(this.level1l && this.level1l != e.levelOneId && !this.leftToggleBox){
          return false;
        }
  
        if(this.level2l && this.level2l != e.levelTwoId && !this.leftToggleBox){
          if(init){
            this.leftToggleBox = false;
          }
          return false;
        }
  
        if(this.level3l && this.level3l != e.levelThreeId && !this.leftToggleBox){
          if(init){
            this.leftToggleBox = false;
          }
          return false;
        }

        if(e.name && !e.name.includes(this.leftSearchBox)){
          return false
        }
        return true;
      })
      if(init){
        this.selectedLocationList = [];
      }else{
      }
  }

  submit(type){
    switch(type){
      case 'cancel':
        this.submitCancel();          
        break;
      case 'publish':
        this.backToList();
        break;
      default:
        break;
    }
  }

  submitCancel(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        this.backToList();
      }
    });
  }

  onToggleBoxChange(flag){
    console.log(flag)
    if(flag == "switch"){
      
    }else{
        this.level1l = "";
      this.level2l = "";
      this.level3l = "";
    }
    // if(flag){
    //   this.level1l = "";
    //   this.level2l = "";
    //   this.level3l = "";
    // }
    this.filterl()
  }

  onToggleBoxChangeRight(flag){
    console.log(flag)
    // if(flag){
    //   this.level1l = "";
    //   this.level2l = "";
    //   this.level3l = "";
    // }
    this.filterr()
  }

  ngOnDestroy(){
    this.bodyElem.classList.remove("dekra-audit-inloc"); 
  }

  updateList(type,id,index){
    if(type == 'add'){
      this.filteredListl[index].linkActive = true;
      setTimeout(() => {
        for (let ll in this.filteredListl) { 
          if(this.filteredListl[ll].id == id){
             this.filteredListl[ll].linkActive = false;
              this.selectedLocationList.push(this.filteredListl[ll]);
          }
        }
        this.filteredListl.splice(index,1);
      }, 100);      
    }  
    else{
      for (let sll in this.selectedLocationList) { 
        if(this.selectedLocationList[sll].id == id){
          this.filteredListl.push(this.selectedLocationList[sll]);
        }
      }
      this.selectedLocationList.splice(index,1);
    }
    this.filteredListr = this.selectedLocationList;
    setTimeout(() => {
      this.filterr();
    }, 200);
  }

  getShopList(){
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    // apiFormData.append("limit", this.pageLimit.toString());
    // apiFormData.append("offset",this.pageOffset.toString());
    
      // apiFormData.append("limit", );
      apiFormData.append("offset","0");
    this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      
      
        if(response){
          this.locationList = response.items;
          let newList = [];
          this.locationList = this.locationList.filter(e=>{
            if(this.selectedLocationList.find(s=>s.id == e.id)){
              newList.push(e);
              return false;
            }else{
              return true;
            }
          })
          this.selectedLocationList = newList;
          this.filterl(false);
          this.filterr();
        }
        this.loading = false;
    })

  }


}
