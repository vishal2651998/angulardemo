import { Component, OnInit,  HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant, DefaultNewImages } from "src/app/common/constant/constant";
import { CommonService } from 'src/app/services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { ManageUserComponent } from 'src/app/components/common/manage-user/manage-user.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-escalation-level',
  templateUrl: './escalation-level.component.html',
  styleUrls: ['./escalation-level.component.scss'],
  providers: [MessageService]
})
export class EscalationLevelComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public headerData: Object;
  pageAccess: string = "user-settings";
  public headTitle: string = "Escalation Configuration";
  public bodyClass: string = "system-settings";
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
  public dispatchFlag: boolean = false;
  public emailFlag: boolean = false;
  public pushFlag: boolean = false;
  public makeFlag: boolean = false;
  public menuItemsData: any;
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public expandFlag: boolean = true;
  public rmHeight: any = 0;
  public ermHeight: any = 0;
  public showType = 6;
  public contentTypeText = "User settings not available";
  public contentTypeDefaultNewImg = DefaultNewImages.UserSettings;
  public toggleBox: boolean = false;
  public configData: any;
  public activeLevelId:string = '';
  public rtLoading: boolean = true;
  public systemMsg: Message[];
  public menuId: string = '4';
  public makeConfigData: any;
  public configLtData: any;
  public configRtData: any;
  public escalationViewlevelFlag: boolean = true;
  public escalationMatrix_array=[];
  public editEscalationButtonEnable: boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

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
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) { 
      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': false,
        'searchBg': false
      };

      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.setScreenHeight();  
      }, 3000);         
      this.userSettingMenuItems();
    } 
  }

  escalationsSave(){ 
    if(this.editEscalationButtonEnable ){ 
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId); 
    apiFormData.append('version','2');  
    apiFormData.append('dataId','56357');
    apiFormData.append('platform','3');
    apiFormData.append('limit','2');
    apiFormData.append('escalationType',this.activeLevelId);
    apiFormData.append('params',JSON.stringify(this.escalationMatrix_array));
    this.commonApi.updateEscConfigLists(apiFormData).subscribe(response => {
      console.log(response) ;
      if(response.status=='Success'){
        this.systemMsg = [{severity:'success', summary:'', detail:response.result}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.systemMsg = [];
          this.getEscalationConfigList();
          this.escalationMatrix_array = [];
          this.editEscalationButtonEnable = false;
          this.escalationViewlevelFlag = true;
        }, 3000);
      }
      else{}
    },
    (error => {}));
  }
  }

  escalationsEdit(){
    this.escalationViewlevelFlag = false;
  }


  escalationsCancel(){
    if(this.editEscalationButtonEnable){
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
        modalRef.dismiss('Cross click'); 
        if(!receivedService) {
          return;
        } else {
          this.editEscalationButtonEnable = false;
          this.escalationMatrix_array = [];
          this.escalationViewlevelFlag = true;
          this.getEscalationConfigList();
        }
       });
    } 
    else{
      this.escalationViewlevelFlag = true;
    }    
  }

  updatePerson(eventId, eventArrId, fieldId, item){
    console.log(item);
    const apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      fromEscalationConfig: "1",
      businessRole: fieldId,
      escalationLevelId: this.activeLevelId
    };

    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'escalation-level-config';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = 'new';
    modalRef.componentInstance.selectedUsers = item;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      console.log(receivedService);
      if(!receivedService.empty) {
        console.log(receivedService);
        this.editEscalationButtonEnable = true;
        let popSelectedUsers = [];
        popSelectedUsers = receivedService;        
        let itemsArr = this.configData;
        let arr1, arr2, arr3, arr4, arr5;
        for(let item in itemsArr){   
          arr1 = itemsArr[item].events;    
          for(let events in arr1){ 
            if(arr1[events].eventId == eventId){
              arr2 = arr1[events].eventsTypes;            
              for(let eventsTypes in arr2){               
                arr3 = arr2[eventsTypes].eventArr;             
                for(let eventArr in arr3){  
                  if(arr3[eventArr].id == eventArrId){                
                    arr4 = arr3[eventArr].eventInnerArr;               
                    for(let eventInnerArr in arr4){
                      arr5 = arr4[eventInnerArr].fieldStr;
                      for(let fieldStr in arr5){ 
                        if(arr5[fieldStr].id == fieldId){       
                          arr5[fieldStr].usersList = popSelectedUsers;
                        } 
                      }  
                    }
                  }
                }            
              }  
            }                                           
          }                                             
        } 
        
        let popSelectedUsersJSON = popSelectedUsers.length>0 ? JSON.stringify(popSelectedUsers) : popSelectedUsers;

        if(this.editEscalationButtonEnable){
          if(this.escalationMatrix_array.length>0)
          {
            let studentObj =  this.escalationMatrix_array.find(option => option.eventId == eventId);
            if(studentObj)
            {
              this.escalationMatrix_array.find(option => option.eventId == eventId).userListArray = popSelectedUsersJSON;  
            }
            else{
              let fieldVal = ''; 
              let arrVal = [];
              eventArrId = parseInt(eventArrId);
              arrVal.push(eventArrId);
              let eventTypeIdArr = arrVal; 

              let arrVal2 = [];
              fieldId = parseInt(fieldId);
              arrVal2.push(fieldId);
              let fieldIdArr = arrVal2;
           
              this.escalationMatrix_array.push({
                eventId: eventId,
                eventTypeIdArr: eventTypeIdArr,
                fieldVal: fieldVal,
                fieldIdArr: fieldIdArr,
                userListArray: popSelectedUsersJSON
              });
            }
          }
          else{
            let fieldVal = ''; 
            let arrVal = [];
            eventArrId = parseInt(eventArrId);
            arrVal.push(eventArrId);
            let eventTypeIdArr = arrVal; 

            let arrVal2 = [];
            fieldId = parseInt(fieldId);
            arrVal2.push(fieldId);
            let fieldIdArr = arrVal2;
                        
            this.escalationMatrix_array.push({
              eventId: eventId,
              eventTypeIdArr: eventTypeIdArr,
              fieldVal: fieldVal,
              fieldIdArr: fieldIdArr,
              userListArray: popSelectedUsersJSON
            });
          }
          console.log(this.escalationMatrix_array); 
        }
      }  
      modalRef.dismiss('Cross click');      
    });
  }

  userSettingMenuItems() {
    /*const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    //apiFormData.append('roleId', this.roleId);
    apiFormData.append('apiVersion', '3');
    apiFormData.append('platform', '1');
    this.commonApi.getUserTypeContentTypeLists(apiFormData).subscribe(response => {
      console.log(response)
      if(response.status=='Success'){
        this.menuItemsData = [];
        let menuItemsArr = [];
        menuItemsArr = response.items;
        this.menuItemsData = menuItemsArr;
        this.itemEmpty = (menuItemsArr.length > 0) ? false : true;
        console.log(this.menuItemsData);
        setTimeout(() => {
          this.loading = false;
          for (var i in this.menuItemsData) {     
            this.menuItemsData[i].activeFlag = false; 
          }
          this.menuItemsData[0].activeFlag = true; 
          this.activeLevelId = this.menuItemsData[0].contentTypeId;
          this.getEscalationConfigList(this.activeLevelId);
        }, 1000);
      }else{
        this.loading = false;
      }
    })*/
    let menuItemsArr = [];
    menuItemsArr = 
    [
      {
          "id": 1,
          "name": "Level 1",
          "class": "escalation-level-icon",
          "activeFlag": true
      },
      {
          "id": 2,
          "name": "Level 2",
          "class": "escalation-level-icon",
          "activeFlag": false
      },
      {
          "id": 3,
          "name": "Level 3",
          "class": "escalation-level-icon",
          "activeFlag": false
      },
      {
          "id": 4,
          "name": "Level 4",
          "class": "escalation-level-icon",
          "activeFlag": false
      },
      {
          "id": 5,
          "name": "Level 5",
          "class": "escalation-level-icon",
          "activeFlag": false
      }
  ];
  this.menuItemsData = menuItemsArr;
  setTimeout(() => {
    this.loading = false;
    for (var i in this.menuItemsData) {     
      this.menuItemsData[i].activeFlag = false; 
    }
    this.menuItemsData[0].activeFlag = true; 
    this.activeLevelId = this.menuItemsData[0].id;
    this.getEscalationConfigList();
  }, 1000);

  }

  navSection(index){ 
    if(this.editEscalationButtonEnable){
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
        modalRef.dismiss('Cross click'); 
        if(!receivedService) {
          return;
        } else {
          this.editEscalationButtonEnable = false;
          this.escalationMatrix_array = [];
          for (var i in this.menuItemsData) {     
            this.menuItemsData[i].activeFlag = false;  
          }
          this.menuItemsData[index].activeFlag = true;
          this.activeLevelId = this.menuItemsData[index].id;
          this.escalationViewlevelFlag = true;
          this.rtLoading = true;
          this.getEscalationConfigList();  
        }
       });
    } 
    else{ 
      for (var i in this.menuItemsData) {     
        this.menuItemsData[i].activeFlag = false;  
      }
      this.menuItemsData[index].activeFlag = true;
      this.activeLevelId = this.menuItemsData[index].id;
      this.escalationViewlevelFlag = true;
      this.rtLoading = true;
      this.getEscalationConfigList();      
    }
  }

  // Get Dispatch Notification Config
  getEscalationConfigList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId); 
    apiFormData.append('version','2');  
    apiFormData.append('dataId','56357');
    apiFormData.append('platform','3');
    apiFormData.append('limit','2');
    apiFormData.append('escalationType',this.activeLevelId);
    this.commonApi.getEscConfigLists(apiFormData).subscribe(response => {
      console.log(response) ;
      if(response.status == 'Success'){ 
        this.configData = [];
        let itemsArr;
        let arr1, arr2, arr3, arr4, arr5;
        itemsArr = response.items;
        for(let item in itemsArr){   
          arr1 = itemsArr[item].events;    
         for(let events in arr1){ 
          arr2 = arr1[events].eventsTypes; 
          
          for(let eventsTypes in arr2){
            console.log(arr2[eventsTypes].eventfieldType);
            if(arr2[eventsTypes].eventfieldType == "toggle"){
              arr2[eventsTypes].toggleFlag = arr2[eventsTypes].eventSelectedValId == 1 ? true : false;  
            }
            if(arr2[eventsTypes].eventfieldType == "text"){
              arr2[eventsTypes].eventSelectedValId = 1;
            }
            if(arr2[eventsTypes].eventfieldType == 'dropdown'){              
              if(arr2[eventsTypes].eventSelectedValId.length>0){
                if(arr2[eventsTypes].eventSelectionType == 'single'){ 
                  arr2[eventsTypes].eventSelectedValStr = parseInt(arr2[eventsTypes].eventSelectedValId);               
                  arr2[eventsTypes].eventSelectedValId = parseInt(arr2[eventsTypes].eventSelectedValId);                 
                }
                else{
                  arr2[eventsTypes].eventSelectedValStr = arr2[eventsTypes].eventSelectedValId; 
                  arr2[eventsTypes].eventSelectedValId = arr2[eventsTypes].eventSelectedValId;                  
                }  
              }   
              else{
                if(arr2[eventsTypes].eventSelectedValId != ''){
                  if(arr2[eventsTypes].eventSelectionType == 'single'){ 
                    arr2[eventsTypes].eventSelectedValStr = parseInt(arr2[eventsTypes].eventSelectedValId);   
                    arr2[eventsTypes].eventSelectedValId = parseInt(arr2[eventsTypes].eventArr[0].id); 
                  }                  
                }
                else{
                  arr2[eventsTypes].eventSelectedValId = [];
                }               
              }           
            } 
            arr3 = arr2[eventsTypes].eventArr;
            arr2[eventsTypes].eventSelectedValArrName = [];
            for(let eventArr in arr3){ 
              if(arr2[eventsTypes].eventfieldType == 'dropdown'){ 
                if(arr2[eventsTypes].eventSelectionType == 'multiple'){  
                  if(arr2[eventsTypes].eventSelectedValStr && arr2[eventsTypes].eventSelectedValStr.length>0){
                    for(let selectedArr in arr2[eventsTypes].eventSelectedValStr){
                      if(arr2[eventsTypes].eventSelectedValStr[selectedArr]>0){
                        if(arr2[eventsTypes].eventSelectedValStr[selectedArr] == arr3[eventArr].id){
                          arr2[eventsTypes].eventSelectedValArrName.push(arr3[eventArr].name); 
                        }
                      }
                    }
                  }
                }
                else{
                  if(arr2[eventsTypes].eventSelectedValId>0){
                    if(arr2[eventsTypes].eventSelectedValId == arr3[eventArr].id){
                      arr2[eventsTypes].eventSelectedValName = arr3[eventArr].name; 
                    }                    
                  }
                }
              }
              if(arr2[eventsTypes].eventfieldType == 'S'){
                if(arr2[eventsTypes].eventSelectedValId == arr3[eventArr].id){
                  arr2[eventsTypes].eventSelectedValName = arr3[eventArr].name; 
                }
              }
              arr4 = arr3[eventArr].eventInnerArr;               
              for(let eventInnerArr in arr4){
                arr4[eventInnerArr].fieldSelectedValArrName = [];
                if(arr4[eventInnerArr].fieldtype == 'dropdown'){
                  if(arr4[eventInnerArr].fieldSelectedValId.length>0){
                    if(arr4[eventInnerArr].fieldSelectionType == 'single'){                
                      arr4[eventInnerArr].fieldSelectedValId = parseInt(arr4[eventInnerArr].fieldSelectedValId);                 
                    }
                    else{
                      arr4[eventInnerArr].fieldSelectedValId = arr4[eventInnerArr].fieldSelectedValId;    
                    }  
                  }              
                }
                arr5 = arr4[eventInnerArr].fieldStr;
                for(let fieldStr in arr5){
                  if(arr4[eventInnerArr].fieldtype == 'dropdown'){ 
                    if(arr4[eventInnerArr].fieldSelectionType == 'multiple'){   
                      if(arr4[eventInnerArr].fieldSelectedValId && arr4[eventInnerArr].fieldSelectedValId.length>0){
                        for(let selectedArr in arr4[eventInnerArr].fieldSelectedValId){
                          if(arr4[eventInnerArr].fieldSelectedValId[selectedArr]>0){
                            if(arr4[eventInnerArr].fieldSelectedValId[selectedArr] == arr5[fieldStr].id){
                              arr4[eventInnerArr].fieldSelectedValArrName.push(arr5[fieldStr].name); 
                            }
                          }
                        }
                      }
                      else{
                        arr4[eventInnerArr].fieldSelectedValId = arr5[0].id;
                      }                      
                    }                    
                    else{                      
                      if(arr4[eventInnerArr].fieldSelectedValId>0){
                        if(arr4[eventInnerArr].fieldSelectedValId == arr5[fieldStr].id){

                          if(arr2[eventsTypes].eventfieldType == "text"){
                            if(arr5[fieldStr].usersList.length>0){
                              arr4[eventInnerArr].fieldSelectedValName = "Selected Person";
                            }  
                          }
                          else{
                            arr4[eventInnerArr].fieldSelectedValName = arr5[fieldStr].name; 
                          }                          
                        }                                            
                      }  
                      else{
                        arr4[eventInnerArr].fieldSelectedValId = arr5[0].id;
                      }                    
                    }
                  }
                }
              }
            }            
           }                                             
          }                                             
         }        
        this.configData = itemsArr;
        console.log( this.configData)
        setTimeout(() => {
          this.rtLoading = false;
        }, 500);
      }       
    });      
  }   

  /**
   * Filter Expand/Collapse
   */
  expandAction() {
    this.expandFlag = this.expandFlag ? false : true;
  }

  applySearch(data) {
    let val = data.searchVal;
    console.log(val);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    this.rmHeight = headerHeight + 165;
    this.innerHeight = headerHeight + 153;    
  }

  eventChange(action,eventId,eventTypeIdArr,event){   

    if(action == 'column1-dd-single' || action == 'column1-dd-multiple'){
      let itemsArr = this.configData;
      let arr1, arr2, arr3, arr4, arr5;
      for(let item in itemsArr){   
        arr1 = itemsArr[item].events;    
        for(let events in arr1){ 
          if(arr1[events].eventId == eventId){            
            arr2 = arr1[events].eventsTypes;            
            for(let eventsTypes in arr2){ 
              arr3 = arr2[eventsTypes].eventArr;             
              for(let eventArr in arr3){ 
                if(Array.isArray(arr2[eventsTypes].eventSelectedValId)){
                  if(arr2[eventsTypes].eventSelectedValId[0] == arr3[eventArr].id ){  
                    arr4 = arr3[eventArr].eventInnerArr;               
                    for(let eventInnerArr in arr4){
                      arr4[eventInnerArr].fieldSelectedValId=[];                                                     
                    }
                  }
                }
                else{
                  if(arr2[eventsTypes].eventSelectedValId == arr3[eventArr].id){  
                    arr4 = arr3[eventArr].eventInnerArr;               
                    for(let eventInnerArr in arr4){
                      arr4[eventInnerArr].fieldSelectedValId=[];                                                     
                    }
                  }
                }  
              }            
            }  
          }                                           
        }                                             
      }
    }

    // change array 
    if(eventTypeIdArr){
      if(Array.isArray(eventTypeIdArr)){
        eventTypeIdArr = eventTypeIdArr;
      }
      else{
        eventTypeIdArr = Array.of(eventTypeIdArr);
      }
    }
    // change array 
    if(action == 'column2-input' || action == 'column1-toggle'){
    }
    else{
      if(event){
        if(Array.isArray(event)){
          event = event;
        }
        else{
          event = Array.of(event);
        }
      }
    } 
    

      this.editEscalationButtonEnable = true;
      console.log(action, eventId, eventTypeIdArr,event);   

      if(this.escalationMatrix_array.length>0)
      {
        let studentObj =  this.escalationMatrix_array.find(option => option.eventId == eventId);
        if(studentObj)
        {
            if(action == 'column1-dd-single'){
              this.escalationMatrix_array.find(option => option.eventId == eventId).eventTypeIdArr = event;
              this.escalationMatrix_array.find(option => option.eventId == eventId).fieldIdArr = [];
            }
            if(action == 'column1-dd-multiple'){
              this.escalationMatrix_array.find(option => option.eventId == eventId).eventTypeIdArr = event;
              this.escalationMatrix_array.find(option => option.eventId == eventId).fieldIdArr = [];
            }
            if(action == 'column1-toggle'){   
              let checkedVal = (event.checked) ? Array.of(1) :  Array.of(2) ; 
              this.escalationMatrix_array.find(option => option.eventId == eventId).eventTypeIdArr = checkedVal   
            }
            if(action == 'column2-dd-single'){
              this.escalationMatrix_array.find(option => option.eventId == eventId).fieldIdArr = event;
            }
            if(action == 'column2-dd-multiple'){
              this.escalationMatrix_array.find(option => option.eventId == eventId).fieldIdArr = event;
            }
            if(action == 'column2-input'){
              this.escalationMatrix_array.find(option => option.eventId == eventId).fieldVal = event;
            }   
        }
        else{
          let fieldVal = '';
          let fieldIdArr = [];
          if(action == 'column1-dd-single'){
            eventTypeIdArr = event;
          }
          if(action == 'column1-dd-multiple'){
            eventTypeIdArr = event;
          }
          if(action == 'column1-toggle'){
            let checkedVal = (event.checked) ? Array.of(1) :  Array.of(2) ; 
            eventTypeIdArr = checkedVal;   
          }
          if(action == 'column2-dd-multiple'){
            fieldIdArr = event;
          }
          if(action == 'column2-dd-single'){
            fieldIdArr = event;
          }
          if(action == 'column2-input'){
            fieldVal = event
          }
          this.escalationMatrix_array.push({
            eventId: eventId,
            eventTypeIdArr: eventTypeIdArr,
            fieldVal: fieldVal,
            fieldIdArr: fieldIdArr,
            userListArray: []
          });
        }
      }
      else{
          let fieldVal = '';
          let fieldIdArr = [];
          if(action == 'column1-dd-single'){
            eventTypeIdArr = event;
          }
          if(action == 'column1-dd-multiple'){
            eventTypeIdArr = event;
          }
          if(action == 'column1-toggle'){
            let checkedVal = (event.checked) ? Array.of(1) :  Array.of(2) ; 
            eventTypeIdArr = checkedVal;   
          }
          if(action == 'column2-dd-multiple'){
            fieldIdArr = event;
          }
          if(action == 'column2-dd-single'){
            fieldIdArr = event;
          }
          if(action == 'column2-input'){
            fieldVal = event
          }
          this.escalationMatrix_array.push({
            eventId: eventId,
            eventTypeIdArr: eventTypeIdArr,
            fieldVal: fieldVal,
            fieldIdArr: fieldIdArr,
            userListArray: []
          });
      }
      console.log(this.escalationMatrix_array);     

  }



}

