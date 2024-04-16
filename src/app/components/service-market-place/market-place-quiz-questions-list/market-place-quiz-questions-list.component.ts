import { Component, OnInit, ViewChild, OnDestroy, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage, DefaultNewImages, ContentTypeValues, DefaultNewCreationText, MarketPlaceText } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../services/landingpage/landingpage.service';
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ThreadService } from "src/app/services/thread/thread.service";
import { NgxMasonryComponent } from "ngx-masonry";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuccessModalComponent } from "../../common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../common/submit-loader/submit-loader.component";

@Component({
  selector: "app-market-place-quiz-questions-list",
  templateUrl: "./market-place-quiz-questions-list.component.html",
  styleUrls: ["./market-place-quiz-questions-list.component.scss"],
  styles: [
    `
      .masonry-item {
        width: 238px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class MarketPlaceQuizQuestionsListComponent implements OnInit, OnDestroy {
  public title: string = "Market Place Training";
  public sconfig: PerfectScrollbarConfigInterface = {};
  serviceProviderData: any = [];
  public headTitle: string = "";
  public filterInitFlag: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public expandFlag: boolean = true;
  public filterActiveCount: number = 0;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  pageAccess: string = "market-place-quiz";
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public updateMasonryLayout: any;
  public pageData = pageInfo.marketPlacePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "market-place/manage";
  public groupId: number = 2;
  public threadTypesort = "sortthread";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;
  loading: any =false;
  manageTitle: any = `${ManageTitle.actionNew} ${MarketPlaceText.quiz}`;
  buttonTitle: any = 'Save';
  public thumbView: boolean = true;
  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public searchVal;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public access: string;
  public msTeamAccessMobile: boolean = false;
  scrollCallback: boolean;
  scrollTop: any;
  lastScrollTop: any = 0;
  scrollInit: number = 0;
  questionTotalRecords: any;
  dataLimit: any = 20;
  dataOffset: any = 0;
  loadingmarketplacemore: boolean = false;
  pageTitleText = PageTitleText.MarketPlace;
  redirectionPage = RedirectionPage.MarketPlace;
  displayNoRecordsShow = 3;
  contentTypeDefaultNewImg = DefaultNewImages.MarketPlace;
  contentTypeValue = ContentTypeValues.MarketPlace;
  contentTypeDefaultNewText = DefaultNewCreationText.MarketPlace;
  contentTypeDefaultNewTextDisabled: boolean = false;
  partsUrl: string = "market-place/manage/";
  questions: any = [];
  totalRecords: any = 0;
  quizSubmit = false;
  quizFormValid = false;
  quizForm: FormGroup;
  selectedTopicName: any = [];
  topicsOptions: any = [];
  Models: any = [];
  Makes: any = [];
  Years: any = [];
  makeList: any = [];
  public modelDisable:boolean = true;
  public modelLoading:boolean = false;
  public modalState = 'new';
  public modelPlaceHoder = "Select";
  showOptions: any = false;
  selectedOptions: any = 'Multiple Choice - Single Answer';
  uploadedItems: any = [];
  public manageAction: string;
  public newPartInfo: string = "Get started by tapping on \"New Training\"";
  displayModal: any = false;
  postApiData: any;
  contentType: any = 44;
  displayOrder: any = 0;
  public EditAttachmentAction: string = "attachments";
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  actionFlag: any = false;
  showTopicError: any = false;
  topicValue: any = '';
  topicSubmitted: boolean = false;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  quizSingleData: any;
  currentQuizId: any;
  multiSelectOptionsValue: any = [];
  copyQuiz: any = false;
  currentTopicId: any = 'all';
  displayViewModal: any = false;
  questionCurrentData: any;
  currentQuestionOptions: any;
  optionValue: any;
  topicLabel: any;
  systemInfo: any;
  topicDataOfQuestion: any;
  loadingSubmitForm: any = false;
  topicFormValue: any = [];

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (
        inHeight >= totalHeight &&
        parseInt(this.questionTotalRecords) > this.questions.length
      ) {
        this.loadingmarketplacemore = true;
        this.dataOffset += this.dataLimit;
        this.loadQuestions();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.updateMasonryLayout = true;
  }
  @HostListener('document:click', ['$event'])
  clickout() {
    this.showOptions = false;
  }

  constructor(
    private threadApi: ThreadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private LandingpagewidgetsAPI: LandingpageService,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    this.currentTopicId = this.activatedRoute.snapshot.params["type"];
    if (this.currentTopicId && this.currentTopicId != 'all') {
      this.topicDetails();
    } else {
      this.topicLabel = 'All Questions';
    }
    const empty = [];
    this.quizForm = this.formBuilder.group({
      topicName: ['', [Validators.required]],
      make: [''],
      model: [''],
      options: ['', [Validators.required]],
      option1: ['', [Validators.required]],
      option2: ['', [Validators.required]],
      option3: ['', [Validators.required]],
      option4: ['', [Validators.required]],
      option5: ['', [Validators.required]],
      multiSelectOptions: [''],
      yesNoOptions: [''],
      year: [''],
      question: ['', [Validators.required]],
      questionRequired: [false],
      points: ['', [Validators.required]]
    });
  }

  get quizControls() { return this.quizForm.controls; }

  ngOnInit(action = '') {
    this.msTeamAccess = false;
    this.msTeamAccessMobile = false;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.headTitle = "Marketplace";
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}s`
    );
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.thumbView = true;
    let threadViewType:any = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = threadViewType;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    this.postApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      action: action,
      threadAction:  ''
    };
    this.loadQuestions();
    this.getProductMakeList();
    this.getYearsList();
    this.listTopicOptions();
    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      searchKey: this.searchVal,
      historyFlag: this.historyFlag,
      pushAction: false
    };
    this.apiData = apiInfo;
    this.filterOptions["apiKey"] = Constant.ApiKey;
    this.filterOptions["userId"] = this.userId;
    this.filterOptions["domainId"] = this.domainId;
    this.filterOptions["countryId"] = this.countryId;
    let viewType = this.thumbView ? "thumb" : "list";
    this.filterOptions["threadViewType"] = viewType;
    let year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    setTimeout(() => {
      this.apiData["groupId"] = this.groupId;
      this.apiData["mediaId"] = 0;
      this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
      this.filterInterval = setInterval(() => {
        let filterWidget = localStorage.getItem("filterWidget");
        let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
        if (filterWidget) {
          this.filterOptions = filterWidgetData.filterOptions;
          this.apiData = filterWidgetData.apiData;
          this.threadFilterOptions = this.apiData["filterOptions"];
          this.apiData["onload"] = true;
          this.threadFilterOptions = this.apiData["onload"];
          this.filterActiveCount = filterWidgetData.filterActiveCount;
          this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
          this.apiData["filterOptions"] = this.apiData["filterOptions"];
          this.apiData["filterOptions"]["action"] = action;
          this.commonService.emitMessageLayoutrefresh(
            this.apiData["filterOptions"]
          );
          this.filterLoading = false;
          this.filterOptions["filterLoading"] = this.filterLoading;
          clearInterval(this.filterInterval);
          localStorage.removeItem("filterWidget");
          localStorage.removeItem("filterData");
        }
      }, 50);
    }, 1500);
    setTimeout(() => {
      let chkData = localStorage.getItem('threadPushItem');
      let data = JSON.parse(chkData);
      if(data) {
        data.action = 'silentCheck';
      }
    }, 15000);
  }

  attachments(items) {
    this.uploadedItems = items;
  }

  topicDetails() {
    this.threadApi.apigetTopicSingleData(this.currentTopicId).subscribe((response: any) => {
      if(response.status == 'Success') {
        this.topicLabel = response.data.topicData.topic_name
      }
    }, (error: any) => {
      console.log("error: ", error);
    })
  }

  attachmentAction(data) {
    console.log(data);
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

        console.log(this.updatedAttachments);
        break;
    }
  }

  getProductMakeList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    this.LandingpagewidgetsAPI.getProductMakeListsAPI(apiFormData).subscribe(
      (response) => {
        if (response.status == 'Success') {
          const resultData = response.modelData;
          this.makeList = resultData;
        }
      }
    );
  }

  getYearsList() {
    const year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.Years.push({
        id: y,
        name: y.toString(),
      });
    }
  }

  getMakeModelsList(makeName, access = '') {
    this.modelLoading = true;
    this.modelDisable = true;
    const apiInfo = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      displayOrder: 0,
      type: 1,
      makeName,
      offset: '',
      limit: '',
    };
    this.LandingpagewidgetsAPI.getMakeModelsList(apiInfo).subscribe(
      (response) => {
        this.modelDisable = (access == 'vin') ? true : false;
        this.modelLoading = false;
        this.Models = response?.modelData;
        setTimeout(() => {
          this.modelPlaceHoder = 'Select';
        }, 50);
      }
    );
  }

  loadQuestions() {
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: localStorage.getItem('domainId'),
      topic_id: this.currentTopicId === 'all' ? null : this.currentTopicId,
    }
    console.log("payload: ", payload);
    this.scrollInit = 1;
    this.threadApi.apiGetQuizData(payload).subscribe((response: any) => {
      if (response.status == 'Success') {
        if (response && response.data && response.data.quizData && response.data.quizData.length) {
          response.data.quizData.forEach((data: any) => {
            this.questions.push(data);
          });
        }
        this.questionTotalRecords = response?.data?.totalRecords;
      }
    }, (error: any) => {
      console.log("error: ", error);
    })
  }

  rediretToNew() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/market-place/manage'])
    );
    window.open(url, '_blank');
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY')
    } else {
      return '';
    }
  }
  getDateFormatStartDate(value: any) {
    if (value) {
      return moment(value).format('MMM DD')
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A')
    } else {
      return '';
    }
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 200);
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }
  expandDomainAction(event: any) {
    console.log(event);
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 200);
  }
  applyFilter(filterData,loadpush='') {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      if(loadpush) {
        filterData["loadAction"] = 'push';
        this.apiData['pushAction'] = true;
        let filterOptionData = this.filterOptions['filterData'];
        if(filterData.startDate != undefined || filterData.startDate != 'undefined') {
          let sindex = filterOptionData.findIndex(option => option.selectedKey == 'startDate');
          if(sindex >= 0) {
            filterOptionData[sindex].value = filterData.startDate;
          }
          let eindex = filterOptionData.findIndex(option => option.selectedKey == 'endDate');
          if(eindex >= 0) {
            filterOptionData[eindex].value = filterData.endDate;
          }
        }
      }
      this.apiData["filterOptions"] = filterData;
      setTimeout(() => {
        filterData["loadAction"] = '';
      }, 500);
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
      let viewType = this.thumbView ? "thumb" : "list";
      filterData["threadViewType"] = viewType;
      filterData["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(filterData);
      setTimeout(() => {
        this.filterLoading = false;
      }, 1000);
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem("threadFilter");
    this.ngOnInit('reset');
    //this.commonService.emitMessageLayoutrefresh('');
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
    this.applyFilter(getFilteredValues,event);
  }

  filterCheck(){
    this.filterrecords = false;
    if(this.pageRefresh['orderBy'] != 'desc'){
      this.filterrecords = true;
    }
    if(this.pageRefresh['type'] != 'sortthread'){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  navPart() {
    let url = this.newThreadUrl;
    window.open(url, IsOpenNewTab.teamOpenNewTab);
  }

  mainPage() {
    this.router.navigateByUrl('market-place');
  }

  quizTopicsPage() {
    this.router.navigateByUrl('market-place/quiz-topics');
  }

  innerDetailPage() {
    this.router.navigateByUrl('market-place/training');
  }

  viewDetail(id: any) {
    this.router.navigateByUrl('market-place/view/'+ id);
  }

  ngOnDestroy() {
  }

  saveQuiz() {
    if (this.quizForm.valid) {
      this.loadingSubmitForm = true;
      this.quizSubmit = false;
      const quizFromValue = this.quizForm.value;
      let answerOption: any;
      if (this.selectedOptions == 'Multiple Choice - Single Answer') {
        answerOption = [
          {
            optionValue: quizFromValue.option1,
            isCorrect: quizFromValue.options.includes("option1") ? true : false,
          },
          {
            optionValue: quizFromValue.option2,
            isCorrect: quizFromValue.options.includes("option2") ? true : false,
          },
          {
            optionValue: quizFromValue.option3,
            isCorrect: quizFromValue.options.includes("option3") ? true : false,
          },
          {
            optionValue: quizFromValue.option4,
            isCorrect: quizFromValue.options.includes("option4") ? true : false,
          },
          {
            optionValue: quizFromValue.option5,
            isCorrect: quizFromValue.options.includes("option5") ? true : false,
          }
        ];
      } else if (this.selectedOptions == 'Multiple Choice - Multiple Answers') {
        answerOption = [
          {
            optionValue: quizFromValue.option1,
            isCorrect: quizFromValue.multiSelectOptions.includes("option1") ? true : false,
          },
          {
            optionValue: quizFromValue.option2,
            isCorrect: quizFromValue.multiSelectOptions.includes("option2") ? true : false,
          },
          {
            optionValue: quizFromValue.option3,
            isCorrect: quizFromValue.multiSelectOptions.includes("option3") ? true : false,
          },
          {
            optionValue: quizFromValue.option4,
            isCorrect: quizFromValue.multiSelectOptions.includes("option4") ? true : false,
          },
          {
            optionValue: quizFromValue.option5,
            isCorrect: quizFromValue.multiSelectOptions.includes("option5") ? true : false,
          }
        ];
      } else if (this.selectedOptions == 'Yes/No') {
        answerOption = [
          {
            optionValue: "Yes",
            isCorrect: quizFromValue.yesNoOptions.includes("Yes") ? true : false,
          },
          {
            optionValue: "No",
            isCorrect: quizFromValue.yesNoOptions.includes("No") ? true : false,
          }
        ];
      } else {
        answerOption = [];
      }
      const body: any = {
        topicName: quizFromValue.topicName,
        make: quizFromValue.make,
        model: quizFromValue.model,
        answer_options: JSON.stringify(answerOption),
        year: quizFromValue.year,
        question_type: this.selectedOptions,
        question: quizFromValue.question,
        questionRequired: quizFromValue.questionRequired ? quizFromValue.questionRequired : false,
        points: quizFromValue.points,
        mediaAttachments: JSON.stringify(this.attachmentItems),
        userId: this.userId,
        domainId: this.domainId
      }
      let url = this.threadApi.createQuiz(body);
      if (this.currentQuizId && !this.copyQuiz) {
        body.id = this.currentQuizId;
        url = this.threadApi.updateQuiz(body);
      }
      url.subscribe((response: any) => {
        if (response.status == 'Success') {
          this.displayModal = false;
          this.questions = [];
          this.loadQuestions();
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = response.message;
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
          }, 2000);
          this.loadingSubmitForm = false;
        }
      },(error: any) => {
        console.log("error: ", error);
        this.loadingSubmitForm = false;
      })
    } else {
      this.quizSubmit = true;
    }
  }

  isVideo(ext :any) {
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }
  openQuestionPopup() {
    this.attachmentItems = [];
    this.currentQuizId = null;
    this.selectedOptions = 'Multiple Choice - Single Answer';
    this.displayModal = true;
    this.quizSubmit = false;
    this.quizForm.reset();
  }

  openDelete(question: any) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = "DeleteEntity";
    modalRef.componentInstance.deleteEntityName = question.question;
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteQuiz(question.id);
      }
    });
  }

  deleteQuiz(id: any) {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    this.threadApi.deleteQuiz(id).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.modalConfig
      );
      msgModalRef.componentInstance.successMessage = response.message;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        this.questions = [];
        this.loadQuestions();
      }, 2000);
    });
  }

  setQuizPopup(event: any) {
    this.quizSubmit = false;
    this.quizForm.reset();
    this.currentQuizId = null;
    this.selectedOptions = 'Multiple Choice - Single Answer';
    this.displayModal = event;
    this.buttonTitle = 'Save';
  }
  openTopicPopup() {
    this.actionFlag = true;
    this.topicSubmitted = false;
    this.showTopicError = false;
  }
  submitTopic() {
    if (this.topicValue) {
      this.topicSubmitted = false;
      this.showTopicError = false;
      let body = {
        topic_name: this.topicValue,
        userId: this.userId
      }
      this.threadApi.createQuizTopic(body).subscribe((response: any) => {
        if (response.status == 'Success') {
          this.actionFlag = false;
          this.listTopicOptions();
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = response.message;
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
          }, 2000);
        }
      },(error: any) => {
        console.log("error: ", error);
      })
    } else {
      this.showTopicError = true;
      this.topicSubmitted = true;
    }
  }

  listTopicOptions() {
    this.threadApi.listQuizTopic().subscribe((response: any) => {
      this.topicsOptions = response.data ? response.data : [];
    },(error: any) => {
      console.log("error: ", error);
    })
  }

  setValidationForForm() {
    if (this.selectedOptions == 'Multiple Choice - Single Answer') {
      this.quizForm.patchValue({
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
      });
      this.quizForm.get('options').setValidators([Validators.required]);
      this.quizForm.get('multiSelectOptions').clearValidators();
      this.quizForm.get('yesNoOptions').clearValidators();
      this.quizForm.get('options').setValidators([Validators.required]);
      this.quizForm.get('option1').setValidators([Validators.required]);
      this.quizForm.get('option2').setValidators([Validators.required]);
      this.quizForm.get('option3').setValidators([Validators.required]);
      this.quizForm.get('option4').setValidators([Validators.required]);
      this.quizForm.get('option5').setValidators([Validators.required]);
      this.quizForm.get('multiSelectOptions').updateValueAndValidity();
      this.quizForm.get('yesNoOptions').updateValueAndValidity();
      this.quizForm.get('options').updateValueAndValidity();
      this.quizForm.get('option1').updateValueAndValidity();
      this.quizForm.get('option2').updateValueAndValidity();
      this.quizForm.get('option3').updateValueAndValidity();
      this.quizForm.get('option4').updateValueAndValidity();
      this.quizForm.get('option5').updateValueAndValidity();
    } else if (this.selectedOptions == 'Multiple Choice - Multiple Answers') {
      this.quizForm.patchValue({
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
      });
      this.quizForm.get('multiSelectOptions').setValidators([Validators.required]);
      this.quizForm.get('options').clearValidators();
      this.quizForm.get('yesNoOptions').clearValidators();
      this.quizForm.get('option1').setValidators([Validators.required]);
      this.quizForm.get('option2').setValidators([Validators.required]);
      this.quizForm.get('option3').setValidators([Validators.required]);
      this.quizForm.get('option4').setValidators([Validators.required]);
      this.quizForm.get('option5').setValidators([Validators.required]);
      this.quizForm.get('multiSelectOptions').updateValueAndValidity();
      this.quizForm.get('yesNoOptions').updateValueAndValidity();
      this.quizForm.get('options').updateValueAndValidity();
      this.quizForm.get('option1').updateValueAndValidity();
      this.quizForm.get('option2').updateValueAndValidity();
      this.quizForm.get('option3').updateValueAndValidity();
      this.quizForm.get('option4').updateValueAndValidity();
      this.quizForm.get('option5').updateValueAndValidity();
    } else if (this.selectedOptions == 'Yes/No') {
      this.quizForm.patchValue({
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
      });
      this.quizForm.get('yesNoOptions').setValidators([Validators.required]);
      this.quizForm.get('multiSelectOptions').clearValidators();
      this.quizForm.get('options').clearValidators();
      this.quizForm.get('option1').clearValidators();
      this.quizForm.get('option2').clearValidators();
      this.quizForm.get('option3').clearValidators();
      this.quizForm.get('option4').clearValidators();
      this.quizForm.get('option5').clearValidators();
      this.quizForm.get('multiSelectOptions').updateValueAndValidity();
      this.quizForm.get('yesNoOptions').updateValueAndValidity();
      this.quizForm.get('options').updateValueAndValidity();
      this.quizForm.get('option1').updateValueAndValidity();
      this.quizForm.get('option2').updateValueAndValidity();
      this.quizForm.get('option3').updateValueAndValidity();
      this.quizForm.get('option4').updateValueAndValidity();
      this.quizForm.get('option5').updateValueAndValidity();
    } else {
      this.quizForm.patchValue({
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
      });
      this.quizForm.get('yesNoOptions').clearValidators();
      this.quizForm.get('multiSelectOptions').clearValidators();
      this.quizForm.get('options').clearValidators();
      this.quizForm.get('option1').clearValidators();
      this.quizForm.get('option2').clearValidators();
      this.quizForm.get('option3').clearValidators();
      this.quizForm.get('option4').clearValidators();
      this.quizForm.get('option5').clearValidators();
      this.quizForm.get('multiSelectOptions').updateValueAndValidity();
      this.quizForm.get('yesNoOptions').updateValueAndValidity();
      this.quizForm.get('options').updateValueAndValidity();
      this.quizForm.get('option1').updateValueAndValidity();
      this.quizForm.get('option2').updateValueAndValidity();
      this.quizForm.get('option3').updateValueAndValidity();
      this.quizForm.get('option4').updateValueAndValidity();
      this.quizForm.get('option5').updateValueAndValidity();
    }
  }

  viewCurrentQuestion(questionData: any) {
    this.displayViewModal = true;
    this.currentQuestionOptions = null;
    this.questionCurrentData = questionData;
    let topic_value: any = [];
    questionData.topic_data?.forEach((topic: any) => {
      topic_value.push(topic.name);
    });
    this.topicDataOfQuestion = topic_value.toString();
    this.systemInfo = {
      header: false,
      userInfo: {
        createdBy: questionData?.createdByName,
        createdOn: this.getDateTimeFormat(questionData?.created_on),
        updatedBy: questionData?.updatedByName,
        updatedOn: this.getDateTimeFormat(questionData?.updated_on),
      }
    }
    this.optionValue = null;
    this.currentQuestionOptions = questionData.answer_options ? JSON.parse(questionData.answer_options) : null;
    if (questionData.question_type == 'Yes/No' || questionData.question_type == 'Multiple Choice - Single Answer') {
      console.log(this.currentQuestionOptions);
      this.currentQuestionOptions.forEach((option: any, index: any) => {
        if (option.isCorrect) {
          this.optionValue = option.optionValue;
        }
      });
    }
  }

  getDateTimeFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY . h:mm A');
    } else {
      return '';
    }
  }

  checkValidationPartThing() {
    let optionCount: any = 0
    if (this.quizControls.option1.value) {
      optionCount = optionCount + 1;
    }
    if (this.quizControls.option2.value) {
      optionCount = optionCount + 1;
    }
    if (this.quizControls.option3.value) {
      optionCount = optionCount + 1;
    }
    if (this.quizControls.option4.value) {
      optionCount = optionCount + 1;
    }
    if (this.quizControls.option5.value) {
      optionCount = optionCount + 1;
    }
    if ((this.selectedOptions == 'Multiple Choice - Single Answer' && optionCount >= 2) || (this.selectedOptions == 'Multiple Choice - Multiple Answers' && optionCount >= 3)) {
      this.quizForm.get('option1').clearValidators();
      this.quizForm.get('option2').clearValidators();
      this.quizForm.get('option3').clearValidators();
      this.quizForm.get('option4').clearValidators();
      this.quizForm.get('option5').clearValidators();
    } else {
      if (this.selectedOptions != 'Yes/No' || this.selectedOptions != 'Freeform Text') {
        this.quizForm.get('option1').setValidators([Validators.required]);
        this.quizForm.get('option2').setValidators([Validators.required]);
        this.quizForm.get('option3').setValidators([Validators.required]);
        this.quizForm.get('option4').setValidators([Validators.required]);
        this.quizForm.get('option5').setValidators([Validators.required]);
      }
    }
    this.quizForm.get('option1').updateValueAndValidity();
    this.quizForm.get('option2').updateValueAndValidity();
    this.quizForm.get('option3').updateValueAndValidity();
    this.quizForm.get('option4').updateValueAndValidity();
    this.quizForm.get('option5').updateValueAndValidity();
  }

  openEditPopup(id: any) {
    this.quizSubmit = false;
    this.quizForm.reset();
    this.currentQuizId = id;
    this.selectedOptions = 'Multiple Choice - Single Answer';
    if (this.copyQuiz) {
      this.manageTitle = `${ManageTitle.actionNew} ${MarketPlaceText.quiz}`;
      this.buttonTitle = 'Save';
    } else {
      this.manageTitle = `${ManageTitle.actionEdit} ${MarketPlaceText.quiz}`;
      this.buttonTitle = 'Update';
    }
    this.displayModal = true;
    this.loadingSubmitForm = true;
    this.threadApi.apigetQuizSingleData(id).subscribe((response: any) => {
      if(response.status == 'Success') {
        this.quizSingleData = response.data.quizData;
        this.selectedOptions = this.quizSingleData?.question_type;
        this.setValidationForForm();
        this.getMakeModelsList(this.quizSingleData.make);
        let topic_ids: any = [];
        this.quizSingleData.topic_data?.forEach((quiz: any) => {
          topic_ids.push(quiz.id);
        });
        this.topicFormValue = topic_ids;
        this.quizForm.patchValue({
          make: this.quizSingleData.make,
          model: this.quizSingleData.model,
          year: this.quizSingleData.year,
          question: this.quizSingleData.question,
          questionRequired: this.quizSingleData.question_required && this.quizSingleData.question_required != '0' ? true : false,
          points: this.quizSingleData.points
        });
        if (this.selectedOptions == 'Multiple Choice - Single Answer') {
          let answer_options = JSON.parse(this.quizSingleData.answer_options);
          answer_options.forEach((option: any, index: any) => {
            let optionValue = {}
            optionValue['option'+(index+1)] = option.optionValue;
            this.quizForm.patchValue(optionValue);
            if (option.isCorrect) {
              this.quizForm.patchValue({
                options: 'option'+index
              });
            }
          });
        } else if (this.selectedOptions == 'Multiple Choice - Multiple Answers') {
          let answer_options = JSON.parse(this.quizSingleData.answer_options);
          answer_options.forEach((option: any, index: any) => {
            let optionValue = {}
            optionValue['option'+(index+1)] = option.optionValue;
            this.quizForm.patchValue(optionValue);
            if (option.isCorrect) {
              this.multiSelectOptionsValue.push('option'+index);
            }
          });
        } else if (this.selectedOptions == 'Yes/No') {
          let answer_options = JSON.parse(this.quizSingleData.answer_options);
          answer_options.forEach((option: any, index: any) => {
            if (option.isCorrect && option.optionValue == 'Yes') {
              this.quizForm.patchValue({
                yesNoOptions: 'Yes',
              });
            } else if (option.isCorrect && option.optionValue == 'No') {
              this.quizForm.patchValue({
                yesNoOptions: 'No',
              });
            }
          });
        }
        this.checkValidationPartThing();
        this.attachmentItems = this.quizSingleData.attachments;

        this.loadingSubmitForm = false;
      }
      this.loadingSubmitForm = false;
    }, (error: any) => {
      console.log("error: ", error);
      this.loadingSubmitForm = false;
    })
  }

  checkTopicValue() {
    if (this.topicValue) {
      this.showTopicError = false;
    } else {
      this.showTopicError = true;
    }
  }
}
