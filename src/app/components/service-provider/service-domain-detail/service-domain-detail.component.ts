import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ThreadService } from 'src/app/services/thread/thread.service';
import {NgxMasonryComponent} from 'ngx-masonry';
import { CommonService } from '../../../services/common/common.service';
import {PlatformLocation} from '@angular/common';

@Component({
  selector: 'app-service-domain-detail',
  templateUrl: './service-domain-detail.component.html',
  styleUrls: ['./service-domain-detail.component.scss'],
  styles: [
    `
      .masonry-item {
        width: 268px;
        margin: 20px 20px 20px 0px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})

export class ServiceDomainDetailComponent implements OnInit, OnDestroy {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  public updateMasonryDomainLayout: any;
  dataDomainLimit: any = 8;
  dataDomainOffset: any = 0;
  domainsTotalData: any;
  scrollTop: any;
  domainData: any = [];
  loadingDomain: any = false;
  loadDomain: any = false;
  isMobile: any = false;
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scrollTop: any;
    scrollTop = window.pageYOffset;
    this.scrollTop = scrollTop;
  }

  constructor(
    private threadApi: ThreadService,
    private router: Router,
    private commonService: CommonService,
    private location: PlatformLocation,
  ) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }
    this.location.onPopState (() => {
      setTimeout(() => {
        this.updateMasonryDomainLayout = true;
        this.masonry.reloadItems();
        this.masonry.layout();
      }, 200);
    });
  }
  ngOnInit(): void {
    this.domainsData(true);
  }

  setScrollingLocalStorage() {
    let navFrom = this.commonService.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == 'marketplace') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
  }

  redirectToDomainTrainingByRouter(id: any) {
    this.setScrollingLocalStorage();
    this.router.navigateByUrl('marketplace/domain/' + id);
  }

  domainsData(scroll) {
    this.loadingDomain = true;
    let payload = {
      limit: this.dataDomainLimit,
      offset: this.dataDomainOffset
    }
    this.threadApi.apiGetDomainsData(payload).subscribe((response: any) => {
      if (response && response.data && response.data.businessDomains && response.data.businessDomains.length) {
        response.data.businessDomains.forEach((data: any) => {
          this.domainData.push(data);
        });
      }
      this.loadingDomain = false;
      this.domainsTotalData = response.data.totalRecords;
      this.updateMasonryDomainLayout = true;
      if (this.domainsTotalData > this.domainData.length) {
        this.loadDomain = true;
      } else {
        this.loadDomain = false;
      }
      if (scroll) {
        window.scroll(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }, (error: any) => {
      this.loadingDomain = false;
    });
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }
  getStartDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD');
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A')
    } else {
      return '';
    }
  }
  loadMoreDomainData() {
    if (this.domainsTotalData > this.domainData.length) {
      this.dataDomainOffset += this.dataDomainLimit;
      this.domainsData(false);
      this.loadDomain = true;
    } else {
      this.loadDomain = false;
    }
  }
  isVideo(ext :any) {
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }
  ngOnDestroy() {
  }
}
