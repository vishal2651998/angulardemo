import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Constant, DefaultNewImages, ManageTitle, windowHeight } from 'src/app/common/constant/constant';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { MatMenuTrigger } from '@angular/material';
import * as moment from 'moment';
import * as ClassicEditor from "src/build/ckeditor";

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  @Input() apiInfo: any = [];
  @Output() faqComponentRef: EventEmitter<FaqListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<FaqListComponent> = new EventEmitter();
  @ViewChild(MatMenuTrigger, { static: false }) matMenuTrigger: MatMenuTrigger;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  public fconfig: PerfectScrollbarConfigInterface = {};
  public iconfig: PerfectScrollbarConfigInterface = {};
  public bodyHeight: number;
  public innerHeight: number;
  public manageTitle:any = ManageTitle.faq;
  public apikey: string = Constant.ApiKey;
  public domainId: string = "";
  public userId: string = "";
  public roleId: any = "";
  public existError:string = "";
  public emptyBanner = DefaultNewImages.Faq;
  public emptyCont: string = 'Get started by tapping on "New FAQ".';
  public itemOffset: any = 0;
  public itemLimit: any = 20;
  public itemTotal: number = 0;
  public faqItems: any = [];
  public displayModal = false;
  public formValid: boolean = false;
  public faqFormFlag: boolean = false;
  public faqFormSubmit: boolean = false;
  public faqExist:boolean = true;
  public itemEmpty: boolean = false;
  public submitFlag: boolean = false;
  public checkFlag: boolean = false;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollCallback: boolean = true;
  public editAccess: boolean = false;
  public deleteAccess: boolean = false;

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;

  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public successModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public Editor = ClassicEditor;
  configCke: any = {
    toolbar: {
      items: [
        "bold",
         "Emoji",
         "italic",
         "link",
        "strikethrough",
         "|",
         "fontSize",
         "fontFamily",
         "fontColor",
         "fontBackgroundColor",
         "|",
         "bulletedList",
         "numberedList",
         "todoList",
         "|",
         "uploadImage",
         "pageBreak",
         "blockQuote",
         "insertTable",
         "mediaEmbed",
         "undo",
         "redo",
        
       ],
    },
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
  
  faqForm: FormGroup;
  
  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = true;
    config.keyboard = true;
    config.size = 'dialog-top';
  }

  // convenience getters for easy access to form fields
  get f() { return this.faqForm.controls; }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.bodyHeight = window.innerHeight;
    this.domainId = this.apiInfo.domainId;
    this.userId = this.apiInfo.userId;
    this.roleId = this.apiInfo.roleId;
    this.editAccess = (this.roleId == 3) ? true : false;
    this.deleteAccess = (this.roleId == 3) ? true : false;
    this.setScreenHeight();
    this.faqComponentRef.emit(this);
    this.getFaqList();
    let data = {
      action: 'new',
      faqId: 0,
      faqTitle: null,
      faqDesc: null
    }
    this.createForm(data);
  }

  getFaqList() {
    let apiData = {
      apikey: this.apikey,
      domainId: this.domainId,
      userId: this.userId,
      offset: this.itemOffset,
      limit: this.itemLimit
    }

    this.commonApi.getFaqList(apiData).subscribe((response) => {
      console.log(response)
      let responseData = response.data;
      this.itemTotal = parseInt(responseData.total);
      this.itemEmpty = (responseData.total == 0) ? true : false;
      let listItemHeight;
      let reportRow = document.getElementsByClassName("faq-row");
      let faqItems = responseData.items;
      faqItems.forEach(item => {
        this.faqItems.push(item);
      });
      if(!this.itemEmpty) {
        setTimeout(() => {
          listItemHeight = (reportRow[0]) ? reportRow[0].clientHeight + 50 : 0;
          this.itemOffset = this.itemOffset+this.itemLimit;
          this.scrollCallback = true;
          this.scrollInit = 1;
          console.log(faqItems.length, this.faqItems.length, this.itemTotal, this.innerHeight, listItemHeight)
          if (faqItems.length > 0 && this.faqItems.length != this.itemTotal && this.innerHeight >= listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.getFaqList();
            this.lastScrollTop = this.scrollTop;
          }
        }, 250);
      }
      setTimeout(() => {
        this.loading = false;
        this.lazyLoading = false;
        setTimeout(() => {
          this.faqItems.forEach((item, i) => {
            //this.setupContHeight(item, i);
          });  
        }, 10);
      }, 250);
    });
  }

  addFaq(item:any = '') {
    console.log(item)
    let action = (item == '') ? 'new' : 'edit';
    let data = {
      action,
      faqId: (item == '') ? 0 : item.faqId, 
      faqTitle: (item == '') ? '' : item.faqTitle,
      faqDesc: (item == '') ? '' : item.faqDesc
    }
    this.createForm(data);
    let actionTxt:any = (item == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
    this.manageTitle = `${actionTxt} ${ManageTitle.faq}`;
    this.formValid = false;
    this.displayModal = true;
    this.faqFormFlag = true;
  }

  createForm(data: any = []) {
    this.resetForm();
    this.faqForm = this.formBuilder.group({
      action: [data.action],
      faqId: [data.faqId],
      faqTitle: [data.faqTitle, [Validators.required]],
      faqDesc: [data.faqDesc, [Validators.required]]
    });
  }

  // On Change
  changeItem(field, val, access = '') {
    console.log(field, val)
    switch(field) {
      case 'faqTitle':
        break;
    }
  }

  // Edit FAQ
  actionEdit(item, id) {
    let data = {
      action: 'edit',
      faqId: id,
      faqTitle: item.faqTitle,
      faqDesc: item.faqDesc
    }
    this.addFaq(data);
  }

  // Delete FAQ
  actionDelete(item, index) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        this.faqItems.splice(index, 1);
        this.itemTotal = this.itemTotal-1;
        this.itemEmpty = (this.itemTotal == 0) ? !this.itemEmpty : this.itemEmpty;
        setTimeout(() => {
          if(this.itemTotal > 0) {
            this.directiveRef.update();
          }
          this.callback.emit(this);
          let data = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: 'delete',
            faqId: item.id
          }
          this.commonApi.manageFaq(data).subscribe((response) => {
            console.log(response)
          })
        }, 100);
      }
    });
  }

  // Submit form
  saveData() {
    this.submitFlag = true;
    this.faqExist = false;
    if(this.formValid) {
      return;
    }
    this.faqFormSubmit = true;
    for (const i in this.faqForm.controls) {
      this.faqForm.controls[i].markAsDirty();
      this.faqForm.controls[i].updateValueAndValidity();
      console.log(i, this.faqForm.controls[i], this.faqForm.controls[i].value)
    }
    console.log(this.faqForm, this.faqExist);
    const faqFormObj = this.faqForm.value;
    if (this.faqForm.valid && !this.faqExist) {
      let action = faqFormObj.action;
      let faqId:any = faqFormObj.faqId;
      this.formValid = true;
      let apiData = {
        apikey: this.apikey,
        domainId: this.domainId,
        userId: this.userId,
        action,
        faqId,
        faqTitle: faqFormObj.faqTitle,
        faqDesc: faqFormObj.faqDesc
      }
      console.log(apiData)
      this.commonApi.manageFaq(apiData).subscribe((response) => {
        let data = response.data;
        switch (action) {
          case 'new':
            this.faqItems.push(data);
            this.itemEmpty = (this.itemEmpty) ? !this.itemEmpty : this.itemEmpty;
            let itemIndex = this.itemTotal;
            this.itemTotal = this.itemTotal+1;
            setTimeout(() => {
              //this.setupContHeight(data, itemIndex);  
            }, 500);            
            break;        
          default:
            let fi = this.faqItems.findIndex(option => option.id == faqId);
            if(fi >= 0) {
              this.faqItems[fi] = data;
              setTimeout(() => {
                //this.setupContHeight(data, fi);
              }, 500);              
            }
            break;
        }
        setTimeout(() => {
          this.submitFlag = false;
          this.faqFormSubmit = false;
          this.faqFormFlag = false;
          this.displayModal = false;
        }, 50);
      });
    }
  }

  setupContHeight(item, index) {
    let itemHeight = 0;
    let chkElm = `desc-cont-${index}`;
    let cheight = document.getElementsByClassName(chkElm)[0].clientHeight+20;
    itemHeight += cheight;
    item.contHeight = (itemHeight >= 250) ? 250 : item.contHeight;
  }

  // Close Dialog
  resetForm() {
    console.log('in reset')
    if(this.faqFormSubmit) {
      this.faqForm.reset();
      this.faqFormSubmit = false;
    }   
    
  }

  // Accordion Open
  onTabOpen() {
    setTimeout(() => {
      this.directiveRef.update();
    }, 100);
  }

  // Accordion Close
  onTabClose() {
    setTimeout(() => {
      this.directiveRef.update();
    }, 100);
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = 0;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = 0;
      titleHeight = titleHeight - 25;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);
    }
  }

  // Onscroll
  scroll = (event: any): void => {
    if(this.lazyLoading) {
      event.preventDefault();
    }
    if(event.target.id=='faqList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let itemLength = this.faqItems.length;
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 50;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getFaqList();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  };

}
