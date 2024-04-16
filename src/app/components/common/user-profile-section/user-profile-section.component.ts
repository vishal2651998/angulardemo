import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserProfileSectionManageComponent } from '../../../components/common/user-profile-section-manage/user-profile-section-manage.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { MessageService } from 'primeng/api';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { Certificate } from 'crypto';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Constant } from 'src/app/common/constant/constant';
import { CommonService } from '../../../services/common/common.service';
import { retry } from 'rxjs/operators';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-user-profile-section',
  templateUrl: './user-profile-section.component.html',
  styleUrls: ['./user-profile-section.component.scss'],
  providers: [MessageService]
})
export class UserProfileSectionComponent implements OnInit, OnDestroy {

  @Input() profileSectionData;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public bodyClass: string = "userprofile-page";
  public bodyElem;
  subscription: Subscription = new Subscription();
  certificationDataArr = [];
  trainingDataArr = [];
  orgDataArr = [];

  shopCertificationDataArr = [];
  shopPoliciesDataArr = [];
  shopTechnologyDataArr = [];

  public certificationLoading: boolean = true;
  public trainingLoading: boolean = true;
  public organizationLoading: boolean = true;

  public shopCertificationLoading: boolean = true;
  public shopPoliciesLoading: boolean = true;
  public shopTechnologyLoading: boolean = true;

  public attachmentLoading: boolean = true;
  public attachmentsData: any;
  public action = "view";
  public attachments: any;

  public certificationFlag: boolean = false;
  public trainingFlag: boolean = false;
  public organizationFlag: boolean = false;

  public shopCertificationFlag: boolean = false;
  public shopPoliciesFlag: boolean = false;
  public shopTechnologyFlag: boolean = false;

  public pageAccess: string = '';

  public editUserId: any;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId = '';
  public platformId: string;
  public networkId: string = '';
  public certificationServerSuccess: boolean = false;
  public certificationServerSuccessMsg: string = '';
  public shopCertificationServerSuccess: boolean = false;
  public shopCertificationServerSuccessMsg: string = '';
  public serviceTechnologyServerSuccess: boolean = false;
  public serviceTechnologyServerSuccessMsg: string = '';
  public servicePoliciesServerSuccess: boolean = false;
  public servicePoliciesServerSuccessMsg: string = '';
  public trainingServerSuccess: boolean = false;
  public trainingServerSuccessMsg: string = '';
  public organizationServerSuccess: boolean = false;
  public organizationServerSuccessMsg: string = '';

  public currentUser;
  constructor(private messageService: MessageService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private headQuarterService: HeadquarterService,
    private route: ActivatedRoute,
    private commonApi: CommonService,) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.networkId = this.user.networkId;

    if (!this.route.snapshot.params.userid) {
      this.route.parent.paramMap.subscribe(params => {
        this.currentUser = params.get('id');
      })
    } else {
      this.currentUser = this.route.snapshot.params.userid
    }

