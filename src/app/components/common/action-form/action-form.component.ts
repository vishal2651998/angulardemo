import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { GtsService } from '../../../services/gts/gts.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent implements OnInit {

  @Input() access;
  @Input() apiData;
  @Input() actionInfo;
  @Input() contentType: string = "";
  @Output() dtcAction: EventEmitter<any> = new EventEmitter();

  public title: string = "";
  public action: string = "";
  public actionId: any = "";
  public resId: any = 0;
  public actionName: string = "";
  public actionDescVal: string = "";
  public mediaFlag: boolean = false;
  public uploadFlag: boolean = false;
  public updateCheckFlag: boolean = true;
  public deleteCheckFlag: boolean = false;
  public actionWSID: any = [];

  actionForm: FormGroup;
  dtcForm: FormGroup;
  public placehoder: string = "";
  public errTxt: string = "";
  public dtcErrTxt: string = "";

  public initLoading: boolean = true;
  public actionSubmitted: boolean = false;
  public dtcSubmitted: boolean = false;
  public dtcFlag: boolean = false;

  public actionFormFlag: boolean;
  public createFolder: boolean = false;
  public createCategory: boolean = false;

  typeFormData = new FormData();
  dtcFormData = new FormData();
  mfgFormData = new FormData();
  ecuFormData = new FormData();

  public nameCheckFlag: any = null;
  public nameExistFlag: boolean = false;
  public dtcCheckFlag: any = null;
  public dtcExistFlag: boolean = false;

  public ws = [];
  public vehicle: string = "";
  public checkAction: any = 1;
  public manageAction: any = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private gtsApi: GtsService
  ) { }

  // convenience getters for easy access to form fields
  get c() { return this.actionForm.controls; }
  get d() { return this.dtcForm.controls; }

  ngOnInit() {
    this.action = this.actionInfo['action'];
    this.actionId = this.actionInfo['id'];
    this.actionName = this.actionInfo['name'];
    this.actionWSID = this.actionInfo['workstreamsList'];
    console.log(this.actionInfo)

    this.actionForm = this.formBuilder.group({
      name: [this.actionName, [Validators.required]]
    });

    this.dtcForm = this.formBuilder.group({
      code: [this.actionName, [Validators.required]],
      desc: [this.actionDescVal, []]
    });

    let action = (this.action == 'new') ? 'New' : 'Edit';
    console.log(this.access)
    switch(this.access) {
      case 'ECU Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} ECU Type`; 
        this.placehoder = "ECU Type";
        this.errTxt = "ECU Type is required";
        break;
      case 'MFG Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} MFG Type`;
        this.placehoder = "MFG Type";
        this.errTxt = "MFG is required";
        break;
      case 'DTC Creation':
        this.dtcFlag = true;
        this.title = `${this.action.toUpperCase()} DTC Code`;
        this.placehoder = "DTC Code";
        this.errTxt = "DTC Code is required";
        this.actionName = this.actionInfo['id'];
        this.actionDescVal = this.actionInfo['name'];
        break;
      case 'Type Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} Part Type`;
        this.placehoder = "Part Type";
        this.errTxt = "Part Type is required";
        break;
      case 'Catg Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} Problem Category`;
        this.placehoder = "Problem Category Name";
        this.errTxt = "Problem Category Name is required";
        break;
      case 'System Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} System`;
        this.placehoder = "System";
        this.errTxt = "System is required";
        break;
      case 'Assembly Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} Part Assembly`;
        this.placehoder = "Part Assembly";
        this.errTxt = "Part Assembly is required";
        break;
      case 'Change Password':
        this.actionFormFlag = false;
        this.title = this.access;
        break;
      case 'New Folder':
      case 'Edit Folder':
      case 'Delete Folder':
        this.actionFormFlag = false;
        this.createFolder=true;
        this.title = this.access;
        if(this.access == 'Delete Folder'){
          this.title = this.title+" - "+this.actionName;
        }
        break;
      case 'New Category':
      case 'Edit Category':
      case 'Delete Category':
        this.actionFormFlag = false;
        this.createCategory=true;
        this.title = this.access;
        if(this.access == 'Delete Category'){
          this.title = this.title+" - "+this.actionName;
        }
        break;
      case 'Remove Media':
      case 'Delete Media':
        this.mediaFlag = true;
        this.title = this.actionInfo.title; 
        break;
      case 'Upload Module':
      case 'Upload Section':
      case 'Upload Adas':  
      case 'Upload Customer':
      case 'Upload Shops':
        this.uploadFlag = true;
        this.title = this.access;
        break;
    }

    //setTimeout(() => {
      this.initLoading = false;
    //}, 1500);

    if(this.actionFormFlag && this.actionName != '') {
      this.onNameChange(this.actionName);
    }
  }

  // Name Change
  onNameChange(val) {
	  if(val.length > 0) {      
      this.checkName(val);
    } else {
      this.nameExistFlag = false;
    }
  }

    // DTC Code Change
    onCodeChange(val) {
      if(val.length > 0) {      
        this.checkName(val);
      } else {
        this.dtcExistFlag = false;
      }
    }
    
  
  // Check Name Exists
  checkName(val) {
    this.actionName = val;
    switch(this.access) {
      case 'ECU Creation':
        this.ecuFormData = new FormData();
        this.ecuFormData.append('apiKey', this.apiData['apiKey']);
        this.ecuFormData.append('domainId', this.apiData['domainId']);
        this.ecuFormData.append('userId', this.apiData['userId']);
        this.ecuFormData.append('workstreamList', JSON.stringify(this.ws));
        this.ecuFormData.append('vehicleInfo', this.vehicle);
        this.ecuFormData.append('ecuName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.ecuAction('check');
        } else {
          this.ecuAction('check');
        }
        break;
      case 'MFG Creation':
        this.mfgFormData = new FormData();
        this.mfgFormData.append('apiKey', this.apiData['apiKey']);
        this.mfgFormData.append('domainId', this.apiData['domainId']);
        this.mfgFormData.append('userId', this.apiData['userId']);
        this.mfgFormData.append('workstreamList', JSON.stringify(this.ws));
        this.mfgFormData.append('vehicleInfo', this.vehicle);
        this.mfgFormData.append('mfgName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.mfgAction('check');
        } else {
          this.mfgAction('check');
        }
        break;
      case 'DTC Creation':         
        break;
      case 'Type Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('partTypeName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.partTypeAction('check');
        } else {
          this.partTypeAction('check');
        }
        break;
      case 'Catg Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('categoryName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.probCatgAction('check');
        } else {
          this.probCatgAction('check');
        }
        break;
      case 'System Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('systemName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.partSystemAction('check');
        } else {
          this.partSystemAction('check');
        }
        break;
      case 'Assembly Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('assemblyName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.partAssemblyAction('check');
        } else {
          this.partAssemblyAction('check');
        }
        break;
    }    
  }

  // DTC Submit
  dtcSubmit() {  
    this.dtcSubmitted = true;  
    if(this.dtcForm.invalid) {
      return false;
    }

    this.initLoading = true;
    
    let code = this.dtcForm.value.code;
    let desc = this.dtcForm.value.desc;
    console.log(code+' - '+desc);
    
    this.dtcFormData = new FormData();
    this.dtcFormData.append('apiKey', this.apiData['apiKey']);
    this.dtcFormData.append('domainId', this.apiData['domainId']);
    this.dtcFormData.append('userId', this.apiData['userId']);
    this.dtcFormData.append('workstreamList', JSON.stringify(this.ws));
    this.dtcFormData.append('vehicleInfo', this.vehicle);
    this.dtcFormData.append('dtcCode', code);
    this.dtcFormData.append('dtcDesc', desc);
    
    this.gtsApi.checkDTC(this.dtcFormData).subscribe((response) => {
      //this.dtcSubmitted = false;
      //this.initLoading = this.dtcSubmitted;
      this.dtcExistFlag = (response.status == 'Success') ? false : true;
      if(this.dtcExistFlag) {
        this.dtcErrTxt = response.result;
        this.initLoading = false;
      }
    });


    setTimeout(() => {
      if(this.dtcExistFlag) {
        return false;
      }
  
      let resData = {
        exname: this.actionInfo['id']+' - '+this.actionInfo['name'],
        action: true,
        name: desc,
        id: code
      };
      setTimeout(() => {
        this.dtcSubmitted = true;
        this.initLoading = false;
      
        this.emitAction(resData);  
      }, 250);  
    }, 750);          
  }

  // Form Submit
  actionSubmit() {
    this.actionSubmitted = true;

    if(this.nameExistFlag) {
      return false;
    }

    if(this.actionForm.invalid) {
      return false;
    }

    this.initLoading = true;
    let name = this.actionForm.value.name;
    switch(this.access) {
      case 'ECU Creation':
        this.ecuFormData = new FormData();
        this.ecuFormData.append('apiKey', this.apiData['apiKey']);
        this.ecuFormData.append('domainId', this.apiData['domainId']);
        this.ecuFormData.append('countryId', this.apiData['countryId']);
        this.ecuFormData.append('userId', this.apiData['userId']);
        this.ecuFormData.append('workstreamList', JSON.stringify(this.ws));
        this.ecuFormData.append('vehicleInfo', this.vehicle);
        this.ecuFormData.append('ecuName', name);
        this.ecuAction('new');
        break;
      case 'MFG Creation':
        this.mfgFormData = new FormData();
        this.mfgFormData.append('apiKey', this.apiData['apiKey']);
        this.mfgFormData.append('domainId', this.apiData['domainId']);
        this.mfgFormData.append('countryId', this.apiData['countryId']);
        this.mfgFormData.append('userId', this.apiData['userId']);
        this.mfgFormData.append('workstreamList', JSON.stringify(this.ws));
        this.mfgFormData.append('vehicleInfo', this.vehicle);
        this.mfgFormData.append('mfgName', name);
        this.mfgAction('new');        
        break;
      case 'Type Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('partTypeName', name);
        this.partTypeAction('new');        
        break;
      case 'Catg Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('categoryName', name);
        this.probCatgAction('new');        
      break;
      case 'System Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('systemName', name);
        this.partSystemAction('new');        
      break;
      case 'Assembly Creation':
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('assemblyName', name);
        this.partAssemblyAction('new');        
      break;
    }
  }

  // Part Type API
  partTypeAction(action) {
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('partTypeId', this.resId);
          }
          this.commonApi.managePartType(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              this.emitAction(resData);
            }          
          });
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('partTypeId', this.actionId);
        }
        this.nameCheckFlag = this.commonApi.managePartType(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }

  // Problem Category API
  probCatgAction(action) {
    console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
    switch (action) {
      case 'new':
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('categoryId', this.resId);
          }
          this.gtsApi.manageProblemCatg(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              console.log(resData);
              this.emitAction(resData);
            }          
          });
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('categoryId', this.actionId);
        }
        this.nameCheckFlag = this.gtsApi.manageProblemCatg(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }

  // ECU Type API
  ecuAction(action) {
    console.log(action)
    console.log(this.actionId+'::'+this.resId)
    switch (action) {
      case 'new':
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);
        } else {
          this.ecuFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.ecuFormData.append('ecuId', this.actionId);
          }
          this.gtsApi.manageECUType(this.ecuFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: response.dataId
              };
              this.emitAction(resData);  
            }          
          });
        }       
        break;
    
      default:
        this.ecuFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.ecuFormData.append('ecuId', this.actionId);
        }
        this.nameCheckFlag = this.gtsApi.manageECUType(this.ecuFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }          
        });
        break;
    }
  }

