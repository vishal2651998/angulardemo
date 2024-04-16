import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { NgxMasonryComponent } from "ngx-masonry";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonService } from "src/app/services/common/common.service";
import { AppService } from 'src/app/modules/base/app.service';
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss'],
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
export class DocListComponent implements OnInit {
  @Input() items = [];
  @Input() thumbView: boolean = true;
  @Input() section: string;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Output() scrollActionEmit: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public assetPartPath: string = "assets/images/documents/";
  public chevronImg: string = `${this.assetPartPath}chevron-dark.png`;
  public updateMasonryLayout: boolean = false;
  public user;
  public countryId;
  public domainId;
  public userId;
  public apiKey: string = this.appService.appData.apiKey;
  public apiData: any = [];
  public domainAccess: boolean = true;
  public scrollPos: number = 0;
  public docInfoData: any = {};
  public secHeight: any = 0;
  public listHeight: any = 0;
  public bodyElem;
  public bodyClass:string = "profile";
  public bodyClass1:string = "image-cropper";
  public panelFlag: boolean = false;
  public uploadTxt: string = "Upload Image";
  public updateTxt: string = "Update Image";
  public galleryFlag:boolean = true;
  public singleClick = false;
  public doubleClick = false;
  public docAction: string = "view";

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private apiUrl: ApiService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private config: NgbModalConfig,
    private commonService: CommonService,
    private appService: AppService,
    private documentationService: DocumentationService,
  ) { }

  ngOnInit(): void {
    console.log(this.items)
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.listHeight = (this.section == 'main') ? 500 : 280;
    window.addEventListener('scroll', this.scroll, true); 
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.secHeight = 230;
    this.listHeight = 280;
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

    if (this.thumbView) {
      setTimeout(() => {
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
      }, 2000);
    }

    this.commonService.documentFileListData.subscribe((
      fileData: any) => {
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

    this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => { //Right side panel show & hide
        console.log(r)
        
        if(this.thumbView) {
            this.updateLayout();
        }
    });

    this.commonService._OnLayoutStatusReceivedSubject.subscribe((r) => {
        let action = r['action'];
        if(action == 'folder-layout') {
            if(this.thumbView) {
                this.updateLayout();
            }
        }
    });

    this.commonService.documentPanelDataReceivedSubject.subscribe((response) => {
      this.panelFlag = response['panelFlag'];
    });

    this.commonService.documentListDataReceivedSubject.subscribe((docsData: any) => { //Right side panel show & hide
      this.thumbView = docsData['thumbView'];    
        if(this.thumbView) {
            setTimeout(() => {
                //this.masonry.reloadItems();
                //this.masonry.layout();
                //this.updateMasonryLayout = true;
                this.updateLayout();
            }, 100);
        } else {
            this.updateLayout();
        }
    });
  }

  viewDocument(event) {
    console.log(event);
    this.panelFlag = false;
    let action = event.isMake ? 'subFolders' : (event.subFolderCount > 0) ? 'folders' : 'files';
    if(event.fileCount > 0) {
        let data = {
            action: action,
            folderId: event.id,
            subFolderId: (event.isMake) ? event.id : '',
            docData: [],
            thumbView: this.thumbView,
            subFolderCount: event.subFolderCount
        }
        this.commonService.emitDocumentListData(data);
        this.commonService.emitDocumentPanelFlag(data);
    }        
  }

  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
        this.updateMasonryLayout = false;
    }, 500);
  }

  scroll = (event: any): void => {
    console.log(event);
    console.log(event.target.className);
    //if(event.target.className=='ps ps--active-y ps--scrolling-y')
    //{
        this.scrollActionEmit.emit(event);
        event.preventDefault;
    //}        
  }

  // Update Manufacturer Logo
  updateLogo(item, action) {
    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass1);
    let access = "makeLogo";
    if(action == 'upload') {
      const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.domainId = this.domainId;
      modalRef.componentInstance.type = "Edit";
      modalRef.componentInstance.profileType = access; 
      modalRef.componentInstance.id = item.id;     
      modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
          if (receivedService) {
              //console.log(receivedService);
              this.bodyElem = document.getElementsByTagName('body')[0];
              this.bodyElem.classList.remove(this.bodyClass);  
              this.bodyElem.classList.remove(this.bodyClass1);
              modalRef.dismiss('Cross click');       
              item.logo = receivedService.show;              
          }
      });
    } else {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Delete';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
          modalRef.dismiss('Cross click'); 
          if(receivedService) {
            const formData = new FormData();
            formData.append('apiKey', this.apiKey);
            formData.append('userId', this.userId);
            formData.append('domainId', this.domainId);
            formData.append('access', access);
            formData.append('id', item.id);
            let serverUrl = this.apiUrl.apiRemoveLogo();    
            this.httpClient.post<any>(serverUrl, formData).subscribe(res => {
                if(res.status=='Success') {
                  item.logo = '';
                  item.isDef = true;
                }
                console.log(res);            
              },
              (error => {})
            );
          }
      });
    }
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
    if(list.docType == 'folder') {
      this.viewDocument(list);
    } else {
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
      if(item.docType == 'folder') {
        this.docListViewSelection(doc);
      } else {
        this.openGallery(item);
      }
    } else {
      console.log(123)
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
        if (this.doubleClick === false) {
          //this.openDetailView(item);
          this.docListViewSelection(item);          
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
