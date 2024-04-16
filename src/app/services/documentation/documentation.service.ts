import { Injectable } from "@angular/core";
import { AppService } from "src/app/modules/base/app.service";
import { BaseService } from "src/app/modules/base/base.service";
import { CommonService } from "src/app/services/common/common.service";
import { LandingpageService } from "src/app/services/landingpage/landingpage.service";
import * as moment from 'moment';
import { Observable, of } from "rxjs";
import {
    pageInfo,
    Constant,
    PlatFormType,
  } from "src/app/common/constant/constant";
import { ProductMatrixService } from "src/app/services/product-matrix/product-matrix.service";

@Injectable({
    providedIn: 'root'
})
export class DocumentationService {
    constructor(private baseService: BaseService,
        private appService: AppService,
        private ProductMatrixApi: ProductMatrixService,
        private LandingpagewidgetsAPI: LandingpageService,
        private commonApi: CommonService) { }       

    getALLDocument(filterOptions: any) {

        let platformId = localStorage.getItem("platformId");
        let GetfoldersandDocument = "GetfoldersandDocuments";
        if (platformId == PlatFormType.Collabtic || PlatFormType.CbaForum) {
            GetfoldersandDocument = "GetfoldersandDocumentsv1";
        }
        else{
            GetfoldersandDocument = "GetfoldersandDocuments";
        }
        
        console.log(filterOptions)
        let promise = new Promise((resolve, reject) => {
            let documents = {
                loader: true,
                folders: [],
                files: [],
                mfg: [],
                mfgInfo: [],
                otherTechInfo: [],
                folderInfo: [],
                makeInfo: [],
                docInfoArray: [],
                priorityIndexValue: '',
                total: 0
            };
            this.baseService.get("resources", GetfoldersandDocument , filterOptions)
                .subscribe((data: any) => {
                    documents.total = data.total;
                    documents.mfgInfo = data.mfgInfo != undefined ? data.mfgInfo : [];
                    documents.otherTechInfo = data.otherTechInfo != undefined ? data.otherTechInfo : [];
                    documents.folderInfo = data.folderInfo;
                    documents.makeInfo = data.makeInfo;
                    documents.docInfoArray = data.docInfoArray;
                    documents.priorityIndexValue = data.priorityIndexValue;
                    let folders = data.folders;
                    folders.forEach((folder, i) => {
                        this.setupDoc(folder, documents, filterOptions);
                        //documents.loader = false;
                    });
                    documents.loader = false;
                    resolve(documents);
                });
        });
        return promise;
    }

    getDocFile(folder) {
        let promise = new Promise((resolve, reject) => {
            let filterOptions = [];
            let documents = {
                loader: true,
                folders: [],
                files: [],
                mfg: [],
                mfgInfo: [],
                otherTechInfo: [],
                folderInfo: [],
                makeInfo: [],
                docInfoArray: [],
                priorityIndexValue: '',
                total: 0
            };
            this.setupDoc(folder, documents, filterOptions);
            setTimeout(() => {
                resolve(documents);    
            }, 500);
            
        });
        return promise;
    }