// MFG API
mfgAction(action) {
  switch (action) {
    case 'new':
      if(this.action == 'edit' && this.actionId != this.resId) {
        let resData = {
          action: true,
          actionItem: 'exist',
          name: this.actionForm.value.name,
          id: this.resId
        };
        setTimeout(() => {
          this.initLoading = false;
          this.emitAction(resData);  
        }, 700);
      } else {
        this.mfgFormData.append('isValidate', this.manageAction);
        if(this.action == 'edit') {
          this.mfgFormData.append('mfgId', this.actionId);
        }
        this.gtsApi.manageMFG(this.mfgFormData).subscribe((response) => {
          this.initLoading = false;
          if(response.status == 'Success') {
            let resData = {
              action: true,
              actionItem: 'new',
              name: this.actionForm.value.name,
              id: response.dataId
            };
            this.emitAction(resData);
          }          
        });
      }        
      break;
  
    default:
      this.mfgFormData.append('isValidate', this.checkAction);
      if(this.action == 'edit') {
        this.mfgFormData.append('mfgId', this.actionId);
      }
      this.nameCheckFlag = this.gtsApi.manageMFG(this.mfgFormData).subscribe((response) => {
        let status = response.status;
        if(this.action == 'edit') {
          this.resId =(status == 'Success') ? this.actionId : response.dataId;
        } else {
          this.nameExistFlag = (status == 'Success') ? false : true;
          if(this.nameExistFlag) {
            this.errTxt = response.result;
          }
        }
      });
      break;
  }
}
  GTSAction(action){
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('partTypeId', this.resId);
          }
          this.gtsApi.checkDTC(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.dtcForm.value.code,
                id: this.dtcForm.value.desc
              };
              this.emitAction(resData);
            }          
          });
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('partTypeId', this.actionId);
        }
        this.nameCheckFlag =this.gtsApi.checkDTC(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  
  }


  // Part System API
  partSystemAction(action) {
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('systemId', this.resId);
          }
          this.commonApi.managePartSystem(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              this.emitAction(resData);
            }          
          });  
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('systemId', this.actionId);
        }
        this.nameCheckFlag = this.commonApi.managePartSystem(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId = (status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }

  // Part Assembly API
  partAssemblyAction(action) {
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('assemblyId', this.resId);
          }
          this.commonApi.managePartAssembly(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              this.emitAction(resData);
            }          
          });  
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('assemblyId', this.actionId);
        }
        this.nameCheckFlag = this.commonApi.managePartAssembly(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }
  
  // Emit Action
  emitAction(resData) {
    this.actionSubmitted = false;
    setTimeout(() => {
      this.dtcAction.emit(resData);  
    }, 200);    
  }

  // Cancel Action
  cancelAction() {
    let resData = {
      action: false,
      name: '',
      id: "0"
    };
    setTimeout(() => {
      this.dtcAction.emit(resData);
    }, 500);    
  }

  // Change Password Response
  emitResponse(data) {
    console.log(data)
    if(data.action) {
      let folderAction = data.folderAction;
      let delStatus = data.deleteStatus;
      let wslist = data.wslist;
      let action = '';
      if(folderAction == 'delete') {
        action = (delStatus == 1) ? 'general' : 'all';
      } 
      let resData = {
        message: data.msg,
        folderName: data.name,
        wslist: data.wslist,
        action: action,
        refresh: data.refresh
      };
      this.dtcAction.emit(resData); 
    } else {
      this.activeModal.dismiss('Cross click');
    }    
  }

  // Emit Media Response
  emitMediaResponse(data) {
    if(data.action) {
      console.log(data)
      let action = (data.removeStatus) ? 'file-remove' : 'file-delete';
      this.dtcAction.emit(action);
    } else {
      this.activeModal.dismiss('Cross click');
    }
  }

  checkboxChange(action) {
    switch(action) {
      case 'update':
        this.updateCheckFlag = (this.updateCheckFlag) ? false : true;
        this.deleteCheckFlag = !this.updateCheckFlag;
        break;
      case 'replace':
        if(this.updateCheckFlag) {
          this.deleteCheckFlag = (this.deleteCheckFlag) ? false : true;
          this.updateCheckFlag = !this.deleteCheckFlag;
        }        
        break;  
    }
  }

  btnAction(action) {
    let deleteFlag = this.deleteCheckFlag;
    let data = {
      deleteFlag,
      flag: (action == 'submit') ? true : false
    };
    this.dtcAction.emit(data);
  }
  
}