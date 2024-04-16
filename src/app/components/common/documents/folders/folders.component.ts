import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxMasonryComponent } from "ngx-masonry";
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonService } from "src/app/services/common/common.service";
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Constant } from 'src/app/common/constant/constant';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';

@Component({
    selector: 'app-folders',
    templateUrl: './folders.component.html',
    styleUrls: ['./folders.component.scss'],
    styles: [
        `
          .masonry-item {
            transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
          }`
    ]
})
export class FoldersComponent implements OnInit {
    @Input() items = [];
    @Input() thumbView: boolean = true;
    @Input() section: string;
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
    @Output() scrollActionEmit: EventEmitter<any> = new EventEmitter();
    public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
    public updateMasonryLayout: boolean = false;
    public user;
    public countryId;
    public domainId;
    public userId;
    public apiKey: string = Constant.ApiKey;
    public domainAccess: boolean = true;
    public listHeight: any = 0;
    public bodyElem;
    public bodyClass:string = "profile";
    public bodyClass1:string = "image-cropper";
    public headercheckDisplay: string = "checkbox-hide";
    public headerCheck: string = "unchecked";
    public searchVal: string = '';
    public pageAccess: string = "documents";
    public uploadTxt: string = "Upload Image";
    public updateTxt: string = "Update Image";
    public rightPanel: boolean = false;
    public pinType: string = "";
    public pinFlag: boolean = false;
    public headerFlag: boolean = false;
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
        section: '',
        thumbView: this.thumbView,
        searchVal: this.searchVal,
        userId: 0,
        pinFlag: this.pinFlag,
        type: this.pinType,
        headerFlag: this.headerFlag
      };
    constructor(
        private httpClient: HttpClient,
        private apiUrl: ApiService,
        private authenticationService: AuthenticationService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private config: NgbModalConfig,
        private documentationService: DocumentationService,
        private commonService: CommonService,
        private route: ActivatedRoute, private router: Router) { }
    ngOnInit() {        
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.listHeight = (this.section == 'main') ? 500 : 280;
        window.addEventListener('scroll', this.scroll, true); 
        this.countryId = localStorage.getItem('countryId');
        this.user = this.authenticationService.userValue;
        this.domainId = this.user.domain_id;
        this.userId = this.user.Userid;
        if (this.thumbView) {
            setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
            }, 2000);
        }
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
        let action = (event.isMfg) ? 'manufacturer' : (!event.isMfg && event.isMake) ? 'subFolders' : (event.subFolderCount > 0) ? 'folders' : 'files';
        if((action == 'manufacturer' && (event.subFolderCount > 0 || event.fileCount > 0)) || event.fileCount > 0) {
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

    editfolderpopup(name,id,workstreamsList) {
        console.log(workstreamsList);
        console.log(name);
        console.log(id);
        let apiData = {
          apiKey: this.apiKey,
          userId: this.userId,
          domainId: this.domainId,
          countryId: this.countryId
        }
        let actionInfo = {
            action: 'edit',
            id: id,
            name: name,
            workstreamsList:workstreamsList
        }
        localStorage.setItem('workstreamsList',JSON.stringify(workstreamsList));
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = 'Edit Folder';
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          console.log(receivedService)
          const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
          msgModalRef.componentInstance.successMessage = receivedService.message;          
          setTimeout(() => {            
            msgModalRef.dismiss('Cross click'); 
            localStorage.removeItem('workstreamsList');           
            let rmIndex;
            rmIndex = this.items.findIndex((option) => option.id == id); 
            this.items[rmIndex].folderName = receivedService.folderName;
            this.items[rmIndex].workstreamsList = receivedService.wslist;
            this.items[rmIndex].refresh = receivedService.refresh;
            console.log(this.items[rmIndex].workstreamsList);    
            console.log(this.items[rmIndex].folderName);    
            console.log(this.items[rmIndex].refresh);    
            console.log(this.items);
            if(this.items[rmIndex].refresh == '1'){
                location.reload();
                /*this.docData.action = 'folder-edit';
                this.commonService.emitDocumentListData(this.docData);*/
            }
            else{
                setTimeout(() => {
                    this.masonry.reloadItems();
                    this.masonry.layout();
                    this.updateMasonryLayout = true;
                    this.updateLayout();
                }, 100); 
            }           
          }, 3000);
        });
    }

    deletefolderpopup(name,id,count) {
        console.log(name);
        console.log(id);
        let apiData = {
            apiKey: this.apiKey,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId                
        }
        let actionInfo = {
            action: 'delete',
            id: id,
            name: name,
            count: count
        }
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = 'Delete Folder';
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss('Cross click');
            console.log(receivedService)
            const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
            msgModalRef.componentInstance.successMessage = receivedService.message;  
            setTimeout(() => {            
                msgModalRef.dismiss('Cross click');            
                let rmIndex;
                rmIndex = this.items.findIndex((option) => option.id == id); 
                let updateCount = this.items[rmIndex].fileCount;
                this.items.splice(rmIndex, 1);  
                console.log(updateCount, this.items);

                let updateFolder, fileCount;
                let platformId: any = localStorage.getItem('platformId');
                platformId = (platformId == 'undefined' || platformId == undefined) ? platformId : parseInt(platformId);
                        
                switch(receivedService.action) {
                    case 'all':
                        updateFolder = this.items.findIndex((option) => option.isSystemFolder == 1 && option.folderName == 'ALL FILES');
                        fileCount = this.items[updateFolder].fileCount-updateCount;
                        this.items[updateFolder].fileCount = fileCount;
                        break;
                    case 'general':
                        let chkGeneralFolder = (platformId == 2 && this.domainId == 52) ? 'General Automotive Info' : 'GENERAL';
                        updateFolder = this.items.findIndex((option) => option.isSystemFolder == 1 && option.folderName == chkGeneralFolder);
                        fileCount = this.items[updateFolder].fileCount+updateCount;
                        this.items[updateFolder].fileCount = fileCount;
                        break;    
                }

                setTimeout(() => {
                    this.masonry.reloadItems();
                    this.masonry.layout();
                    this.updateMasonryLayout = true;
                    this.updateLayout();
                }, 100); 
            }, 3000);
        });
    }

    scroll = (event: any): void => {
        //console.log(event);
        //console.log(event.target.className);
        //if(event.target.className=='ps ps--active-y ps--scrolling-y')
        //{
            this.scrollActionEmit.emit(event);
            event.preventDefault;
        //}        
    }

    // Update Manufacturer Logo
    updateLogo(item, action) {
        console.log(item)
        this.bodyElem = document.getElementsByTagName('body')[0];  
        this.bodyElem.classList.add(this.bodyClass);  
        this.bodyElem.classList.add(this.bodyClass1);
        let access = (!item.isMfg && !item.isMake) ? "folderLogo" : (item.isMake) ? "makeLogo" : "mfgLogo";
        console.log(access)
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
                        }
                        console.log(res);            
                    },
                    (error => {})
                    );
                }
            });
        }
    }
}