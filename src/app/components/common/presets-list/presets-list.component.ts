import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { CommonService } from '../../../services/common/common.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-presets-list',
  templateUrl: './presets-list.component.html',
  styleUrls: ['./presets-list.component.scss'],
  providers: [MessageService]
})
export class PresetsListComponent implements OnInit, OnDestroy {
  @ViewChild('top',{static: false}) top: ElementRef;
  activeState: boolean[] = [true, false, false];
  @Output() presetActionEmit: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public domainId;
  public userId;
  public countryId;
  public emptyFlag: boolean = false;
  public loading: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;
  public industryType: any = "";
  public contentType: number = 47;
  public displayOrder: number = 0;
  public pageAccess: string = 'presets';
  public user: any;
  public presetsData = [];
  public presetsListData = [];
  public offset: number = 0;
  public limit: number = 30;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number = 0;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public lazyLoading: boolean = false;
  subscription: Subscription = new Subscription();

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - (this.offset * 8);
    this.scrollTop = event.target.scrollTop - 80;
    console.log(this.scrollTop);
    console.log(this.lastScrollTop);
    console.log(this.scrollInit);
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      console.log(inHeight);
      console.log(totalHeight);
      console.log(this.scrollCallback);
      console.log(this.itemTotal);
      console.log(this.itemLength);
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.lazyLoading = true;
        this.scrollCallback = false;
        this.presetsList(false,'');
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  constructor(
    private messageService: MessageService,
    private commonApi: CommonService,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService,
    private threadPostService: ThreadPostService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {

    this.bodyHeight = window.innerHeight;

	this.user = this.authenticationService.userValue;
	this.domainId = this.user.domain_id;
	this.userId = this.user.Userid;
	this.countryId = localStorage.getItem('countryId');


this.industryType = this.commonApi.getIndustryType();

 this.setScreenHeight();

 this.subscription.add(
  this.commonApi.presetsListDataReceivedSubject.subscribe((response) => {
    console.log(response);
    let flag = response['presetPushAction'];
    let presetAction = response['presetAction'];
    let id = response['presetId'];
    if(presetAction == 'visibile'){

    }
    else{
      if(!flag){
        this.loading = true;
      }
      this.presetsList(flag,id);
    }

  })
  );

  }

  onTabClose(event) {
    this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
}

onTabOpen(event) {
    this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
}

toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
}


    // Set Screen Height
    setScreenHeight() {
      this.innerHeight = this.bodyHeight-148;
     }

