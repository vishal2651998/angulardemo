import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from "@angular/core";
import { NgxMasonryComponent } from "ngx-masonry";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { AppService } from 'src/app/modules/base/app.service';
import { CommonService } from "src/app/services/common/common.service";
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as moment from 'moment';

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    styles: [
        `:host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            position: -webkit-sticky;
            position: sticky;
            top: 0px;
        }

        @media screen and (max-width: 64em) {
            :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
                top: 0px;
            }
        }
          .masonry-item {
            transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
          }`
    ]
})


export class FilesComponent implements OnInit {
    @Input() items = [];
    @Input() thumbView: boolean = true;
    @Input() access: string = "doc";
    public sconfig: PerfectScrollbarConfigInterface = {};
    public teamSystem=localStorage.getItem('teamSystem');
    public assetPartPath: string = "assets/images/documents/";
    public chevronImg: string = `${this.assetPartPath}chevron-dark.png`;
    public userId: any;
    public roleId: any;
    public apiData: any = [];
    public domainId = 1;
    public countryId;
    public apiKey: string = this.appService.appData.apiKey;
    public docInfoData: any = {};
    public panelFlag: boolean = false;
    public scrollPos: number = 0;
    public secHeight: any = 0;
    public listHeight: any = 0;
    public mfg: boolean = false;
    public galleryFlag:boolean = true;
    public singleClick = false;
    public doubleClick = false;
    public docAction: string = "view";
    public folderId: any = 0;
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
    @Output() scrollActionEmit: EventEmitter<any> = new EventEmitter();
    