    setupDoc(folder, documents, filterOptions, action='doc') {
        console.log(folder)
        let docDetail = folder.documentDetail;
        let folderInfo = documents.folderInfo;
        if (docDetail.resourceID != null) {
            let file: any = {};
            let docLogo = docDetail.logo;
            let selected = false;
            file.docType = docDetail.docType;
            file.selected = selected;
            file.title = docDetail.title;
            file.logo = (docLogo == undefined || docLogo == 'undefined') ? '' : docLogo;
            let folderOptions = docDetail.foldersOptions;
            let assignedFolderId = (folderInfo.length > 0) ? parseInt(folderInfo[0].id) : 0;
            file.assignedFolderId = assignedFolderId;
            file.folderId = (folderOptions.length > 0) ? parseInt(folderOptions[0].id) : 0;
            file.resourceID = docDetail.resourceID;
            let makeModelValue = docDetail.makeModelsNew;
            let isGeneral = (docDetail.isGeneral == 1) ? true : false;
            file.isGeneral = isGeneral;
            
            let makeModelVal = docDetail.makeModelsWeb[0];
            docDetail.modelList = (makeModelVal.model.length > 0) ? makeModelVal.model : []; 
            
            if(isGeneral) {
                file.makeTooltip = '';
                file.manufacturer = '';
                file.mfg = '';
                file.make = docDetail.make;
                file.model = '';
                file.year = '';
                file.makeTooltip = file.make;
            } else {
                file.manufacturer = '';
                file.mfg = '';
                file.model = '';
                file.year = '';
                file.makeTooltip = "";
                if (makeModelValue && makeModelValue.length == 0) {
                    file.make = 'All Makes';
                    file.model = 'All Models';
                    file.year = '';
                } else if (makeModelValue && makeModelValue.length > 0) {
                    if(makeModelValue[0].hasOwnProperty('manufacturer')) {
                        if (makeModelValue[0].manufacturer && makeModelValue[0].manufacturer != "") {
                            file.manufacturer = makeModelValue[0].manufacturer.replace(/\s?$/,'');
                            file.mfg = file.manufacturer;
                            file.makeTooltip = file.manufacturer;
                            if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                                file.make = makeModelValue[0].genericProductName;
                                file.makeTooltip = `${file.makeTooltip} > ${file.make}`;
                                if(makeModelValue[0].model.length > 0) {
                                    file.model = ` ${makeModelValue[0].model}`;
                                    file.makeTooltip = `${file.makeTooltip} > ${file.model}`;
                                    if (makeModelValue[0].year) {
                                        file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                                        file.mfg = '';
                                    }
                                }
                            } 
                        } else {
                            if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                                file.make = makeModelValue[0].genericProductName;
                            }
                            if (makeModelValue[0].model.length > 0) {
                                file.model = makeModelValue[0].model;
                            }
                            if (makeModelValue[0].year) {
                                file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                            }
                        }
                    } else {
                        if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "")
                            file.make = makeModelValue[0].genericProductName;
                        else
                            file.make = 'All Makes';
                        if (makeModelValue[0].model.length > 0) {
                            file.model = makeModelValue[0].model;
                        } else {
                            file.model = '';
                        }
                        if (makeModelValue[0].year) {
                            file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                        } else {
                            file.year = '';
                        }
                    }                                                                        
                }
                
