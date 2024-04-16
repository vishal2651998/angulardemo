import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constant } from 'src/app/common/constant/constant';
import { GtsService } from 'src/app/services/gts/gts.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})
export class UserInputComponent implements OnInit {
  @Input() access: string = "";
  @Input() processSteps: any = [];
  @Output() userInput = new EventEmitter<any>();
  @Output() updateProcessStepEnable = new EventEmitter<any>();
  @Output() fieldRequired = new EventEmitter<boolean>();
  @Input() actionButionSyncer: Subject<any>;
  @Input() required = 0;
  @Input() action: string;
  userInputs: any;
  inputText: any = '';
  minMaxInput: any = '';
  public manageAction: string;
  public pageAccess: string = "gtsr";
  countryId: any;
  public contentType: number = 41; // gtsr
  public gtsrEdit: string = '';
  public prevPage: string = '';
  public threadId = '';
  public uploadedItems: any = [];
  public EditAttachmentAction: string = "attachments";
  public attachmentItems: any = [];
  public deletedFileIds: any = [];
  public updatedAttachments: any = [];
  public attachmentFlag: boolean = true;
  public error: any = { type: '', message: '' };
  inputData: any;
  displayOrder = 1;

  constructor(public gtsApi: GtsService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.action, this.access, this.processSteps);
    this.inputData = sessionStorage.getItem('inputData');
    this.userInputs = this.processSteps.userInputs;
    this.gtsApi.fileDatas.attachments = [];
    this.gtsApi.fileDatas.items = [];
    this.gtsApi.attachments = [];

      this.processSteps.userInputs.forEach(input => {
      if (input.isRequired == 1 && input.userActionValue == '') {
        this.fieldRequired.emit(true);
      }

      if(input.userInput == 3) {
        input.view = true;
      }

      if (input.userActionValue == '') {
        input.vaild = false;
      } else {
        input.vaild = true;
      }
    })


    let gtsrValues = localStorage.getItem("gtsrValues") != null && localStorage.getItem("gtsrValues") != undefined ? localStorage.getItem("gtsrValues") : '';
    gtsrValues = (gtsrValues != '') ? JSON.parse(localStorage.getItem("gtsrValues")) : '';

    this.gtsrEdit = gtsrValues['gtsrEdit']; // already edited
    this.threadId = gtsrValues['threadId'];
    this.prevPage = gtsrValues['page'];

    this.countryId = localStorage.getItem('countryId');
    let threadAction;
    let action;
    if (this.gtsrEdit == '0') {
      action = 'new';
    }
    else {
      action = 'edit';
    }
    if (this.prevPage == 'gtsr') {
      threadAction = 'gtsr-page';
    }
    else {
      threadAction = '';
    }

    this.gtsApi.postApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.gtsApi.apiData.domainId,
      countryId: this.countryId,
      userId: this.gtsApi.apiData.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      action: action,
      threadAction: threadAction,
      workstreamId: this.gtsApi.apiData.workstreamId,
      dataId: this.processSteps.contentId,
      gtsId: this.gtsApi.procedure.gtsId,
      uploadByAuthor: 0,
      linkUrl: '',
      caption: '',
      type: 'other attachment',
      procedureId: this.gtsApi.apiData.procedureId,
      processId: this.gtsApi.apiData.processId,
      contentId: this.processSteps.contentId,
      userInputId: this.gtsApi.apiData.userId,
      contentTypeId: 41,
      flagId: 1,
      uploadCount: 1,
      // displayOrder: 1,
      uploadFlag: true,
      message: 'Files uploaded successfully'
    };
  }


  updateValue(event, input) {
    let value = '';
    if (input.userInput == 1) {
      value = event.target.value;
    } else if (input.userInput == 2) {
      value = event.value;
    }

    input.vaild = true;
    this.userInput.emit({
      value,
      type: input.userInput,
      contentId: this.processSteps.contentId,
      instructionType: this.processSteps.instructionType,
      userInputId: input.userInputId,
      processSteps: this.processSteps
    });
  }

  validateInputValue(event, input) {
    if (input.minValue || input.maxValue) {
      var isNumber = (value) => {
        return Number.isInteger(Number(value));
      };

      if (isNumber(input.userActionValue) === false) {
        this.processSteps.isValidate = false;
        this.actionButionSyncer.next(false);
        input.vaild = false;
        return;
      }

      if (input.minValue > input.userActionValue || input.maxValue < input.userActionValue) {
        this.processSteps.isValidate = false;
        this.actionButionSyncer.next(false);
        input.vaild = false;
        return;
      }
    }

    this.processSteps.isValidate = true;
    this.actionButionSyncer.next(true);

    this.validateNumberInputs(event, input);
  }

  validateNumberInputs(event, input): void {
    let value = '';
    if (input.userInput == 1) {
      value = event.target.value;
    } else if (input.userInput == 2) {
      value = event.value;
    }
    if (input.minValue > value) {
      input.vaild = false;
      this.error = { type: 'range', message: 'Input must be greater then ' + input.minValue };
      return;
    } else if (input.maxValue < value) {
      input.vaild = false;
      this.error = { type: 'range', message: 'Input must be less or equal to ' + input.maxValue };
      return;
    }


    this.updateValue(event, input);
  }

  attachments(fileData, input: any) {
    const action = fileData.action;
    switch (action) {
      case 'upload':
        this.gtsApi.fileDatas = fileData;
        this.gtsApi.isMediaUpload = true;
        break;
      case 'delete':
        break;
      case 'submit':
        const userAttachments = fileData.userAttachments;
        const inputId = fileData.fieldId;
        this.processSteps.userInputs.forEach((inputData) => {
          if (inputData.userInput == 3 && inputId == inputData.userInputId) {
            inputData.view = false;
            setTimeout(() => {
              inputData.view = true;
            }, 100);
            const attachInfo = inputData.userAttachments.concat(userAttachments);
            inputData.userAttachments = attachInfo;
          }
        });
        break;
    }
  }

  attachmentAction(data) {
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;

    switch (action) {
      case "file-delete":
        this.deletedFileIds.push(fileId);
        break;
      case "order":
        let attachmentList = data.attachments;
        for (let a in attachmentList) {
          let uid = parseInt(a) + 1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(
            (option) => option.fileId == ufileId
          );
          if (uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: flagId == 6 ? attachmentList[a].url : "",
              displayOrder: uid,
            };
            this.updatedAttachments.push(fileInfo);
          } else {
            this.updatedAttachments[uindex].displayOrder = uid;
          }
        }
        break;
      default:
        let updatedAttachmentInfo = {
          fileId: fileId,
          caption: caption,
          url: url,
        };
        let index = this.updatedAttachments.findIndex(
          (option) => option.fileId == fileId
        );
        if (index < 0) {
          updatedAttachmentInfo['displayOrder'] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
        }
        break;
    }
  }

  removeAttachment(i) {

    const filedata = this.gtsApi.fileDatasPrev[i];
    const modalRef = this.modalService.open(ConfirmationComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if (receivedService) {
        this.gtsApi.DeleteAttachmentInfo(filedata).subscribe(response => {
          console.log('remove attachment', response);
          if (response.status == 'Success') {
            console.log('remove attachment', response);
            filedata.splice(i, 1);
          }
        }, err => {
          console.log(err);
        });
      }
    });
  }

  setUpdateProcessStepEnable(event: any) {
    this.updateProcessStepEnable.emit(event);
  }
}