  presetsList(pushFlag,id=''){
    const apiFormData = new FormData();

    apiFormData["offset"] = this.offset;
    apiFormData["limit"] = this.limit;

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    if(pushFlag){
      apiFormData.append('presetId', id);
    }
    else{
      apiFormData.append('offset', apiFormData["offset"]);
      apiFormData.append('limit', apiFormData["limit"]);
    }

    this.threadPostService.presetList(apiFormData).subscribe(res => {

      if(res.status=='Success'){
          if(res.total == 0){
             this.loading = false;
             this.emptyFlag = true;
          }
          else{
            if(pushFlag){
              for(let i in this.presetsData){
                this.presetsData[i].listSelected = false;
              }
              let postAttachments = [];
              this.presetsListData = res.items;
              for (let i in this.presetsListData) {

                let manufacturerName = '';
              let manufacturer = [];
              manufacturer = this.presetsListData[i].manufacturer == '' ? manufacturer : JSON.parse(this.presetsListData[i].manufacturer);
              if(manufacturer.length>0){
                for(let mfg of manufacturer) {
                manufacturerName = mfg.name;
                }
              }
              this.presetsListData[i].manufacturerName = manufacturerName;

                let make = [];
                let makeName = '';
                var makeJSON = this.testJSON(this.presetsListData[i].make);
                if(makeJSON){
                  make = JSON.parse(this.presetsListData[i].make);
                  for(let m of make) {
                    makeName = m.name;
                  }
                }
                else{
                  makeName = this.presetsListData[i].make;
                }
                this.presetsListData[i].makeName = makeName;

                this.presetsListData[i].modelName = this.presetsListData[i].model;

                let data1 = this.presetsListData[i].manufacturerName == '' ? '' : this.presetsListData[i].manufacturerName;
                let data2 = this.presetsListData[i].makeName == '' ? '' : this.presetsListData[i].makeName;
                let data3 = this.presetsListData[i].modelName == '' ? '' : this.presetsListData[i].modelName;
                let data4 = this.presetsListData[i].year == 'null' ? '' : this.presetsListData[i].year;

                let chevron = "<img src='assets/images/preset/preset-chevron.png'>";
                let data1check = '';
                let data2check = '';
                if(this.industryType.id == 2) {
                  data1check = data1 == '' ? '' : data1;
                  data2check = data2 == '' ? data1check : data1check+"&nbsp;"+chevron+ "&nbsp;"+data2;
                }
                else{
                  data2check = data2 == '' ? '' : data2;
                }
                let data3check = data3 == '' ? data2check : data2check+"&nbsp;"+chevron+ "&nbsp;"+data3;
                let data4check = data4 == '' ? data3check : data3check+"&nbsp;"+chevron+ "&nbsp;"+data4;

                if(this.industryType.id == 2) {
                  this.presetsListData[i].titleMakeModelYear = this.presetsListData[i].title+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+data4check;
                  this.presetsListData[i].titleMakeModelYearPH = this.presetsListData[i].title+", "+data1+" > "+data2+" > "+data3+" > "+data4;

                }
                else{
                  this.presetsListData[i].titleMakeModelYear = this.presetsListData[i].title+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+data4check;
                  this.presetsListData[i].titleMakeModelYearPH = this.presetsListData[i].title+", "+data2+" > "+data3+" > "+data4;

                }
                this.presetsListData[i].contentEmit = this.presetsListData[i].content;
                this.presetsListData[i].listSelected = true;
                this.presetsListData[i].isSelected = true;


                let contentWeb = '';
                contentWeb = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.presetsListData[i].content));
                this.presetsListData[i].content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb));


                this.presetsListData[i].action = 'view';
                this.presetsListData[i].attachments = [];
                this.presetsListData[i].attachmentLoading = false;

                if(this.presetsListData[i].uploadContents){
                  this.presetsListData[i].attachments = this.presetsListData[i].uploadContents;
                  this.presetsListData[i].attachmentLoading = (this.presetsListData[i].uploadContents.length>0) ? false : true;
                  postAttachments.push({
                    id: this.presetsListData[i].id,
                    attachments: this.presetsListData[i].uploadContents
                  });
                }

                let date1 = this.presetsListData[i].createdOn;
                let date2 = moment.utc(date1).toDate();
                this.presetsListData[i].createdDate = moment(date2).local().format('MMM DD, YYYY . h:mm A');

                let tIndex = this.presetsData.findIndex(option => option.id == id);
                if(tIndex < 0){
                  this.presetsData.unshift(this.presetsListData[i]);
                  this.top.nativeElement.scrollTop = 0;
                }
                else{
                  this.presetsData[tIndex] = this.presetsListData[i];
                  //this.presetsListData[tIndex].listSelected = true;
                }
                console.log(this.presetsData);
                this.loading = false;
                this.emptyFlag = false;
              }
              let threadPostStorageText = `presetsAttachments`;
              localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));
            }
            else{

              if(this.offset == 0){
                this.presetsData = [];
                this.presetsListData = [];
                this.itemLength = 0;
                this.itemTotal = 0;
                this.lastScrollTop = -1 ;
              }
              this.presetsListData = res.items;
              let postAttachments = [];
              for (let i in this.presetsListData) {

                let manufacturerName = '';
                let manufacturer = [];
                manufacturer = this.presetsListData[i].manufacturer == '' ? manufacturer : JSON.parse(this.presetsListData[i].manufacturer);
                if(manufacturer.length>0){
                  for(let mfg of manufacturer) {
                  manufacturerName = mfg.name;
                  }
                }
                this.presetsListData[i].manufacturerName = manufacturerName;

                let make = [];
                let makeName = '';
                var makeJSON = this.testJSON(this.presetsListData[i].make);
                if(makeJSON){
                  make = JSON.parse(this.presetsListData[i].make);
                  for(let m of make) {
                    makeName = m.name;
                  }
                }
                else{
                  makeName = this.presetsListData[i].make.trim();
                }
                this.presetsListData[i].makeName = makeName;

                this.presetsListData[i].modelName = this.presetsListData[i].model.trim();

                let data1 = this.presetsListData[i].manufacturerName == '' ? '' : this.presetsListData[i].manufacturerName;
                let data2 = this.presetsListData[i].makeName == '' ? '' : this.presetsListData[i].makeName;
                let data3 = this.presetsListData[i].modelName == '' ? '' : this.presetsListData[i].modelName;
                let data4 = this.presetsListData[i].year == 'null' ? '' : this.presetsListData[i].year;

                let chevron = "<img src='assets/images/preset/preset-chevron.png'>";
                let data1check = '';
                let data2check = '';
                if(this.industryType.id == 2) {
                  data1check = data1 == '' ? '' : data1;
                  data2check = data2 == '' ? data1check : data1check+"&nbsp;"+chevron+ "&nbsp;"+data2;
                }
                else{
                  data2check = data2 == '' ? '' : data2;
                }
                let data3check = data3 == '' ? data2check : data2check+"&nbsp;"+chevron+ "&nbsp;"+data3;
                let data4check = data4 == '' ? data3check : data3check+"&nbsp;"+chevron+ "&nbsp;"+data4;

                if(this.industryType.id == 2) {
                  this.presetsListData[i].titleMakeModelYear = this.presetsListData[i].title+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+data4check;
                  this.presetsListData[i].titleMakeModelYearPH = this.presetsListData[i].title+", "+data1+" > "+data2+" > "+data3+" > "+data4;

                }
                else{
                  this.presetsListData[i].titleMakeModelYear = this.presetsListData[i].title+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+data4check;
                  this.presetsListData[i].titleMakeModelYearPH = this.presetsListData[i].title+", "+data2+" > "+data3+" > "+data4;

                }

                this.presetsListData[i].contentEmit = this.presetsListData[i].content;
                this.presetsListData[i].listSelected = false;
                this.presetsListData[i].isSelected = false;


                let contentWeb = '';
                contentWeb = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.presetsListData[i].content));
                this.presetsListData[i].content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb));


                this.presetsListData[i].action = 'view';
                this.presetsListData[i].attachments = [];
                this.presetsListData[i].attachmentLoading = false;

                if(this.presetsListData[i].uploadContents){
                  this.presetsListData[i].attachments = this.presetsListData[i].uploadContents;
                  this.presetsListData[i].attachmentLoading = (this.presetsListData[i].uploadContents.length>0) ? false : true;
                  postAttachments.push({
                    id: this.presetsListData[i].id,
                    attachments: this.presetsListData[i].uploadContents
                  });
                }

                let date1 = this.presetsListData[i].createdOn;
                let date2 = moment.utc(date1).toDate();
                this.presetsListData[i].createdDate = moment(date2).local().format('MMM DD, YYYY . h:mm A');

                this.presetsData.push(this.presetsListData[i]);

                setTimeout(() => {
                  let tIndex = this.presetsData.findIndex(option => option.id == id);
                  if(tIndex < 0){}
                  else{
                    this.presetsListData[tIndex].listSelected = true;
                    this.presetsListData[tIndex].isSelected = true;
                  }
                }, 700);

                this.loading = false;
                this.emptyFlag = false;
                this.lazyLoading = false;

              }
              let threadPostStorageText = `presetsAttachments`;
              localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));

              this.scrollCallback = true;
              this.scrollInit = 1;
              this.itemTotal = res.total;
              this.itemLength += this.presetsData.length;
              this.offset += this.limit;

            }
          }
      }
      else{

      }

    },
    (error => {})
    );

  }

  testJSON(text){
    if (typeof text!=="string"){
        return false;
    }
    try{
        var json = JSON.parse(text);
        return (typeof json === 'object');
    }
    catch (error){
        return false;
    }
  }

  openPresetsAction(type,id){
    let data = {};
    if(type == 'emit'){
      data = {
        presetType: 'emit',
        presetData: id,
      };
    }
    else{
      data = {
        presetType: type,
        presetPushAction: false,
        presetId: id,
      };
    }
    this.presetActionEmit.emit(data);
  }
  selectedActive(index){
    for(let i in this.presetsData){
      this.presetsData[i].listSelected = false;
      //this.presetsData[i].isSelected = false;
    }
    this.presetsData[index].listSelected = true;
    //this.presetsData[index].isSelected = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
