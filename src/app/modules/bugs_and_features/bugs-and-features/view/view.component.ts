import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { Title } from '@angular/platform-browser';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Constant, IsOpenNewTab, RedirectionPage } from 'src/app/common/constant/constant';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import { ProductMatrixService } from 'src/app/services/product-matrix/product-matrix.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BugAndFeatureComponent } from 'src/app/components/common/bug-and-feature/bug-and-feature.component';
import { JsonPipe, PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @ViewChild("top", { static: false }) top: ElementRef;

  public headerData: any = [];
  public id: any = [];
  public rightPanel: boolean = true;
  public title: any = `Bug Feature #`;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public innerHeight: any = 35;
  public bodyHeight: any = [];
  public loading: boolean = true;
  public dataObject: any = [];
  public user: any = [];
  public userId: any = [];
  public domainId: any = [];
  public apiKey: any = [];
  public apiFormData: any = [];
  public bugType: string = "";
  public action: string = 'view';
  public attachments: any = [];
  public infoLoading: boolean = true;
  public postDesc: string = "";
  public manageAction: string;
  public EditAttachmentAction: string = "view";
  public attachmentItems: any = [];
  public apiData: any = [];
  public baseapiUrl: string = "";
  public contentType: any = 43;
  public rightpanel: boolean = true;
  public uploadedItems: any = []
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public partUpload: boolean = true;
  public postApiData: any = [];
  public displayOrder: number = 0;
  public countryId: any = localStorage.getItem('countryId');
  public wrapperClass: string = "wrapper";
  public buttonBottom: boolean = false;
  public buttonTop: boolean = true;
  public access: any = [];
  public loginUsername;
  public loginUserRole;
  public loginUserProfileImg;
  public loginUserAvailability;
  public teamLoading: boolean = false;
  public postFixLists: any;
  public postFixDataLength: any;
  public postFixData: any;
  public itemFixTotal: any;
  public postDescFlag: boolean = true;
  public editPost: boolean = true;
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
  public postData: boolean = true;
  public bodyElem;
  public footerElem;
  public bodyClass;
  public bodyClass1;
  public bodyClass2;
  public replyPostForm: FormGroup;
  public replyPostEditForm: FormGroup
  public submitpost: boolean = false;
  public emptydesc: boolean = false;
  public mediaUploadItems: any = []
  public modalConfig: any = { backdrop: 'static', keyboard: false, centered: true };
  public replPostList: any = [];
  public replyPostListupdate: any = [];
  public pageAccess: string;
  public status: string;
  public headerTitle: string = "Bug";
  public closedOn: string = '';
  public postLoading: boolean;
  public postbutton: boolean = true;
  public postDescs: string = "";
  public noReplyPost: boolean = false;
  public statusColor: string = "";
  public descEditflag: boolean = true;
  public postEditDesc: string = "";
  public postEditbutton: boolean = true;
  public attachmentEditItem: any = [];
  public manageEditAction: string = "view";
  public postEditApiData: any = {};
  public editPostUpload: boolean = true;
  public removeFileIds: any = [];
  public postLists: any = [];
  public submitEditpost: boolean = false;
  public emptyEditDesc
  public reopenBug:boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight + 55;
    this.setScreenHeight();
  }
  constructor(private activateRoute: ActivatedRoute,
    private commonService: CommonService,
    private titleService: Title,
    private authentificationService: AuthenticationService,
    private apiCal: ApiService,
    private probingApi: ProductMatrixService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: Router,
    private platformLoacation: PlatformLocation
  ) {

    this.replyPostForm = this.formBuilder.group({
      postDesc: ['', Validators.required]
    })
    this.replyPostEditForm = this.formBuilder.group({
      postEditDesc: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.teamLoading = false;
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.wrapperClass = "wrapper-landingpage";
    this.bodyClass1 = "thread-detail";
    this.bodyClass = "landing-page"
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.user = this.authentificationService.userValue;
    this.userId = this.user.Userid;
    this.domainId = this.user.domain_id;
    this.baseapiUrl = this.apiCal.apiCollabticBaseUrl();
    this.activateRoute.params.subscribe((obj) => {
      console.log(obj);
      this.id = obj['id']
    })
    this.title = `${this.title}${this.id}`
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title)
    this.bodyHeight = window.innerHeight + 55
    this.apiKey = Constant.ApiKey
    const apiFormData = new FormData;
    apiFormData.set('apiKey', this.apiKey);
    apiFormData.set('userId', this.userId);
    apiFormData.set('domainId', this.domainId);
    apiFormData.set('dataId', this.id)
    this.apiFormData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId
    }
    this.commonService.bugsfeaturelist(apiFormData).subscribe((data) => {
      console.log(data);
      let dataOne = data.items
      for (let i of dataOne) {
        if (i.threadId == this.id) {
          this.getData(i);
          this.loading = false;
        }
      }
    })

    this.getUserProfile();
    this.setScreenHeight();
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    // this.apiData = {
    //   access: 'bugorfeature',
    //   baseapiUrl: this.baseapiUrl,
    //   apiKey: this.apiKey,
    //   domainId: this.domainId,
    //   countryId: this.countryId,
    //   userId: this.userId,
    //   manageAction: this.manageAction,
    //   bugfeaturetype: this.bugfeaturetype,
    //   displayOrder: this.displayOrder,
    //   contentType: this.contentType,
    //   dataId: this.partId,
    //   uploadedItems: []

    // }
    this.apiData = {
      access: 'bugorfeature',
      baseapiUrl: this.baseapiUrl,
      apiKey: this.apiKey,
      domainId: this.domainId,
      userId: this.userId,
      manageAction: this.manageAction,
      contentType: this.contentType,
      dataId: 'new',
      uploadedItems: []
    }
    this.manageAction = 'new';
    this.postApiData = {
      access: 'post',
      pageAccess: 'post',
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
      deletedFileIds: []
    };
    this.attachmentItems = this.apiData.uploadedItems;
    this.postEditApiData = {
      access: 'post',
      pageAccess: 'post',
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
      deletedFileIds: []
    };

    this.commonService._OnLayoutChangeReceivedSubject.subscribe((flag) => {
      this.rightpanel = JSON.parse(flag);
    });
    this.getReplyPostList();

  }
  get f() { return this.replyPostForm.controls; }
  get fe() { return this.replyPostEditForm.controls; }
  setScreenHeight() {
    this.innerHeight = (this.bodyHeight - 157) + 25;
  }
  attachment(items) {
    this.uploadedItems = items;
    console.log(items)
  }
  getDataBugOrFeature(){
    const apiFormData = new FormData;
    apiFormData.set('apiKey', this.apiKey);
    apiFormData.set('userId', this.userId);
    apiFormData.set('domainId', this.domainId);
    apiFormData.set('dataId', this.id)
    this.apiFormData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId
    }
    this.commonService.bugsfeaturelist(apiFormData).subscribe((data) => {
      console.log(data);
      let dataOne = data.items
      for (let i of dataOne) {
        if (i.threadId == this.id) {
          this.getData(i);
          this.loading = false;
        }
      }
    })
  }
  setActivePosition(id) {
    if (id == 'bottom') {
      this.top.nativeElement.scrollTop = this.top.nativeElement.scrollHeight;
    }
    else {
      this.top.nativeElement.scrollTop = 0;
    }
  }
  scrolled(event: any): void {

    this.buttonTop = (this.buttonTop) ? true : false;
    this.buttonBottom = (this.buttonBottom) ? true : false;

    let bottom = this.isUserNearBottom();
    let top = this.isUserNearTop();

    if (bottom) {
      console.log("bottom:" + bottom);
      this.buttonTop = false;
      this.buttonBottom = true;
    }
    if (top) {
      console.log("top:" + top);
      this.buttonTop = true;
      this.buttonBottom = false;
    }
  }

  private isUserNearBottom(): boolean {
    const threshold = 100;
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    return position > height - threshold;
  }

  private isUserNearTop(): boolean {
    const threshold = 100;
    const position = this.top.nativeElement.scrollTop;
    return position < threshold;
  }
  getData(data) {
    this.dataObject = data;
    let createdOnNew = data.createdOn;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    let localcreatedOnDate = moment(createdOnDate)
      .local()
      .format("MMM DD, YYYY . h:mm A");
    this.dataObject.createdOn = localcreatedOnDate
    let updateOnNew = data.updatedOn;
    let updateOnDate = moment.utc(updateOnNew).toDate();
    let localupdateOnDate = moment(updateOnDate)
      .local()
      .format("MMM DD, YYYY . h:mm A");
    this.dataObject.updateOn = localupdateOnDate;
    let desc = data.content.replace(/(<([^>]+)>)/ig, '')
    this.dataObject.content = desc;
    let reporttype = (data.reportType == "1") ? "Bug" : "Feature";
    this.dataObject.reportType = reporttype;
    let bugtype = (data.reportType == "Bug") ? "B" : "F";
    this.bugType = bugtype
    this.attachments = data.uploadContents;
    this.access = (this.userId == data.userId) ? true : false;
    let occurs = (data.occurance == "frq") ? "Frequently" : "Occurance";
    this.dataObject.occurs = occurs;
    this.dataObject.webplatform = (data.webPlatformType == "") ? "chome" : data.webPlatformType;
    this.status = data.threadStatus
    switch (this.status) {
      case "PENDING":
        this.statusColor = "rgb(234, 125, 61)"
        break;
      case "CLOSED":
        this.statusColor = "#FF1100"
        break;
      case "IN-PROGRESS":
        this.statusColor = "#2d7eda"
        break;
      case "NEW":
        this.statusColor = "#f39408"
        break;
    }
    if (this.status == 'CLOSED') {
      this.postDescFlag = false;
      this.headerTitle = (this.bugType == "B") ? "Bug" : "Feature";
      this.closedOn = data.updatedOn;
      if(this.access){
        this.reopenBug = true;
      }
    }
    this.headerData = {
      'pageName': 'Bug and Feature',
      'threadId': this.id,
      'type': this.bugType,
      'threadOwnerAccess': this.access,
      'threadStatus': this.status,
      'threadStatusBgColor': this.statusColor,
      'threadStatusColorValue': "#FFFFFF"
    }
    this.title = `${(this.bugType == "B") ? "Bug" : "Feature"} #${this.id}`
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title)
  }

  taponprofileclick(userId) {
    var aurl = 'profile/' + userId + '';
    if (false) {
      //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else {
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }
  threadHeaderAction(event) {
    switch (event) {
      case 'delete':
        this.deleteBugAction();
        break;
      case 'reopen':
        this.reOpen();
        break;
    }

  }
  deleteBugAction() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if (receivedService) {
        // this.deleteThreadPost('thread',0);

      }
    });
  }
  getUserProfile() {
    let userData = {
      'api_key': Constant.ApiKey,
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.loginUserRole = resultData.userRole;
      this.loginUserProfileImg = resultData.profile_image;
      this.loginUserAvailability = resultData.availability;
      this.loginUsername = resultData.username;
    });
  }
  changedesp(event, type) {
    if (type == 'new') {
      this.postDesc = event.htmlValue;
      console.log(this.postDesc);
      this.postbutton = (this.postDesc != null) ? false : true;
    }

  }
  changeEditDesp(event, type) {
    if (type == 'new') {
      this.postEditDesc = event.htmlValue;
      console.log(this.postEditDesc)
      this.postEditbutton = (this.postEditDesc == null) ? false : true;
    }
  }

  //Reply post
  replyPost(status): void {
    this.submitpost = true;
    this.emptydesc = (this.postDesc == "" || this.postDesc == null) ? true : false;
    console.log(this.postDesc);
    if (!this.emptydesc) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Publish';
      modalRef.componentInstance.confirmAction.subscribe((recievedmessage) => {
        modalRef.close()
        if (recievedmessage) {
          this.postLoading = true;
          let uploadCount = 0
          //debugger
          if (Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
            this.uploadedItems.attachments.forEach(item => {
              console.log(item)

              if (item.accessType == 'media') {
                this.mediaUploadItems.push({ fileId: item.fileId.toString() });
              } else {
                uploadCount++;
              }
            });
          }
          const modalRef = this.modalService.open(
            SubmitLoaderComponent,
            this.modalConfig
          );
          const postForm = new FormData;
          postForm.append("apiKey", this.apiKey)
          postForm.append("userId", this.userId)
          postForm.append("domainId", this.domainId)
          postForm.append("countryId", "")
          postForm.append("threadId", this.id)
          postForm.append("description", this.postDesc)
          postForm.append("postType", "comment")
          postForm.append("postStatus", "0")
          postForm.append("closeStatus", status)
          postForm.append("platform", "3")
          postForm.append("imageFlag", "true")
          postForm.append("taggedUser", "")
          postForm.append("mediaCloudAttachments", JSON.stringify(this.mediaUploadItems))
          this.postDesc = ""
          this.postbutton = true;
          this.commonService.bugfeatureReplypost(postForm).subscribe((response) => {
            modalRef.dismiss("Cross click");
            console.log(response)
            let lastpostId = response.data.postId
            let threadId = response.data.threadId
            postForm.append("threadId",response.data.threadId)
            postForm.append("postId",response.data.postId)
            if (Object.keys(this.uploadedItems).length &&
              this.uploadedItems.items.length > 0 && uploadCount > 0) {
              this.postApiData["uploadedItems"] = this.uploadedItems.items;
              this.postApiData["attachments"] = this.uploadedItems.attachments;
              this.postApiData["threadId"] = threadId
              this.postApiData["dataId"] = lastpostId;
              this.postApiData["message"] = "Successfully Created!"
              this.postApiData['nestedReply'] = "0";
              this.postApiData['summitFix'] = "0";
              this.manageAction = 'uploading'
              this.partUpload = false;
              setTimeout(() => {
                this.partUpload = true;
              }, 500)
              setTimeout(() => {
                this.getReplyPostList()
                this.resetReplyBox()
                this.getDataBugOrFeature()
              }, 2000);

              if (status == 'Yes') {
                const apiFormData = new FormData;
                apiFormData.set('apiKey', this.apiKey);
                apiFormData.set('userId', this.userId);
                apiFormData.set('domainId', this.domainId);
                apiFormData.set('dataId', this.id)
                this.commonService.bugsfeaturelist(apiFormData).subscribe((data) => {
                  console.log(data);
                  let dataOne = data.items
                  for (let i of dataOne) {
                    if (i.threadId == this.id) {
                      this.getData(i);
                    }
                  }
                })
              }
            }
            else {
              this.getDataBugOrFeature()
              if (status == 'Yes') {
                const apiFormData = new FormData;
                apiFormData.set('apiKey', this.apiKey);
                apiFormData.set('userId', this.userId);
                apiFormData.set('domainId', this.domainId);
                apiFormData.set('dataId', this.id)
                this.commonService.bugsfeaturelist(apiFormData).subscribe((data) => {
                  console.log(data);
                  let dataOne = data.items
                  for (let i of dataOne) {
                    if (i.threadId == this.id) {
                      this.getData(i);
                    }
                  }
                })

                this.resetReplyBox()
              }
              this.getReplyPostList();

              this.resetReplyBox();

            }
          })
        } else {
          console.log("ki")
        }
      })
    }
    // this.postLoading = true
    // setTimeout(()=>{
    // this.postLoading = false;
    // },2500)
    this.submitpost = false;


  }
  reOpen() {
    const postForm = new FormData;
    postForm.append("apiKey", this.apiKey)
    postForm.append("userId", this.userId)
    postForm.append("domainId", this.domainId)
    postForm.append("countryId", "")
    postForm.append("threadId", this.id)
    postForm.append("postType", "comment")
    postForm.append("postStatus", "0")
    postForm.append("closeStatus", "No")
    postForm.append("platform", "3")
    postForm.append("imageFlag", "true")
    postForm.append("taggedUser", "")
    this.commonService.bugfeatureReplypost(postForm).subscribe((data)=>{
      console.log(data)
    })

  }
  changePost(post, type) {
    if (!type) {
      for (let i in this.postFixData) {
        this.postFixData[i].postView = true;
        if (this.postFixData[i].postId == post.postId) {
          this.postFixData[i].postView = false;
          this.postEditDesc = post.content;
          this.postFixData[i].EditAttachmentAction = 'attachments';
          this.postFixData[i].attachmentItems = [];
          this.postFixData[i].attachmentItems  = this.postFixData[i].uploadContents;
          for(let a of this.postFixData[i].attachmentItems) {
            a.captionFlag = (a.fileCaption != '') ? false : true;
            if(a.flagId == 6) {
              a.url = a.filePath;
              a.linkFlag = false;
              a.valid = true;
            }
          }
        }
      }
    }
  }
  replyEditPost(type, post) {
    if (!type) {
      for (let i in this.postFixData) {
        this.postFixData[i].postView = true
      }
    } else {
      post.postLoading = true;
      this.submitEditpost = true;
      this.emptyEditDesc = (this.postEditDesc == "" || this.postEditDesc == null) ? true : false;
      console.log(this.postEditDesc);
      if (!this.emptyEditDesc) {

          if (!this.emptyEditDesc) {
            let uploadCount = 0
           // debugger
            if (Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
              this.uploadedItems.attachments.forEach(item => {
                console.log(item)
                if (item.accessType == 'media') {
                  this.mediaUploadItems.push({ fileId: item.fileId.toString() });
                } else {
                  uploadCount++;
                }
              });
            }
            const modalRef = this.modalService.open(
              SubmitLoaderComponent,
              this.modalConfig
            );
            let replyEditPostForm = new FormData;
            replyEditPostForm.append("apiKey", this.apiKey)
            replyEditPostForm.append("userId", this.userId)
            replyEditPostForm.append("domainId", this.domainId)
            replyEditPostForm.append("countryId", "")
            replyEditPostForm.append("threadId", post.threadId)
            replyEditPostForm.append("type", "0");
            replyEditPostForm.append("version", "2")
            replyEditPostForm.append("postId", post.postId)
            replyEditPostForm.append("description", this.postEditDesc)
            replyEditPostForm.append("postType", "Comment")
            replyEditPostForm.append("postStatus", "0")
            replyEditPostForm.append("closeStatus", "No")
            replyEditPostForm.append("imageFlag", "true")
            replyEditPostForm.append("mediaCloudAttachments", JSON.stringify(this.mediaUploadItems))
            replyEditPostForm.append("deleteMediaId", JSON.stringify(this.deletedFileIds))
            replyEditPostForm.append("updatedAttachments", JSON.stringify(this.updatedAttachments))
            replyEditPostForm.append("deletedFileIds", JSON.stringify(this.deletedFileIds))
            replyEditPostForm.append("removeFileIds", JSON.stringify(this.removeFileIds))
            replyEditPostForm.append("platform", "3")
            this.commonService.bugfeatureUpdatepost(replyEditPostForm).subscribe((response) => {
              modalRef.dismiss("Cross click");
              console.log(response)
              if (Object.keys(this.uploadedItems).length &&
                this.uploadedItems.items.length > 0 && uploadCount > 0) {
                this.editPostUpload = false;
                this.postEditApiData["uploadedItems"] = this.uploadedItems.items;
                this.postEditApiData["attachments"] = this.uploadedItems.attachments;
                this.postEditApiData["threadId"] = this.id
                this.postEditApiData["dataId"] = response.data.postId;
                this.postEditApiData["message"] = "Successfully Created!"
                this.postEditApiData['nestedReply'] = "0";
                this.postEditApiData['summitFix'] = "0";
                this.postEditApiData['threadAction'] = 'edit'
                this.manageAction = 'uploading'
                setTimeout(() => {
                  this.editPostUpload = true;
                },100)
                setTimeout(() => {
                  this.getReplyPostList();
                  this.resetEditReplyBox()
                  post.postLoading = false
                }, 3000)
              }
              else {
                this.getReplyPostList();
                this.resetEditReplyBox()
               setTimeout(()=>{
                post.postLoading = false
               },1500)
              }
            })
          }


      }
    }
  }
  resetEditReplyBox(){
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 43;
    this.uploadedItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds  = [];
    this.removeFileIds = [];
    this.mediaUploadItems = []
    this.displayOrder  = 0;
    this.postEditDesc = '';
    this.postEditApiData = {
      access: 'post',
      pageAccess: 'post',
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
      removeFileIds: []
    };
    this.postEditApiData['uploadedItems'] = this.uploadedItems;
    this.postEditApiData['attachments'] = this.uploadedItems;

  }
  resetReplyBox(){
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 43;
    this.uploadedItems  = [];
    this.mediaUploadItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postDesc = '';
    this.postApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      mediaUploadItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.postApiData['uploadedItems'] = this.uploadedItems;
    this.postApiData['attachments'] = this.uploadedItems;
    this.partUpload = false;
    setTimeout(() => {
      this.partUpload = true;
    }, 100)
  }
  getReplyPostList() {
    let postreplylistForm = new FormData;
    postreplylistForm.append("apiKey", this.apiKey)
    postreplylistForm.append("userId", this.userId)
    postreplylistForm.append("domainId", this.domainId)
    postreplylistForm.append("countryId", "")
    postreplylistForm.append("threadId", this.id)
    postreplylistForm.append("type", "0");
    postreplylistForm.append("version", "2")
    postreplylistForm.append("platform", 'null')
    this.postLoading = true
    this.commonService.bugfeaturePostlist(postreplylistForm).subscribe((response) => {
      this.postFixLists = response.data.post;
      this.postFixDataLength = response.data.total;
      if (this.postFixDataLength > 0) {
        this.postData = false
        this.itemFixTotal = this.postFixDataLength;
        let postFixAttachments = [];
        this.postFixData = [];
        for (let i in this.postFixLists) {
          this.postFixLists[i].attachments = this.postFixLists[i].uploadContents;
          this.postFixLists[i].attachmentLoading = (this.postFixLists[i].uploadContents.length > 0) ? false : true;
          let createdOnNew = this.postFixLists[i].createdOnNew;
          let createdOnDate = moment.utc(createdOnNew).toDate();
          this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
          this.postFixLists[i].action = 'view';
          this.postFixLists[i].postLoading = false;
          this.postFixLists[i].postView = true;
          this.postFixLists[i].EditAttachmentAction = "attachments"
          this.pageAccess = "post"
          postFixAttachments.push({
            id: this.postFixLists[i].postId,
            attachments: this.postFixLists[i].uploadContents
          });
          this.postFixData.push(this.postFixLists[i]);

        }
      }
      if (this.postFixDataLength > 0) {
        this.noReplyPost = true
      }
      console.log(this.postFixData)

      setTimeout(() => {
        this.postLoading = false;
      }, 100)
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
  editAttachments(items) {
    this.uploadedItems = items;
    console.log(items)
  }
  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
