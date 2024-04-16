import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {
  atgTheme: string = "";
  type: string;
  policyContent: string;
  modifiedBy: string;
  modifiedByImage: string;
  modifiedOn: string;
  policyName: string;
  policyTags: string;
  policyTagsList: any[];
  loading: boolean;
  policies: any[];
  manualId: any;
  trainingId: any;
  threadApiData: any;
  pageLoading: boolean;
  manualPayablePrice: number;
  trainingData: any;
  manualData: any;
  scrollImages: any = [];
  registrationImage: string;
  defaultDiscountPercentage: any;
  defaultDiscountPrice: any;
  payablePrice: any;
  openTraining: boolean;
  registrationImageHeight: string;
  registrationImageWidth: string;
  pendingUsersToRegister: number;
  shippingCost: number;
  shippingTax: number;
  defaultShippingCost: number;
  salesTax: number;
  salesTaxPercent: number;
  isManualDeleted: boolean;
  constructor(private route: ActivatedRoute, public threadApi: ThreadService, private sanitized: DomSanitizer) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.params["type"];
    this.trainingId = this.route.snapshot.queryParams["trainingId"];
    this.manualId = this.route.snapshot.queryParams["manualId"];
    if (this.trainingId && this.trainingId != 'null') {
      this.getTrainigDetails();
    }
    else if (this.manualId && this.manualId != 'null') {
      this.getManualDetails();
    }
    this.getPolicy();
  }

  transformHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

  getPolicy() {
    this.threadApi.apiMarketPlacePoliciesDataByType(this.type).subscribe((res: any) => {
      if (res.status == "Success") {
        this.policyContent = "";
        this.modifiedBy = "";
        this.modifiedByImage = "";
        this.modifiedOn = "";
        this.policyName = "";
        this.policyTags = "";
        this.policyTagsList = [];
        if (res && res.status == 'Success' && res.policy) {
          this.policyContent = res.policy.content;
          this.policyName = res.policy.name;
          this.policyTags = res.policy.tags;
          this.policyTagsList = res.policy.tagsList.map((item) => item.name);
          this.modifiedBy = res.policy.modified_by_name;
          this.modifiedByImage = res.policy.modified_by_image;
          this.modifiedOn = res.policy.modified_on;
        }
        this.loading = false;
      } else {
        this.loading = false;
        this.policies = [];
      }
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }

  getTrainigDetails() {
    this.threadApi.apiInnerGetMarketPlaceEditData({ threadId: this.trainingId }).subscribe((response) => {
      if (response.status == 'Success') {
        this.trainingData = response.data.marketPlaceData;
        this.trainingData.description = this.threadApi.urlify(this.trainingData.description);


        if (this.trainingData.isSold == '0' && this.trainingData.isClosed == '0') {
          this.registrationImage = "assets/images/service-provider/registration-open.png";
          this.registrationImageWidth = '150';
          this.registrationImageHeight = '50';
          this.openTraining = true;
        } else if (this.trainingData.isSold == '0' && this.trainingData.isClosed == '1') {
          this.registrationImage = "assets/images/service-provider/training-closed.png";
          this.registrationImageWidth = '73';
          this.registrationImageHeight = '75';
          this.openTraining = false;
        } else if (this.trainingData.isSold == '1' && this.trainingData.isClosed == '0') {
          this.registrationImage = "assets/images/service-provider/training-sold-out.png";
          this.registrationImageWidth = '85';
          this.registrationImageHeight = '46';
          this.openTraining = false;
        } else if (this.trainingData.isSold == '1' && this.trainingData.isClosed == '1') {
          this.registrationImage = "assets/images/service-provider/training-closed.png";
          this.registrationImageWidth = '73';
          this.registrationImageHeight = '75';
          this.openTraining = false;
        }
        this.pendingUsersToRegister = parseInt(this.trainingData.maxParticipants) - parseInt(this.trainingData.signedupUsers ? this.trainingData.signedupUsers : '0');
        this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;

      }
      this.pageLoading = false;
    }, (error: any) => {
      this.pageLoading = false;
    })

  }



  getManualDetails() {
    this.threadApi.apiInnerGetManualEditData({threadId: this.manualId}).subscribe((response) => {
      if (response.status == 'Success') {
        this.manualData = response.data.marketPlaceData;
        this.manualData.description = this.threadApi.urlify(this.manualData.description);

        // this.domainData = response.data.businessDomainData;
        // this.domainurl = 'https://' + this.domainData.subdomainurl + '.collabtic.com/marketplace/detail';

        if (!this.manualData.attachments || this.manualData.attachments.length < 4) {
          let pushCount: any = 4 - this.scrollImages.length;
          for (let index = 0; index < pushCount; index++) {
            this.scrollImages.push({
              previewImageSrc: "assets/images/service-provider/training-blank-" + (index + 1) + ".png",
              thumbnailImageSrc: "assets/images/service-provider/training-blank-" + (index + 1) + ".png",
              isVideo: false,
              fileType: 'image/png',
            })
          }
        }
        this.openTraining = true;
        this.payablePrice = this.manualData.price && this.manualData.price != '0' ? this.manualData.price : 0;
        if (!this.payablePrice) {
          this.shippingCost = 0;
          this.shippingTax = 0;
          this.salesTax = 0;
          this.salesTaxPercent = 0;
        } else {
          this.shippingCost = this.defaultShippingCost;
        }
        if (this.manualData && this.manualData?.isActive != "1") {
          this.isManualDeleted = true;
        }
      }
      this.pageLoading = false;
    }, (error: any) => {
      this.pageLoading = false;
    })
  }




  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }


  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A');
    } else {
      return '';
    }
  }

  getStartDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD');
    } else {
      return '';
    }
  }


  checkBirdPriceAvailablity(date: any) {
    let currentDate: any = new Date();
    currentDate.setHours(0, 0, 0, 0)
    let checkDate: any = new Date(date);
    checkDate.setHours(0, 0, 0, 0)
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }

}
