import { Component, ViewChild,HostListener, OnInit, OnDestroy } from '@angular/core';
import { Constant, filterNames, PlatFormType, pageInfo, IsOpenNewTab, RedirectionPage, SolrContentTypeValues } from 'src/app/common/constant/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from "@angular/forms";
import { ScrollTopService } from 'src/app/services/scroll-top.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { DocumentsComponent } from 'src/app/components/common/documents/documents.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { PartsService } from 'src/app/services/parts/parts.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import {LandingpageService}  from 'src/app/services/landingpage/landingpage.service';
import { FilterComponent } from "src/app/components/common/filter/filter.component";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";

declare var $: any;

interface sortOption {
  name: string;
  code: string;
}
interface statusOption {
  name: string;
  code: string;
}
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  docPageRef: DocumentsComponent;
  filterRef: FilterComponent;

  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public title: string = 'Documents';
  public pageCreateNew: string = "Create Folder";
  public disableOptionCentering: boolean = false;

  public headerFlag: boolean = false;
  public headerData: Object;

  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = true;
  public groupId: number = 4;
  public filterInterval: any;
  public strlengthforuser:string ='';
  public NewFolderNumberLenth:string ='30';
  public  CBADomain: boolean = false;
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public apiData: Object;
  public docDetail: any = [];
  public emptyFlag: boolean = true;
  public createFolderdiaLog:boolean=false;
  public teamSystem=localStorage.getItem('teamSystem');
  public pageData = pageInfo.documentPage;

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;

  public createAccess: boolean = true;
  public accessEnable: boolean = true;
  public resize: boolean = false;
  public loading: boolean = false;
  public filterLoading: boolean = true;

  public docsUrl: string = "documents/manage";
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public searchVal: string = '';
  public pageAccess: string = "documents";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public cbaDomain= localStorage.getItem('platformId');
  public approvalEnableDomainFlag: boolean = false;
  public filterrecords: boolean = false;
  public collabticDomain= localStorage.getItem('platformId') == '1' ? true : false;
  public expandFlag: boolean = this.cbaDomain == '3' ? false : true;
  public rightPanel: boolean = false;

  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;

  public section: number = 1;
  public pinType: string = "";
  public pinFlag: boolean = false;
  public pinClass: string = "normal";
  public partsList: any = [];
  public partsSelectionList: any = [];
  public itemOffset: number = 0;
  public itemTotal: number = 0;
  public fluid: boolean = false;
  public fluidManageAction: string = "";
  public fluidManageActionId: number = 0;
  public documentViewFlag: boolean = false;
  public docPanel;
  selectedOrderOptions: sortOption[];
  public selectedOrder: object;
  selectedStatusOptions: statusOption[];
  public selectedStatus: object;
  @ViewChild('ttdocuments') tooltip: NgbTooltip;
  public msTeamAccess: boolean = false;
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;
  public documentApprovalFlag:boolean = false;
  public threadThumbInit: number = 0
  public docData = {
    accessFrom: this.pageAccess,
    action: 'get',
    domainId: 0,
    countryId: '',
    expandFlag: this.rightPanel,
    filterOptions: [],
    loadAction: '',
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    section: this.section,
    thumbView: this.thumbView,
    searchVal: this.searchVal,
    userId: 0,
    pinFlag: this.pinFlag,
    type: this.pinType,
    headerFlag: this.headerFlag,
    approvalType: ''
  };
  @ViewChild('f') myForm;
  public resetpassvalidationmsg: string='';
  public displayValidationforreset:boolean=false;
  public filterOptions: Object = {
    'filterExpand': this.expandFlag,
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'apiKey': '',
    'userId': '',
    'domainId': '',
    'countryId': '',
    'groupId': this.groupId,
    'threadType': '25'
  };

  public docTypeLists: any = [{
    class: 'attach',
    desc: 'You can write a note and attach variety of files formats',
    hideFlag: false,
    id: 1,
    title: 'Attach or upload document(s)',
  },
  {
    class: 'procedure',
    desc: 'Author procedures or notes with in-line attachments',
    hideFlag: true,
    id: 4,
    title: 'Create new document or procedure'
  },
  {
    class: 'bulk-upload',
    desc: 'Drag and drop multiple files',
    hideFlag: false,
    id: 3,
    title: 'Bulk upload documents'
  },
  {
    class: 'create-folder',
    desc: 'Add new folder in Documents section',
    hideFlag: false,
    id: 4,
    title: 'Create new folder'
  },
  /*{
    class: 'folder',
    desc: 'Add new folder in Documents section',
    hideFlag: true,
    id: 0,
    title: 'Create new folder',
  }*/];

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let url:any = this.router.url;
    let currUrl = url.split('/');
    if(currUrl[1] == RedirectionPage.Documents && currUrl.length < 2) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.filterLoading = false;
      setTimeout(() => {
        this.filterLoading = true;
        //this.docListCallBack('section', this.section);
      }, 50);
    } else {
      //this.commonApi.emitMessageLayoutChange(true);
    }
  }

  newFolderForm= this.userForm.group({
    Resetradioaction:['1',Validators.required],
    Resetpasswordcontent:['',Validators.required],
  });

  constructor(
    private scrollTopService: ScrollTopService,
    private titleService: Title,
    private router: Router,
    private userForm: FormBuilder,
    private modalService: NgbModal,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private partsApi: PartsService,
    private filterApi: FilterService,
    private docApi: DocumentationService,
    private landingpageServiceApi: LandingpageService
  ) {}

  ngOnInit(): void {

    // enable domain based
    this.approvalEnableDomainFlag = localStorage.getItem('documentApproval') == '1' ? true : false;

    if(this.approvalEnableDomainFlag){
      let loadPage = localStorage.getItem("documentApprovalPage") != null ? localStorage.getItem("documentApprovalPage") : '';
      if(loadPage == "1"){
        this.documentApprovalFlag = true;
      }
      else{
        this.documentApprovalFlag = false;
      }

      if(this.documentApprovalFlag){
        console.log("Document Approval on");
        this.title = "Document Approval";

        if(this.filterActiveCount>0)  {
          this.expandFlag = true;
          this.docData.expandFlag = this.expandFlag;
        }
        else{
          this.expandFlag = false;
          this.docData.expandFlag = this.expandFlag;
        }
        this.filterOptions['filterExpand'] = this.expandFlag;
        this.selectedOrderOptions = [
          { name: "Descending", code: "desc" },
          { name: "Ascending", code: "asc" },
        ];

        this.selectedStatusOptions = [
          { name: "All", code: "" },
          { name: "Pending", code: "2" },
          { name: "In-Process", code: "3" },
          { name: "Return", code: "4" },
          { name: "Retract", code: "5" },
          { name: "Draft", code: "6" },
        ];

      }
      else{
        console.log("Documents on");
        this.title = "Documents";

        this.expandFlag = true;
        this.docData.expandFlag = this.expandFlag;
        this.filterOptions['filterExpand'] = this.expandFlag;
      }
    }
    else
    {
      let documentContentName=localStorage.getItem('documentContentName');

      if(documentContentName)
      {
        this.title = documentContentName;
      }
    }


    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    if(this.domainId==71 && this.roleId==1)
    {
    this.createAccess=false;
    }
    if(this.cbaDomain=='3')
    {
      if(this.roleId!=3)
      {
        this.createAccess=false;
      }

    }
    let platformId1 = localStorage.getItem("platformId");
    if (platformId1 == PlatFormType.CbaForum) {
      this.CBADomain = true;
    }

    let listView = localStorage.getItem("threadViewType");
    this.thumbView = (listView && listView == "thumb") ? true : false;

    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if (authFlag) {
      //console.log(this.router.url, this.router.url.split('/').length)
      let currUrl = this.router.url.split('/');
      if(currUrl.length > 2) {
        this.fluid = (currUrl[2] == 'manage') ? true : false;
        this.documentViewFlag = (currUrl[2] == 'view') ? true : false;
      }
      let url:any = this.router.url;
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };
      /*this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': (!this.fluid) ? true : false,
        'searchVal': ''
      };*/

      this.fluidManageAction = currUrl[3];
      console.log(this.fluidManageAction);

      if(!this.fluid){
        this.headerData = {
          'access': this.pageAccess,
          'profile': true,
          'welcomeProfile': true,
          'search': (!this.fluid) ? true : false,
          'searchVal': ''
        };
      }
      else{
        this.fluidManageAction = currUrl[3];
        let idVal = '0';
        let actionText = '';
        let headTitleText = '';
        switch(this.fluidManageAction){
          case 'attach':
            headTitleText = 'Attach or Upload Document(s)';
            actionText = 'new';
            break;
          case 'bulk-upload':
            headTitleText = 'Bulk Upload Documents';
            actionText = 'new';
            break;
          case 'edit':
            idVal = currUrl[4];
            headTitleText = 'Tech Info';
            actionText = 'edit';
            break;
        }
        this.headerData = {
          title: headTitleText,
          action: actionText,
          id: idVal
        };
        console.log(headTitleText);
        console.log(actionText);
      }

      let apiInfo = {
        'apiKey': this.apiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'isActive': 1,
        'searchKey': this.searchVal,
      }

      this.filterOptions['apiKey'] = this.apiKey;
      this.filterOptions['userId'] = this.userId;
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      this.filterOptions['filterType'] = SolrContentTypeValues.Documents;
      this.apiData = apiInfo;

      setTimeout(() => {
        if(!this.fluid) {
          this.apiData["onload"] = true;
          this.apiData["filterOptions"] = {};
          this.apiData["filterOptions"]["pageInfo"] = this.pageData;
          let filterData = this.commonApi.setfilterData(this.pageAccess);
          // Setup Filter Active Data
          this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
          filterData["filterrecords"] = this.filterCheck();
          this.apiData["filterOptions"]["filterrecords"] = filterData["filterrecords"];
          filterData.action = 'init';
          this.apiData["filterOptions"] = filterData;
          this.docData['filterOptions'] = this.apiData["filterOptions"];
          // Get doc List
          this.commonApi.emitDocumentListData(this.docData);

          let apiData = this.apiData;
          apiData['groupId'] = this.groupId;
          // Get Filter Widgets
          this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);
          this.filterInterval = setInterval(() => {
            let filterWidget = localStorage.getItem('filterWidget');
            let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
            if (filterWidget) {
              this.filterOptions = filterWidgetData.filterOptions;
              this.apiData = filterWidgetData.apiData;
              this.filterActiveCount = filterWidgetData.filterActiveCount;
              this.filterLoading = false;
              this.filterOptions['filterLoading'] = this.filterLoading;
              this.docData['filterOptions'] = this.apiData['filterOptions'];
              console.log(this.filterOptions, this.apiData['filterOptions']);
              // Get doc List
              //this.commonApi.emitDocumentListData(this.docData);
              //localStorage.setItem('docFilter', JSON.stringify(this.apiData['filterOptions']));
              clearInterval(this.filterInterval);
              localStorage.removeItem('filterWidget');
              localStorage.removeItem('filterData');
            }
          }, 50);
        }
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);
    } else {
      this.router.navigate(['/forbidden']);
    }

    // help content
    this.commonApi.welcomeContentReceivedSubject.subscribe((response) => {
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if(welcomePopupDisplay == '1'){
        if(this.msTeamAccess){
          setTimeout(() => {
            this.helpContent(0);
          }, 900);
        }
      }
    });

   /* this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        //this.rightPanel = JSON.parse(flag);
        let rflag: any = flag;
        this.rightPanel = rflag;
      })
    );*/
    this.subscription.add(
      this.commonApi.docNewFolderOpen.subscribe(
        (response) => {
          console.log(response);
          let action = response["action"];
          if(action == 'folder'){
            this.newfolderpopup();
          }
        }
        )
      );

    this.subscription.add(
      this.commonApi.docRPanelClose.subscribe((flag) => {
        //this.rightPanel = JSON.parse(flag);
        this.rightPanel = false;
        this.emptyFlag = true;
         this.thumbView = this.documentApprovalFlag ? false : this.thumbView;
      })
    );

    this.subscription.add(
      this.commonApi.documentPanelFlagReceivedSubject.subscribe((response) => {
        this.thumbView = this.documentApprovalFlag ? false : this.thumbView;
        let flag = response['flag'];
        let access = response['access'];
        let docData = [];
        docData = response['docData'];
        this.docDetail = docData;
        let docLen = Object.keys(docData).length;
        console.log(response, this.rightPanel)
        if(access == 'tab' && this.rightPanel) {
          this.rightPanel = false;
        }
        if(this.rightPanel && docLen > 0) {
          let docInfo = {
            action: 'load',
            dataId: docData['resourceID'],
            docData: docData,
            loading: true
          }
          this.commonApi.emitDocumentInfoData(docInfo);
        }
        this.rightPanel = (docLen == 0) ? false : true;
        this.emptyFlag = (docLen == 0) ? true : false;
        if(this.rightPanel) {
          this.commonApi.emitMessageLayoutChange(this.rightPanel)
        }
        if(access == 'files') {
          let data = {
            access: access,
            action: 'scroll',
            expand: flag,
            id: docData['resourceID'],
          }
          this.commonApi.emitDocumentScroll(data);
          this.commonApi.emitMessageLayoutrefresh(data);
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        console.error("-----------253-----------");
        console.log(r)
        var docPush = JSON.parse(JSON.stringify(r));
        let action = docPush.action;
        let access = docPush.access;
        if(access == 'documents') {
          docPush = (docPush == null) ? '' : docPush;
          console.log(docPush);
          if(docPush != '') {
            let action = docPush.action;
            switch (action) {
              case 'silentDelete':
                let docInfo = {
                  action: 'load',
                  dataId: docPush.threadId,
                  docData: [],
                  loading: true
                }
                let docData = {
                  action: action,
                  dataId: docPush.threadId,
                }
                this.commonApi.emitMessageLayoutrefresh(docData)
                setTimeout(() => {
                  this.rightPanel = false;
                  this.emptyFlag = true;
                }, 500);
                break;
              case 'silent-push':
                return false;
                /* let groups = JSON.parse(docPush.groups);
                let filter = JSON.parse(localStorage.getItem(filterNames.document));
                let chkWs = groups.filter(x => !filter.workstream.includes(x));
                let clearFields = [];
                let chkFilterData = this.commonApi.checkFilterApply(filter, clearFields);
                let chkWsFlag = (chkFilterData.filterCount == 0) ? false : true;
                //let dws = filter.workstream;
                let pushFlag = true;
                let pushText = 'push';
                let folders = docPush.fileCount;
                let fileData = JSON.parse(docPush.fileData);
                let mfgId = parseInt(docPush.mfgId);
                let makeId = parseInt(docPush.makeId);
                if(groups.length > 0 && chkWsFlag) {
                  filter = JSON.parse(localStorage.getItem(filterNames.document));
                  for (let ws of groups) {
                    console.log(ws)
                    let windex = filter.workstream.findIndex((w) => w == ws);
                    console.log(windex)
                    if (windex == -1) {
                      pushFlag = false;
                      pushText = 'load';
                      filter.workstream.push(ws);
                    }
                  }
                }
                console.log(filter)
                console.log(JSON.stringify(filter))
                localStorage.setItem(filterNames.document, JSON.stringify(filter));
                console.log(chkWs)
                if(!pushFlag) {
                  setTimeout(() => {
                    this.applyFilter(filter, pushText);
                  }, 1500);
                } else {
                  //this.commonApi.emitMessageLayoutrefresh(cdata)
                  this.docPageRef.contentLoading = false;
                  let timeout = (this.docPageRef.mainView) ? 0 : 1000;
                  setTimeout(() => {
                    this.docPageRef.getdocumentForTab(0, 1, action);
                    this.docPageRef.recentTabs[0].selected = false;
                    this.docPageRef.recentTabs[1].selected = true;
                  }, timeout);
                  console.log(folders, this.docPageRef.folders)
                  folders.forEach(item => {
                    let fid = item.id;
                    let fcount = item.fileCount;
                    let sfcount = item.subFolderCount;
                    if(this.docPageRef.mainView) {
                      let findex = this.docPageRef.folders.findIndex(option => option.id == fid);
                      if(findex >= 0) {
                        this.docPageRef.folders[findex].fileCount = fcount;
                        this.docPageRef.folders[findex].subFolderCount = sfcount;
                      }
                    }

                    console.log('Main View: ', this.docPageRef.mainView)
                    console.log('Folder View: ',this.docPageRef.folderView)
                    console.log('Subfolder View: ', this.docPageRef.subFolderView)
                    console.log('Subfolder Info: ', this.docPageRef.subFolderInfo)
                    console.log('MFG View :', this.docPageRef.mfgView)
                    console.log('MFG Info: ', this.docPageRef.mfgInfo)
                    console.log('File View: ', this.docPageRef.fileView)
                    console.log(this.docPageRef.subFolderId, fid)

                    if(this.docPageRef.fileView) {
                      alert(1)
                      this.docPageRef.contentLoading = false;
                      if(this.docPageRef.subFolderId == parseInt(fid) && this.docPageRef.mfgInfo.length == 0 && this.docPageRef.subFolderInfo.length == 0) {
                        console.log('-----3-----')
                        this.docPushApiCall(fileData[0]);
                      } else {
                        alert(2)
                        if(!this.docPageRef.mfgView && this.docPageRef.mfgInfo.length > 0 && this.docPageRef.subFolderInfo.length > 0) {
                          alert(3)
                          this.docPageRef.docApiData.mfgId = mfgId;
                          this.docPageRef.docApiData.makeId = makeId;
                          console.log(this.docPageRef.mfgInfo, this.docPageRef.subFolderInfo)
                          if(this.docPageRef.mfgInfo[0].id == mfgId && this.docPageRef.subFolderInfo[0].id == makeId) {
                            alert(4)
                            this.docPushApiCall(fileData[0]);
                          } else {
                            alert(5)
                            pushText = 'load';
                            this.applyFilter(filter, pushText);
                          }
                        } else {
                          alert(6)
                          this.docPageRef.folderId = parseInt(fid);
                          this.docPageRef.docApiData.mfgId = 0;
                          this.docPageRef.docApiData.makeId = 0;
                          pushText = 'load';
                          this.docPageRef.fileView = true;
                          this.applyFilter(filter, pushText);
                        }
                      }
                    } else if(this.docPageRef.folderView && this.docPageRef.mfgInfo.length > 0 && this.docPageRef.subFolderInfo.length == 0) {
                      alert(7)
                      this.docPageRef.docApiData.mfgId = mfgId;
                      this.docPageRef.docApiData.makeId = 0;
                      if(this.docPageRef.mfgInfo[0].id == mfgId) {
                        alert(8)
                        this.docPageRef.itemLength += 1;
                        this.docApi.getDocFile(fileData[0]).then((response) => {
                          let folders:any = this.docPageRef.mfg.filter(opt => opt.docType == 'folder');
                          let files:any = this.docPageRef.mfg.filter(opt => opt.docType == 'file');
                          let file = response['files'][0];
                          files.unshift(file);
                          this.docPageRef.mfg = folders.concat(files);
                          let action = 'push';
                          let fileData = {
                            action,
                            access: this.docData.accessFrom,
                            items: this.docPageRef.mfg,
                            thumbView: this.docPageRef.thumbView
                          }
                          this.commonApi.emitFileList(fileData);
                        });
                      } else {
                        alert(9)
                        pushText = 'load';
                        this.applyFilter(filter, pushText);
                      }
                    } else if(!this.docPageRef.mainView && this.docPageRef.folderView && !this.docPageRef.mfgView && this.docPageRef.mfgInfo.length == 0 && this.docPageRef.subFolderInfo.length == 0) {
                      alert(10)
                      let findex = this.docPageRef.folders.findIndex(option => option.id == mfgId);
                      if(findex >= 0) {
                        this.docPageRef.folders[findex].fileCount += 1;
                      }
                    } else {
                      alert(11)
                      if(!this.docPageRef.mainView) {
                        this.docPageRef.folderId = 0;
                        this.docPageRef.docApiData.mfgId = 0;
                        this.docPageRef.docApiData.makeId = 0;
                        pushText = 'load';
                        this.docPageRef.mainView = true;
                        this.applyFilter(filter, pushText);
                      }
                    }
                  });
                } */
                break;
            }
          }
        }
      })
    );

    /* setTimeout(() => {
      let docPush:any = localStorage.getItem('docPush');
      docPush = (docPush == null) ? '' : JSON.parse(docPush);
      console.log(docPush);
      if(docPush != '') {
        let groups = JSON.parse(docPush.groups);
        let filter = JSON.parse(localStorage.getItem(filterNames.document));
        let chkWs = groups.filter(x => !filter.workstream.includes(x));
        let wsFlag = (chkWs.length > 0) ? true : false;
        //let dws = filter.workstream;
        let pushText = 'push';
        if(groups.length > 0) {
          filter = JSON.parse(localStorage.getItem(filterNames.document));
          for (let ws of groups) {
            console.log(ws)
            let windex = filter.workstream.findIndex((w) => w == ws);
            console.log(windex)
            if (windex == -1) {
              pushText = 'load';
              filter.workstream.push(ws);
            }
          }
        }
        console.log(filter)
        console.log(JSON.stringify(filter))
        localStorage.setItem(filterNames.document, JSON.stringify(filter));
        console.log(chkWs)
        //if(!pushFlag) {
          console.log(localStorage.getItem(filterNames.document));
          setTimeout(() => {
            this.applyFilter(filter, pushText);
          }, 1500);
        //}

        let cdata = {
          action: 'doc-push-load',
          pushData: docPush,
          wsFlag: wsFlag
        }
        //this.commonApi.emitMessageLayoutrefresh(cdata)
      }
    }, 4500); */
  }

  docPushApiCall(fileData) {
    let action = 'push';
    this.docApi.getDocFile(fileData).then((response) => {
      this.docPageRef.itemLength += 1;
      let file = response['files'][0];
      this.docPageRef.files.unshift(file);
      let fileData = {
        action,
        access: this.docData.accessFrom,
        items: this.docPageRef.files,
        thumbView: this.docPageRef.thumbView
      }
      this.commonApi.emitFileList(fileData);
    });
  }

  // Apply Search
  applySearch(action, val) {
    console.log(action)
    let callBack = false;
    this.searchVal = val;
    this.headercheckDisplay = "checkbox-hide";
    this.headerCheck = "unchecked";
    this.docData['headerCheck'] = this.headerCheck;
    this.docData['headercheckDisplay'] = this.headercheckDisplay;
    this.docData['searchVal'] = this.searchVal;
    this.docData['action'] = 'filter';
    switch (action) {
      case 'destroy':
        this.docPageRef.ngOnDestroy();
        break;
      case 'folder':
        this.newfolderpopup();
        break;
      case 'reset':
        setTimeout(() => {
          this.ngOnInit();
        }, 100);
        break;
      default:
        if (action == 'emit') {
          this.headerData['searchVal'] = this.searchVal;
          this.headerFlag = true;
        }
        console.log(this.docData)
        this.commonApi.emitDocumentListData(this.docData);
        setTimeout(() => {
          if (action == 'init') {
            this.headerFlag = true;
          }
        }, 500);
        break;
    }
    if(this.documentApprovalFlag){
      if(this.filterActiveCount>0){
        this.expandFlag = true;
        this.docData.expandFlag = this.expandFlag;
      }
    }

    if (callBack) {
      this.commonApi.emitDocumentListData(this.docData);
    }
  }



  // Nav Page Edit or View
  navPage(type) {
    /*let currUrl = this.router.url;
    currUrl = currUrl.substr(currUrl.indexOf('/') + 1);
    localStorage.setItem('docNav', currUrl);*/
    let url;
    if(type=='create-folder')
    {
     // this.createFolderdiaLog=true;
     this.newfolderpopup();
    }
    else
    {
      this.createFolderdiaLog=false;
      url = `${this.docsUrl}/${type}`;
      if(this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      }
      else{
        window.open(url, url);
      }
    }

  }

  newfolderpopup() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'New Folder';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = [];
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      //console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;
      msgModalRef.componentInstance.type = 'password';
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.docData.action = 'folder-creation';
        this.commonApi.emitDocumentListData(this.docData);
      }, 3000);
    });
  }

  // Pin or Unpin
  pinnedList(flag) {
    this.docData.action = 'pin';
    this.pinFlag = flag;
    this.pinType = (flag) ? 'pined' : '';
    this.pinClass = (flag) ? 'active' : 'normal';
    this.docData.thumbView = this.thumbView;
    this.docData.action = 'pin';
    this.docData.pinFlag = this.pinFlag;
    this.docData.type = this.pinType;
    this.commonApi.emitDocumentListData(this.docData);
  }

  // Change the view
  viewType(actionFlag) {
    if (!this.itemEmpty) {
      this.thumbView = (actionFlag) ? false : true;
      console.log(this.thumbView)
      let viewType = (this.thumbView) ? 'thumb' : 'list';
      let apiCall = (this.CBADomain) ? true : false;
      this.threadThumbInit = (this.thumbView) ? this.threadThumbInit++ : this.threadThumbInit;
      let loadThumb = (this.threadThumbInit == 0) ? true : false;
      this.commonApi.updateLsitView('threads', viewType, apiCall);
      setTimeout(() => {
        this.docData.thumbView = this.thumbView;
        this.docData.action = 'view';
        this.commonApi.emitDocumentListData(this.docData);
      }, 50);
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    let titleHeight = 0;
    if(!this.teamSystem) {
      let docHeaderHeight = document.getElementsByClassName('prob-header');
      headerHeight = (docHeaderHeight) ? docHeaderHeight[0].clientHeight : headerHeight;
    }
    if(!this.fluid){
      let docListHeight = document.getElementsByClassName('document-list-head');
      titleHeight = (docListHeight) ? docListHeight[0].clientHeight : titleHeight;
    }
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight - (headerHeight + footerHeight + 30));
    this.innerHeight = this.innerHeight - titleHeight;
    this.filterHeight = (window.innerHeight);
    this.filterOptions['filterHeight'] = this.innerHeight;
  }

  // Document List Call Back
  docListCallBack(type, action) {
    this.headerFlag = (type == 'pin') ? this.headerFlag : false;
    this.section = action;
    let searchVal = '';
    this.applySearch(action, searchVal);
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.docData.expandFlag = toggleFlag;
    this.docData.action = 'filter-toggle';
    this.thumbView = this.documentApprovalFlag ? false : this.thumbView;
    this.commonApi.emitDocumentListData(this.docData);
  }

  // Apply Filter
  applyFilter(filterData, loadpush = '') {
    console.log(filterData)
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      if(this.cbaDomain) {
        this.expandFlag = true;
        this.filterOptions['filterExpand'] = true;
      }
      this.filterActiveCount = 0;
      this.docData['loadAction'] = (loadpush) ? loadpush : '';
      this.docData['filterOptions'] = filterData;
      this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
      setTimeout(() => {
        filterData["filterrecords"] = this.filterCheck();
        this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
        this.filterRef.activeFilter = this.filterActiveCount > 0 ? true : false;
        localStorage.setItem('docFilter', JSON.stringify(filterData));
        this.applySearch('filter', this.searchVal);
      }, 500);
    } else {
      localStorage.removeItem('docFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    if(this.cbaDomain) {
      this.expandFlag = true;
      this.filterOptions['filterExpand'] = true;
    }

    this.currYear = moment().format("Y");
    this.filterLoading = true;
    this.filterOptions["filterLoading"] = this.filterLoading;
    this.filterOptions['expandFlag'] = true;
    this.filterOptions['filterActive'] = false;
    this.applySearch('reset', this.searchVal);
    setTimeout(() => {
      //this.filterLoading = false;
    }, 700);
  }

  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.docData['headerCheck'] = this.headerCheck;
    this.docData['headercheckDisplay'] = this.headercheckDisplay;
    this.docData['action'] = 'clear';
    this.commonApi.emitPartListData(this.docData);
  }

  // Toggle Action
  toggleAction(data) {
    console.log(data)
    let flag = data.action;
    let access = data.access;
    let toggleActionFlag = true;
    this.emptyFlag = false;
    switch(access) {
      case 'info':
        let sdata = {
          access: 'toggle',
          action: 'scroll',
          expand: !this.rightPanel,
          id: data.docDetail.resourceID,
        }
        this.commonApi.emitDocumentScroll(sdata);
        break;
      case 'empty':
        toggleActionFlag = false;
        this.docDetail = [];
        this.emptyFlag = true;
        this.rightPanel = false;
        break;
      default:
        this.docDetail = [];
        break;
    }
    if(toggleActionFlag) {
      this.docDetail = data.docDetail;
      this.toggleInfo(flag);
    }
  }

  // Toogle Document Info
  toggleInfo(flag) {
    this.docData.action = 'toggle';
    this.docData.expandFlag = !flag;
    this.commonApi.emitDocumentListData(this.docData);
    this.commonApi.emitMessageLayoutChange(flag);
    setTimeout(() => {
      this.rightPanel = !flag;
      let docInfoData = {
        action: '',
        apiData: [],
        docDetail: [],
        loading: false,
        panelFlag: this.rightPanel
      };
      if(!this.rightPanel) {
        docInfoData.action = 'panel';
        this.commonApi.emitDocumentPanelData(docInfoData);
      }
    }, 100);
  }

  // helpContent list and view
  helpContent(id){
    id = (id>0) ? id : '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('tooltipId', id);

    this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        if(id == ''){
          let contentData = response.tooltips;
          for (let cd in contentData) {
            let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
            if(welcomePopupDisplay == '1'){
              if(contentData[cd].id == '6' && contentData[cd].viewStatus == '0' ){
                console.log(contentData[cd].title);
                this.thelpContentStatus = contentData[cd].viewStatus;
                this.thelpContentFlagStatus = true;
                this.thelpContentId = contentData[cd].id;
                this.thelpContentTitle = contentData[cd].title;
                this.thelpContentContent = contentData[cd].content;
                this.thelpContentIconName = contentData[cd].itemClass;
              }
            }
          }
          if(this.thelpContentFlagStatus){
              this.tooltip.open();
          }
        }
        else{
        console.log(response.result);
        this.tooltip.close();
        }
      }
    });
  }
  approvalDocList(){
    localStorage.setItem("documentApprovalPage","1");
    setTimeout(() => {
      this.ngOnInit();
    }, 100);

  }
  backToDocList(){
    localStorage.removeItem("documentApprovalPage");
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  selectEvent(event,type)
  {
    this.docData.thumbView = !this.thumbView;
    if(type == 'order'){
      this.docData.action = 'sort';
      this.docData.type = event.value.code;
      this.commonApi.emitDocumentListData(this.docData);
    }
    else{
      this.docData.action = 'approval-status';
      this.docData.approvalType = event.value.code;
      this.commonApi.emitDocumentListData(this.docData);
    }
  }

  docCallback(data) {}

  filterCallback(data) {
    console.log(data)
    this.filterRef = data;
    let action = data.actionFilter;
    switch(action) {
      case 'filter':
        this.filterRef.activeFilter = true;
        let getFilteredValues = JSON.parse(
          localStorage.getItem(filterNames.document)
        );
        Object.keys(getFilteredValues).forEach(key => {
          let val = getFilteredValues[key];
          switch(key) {
            case 'workstream':
              this.filterRef.storedWorkstreams = val;
              break;
            case 'model':
              this.filterRef.storedModels = val;
              break;
          }
        });
        break;
      case 'clear':
        this.filterRef.storedWorkstreams = [];
        this.filterRef.storedModels = [];
        this.filterRef.storedErrorCode = [];
        this.filterRef.activeFilter = false;
        break;
    }
  }

  // if any one filter is ON
  filterCheck(action = ''){
    this.filterrecords = false;

    if(this.filterActiveCount > 0 && action == ''){
      this.filterrecords = true;
    }
    console.log("**********************");
    console.log(this.filterrecords);
    console.log("**********************");
    return this.filterrecords;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
