import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Constant, GTSPage } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from 'src/app/services/api/api.service';
import { GtsService } from 'src/app/services/gts/gts.service';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { PopupComponent } from '../popup/popup.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements OnInit, OnDestroy {

  process: any = {};
  nextProcessId: any = 0;
  isLoading: boolean = true;
  labelSelectOption: string = '';
  required: number = 0;
  nextProcess: boolean = false;
  countryId: any;
  @Input() gtsInfo: any;
  @Input() innerHeight: any;
  inputValue: any = '';
  inputData: any;
  updateInputValueCheck = false;
  isLoadingOnScroll: boolean = false;
  sessionStorage: any;
  actionButionSyncer: Subject<any> = new Subject();
  processIsOkNotOk: boolean = false;
  voltsChecked: boolean = true;

  constructor(public gtsApi: GtsService, private modalService: NgbModal, private config: NgbModalConfig, private apiUrl: ApiService) { }

  ngOnInit(): void {
    this.sessionStorage = JSON.parse(sessionStorage.getItem('inputData'));
    this.gtsApi.apiData = {
      apiKey: this.gtsApi.apiKey,
      userId: this.gtsApi.userId,
      domainId: this.gtsApi.domainId,
      actionMode: '2',
      processId: this.gtsApi.processId,
      procedureId: this.gtsApi.procedureId,
      frameNo: this.gtsApi.apiData.frameNo,
      odometerNo: this.gtsApi.apiData.odometerNo,
      parentProcessId: this.gtsApi.apiData.parentProcessId
    };

    if (this.gtsInfo && this.gtsInfo.workstreams.length > 0) {
      this.gtsApi.apiData['workstreamId'] = this.gtsInfo.workstreams[0].id
    }
    this.countryId = localStorage.getItem('countryId');
    this.getProcessDetail()
    this.updateInputValueCheck = false;


  }

  openPopup(): void {
    this.config.backdrop = true;
    this.config.keyboard = true;
    this.config.windowClass = 'bottom-right-notifications-popup';
    const modalRef = this.modalService.open(PopupComponent)
    modalRef.result.then(() => {
      document.body.classList.remove(this.config.windowClass)
    }).catch(err => {
      document.body.classList.remove(this.config.windowClass)
    })
  }

  getProcessDetail() {
    this.gtsApi.getProcedure().then(() => {
      this.updateInputValueCheck = false;
      this.gtsApi.procedure = this.gtsApi.procedure;

      this.nextProcessId = this.gtsApi.procedure.nextProcessId;


      this.isLoading = false;

      for (let steps of this.gtsApi.procedure.process[0].processSteps) {
        this.labelSelectOption='';
       if(this.gtsApi.procedure.shapeType==13 || this.gtsApi.procedure.shapeType)
       {
        if(this.gtsApi.procedure.nextProcessIdFromBack)
        {
          if(steps.actionOptions)
          {
            for (let action of steps.actionOptions) {
              if (action.id == this.gtsApi.procedure.nextProcessIdFromBack) {

                this.labelSelectOption=action.name;
              }
            }
          }
        }
        if(this.gtsApi.procedure.nextProcessId)
        {
          if(steps.actionOptions)
          {
            for (let action of steps.actionOptions) {
              if (action.id == this.gtsApi.procedure.nextProcessId) {

                this.labelSelectOption=action.name;
              }
            }
          }
        }



       }
        let actionName = (steps.actionStatusName).toLowerCase();
        if (steps.instructionType === 1) {
          this.processIsOkNotOk = true;
        }
        if (steps.instructionType === 1 && (actionName === "not ok" || actionName === "no")) {

        }
        if (steps.actionStatusName != '') {
          this.gtsApi.procedure.isNextProcessEnabled = 1;
          this.required = 0;
        }

        if(this.gtsApi.procedure.isActionRequired==1)
        {
          this.updateInputValueCheck = true;
        }
        if (this.gtsApi.procedure.process[0].processSteps.length === 1) {
          if (steps.instructionType === 2) {
            this.processIsOkNotOk = false;
          }
        }
        if (steps.instructionType === 4) {
          steps.actionOptions = [];
        }
      }

      setTimeout(() => {
        (document.querySelectorAll('.p-panel .p-panel-content')[0] as HTMLElement).style.height = this.innerHeight - 130 + "px";
        if (this.gtsApi.procedure.process[0].processSteps[0]?.conditionValue == 20) {
          this.gtsApi.procedure.isNextProcessEnabled = 0;
          this.required = 0;
          if (this.gtsApi.procedure.process[0]?.processSteps[0]?.actionStatusName == 'Confirm' && this.gtsApi.procedure.process[0]?.processSteps[0]?.instructionType == 3) {
            this.gtsApi.procedure.isNextProcessEnabled = 1;
            this.required = 0;
          }
        }
        if (this.gtsApi.procedure.process[0].processSteps[0]?.conditionValue == 18) {
          this.gtsApi.procedure.isNextProcessEnabled = 1;
          this.required = 0;
        }

        if (this.gtsApi.procedure.prevProcessId == this.gtsApi.procedure.currentProcessId) {
          this.gtsApi.procedure.prevProcessId = 0;
        }
      }, 0)

    })

  }

  openOptionsPopup(steps): void {

    if (this.gtsApi.procedure.shapeType == 13 || this.gtsApi.procedure.shapeType == 20)
      {
        //this.gtsApi.procedure.process[0].processSteps[0].actionStatusName=this.labelSelectOption;
      }
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.gtsApi.domainId,
      'countryId': this.countryId,
      'userId': this.gtsApi.userId,
      'lookUpdataId': '',
      'lookupHeaderName': '',
      'groupId': 0,
      'data': steps
    };
    this.inputData = {
      baseApiUrl: this.apiUrl.apiCollabticBaseUrl(),
      apiUrl: '',
      field: 'vinNo',
      selectionType: 'single',
      filteredItems: [''],
      filteredLists: [''],
      actionApiName: '',
      actionQueryValues: '',
      selected: this.gtsApi.procedure.process[0].processSteps[0].actionStatusName,
      title: 'Select Option'
    };
    this.config.backdrop = true;
    this.config.centered = true;
    this.config.keyboard = true;
    this.gtsApi.optionButtonData.processId = this.gtsApi.apiData.processId
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = 'gtsDynamicOptions';
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.inputData = this.inputData;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = this.innerHeight - 140;
    modalRef.componentInstance.commonApiValue = '';
    modalRef.componentInstance.selectedItems.subscribe((res) => {
      if (!res[0]) {
        return;
      }
      res = res[0];
      this.nextProcessId = res.nextProcessID;

      this.labelSelectOption = res.name;
      this.gtsApi.apiData.contentId = steps.contentId;
      this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
      this.gtsApi.apiData.userInput = res.id;
      this.gtsApi.apiData.processId = this.nextProcessId;

      this.gtsApi.updateUserInputCheckAction().subscribe(response => {
        if (response.status == 'Success') {
          this.gtsApi.procedure.isActionRequired = response.isActionRequired;
          this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
          this.gtsApi.apiData.processId = this.nextProcessId;
          if (this.gtsApi.procedure.shapeType == 13 || this.gtsApi.procedure.shapeType == 20) {
            this.gtsApi.firstTimeButton = false;
            this.gtsApi.optionButtonData.isButtonEnabled = true;
            this.gtsApi.apiData.parentNextProcessId = this.nextProcessId.toString()
            this.gtsApi.apiData.parentProcessId = this.gtsApi.procedure.currentProcessId
          }

          this.goToNextProcess(true);
        }
      }, err => {
        console.log(err)
      })
    })
  }




  goToNextProcess(isOptionButtonEnabled = false): void {
    this.nextProcess = true;
    this.gtsApi.previousNextNode = '2';
    if (this.gtsApi.procedure.isNextProcessEnabled) {
      this.required = 0;
    }
    if (this.gtsApi.procedure.isLastProcess || this.required > 0) {
      return;
    }

    if (!this.gtsApi.optionButtonData.isButtonEnabled) {
      this.gtsApi.optionButtonData.isButtonEnabled = isOptionButtonEnabled;
    }

    this.isLoading = true;
    this.gtsApi.processId = this.nextProcessId;
    this.gtsApi.apiData.previousProcessId = this.gtsApi.apiData.processId;
    this.gtsApi.apiData.processId = this.nextProcessId;

    this.gtsApi.isNextProcess = true;
    this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
    this.getProcessDetail();
  }

  goToPreviousProcess(previoudId) {
    this.sessionStorage = JSON.parse(sessionStorage.getItem('inputData'));
    this.nextProcess = false;
    this.isLoading = true;
    this.gtsApi.processId = this.nextProcessId;
    this.gtsApi.apiData.previousProcessId = this.gtsApi.apiData.prevProcessId;
    this.gtsApi.apiData.processId = previoudId;
    this.gtsApi.apiData.parentProcessId = (this.gtsApi.procedure.shapeType == 13 || this.gtsApi.procedure.shapeType == 20) ? 0 : previoudId;
    if (this.gtsApi.procedure.shapeType == 13 || this.gtsApi.procedure.shapeType == 20) {
      this.gtsApi.apiData.parentNextProcessId = this.nextProcessId.toString()
      this.gtsApi.apiData.parentProcessId = this.gtsApi.procedure.currentProcessId
    }

    this.gtsApi.previousNextNode = '1';
    this.gtsApi.isPreviousProcess = true;
    this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
    this.required = 0;
    this.gtsApi.procedure.isNextProcessEnabled = 1;
    if (this.gtsApi.procedure.process[0]?.processSteps[0]?.actionStatusName == "Confirm" && this.gtsApi.procedure.process[0]?.processSteps[0]?.conditionValue == 20 && this.gtsApi.procedure.process[0]?.processSteps[0]?.instructionType == 3) {
      this.gtsApi.procedure.isNextProcessEnabled = 1;
      this.required = 0;
    }
    this.getProcessDetail();


  }

  setProcessId(event) {
    let buttonLabel = event.label
    if (buttonLabel.toLowerCase() === "not ok" || buttonLabel.toLowerCase() === "no") {
      this.updateInputValueCheck = true;
    } else if (buttonLabel.toLowerCase() === "ok" || buttonLabel.toLowerCase() === "yes") {
      this.updateInputValueCheck = false;
    }
    this.isLoadingOnScroll = false;
    if (event.nextProcessId > 0) {
      this.nextProcessId = event.nextProcessId;
      this.gtsApi.procedure.isNextProcessEnabled = 1;
    }

    this.gtsApi.apiData.contentId = event.contentId;
    this.gtsApi.apiData.instructionType = event.instructionType;
    this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
    this.gtsApi.apiData.isLastProcess = this.gtsApi.procedure.isLastProcess;
    this.gtsApi.apiData.isFrameCutOffProcess = this.gtsApi.procedure.isFrameNoCutOff;
    this.gtsApi.apiData.actionStatus = event.id;
    this.gtsApi.apiData.prevProcessId = this.gtsApi.apiData.processId
    this.gtsApi.updateGTSCheckActions().subscribe(response => {
      if (response.status == 'Success') {
        this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
        if(response.isNextProcessEnabled) {
          this.required = 0;
        }
        this.gtsApi.procedure.isActionRequired = response.isActionRequired;

        if(response.isActionRequired==1)
        {
          this.updateInputValueCheck = true;
        }
        if (response.nextProcessId && response.isNextProcessEnabled && !this.gtsApi.procedure.isLastProcess) {
          this.nextProcessId = response.nextProcessId;
          this.gtsApi.apiData.processId = this.nextProcessId;
          this.gtsApi.isNextProcess
          this.goToNextProcess();
        }
      }
      this.isLoadingOnScroll = false;
    }, err => {
      this.isLoadingOnScroll = false;
      console.log(err)
    });
  }

  validateInputValue(data, steps) {
    if (steps.unitMinValue || steps.unitMaxValue) {
      var isNumber = (value) => {
        return Number.isInteger(Number(value));
      }

      if (isNumber(data.value) === false) {
        steps.isValidate = false;
        return;
      }

      if (steps.unitMinValue > data.value || steps.unitMaxValue < data.value) {
        steps.isValidate = false;
        return;
      }
    }

    steps.isValidate = true;

    this.updateInputValue(data);
  }


  validateOkInputValue(data, steps) {
    if (steps.unitMinValue || steps.unitMaxValue) {
     /* var isNumber = (value) => {
        return Number.isInteger(Number(value));
      }

      if (isNumber(data.value) === false) {
        steps.isValidate = false;
        return;
      }
*/
      if (steps.unitMinValue > data.value || steps.unitMaxValue < data.value) {
        steps.isValidate = false;
        return;
      }
    }
    this.voltsChecked = true;
    steps.isValidate = true;
    data.instructionType = 1;
    data.actionStatus = data.value;
    this.setOkInputValue(data, true);
  }

  setOkInputValue(event, gotonext = false) {
    this.isLoadingOnScroll = false;
    if (event.nextProcessId > 0) {
      this.nextProcessId = event.nextProcessId;
      this.gtsApi.procedure.isNextProcessEnabled = 1;
    }

    this.gtsApi.apiData.contentId = event.contentId;
    this.gtsApi.apiData.instructionType = event.instructionType;
    this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
    this.gtsApi.apiData.isLastProcess = this.gtsApi.procedure.isLastProcess;
    this.gtsApi.apiData.isFrameCutOffProcess = this.gtsApi.procedure.isFrameNoCutOff;
    this.gtsApi.apiData.actionStatus = event.actionStatus;
    this.gtsApi.apiData.prevProcessId = this.gtsApi.apiData.processId
    this.gtsApi.updateGTSCheckActions().subscribe(response => {
      if (response.status == 'Success') {
        this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
        console.log('this.gtsApi.procedure.isNextProcessEnabled = ', + this.gtsApi.procedure.isNextProcessEnabled);
        this.gtsApi.procedure.isActionRequired = response.isActionRequired;
        if(response.isActionRequired==1)
        {
          this.updateInputValueCheck = true;
        }
        if (response.nextProcessId && response.isNextProcessEnabled && !this.gtsApi.procedure.isLastProcess) {
          this.nextProcessId = response.nextProcessId;
          this.gtsApi.apiData.processId = this.nextProcessId;
          if (gotonext) {
            this.goToNextProcess();
          }
        }
      }
      this.isLoadingOnScroll = false;
    }, err => {
      this.isLoadingOnScroll = false;
      console.log(err)
    });
  }



  updateInputValue(data) {
    if (data.processSteps) {
      data.processSteps.actionStatusName = '';
    }
    this.actionButionSyncer.next(true);

    sessionStorage.setItem('inputData', JSON.stringify(data));
    if (data.value == '' || typeof data.value == 'undefined') {
      return
    }

    if (typeof data.type != 'undefined' && typeof data.instructionType != 'undefined') {
      this.gtsApi.apiData.instructionType = data?.instructionType;
      this.gtsApi.apiData.userInput = data?.type;
    }

    this.gtsApi.apiData.contentId = data?.contentId;
    this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
    this.gtsApi.apiData.userActionValue = data?.value;
    this.gtsApi.apiData.userInputId = data?.userInputId;

      //this.updateInputValueCheck = true;


    this.gtsApi.apiData.prevProcessId = this.gtsApi.apiData.processId;
    this.nextProcessId = this.gtsApi.apiData.prevProcessId;

    this.gtsApi.apiData.processId = this.nextProcessId;

    this.gtsApi.updateUserInputCheckAction().subscribe(response => {
      if (response.status == 'Success') {
        this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
        this.gtsApi.procedure.isActionRequired = response.isActionRequired;
        let required = 0;
        this.gtsApi.procedure.process[0].processSteps.forEach(step => {

          if (step.isValidate === false) {
            required++;
          }
        })
        this.required = required;

        if (response.isStepEnabled == 1) {
          this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
          this.required = 0;
          return;
        }
        if (response.isNextProcessEnabled) {
          this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
          this.required = 0;
        }
        if ((response.isStepEnabled == 1 || response.isNextProcessEnabled) && (this.gtsApi.procedure.shapeType == 13 || this.gtsApi.procedure.shapeType == 20)) {
          this.gtsApi.optionButtonData.isButtonEnabled = true;
        } else {
          this.gtsApi.optionButtonData.isButtonEnabled = false;
        }
        if (data.nextProcess) {
          this.goToNextProcess();
        }
      }
    }, err => {
      console.log(err)
    })
  }

  goToPreviousOption(previoudId): void {
    this.gtsApi.optionButtonData.isButtonEnabled = false;
    this.goToPreviousProcess(previoudId)
  }

  updateRequiredParameters(event): void {
    this.required += 1;
  }

  checkValue(event, steps) {
    this.isLoadingOnScroll = true;
    if (event.target.checked) {
      if (steps.conditionValue == 20) {
        this.gtsApi.procedure.isNextProcessEnabled = 1;
      }
      this.gtsApi.apiData.contentId = steps.contentId;
      this.gtsApi.apiData.instructionType = steps.instructionType;
      this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
      this.gtsApi.apiData.isLastProcess = this.gtsApi.procedure.isLastProcess;
      this.gtsApi.apiData.isFrameCutOffProcess = this.gtsApi.procedure.isFrameNoCutOff;
      this.gtsApi.apiData.actionStatus = steps.actionRequiredFor;
      this.gtsApi.apiData.prevProcessId = this.gtsApi.procedure.prevProcessId;
      this.gtsApi.updateGTSCheckActions().subscribe(response => {
        if (response.status == 'Success') {
          this.isLoadingOnScroll = false;
          response.isNextProcessEnabled = 1;
          this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
          this.gtsApi.procedure.isActionRequired = response.isActionRequired;
          if(response.isActionRequired==1)
          {
            this.updateInputValueCheck = true;
          }
          if (response.nextProcessId && response.isNextProcessEnabled && !this.gtsApi.procedure.isLastProcess) {
            this.nextProcessId = response.nextProcessId;
            this.gtsApi.apiData.processId = this.nextProcessId;
          }
          if (response.isNextProcessEnabled) {
            this.goToNextProcess();
          }
        }
      }, err => {
        this.isLoadingOnScroll = false;
        console.log(err)
      })
    } else {
      this.isLoadingOnScroll = false;
      this.gtsApi.procedure.isNextProcessEnabled = 0;
      this.gtsApi.apiData.contentId = steps.contentId;
      this.gtsApi.apiData.instructionType = steps.instructionType;
      this.gtsApi.apiData.gtsid = this.gtsApi.procedure.gtsId;
      this.gtsApi.apiData.isLastProcess = this.gtsApi.procedure.isLastProcess;
      this.gtsApi.apiData.isFrameCutOffProcess = this.gtsApi.procedure.isFrameNoCutOff;
      this.gtsApi.apiData.actionStatus = steps.actionRequiredFor;
      this.gtsApi.apiData.prevProcessId = this.gtsApi.procedure.prevProcessId;
      this.gtsApi.updateGTSCheckActions().subscribe(response => {
        if (response.status == 'Success') {
          this.isLoadingOnScroll = false;
          response.isNextProcessEnabled = 0;
          this.gtsApi.procedure.isNextProcessEnabled = response.isNextProcessEnabled;
          this.gtsApi.procedure.isActionRequired = response.isActionRequired;
          if(response.isActionRequired==1)
          {
            this.updateInputValueCheck = true;
          }
          if (response.nextProcessId && response.isNextProcessEnabled && !this.gtsApi.procedure.isLastProcess) {
            this.nextProcessId = response.nextProcessId;
            this.gtsApi.apiData.processId = this.nextProcessId;
          }
        }
      }, err => {
        this.isLoadingOnScroll = false;
        console.log(err)
      })
    }
  }

  ngOnDestroy(): void {
    this.gtsApi.removeLocalGtsProcedure();
    return // Remove this after all done and last state will start updating
    this.gtsApi.updateGTSExitStatus().subscribe(response => {
      (this.gtsApi.apiData as any) = {};
      this.gtsApi.pageType = GTSPage.start;
    }, err => {
      console.log(err);
    })
  }

  getCheckBoxName(steps) {
    for (let action of steps.actionOptions) {
      if (action.id == steps.conditionValue) {
        return action.name;
      }
    }

    return "Confirm";
  }

  setProcessStepEnable(event: any, steps: any) {
    steps.processStepIsEnabled = event;
    let processStepsCount: any = this.gtsApi.procedure.process[0].processSteps.length;
    let processStepEnableCount: any = 0;
    for (let step of this.gtsApi.procedure.process[0].processSteps) {
      if(step.processStepIsEnabled && step.actionStatusName) {
        processStepEnableCount += 1;
      }
    }
    if (processStepEnableCount == processStepsCount) {
      this.gtsApi.procedure.isNextProcessEnabled = 1;
    } else {
      this.gtsApi.procedure.isNextProcessEnabled = 0;
    }
  }
}
