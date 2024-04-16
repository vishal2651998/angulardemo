import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { KeyValue } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PrimeNGConfig } from 'primeng/api';
import * as moment from "moment";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-market-place-report-details',
  templateUrl: './market-place-report-details.component.html',
  styleUrls: ['./market-place-report-details.component.scss']
})
export class MarketPlaceReportDetailsComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass = 'landing-page';
  public bodyElem;
  public pageAccess = 'market-place-training';
  public headerData: object;
  msTeamAccess: boolean;
  public headerFlag = false;
  headTitle: string;
  editNoteMessage: string;
  defaultInfoType = [{
    type: 'paymentSummary',
    label: 'Payment Summary',
    imgSrc: 'assets/images/service-provider/Payment-Summary-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Summary.png',
    isVisible: true
  },
  {
    type: 'primaryContact',
    label: 'Primary Contact',
    imgSrc: 'assets/images/service-provider/user-vector-normal.png',
    imgSrcSelected: 'assets/images/service-provider/user-vector-selected.png',
    isVisible: false
  },
  // {
  //   type: 'RegisterUserInfo',
  //   label: 'Register User Info',
  //   imgSrc: 'assets/images/service-provider/Register-User-Info-Normal.png',
  //   imgSrcSelected: 'assets/images/service-provider/Register-User-Info.png',
  //   isVisible: false
  // },
   {
    type: 'shippingInfo',
    label: 'Shipping Info',
    imgSrc: 'assets/images/service-provider/Shipping-Info-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Shipping-Info.png',
    isVisible: true
  },
  {
    type: 'CardholderInfo',
    label: "Cardholder's info",
    imgSrc: 'assets/images/service-provider/card-grey.png',
    imgSrcSelected: 'assets/images/service-provider/cardholder_selection.png',
    isVisible: true
  }, {
    type: 'paymentDetails',
    label: 'Payment Details',
    imgSrc: 'assets/images/service-provider/Payment-Details-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true
  },
  {
    type: 'errorDetails',
    label: 'Payment Error Details',
    imgSrc: 'assets/images/service-provider/Payment-Details-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true
  },
  {
    type: 'refundDetails',
    label: 'Refund Details',
    imgSrc: 'assets/images/service-provider/Payment-Details-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true
  }
  ];
  transactionId: any;
  infoType: { type: string; label: string; imgSrc: string; imgSrcSelected: string; isVisible: boolean; }[];
  SelectedInfoType: string;
  transactionData: any;
  user: any;
  domainId: any;
  manualsData: any;
  trainingsData: any;
  participantsData: any;
  errorDetails: any;
  refundDetails: any;
  currentUserPaymentData: string;
  totalManualPrice: number;
  trainingsListDetails: any;
  manualsListDetails = [];
  shippingAddressDetails: {
    'First Name'; 'Last Name'; Email;
    'Phone Number';'dial Code'; 'Address 1'; 'Address 2'; State; City; Zip;
  };
  paymentAddressDetails: {
    'First Name'; 'Last Name'; Email;
    'Phone Number';'dial Code'; 'Address 1'; 'Address 2'; State; City; Zip;
  };
  paymentCols = ["authcode", "cc_number", "cc_type", "cc_exp", "currency", "date", "responsetext", "transactionid", "condition", "amount", "ipaddress", "surcharge", "amount_authorinzed", "first name"/* , "last name", "address", "postal code", "response_code", "type", "cvvresponse", "avsresponse", "processor_responsetext", "processor_response_code", "proessor_id", "warnings" */];
  paymentColNames = ["Authorization Code", "CC Number", "CC Type", "CC Expiration Date", "Currency", "Transaction Date", "Response", "Transaction ID", "Condition", "Amount", "Tip", "Surcharge", "Amount Authorized", "First Name"/* , "Last Name", "Address", "Postal Code", "Response Code", "Type", "CVV Response", "AVS Response", "Processor Response Text", "Processor Response Code", "Processor ID", "Warnings" */];
  showLoader: boolean;
  loadingmarketplacemore: boolean;
  public PopupVisible = false;
  public historyVisible = false;
  refundForm : FormGroup;
  editNoteDetails: any;
  editNotePopup: boolean;
  userId: any;
  priceValues:any;
  systemMsg: { severity: string; summary: string; detail: string; }[];
  refundedHistory: any;
  refundTransactionData: any;
  refundTransactionPopup: boolean;
  shippingCost: any;
  refundAllFlag: boolean;

  constructor(
    private route: ActivatedRoute,
    private threadApi: ThreadService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private titleService: Title 
  ) {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.msTeamAccess = false;
    this.headTitle = 'Report Details';
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: false,
      search: true,
    }
    this.transactionId = this.route.snapshot.params["id"];
    console.log(this.transactionId);
    this.setUserPaymentInfoData();
    this.refundForm = this.fb.group({
      'trainings': this.fb.array([]),
      'manuals': this.fb.array([])
    });
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}`
    );
  }

  setUserPaymentInfoData() {
    this.transactionData = [];
    this.infoType = [...this.defaultInfoType];
    this.SelectedInfoType = 'paymentSummary';
    this.infoType.map((res) => res.isVisible = true);
    this.infoType[1].isVisible = false;
    this.threadApi.apiGetAllRepots(this.domainId, 1, 0, '', '', '', this.transactionId).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.manualsData = response.data.manuals && response.data.manuals.length > 0 ? response.data.manuals : [];
        this.manualsData = this.manualsData.map((res)=>{
          res.actualPrice = parseFloat(res.actualPrice || 0);
          res.totalRefund = parseFloat(res.totalRefund || 0);
          res.refundedSalesTax = parseFloat(res.refundedSalesTax || 0);
          res.totalTaxRefundedPercent = res.salesTax ? this.roundNum((res.refundedSalesTax / parseFloat(res.salesTax)) * 100) : 0;
          res.totalPaidPrice = ((parseFloat(res.paidPrice || 0) ) * parseFloat(res.numberOfManuals)) + parseFloat(res.salesTax || 0)
          return res
        })
        this.participantsData = response.data.participants && response.data.participants.length > 0 ? response.data.participants : [];
        this.trainingsData = (response.data.trainings || []).map(data => {
          data.actual_price = parseFloat(data.actual_price || 0).toFixed(2);
          let totalRefund = 0;
          let totalTaxRefunded = 0;
          let participantsData = this.participantsData.filter(pt => pt.trainingId == data.trainingId).map((pt) => {
            let amountPaid = ((parseFloat(pt.paid_price || 0)) || 0);
            totalRefund += parseFloat(pt.totalRefund || 0);
            totalTaxRefunded += parseFloat(pt.refundedSalesTax || 0)
            return { ...pt, amountPaid: amountPaid }
          })
          let finalRefund = (totalRefund + totalTaxRefunded).toFixed(2) ; 
          return {
            ...data, participantsData: participantsData, totalRefund: totalRefund, totalTaxRefunded: totalTaxRefunded, totalTaxRefundedPercent: this.roundNum(data.salesTax ? ((totalTaxRefunded / parseFloat(data.salesTax)) * 100) : 0),
            remainingRefund: (parseFloat(data.actual_price) - (parseFloat(finalRefund) )) 
          }
        })
        this.transactionData = response.data.transaction;
        this.transactionData.shippingCost = parseFloat(this.manualsData?.find((ml)=>ml.isIncluded != 1)?.shippingCost || 0);
        this.transactionData.shippingTax = parseFloat(this.transactionData?.shippingTax || (this.manualsData && this.manualsData?.find((ml)=>ml.isIncluded != 1)?.shippingTax) || 0);
        this.transactionData.shippingTaxPercent = (this.transactionData?.shippingTax != 0 && this.transactionData.shippingCost != 0 ) ? (this.roundNum((this.transactionData?.shippingTax / (this.transactionData.shippingCost)) * 100)) : 0;
        if (!this.transactionData?.amount || this.transactionData?.amount == '0' || this.transactionData?.amount == '0.00' ) {
          this.infoType[3].isVisible = false;
          this.infoType[4].isVisible = false;
        }
        if (this.manualsData.length == 0) {
          this.infoType[2].isVisible = false;
        }
        if (this.trainingsData.length > 0) {
          this.infoType[1].isVisible = true;
        }
        // if (this.trainingsData.length == 0) {
        //   this.infoType[1].isVisible = false;
        // }
        if (this.trainingsData.length > 0 && this.trainingsData[0]?.isError == 1) {
          this.infoType[4].isVisible = false;
          this.errorDetails = this.trainingsData[0]?.errorResponseType == 'json' ?
            JSON.parse(this.trainingsData[0]?.errorResponse) : this.trainingsData[0]?.errorResponse;
        }
        else if (this.manualsData.length > 0 && this.manualsData[0]?.isError == 1) {
          this.infoType[4].isVisible = false;
          this.errorDetails = this.manualsData[0]?.errorResponseType == 'json' ?
            JSON.parse(this.manualsData[0]?.errorResponse) : this.manualsData[0]?.errorResponse;
        }
        else {
          this.infoType[5].isVisible = false;
        }
        if (this.trainingsData.length > 0 && this.trainingsData[0]?.refund_response) {
          this.refundDetails = JSON.parse(this.trainingsData[0]?.refund_response);
        }
        if (this.manualsData.length > 0 && this.manualsData[0]?.refund_response) {
          this.refundDetails = JSON.parse(this.manualsData[0]?.refund_response);
        }

        if ((this.manualsData.length > 0 && this.manualsData[0]?.refund_response) ||
          (this.trainingsData.length > 0 && this.trainingsData[0]?.refund_response)) {
          this.infoType[6].isVisible = true;
        } else {
          this.infoType[6].isVisible = false;
        }

        this.currentUserPaymentData = '';
        if (response?.data?.transaction.payment_response != '') {
          this.currentUserPaymentData = JSON.parse(response.data.transaction.payment_response);
        }
        if (this.manualsData.length > 0) {
          this.shippingAddressDetails = {
            'First Name': this.manualsData[0].firstName,
            'Last Name': this.manualsData[0].lastName,
            Email: this.manualsData[0].email,
            'Phone Number': this.manualsData[0].phoneNumber,
            'dial Code': this.manualsData[0].paymentDialCode,
            'Address 1': this.manualsData[0].shippingAddress1,
            'Address 2': this.manualsData[0].shippingAddress2,
            State: this.manualsData[0].shippingState,
            City: this.manualsData[0].shippingCity,
            Zip: this.manualsData[0].shippingZip
          };
          if (this.manualsData[0]?.originalPrice == '') {
            this.manualsData[0].originalPrice = 0;
            this.totalManualPrice = parseFloat(this.manualsData[0]?.shippingCost);
          } else {
            this.totalManualPrice = this.manualsData[0]?.discountPrice ? parseFloat(this.manualsData[0]?.discountPrice) : parseFloat(this.manualsData[0]?.originalPrice);
            this.totalManualPrice = this.totalManualPrice * parseFloat(this.manualsData[0]?.numberOfManuals);
            this.totalManualPrice = this.totalManualPrice + parseFloat(this.manualsData[0]?.salesTax) + parseFloat(this.manualsData[0]?.shippingCost);
          }
        }
        this.paymentAddressDetails = {
          'First Name': this.transactionData.payment_first_name,
          'Last Name': this.transactionData.payment_last_name,
          Email: this.transactionData.payment_email,
          'Phone Number': this.transactionData.payment_phoneNumber,
          'dial Code' : this.transactionData.payment_dialCode,
          'Address 1': this.transactionData.payment_address_1,
          'Address 2': this.transactionData.payment_address_2,
          State: this.transactionData.payment_state,
          City: this.transactionData.payment_city,
          Zip: this.transactionData.payment_zip
        };
        this.trainingsListDetails = {},
          this.manualsListDetails = [],
          this.trainingsData.forEach(element => {
            const temp = {};
            temp['No. Of Participants'] = this.participantsData.length;
            temp['Regular Price'] = `$${element.actual_price}`;
            if (element.bird_price != '') {
              let keyName = 'Discount Price (' + element.bird_percentage + '%) off';
              if (element.bird_price == element.bird_price_original) {
                keyName = 'Early Bird ' + keyName;
              }
              temp[keyName] = `${element.numberOfSeats} X ${element.bird_price}`;
            }
            this.trainingsListDetails = temp;
          });
        this.showLoader = false;
      }
      this.getSubTotal();
    }, (error: any) => {
      this.loadingmarketplacemore = false;
      this.showLoader = false;
      console.log('error: ', error);
    });

  }

  redirectToInnerDetailPage(id: any, type: string) {
    if (type == 'manual') window.open('market-place/view-manual/' + id, '_blank');
    else window.open('market-place/view/' + id, '_blank');
  }

  getInfoData(type: string) {
    this.SelectedInfoType = type;
  }

  unsorted = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0
  }
  applySearch(action, val) { }

  goBack() {
    this.router.navigateByUrl('market-place/reports');
  }

  getTrainings() {
    return this.refundForm.get('trainings') as FormArray
  }

  getManuals() {
    return this.refundForm.get('manuals') as FormArray
  }

  getParticipants(index: number): FormArray {
    return this.getTrainings().at(index)
      .get('participants') as FormArray;
  }

  openRefundForm(id, type, isSingleRefund = true, index = -1) {
    if (isSingleRefund) {
      this.getManuals().clear();
      this.getTrainings().clear();
      this.refundAllFlag = false;
    }
    if (type == 'all') {
      this.refundAllFlag = true;
      this.trainingsData.forEach((tr, ti) => {
        this.openRefundForm(tr.trainingId, 'training', false);
        tr.participantsData.forEach((pt, pi) => {
          setTimeout(() => {
            this.refundChange('training', 'refundPercentage', ti, pi, true)
          }, 200);
        });
        if (tr.participantsData.length > 1) {
          setTimeout(() => {
            this.refundChange('training', 'refundPercentage', ti, tr.participantsData.length, true)
          }, 200);
        }
      });

      this.manualsData.forEach((item, index) => {
        this.openRefundForm(item.manualId, 'manual', false, index);
        setTimeout(() => {
          this.refundChange('manual', 'refundPercentage', index, null, true)
        }, 200);
      });
      this.PopupVisible = true;
    }
    if (type == 'training') {
      let currTraining = this.trainingsData.find((item) => id == item.trainingId);
      this.getTrainings().push(this.fb.group({
        id: currTraining.id,
        trainingId: currTraining.trainingId,
        trainingName: currTraining.trainingName,
        noOfSeats: parseFloat(currTraining.numberOfSeats),
        participants: this.fb.array([])
      }))
      currTraining.participantsData.forEach((pt, pi) => {
        this.getParticipants(this.getTrainings().length - 1).push(this.fb.group({
          id: pt.id,
          name: pt.firstName && pt.lastName ? pt?.firstName + ' ' + pt.lastName : pt?.firstName || pt?.lastName || 'TBD',
          cancelled: new FormControl({ value: (pt.cancelled || !isSingleRefund), disabled: (pt.cancelled || !isSingleRefund) }),
          amountPaid: pt.amountPaid,
          refundedAmount: parseFloat(pt.totalRefund || 0),
          balanceAmount: pt.amountPaid - parseFloat(pt.totalRefund || 0),
          refund: 0,
          refundPercentage: isSingleRefund ? 0 : 100,
          note: pt.note || '',
          refundedSalesTax: 0,
          refundedSalesTaxPercent: 0,
          totalSalesTax: currTraining.salesTax ? (parseFloat(currTraining.salesTax) / parseFloat(currTraining.numberOfSeats)) - parseFloat(pt.refundedSalesTax|| 0): 0,
        }))
      })
      let allAmountPaid = 0, allRefundedAmount = 0, allTotalSalesTax = 0;
      this.getParticipants(this.getTrainings().length - 1).value.forEach(pt => {
        allAmountPaid += pt.amountPaid;
        allRefundedAmount += pt.refundedAmount;
        allTotalSalesTax += pt.totalSalesTax;
      })
      if (this.getParticipants(this.getTrainings().length - 1).length > 1) {
        this.getParticipants(this.getTrainings().length - 1).push(this.fb.group({
          name: 'All users',
          cancelled: new FormControl({ value: (!isSingleRefund), disabled: (!isSingleRefund) }),
          amountPaid: allAmountPaid,
          refundedAmount: allRefundedAmount,
          balanceAmount: allAmountPaid - allRefundedAmount,
          refund: 0,
          refundPercentage: isSingleRefund ? 0 : 100,
          note: '',
          refundedSalesTax: 0,
          refundedSalesTaxPercent: 0,
          totalSalesTax: allTotalSalesTax,
        }))
      }
    }
    else if (type == 'manual') {
      let currManual = this.manualsData[index];
      let amountPaid = (((parseFloat(currManual.paidPrice || 0) * parseFloat(currManual.numberOfManuals)) /* + parseFloat(currManual.salesTax || 0) */) || 0);
      this.getManuals().push(this.fb.group({
        manualId: currManual.manualId,
        id: currManual.id,
        manualName: currManual.manualName,
        bannerImageUrl: currManual.bannerImageUrl,
        cancelled: currManual.cancelled || false,
        amountPaid: amountPaid,
        refundedAmount: parseFloat(currManual.totalRefund || 0),
        balanceAmount: amountPaid - (parseFloat(currManual.totalRefund || 0)),
        refund: 0,
        refundPercentage: isSingleRefund ? 0 : 100,
        note: currManual.note || '',
        refundedSalesTax: 0,
        refundedSalesTaxPercent: 0,
        totalSalesTax: parseFloat(currManual.salesTax || 0) - parseFloat(currManual.refundedSalesTax || 0)
      }))
    }
    console.log(this.refundForm.value);
    if (isSingleRefund && type != 'all') this.PopupVisible = true;
  }

  editNote(type, note, index: number, subIndex = null) {
    this.editNoteDetails = { type: type, index: index, subIndex: subIndex, message : note };
    this.editNoteMessage = note;
    this.editNotePopup = true;
  }

  getData(type, index: number, subIndex = null) {
    let data;
    if (type == 'training') { data = this.getParticipants(index).at(subIndex) }
    if (type == 'manual') { data = this.getManuals().at(index); }
    return data;
  }

  salesTaxChanges(type, index: number, subIndex = null){
      let data = this.getData(type, index, subIndex);
      let totalTax = parseFloat(data.value.totalSalesTax) /* - parseFloat(data.value.refundedSalesTax) */;
      let refundP = parseFloat(data.value.refundPercentage || 0);
      data.controls['refundedSalesTaxPercent'].setValue(refundP);
      data.controls['refundedSalesTax'].setValue(this.roundNum((totalTax * refundP) / 100));
  }

  refundChange(type, field, index: number, subIndex = null, disableFields = false) {
    let data = this.getData(type, index, subIndex);
    if (field == 'refund') {
      if (!data.value.refund || (data.value.refund > data.value.balanceAmount)) {
        data.controls['refund'].setValue(0);
        data.controls['refundPercentage'].setValue(0);
      }
      else {
        data.controls['refundPercentage'].setValue(this.roundNum((data.value.refund / data.value.balanceAmount) * 100));
        data.controls['refund'].setValue(this.roundNum(data.value.refund));
      }
      this.salesTaxChanges(type, index, subIndex);
    } else if (field == 'refundPercentage') {
      if(data.value?.refundPercentage > 100){
        data.controls['refund'].setValue(0);
        data.controls['refundPercentage'].setValue(0);
      }
      else{
        data.controls['refund'].setValue(this.roundNum((data.value.refundPercentage / 100) * data.value.balanceAmount));
        data.controls['refundPercentage'].setValue(this.roundNum(data.value.refundPercentage));
        if(disableFields) {
          setTimeout(() => {
            data.controls['refund'].disable();
            data.controls['refundPercentage'].disable();
          }, 200);
        }
      }
      this.salesTaxChanges(type, index, subIndex);
    }
    // if (field == 'cancelled') {
    //   if (data.controls['cancelled'].value) {
    //     data.controls['refund'].enable();
    //     data.controls['refundPercentage'].enable();
    //     data.controls['refundPercentage'].setValue(this.roundNum(100.00));
    //     this.refundChange(type, 'refundPercentage', index, subIndex);
    //     data.controls['refund'].disable();
    //     data.controls['refundPercentage'].disable();
    //   }
    //   else {
    //     data.controls['refund'].enable();
    //     data.controls['refundPercentage'].enable();
    //     data.controls['refundPercentage'].setValue(0)
    //     this.refundChange(type, 'refundPercentage', index, subIndex) 
    //   }
    // }
    if (type != 'manual' && field != 'cancelled') {
      let ptValue = this.getParticipants(index).getRawValue();
      let refundTotal = this.getData(type, index, (ptValue.length == 1 ? 1 : ptValue.length - 1))
      if (refundTotal) {
        let totalTax = parseFloat(refundTotal.controls['totalSalesTax'].value);
        // let totalTax = parseFloat(data.controls['totalSalesTax'].value) - parseFloat(data.controls['refundedSalesTax'].value);
        let refundP = 0;
        ptValue.forEach((element, i) => {
          if ((ptValue.length == 1) || (i != (ptValue.length - 1)))
            refundP += parseFloat(element.refundPercentage);
        });
        refundP = parseFloat(this.roundNum(refundP / (ptValue.length == 1 ? 1 : ptValue.length - 1)));
        refundTotal.controls['refundedSalesTaxPercent'].setValue(refundP);
        refundTotal.controls['refundedSalesTax'].setValue(this.roundNum((totalTax * refundP) / 100));
      }
    }
    /* reflect change to fields if selected for all */
    this.changeToAll(type, field, index, subIndex);
  }

  roundNum(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  saveEditNote() {
    const { type, index, subIndex } = this.editNoteDetails;
    let data = this.getData(type, index, subIndex);
    data.get('note').setValue(this.editNoteMessage)
    this.editNoteMessage = '';
    this.editNotePopup = false;
  }

  closeRefundPopup() {
    this.PopupVisible = false;
  }

  processRefund() {
    let data = this.refundForm.getRawValue();
    let totalRefund = 0;
    data.trainings = data.trainings.map((tr, ti) => {
    let currTraining = this.trainingsData.find((item) => tr.trainingId == item.trainingId);
      return {
        trainingId: tr.trainingId,
        trainingMode: currTraining.trainingMode,
        participants: tr.participants.filter((pt, pi)=>((pi != (tr.participants.length - 1)) || tr.participants.length == 1) 
        && (parseFloat(pt.refund) || (pt.cancelled && (this.refundAllFlag
           || !((this.refundForm.get('trainings') as FormArray).at(ti).get('participants') as FormArray).at(pi).get('cancelled').disabled)))).map(pt => {
          totalRefund += (parseFloat(pt.refund) + parseFloat(pt.refundedSalesTax));
          return { id: pt.id, refundedSalesTax: pt.refundedSalesTax, refundedSalesTaxPercent: pt.refundedSalesTaxPercent, note: pt.note, refund: pt.refund, cancelled: pt.cancelled, fullyRefunded: pt.balanceAmount == pt.refund ? true : false }
        })
      };
    });
    data.trainings = data.trainings.filter((tr) => tr.participants.length > 0);
    data.manuals = data.manuals.filter((ml) =>parseFloat(ml.refund)).map(ml => {
      totalRefund += (parseFloat(ml.refund) + parseFloat(ml.refundedSalesTax));
      return { id: ml.id, refundedSalesTax: ml.refundedSalesTax, refundedSalesTaxPercent: ml.refundedSalesTaxPercent, note: ml.note, refund: ml.refund, cancelled: ml.cancelled, fullyRefunded: ml.balanceAmount == ml.refund ? true : false, manualId: ml.manualId }
    });
    let timezone_offset_minutes: any = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    let payLoad = {userId: this.userId, timeZoneMinutes: timezone_offset_minutes, domainId: this.domainId, transactions: [{ ...data, amount: totalRefund, id: this.transactionData.id, transactionId:  this.transactionData.transaction_id}]};
    if (totalRefund >= 1 || data.trainings.length > 0) {
      this.PopupVisible = false;
      this.showLoader = true;
      this.threadApi.apiForPartialRefundPayment(payLoad).subscribe((res) => {
        if (res.code == 200) {
          this.systemMsg = [{ severity: 'success', summary: '', detail: res.message || "Refund processed successfully" }];
          this.primengConfig.ripple = true;
          this.setUserPaymentInfoData();
          setTimeout(() => {
            this.systemMsg = [];
          }, 2000);
        }
      }, (error) => {
        this.PopupVisible = false;
        console.log(error);
        // if (error.status == 200) {
          this.systemMsg = [{ severity: '', summary: '', detail: error.message || 'Unexpected Error' }];
          this.primengConfig.ripple = true;
          this.setUserPaymentInfoData();
          setTimeout(() => {
            this.systemMsg = [];
          }, 2000);
        // }
      })
    } else {
      this.systemMsg = [{
        severity: 'success', summary: '',
        detail: this.refundForm.value?.trainings?.length > 0 ?
          'No training is Cancelled for any participant nor any Amount is selected to Refund' :
          "Minimun amount for refund is $1"
      }];
      this.primengConfig.ripple = true;
      setTimeout(() => {
        this.systemMsg = [];
      }, 3000);
    }
  }

  getSubTotal() {
    this.priceValues = {
      trainingSubTotal:0,
      trainingsalesTax:0,
      trainingTotal:0,
      trainingTotalRefund:0,
      trainingRefundedSalesTax:0,
      trainingRefundedSalesTaxPercent:0,
      manualSubTotal:0,
      manualsalesTax:0,
      manualTotal:0,
      manualTotalRefund:0,
      manualRefundedSalesTax:0,
      manualRefundedSalesTaxPercent:0,
      totalRefund:0,
      grandRefund:0,
      totalRefundedSalesTax:0,
      totalRefundedSalesTaxPercentage:0,
      balanceWithoutShipping:0
    }

    this.manualsData.forEach((res, index) => {
      if (res.paidPrice) {
        this.priceValues.manualSubTotal += (parseFloat(res.paidPrice)) * (parseFloat(res.numberOfManuals));
        this.priceValues.manualsalesTax += parseFloat(res.salesTax);
          this.priceValues.manualRefundedSalesTax += parseFloat(res.refundedSalesTax || 0);
          this.priceValues.manualRefundedSalesTaxPercent += parseFloat(res.refundedSalesTaxPercent || 0);
      }
      if(res.totalRefund){
        this.priceValues.manualTotalRefund += parseFloat(res.totalRefund || 0)
      }
    });
    if (this.priceValues.manualRefundedSalesTaxPercent) { this.priceValues.manualRefundedSalesTaxPercent = this.roundNum(this.priceValues.manualRefundedSalesTaxPercent / this.manualsData.length); }
    this.priceValues.manualTotal = this.priceValues.manualSubTotal + this.priceValues.manualsalesTax + parseFloat(this.manualsData[0]?.shippingCost) + parseFloat(this.transactionData.shippingTax || 0) ;

    this.trainingsData.forEach((res, index) => {
      if (res.paid_price) {
        this.priceValues.trainingSubTotal += (parseFloat(res.paid_price)) * (parseFloat(res.numberOfSeats));
      }
      if(res?.salesTax) {
        this.priceValues.trainingsalesTax += parseFloat(res?.salesTax) ;
      }
      if(res.totalRefund){
        this.priceValues.trainingTotalRefund += parseFloat(res.totalRefund || 0)
      }
      res.participantsData.forEach(pt => {
        this.priceValues.trainingRefundedSalesTax += parseFloat(pt.refundedSalesTax || 0);
      });
    });
    if (this.priceValues.trainingRefundedSalesTax) { this.priceValues.trainingRefundedSalesTaxPercent = this.roundNum((this.priceValues.trainingRefundedSalesTax / this.priceValues.trainingsalesTax) * 100); }
    if (this.priceValues.trainingRefundedSalesTax || this.priceValues.manualRefundedSalesTax) {
      this.priceValues.totalRefundedSalesTaxPercentage = this.roundNum((this.priceValues.trainingRefundedSalesTax + this.priceValues.manualRefundedSalesTax) / (this.priceValues.manualsalesTax + this.priceValues.trainingsalesTax) * 100)
    }
    this.priceValues.trainingTotal = this.priceValues.trainingSubTotal + this.priceValues.trainingsalesTax;
    this.priceValues.totalPaidAmount = parseFloat(this.transactionData.amount);
    this.priceValues.totalRefundedSalesTax = this.priceValues?.trainingRefundedSalesTax + this.priceValues?.manualRefundedSalesTax
    this.priceValues.totalRefund = this.priceValues?.trainingTotalRefund + this.priceValues?.manualTotalRefund;
    this.priceValues.grandRefund = this.priceValues?.totalRefundedSalesTax + this.priceValues?.totalRefund
    this.priceValues.balanceWithoutShipping = parseFloat(this.priceValues.totalPaidAmount) - Math.round((parseFloat(this.priceValues.grandRefund) + parseFloat((this.manualsData && this.manualsData?.find((ml)=>ml.isIncluded != 1)?.shippingCost) || 0) + parseFloat(this.transactionData.shippingTax || 0)) * 100) / 100;
  }

  changeToAll(type, field, index, subIndex) {
    if (type == 'training' && (this.getParticipants(index).length - 1) == subIndex) {
      const allData = this.getData(type, index, (this.getParticipants(index).length - 1));
      this.getParticipants(index).controls.forEach((el, i) => {
        if ((this.getParticipants(index).length - 1) != i) {
          let data = this.getData(type, index, i);
          if (field == 'cancelled' && !data.controls[field].disabled) {
            data.controls[field].setValue(allData.controls[field].value);
            // if (allData.controls[field].value) {
            //   data.controls['refund'].enable();
            //   data.controls['refundPercentage'].enable();
            //   data.controls['refundPercentage'].setValue(100.00)
            //   this.refundChange(type, 'refundPercentage', index, i)  
            //   data.controls['refund'].disable();
            //   data.controls['refundPercentage'].disable();
            // }
            // else{
            //   data.controls['refund'].enable();
            //   data.controls['refundPercentage'].enable();
            //   data.controls['refundPercentage'].setValue(0)
            //   this.refundChange(type, 'refundPercentage', index, i) 
            // }
          }
          else {
            data.controls['refundPercentage'].setValue(allData.controls['refundPercentage'].value)
            this.refundChange(type, 'refundPercentage', index, i)
          }
        }
      });
    }
  }

  getHistory(type = 'all', typeId = null) {
    this.historyVisible = true;
    let historyResponse = [];
    this.threadApi.apiForRefundHistory({ id: this.transactionData.id, typeId: typeId }).subscribe((res) => {
      historyResponse = res?.data;
      /* single participant history */
      if (type == 'training') {
        historyResponse = historyResponse.map((val, index) => {
          let currPart = this.participantsData.find((pt) => pt.id == val.typeId);
          return {
            ...val, firstName: currPart.firstName, lastName: currPart.lastName,
            paid_price: currPart.paid_price,
            salesTax: (((parseFloat(currPart.paid_price) * parseFloat(currPart.salesTaxPercent)) / 100))
          }
        });
        let TotalRefundedSalesTax = 0;
        let salesTax = parseFloat(historyResponse[0].salesTax)
        historyResponse.forEach((his, index) => {
          historyResponse[index].balance_amount = index == 0 ? his.paid_price - his.amount : historyResponse[index - 1].balance_amount - his.amount;
          TotalRefundedSalesTax += parseFloat(his.refundedSalesTax);
        });
        this.refundedHistory = {
          history: [...historyResponse], type: 'training', TotalRefundedSalesTax: TotalRefundedSalesTax,
          TotalRefundedSalesTaxPercent: (salesTax ? this.roundNum((TotalRefundedSalesTax / salesTax) * 100) : 0)
        };
      }
      /* All history */
      if (type == 'all') {
        /* trainings */
        let trainingsHistory = [];
        this.trainingsData.forEach((item) => {
          let currHistory = [];
          item.participantsData.forEach((pt) => {
          let balance_amount = parseFloat(pt.paid_price);
            historyResponse.forEach((his) => {
              if (his.typeId == pt.id) {
                balance_amount -= parseFloat(his.amount);
                currHistory.push({
                  ...his, name: pt?.firstName + pt.lastName, paid_price: pt.paid_price, balance_amount: balance_amount,
                  salesTax: (((parseFloat(pt.paid_price) * parseFloat(pt.salesTaxPercent)) / 100))
                });
              };
            });
          });
          if (currHistory.length > 0) {
            let TotalRefundedSalesTax = 0;
            let salesTax = parseFloat(item.salesTax)
            currHistory.forEach((his) => {
              TotalRefundedSalesTax += parseFloat(his.refundedSalesTax);
            });
            /* sort as per date */
            currHistory.sort((n1,n2)=> parseFloat(n1.id) - parseFloat(n2.id));
            trainingsHistory.push({
              history: currHistory, trainingId: item.trainingId, trainingName: item.trainingName, TotalRefundedSalesTax: TotalRefundedSalesTax,
              TotalRefundedSalesTaxPercent: (salesTax ? this.roundNum((TotalRefundedSalesTax / salesTax) * 100) : 0)
            });
          }
        })
        /* manuals */
        let manualsHistory = [];
        this.manualsData.forEach((item) => {
          let currHistory = [];
          let balance_amount = parseFloat(item.paidPrice);
          historyResponse.forEach((his)=>{
            if (his.typeId == item.id) {
                balance_amount -= parseFloat(his.amount);
                currHistory.push({
                  ...his, paid_price: item.paidPrice, balance_amount: balance_amount,
                  salesTax: (((parseFloat(item.paidPrice) * parseFloat(item.salesTaxPercent)) / 100))
                });
            };
          })
          if (currHistory.length > 0) {
            let TotalRefundedSalesTax = 0;
            let salesTax = parseFloat(item.salesTax)
            currHistory.forEach((his) => {
              TotalRefundedSalesTax += parseFloat(his.refundedSalesTax);
            });
            manualsHistory.push({
              history: currHistory, manualId: item.manualId, TotalRefundedSalesTax: TotalRefundedSalesTax,
              TotalRefundedSalesTaxPercent: (salesTax ? this.roundNum((TotalRefundedSalesTax / salesTax) * 100) : 0)
            });
          }
        })
        this.refundedHistory = {
          trainingsHistory: trainingsHistory, manualsHistory: manualsHistory, type: 'all'
        }
      }      
    }, (error) => {
      console.log(error);
    })
  }

  openTransactionPopup(data, id, name) {
    this.refundTransactionData = JSON.parse(data.apiResult);
    this.refundTransactionData.date = this.getDateTimeFormat(data.refundedOn);
    this.refundTransactionData.title = `Transaction Details: ${this.getDateTimeFormat(data.refundedOn)}, ID# ${id}, ${name}`;
    this.refundTransactionPopup = true;
  }

  getDateTimeFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY  h:mm A');
    } else {
      return '';
    }
  }

  resetControl(type, field, index: number, subIndex = null) {
    let data = this.getData(type, index, subIndex);
    if(!data.controls[field].value || data.controls[field].value == 0){
      data.controls[field].setValue('')
    }
  }
}
