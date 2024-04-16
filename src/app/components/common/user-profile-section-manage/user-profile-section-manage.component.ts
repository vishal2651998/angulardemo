import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { UpdatenamePopupComponent } from 'src/app/modules/shared/updatename-popup/updatename-popup.component';
import { CommonService } from '../../../services/common/common.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { platform } from 'os';

@Component({
  selector: 'app-user-profile-section-manage',
  templateUrl: './user-profile-section-manage.component.html',
  styleUrls: ['./user-profile-section-manage.component.scss']
})
export class UserProfileSectionManageComponent implements OnInit, OnDestroy {

  @Input() fieldName: string = '';
  @Input() pageAccess: string = '';
  @Input() saveText: string = '';
  @Input() currentUser: string = '';
  @Input() item: any = [];
  subscription: Subscription = new Subscription();
  public headText: string = 'Certification';
  public bodyClass1: string = "submit-loader";
  form: FormGroup = this.formBuilder.group({});
  public bodyElem;
  submitClicked: boolean;
  public apiKey: string = Constant.ApiKey;
  networkId: string;
  user: any;
  domainId: any;
  userId: any;
  editUserId: any;
  public minDate: any = new Date();
  public maximumDate: any = '';
  public miniumDate: any = '';

  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  countryId: string = '';
  innerHeight: number;
  emptyHeight: number;
  nonEmptyHeight: number;
  bodyHeight: number;

  public attachmentLoading: boolean = true;
  public loading: boolean = false;
  public attachmentsData: any;
  public action = "view";
  public postUploadActionTrue: boolean = false;
  public postUpload: boolean = true;
  public manageAction: string;
  public postApiData: object;
  public uploadedItems: any = [];
  public editAttachments: any = [];

  public commentUploadedItemsFlag: boolean = false;
  public commentUploadedItemsLength: number = 0;
  public contentType: number = 0;
  public mediaUploadItems: any = [];
  public mediaAttachments: any = [];
  public mediaAttachmentsIds: any = [];
  public displayOrder: number = 0;
  public EditAttachmentAction: 'attachments';
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public mediaConfig: any = { backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal' };

  public certificationFlag: boolean = false;
  public trainingFlag: boolean = false;
  public organizationFlag: boolean = false;

  public shopCertificationFlag: boolean = false;
  public shopPoliciesFlag: boolean = false;
  public shopTechnologyFlag: boolean = false;

  public certificationNameList: any;
  public certificationProviderList: any;
  public trainingNameList: any;
  public trainingCourseList: any;
  public trainingTrackList: any;
  public trainingSourceList: any;
  public OrganizationNameList: any;

  public certificationTypeList: any;
  public certificationList: any;
  public certificationYearsList: any = [];
  public technologyTypeList: any;
  public technologySolutionList: any;
  public policiesTypeList: any;
  public policiesProviderList: any;
  public policiesLimitsList: any = ["1", "2"];

  public discardFlag: Boolean = false;
  public isSaved: boolean = false;
  public serverError: boolean = false;
  public serverErrorMsg: string = '';
  public serverSuccess: boolean = false;
  public serverSuccessMsg: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private headQuarterService: HeadquarterService,
    private authenticationService: AuthenticationService,
    private config: NgbModalConfig,
    private route: ActivatedRoute,
    private commonApi: CommonService,) { }

  get f() { return this.form.controls; }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkId = this.user.networkId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();


    this.subscription.add(
      this.commonApi.userProfileUploadDataReceivedSubject.subscribe((response) => {
        console.log(response);
        setTimeout(() => {
          this.activeModal.close(response);
        }, 100);

      })
    );

    if (this.item != null && this.item && this.item != '' && this.item.uploadContents && this.item.uploadContents?.length > 0) {
      this.commentUploadedItemsLength = this.item.uploadContents.length;
      this.commentUploadedItemsFlag = true;

      this.attachmentsData = this.item.uploadContents;
      this.attachmentLoading = (this.item.uploadContents.length > 0) ? false : true;

    }

