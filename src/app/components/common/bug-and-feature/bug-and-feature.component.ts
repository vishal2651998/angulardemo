import { Component, OnInit, ViewChild, Input, Output, HostListener, ElementRef } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RedirectionPage, windowHeight } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-bug-and-feature',
  templateUrl: './bug-and-feature.component.html',
  styleUrls: ['./bug-and-feature.component.scss'],
  styles: [
    `.masonry-item {
        width: 250px;
      }

    `,
  ],
})
export class BugAndFeatureComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() parentData;
  @Input() apiData: any = {};
  @Input() dateTime: string = "";
  @Input() buglist: boolean;
  subscription: Subscription = new Subscription();
  public midHeight;
  public opacityFlag: boolean = false;
  public updateMasonryLayout: boolean = true;
  public bugandfeaturelist: any = [];
  public scrollTop: number;
  public batchName: string = "";
  public bugfeaturelistout: any = [];
  public apicall: any = "";
  public loading: boolean = true;
  public bodyHeight: any = [];
  public status: string = "B";
  public itemOffset: number = 20;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public itemResponse = [];
  public redirectUrl: string = "bug_and_features/view/"
  public toggleOn: boolean = false;
  public scrollCallback: boolean = true;
  public bugLoading: any = [];
  public offSet: any = 0;
  public limit: any = 30;
  public buglistout: boolean = true;
  public resultdatalist: any = []
  public scrollTops: any;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log("het")
    if (!this.loading) {
      this.bodyHeight = window.innerHeight;

    }
  }
  constructor(
    private common: CommonService,
    private authenticationService: AuthenticationService,
    private route: Router,
    private platformLoacation: PlatformLocation
  ) {
    this.platformLoacation.onPopState(() => {
      console.log("jiji")
      let url = this.route.url.split('/');
      if (url[1] == RedirectionPage.BugorFeature) {
        this.scrollTops = parseInt(localStorage.getItem('wsScrollPos'))
        console.log(localStorage.getItem('wsScrollPos'))
        this.backScroll()
        setTimeout(() => {
          this.top.nativeElement.scrollTop = this.scrollTops ;
        }, 1);
      }
    })
  }

  ngOnInit(): void {
    console.log("Test")
    console.log(this.parentData, this.apiData)
    this.updateMasonryLayout = false;
    this.midHeight = windowHeight.heightMsTeam - 10;
    console.log(this.midHeight)
    this.common.bugfeaturelistSubject.subscribe((buglist) => {
      console.log(buglist);
      this.buglistout = buglist['action']
      console.log("hi")
      this.loading = true;
      this.resultdatalist = []
      this.offSet = 0;
      setTimeout(()=>{
        this.getdata();
      })
      setTimeout(() => {
        if (this.top != undefined) {
          this.top.nativeElement.scroll({
            top: 20,
            left: 30,
            behavior: "auto",
          })
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 1500)
    })
    this.getdata();
    setTimeout(() => {
      this.loading = false;
    }, 1000)
    this.scrollInit = 1;
    this.common.bugfeaturedataSubject.subscribe((data) => {
      console.log(data)
      if (data['action'] == 'load') {
        this.toggleOn = true
        setTimeout(() => {
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
        }, 600);
      } else {
        this.toggleOn = false;
        setTimeout(() => {
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
        }, 600);
      }
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    })
  }

  updateLayout() {
    this.updateMasonryLayout = true;
    this.scrollTops = this.scrollTop
    console.log(this.scrollTops)
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 300);
  }

  bfdata(threadInfoData) {
    let createdOnNew = threadInfoData.createdOn;;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    let localcreatedOnDate = moment(createdOnDate)
      .local()
      .format("MMM DD, YYYY . h:mm A");
    let obj = {
      threadId: threadInfoData.threadId,
      threadTitle: this.authenticationService.convertunicode(
        this.authenticationService.ChatUCode(
          threadInfoData.threadTitle
        )
      ),
      threadStatus: threadInfoData.threadStatus,
      content: threadInfoData.content.replace(/(<([^>]+)>)/ig, ''),
      profileImage: threadInfoData.profileImage,
      userName: threadInfoData.userName,
      createdOn: localcreatedOnDate,
      likeCount: threadInfoData.likeCount,
      threadType: threadInfoData.reportType,
      postId: threadInfoData.postId,
      platformTypeTitle: threadInfoData.platformTypeTitle,
      userRole: threadInfoData.userRoleTitle,
      selected: false,
      uploadContents: threadInfoData.uploadContents

    };
    this.resultdatalist.push(obj)

    this.itemTotal += 1;
    this.itemLength += 1;

    // this.masonry.reloadItems();
    // this.masonry.layout();
    // this.updateMasonryLayout = true;
  }
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }
  viewBugFeature(id, list): void {
    let scrollTop: any = this.scrollTop;
    let navFrom = this.common.splitCurrUrl('bugorfeature');
    let wsFlag = false
    this.common.setListPageLocalStorage(wsFlag, navFrom, scrollTop)
    for (let l of list) {
      l.selected = (parseInt(l.threadId) == parseInt(id.threadId)) ? true : false;
    }
    this.toggleOn = true
    let data = {
      action: "load",
      Id: id.threadId,
      docdata: id
    }
    this.common.emitbugfeaturedata(data)
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 600);

  }
  getdata(push = false, limit: any = '') {
    console.log("hi")
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop
    let formData = new FormData;
    formData.set('apiKey', this.apiData.apiKey);
    formData.set('userId', this.apiData.userId);
    formData.set('domainId', this.apiData.domainId);
    formData.set('offset', this.offSet);
    formData.set('limit', this.limit);
    this.common.bugsfeaturelist(formData).subscribe((response) => {
      this.bugandfeaturelist = response.items;
      if(this.bugandfeaturelist && this.bugandfeaturelist.length>0)
      {
        //this.lazyLoading = this.loading;
      }

      this.offSet += 30;
      this.scrollCallback = true;
      for (let i of this.bugandfeaturelist) {
        if (this.buglistout) {
          this.status = "B"
          if (i.reportType == "1") {
            this.bfdata(i)
          }
        } else if (!this.buglistout) {
          this.status = "F"
          if (i.reportType == "2") {
            this.bfdata(i)
          }
        } else {
          if (i.reportType == "1") {
            this.bfdata(i)
          }
        }

      }
      /*
      if (this.resultdatalist.length < 35) {
        this.lazyLoading = true;
        this.getdata()
      }
      */
      console.log(this.bugfeaturelistout, this.resultdatalist)
    })

    // this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    // }, 2000)
  }
  scroll = (event: any): void => {
    console.log('ji')
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
    this.scrollTop = event.target.scrollTop - 10;
    // if(this.opacityFlag){
    //   this.scrollTop = this.scrollTops
    //   this.top.nativeElement.scrollTop = this.scrollTop

    // }

    console.log(inHeight, totalHeight, this.scrollTop, this.lastScrollTop, this.scrollInit)
    if (
      inHeight >= totalHeight &&
      this.scrollCallback
    ) {
      this.lazyLoading = true;
      this.scrollCallback = false;
      console.log("ks")
      this.getdata();
    }
    console.log(this.scrollTop,this.scrollTops)
    this.lastScrollTop = this.scrollTop;
  }

  backScroll() {
    let scrollPos = localStorage.getItem('wsScrollPos')
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos) + inc;
    console.log(this.scrollTop)
    this.opacityFlag = true;
    setTimeout(() => {
      localStorage.removeItem('wsScrollPos');
      this.updateMasonryLayout = true;
      this.masonry.reloadItems();
      this.masonry.layout();
      setTimeout(() => {
        this.updateMasonryLayout = false;
      }, 100)
    }, 500);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