                if(!makeModelValue[0].hasOwnProperty('manufacturer')) {
                    let tooltip = '';
                    if(file.make != '')
                        tooltip = file.make;

                    if(file.model != '')
                        tooltip = `${tooltip} > ${file.model}`;

                    if(file.year != '')
                        tooltip = `${tooltip} > ${file.year}`;
                    
                    file.makeTooltip = tooltip;
                }
            }

            let createdDate = moment.utc(docDetail.createdOnMobile).toDate(); 
            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
            docDetail.createdOnMobile = localCreatedDate;
            let updatedDate = moment.utc(docDetail.updatedOnMobile).toDate(); 
            let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
            docDetail.updatedOnMobile = localUpdatedDate;
            let submitedByDate = moment.utc(docDetail.submitedDate).toDate(); 
            let localsubmitedByDate = moment(submitedByDate).local().format('MMM DD, YYYY h:mm A');
            docDetail.submitedByDate = localsubmitedByDate;
            docDetail.expand = filterOptions.expand;
            file.docData = docDetail;
            file.createdOnMobile = localCreatedDate;
            file.updatedOnMobile = localUpdatedDate;
            file.submitedByDate = localsubmitedByDate;
            file.viewCount = docDetail.viewCount;
            file.isDraft = docDetail.isDraft;
            file.docWS = docDetail.WorkstreamsList;
            file.docFolders = docDetail.foldersOptions;
            file.submitedBy = docDetail.submitedBy != undefined ? docDetail.submitedBy : '';
            file.submitedByUserName = docDetail.submitedByUserName != undefined ? docDetail.submitedByUserName : '';
            file.submitedByAvailability = docDetail.submitedByAvailability != undefined ? docDetail.submitedByAvailability : '';
            file.submitedByProfileImage = docDetail.submitedByProfileImage != undefined ? docDetail.submitedByProfileImage : '';
            file.documentStatusId = docDetail.documentStatusId != undefined ? docDetail.documentStatusId : '';
            file.documentStatus = docDetail.documentStatus != undefined ? docDetail.documentStatus : '';
            file.documentStatusBgColor = docDetail.documentStatusBgColor != undefined ? docDetail.documentStatusBgColor : '';
            file.documentStatusColorValue = docDetail.documentStatusColorValue != undefined ? docDetail.documentStatusColorValue : '';
            file.likeCount = docDetail.likeCount;
            if (docDetail.likeStatus == 1) file.likeStatus = true;
            else file.likeStatus = false;
            file.shareCount = docDetail.shareCount;
            file.pinCount = docDetail.pinCount;
            if (docDetail.pinStatus == 1) file.pinStatus = true;
            else file.pinStatus = false;
            
            file.styleName = (file.logo == '') ? 'empty' : '';
            file.flagId = 0;
            file.class = 'doc-thumb';
            file.attachments = [];
            let attachments = docDetail.uploadContents;
            if(attachments.length > 0) {
                file.attachments = attachments;
                let attachment = attachments[0];
                file.flagId = attachment.flagId;
                if (attachment.flagId == 1)
                    file.contentPath = attachment.thumbFilePath;
                else if (attachment.flagId == 2)
                    file.contentPath = attachment.posterImage;
                else if (attachment.flagId == 3)
                    file.styleName = 'mp3';
                else if (attachment.flagId == 4 || attachment.flagId == 5) {
                    let fileType = attachment.fileExtension.toLowerCase();
                    switch (fileType) {
                        case 'pdf':
                            file.styleName = 'pdf';
                            break;
                        case 'application/octet-stream':
                        case 'xlsx':
                        case 'xls':    
                            file.styleName = 'xls';
                            break;
                        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                        case 'application/msword':
                        case 'docx':
                        case 'doc':
                        case 'msword':  
                            file.styleName = 'doc';
                            break;
                        case 'application/vnd.ms-powerpoint':  
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        case 'pptx':
                        case 'ppt':
                            file.styleName = 'ppt';
                            break;
                        case 'zip':
                            file.styleName = 'zip';
                            break;
                        case 'exe':
                            file.styleName = 'exe';
                            break;
                        case 'txt':
                            file.styleName = 'txt';
                            break;  
                        default:
                            file.styleName = 'unknown-thumb';
                            break;
                        }
                }
                else if (attachment.flagId == 6) { // link, youtube
                    file.class = 'link-thumb';
                    let banner = '';
                    let prefix = 'http://';
                    let logoImg = attachment.thumbFilePath;
                    file.styleName = (logoImg == "") ? 'link-default' : '';
                    let logo = (logoImg == "") ? 'assets/images/media/link-medium.png' : logoImg;
                    let url = attachment.filePath;
                    //console.log(url)
                    if(url.indexOf("http://") != 0) {
                        if(url.indexOf("https://") != 0) {
                        url = prefix + url;
                        } 
                    }
                    let youtube = this.commonApi.matchYoutubeUrl(url);
                    //console.log(url, youtube)
                    if(youtube) {
                        //console.log(youtube)
                        banner = '//img.youtube.com/vi/'+youtube+'/0.jpg';
                    } else {
                        let vimeo = this.commonApi.matchVimeoUrl(url);
                        if(vimeo) {
                        this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
                            let res = response[0];
                            banner = res['thumbnail_medium'];
                        });
                        } else {
                            banner = logo;
                        }
                    }
                    file.contentPath = banner;
                }
                else if (attachment.flagId == 8) {
                    file.styleName = 'html';
                }
            }
            file.contentPath = (file.logo == '') ? file.contentPath : file.logo;
            //console.log(file.resourceID, file.logo)
            documents.files.push(file);
            documents.mfg.push(file);
        }

        if (folder.folderDetail.id) {
            //console.log(folder.folderDetail.workstreamsList);
            let ws = (folder.folderDetail.workstreamsList == null) ? '' : folder.folderDetail.workstreamsList;
            let createdDate = moment.utc(folder.folderDetail.createdOn).toDate();
            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
            let updatedDate = folder.folderDetail.updatedOn != "" ? moment.utc(folder.folderDetail.updatedOn).toDate() : "";
            let localUpdatedDate = updatedDate != "" ? moment(updatedDate).local().format('MMM DD, YYYY h:mm A') : "";
            let logo = (folder.folderDetail.logo == null) ? 'assets/images/documents/sys-folder-thumb.png' : folder.folderDetail.logo;
            let isDef:any = (folder.folderDetail.logo == null) ? true : false;
            let manufacturer = (folder.folderDetail.manufacturer == undefined || folder.folderDetail.manufacturer == 'undefined') ? '' : folder.folderDetail.manufacturer;
            let folderObj: DocumentListData = {
                isSystemFolder: folder.folderDetail.isSystemFolder,
                folderName: folder.folderDetail.folderName,
                manufacturer: manufacturer,
                subFolderCount: folder.folderDetail.subFolderCount,
                fileCount: folder.folderDetail.fileCount,
                isMfg: folder.isMfg,
                isMake: folder.folderDetail.isMake,
                viewCount: folder.folderDetail.viewCount,
                logo: logo,
                isDef: isDef,
                docType: folder.folderDetail.docType,
                id: folder.folderDetail.id,
                createdOn: localCreatedDate,
                updatedOn: localUpdatedDate,
                userName: folder.folderDetail.userName,
                workstreamsList: ws
            }
            documents.folders.push(folderObj);                           
            documents.mfg.push(folderObj);
        }
    }


    getALLDocumentFromSolr(filterOptions: any) {

        let platformId = localStorage.getItem("platformId");
        let GetfoldersandDocument = "GetfoldersandDocuments";
        if (platformId == PlatFormType.Collabtic || PlatFormType.CbaForum) {
            GetfoldersandDocument = "GetfoldersandDocumentsv1";
        }
        else{
            GetfoldersandDocument = "GetfoldersandDocuments";
        }
        
        console.log(filterOptions.expand)
        let promise = new Promise((resolve, reject) => {
            let documents = {
                loader: true,
                filterData: [],
                facets: [],
                folders: [],
                files: [],
                mfg: [],
                otherTechInfo: [],
                mfgInfo: [],
                folderInfo: [],
                makeInfo: [],
                docInfoArray: [],
                priorityIndexValue: '',
                total: 0
            };
             this.LandingpagewidgetsAPI.getSolrDataDetail(
                filterOptions
              ).subscribe((data) => {
                    let facets: any = data.facets;
                    let type = facets.type;
                    documents.facets = type;
                    documents.filterData = facets;
                    documents.total = data.total;
                    documents.mfgInfo = data.mfgInfo != undefined ? data.mfgInfo : [];
                    documents.otherTechInfo = data.otherTechInfo != undefined ? data.otherTechInfo : [];
                    documents.folderInfo = data.folderInfo;
                    documents.makeInfo = data.makeInfo;
                    documents.docInfoArray = data.docInfoArray;
                    documents.priorityIndexValue = data.priorityIndexValue;
                    let folders = data.documentData;
                    console.log(folders);
                    folders.forEach((folder, i) => {
                        let docDetail = folder;
                        if (docDetail.resourceID != null) {
                            let file: any = {};
                            let selected = false;
                            let docLogo = docDetail.logo;
                            file.docType = docDetail.docType;
                            file.selected = selected;
                            file.title = docDetail.title;
                            file.logo = (docLogo == undefined || docLogo == 'undefined') ? '' : docLogo;
                            //let folderOptions = docDetail.foldersOptions;
                           // file.folderId = (folderOptions.length > 0) ? parseInt(folderOptions[0].id) : 0;
                            file.resourceID = docDetail.resourceID;
                            let makeModelValue = docDetail.makeModelsNew;
                            let isGeneral = (docDetail.isGeneral == 1) ? true : false;
                            file.isGeneral = isGeneral;
                          
                            let makeModelVal = docDetail.makeModelsWeb;
                            docDetail.modelList = (makeModelVal.model.length > 0) ? makeModelVal.model : []; 
                         
                            if(isGeneral) {
                                file.makeTooltip = '';
                                file.manufacturer = '';
                                file.mfg = '';
                                file.make = docDetail.make;
                                file.model = '';
                                file.year = '';
                                file.makeTooltip = file.make;
                            } else {
                                file.manufacturer = '';
                                file.mfg = '';
                                file.model = '';
                                file.year = '';
                                file.makeTooltip = "";
                                if (makeModelValue && makeModelValue.length == 0) {
                                    file.make = 'All Makes';
                                    file.model = 'All Models';
                                    file.year = '';
                                } else if (makeModelValue) {
                                    if(makeModelValue[0].hasOwnProperty('manufacturer')) {
                                        //alert(3)
                                        if (makeModelValue[0].manufacturer && makeModelValue[0].manufacturer != "") {
                                            //alert(4)
                                            file.manufacturer = makeModelValue[0].manufacturer.replace(/\s?$/,'');
                                            file.mfg = file.manufacturer;
                                            file.makeTooltip = file.manufacturer;
                                            if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                                                //alert(5)
                                                file.make = makeModelValue[0].genericProductName;
                                                file.makeTooltip = `${file.makeTooltip} > ${file.make}`;
                                                if(makeModelValue[0].model.length > 0) {
                                                    //alert(6)
                                                    file.model = ` ${makeModelValue[0].model}`;
                                                    file.makeTooltip = `${file.makeTooltip} > ${file.model}`;
                                                    if (makeModelValue[0].year) {
                                                        //alert(7)
                                                        //file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue.year[0];
                                                        file.mfg = '';
                                                    }
                                                }
                                            } 
                                        } else {
                                            if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                                                file.make = makeModelValue[0].genericProductName;
                                            }
                                            if (makeModelValue[0].model.length > 0) {
                                                file.model = makeModelValue[0].model;
                                            }
                                            if (makeModelValue.year) {
                                                file.year = (makeModelValue.year[0] == 0) ? '' : makeModelValue.year[0];
                                            }
                                        }
                                    } else {
                                        if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "")
                                            file.make = makeModelValue[0].genericProductName;
                                        else
                                            file.make = 'All Makes';
                                        if (makeModelValue[0].model.length > 0) {
                                            file.model = makeModelValue[0].model;
                                        } else {
                                            file.model = '';
                                        }
                                        if (makeModelValue[0].year) {
                                            file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                                        } else {
                                            file.year = '';
                                        }
                                    }                                                                        
                                }
                                
                                if(!makeModelValue[0].hasOwnProperty('manufacturer')) {
                                    let tooltip = '';
                                    if(file.make != '')
                                        tooltip = file.make;

                                    if(file.model != '')
                                        tooltip = `${tooltip} > ${file.model}`;

                                    if(file.year != '')
                                        tooltip = `${tooltip} > ${file.year}`;
                                    
                                    file.makeTooltip = tooltip;
                                }
                            }

                            let createdDate = moment.utc(docDetail.createdOnMobile).toDate(); 
                            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.createdOnMobile = localCreatedDate;
                            let updatedDate = moment.utc(docDetail.updatedOnMobile).toDate(); 
                            let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.updatedOnMobile = localUpdatedDate;
                            docDetail.expand = filterOptions.expand;
                            file.docData = docDetail;
                            file.createdOnMobile = localCreatedDate;
                            file.updatedOnMobile = localUpdatedDate;
                            file.viewCount = docDetail.viewCount;
                            file.isDraft = docDetail.isDraft;

                            let submitedByDate = moment.utc(docDetail.submitedDate).toDate(); 
                            let localsubmitedByDate = moment(submitedByDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.submitedByDate = localsubmitedByDate;
                            docDetail.expand = filterOptions.expand;
                            file.docData = docDetail;
                            file.createdOnMobile = localCreatedDate;
                            file.updatedOnMobile = localUpdatedDate;
                            file.submitedByDate = localsubmitedByDate;
                            file.viewCount = docDetail.viewCount;
                            file.isDraft = docDetail.isDraft;
                            file.docWS = docDetail.WorkstreamsList;
                            file.docFolders = docDetail.foldersOptions != undefined ? docDetail.foldersOptions : '';
                            file.submitedBy = docDetail.submitedBy != undefined ? docDetail.submitedBy : '';
                            file.submitedByUserName = docDetail.submitedByUserName != undefined ? docDetail.submitedByUserName : '';
                            file.submitedByAvailability = docDetail.submitedByAvailability != undefined ? docDetail.submitedByAvailability : '';
                            file.submitedByProfileImage = docDetail.submitedByProfileImage != undefined ? docDetail.submitedByProfileImage : '';
                            let documentStatusId = docDetail.documentStatusId != undefined ? docDetail.documentStatusId : '';
                            file.documentStatusId = Array.isArray(documentStatusId) ? documentStatusId[0] : documentStatusId;
                            let documentStatus = docDetail.documentStatus != undefined ? docDetail.documentStatus : '';
                            file.documentStatus = Array.isArray(documentStatus) ? documentStatus[0] : documentStatus;
                            let documentStatusBgColor = docDetail.documentStatusBgColor != undefined ? docDetail.documentStatusBgColor : '';
                            file.documentStatusBgColor = Array.isArray(documentStatusBgColor) ? documentStatusBgColor[0] : documentStatusBgColor;
                            let documentStatusColorValue = docDetail.documentStatusColorValue != undefined ? docDetail.documentStatusColorValue : '';
                            file.documentStatusColorValue = Array.isArray(documentStatusColorValue) ? documentStatusColorValue[0] : documentStatusColorValue;
                            

                            file.likeCount = docDetail.likeCount;
                            if (docDetail.likeStatus == 1) file.likeStatus = true;
                            else file.likeStatus = false;
                            file.shareCount = docDetail.shareCount;
                            file.pinCount = docDetail.pinCount;
                            if (docDetail.pinStatus == 1) file.pinStatus = true;
                            else file.pinStatus = false;
                            
                            file.styleName = 'empty';
                            file.flagId = 0;
                            file.class = 'doc-thumb';
                            file.attachments = [];
                            let attachments = docDetail.uploadContents;
                            if(attachments && attachments.length > 0) {
                                file.attachments = attachments;
                                let attachment = attachments[0];
                                file.flagId = attachment.flagId;
                                if (attachment.flagId == 1)
                                    file.contentPath = attachment.thumbFilePath;
                                else if (attachment.flagId == 2)
                                    file.contentPath = attachment.posterImage;
                                else if (attachment.flagId == 3)
                                    file.styleName = 'mp3';
                                else if (attachment.flagId == 4 || attachment.flagId == 5) {
                                    let fileType = attachment.fileExtension.toLowerCase();
                                    switch (fileType) {
                                        case 'pdf':
                                            file.styleName = 'pdf';
                                            break;
                                        case 'application/octet-stream':
                                        case 'xlsx':
                                        case 'xls':    
                                            file.styleName = 'xls';
                                            break;
                                        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                                        case 'application/msword':
                                        case 'docx':
                                        case 'doc':
                                        case 'msword':  
                                            file.styleName = 'doc';
                                            break;
                                        case 'application/vnd.ms-powerpoint':  
                                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                                        case 'pptx':
                                        case 'ppt':
                                            file.styleName = 'ppt';
                                            break;
                                        case 'zip':
                                            file.styleName = 'zip';
                                            break;
										case 'exe':
                                            file.styleName = 'exe';
                                            break;
                                        case 'txt':
                                            file.styleName = 'txt';
                                            break;  
                                        default:
                                            file.styleName = 'unknown-thumb';
                                            break;
                                        }
                                }
                                else if (attachment.flagId == 6) { // link, youtube
                                    file.class = 'link-thumb';
                                    let banner = '';
                                    let prefix = 'http://';
                                    let logoImg = attachment.thumbFilePath;
                                    file.styleName = (logoImg == "") ? 'link-default' : '';
                                    let logo = (logoImg == "") ? 'assets/images/media/link-medium.png' : logoImg;
                                    let url = attachment.filePath;
                                    //console.log(url)
                                    if(url.indexOf("http://") != 0) {
                                        if(url.indexOf("https://") != 0) {
                                        url = prefix + url;
                                        } 
                                    }
                                    let youtube = this.commonApi.matchYoutubeUrl(url);
                                    //console.log(url, youtube)
                                    if(youtube) {
                                        //console.log(youtube)
                                        banner = '//img.youtube.com/vi/'+youtube+'/0.jpg';
                                    } else {
                                        let vimeo = this.commonApi.matchVimeoUrl(url);
                                        if(vimeo) {
                                        this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
                                            let res = response[0];
                                            banner = res['thumbnail_medium'];
                                        });
                                        } else {
                                            banner = logo;
                                        }
                                    }
                                    file.contentPath = banner;
                                }
                                else if (attachment.flagId == 8) {
                                    file.styleName = 'html';
                                }
                            }
                            file.contentPath = (file.logo == '') ? file.contentPath : file.logo;
                            console.log(file)
                            documents.files.push(file);
                            documents.mfg.push(file);
                        }

                       
                        //documents.loader = false;
                    });
                    documents.loader = false;
                    resolve(documents);
                });
        });
        return promise;
    }

    addLikePins(userId, domainId, countryId, fileId, type, status) {
        return new Promise((resolve, reject) => {
            let isSuccess = false;
            const apiFormData = new FormData();
            apiFormData.append('apiKey', this.appService.appData.apiKey);
            apiFormData.append('userId', userId);
            apiFormData.append('domainId', domainId);
            apiFormData.append('countryId', countryId);
            apiFormData.append('dataId', fileId);
            apiFormData.append('type', type);
            apiFormData.append('status', status);
            this.baseService.postFormData("resources", "AddLikePins", apiFormData).subscribe((response: any) => {
                if (response.status == "Success") {
                    isSuccess = true;
                }
                resolve(isSuccess);
            });
        });
    }

    // Get Document Detail
    getDocumentDetail(docData: any) {
        let promise = new Promise((resolve, reject) => {
        
        this.baseService.get("resources", "GetDocumentDetails", docData)
            .subscribe((data: any) => {
                let docDetail = data.documentDetail[0];
                resolve(docDetail);
            });
        });
        return promise;
    }

    // get KAIZEN Detail

    getALLKaizenList(filterOptions: any) {
        let promise = new Promise((resolve, reject) => {
            let documents = {
                loader: true,              
                files: [],
                total: 0
            };
            this.baseService.postFormData("kaizen", "list" , filterOptions)
                .subscribe((data: any) => {
                    documents.total = data.total;                  
                    let items = data.items;
                    items.forEach((folder, i) => {
                        let docDetail = folder;
                        if (docDetail.id != null) {
                            let file: any = {};
                            let docLogo = docDetail.logo;
                            let selected = false;
                            file.docType = docDetail.docType;
                            file.selected = selected;
                            file.title = docDetail.title;
                            file.logo = '' ;                            
                            file.folderId = 0;
                            file.resourceID = docDetail.id;                         
                            file.id = docDetail.id;  
                            let createdDate = moment.utc(docDetail.createdOn).toDate(); 
                            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.createdOn = localCreatedDate;
                            let localUpdatedDate = "-";
                            if(docDetail.updatedOn != ''){
                                let updatedDate = moment.utc(docDetail.updatedOn).toDate(); 
                                localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
                                docDetail.updatedOn = localUpdatedDate; 
                            }
                            else{
                                localUpdatedDate = "-";
                            }                           
                            docDetail.submitedDate = docDetail.submitedDate == '' || docDetail.submitedDate == null ? docDetail.createdOn : docDetail.submitedDate;
                            let submitedByDate = moment.utc(docDetail.submitedDate).toDate(); 
                            let localsubmitedByDate = moment(submitedByDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.submitedByDate = localsubmitedByDate;
                            docDetail.expand = filterOptions.expand;
                            file.docData = docDetail;
                            file.createdOn = localCreatedDate;
                            file.updatedOn = localUpdatedDate;
                            file.submitedByDate = localsubmitedByDate;
                            file.viewCount = docDetail.viewCount;
                            file.isDraft = docDetail.isDraft;
                            file.docWS = docDetail.WorkstreamsList;
                            file.docFolders = docDetail.foldersOptions;
                            file.model = docDetail.modelName != undefined ? docDetail.modelName : '';
                            file.createdBy = docDetail.createdBy != undefined ? docDetail.createdBy : '';
                            file.createdById = docDetail.createdById != undefined ? docDetail.createdById : '';                            
                            file.submitedBy = docDetail.submitedBy != undefined ? docDetail.submitedBy : '';
                            file.submitedByUserName = docDetail.submitedByUserName != undefined ? docDetail.submitedByUserName : '';
                            file.submitedByAvailability = docDetail.submitedByAvailability != undefined ? docDetail.submitedByAvailability : '';
                            file.submitedByProfileImage = docDetail.submitedByProfileImage != undefined ? docDetail.submitedByProfileImage : '';
                            file.documentStatusId = docDetail.kaizenStatusId != undefined ? docDetail.kaizenStatusId : '';
                            file.documentStatus = docDetail.kaizenStatus != undefined ? docDetail.kaizenStatus : '';
                            file.documentStatusBgColor = docDetail.kaizenStatusBgColor != undefined ? docDetail.kaizenStatusBgColor : '';
                            file.documentStatusColorValue = docDetail.kaizenStatusColorValue != undefined ? docDetail.kaizenStatusColorValue : '';                            
                            file.moreOption = docDetail.moreOption;
                            file.escalationLevel = docDetail.escalationLevel;
                            documents.files.push(file);
                            
                        }
                       
                    });
                    documents.loader = false;
                    resolve(documents);
                });
        });
        return promise;
    }

    public isUserNearBottom(event: any): boolean {
        //const threshold = 80;
        const threshold = 450;
        const position = event.target.scrollTop + event.target.offsetHeight;
        const height = event.target.scrollHeight;
        return position > height - threshold;
    }

    public isUserNearBottomVal(event: any): boolean {
        const threshold = 80;
        const position:any = event.target.scrollTop + event.target.offsetHeight - threshold;
        return position;
    }
    
}


export interface DocumentListData {
    id: string;
    isSystemFolder: boolean;
    isMfg: boolean;
    isMake: boolean;
    viewCount: number;
    logo: string;
    isDef: boolean,
    docType: string;
    folderName: string;
    manufacturer: string;
    subFolderCount: number;
    fileCount: number;
    createdOn: string;
    updatedOn: string;
    userName: string;
    workstreamsList: object;
}