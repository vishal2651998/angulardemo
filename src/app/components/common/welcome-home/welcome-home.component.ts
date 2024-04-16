import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserDashboardService } from '../../../services/user-dashboard/user-dashboard.service';
import { PlatFormNames } from "src/app/common/constant/constant";
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserComponent } from '../manage-user/manage-user.component';
import { NonUserComponent } from '../non-user/non-user.component';

@Component({
  selector: 'app-welcome-home',
  templateUrl: './welcome-home.component.html',
  styleUrls: ['./welcome-home.component.scss']
})
export class WelcomeHomeComponent implements OnInit {

  @Input() data; 
  @Input() inviteUser;
  @Output() startedNextResponce: EventEmitter<any> = new EventEmitter();
  public loading: boolean = false;  
  public startedButtonFlag: boolean = false;
  public platformName = "Collabtic";
  public newAccountSetup: boolean = false;
  public addForm1: FormGroup; 
  public addForm2: FormGroup; 
  public industry;
  public serverError: boolean = false;
  public serverErrorMsg: string = '';
  public displayData;
  public plaformText;
  public businessSetup = [];
  public industryTypeList = [];
  public businessType: string = '';
  public industryType: string = '';
  public industryInputFlag: boolean = false;
  public industryId: string = '';
  public loading1:boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public bodyClass:string = "select-industry";
  public bodyElem;
  public multipleEmail: string[];
  public modalRef1;
  public inviteMemberFlag: boolean = false;
  public openIndustryPopup: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userDashboardApi: UserDashboardService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public activeModal: NgbActiveModal,  
  ) { }

  ngOnInit(): void {
    this.inviteUser = this.inviteUser ? true : false;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.platformName = localStorage.getItem('platformName');
    let platformId= localStorage.getItem('platformId');
    if(platformId!='1')
    {
      this.plaformText =  PlatFormNames.MahleForum;
    }
    else{
      this.plaformText =  PlatFormNames.Collabtic;
    }

    console.log(this.data); 
    this.newAccountSetup = this.data['newAccountSetup'] ? true : false;

    if(this.newAccountSetup){
      this.addForm1 = this.formBuilder.group({
        industry: ['', [Validators.required]],
        emails : ['']       
      }); 
      this.loadDataBusinessData();     
      
    }
    if(this.inviteUser){
      this.inviteMemberFlag = false;
      this.addForm2 = this.formBuilder.group({
        emails : ['']       
      }); 
    }


  }

  loadDataBusinessData(){
    this.loading = true
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.data['apiKey']);
    apiFormData.append('userId', this.data['userId']);
    apiFormData.append('domainId', this.data['domainId']);
    apiFormData.append('countryId', this.data['countryId']);
    this.authenticationService.newBusinessSetup(apiFormData).subscribe((response) => {
      if(response.status=="Success"){        
        console.log(response);
        this.displayData = response.items;
        let businessList = this.displayData.businessSetup;
        for(let res in businessList) {
          if(businessList[res].id == '1'){
            //businessList[res].selectedFlag = true;
            businessList[res].selectedFlag = false;
          }
          else{
            businessList[res].selectedFlag = false;
          }
        }
        this.businessSetup = businessList;
        console.log(this.businessSetup); 
        this.industryTypeList = this.displayData['industryTypeList'];        
        //setTimeout(() => {
          this.loading = false;
        //}, 1000);
      }    
    });  
  }

  startedNext(){
    this.startedButtonFlag = true
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.data['apiKey']);
    apiFormData.append('userId', this.data['userId']);
    apiFormData.append('domainId', this.data['domainId']);
    apiFormData.append('countryId', this.data['countryId']);
    apiFormData.append('popupVerified', '1');
    this.userDashboardApi.UpdateUserScrollPopup(apiFormData).subscribe((response) => {
    if(response.status=="Success"){
      localStorage.setItem('welcomePopupDisplay','1');
      this.startedNextResponce.emit(true); 
    }    
   });  
  }

  selectBusinessSetup(id,index){
    for(let res in this.businessSetup) {
      this.businessSetup[res].selectedFlag = false;
      if(res == index){
        this.businessSetup[index].selectedFlag = true;
        this.businessType = id;
      }           
    }    
    if(this.businessType != '' && this.industryId!= ''){
      this.industryInputFlag = true;
    }    
  }

  // selected industry
  selectedType(){ 
    if(!this.openIndustryPopup){
    this.openIndustryPopup = true;
    let data = {
      id: this.industryId,
      name: this.industry,
    } 
    let innerHeight = window.innerHeight;
    this.bodyElem.classList.add(this.bodyClass);
    setTimeout(() => {
      const modalRef = this.modalService.open(ManageUserComponent, this.modalConfig);      
      modalRef.componentInstance.access = 'tvsssoDealer';
      modalRef.componentInstance.height = innerHeight;
      modalRef.componentInstance.action = 'get';       
      modalRef.componentInstance.accessTitle = 'Select Industry';      
      modalRef.componentInstance.apiData = this.industryTypeList;        
      modalRef.componentInstance.selectedUsers = data;
      modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
        console.log(receivedService);
        if(!receivedService.empty){       
          let data = receivedService;
          console.log(data.id);
          console.log(data.name);
          this.industryId = data.id;
          this.industry = data.name; 
          if(this.businessType != '' && this.industryId != ''){
            this.industryInputFlag = true;
          }                 
        }    
        this.openIndustryPopup = false;                      
        modalRef.dismiss('Cross click');
        this.bodyElem.classList.remove(this.bodyClass);
      }); 
    }, 1);
    }
  }

  saveBusinessSetup(){
    this.serverErrorMsg = '';
    this.serverError = false;   
    
    if(this.industryId != '' && this.businessType != '' ){
      this.loading1 = true;    
      if(this.multipleEmail != undefined){
        if(this.multipleEmail.length>0){         
          this.activeModal.dismiss('Cross click'); 
          this.inviteMembers();
        } 
        else{         
          this.activeModal.dismiss('Cross click');           
          this.saveBusinessOptions();
        }       
      }
      else{         
        this.activeModal.dismiss('Cross click');           
        this.saveBusinessOptions();
      }
    }
    else{
      this.loading1 = false;
    }    
            
  }

  inviteMembers(){    
    this.showPOPUP('step1','Sending invitation mail..');
    let emails = JSON.stringify(this.multipleEmail);
    const apiFormData = new FormData();   
    apiFormData.append('apiKey', this.data['apiKey']);
    apiFormData.append('userId', this.data['userId']);
    apiFormData.append('domainId', this.data['domainId']);
    apiFormData.append('countryId', this.data['countryId']);
    apiFormData.append('inviteEmails', emails);

   // new Response(apiFormData).text().then(console.log);

    this.authenticationService.businessInviteNewMembers(apiFormData).subscribe(
      response => {
        console.log(response);           
        if(response.status == 'Success'){ // set 1     
          console.log(response); 
          setTimeout(() => {  
            this.modalRef1.dismiss('Cross click');                  
            this.saveBusinessOptions();
          }, 3000);          
        }           
        else {
          this.modalRef1.dismiss('Cross click');   
          this.loading1 = false;
          this.serverErrorMsg = response.message;
          this.serverError = true;
        }
      },
      error => {
        this.modalRef1.dismiss('Cross click');   
        this.loading1= false;
        this.serverErrorMsg = error;
        this.serverError = true;        
      }
    );
  } 
  saveBusinessOptions(){     
    this.showPOPUP('step2','Please wait. Configurating Product Matrix..'); 
    const apiFormData = new FormData();   
    apiFormData.append('apiKey', this.data['apiKey']);
    apiFormData.append('userId', this.data['userId']);
    apiFormData.append('domainId', this.data['domainId']);
    apiFormData.append('countryId', this.data['countryId']);
    apiFormData.append('industryType', this.industryId);
    apiFormData.append('businessType', this.businessType);
    new Response(apiFormData).text().then(console.log);    
    this.authenticationService.saveBusinessOptions(apiFormData).subscribe(
      response => {
        console.log(response);           
        if(response.status == 'Success'){ // set 1     
          console.log(response);                     
          if(response.productMatrix == '1'){
            this.modalRef1.dismiss('Cross click');   
            this.showPOPUP('step4',response.result);
          }
          else{     
            this.modalRef1.dismiss('Cross click');        
            this.showPOPUP('step3',response.result);
          }            
        }           
        else {
          this.modalRef1.dismiss('Cross click');   
          this.loading1 = false;
          this.serverErrorMsg = response.message;
          this.serverError = true;
        }
      },
      error => {
        this.modalRef1.dismiss('Cross click');   
        this.loading1= false;
        this.serverErrorMsg = error;
        this.serverError = true;        
      });
   }

   // sending invite
   showPOPUP(step,message){  
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.remove('welcomepopup');
    this.bodyElem.classList.remove('welcomepopupNewSign');
    this.bodyElem.classList.remove('auth-bg');
    this.bodyElem.classList.add('auth');    
    this.modalRef1 = this.modalService.open(NonUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    this.modalRef1.componentInstance.okButtonDisable = true;
    this.modalRef1.componentInstance.newSignupSetup = true;
    this.modalRef1.componentInstance.accessType = step;
    this.modalRef1.componentInstance.message = message;
    this.modalRef1.componentInstance.nonuserResponce.subscribe((receivedService) => {
      if (receivedService) {
        this.modalRef1.dismiss('Cross click');
        this.bodyElem.classList.remove('auth');
        this.startedNextResponce.emit(receivedService);
      }
    });
}
addedEmail(event) {
  if(event.value != undefined){
    if(event.value.length>0){
      this.inviteMemberFlag = true;
      this.serverErrorMsg = '';
      this.serverError = false;      
      if(!this.validateEmail(event.value)) {
        this.inviteMemberFlag = false;
        this.serverError = true;
        this.serverErrorMsg = event.value + ' is not a valid mail address';
        //this.multipleEmail.pop();  
      }
    }
    else{
      this.inviteMemberFlag = false;
    }
  }
}
removedEmail(event){
  console.log(event)
  this.serverErrorMsg = '';
  this.serverError = false;
  console.log(this.multipleEmail);

  if(this.inviteUser){
    if(this.multipleEmail != undefined){
      if(this.multipleEmail.length>0){
        this.inviteMemberFlag = true;
      }
      else{
        this.inviteMemberFlag = false;
      }
    }
  }
  
  /*let eaddress = [];
  for(let email of this.multipleEmail){
    console.log(email);
    if(!this.validateEmail(email)) {
      this.inviteMemberFlag = false;
      this.serverError = true;
      eaddress.push(email);
      this.serverErrorMsg = eaddress + ' is not a valid mail address';
      //this.multipleEmail.pop();  
    }
  } 
  this.inviteMemberFlag = this.serverError ? false : true;
  */
}
validateEmail(email) {
   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
}

inviteMembersUBoard(){
  let emails = JSON.stringify(this.multipleEmail);
  const apiFormData = new FormData();   
  apiFormData.append('apiKey', this.data['apiKey']);
  apiFormData.append('userId', this.data['userId']);
  apiFormData.append('domainId', this.data['domainId']);
  apiFormData.append('countryId', this.data['countryId']);
  apiFormData.append('inviteEmails', emails);
  apiFormData.append('fromUser', '1');

  //new Response(apiFormData).text().then(console.log);

  this.authenticationService.businessInviteNewMembers(apiFormData).subscribe(
    response => {
      console.log(response);           
      if(response.status=="Success"){
        localStorage.setItem('welcomePopupDisplay','1');
        this.startedNextResponce.emit(response); 
      } 
    },
    error => {
      this.startedNextResponce.emit(false);  
      console.log(error)       
    }
  );
} 

saveUsers(){
  this.serverErrorMsg = '';
  this.serverError = false;   
  
  if(this.multipleEmail != undefined){
    if(this.multipleEmail.length>0){
      
      let eaddress = [];
      for(let email of this.multipleEmail){
        console.log(email);
        if(!this.validateEmail(email)) {
          this.inviteMemberFlag = false;
          this.serverError = true;
          eaddress.push(email);
          this.serverErrorMsg = eaddress + ' is not a valid mail address';          
          //this.multipleEmail.pop();  
        }
      } 

      setTimeout(() => {
        if(!this.serverError){
          this.inviteMembersUBoard();
        }
        else{
          return false;
        }
      }, 1);
       

    }
  }


}
}
   