    switch (this.profileSectionData.fieldname) {
      case 'certification':
        this.pageAccess = this.profileSectionData.page;
        if (this.pageAccess == 'shop-summary') {
          this.shopCertificationFlag = true;
          this.loadShopCertificationList();
        }
        else {
          this.certificationFlag = true;
          this.loadCertificationList();
        }
        break;
      case 'training':
        this.trainingFlag = true;
        this.pageAccess = this.profileSectionData.page;
        this.loadTrainingList();
        break;
      case 'organization':
        this.organizationFlag = true;
        this.pageAccess = this.profileSectionData.page;
        this.organizationList();
        break;
      case 'technology':
        this.shopTechnologyFlag = true;
        this.pageAccess = this.profileSectionData.page;
        this.shopTechnologyList();
        break;
      case 'policies':
        this.shopPoliciesFlag = true;
        this.pageAccess = this.profileSectionData.page;
        this.shopPoliciesList();
        break;

    }
  }

  loadCertificationList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("userId", this.currentUser);
    this.headQuarterService.getCertificationsList(apiFormData).subscribe((response: any) => {
      if (response.status == "success") {
        console.log(response);
        this.certificationDataArr = [];
        let data = response.data;
        this.setupDataCertification(data, 'init-load', 0);
      }
      else {
        setTimeout(() => {
          this.certificationLoading = false;
        }, 1);
      }
    });
  }

  setupDataCertification(item, type, index) {
    console.log(item);
    switch (type) {
      case 'init-load':
        item.forEach(items => {
          items.cname = items.certificationMasterArr;
          items.cproviders = items.certificationProviderArr;
          let cdate = moment(items.certificateOnDate).format('MMM DD, YYYY');
          items.certified = cdate;
          let edate = moment(items.certificateExpiryDate).format('MMM DD, YYYY');
          items.expiration = edate;
          items['uploadContents'] = items.uploadContents != undefined ? items.uploadContents : [];
          items['attachments'] = items.uploadContents;
          items["attachmentLoading"] = items.uploadContents.length > 0 ? false : true;
          items['moreVal'] = items.uploadContents.length > 4 ? items.uploadContents.length - 4 : 0;
          this.certificationDataArr.push(items);
        });
        setTimeout(() => {
          this.certificationLoading = false;
        }, 100);
        break;
      case 'new-load':
        item.cname = item.certificationMasterArr;
        item.cproviders = item.certificationProviderArr;
        let cdate1 = moment(item.certificateOnDate).format('MMM DD, YYYY');
        item.certified = cdate1;
        let edate1 = moment(item.certificateExpiryDate).format('MMM DD, YYYY');
        item.expiration = edate1;
        item['uploadContents'] = item.uploadContents != undefined ? item.uploadContents : [];
        item['attachments'] = item.uploadContents;
        item["attachmentLoading"] = item.uploadContents.length > 0 ? false : true;
        item['moreVal'] = item.uploadContents.length > 4 ? item.uploadContents.length - 4 : 0;
        this.certificationDataArr.unshift(item);
        break;
      case 'exist-load':
        this.certificationDataArr[index].cname = item.certificationMasterArr;
        this.certificationDataArr[index].cproviders = item.certificationProviderArr;
        let cdate11 = moment(item.certificateOnDate).format('MMM DD, YYYY');
        this.certificationDataArr[index].certified = cdate11;
        let edate11 = moment(item.certificateExpiryDate).format('MMM DD, YYYY');
        this.certificationDataArr[index].expiration = edate11;
        this.certificationDataArr[index]['uploadContents'] = this.certificationDataArr[index].uploadContents != undefined ? this.certificationDataArr[index].uploadContents : [];
        this.certificationDataArr[index].attachments = item.uploadContents;
        this.certificationDataArr[index].attachmentLoading = item.uploadContents.length > 0 ? false : true;
        this.certificationDataArr[index].moreVal = item.uploadContents.length > 4 ? item.uploadContents.length - 4 : 0;
        break;
    }
  }
  setupDataShopTechnologyList(item, type, index) {
    console.log(item);
    switch (type) {
      case 'init-load':
        item.forEach(items => {
          items.type = items.systemTechnologyTypeMasterArr;
          items.solution = items.systemTechnologySolutionMaterArr;
          this.shopTechnologyDataArr.push(items);
        });
        setTimeout(() => {
          this.shopTechnologyLoading = false;
        }, 100);
        break;
      case 'new-load':
        item.type = item.systemTechnologyTypeMasterArr;
        item.solution = item.systemTechnologySolutionMaterArr;
        this.shopTechnologyDataArr.unshift(item);
        break;
      case 'exist-load':
        this.shopTechnologyDataArr[index].type = item.systemTechnologyTypeMasterArr;
        this.shopTechnologyDataArr[index].solution = item.systemTechnologySolutionMaterArr;
        break;
    }
  }
  setupDataShopCertificationList(item, type, index) {
    console.log(item);
    switch (type) {
      case 'init-load':
        item.forEach(items => {
          items.type = items.shopCertificateTypeMasterArr;
          items.certification = items.shopCertificateMasterArr;
          let cdate = moment(items.certifiedOn).format('MMM DD, YYYY');
          items.certified = cdate;
          let edate = moment(items.expirationOn).format('MMM DD, YYYY');
          items.expiration = edate;
          let yearsCertified = items.yearsCertified.toString();
          if (!yearsCertified.includes('year')) {
            items.years = yearsCertified + (yearsCertified === '1' ? ' year' : ' years');
          } else {
            items.years = yearsCertified;
          }
          this.shopCertificationDataArr.push(items);
        });
        setTimeout(() => {
          this.shopCertificationLoading = false;
        }, 100);
        break;
      case 'new-load':
        item.type = item.shopCertificateTypeMasterArr;
        item.certification = item.shopCertificateMasterArr;
        let cdate1 = moment(item.certifiedOn).format('MMM DD, YYYY');
        item.certified = cdate1;
        let edate1 = moment(item.expirationOn).format('MMM DD, YYYY');
        item.expiration = edate1;
        item.years = item.yearsCertified
        this.shopCertificationDataArr.unshift(item);
        break;
      case 'exist-load':
        this.shopCertificationDataArr[index].type = item.shopCertificateTypeMasterArr;
        this.shopCertificationDataArr[index].certification = item.shopCertificateMasterArr;
        let cdate2 = moment(item.certifiedOn).format('MMM DD, YYYY');
        this.shopCertificationDataArr[index].certified = cdate2;
        let edate11 = moment(item.expirationOn).format('MMM DD, YYYY');
        this.shopCertificationDataArr[index].expiration = edate11;
        this.shopCertificationDataArr[index].years = item.yearsCertified
        break;
    }
  }
  setupDataShopPoliciesList(item, type, index) {
    console.log(item);
    switch (type) {
      case 'init-load':
        item.forEach(items => {
          items.type = items.subscriptionPoliciesTypeMasterArr;
          items.provider = items.subscriptionPoliciesProviderMasterArr;
          let edate1 = moment(item.expiration).format('MMM DD, YYYY');
          items.expiration = edate1;
          items.limits = items.limits;
          this.shopPoliciesDataArr.push(items);
        });
        setTimeout(() => {
          this.shopPoliciesLoading = false;
        }, 100);
        break;
      case 'new-load':
        item.type = item.subscriptionPoliciesTypeMasterArr;
        item.provider = item.subscriptionPoliciesProviderMasterArr;
        let edate11 = moment(item.expiration).format('MMM DD, YYYY');
        item.expiration = edate11;
        item.limits = item.limits;
        this.shopPoliciesDataArr.unshift(item);
        break;
      case 'exist-load':
        this.shopPoliciesDataArr[index].type = item.subscriptionPoliciesTypeMasterArr;
        this.shopPoliciesDataArr[index].provider = item.subscriptionPoliciesProviderMasterArr;
        let edate12 = moment(item.expiration).format('MMM DD, YYYY');
        this.shopPoliciesDataArr[index].expiration = edate12;
        this.shopPoliciesDataArr[index].limits = item.limits;
        break;
    }
  }

  loadTrainingList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("userId", this.currentUser);
    this.headQuarterService.getTrainingsList(apiFormData).subscribe((response: any) => {
      if (response.status == "success") {
        console.log(response);
        this.trainingDataArr = [];
        let data = response.data;
        this.setupTrainingData(data, 'init-load', 0);
      }
      else {
        setTimeout(() => {
          this.trainingLoading = false;
        }, 1);
      }
    });
  }

  setupTrainingData(item, type, index) {
    console.log(item);
    switch (type) {
      case 'init-load':
        item.forEach(items => {
          items.tname = items.trainingNameMasterArr;
          let tdate = items.trainingDate != undefined && items.trainingDate != '' ? moment(items.trainingDate).format('MMM DD, YYYY') : '';
          items.date = tdate;
          items.course = items.trainingCourseMasterArr;
          items.track = items.trainingTrackMasterArr;
          items.source = items.trainingSourceMasterArr;
          items['uploadContents'] = items.uploadContents != undefined ? items.uploadContents : [];
          items['attachments'] = items.uploadContents;
          items["attachmentLoading"] = items.uploadContents.length > 0 ? false : true;
          items['moreVal'] = items.uploadContents.length > 4 ? items.uploadContents.length - 4 : 0;
          this.trainingDataArr.push(items);
        });
        setTimeout(() => {
          this.trainingLoading = false;
        }, 100);
        break;
      case 'new-load':
        item.tname = item.trainingNameMasterArr;
        let tdate = item.trainingDate != undefined && item.trainingDate != '' ? moment(item.trainingDate).format('MMM DD, YYYY') : '';
        item.date = tdate;
        item.course = item.trainingCourseMasterArr;
        item.track = item.trainingTrackMasterArr;
        item.source = item.trainingSourceMasterArr;
        item['uploadContents'] = item.uploadContents != undefined ? item.uploadContents : [];
        item['attachments'] = item.uploadContents;
        item["attachmentLoading"] = item.uploadContents.length > 0 ? false : true;
        item['moreVal'] = item.uploadContents.length > 4 ? item.uploadContents.length - 4 : 0;
        this.trainingDataArr.unshift(item);
        break;
      case 'exist-load':
        this.trainingDataArr[index].tname = item.trainingNameMasterArr;
        let tdate1 = item.trainingDate != undefined && item.trainingDate != '' ? moment(item.trainingDate).format('MMM DD, YYYY') : '';
        this.trainingDataArr[index].date = tdate1;
        this.trainingDataArr[index].course = item.trainingCourseMasterArr;
        this.trainingDataArr[index].track = item.trainingTrackMasterArr;
        this.trainingDataArr[index].source = item.trainingSourceMasterArr;
        this.trainingDataArr[index]['uploadContents'] = this.orgDataArr[index].uploadContents != undefined ? this.orgDataArr[index].uploadContents : [];
        this.trainingDataArr[index].attachments = item.uploadContents;
        this.trainingDataArr[index].attachmentLoading = item.uploadContents.length > 0 ? false : true;
        this.trainingDataArr[index].moreVal = item.uploadContents.length > 4 ? item.uploadContents.length - 4 : 0;
        break;
    }
  }

  organizationList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("userId", this.currentUser);
    this.headQuarterService.getOrganisationsList(apiFormData).subscribe((response: any) => {
      if (response.code == 200) {
        console.log(response);
        this.orgDataArr = [];
        let data = response.data;
        this.setupDataOrganization(data, 'init-load', 0);
      }
      else {
        setTimeout(() => {
          this.organizationLoading = false;
        }, 1);
      }
    });
  }

  setupDataOrganization(item, type, index) {
    console.log(item);
    switch (type) {
      case 'init-load':
        item.forEach(items => {
          items.oname = items.organisationMasterArr != undefined ? items.organisationMasterArr : [];
          items.oid = items.organisationsID;
          items['uploadContents'] = items.uploadContents != undefined ? items.uploadContents : [];
          items['attachments'] = items.uploadContents;
          items["attachmentLoading"] = items.uploadContents.length > 0 ? false : true;
          items['moreVal'] = items.uploadContents.length > 4 ? items.uploadContents.length - 4 : 0;
          this.orgDataArr.push(items);
        });
        setTimeout(() => {
          this.organizationLoading = false;
        }, 100);
        break;
      case 'new-load':
        item.oname = item.organisationMasterArr != undefined ? item.organisationMasterArr : [];
        item.oid = item.organisationsID;
        item['uploadContents'] = item.uploadContents != undefined ? item.uploadContents : [];
        item['attachments'] = item.uploadContents;
        item["attachmentLoading"] = item.uploadContents.length > 0 ? false : true;
        item['moreVal'] = item.uploadContents.length > 4 ? item.uploadContents.length - 4 : 0;
        this.orgDataArr.unshift(item);
        break;
      case 'exist-load':
        this.orgDataArr[index].oname = item.organisationMasterArr != undefined ? item.organisationMasterArr : [];
        this.orgDataArr[index].oid = item.organisationsID;
        this.orgDataArr[index]['uploadContents'] = this.orgDataArr[index].uploadContents != undefined ? this.orgDataArr[index].uploadContents : [];
        this.orgDataArr[index].attachments = item.uploadContents;
        this.orgDataArr[index].attachmentLoading = item.uploadContents.length > 0 ? false : true;
        this.orgDataArr[index].moreVal = item.uploadContents.length > 4 ? item.uploadContents.length - 4 : 0;
        break;
    }
  }

  loadShopCertificationList() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.currentUser
    }

    this.headQuarterService.getShopCertificationsList(apiData).subscribe((response: any) => {
      if (response.status == "success") {
        console.log(response);
        this.shopCertificationDataArr = [];
        let data = response.data;
        this.setupDataShopCertificationList(data, 'init-load', 0);
      }
    }, (error) => {
      console.error('HTTP Error:', error);
      this.shopCertificationLoading = false;

    });

  }

  shopTechnologyList() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.currentUser
    }

    this.headQuarterService.getShopTechnologyList(apiData).subscribe((response: any) => {
      if (response.status == "success") {
        console.log(response);
        this.shopTechnologyDataArr = [];
        let data = response.data;
        this.setupDataShopTechnologyList(data, 'init-load', 0);
      }
    });
  }

  shopPoliciesList() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.currentUser
    }

    this.headQuarterService.getShopPoliciesList(apiData).subscribe((response: any) => {
      if (response.status == "success") {
        console.log(response);
        this.shopPoliciesDataArr = [];
        let data = response.data;
        this.setupDataShopPoliciesList(data, 'init-load', 0);
      }
    });
  }

  deleteItem(id, title) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'NDelete';
    modalRef.componentInstance.title = "Delete " + title;
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if (receivedService) {
        this.deleteConfirm(id, title);
      }
    });
  }

  deleteConfirm(id, title) {
    const saveFormData = new FormData();
    saveFormData.append("apiKey", Constant.ApiKey);
    saveFormData.append("domainId", this.domainId);
    saveFormData.append("userId", this.currentUser);
    saveFormData.append("networkId", this.networkId);
    saveFormData.append("id", id);

    switch (title) {
      case 'certification':
        if (this.pageAccess != 'shop-summary') {
          this.headQuarterService.deleteCertification(saveFormData).subscribe((response: any) => {
            console.log(response);
            if (response.code == 200) {
              let cIndex = this.certificationDataArr.findIndex(option => option.id == id);
              this.certificationDataArr.splice(cIndex, 1);
              this.certificationServerSuccess = true;
              this.certificationServerSuccessMsg = response.message;
              setTimeout(() => {
                this.certificationServerSuccess = false;
                this.certificationServerSuccessMsg = '';
              }, 2000);
            }
            else {
              this.certificationServerSuccess = true;
              this.certificationServerSuccessMsg = response.message;
              setTimeout(() => {
                this.certificationServerSuccess = false;
                this.certificationServerSuccessMsg = '';
              }, 2000);
            }
          });
        } else {
          this.headQuarterService.deleteShopCertification(saveFormData).subscribe((response: any) => {
            console.log(response);
            if (response.code == 200) {
              let cIndex = this.shopCertificationDataArr.findIndex(option => option.id == id);
              this.shopCertificationDataArr.splice(cIndex, 1);
              this.shopCertificationServerSuccess = true;
              this.shopCertificationServerSuccessMsg = response.message;
              setTimeout(() => {
                this.shopCertificationServerSuccess = false;
                this.shopCertificationServerSuccessMsg = '';
              }, 2000);
            }
            else {
              this.shopCertificationServerSuccess = true;
              this.shopCertificationServerSuccessMsg = response.message;
              setTimeout(() => {
                this.shopCertificationServerSuccess = false;
                this.shopCertificationServerSuccessMsg = '';
              }, 2000);
            }
          });
        }

        break;
      case 'training':
        this.headQuarterService.deleteTraining(saveFormData).subscribe((response: any) => {
          console.log(response);
          if (response.code == 200) {
            let cIndex = this.trainingDataArr.findIndex(option => option.id == id);
            this.trainingDataArr.splice(cIndex, 1);
            this.trainingServerSuccess = true;
            this.trainingServerSuccessMsg = response.message;
            setTimeout(() => {
              this.trainingServerSuccess = false;
              this.trainingServerSuccessMsg = '';
            }, 2000);
          }
          else {
            this.trainingServerSuccess = true;
            this.trainingServerSuccessMsg = response.message;
            setTimeout(() => {
              this.trainingServerSuccess = false;
              this.trainingServerSuccessMsg = '';
            }, 2000);
          }
        });
        break;
      case 'organization':
        this.headQuarterService.deleteOrganization(saveFormData).subscribe((response: any) => {
          console.log(response);
          if (response.code == 200) {
            let cIndex = this.orgDataArr.findIndex(option => option.id == id);
            this.orgDataArr.splice(cIndex, 1);
            this.organizationServerSuccess = true;
            this.organizationServerSuccessMsg = response.message;
            setTimeout(() => {
              this.organizationServerSuccess = false;
              this.organizationServerSuccessMsg = '';
            }, 2000);
          }
          else {
            this.organizationServerSuccess = true;
            this.organizationServerSuccessMsg = response.message;
            setTimeout(() => {
              this.organizationServerSuccess = false;
              this.organizationServerSuccessMsg = '';
            }, 2000);
          }
        });
        break;
      case 'technology':
        this.headQuarterService.deleteSystemTechnology(saveFormData).subscribe((response: any) => {
          console.log(response);
          if (response.code == 200) {
            let cIndex = this.shopTechnologyDataArr.findIndex(option => option.id == id);
            this.shopTechnologyDataArr.splice(cIndex, 1);
            this.serviceTechnologyServerSuccess = true;
            this.serviceTechnologyServerSuccessMsg = response.message;
            setTimeout(() => {
              this.serviceTechnologyServerSuccess = false;
              this.serviceTechnologyServerSuccessMsg = '';
            }, 2000);
          }
          else {
            this.serviceTechnologyServerSuccess = true;
            this.serviceTechnologyServerSuccessMsg = response.message;
            setTimeout(() => {
              this.serviceTechnologyServerSuccess = false;
              this.serviceTechnologyServerSuccessMsg = '';
            }, 2000);
          }
        });
        break;
      case 'policies':
        this.headQuarterService.deleteSubscriptionsPolicies(saveFormData).subscribe((response: any) => {
          console.log(response);
          if (response.code == 200) {
            let cIndex = this.shopPoliciesDataArr.findIndex(option => option.id == id);
            this.shopPoliciesDataArr.splice(cIndex, 1);
            this.servicePoliciesServerSuccess = true;
            this.servicePoliciesServerSuccessMsg = response.message;
            setTimeout(() => {
              this.servicePoliciesServerSuccess = false;
              this.servicePoliciesServerSuccessMsg = '';
            }, 2000);
          }
          else {
            this.servicePoliciesServerSuccess = true;
            this.servicePoliciesServerSuccessMsg = response.message;
            setTimeout(() => {
              this.servicePoliciesServerSuccess = false;
              this.servicePoliciesServerSuccessMsg = '';
            }, 2000);
          }
        });
        break;
    }
  }

  togglePopup(item, title) {
    let popupSize: string = 'lg';

    if (!document.body.classList.contains('add-modal-popup-manage')) {
      document.body.classList.add('add-modal-popup-manage');
    }
    const modalRef = this.modalService.open(UserProfileSectionManageComponent, { backdrop: 'static', keyboard: true, centered: true, size: popupSize, windowClass: '' });
    modalRef.componentInstance.fieldName = title;
    modalRef.componentInstance.currentUser = this.currentUser;
    modalRef.componentInstance.pageAccess = this.pageAccess;
    let poptitle = title;
    if (title == 'technology') {
      poptitle = 'Systems/Technology';
    }
    if (title == 'policies') {
      poptitle = 'Subscription / Policies';
    }
    modalRef.componentInstance.headText = (item != null ? 'Edit' : 'New') + ' ' + poptitle;
    modalRef.componentInstance.saveText = item ? 'Update' : 'Save';
    modalRef.componentInstance.item = item;
    modalRef.result.then(res => {
      console.log(res);
      if (!res.upload) {
        let str = '';
        if (item && item != null) {
          str = 'Updated';
        }
        else {
          str = 'Added';
        }
        switch (title) {
          case 'certification':
            if (this.pageAccess != 'shop-summary') {
              this.certificationServerSuccess = true;
              this.certificationServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
              setTimeout(() => {
                this.certificationServerSuccess = false;
                this.certificationServerSuccessMsg = '';
              }, 2000);
              if (res.id > 0) {
                let cIndex = this.certificationDataArr.findIndex(option => option.id == res.id);
                if (cIndex >= 0) {
                  this.setupDataCertification(res, 'exist-load', cIndex);
                }
                else {
                  this.setupDataCertification(res, 'new-load', 0);
                }
              }
              else {
                this.loadCertificationList();
              }
            }
            else {
              this.shopCertificationServerSuccess = true;
              this.shopCertificationServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
              setTimeout(() => {
                this.shopCertificationServerSuccess = false;
                this.shopCertificationServerSuccessMsg = '';
              }, 2000);
              if (res.id > 0) {
                let tIndex = this.shopCertificationDataArr.findIndex(option => option.id == res.id);
                if (tIndex >= 0) {
                  this.setupDataShopCertificationList(res, 'exist-load', tIndex);
                }
                else {
                  this.setupDataShopCertificationList(res, 'new-load', 0);
                }
              }
              else {
                this.loadShopCertificationList();
              }
            }
            break;
          case 'training':
            this.trainingServerSuccess = true;
            this.trainingServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            setTimeout(() => {
              this.trainingServerSuccess = false;
              this.trainingServerSuccessMsg = '';
            }, 2000);
            if (res.id > 0) {
              let tIndex = this.trainingDataArr.findIndex(option => option.id == res.id);
              if (tIndex >= 0) {
                this.setupTrainingData(res, 'exist-load', tIndex);
                //this.loadTrainingList();        
              }
              else {
                this.setupTrainingData(res, 'new-load', 0);
                //this.loadTrainingList(); 
              }
            }
            else {
              this.loadTrainingList();
            }
            break;
          case 'organization':
            this.organizationServerSuccess = true;
            this.organizationServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            setTimeout(() => {
              this.organizationServerSuccess = false;
              this.organizationServerSuccessMsg = '';
            }, 2000);
            if (res.id > 0) {
              let cIndex = this.orgDataArr.findIndex(option => option.id == res.id);
              if (cIndex >= 0) {
                this.setupDataOrganization(res, 'exist-load', cIndex);
                //this.organizationList();        
              }
              else {
                this.setupDataOrganization(res, 'new-load', 0);
                //this.organizationList(); 
              }
            }
            else {
              this.organizationList();
            }
            break;
          case 'technology':
            this.serviceTechnologyServerSuccess = true;
            this.serviceTechnologyServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            setTimeout(() => {
              this.serviceTechnologyServerSuccess = false;
              this.serviceTechnologyServerSuccessMsg = '';
            }, 2000);
            if (res.id > 0) {
              let tIndex = this.shopTechnologyDataArr.findIndex(option => option.id == res.id);
              if (tIndex >= 0) {
                this.setupDataShopTechnologyList(res, 'exist-load', tIndex);
                //this.loadTrainingList();        
              }
              else {
                this.setupDataShopTechnologyList(res, 'new-load', 0);
                //this.loadTrainingList(); 
              }
            }
            else {
              this.shopTechnologyList();
            }
            break;
          case 'policies':
            this.servicePoliciesServerSuccess = true;
            this.servicePoliciesServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            setTimeout(() => {
              this.servicePoliciesServerSuccess = false;
              this.servicePoliciesServerSuccessMsg = '';
            }, 2000);
            if (res.id > 0) {
              let tIndex = this.shopPoliciesDataArr.findIndex(option => option.id == res.id);
              if (tIndex >= 0) {
                this.setupDataShopPoliciesList(res, 'exist-load', tIndex);
              }
              else {
                this.setupDataShopPoliciesList(res, 'new-load', 0);
              }
            }
            else {
              this.shopPoliciesList();
            }

            // if (res[4] != null && res[4] != '') {
            //   let createdOnDate = res[4];
            //   res[4] = moment(createdOnDate).format('MMM DD, YYYY');
            // }
            // const servicePolicies = {};
            // servicePolicies['id'] = res[0];
            // servicePolicies['type'] = res[1];
            // servicePolicies['provider'] = res[2];
            // servicePolicies['limits'] = res[3];
            // servicePolicies['expiration'] = res[4] != null && res[4] != '' ? res[4] : '';

            // let pIndex = this.shopPoliciesDataArr.findIndex(option => option.id == servicePolicies['id']);

            // if (pIndex >= 0) {
            //   this.shopPoliciesDataArr[pIndex].type = servicePolicies['type'];
            //   this.shopPoliciesDataArr[pIndex].provider = servicePolicies['provider'];
            //   this.shopPoliciesDataArr[pIndex].limits = servicePolicies['limits'];
            //   this.shopPoliciesDataArr[pIndex].expiration = servicePolicies['expiration'];
            // }
            // else {
            //   servicePolicies['id'] = this.shopPoliciesDataArr.length + 1;
            //   this.shopPoliciesDataArr.unshift(servicePolicies);
            // }
            // console.log(this.shopPoliciesDataArr);

            // console.log(res);
            break;
        }
      }
      else {
        let str = '';
        if (item.actiontype == 'edit') {
          str = 'Updated';
        }
        else {
          str = 'Added';
        }
        switch (title) {
          case 'certification':
            if (this.pageAccess != 'shop-summary') {
              this.certificationServerSuccess = true;
              this.certificationServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
              this.loadCertificationList();
              setTimeout(() => {
                this.certificationServerSuccess = false;
                this.certificationServerSuccessMsg = '';
              }, 2000);
            } else {
              this.shopCertificationServerSuccess = true;
              this.shopCertificationServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
              this.loadShopCertificationList();
              setTimeout(() => {
                this.shopCertificationServerSuccess = false;
                this.shopCertificationServerSuccessMsg = '';
              }, 2000);

            }
            break;
          case 'training':
            this.trainingServerSuccess = true;
            this.trainingServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            this.loadTrainingList();
            setTimeout(() => {
              this.trainingServerSuccess = false;
              this.trainingServerSuccessMsg = '';
            }, 2000);
            break;
          case 'organization':
            this.organizationServerSuccess = true;
            this.organizationServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            this.organizationList();
            setTimeout(() => {
              this.organizationServerSuccess = false;
              this.organizationServerSuccessMsg = '';
            }, 2000);
            break;
          case 'technology':
            this.serviceTechnologyServerSuccess = true;
            this.serviceTechnologyServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            this.shopTechnologyList();
            setTimeout(() => {
              this.serviceTechnologyServerSuccess = false;
              this.serviceTechnologyServerSuccessMsg = '';
            }, 2000);
            break;
          case 'policies':
            this.servicePoliciesServerSuccess = true;
            this.servicePoliciesServerSuccessMsg = poptitle + ' ' + str + ' Successfully';
            this.shopPoliciesList();
            setTimeout(() => {
              this.servicePoliciesServerSuccess = false;
              this.servicePoliciesServerSuccessMsg = '';
            }, 2000);
            break;
        }
      }
      //this.messageService.add({ severity: 'success', summary: title + ' ' + (item ? 'updated' : 'added'), closable: false, life: 2500 });
      //}
    });

  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.bodyElem.classList.remove(this.bodyClass);
    document.body.classList.remove('add-modal-popup-manage');

  }

}
