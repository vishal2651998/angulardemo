import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constant, GTSPage } from 'src/app/common/constant/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { GtsService } from 'src/app/services/gts/gts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-form',
  templateUrl: './summary-form.component.html',
  styleUrls: ['./summary-form.component.scss']
})
export class SummaryFormComponent implements OnInit {
  summaryForm: FormGroup;
  @Input() title: string = '';
  @Input() processSteps: any = [];
  @Input() userInputs: any = [];
  @Output() userInput = new EventEmitter<any>();

  inputText: any = '';
  minMaxInput: any = '';
  dropDownInput: any = '';
  public manageAction: string;
  public postApiData: object;
  public pageAccess: string = "ppfr";
  countryId: any;
  public contentType: number = 38; // PPFR
  public displayOrder: number = 0;
  public ppfrEdit: string = '';
  public prevPage: string = '';
  public threadId = '';
  public uploadedItems: any = [];
  public saveButtonEnable: boolean = false;
  public EditAttachmentAction: string = "attachments";
  public attachmentItems: any = [];
  public deletedFileIds: any = [];
  public updatedAttachments: any = [];
  inputData: any;
  constructor(public gtsApi: GtsService, private route: Router, private fb: FormBuilder, public activeModal: NgbActiveModal, private modalService: NgbModal, private config: NgbModalConfig) { }

  ngOnInit(): void {


    this.inputData = sessionStorage.getItem('inputData');
    this.userInputs = this.processSteps.userInputs;

    let ppfrValues = localStorage.getItem("ppfrValues") != null && localStorage.getItem("ppfrValues") != undefined ? localStorage.getItem("ppfrValues") : '';
    ppfrValues = (ppfrValues != '') ? JSON.parse(localStorage.getItem("ppfrValues")) : '';

    this.ppfrEdit = ppfrValues['ppfrEdit']; // already edited
    this.threadId = ppfrValues['threadId'];
    this.prevPage = ppfrValues['page'];

    this.countryId = localStorage.getItem('countryId');
    let threadAction;
    let action;
    if (this.ppfrEdit == '0') {
      action = 'new';
    }
    else {
      action = 'edit';
    }
    if (this.prevPage == 'ppfr') {
      threadAction = 'ppfr-page';
    }
    else {
      threadAction = '';
    }

    this.postApiData = {
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
      contentTypeId: 42,
      flagId: 1
    };
    this.formData();
    this.countryId = localStorage.getItem('countryId');
  }

  formData() {
    this.summaryForm = this.fb.group({
      description: ['', [Validators.required]]
    });
  }
  updateValue(event, type) {
    let value = '';
    if (type == 1) {
      value = event.target.value;
    } else if (type == 2) {
      value = event.value;
    }
    this.userInput.emit({ value, type });
  }

  attachments(items) {
    this.uploadedItems = items;
    this.saveButtonEnable = true;
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
          updatedAttachmentInfo["displayOrder"] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
        }
        break;
    }
  }
  cancel() {
    this.closePopup();
  }
  closePopup() {
    this.activeModal.dismiss();
    document.body.classList.remove(this.config.windowClass);
  }




  save() {
    this.gtsApi.apiData.description = this.summaryForm.value.description;
    this.summaryForm.markAllAsTouched();
    if (this.summaryForm.valid) {

      this.gtsApi.updateGTSExitStatus().subscribe((res) => {
        if (res.status == 'Success') {
          this.cancel();
          let gtslistpage = localStorage.getItem('gtsStartFrom');
          localStorage.removeItem('gtsStartFrom');
          if(gtslistpage == '1'){
            this.route.navigate(['gts/']).then(() => {
              (this.gtsApi.apiData as any) = {};
              this.gtsApi.pageType = GTSPage.start;
            });
          }
          else{
            this.route.navigate(['gts/view/', this.gtsApi.procedureId]).then(() => {
              (this.gtsApi.apiData as any) = {};
              this.gtsApi.pageType = GTSPage.start;
            });
          }
        }

      });
    }

  }
}
