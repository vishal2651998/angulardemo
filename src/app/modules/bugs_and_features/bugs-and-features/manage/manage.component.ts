import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Constant } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public textColorValues = [
    { color: "rgb(0, 0, 0)" },
    { color: "rgb(230, 0, 0)" },
    { color: "rgb(255, 153, 0)" },
    { color: "rgb(255, 255, 0)" },
    { color: "rgb(0, 138, 0)" },
    { color: "rgb(0, 102, 204)" },
    { color: "rgb(153, 51, 255)" },
    { color: "rgb(255, 255, 255)" },
    { color: "rgb(250, 204, 204)" },
    { color: "rgb(255, 235, 204)" },
    { color: "rgb(255, 255, 204)" },
    { color: "rgb(204, 232, 204)" },
    { color: "rgb(204, 224, 245)" },
    { color: "rgb(235, 214, 255)" },
    { color: "rgb(187, 187, 187)" },
    { color: "rgb(240, 102, 102)" },
    { color: "rgb(255, 194, 102)" },
    { color: "rgb(255, 255, 102)" },
    { color: "rgb(102, 185, 102)" },
    { color: "rgb(102, 163, 224)" },
    { color: "rgb(194, 133, 255)" },
    { color: "rgb(136, 136, 136)" },
    { color: "rgb(161, 0, 0)" },
    { color: "rgb(178, 107, 0)" },
    { color: "rgb(178, 178, 0)" },
    { color: "rgb(0, 97, 0)" },
    { color: "rgb(0, 71, 178)" },
    { color: "rgb(107, 36, 178)" },
    { color: "rgb(68, 68, 68)" },
    { color: "rgb(92, 0, 0)" },
    { color: "rgb(102, 61, 0)" },
    { color: "rgb(102, 102, 0)" },
    { color: "rgb(0, 55, 0)" },
    { color: "rgb(0, 41, 102)" },
    { color: "rgb(61, 20, 102)" }
  ];

  subscription: Subscription = new Subscription();
  public title: string = "New Bug or Feature";
  public text2: string;
  public bodyHeight: number;
  public innerHeight: number ;
  public loading: boolean = true;
  public manageaction: string = 'uploading';
  public color: boolean = false;
  public colorWeb: boolean = true;
  public colorMobile: boolean = false;
  public colorIos: boolean = false;
  public apiKey: string;
  public countryId;
  public domainId;
  public userId;
  public user: any;
  public platform: string = "3";
  public headerData: Object;
  public bugorfeatureForm: FormGroup;
  public bfForm: any[];
  public chooseLable: string = "Attachment";
  public chooseIcon: string = "pi pi-paperclip";
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public addLinkFlag: boolean = false;
  public submitflag: boolean = false;
  public buttonflag: boolean = false;
  public titleText: string = '';
  public description: string = '';
  public textCompletetitle: boolean = false;
  public reportType: string;
  public apiData: any = [];
  public baseapiUrl: string = '';
  public manageAction: string = '';
  public bugfeaturetype: string = '';
  public step1Submitted: boolean = false;
  public step2Submitted: boolean = false;
  public EditAttachmentAction: string = "attachments";
  public attachmentItems: any = [];
  public pushFormData: any = "";
  public selectPlatform: any = "";
  public partId: any = 0;
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public uploadedItems: any = [];
  public platformId: number = 0;
  public navUrl: string = "";
  public viewUrl: string = "bug_and_features/view/";
  public displayOrder: number = 0;
  public partUpload: boolean = true;
  public modalConfig: object = { backdrop: 'static', keyboard: false, centered: true };
  public textCompletedescription: boolean = true;
  public occuranceValue: any = [];
  public Occurs: string = '';
  public textCompleteoccurs: boolean = true;
  public successMsg: string = '';
  public contentType: any = 43;
  public webPlatformType : string="";
  public describtionText :boolean = false;
  public bodyClass;
  public wrapperClass: string="wrapper";
  public bodyElem;
  public dataForm;
  public apiFormData;
  public titles: any={};
  public load : boolean = false;
  public Os: string;
  public mediaUploadItems: any=[];
  public bugfeaturelist: any =[];
  public editNav: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (!this.loading) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
    }
  }


  constructor(
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private apiCal: ApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router

  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title)
    this.bugorfeatureForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      occurance: ['', Validators.required]
    })
    this.apiKey = Constant.ApiKey;
    this.occuranceValue = [{ type: 'Frequently', code: 'frq' }, { type: 'Occurance', code: 'occ' }]
  }



  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyClass = "landing-page";
    this.wrapperClass = "wrapper-landingpage";
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = this.user.countryId;
    this.baseapiUrl = this.apiCal.apiCollabticBaseUrl();
    this.setScreenHeight();
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
        (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      let pid = this.route.snapshot.params["id"];
      this.partId = pid == "undefined" || pid == undefined ? this.partId : pid;
      this.manageAction = this.partId == 0 ? "new" : "edit";
      let platformId = localStorage.getItem("platformId");
      this.platformId =
        platformId == "undefined" || platformId == undefined
          ? this.platformId
          : parseInt(platformId);
      let navUrl = localStorage.getItem("bugnuv");
      navUrl =
        navUrl == "undefined" || navUrl == undefined
          ? "bugorfeature"
          : navUrl;
      this.viewUrl = `${this.viewUrl}${this.partId}`;
      this.navUrl =
        this.manageAction == "new" ? "bug_and_features" : this.viewUrl;
      setTimeout(() => {
        localStorage.removeItem("bugnuv");
      }, 500);

      let headTitleText = '';
      let ma = this.partId == 0 ? "new" : "edit";
      switch (ma) {
        case 'new':
          headTitleText = 'Report Bug or Feature';
          this.titles = headTitleText
          break;
        case 'edit':
          headTitleText = 'Edit Bug or Feature';
          this.titles = headTitleText
          this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.titles + this.partId)
          this.commonApi.bugfeaturedataSubject.subscribe((data)=> {
            console.log(data)
          })

          break;
      }
      if(this.partId != 0){

        this.getFormData();
      }

      this.headerData = {
        title: headTitleText,
        action: ma,
        id: this.partId
      };
    }


    this.reportType = (this.color == false) ? "1" : "2";
    this.bugfeaturetype = (this.reportType == "1") ? "bug" : "feature";
    console.log(this.userId, this.domainId);
    this.apiData = {
      access: 'bugorfeature',
      baseapiUrl: this.baseapiUrl,
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      manageAction: this.manageAction,
      bugfeaturetype: this.bugfeaturetype,
      displayOrder: this.displayOrder,
      contentType: this.contentType,
      dataId: this.partId,
      uploadedItems: []

    }
    this.reportType = (this.color == false) ? "1" : "2";
    let updatefl = (this.partId > 0) ? '1' : '0';
    this.pushFormData = new FormData;
    this.pushFormData.set('apiKey', this.apiKey);
    this.pushFormData.set('userId', this.userId);
    this.pushFormData.set('domainId', this.domainId);
    this.pushFormData.set('countryId', this.countryId)
    this.pushFormData.set('reportType', this.reportType);
    this.pushFormData.set('updateFlag', updatefl);
    this.pushFormData.set('data', this.partId);


    setTimeout(() => {
      this.loading = false;
      this.setScreenHeight()

    }, 100)
    console.log(this.Occurs)
    this.webPlatformType = this.getBrowserName()
    console.log(this.webPlatformType)
    console.log(this.bugorfeatureForm.value)
    this.getOs()
    console.log(this.occuranceValue)
  }
  setScreenHeight() {
    let headerHeight = 0;
    // let footerHeight =
    //   document.getElementsByClassName("prob-header")[0].clientHeight;
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight - (headerHeight + 170);

  }
  get f() { return this.bugorfeatureForm.controls; }
  // this.pageInfo = {
  //   access: 'documents',
  //   baseApiUrl: this.baseApiUrl,
  //   apiKey: this.apiKey,
  //   domainId: this.domainId,
  //   countryId: this.countryId,
  //   userId: this.userId,
  //   manageAction: this.manageAction,
  //   threadUpload: this.threadUpload,
  //   step: this.stepTxt,
  //   stepBack: this.stepBack,
  //   step1Submitted: this.step1Submitted,
  //   step2Submitted: this.step2Submitted,
  //   uploadedItems: [],
  //   attachments: [],
  //   attachmentItems: [],
  //   updatedAttachments: [],
  //   deletedFileIds: []
  // };



  selectplatform(): void {
    if (this.colorWeb && !this.colorMobile && !this.colorIos) {
      this.platform = "3"
    };
    if (!this.colorWeb && this.colorMobile && !this.colorIos) {
      this.platform = "2"
    };
    if (!this.colorWeb && !this.colorMobile && this.colorIos) {
      this.platform = "1"
    };

  }
  getFormData():void {
    const apiFormData = new FormData;
    apiFormData.set('apiKey', this.apiKey);
    apiFormData.set('userId', this.userId);
    apiFormData.set( 'domainId', this.domainId);
    apiFormData.set('dataId',  this.partId);
    this.apiFormData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,

    }
    this.commonApi.bugsfeaturelist(apiFormData).subscribe((data) =>{
      let datas = data.items;
      for (let i of datas){
        if(i.threadId == this.partId ){
           this.dataForm = i;
           console.log(this.dataForm)
           this.titleText = this.dataForm.threadTitle;
           this.description = this.dataForm.content;
           this.attachmentItems = this.dataForm.uploadContents;
           this.load = true;
           this.color = (this.dataForm.reportType == "2") ? true : false;
           this.colorMobile = (this.dataForm.platformTypeTitle == "Android") ? true : false;
           this.colorIos = (this.dataForm.platformTypeTitle == "iOS") ? true : false;
           this.colorWeb = (this.dataForm.platformTypeTitle == "Web") ? true : false;
           this.Occurs = (this.dataForm.occurance == "frq") ? "frq" : "occ"
           this.describtionText = (this.description == null && this.titleText == null && this.Occurs == null ) ? false : true;
           for (let a of this.attachmentItems) {
            a.captionFlag = a.fileCaption != "" ? false : true;
            if (a.flagId == 6) {
              a.url = a.filePath;
              a.linkFlag = false;
              a.valid = true;
            }
          }

        }
      }

    })

  }
  Onsubmit(): void {
    //debugger
    this.submitflag = true;
    this.buttonflag = (!this.colorWeb && !this.colorMobile && !this.colorIos) ? true : false;
    this.textCompletetitle = (this.titleText == '') ? true : false;
    this.textCompletedescription = (this.description == '') ? true : false;
    this.textCompleteoccurs = (this.Occurs == '') ? true : false;
    console.log(this.titleText, this.description, this.textCompletedescription)
    this.reportType = (this.color == false) ? "1" : "2";
    this.bugfeaturelist = {
      action: (this.reportType == "2") ? false : true
    }
    this.commonApi.emitbugfeature(this.bugfeaturelist)
    this.selectplatform();
    console.log(this.textCompletetitle, this.reportType);
    this.step2Submitted = true;
    let uploadCount = 0
    if (!this.buttonflag && !this.textCompletetitle && !this.textCompletedescription && !this.textCompleteoccurs) {
      const modelRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modelRef.componentInstance.access = (this.partId > 0) ? 'Save': 'Publish';
      modelRef.componentInstance.confirmAction.subscribe((recivedMessage) => {
        modelRef.close()
        if (!recivedMessage) {
          console.log('test')
          return
        } else {
         // debugger
            if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
             this.uploadedItems.attachments.forEach(item => {
               console.log(item)
               if(item.accessType == 'media') {
                  this.mediaUploadItems.push({fileId: item.fileId.toString()});
                } else {
                  uploadCount++;
               }
              });
            }
            localStorage.setItem("feature",this.reportType)
          let bugfeatureForm = new FormData;
          bugfeatureForm.append('apiKey', this.apiKey);
          bugfeatureForm.append('userId', this.userId);
          bugfeatureForm.append('domainId', this.domainId);
          bugfeatureForm.append('reportType', this.reportType);
          bugfeatureForm.append('platform', this.platform);
          bugfeatureForm.append('supportTitle', this.titleText);
          bugfeatureForm.append('description', this.description);
          bugfeatureForm.append('occurance', this.Occurs);
          bugfeatureForm.append('webPlatformType',this.webPlatformType)
          bugfeatureForm.append('desktopOS', this.Os)
          bugfeatureForm.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
          if (this.partId > 0) {
            console.log(this.deletedFileIds);
            let action: any = 1;
            let partId: any = this.partId;
            bugfeatureForm.append("editMode", action);
            bugfeatureForm.append("dataId", partId);
            bugfeatureForm.append(
              "updatedAttachments",
              JSON.stringify(this.updatedAttachments)
            );
            bugfeatureForm.append(
              "deletedFileIds",
              JSON.stringify(this.deletedFileIds)
            );
          }
          this.manageAction = 'uploading';
          this.commonApi.createbugfeature(bugfeatureForm).subscribe((response) => {
            console.log('success', response)
            this.successMsg = response.result
            console.log(this.successMsg)
            if (Object.keys(this.uploadedItems).length &&
              this.uploadedItems.items.length > 0 && uploadCount > 0) {
              this.partUpload = false
              this.apiData["uploadedItems"] = this.uploadedItems.items;
              this.apiData["attachments"] = this.uploadedItems.attachments;
              this.apiData["threadAction"] = this.partId > 0 ? "edit" : "new";
              this.apiData["threadId"] = response.data.thread_id
              this.apiData["dataId"] = response.data.postId;
              this.apiData["navUrl"] = this.navUrl;
              this.apiData["dataId"] =response.data.post_id;
              this.apiData["message"] = "Successfully Created!"
             // debugger
              console.log(this.apiData)
              setTimeout(() => {
                this.partUpload = true;
              }, 500)
            } else {
              //debugger
              const ModelRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              ModelRef.componentInstance.successMessage = 'Successfully Posted!'
              setTimeout(() => {
                ModelRef.dismiss('Cross click')
                if(this.partId > 0) {
                  this.router.navigate([this.navUrl]);
                  this.editNav = "true"
                  localStorage.setItem("editNav",this.editNav)
                } else {
                  window.close();
                  window.opener.location = this.navUrl;

                }
              }, 2000)
            }
          }, (error) => {
            console.log('error', error);
          })
          }
      })
      this.bugorfeatureForm.reset;
    }

  }

  attachments(items) {
    this.uploadedItems = items;
    console.log(items)
  }
  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }

  }
  closecall() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.close('Cross click');
      if (!recivedService) {
        return;
      } else {
        window.close();
      }
    })
  }
  getOs() {

        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Chrome OS', r:/CrOS/},
            {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (let id in clientStrings) {
            var cs = clientStrings[id];
            let nAgt = navigator.userAgent
            if (cs.r.test(nAgt)) {
                this.Os = cs.s;
                break;
            }
        }
    console.log(this.Os)
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
  changecolor(): void {
    this.color = !this.color;
    console.log(this.color)
    this.step1Submitted = true;
  }
  changecolorWeb(): void {
    this.colorWeb = true;
    this.colorMobile = false;
    this.colorIos = false;
  }
  changecolorMobile(): void {
    this.colorMobile = true;
    this.colorWeb = false;
    this.colorIos = false;
  }
  changecolorIos(): void {
    this.colorIos = true;
    this.colorWeb = false;
    this.colorMobile = false;
  }
  onTextChange(event, type) {
    if(type){
      this.description = event.htmlValue;
      console.log(this.Occurs,"")
      this.describtionText = (this.description == null && this.title == null && this.Occurs == null ) ? false : true;
    }

  }

  ngOnDestroy(): void {

  }

}
