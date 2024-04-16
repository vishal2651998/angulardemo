import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { ProductMatrixService } from "../../../services/product-matrix/product-matrix.service";
import { retry } from 'rxjs/operators';
import { FormControl } from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { BaseService } from 'src/app/modules/base/base.service';
@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit {
  @Input() apiData: any = [];
  @Input() actionInfo: any = [];
  @Output() emitResponse: EventEmitter<any> = new EventEmitter();

  changePasswordForm: FormGroup;
  public invalidOldPwdMsg: string = "";
  public invalidMsgFlag = false;
  public strlengthforuser:string ='0';
  public NewFolderNumberLenth:string ='30';
  public enterTxt: string = "Enter";
  public textfolderName: string = "Folder Name";
  public cpFormData = new FormData();
  public submitLoading: boolean = false;
  public submitFlag: boolean = false;
  public invalidMsg: String = "";
  public opwdFieldTextType: boolean = false;
  public npwdFieldTextType: boolean = false;
  public cpwdFieldTextType: boolean = false;
  public changPasswordSubmitted: boolean = false;
  public countryId;
  public allSelection: any;
  public emitData = {
    action: true,
    folderAction: '',
    deleteStatus: '',
    msg: '',
    name: '',
    wslist: [],
    refresh: '0'
  };
  public action;
  public actionId;
  public actionName;
  public actionWSID: any = [];
  public folderName;
  public deleteFolderFlag: boolean = false;
  public checkboxFlag1: boolean = false;
  public checkboxFlag2: boolean = false;
  public noFilesFlag: boolean = false;
  public platformId: string;
  public workstreamItems: any = [];
  public workstreamId: any = [];
  public workstreamIdOriginal: any = [];
  public workstreamSelection: any = [];
  public workstreamValid: boolean = true;
  public defaultWSLabel: string = 'Select Workstream';
  public workstreamUpdate: boolean = false;
  public workstreamEdit: boolean = false;
  public workstreamDelete: boolean = false;
  public workstreamDeleteArr: any = [];
  public allworkstreamToggle: boolean = false;
  public toggleOptionShow: boolean = false;
  public showAllWS: boolean = true;
  constructor(
    public activeModal: NgbActiveModal,
    private landingpageAPI: LandingpageService,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private authApi: AuthenticationService,
    private ProductMatrixApi: ProductMatrixService,
    private documentationService: DocumentationService,
    private baseSerivce: BaseService,
  ) {



  }
  get c() { return this.changePasswordForm.controls; }
  ngOnInit(): void {
    this.platformId=localStorage.getItem('platformId');
    this.action = this.actionInfo['action'];
    if(this.actionInfo['action'] == 'delete' ){
      this.deleteFolderFlag = true;
      this.checkboxFlag2 = true;
      if(this.actionInfo['count'] == 0){
        this.noFilesFlag = true;
      }
    }
    this.actionId = this.actionInfo['id'];
    this.actionName = this.actionInfo['name'];
    this.actionWSID = this.actionInfo['workstreamsList'];



    console.log(this.actionInfo)

    if(this.action == 'edit'){
      this.folderName = this.actionName;
      this.strlengthforuser = this.folderName.length;
      this.workstreamId  = this.actionWSID;
      this.workstreamIdOriginal = this.actionWSID;
    }
    else{
      this.folderName = '';
      this.workstreamId = '';
    }

    // toggle option
    /*this.toggleOptionShow = this.apiData['domainId'] == "97" ? true : false;
    if(this.toggleOptionShow){
      this.showAllWS = false;
      //this.allworkstreamToggle = true;
    }
    else{
      this.showAllWS = true;
    }*/

    if(this.toggleOptionShow){
      if(!this.deleteFolderFlag){
        this.changePasswordForm = this.formBuilder.group({
          folderName: [this.folderName, [Validators.required]],
          wsFormControl: [this.workstreamId, []],
          wsAllFormControl: [this.allworkstreamToggle, []]
        },
        {
          // check whether our password and confirm password match

        });
      }
    }
    else{
      if(!this.deleteFolderFlag){
          this.changePasswordForm = this.formBuilder.group({
            folderName: [this.folderName, [Validators.required]],
            wsFormControl: [this.workstreamId, []]
          },
          {
            // check whether our password and confirm password match

          });
      }

    }

    this.countryId = localStorage.getItem('countryId');
    this.getWorkstreamLists();

  }

  actionSubmit() {
    if(this.submitLoading || !this.submitFlag || this.workstreamValid)
      return false;

    this.changPasswordSubmitted = true;
    let invalidFlag = true;
    let opwd = this.changePasswordForm.value.folderName;

    let wsid = [];
    wsid = this.workstreamId;
    let wsidArry = '';
    if(this.workstreamId.length>0){
      wsidArry = JSON.stringify(this.workstreamId);
    }
    let dwsidArry = '';
    if(this.action == 'edit'){/* remove once workstreams came
      let arr1 = JSON.parse(localStorage.getItem('workstreamsList'));
      let arr2 = this.workstreamId
      let difference = arr1.filter(x => !arr2.includes(x));
      console.log(difference);

      let arr11 = JSON.parse(localStorage.getItem('workstreamsList'));
      let arr21 = this.workstreamId
      let difference11 = arr21.filter(x => !arr11.includes(x));
      console.log(difference11);

      this.workstreamDeleteArr = difference;
      if(difference.length>0 || difference11.length>0){
        this.workstreamUpdate = true;
      }
      if(this.workstreamDeleteArr.length>0){
        dwsidArry = JSON.stringify(this.workstreamDeleteArr);
      }*/
    }

    console.log("Add Array"+wsidArry);
    console.log("delete Array"+dwsidArry);

    this.submitLoading = true;
    this.cpFormData = new FormData();
    this.cpFormData.append('apiKey', this.apiData['apiKey']);
    this.cpFormData.append('userId', this.apiData['userId']);
    this.cpFormData.append('domainId', this.apiData['domainId']);
    this.cpFormData.append('countryId', this.countryId);
    this.cpFormData.append('folderName', opwd.trim());
    this.cpFormData.append('workstreams', wsidArry);
    if(this.actionInfo['action'] == 'edit'){
      this.cpFormData.append('folderId', this.actionId);
      this.cpFormData.append('oldFolderName',this.actionName.trim());
    }
    if(this.workstreamUpdate && this.action == 'edit'){
      this.cpFormData.append('workstreamUpdate',"1");
    }
    if(this.workstreamDeleteArr.length>0 && this.action == 'edit'){
      this.cpFormData.append('removedWorkstreams',dwsidArry);
    }

    this.authApi.apiSaveDocumentFolder(this.cpFormData).subscribe((response) => {
      console.log(response)
      let msg = response.result;
      let msgData = response.data;
      if(response.status == 'Success') {

        if(this.action != 'edit' && this.action != 'delete'){
          if(this.workstreamId.length>0){
            localStorage.setItem('workstreamsList',wsidArry);
          }
        }

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
          this.emitData.wslist = wsid;
          if(this.workstreamEdit){
            this.emitData.refresh = "1";
          }
          this.emitData.deleteStatus = '';
          this.emitData.folderAction = this.actionInfo['action'];
          //this.emitData.msg = `<div class="msg-row-1 text-center">${msg}<p>Please login again</p></div>`;
          this.emitResponse.emit(this.emitData);
          setTimeout(() => {
         // this.requestPermission(0);

         // this.authApi.logout();
          },1000);

        }
        if(this.actionInfo['action'] == 'edit'){
          const apiData = new FormData();
          apiData.append('apiKey', this.apiData['apiKey']);
          apiData.append('domainId', this.apiData['domainId']);
          apiData.append('dataId', this.actionId);
          apiData.append('userId', this.apiData['userId']);
          apiData.append('action', 'folderUpdate');
          apiData.append('actionType', '2');
          apiData.append('platform', '3');
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiData).subscribe((response: any) => { })
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
    this.emitData.folderAction = this.action;
    this.emitData.deleteStatus = deleteStatus;

    this.submitLoading = true;
    this.cpFormData = new FormData();
    this.cpFormData.append('apiKey', this.apiData['apiKey']);
    this.cpFormData.append('userId', this.apiData['userId']);
    this.cpFormData.append('domainId', this.apiData['domainId']);
    this.cpFormData.append('countryId', this.countryId);
    this.cpFormData.append('folderId', this.actionId);
    this.cpFormData.append('folderName',this.actionName.trim());
    this.cpFormData.append('deleteStatus',deleteStatus);

    this.authApi.apiSaveDocumentFolder(this.cpFormData).subscribe((response) => {
      console.log(response)
      let msg = response.result;
      let msgData = response.data;
      let deleteIds = response.modelResultDocs;
      if(response.status == 'Success') {

        if(deleteStatus == '1'){
          const apiData = new FormData();
          apiData.append('apiKey', this.apiData['apiKey']);
          apiData.append('domainId', this.apiData['domainId']);
          apiData.append('dataId', this.actionId);
          apiData.append('userId', this.apiData['userId']);
          apiData.append('modelResultDocs', JSON.stringify(deleteIds));
          apiData.append('isGeneral', '1');
          apiData.append('action', 'folderUpdate');
          apiData.append('actionType', '2');
          apiData.append('platform', '3');
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiData).subscribe((response: any) => { })
       }
       if(deleteStatus == '2'){
          const apiData = new FormData();
          apiData.append('apiKey', this.apiData['apiKey']);
          apiData.append('domainId', this.apiData['domainId']);
          apiData.append('dataId', this.actionId);
          apiData.append('userId', this.apiData['userId']);
          apiData.append('action', 'folderDelete');
          apiData.append('actionType', '2');
          apiData.append('platform', '3');
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiData).subscribe((response: any) => { })
       }

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

  foldercreatevalidate(event)
  {
    if(event.target.value.trim()!='')
    {
      this.invalidOldPwdMsg="";
      this.changPasswordSubmitted = true;
      this.strlengthforuser=event.target.value.length;
      this.submitFlag = true;
      if(this.workstreamId.length>0 || this.allworkstreamToggle){
        this.workstreamValid = false;
      }
    }
    else
    {
      this.submitFlag = false;
      this.strlengthforuser='0';
      this.changPasswordSubmitted = false;
    }
  }

  cancelAction() {
    if(this.action == 'edit'){

      this.actionId = this.actionInfo['id'];
      this.actionName = this.actionInfo['name'];

      this.folderName = this.actionName;
      this.strlengthforuser = this.folderName.length;
      this.workstreamId  = this.workstreamIdOriginal;
      this.workstreamIdOriginal = this.workstreamIdOriginal;

      this.emitData.name = this.folderName;
      this.emitData.wslist = this.actionWSID;

      this.emitData.action = false;
      this.emitData.folderAction = 'cancel';
      this.emitData.deleteStatus = '';

      this.emitResponse.emit(this.emitData);
    }
    else{
      if(this.submitLoading)
      return false;
      this.emitData.action = false;
      this.emitData.folderAction = 'cancel';
      this.emitData.deleteStatus = '';
      this.emitResponse.emit(this.emitData);
    }

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

  // Get Workstream Lists
  getWorkstreamLists() {
    let type: any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append("type", type);

    this.ProductMatrixApi.getWorkstreamLists(apiFormData).subscribe(
      (response) => {
        let resultData = response.workstreamList;

        //let alls = {id: "0", name: "All"};
        let data = response.allSelection != undefined ? response.allSelection : '';

        this.allSelection = this.showAllWS  ? data : '';

        this.workstreamItems= [];
        for (let ws of resultData) {
          this.workstreamItems.push({
            id: ws.id,
            name: ws.name,
          });
        }
        if(this.allSelection!=''){
          this.workstreamItems.unshift(this.allSelection);
        }
        if(this.action == 'edit'){
          let wsIndex;
          this.workstreamId = JSON.parse(localStorage.getItem('workstreamsList'));
          console.log(this.workstreamId)
          if(this.workstreamId.length>0){
          wsIndex = this.workstreamId.findIndex(option => option == '0');
          }
          this.changePasswordForm.get('wsFormControl').reset();
          this.workstreamSelection = [];
          if(wsIndex!='0'){
            for(let ws of this.workstreamItems) {
              for(let wss of this.workstreamId ) {
                if(ws.id == wss){
                  this.workstreamSelection.push({
                    id: ws.id,
                    name: ws.name,
                  });
                }
              }
            }
          }
          else{
            if(this.workstreamItems.length == this.workstreamId.length || wsIndex == '0'){
              for(let ws of this.workstreamItems) {
                this.workstreamId.push(ws.id);
              }
              if(this.allSelection!=''){
                this.workstreamSelection.unshift(this.allSelection);
              }
            }
          }
          this.changePasswordForm.get('wsFormControl').patchValue(this.workstreamId);
          if(this.workstreamSelection.length>0){
            this.workstreamValid = false;
          }
          else{
            this.workstreamValid = true;
          }
        }
        else{
          this.workstreamId = [];
          this.workstreamSelection = [];
        }
      }
    );
  }
  //
  selectedItems(event){ console.log(event)
    let arr = event.value;
    let uniqueArr = [];
    for(let i of arr) {
      if(uniqueArr.indexOf(i) === -1) {
          uniqueArr.push(i);
      }
    }
    console.log(uniqueArr);
    event.value = uniqueArr;
    this.workstreamId = [];
    this.workstreamSelection = [];

    if(event.itemValue == '0'){
      const index = event.value.indexOf(event.itemValue);
      console.log(index);
      if (index > -1 ){
        for(let ws of this.workstreamItems) {
          this.workstreamId.push(ws.id);
        }
        if(this.allSelection!=''){
          this.workstreamSelection.unshift(this.allSelection);
        }
      }
      else{
        this.workstreamId = [];
        this.workstreamSelection = [];
      }
    }
    else{ console.log(event.itemValue);
      if(event.itemValue == undefined){
        this.workstreamId = event.value;
        if(this.workstreamId.length>0){
          if(this.allSelection!=''){
            this.workstreamSelection.unshift(this.allSelection);
          }
        }
        else{
          this.workstreamId = [];
          this.workstreamSelection = [];
        }
      }
      else{
        this.workstreamId = event.value;
        const index = event.value.indexOf('0');
        if (index > -1) {
          this.workstreamId.splice(index, 1);
        }
        for(let ws of this.workstreamItems) {
          for(let wss of this.workstreamId ) {
            if(ws.id == wss){
              this.workstreamSelection.push({
                id: ws.id,
                name: ws.name,
              });
            }
          }
        }
      }
    }
    setTimeout(() => {
      this.changePasswordForm.get('wsFormControl').patchValue(this.workstreamId);
    }, 1);
    if(this.workstreamSelection.length>0){
      this.workstreamEdit = true;
      this.workstreamValid = false;
      if(this.changePasswordForm.value.folderName!=''){
        this.submitFlag = true;
      }
    }
    else{
      this.workstreamValid = true;
    }

  }
  // Disable Workstreams Selection
  disableWSSelection(id){
    this.workstreamDelete = true;
    this.workstreamEdit = true;
    for (let wss in this.workstreamSelection ) {
      if(id == this.workstreamSelection[wss].id){
        if(this.workstreamSelection[wss].id == '0'){
          this.workstreamSelection = [];
          this.workstreamId = [];
        }
        else{
          this.workstreamSelection.splice(wss, 1);
        }
      }
    }
    const index1 = this.workstreamId.indexOf(id);
    if (index1 > -1) {
      this.workstreamId.splice(index1, 1);
    }
    setTimeout(() => {
      this.changePasswordForm.get('wsFormControl').patchValue(this.workstreamId);
    }, 1);
    if(this.workstreamSelection.length>0){
      this.workstreamValid = false;
      if(this.changePasswordForm.value.folderName.length>0){
        this.submitFlag = true;
      }
    }
    else{
      this.workstreamValid = true;
    }
  }

  onChangeAll(event) {
    this.workstreamSelection = [];
    this.changePasswordForm.get('wsFormControl').reset();
    if (event.checked) {
      this.allworkstreamToggle = true;
    }
    else {
      this.allworkstreamToggle = false;
    }
    if(this.workstreamId.length>0 || this.allworkstreamToggle){
      this.workstreamValid = false;
      if(this.changePasswordForm.value.folderName.length>0){
        this.submitFlag = true;
      }
    }
    else{
      this.workstreamValid = true;
    }
  }
}