    switch (this.fieldName) {
      case 'certification':
        if (this.pageAccess == 'shop-summary') {
          if (this.item != null && this.item && this.item != '') { this.loading = true }
          this.shopCertificationFlag = true;
          this.getList('certification-type');
          this.getList('certification-list');
          this.getYearsList();
          this.form = this.formBuilder.group({
            type: [this.item && this.item != null ? this.item.type[0]['id'] : "", [Validators.required]],
            certification: [this.item && this.item != null ? this.item.certification[0]['id'] : "", [Validators.required]],
            cdate: [this.item && this.item != null && this.item.certified != '' && this.item.certified != '0000-00-00 00:00:00' ? moment(this.item.certified).format('MMM DD, YYYY') : "", [Validators.required]],
            edate: [this.item && this.item != null && this.item.expiration != '' && this.item.expiration != '0000-00-00 00:00:00' ? moment(this.item.expiration).format('MMM DD, YYYY') : "", [Validators.required]],
            years: [this.item && this.item != null ? this.item.years : "", [Validators.required]],
          });
          if (this.item != null && this.item && this.item != '') {
            setTimeout(() => {
              this.loading = false
            }, 2000);
          }

        }
        else {
          this.certificationFlag = true;
          this.contentType = 61;
          this.getList('certification-name');
          this.getList('certification-provider');
          this.form = this.formBuilder.group({
            certificationMasterId: [this.item && this.item != null ? this.item.cname[0]['id'] : "", [Validators.required]],
            certificationProviderId: [this.item && this.item != null ? this.item.cproviders[0]['id'] : "", [Validators.required]],
            certificateOnDate: [this.item && this.item != null && this.item.certified != '' && this.item.certified != '0000-00-00 00:00:00' ? moment(this.item.certified).format('MMM DD, YYYY') : "", [Validators.required]],
            certificateExpiryDate: [this.item && this.item != null && this.item.expiration != '' && this.item.expiration != '0000-00-00 00:00:00' ? moment(this.item.expiration).format('MMM DD, YYYY') : "", [Validators.required]],
          });
        }
        break;
      case 'training':
        this.trainingFlag = true;
        this.getList('training-name');
        this.getList('training-course');
        this.getList('training-track');
        this.getList('training-source');
        this.contentType = 63;
        this.form = this.formBuilder.group({
          trainingNameMasterId: [this.item && this.item != null ? this.item.tname[0]['id'] : "", [Validators.required]],
          trainingDate: [this.item && this.item != null && this.item.date != '' && this.item.date != '0000-00-00 00:00:00' ? moment(this.item.date).format('MMM DD, YYYY') : ""],
          trainingCourseMasterId: [this.item && this.item != null && this.item.course.length > 0 ? this.item.course[0]['id'] : ""],
          trainingTrackMasterId: [this.item && this.item != null && this.item.track.length > 0 ? this.item.track[0]['id'] : ""],
          trainingSourceMasterId: [this.item && this.item != null && this.item.source.length > 0 ? this.item.source[0]['id'] : ""],
        });
        break;
      case 'organization':
        this.organizationFlag = true;
        this.contentType = 62;
        this.getList('organization-name');
        this.form = this.formBuilder.group({
          organisationsMasterId: [this.item && this.item != null ? this.item.oname[0]['id'] : "", [Validators.required]],
          organisationsID: [this.item && this.item != null ? this.item.oid : "", [Validators.required]],
        });
        break;
      case 'technology':
        if (this.item != null && this.item && this.item != '') { this.loading = true }        this.shopTechnologyFlag = true;
        this.getList('technology-type');
        this.getList('technology-solution');
        this.form = this.formBuilder.group({
          id: [this.item && this.item != null ? this.item.id : 0],
          type: [this.item && this.item != null ? this.item.type[0]['id'] : "", [Validators.required]],
          solution: [this.item && this.item != null ? this.item.solution[0]['id'] : "", [Validators.required]],
        });
        if (this.item != null && this.item && this.item != '') {
          setTimeout(() => {
            this.loading = false
          }, 2000);
        }
        break;
      case 'policies':
        if (this.item != null && this.item && this.item != '') { this.loading = true } 
        this.shopPoliciesFlag = true;
        this.getList('policies-type');
        this.getList('policies-provider');
        this.form = this.formBuilder.group({
          id: [this.item && this.item != null ? this.item.id : 0],
          type: [this.item && this.item != null ? this.item.type[0]['id'] : "", [Validators.required]],
          provider: [this.item && this.item != null ? this.item.provider[0]['id'] : "", [Validators.required]],
          limits: [this.item && this.item != null ? this.item.limits : "", [Validators.required]],
          edate: [this.item && this.item != null && this.item.expiration != '' && this.item.expiration != '0000-00-00 00:00:00' ? moment(this.item.expiration).format('MMM DD, YYYY') : "", [Validators.required]],
        });
        if (this.item != null && this.item && this.item != '') {
          setTimeout(() => {
            this.loading = false
          }, 2000);
        }
        break;
    }




  }
  updateName(name: string, id: number, fieldTitle: string, actiontype: string, fieldName: string) {
    let titleText = this.fieldName;
    if (this.fieldName == 'technology') {
      titleText = 'Systems/Technology';
    }
    if (this.fieldName == 'policies') {
      titleText = 'Subscription / Policies';
    }
    let apiInfo = {
      'apiKey': this.apiKey,
      'userId': this.currentUser,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'networkId': this.networkId,
    }
    const modalRef = this.modalService.open(UpdatenamePopupComponent, { size: 'md', centered: true });
    modalRef.componentInstance.nameValue = name;
    modalRef.componentInstance.title = titleText;
    modalRef.componentInstance.fieldTitle = fieldTitle;
    modalRef.componentInstance.fieldName = fieldName;
    modalRef.componentInstance.action = actiontype;
    modalRef.componentInstance.apiInfo = apiInfo;
    modalRef.componentInstance?.emitService?.subscribe((data) => {
      let str = '';
      if (id == 0) {
        str = 'Added';
      }
      else {
        str = 'Updated';
      }
      this.serverSuccess = true;
      this.serverSuccessMsg = data.name + ' ' + str;
      setTimeout(() => {
        this.serverSuccess = false;
        this.serverSuccessMsg = '';
      }, 2000);
      console.log(data);
      let idNew = data.id;
      let emmitedValue = data.name;
      this.discardFlag = true;
      switch (fieldName) {
        case 'certification-name':
          let index1 = this.certificationNameList.findIndex(option => option.id == idNew);
          if (index1 >= 0) {
            this.certificationNameList[index1].name = emmitedValue;
          }
          else {
            this.certificationNameList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.certificationNameList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.certificationNameList);
            this.form.patchValue({ certificationMasterId: idNew });
          }, 100);
          break;
        case 'certification-provider':
          let index2 = this.certificationProviderList.findIndex(option => option.id == idNew);
          if (index2 >= 0) {
            this.certificationProviderList[index2].name = emmitedValue;
          }
          else {
            this.certificationProviderList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.certificationProviderList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.certificationProviderList);
            this.form.patchValue({ certificationProviderId: idNew });
          }, 100);
          break;
        case 'training-name':
          let index3 = this.trainingNameList.findIndex(option => option.id == idNew);
          if (index3 >= 0) {
            this.trainingNameList[index3].name = emmitedValue;
          }
          else {
            this.trainingNameList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.trainingNameList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.trainingNameList);
            this.form.patchValue({ trainingNameMasterId: idNew });
          }, 100);

          break;
        case 'training-course':
          let index4 = this.trainingCourseList.findIndex(option => option.id == idNew);
          if (index4 >= 0) {
            this.trainingCourseList[index4].name = emmitedValue;
          }
          else {
            this.trainingCourseList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.trainingCourseList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.trainingCourseList);
            this.form.patchValue({ trainingCourseMasterId: idNew });
          }, 100);

          break;
        case 'training-track':
          let index5 = this.trainingTrackList.findIndex(option => option.id == idNew);
          if (index5 >= 0) {
            this.trainingTrackList[index5].name = emmitedValue;
          }
          else {
            this.trainingTrackList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.trainingTrackList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.trainingTrackList);
            this.form.patchValue({ trainingTrackMasterId: idNew });
          }, 100);

          break;
        case 'training-source':
          let index6 = this.trainingSourceList.findIndex(option => option.id == idNew);
          if (index6 >= 0) {
            this.trainingSourceList[index6].name = emmitedValue;
          }
          else {
            this.trainingSourceList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.trainingSourceList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.trainingSourceList);
            this.form.patchValue({ trainingSourceMasterId: idNew });
          }, 100);

          break;
        case 'organization-name':
          let oindex = this.OrganizationNameList.findIndex(option => option.id == idNew);
          if (oindex >= 0) {
            this.OrganizationNameList[oindex].name = emmitedValue;
          }
          else {
            this.OrganizationNameList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.OrganizationNameList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.OrganizationNameList);
            this.form.patchValue({ organisationsMasterId: idNew });
          }, 100);
          break;
        case 'certification-type':
          let index7 = this.certificationTypeList.findIndex(option => option.id == idNew);
          if (index7 >= 0) {
            this.certificationTypeList[index7].name = emmitedValue;
          }
          else {
            this.certificationTypeList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.certificationTypeList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.certificationTypeList);
            this.form.patchValue({ type: idNew });
          }, 100);

          // if (id == 0) {
          //   idNew = this.certificationTypeList.length + 1;
          //   this.certificationTypeList.splice(0, 1, { id: idNew, name: emmitedValue });
          //   this.certificationTypeList.splice(0, 0, { id: 0, label: `Add New` });
          // }
          // else {
          //   let index1 = this.certificationTypeList.findIndex(option => option.id == id);
          //   if (index1 >= 0) {
          //     this.certificationTypeList[index1].name = emmitedValue;
          //   }
          //   else {
          //     idNew = this.certificationTypeList.length + 1;
          //     this.certificationTypeList.splice(0, 1, { id: idNew, name: emmitedValue });
          //     this.certificationTypeList.splice(0, 0, { id: 0, label: `Add New` });
          //   }
          // }
          // setTimeout(() => {
          //   console.log(this.certificationTypeList);
          //   this.form.patchValue({ type: idNew });
          // }, 100);

          break;
        case 'certification-list':
          let index8 = this.certificationList.findIndex(option => option.id == idNew);
          if (index8 >= 0) {
            this.certificationList[index8].name = emmitedValue;
          }
          else {
            this.certificationList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.certificationList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.certificationList);
            this.form.patchValue({ certification: idNew });
          }, 100);

          break;
        case 'technology-type':
          let index10 = this.technologyTypeList.findIndex(option => option.id == idNew);
          if (index10 >= 0) {
            this.technologyTypeList[index10].name = emmitedValue;
          }
          else {
            this.technologyTypeList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.technologyTypeList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.technologyTypeList);
            this.form.patchValue({ type: idNew });
          }, 100);

          break;
        case 'technology-solution':
          let index11 = this.technologySolutionList.findIndex(option => option.id == idNew);
          if (index11 >= 0) {
            this.technologySolutionList[index11].name = emmitedValue;
          }
          else {
            this.technologySolutionList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.technologySolutionList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.technologySolutionList);
            this.form.patchValue({ solution: idNew });
          }, 100);


          break;
        case 'policies-type':
          let index112 = this.policiesTypeList.findIndex(option => option.id == idNew);
          if (index112 >= 0) {
            this.policiesTypeList[index112].name = emmitedValue;
          }
          else {
            this.policiesTypeList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.policiesTypeList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.policiesTypeList);
            this.form.patchValue({ type: idNew });
          }, 100);

          break;
        case 'policies-provider':
          let index113 = this.policiesProviderList.findIndex(option => option.id == idNew);
          if (index113 >= 0) {
            this.policiesProviderList[index113].name = emmitedValue;
          }
          else {
            this.policiesProviderList.splice(0, 1, { id: idNew, name: emmitedValue });
            this.policiesProviderList.splice(0, 0, { id: 0, label: `Add New` });
          }
          setTimeout(() => {
            console.log(this.policiesProviderList);
            this.form.patchValue({ provider: idNew });
          }, 100);

          break;
      }

    });
  }
  getList(type) {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.currentUser);
    apiFormData.append('networkId', this.networkId);
    switch (type) {
      case 'certification-name':
        apiFormData.append("type", '29');
        break;
      case 'certification-provider':
        apiFormData.append("type", '30');
        break;
      case 'training-name':
        apiFormData.append("type", '32');
        break;
      case 'training-course':
        apiFormData.append("type", '33');
        break;
      case 'training-track':
        apiFormData.append("type", '35');
        break;
      case 'training-source':
        apiFormData.append("type", '34');
        break;
      case 'organization-name':
        apiFormData.append("type", '31');
        break;
      case 'certification-type':
        apiFormData.append("type", '40');
        break;
      case 'certification-list':
        apiFormData.append("type", '41');
        break;
      case 'technology-type':
        apiFormData.append("type", '42');
        break;
      case 'technology-solution':
        apiFormData.append("type", '37');
        break;
      case 'policies-type':
        apiFormData.append("type", '38');
        break;
      case 'policies-provider':
        apiFormData.append("type", '39');
        break;
    }

    this.headQuarterService.getCommonList(apiFormData).subscribe((response: any) => {
      if (response.status == 'Success') {
        const resultData = response.items;

        switch (type) {
          case 'certification-name':
            this.certificationNameList = [];
            this.certificationNameList = resultData;
            this.certificationNameList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.cname.length > 0) {
                this.form.patchValue({ certificationMasterId: parseInt(this.item.cname[0]['id']) });
              }
            }, 1);
            break;
          case 'certification-provider':
            this.certificationProviderList = [];
            this.certificationProviderList = resultData;
            this.certificationProviderList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.cproviders.length > 0) {
                this.form.patchValue({ certificationProviderId: parseInt(this.item.cproviders[0]['id']) });
              }
            }, 1);
            break;
          case 'training-name':
            this.trainingNameList = [];
            this.trainingNameList = resultData;
            this.trainingNameList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.tname.length > 0) {
                this.form.patchValue({ trainingNameMasterId: parseInt(this.item.tname[0]['id']) });
              }
            }, 1);
            break;
          case 'training-course':
            apiFormData.append("type", '33');
            this.trainingCourseList = [];
            this.trainingCourseList = resultData;
            this.trainingCourseList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.course.length > 0) {
                this.form.patchValue({ trainingCourseMasterId: parseInt(this.item.course[0]['id']) });
              }
            }, 1);
            break;
          case 'training-track':
            apiFormData.append("type", '34');
            this.trainingTrackList = [];
            this.trainingTrackList = resultData;
            this.trainingTrackList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.track.length > 0) {
                this.form.patchValue({ trainingTrackMasterId: parseInt(this.item.track[0]['id']) });
              }
            }, 1);
            break;
          case 'training-source':
            apiFormData.append("type", '35');
            this.trainingSourceList = [];
            this.trainingSourceList = resultData;
            this.trainingSourceList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.source.length > 0) {
                this.form.patchValue({ trainingSourceMasterId: parseInt(this.item.source[0]['id']) });
              }
            }, 1);
            break;
          case 'organization-name':
            this.OrganizationNameList = [];
            this.OrganizationNameList = resultData;
            this.OrganizationNameList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.oname.length > 0) {
                this.form.patchValue({ organisationsMasterId: parseInt(this.item.oname[0]['id']) });
              }
            }, 1);
            break;
          case 'technology-type':
            apiFormData.append("type", '42');
            this.technologyTypeList = [];
            this.technologyTypeList = resultData;
            this.technologyTypeList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.type.length > 0) {
                this.form.patchValue({ type: parseInt(this.item.type[0]['id']) });
              }
            }, 1);
            break;
          case 'technology-solution':
            apiFormData.append("type", '37');
            this.technologySolutionList = [];
            this.technologySolutionList = resultData;
            this.technologySolutionList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.solution.length > 0) {
                this.form.patchValue({ solution: parseInt(this.item.solution[0]['id']) });
              }
            }, 1);
            break;
          case 'policies-type':
            apiFormData.append("type", '38');
            this.policiesTypeList = [];
            this.policiesTypeList = resultData;
            this.policiesTypeList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.type.length > 0) {
                this.form.patchValue({ type: parseInt(this.item.type[0]['id']) });
              }
            }, 1);
            break;
          case 'policies-provider':
            apiFormData.append("type", '39');
            this.policiesProviderList = [];
            this.policiesProviderList = resultData;
            this.policiesProviderList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.provider.length > 0) {
                this.form.patchValue({ provider: parseInt(this.item.provider[0]['id']) });
              }
            }, 1);
            break;
          case 'certification-type':
            apiFormData.append("type", '40');
            this.certificationTypeList = [];
            this.certificationTypeList = resultData;
            this.certificationTypeList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.type.length > 0) {
                this.form.patchValue({ type: parseInt(this.item.type[0]['id']) });
              }
            }, 1);
            break;
          case 'certification-list':
            apiFormData.append("type", '41');
            this.certificationList = [];
            this.certificationList = resultData;
            this.certificationList.splice(0, 0, { id: 0, label: `Add New` });
            setTimeout(() => {
              if (this.item && this.item?.certification.length > 0) {
                this.form.patchValue({ certification: parseInt(this.item.certification[0]['id']) });
              }
            }, 1);
            break;
        }
      }
    }
    );

  }

  getYearsList() {
    // this.certificationYearsList = [];
    for (let y = 1; y <= 20; y++) {
      this.certificationYearsList.push({
        id: y == 1 ? y + ' Year' : y + ' Years',
        name: y == 1 ? y + ' Year' : y + ' Years',
      });
    }
    if (this.item && this.item?.years) {
      this.form.patchValue({ years: parseInt(this.item.years) });
    }

  }

  inputChange(event) {
    if (event.target.value != '') {
      this.discardFlag = true;
    }
  }
  valueChanged(event, type, fieldTitle) {
    console.log(event, type)
    let value = event.value;
    if (value == 0) {
      this.updateName('', 0, fieldTitle, 'New', type);
    }
    else {
      this.discardFlag = true;
    }
  }

  changeFilter(type, value) {
    switch (type) {
      case 'cdate':
        value = moment(value).format('MMM DD, YYYY');
        this.miniumDate = new Date(value);
        this.discardFlag = true;
        break;
      case 'edate':
        value = moment(value).format('MMM DD, YYYY');
        this.maximumDate = new Date(value);
        this.discardFlag = true;
        break;
      case 'date':
        this.discardFlag = true;
        break;
    }
  }

  close() {
    if (this.discardFlag) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.activeModal.dismiss('Cross click');
        }
      });
    }
    else {
      this.activeModal.dismiss('Cross click');
    }


  }

  save() {
    this.serverError = false;
    this.serverErrorMsg = '';
    this.submitClicked = true;
    let editFlag = false;
    console.log(this.form.value)
    if (this.form.valid && !this.isSaved) {
      this.isSaved = true;

      let uploadCount = 0;
      this.mediaUploadItems = [];
      if (Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
        this.uploadedItems.attachments.forEach(item => {
          //console.log(item)
          if (item.accessType == 'media') {
            this.mediaUploadItems.push({ fileId: item.fileId.toString() });
          } else {
            uploadCount++;
          }
        });
      }

      this.bodyElem.classList.add(this.bodyClass1);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );

      const saveFormData = new FormData();
      saveFormData.append("apiKey", this.apiKey);
      saveFormData.append("domainId", this.domainId);
      saveFormData.append("userId", this.currentUser);
      saveFormData.append("networkId", this.networkId);

      //saveFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));

      for (let key in this.form.getRawValue()) {
        let val = this.form.getRawValue()[key];
        console.log(val);
        if (key == 'certificateOnDate' || key == 'certificateExpiryDate' || key == 'trainingDate' || key == 'edate' || key == 'cdate') {
          console.log(val, key);
          if (val) {
            //let date = new Date(val);
            //val = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            val = moment(val).format('YYYY-MM-DD');
          } else {
            val = '';
          }
        }
        if (this.shopTechnologyFlag || this.shopPoliciesFlag || this.shopCertificationFlag) {
          console.log(key, "key");

          if (key == 'type') {
            saveFormData.append('typeMasterId', val);
          }
          else if (key == 'solution') {
            saveFormData.append('solutionMasterId', val);
          }
          else if (key == 'provider') {
            saveFormData.append('providerMasterId', val);
          }
          else if (key == 'edate' && this.shopPoliciesFlag) {
            saveFormData.append('expiration', val);
          }
          else if (key == 'edate' && this.shopCertificationFlag) {
            saveFormData.append('expirationOn', val);
          } else if (key == 'limits') {
            saveFormData.append(key, val);
          }
          else if (key == 'cdate') {
            saveFormData.append('certifiedOn', val);
          }
          else if (key == 'years') {
            saveFormData.append('yearsCertified', val);
          }
          else if (key == 'certification') {
            saveFormData.append('certificationMasterId', val);
          }

        }
        else {
          saveFormData.append(key, val);
        }
      }
      if (this.item && this.item != null && this.item.id != undefined && this.item.id > 0) {
        editFlag = true;
        saveFormData.append("id", this.item.id);
      }
      if (editFlag) {
        if (!this.shopTechnologyFlag) {
          saveFormData.append('updatedAttachments', JSON.stringify(this.updatedAttachments));
          saveFormData.append('deletedFileIds', JSON.stringify(this.deletedFileIds));
        }


        let callAbleUrl;
        if (this.certificationFlag) {
          callAbleUrl = this.headQuarterService.updateCertification(saveFormData)
        }
        if (this.trainingFlag) {
          callAbleUrl = this.headQuarterService.updateTraining(saveFormData)
        }
        if (this.organizationFlag) {
          callAbleUrl = this.headQuarterService.updateOrganization(saveFormData)
        }
        if (this.shopTechnologyFlag) {
          callAbleUrl = this.headQuarterService.updateSystemTechnology(saveFormData)
        }
        if (this.shopPoliciesFlag) {
          callAbleUrl = this.headQuarterService.updateSubscriptionsPolicies(saveFormData)
        }
        if (this.shopCertificationFlag) {
          callAbleUrl = this.headQuarterService.updateShopCertification(saveFormData)
        }

        callAbleUrl.subscribe((response: any) => {
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass1);
          this.isSaved = false;
          console.log(response);
          if (response.code == 200) {
            if (Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
              this.postApiData['uploadedItems'] = this.uploadedItems.items;
              this.postApiData['attachments'] = this.uploadedItems.attachments;
              this.postApiData['message'] = '';
              this.postApiData['dataId'] = response.data.id;
              this.postApiData['actiontype'] = "edit";
              this.manageAction = 'uploading';
              this.postUpload = false;
              setTimeout(() => {
                this.postUploadActionTrue = true;
                this.postUpload = true;
              }, 100);
            }
            else {
              setTimeout(() => {
                response.data['upload'] = false;
                this.activeModal.close(response.data);
              }, 100);
            }
          }
          else {
            this.serverError = true;
            this.serverErrorMsg = response.message;
          }
        }, error => {
          this.isSaved = false;
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass1);
          this.serverError = true;
          this.serverErrorMsg = error.message;
        });
      }
      else {
        let callAbleUrl;
        if (this.certificationFlag) {
          callAbleUrl = this.headQuarterService.createCertification(saveFormData);
        }
        if (this.trainingFlag) {
          callAbleUrl = this.headQuarterService.createTraining(saveFormData)
        }
        if (this.organizationFlag) {
          callAbleUrl = this.headQuarterService.createOrganization(saveFormData)
        }
        if (this.shopTechnologyFlag) {
          callAbleUrl = this.headQuarterService.createShopTechnology(saveFormData)
        }
        if (this.shopPoliciesFlag) {
          callAbleUrl = this.headQuarterService.createSubscriptionPolicies(saveFormData)
        }
        if (this.shopCertificationFlag) {
          callAbleUrl = this.headQuarterService.createShopCertification(saveFormData)
        }


        callAbleUrl.subscribe((response: any) => {
          this.isSaved = false;
          console.log(response);
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass1);
          if (response.code == 200) {
            if (Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
              this.postApiData['uploadedItems'] = this.uploadedItems.items;
              this.postApiData['attachments'] = this.uploadedItems.attachments;
              this.postApiData['message'] = response.data.message;
              this.postApiData['dataId'] = response.data.id;
              this.postApiData['actiontype'] = "new";
              this.manageAction = 'uploading';
              this.postUpload = false;
              setTimeout(() => {
                this.postUploadActionTrue = true;
                this.postUpload = true;
              }, 100);
            }
            else {
              setTimeout(() => {
                response.data['upload'] = false;
                this.activeModal.close(response.data);
              }, 100);
            }
          }
          else {
            this.serverError = true;
            this.serverErrorMsg = response.message;
          }
        }, error => {
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass1);
          this.serverError = true;
          this.serverErrorMsg = error.message;
        });
      }

    }
  }

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName('hq-head')[0]) ? document.getElementsByClassName('hq-head')[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
  }

  attachments(items) {
    this.uploadedItems = items;
  }
  attachmentPopup(val = 0, type) {
    let postId = val;
    if (type == 'new') {
      postId = 0;
    }
    //(this.uploadedItems);
    let fitem = [];
    let mitem = [];
    let eitem = [];
    let ditem = [];
    let obj = {};
    this.postApiData = {
      action: 'new',
      access: 'userprofile-page',
      pageAccess: 'userprofile-page',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      networkId: this.networkId,
      platform: "3",
      countryId: '',
      userId: this.currentUser,
      threadId: '',
      postId: postId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: [],
      pushData: obj
    };

    if (this.uploadedItems != '') {
      if (this.uploadedItems.items.length > 0) {
        fitem = this.uploadedItems;
        this.postApiData['uploadedItems'] = this.uploadedItems.items;
        this.postApiData['attachments'] = this.uploadedItems.attachsments;
      }
    }
    mitem = this.attachmentsData;
    eitem = this.updatedAttachments;
    ditem = this.deletedFileIds;

    console.log(mitem);
    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.mediaAttachments = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.presetAttchmentItems = mitem;
    modalRef.componentInstance.updatedAttachments = eitem;
    modalRef.componentInstance.deletedFileIds = ditem;
    modalRef.componentInstance.addLinkFlag = true;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {

      console.log(receivedService);
      //(receivedService.uploadedItems);
      if (receivedService) {

        this.discardFlag = true;

        this.uploadedItems = receivedService.uploadedItems;
        this.attachmentsData = receivedService.editAttachments;
        this.deletedFileIds = receivedService.deletedFileIds;
        this.updatedAttachments = receivedService.updatedAttachments;

        if (this.uploadedItems != '') {
          if (this.uploadedItems.items.length > 0) {
            this.commentUploadedItemsLength = this.uploadedItems.items.length;
            this.commentUploadedItemsFlag = true;
          }
          else {
            this.commentUploadedItemsLength = 0;
            this.commentUploadedItemsFlag = false;
          }
        }
        else {
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
        }
        if (this.attachmentsData != '') {
          if (this.attachmentsData && this.attachmentsData.length > 0) {
            this.commentUploadedItemsLength = this.commentUploadedItemsLength + this.attachmentsData.length;
            this.commentUploadedItemsFlag = true;
          }
        }
      }
      else {
        if (this.uploadedItems.items.length > 0) {
          this.commentUploadedItemsLength = this.uploadedItems.items.length;
          this.commentUploadedItemsFlag = true;
        }
        else {
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
        }

        if (this.attachmentsData != '') {
          if (this.attachmentsData && this.attachmentsData.length > 0) {
            this.commentUploadedItemsLength = this.commentUploadedItemsLength + this.attachmentsData.length;
            this.commentUploadedItemsFlag = true;
          }
        }

      }
      // this.apiUrl.attachmentNewPOPUP = false;
      modalRef.dismiss('Cross click');

    });
  }
  ngOnDestroy(): void {
    document.body.classList.remove('add-modal-popup-manage');
  }


}

