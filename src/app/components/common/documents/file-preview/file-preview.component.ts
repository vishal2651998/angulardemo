import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { CommonService } from '../../../../services/common/common.service';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent implements OnInit {

  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyElem;
  public title:string = '';
  public loading:boolean = true;
  public threadViewErrorMsg : string = '';
  public threadViewError:boolean = false;
  public headerData:any;
  public docId;
  public filename;
  public pageAccess: string = "docpreview";
  public headerText: string = '';
  public innerHeight: number;
  public bodyHeight: number;

  downloadUrl: string = "";
  urlSafe: SafeResourceUrl;

   // Resize Widow
   @HostListener('window:resize', ['$event'])
   onResize(event) {
     this.bodyHeight = window.innerHeight;
     this.setScreenHeight();    
   }
   
  constructor(private titleService: Title,public sanitizer: DomSanitizer,private commonApi: CommonService) { }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.add(this.bodyClass); 
    this.bodyElem.classList.add(this.bodyClass1);
    setTimeout(() => {
      this.loadDocument();
    }, 100);   

  }
  loadDocument(){
    let previewId = localStorage.getItem('previewId');
    let previewTitle = localStorage.getItem('previewTitle');
    this.downloadUrl = localStorage.getItem('previewURL');

    this.headerText = '<label class="thread-text">'+previewTitle+',&nbsp;Document<span class="detail-page-header-id">&nbsp;ID# '+previewId+'</span></label>';
    this.title = "Document ID#-"+previewId;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
    this.headerData = {
      'access': this.pageAccess,
      'profile': false,
      'welcomeProfile': false,
      'search': false,
      'title': this.headerText,
      'titleFlag': true 
    };
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.downloadUrl);
    this.loading = false;
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 103 ); 
    this.setScreenHeight(); 
  }

  // Set Screen Height
  setScreenHeight() { 
    setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;  
      let headerHeight1 = headerHeight + 103;
      this.innerHeight = (this.bodyHeight - headerHeight1 );       
    }, 1000);          
  }

  ngOnDestroy() {
    localStorage.removeItem('previewId');
    localStorage.removeItem('previewTitle');
    localStorage.removeItem('previewURL');
  }
}

