import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { BaseService } from 'src/app/modules/base/base.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  
    @Input() apiData: any = [];
    @Input() actionInfo: any = [];
    @Output() emitResponse: EventEmitter<any> = new EventEmitter();
   
    changePasswordForm: FormGroup;
    public invalidOldPwdMsg: string = "";
    public invalidMsgFlag = false;
    public strlengthforuser:string ='0';
    public NewCategoryNumberLenth:string ='30';
    public enterTxt: string = "Enter";
    public textcategoryName: string = "Category Name";
    public cpFormData = new FormData();
    public submitLoading: boolean = false;
    public submitFlag: boolean = false;
    public invalidMsg: String = "";
    public opwdFieldTextType: boolean = false;
    public npwdFieldTextType: boolean = false;
    public cpwdFieldTextType: boolean = false;
    public changPasswordSubmitted: boolean = false;
    public countryId;
    public emitData = {
      action: true,
      categoryAction: '',
      deleteStatus: '',
      msg: '',
      name: ''
    };
    public action;
    public actionId;
    public actionName;
    public categoryName;
    public deleteCategoryFlag: boolean = false;
    public checkboxFlag1: boolean = false;
    public checkboxFlag2: boolean = false;
    public noFilesFlag: boolean = false;
  
    constructor(
  
      private landingpageAPI: LandingpageService,
      private formBuilder: FormBuilder,
      private commonApi: CommonService,
      private authApi: AuthenticationService,
      private baseSerivce: BaseService,

    ) { 
  
  
      
    }
    get c() { return this.changePasswordForm.controls; }
    ngOnInit(): void {
  
      this.action = this.actionInfo['action'];
      if(this.actionInfo['action'] == 'delete' ){
        this.deleteCategoryFlag = true;
        this.checkboxFlag2 = true;
        if(this.actionInfo['count'] == 0){
          this.noFilesFlag = true;
        }
      }
      this.actionId = this.actionInfo['id'];
      this.actionName = this.actionInfo['name'];
      console.log(this.actionInfo)
  
      if(this.action == 'edit'){
        this.categoryName = this.actionName;
        this.strlengthforuser = this.categoryName.length;
      }
      else{
        this.categoryName = '';
      }
  
      if(!this.deleteCategoryFlag){
        this.changePasswordForm = this.formBuilder.group({
          categoryName: [this.categoryName, [Validators.required]],
        
        },
        {
          // check whether our password and confirm password match
          
        }); 
     }
      this.countryId = localStorage.getItem('countryId');
    }
  
    actionSubmit() {
      if(this.submitLoading || !this.submitFlag)
        return false;
  
      this.changPasswordSubmitted = true;
      let invalidFlag = true;
      let opwd = this.changePasswordForm.value.categoryName;     
  
      this.submitLoading = true;
      this.cpFormData.append('apiKey', this.apiData['apiKey']);
      this.cpFormData.append('userId', this.apiData['userId']);
      this.cpFormData.append('domainId', this.apiData['domainId']);
      this.cpFormData.append('countryId', this.countryId);
      this.cpFormData.append('categoryName', opwd.trim());
      if(this.actionInfo['action'] == 'edit'){
        this.cpFormData.append('categoryId', this.actionId);
        this.cpFormData.append('oldCategoryName',this.actionName.trim());
      }       
     
      this.authApi.apiSaveCategoryFolder(this.cpFormData).subscribe((response) => {
        console.log(response)
        let msg = response.result;
        let msgData = response.data;
        if(response.status == 'Success') {

          const apiData = new FormData();
          apiData.append('apiKey', this.apiData['apiKey']);
          apiData.append('domainId', this.apiData['domainId']);
          apiData.append('dataId', this.actionId);
          apiData.append('userId', this.apiData['userId']);
          apiData.append('action', 'categoryUpdate');
          apiData.append('actionType', '6');
          apiData.append('platform', '3');
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiData).subscribe((response: any) => { })
  
          if(msgData=='2')
          {
            this.submitLoading = false;
         
           
            this.invalidOldPwdMsg = msg;
          }
          else
          {
            this.invalidMsgFlag = false;
            this.invalidMsg = "";
            this.emitData.msg = msg;
            this.emitData.name = opwd;
            this.emitData.deleteStatus = '';
            this.emitData.categoryAction = this.actionInfo['action'];
            //this.emitData.msg = `<div class="msg-row-1 text-center">${msg}<p>Please login again</p></div>`;
            this.emitResponse.emit(this.emitData);
            setTimeout(() => {
           // this.requestPermission(0);
         
           // this.authApi.logout();
            },1000);
  
          }
  
         
        } else {
          this.submitLoading = false;
         
           
            this.invalidOldPwdMsg = msg;
          
        }
      });
    }
  
    actionDelete() {
      if(this.submitLoading)
        return false;
  
      let deleteStatus = this.checkboxFlag2 ? '2' : '1';
      this.emitData.categoryAction = this.action;
      this.emitData.deleteStatus = deleteStatus;
      
      this.submitLoading = true;
      this.cpFormData.append('apiKey', this.apiData['apiKey']);
      this.cpFormData.append('userId', this.apiData['userId']);
      this.cpFormData.append('domainId', this.apiData['domainId']);
      this.cpFormData.append('countryId', this.countryId);
      this.cpFormData.append('categoryId', this.actionId);
      this.cpFormData.append('categoryName',this.actionName.trim());    
      this.cpFormData.append('deleteStatus',deleteStatus);    
     
      this.authApi.apiSaveCategoryFolder(this.cpFormData).subscribe((response) => {
        console.log(response)
        let msg = response.result;
        let msgData = response.data;
        
        if(response.status == 'Success') {

          const apiData = new FormData();
          apiData.append('apiKey', this.apiData['apiKey']);
          apiData.append('domainId', this.apiData['domainId']);
          apiData.append('dataId', this.actionId);
          apiData.append('userId', this.apiData['userId']);
          if(deleteStatus == '2'){
            apiData.append('action', 'categoryDelete');
          }
          else{
            let deleteIds = response.modelResultDocs;
            apiData.append('modelResultDocs', JSON.stringify(deleteIds));
            apiData.append('action', 'categoryUpdate');
          }
          apiData.append('actionType', '6');
          apiData.append('platform', '3');
          apiData.append('deleteStatus', '2');
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiData).subscribe((response: any) => { })

          if(msgData=='2')
          {
            this.submitLoading = false;
            this.invalidOldPwdMsg = msg;
          }
          else
          {
            this.invalidMsgFlag = false;
            this.invalidMsg = "";
            this.emitData.msg = msg;          
            this.emitResponse.emit(this.emitData);
            setTimeout(() => {
              // this.requestPermission(0);
              // this.authApi.logout();
            },1000);
          }
        } else {
          this.submitLoading = false;
          this.invalidOldPwdMsg = msg;
        }
      });
    }
  
    categorycreatevalidate(event)
    {
      let val = event.target.value.trim();
      if(val.length>0)
      {
        this.invalidOldPwdMsg="";
        this.changPasswordSubmitted = true;
        this.strlengthforuser=event.target.value.length;
        this.submitFlag = true;  
      }
      else
      {
        this.submitFlag = false;  
        this.strlengthforuser='0';
        this.changPasswordSubmitted = false;
      }
    }
   
    cancelAction() {
      if(this.submitLoading)
        return false;
  
      this.emitData.action = false;
      this.emitData.categoryAction = 'cancel';
      this.emitData.deleteStatus = '';
      this.emitResponse.emit(this.emitData);
    }
  
    
    checkboxChange(flag, type){    
      if(type == 'type1'){
        this.checkboxFlag1 = flag ? false : true;  
        this.checkboxFlag2 =  this.checkboxFlag1 ? false : true;
      }
      else{
        this.checkboxFlag2 = flag ? false : true;  
        this.checkboxFlag1 =  this.checkboxFlag2 ? false : true;    
      }    
    }
  
  }
  