    public updateMasonryLayout: boolean = false;
    constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private documentationService: DocumentationService,
      private commonService: CommonService,
      private appService: AppService,
    ) { }
    
        ngAfterViewInit(): void {
            const frozenBody: HTMLElement | null = document.querySelector('.ui-table-frozen-view .ui-table-scrollable-body');
            const scrollableArea: HTMLElement | null = document.querySelector('.ui-table-scrollable-view.ui-table-unfrozen-view .ui-table-scrollable-body');
            if (frozenBody && scrollableArea) {
              frozenBody.addEventListener('wheel', e => {
                const canScrollDown = scrollableArea.scrollTop < (scrollableArea.scrollHeight - scrollableArea.clientHeight);
                const canScrollUp = 0 < scrollableArea.scrollTop;
        
                if (!canScrollDown && !canScrollUp) {
                  return;
                }
        
                const scrollingDown = e.deltaY > 0;
                const scrollingUp = e.deltaY < 0;
                const scrollDelta = 100;
        
                if (canScrollDown && scrollingDown) {
                  e.preventDefault();
                  scrollableArea.scrollTop += scrollDelta;
                } else if (canScrollUp && scrollingUp) {
                  e.preventDefault();
                  scrollableArea.scrollTop -= scrollDelta;
                }
              });
            }
          }

    ngOnInit() {
        window.addEventListener('scroll', this.scroll, true); 
        console.log(this.items);
        this.countryId = localStorage.getItem('countryId');
        let user: any = this.authenticationService.userValue;
        if (user) {
            this.domainId = user.domain_id;
            this.userId = user.Userid;
            this.roleId = user.roleId;
            this.apiData = {
                apiKey: this.apiKey,
                userId: this.userId,
                domainId: this.domainId,
                countryId: this.countryId,
                dataId: 0,
                platformId: 3,
            };
            this.docInfoData = {
                action: 'load',
                dataId: 0,
                docData: [],
                loading: true
            };
            this.secHeight = 230;
            this.listHeight = 280;
            console.log(this.items)
            let ids = this.items.map(o => o.resourceID)
            let filtered = this.items.filter(({resourceID}, index) => !ids.includes(resourceID, index + 1));
            console.log(filtered);
            if(localStorage.getItem('searchValue'))
            {
                
            }
            else
            {
                this.items = filtered;    
            }
          //  this.items = filtered;
            if(this.items.length < 21 && this.items.length > 0) {
                //this.initDoc();
            }
            if (this.thumbView) {
             
              if(localStorage.getItem('searchValue'))
            {

            }
            else
            {
              setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
              
               
               
                }, 1000);

            }
                            
            }
            this.items.forEach((item, i) => {
              if(i == 0) {
                this.folderId = item.assignedFolderId;
              }
              if(item.manufacturer != '') {
                  this.mfg = true;
              }
            })
        }        

        this.commonService.documentPanelDataReceivedSubject.subscribe((response) => {
            this.panelFlag = response['panelFlag'];
        });

        this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => { //Right side panel show & hide
            console.log(r, this.docInfoData.docData.resourceID)
            this.updateLayout();
        });
        this.commonService.documentListDataReceivedSubject.subscribe((docsData: any) => { //Right side panel show & hide            
            console.log(docsData)
            this.thumbView = docsData['thumbView'];
            if(docsData['accessFrom'] == 'documents') {
              this.folderId = docsData['folderId'];
              this.updateLayout();                            
            }   
        });  

        this.commonService.documentFileListData.subscribe((fileData: any) => {
            this.thumbView = fileData['thumbView'];
            console.log(fileData, this.thumbView)
            let access = fileData['access'];
            let action = fileData['action'];
            this.items = fileData['items'];
            let ids = this.items.map(o => o.resourceID)
            console.log(ids)
            let filtered = this.items.filter(({resourceID}, index) => !ids.includes(resourceID, index + 1));
            this.items = filtered;
            console.log(filtered)

            if(this.thumbView && access == 'documents' && action == 'push') {
              setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateLayout();
              }, 500);
            }
        });
        
        this.commonService._OnLayoutStatusReceivedSubject.subscribe((r) => {
            console.log(r)
            let action = r['action'];
            switch (action) {
              case 'folder-layout':
                if(this.thumbView) {
                  this.updateLayout();
                }
                break;
            }            
        });
    }

    // Initialize Files
    initDoc() {
        this.docInfoData.docData = this.items[0].docData;
        let dataId = this.items[0].resourceID;
        if(this.items[0].docData.expand == 1) {
            let data = {
                access: 'infocallback',
                docData: this.items[0].docData,
                flag: !this.panelFlag
            }
            //this.commonService.emitDocumentPanelFlag(data);
        } else {
            //this.docSelection(this.items, this.items[0]);
        }
    }

    iconClick(icon) {
        console.log(icon);
        let className = icon.target.className;
        let text = icon.target.innerText;
        let id = icon.target.id;
        let type = icon.target.title;
        let status: any;
        let itemIndex = this.items.findIndex(item => item.resourceID == id);
        let likeCount = this.items[itemIndex].likeCount;
        let pinCount = this.items[itemIndex].pinCount;
        let inc = 1;
        if (className.indexOf('active') != -1) { // Make inactive
            icon.target.className = className.replace(' active', "");
            if (type == "pin") { status = "dispined";  pinCount -= inc;}
            else if (type == "like") { status = "disliked"; likeCount -= inc;}
        } else { // Make active
            icon.target.className = className + " active";
            if (type == "pin") { status = "pined";  pinCount += inc;}
            else if (type == "like") { status = "liked";  likeCount += inc;}
        }
        this.items[itemIndex].likeCount = likeCount;
        this.items[itemIndex].pinCount = pinCount;
        this.items[itemIndex].docData.likeCount = likeCount;
        this.items[itemIndex].docData.pinCount = pinCount;
        //console.log(id, type, status, likeCount, pinCount)
        this.documentationService.addLikePins(this.userId, this.domainId, this.countryId, id, type, status).then((response: any) => {
        });
    }

    updateLayout() {
     
        this.updateMasonryLayout = true;
        setTimeout(() => {
            this.updateMasonryLayout = false;
        }, 500);
    }

    // Document Selection
    docSelection(list, item) {
        let id = item.resourceID;
        let secElement = document.getElementById(id);
        setTimeout(() => {
            console.log(id, secElement.scrollTop)
          secElement.scrollTop = this.scrollPos;
        }, 200);
        for(let d of list) {
          d.selected = (parseInt(d.resourceID) == id) ? true : false;
        }
        console.log(list, this.panelFlag)
        let timeout = 100;
        setTimeout(() => {
          this.docInfoData.flag = true;
          this.docInfoData.access = 'files';  
          this.docInfoData.action = 'load';
          this.docInfoData.docData = item.docData;
          this.apiData.dataId = id;
          this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
          this.commonService.emitDocumentPanelFlag(this.docInfoData);
          if(this.panelFlag) {
            //this.emitDocInfo(id);
          } else {
            //this.commonService.emitDocumentPanelFlag(this.docInfoData);
            this.panelFlag = true;
            if(this.thumbView)
                this.updateLayout();
          }
          let secHeight = document.getElementsByClassName('documents-thumb-view')[0].clientHeight;
          let listHeight = document.getElementsByClassName('file-list')[0].clientHeight;
          console.log(secHeight, listHeight)
        }, timeout);
    }

    // Document Selection
    docListViewSelection(list) {
        let id = list.resourceID;
        let secElement = document.getElementById(id);
        setTimeout(() => {
            console.log(id, secElement.scrollTop)
          secElement.scrollTop = this.scrollPos;
        }, 200);
        for(let d of this.items) {
          d.selected = (parseInt(d.resourceID) == id) ? true : false;
        }
        console.log(this.items, this.panelFlag)
        let timeout = 100;
        setTimeout(() => {
          this.docInfoData.flag = true;
          this.docInfoData.access = 'files';  
          this.docInfoData.action = 'load';
          this.docInfoData.docData = list.docData;
          this.apiData.dataId = id;
          this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
          this.commonService.emitDocumentPanelFlag(this.docInfoData);
          if(this.panelFlag) {
            //this.emitDocInfo(id);
          } else {
            //this.commonService.emitDocumentPanelFlag(this.docInfoData);
            this.panelFlag = true;
            if(this.thumbView)
                this.updateLayout();
          }    
        }, timeout);
    }

    // Emit Document Info
    emitDocInfo(dataId) {
        this.docInfoData.loading = true;
        this.docInfoData.dataId = dataId;
        console.log(this.docInfoData)
        this.commonService.emitDocumentInfoData(this.docInfoData);
    }

    scroll = (event: any): void => {
        //console.log(event, event.target.id);
        //console.log(event.target.className);
        if(event.target.id=='documentList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
            this.scrollActionEmit.emit(event);
            event.preventDefault;
        }        
    }

    openDetailView(item){
      if(!document.body.classList.contains("thread-detail")) {
          document.body.classList.add("thread-detail");
        }
        let navFrom = this.commonService.splitCurrUrl(this.router.url);
        let wsFlag: any = (navFrom == ' documents') ? false : true;
        let scrollTop:any = 0;
        let docId = item.resourceID;
        localStorage.setItem('docId', docId);
        localStorage.setItem('docIddetail', docId);
        localStorage.setItem('docInfoNav', 'true');
        this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
        let nav = `documents/view/${docId}`;
        this.router.navigate([nav]);
        setTimeout(() => {
          this.commonService.emitRightPanelOpenCallData(true);
        }, 100);    
    }
  callbackClick(doc, item) { 
    console.log(doc,item)
    if (this.singleClick === true) {
      this.doubleClick = true;
      this.openGallery(item);           
    } else {
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
        if (this.doubleClick === false) {
          //this.openDetailView(item);
          if(this.thumbView) {
            this.docSelection(doc, item);
          } else {
            this.docListViewSelection(doc);
          }         
        }
        this.doubleClick = false;
      }, 500);
    }
  }

  // Open Light Gallery
  openGallery(item) {
    let docId = item.resourceID;
    this.apiData.dataId = docId;
    this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
    if(item.attachments.length > 0) {
      let gid = `lg-0-${docId}`;
      let element: HTMLElement = document.getElementById(gid) as HTMLInputElement;
      element.click();
    } else {
      let scrollTop = 0;
      let navFrom = this.commonService.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' documents') ? false : true;
      localStorage.setItem('docId', docId);
      localStorage.setItem('docIddetail', docId);
      localStorage.setItem('docInfoNav', 'true');
      this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      let nav = `documents/view/${docId}`;
	    this.router.navigate([nav]);
    }
  }

}