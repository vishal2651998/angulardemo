import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
@Component({
  selector: 'app-service-provider-detail',
  templateUrl: './service-provider-detail.component.html',
  styleUrls: ['./service-provider-detail.component.scss']
})
export class ServiceProviderDetailComponent implements OnInit {
  public bodyClass:string = "service-provider-detail";
  public bodyElem;
  public footerElem;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bannerFit: boolean = true;
  responsiveOptions: any;
  reviewResponsiveOptions: any;
  blogs: any;
  customerReview: any;
  imageHeight: any;
  serviceProviderData: any = [];
  scrollTop: any;
  lastScrollTop: any = 0;
  scrollInit: number = 0;
  marketPlaceTotalData: any;
  dataLimit: any = 6;
  dataOffset: any = 0;
  domainId: any;
  domainData: any;
  domainurl: any;
  loadingList: any = false;
  reparifyDomain: boolean = false;
  loadList: boolean = true

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let screenSize = document.documentElement.clientWidth;
    console.log(screenSize)
    if (screenSize <= 426) {
      this.imageHeight = "170px";
    } else if (screenSize > 426) {
      this.imageHeight = "230px";
    }
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.scrollTo(0, 0);
  }
  constructor(
    private scrollTopService: ScrollTopService,
    private titleService: Title,
    private router: Router,
    private threadApi: ThreadService,
    private route: ActivatedRoute,
  ) {
    let host = window.location.host
    let subdomain = host.split('.')[0]
    if (subdomain == "atgtraining-stage") {
      this.reparifyDomain = true;
    } else {
      this.reparifyDomain = false;
    }
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (
        inHeight >= totalHeight &&
        this.marketPlaceTotalData > this.serviceProviderData.length
      ) {
        this.dataOffset += this.dataLimit;
        this.trainingData();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
    this.domainId = this.route.snapshot.params["id"];
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Service Provider Detail');
    let screenSize = document.documentElement.clientWidth;
    if (screenSize <= 426) {
      this.imageHeight = "170px";
    } else if (screenSize > 426) {
      this.imageHeight = "230px";
    }
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
    this.reviewResponsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '768px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
    this.blogs = [
      {
        image: "assets/images/service-provider/blog.png",
        date: "May 26, 2022",
        tags: "Headlights, Turn Signals, Brake,and Parking Lights",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget congue justo, nec pellentesque di.."
      },
      {
        image: "assets/images/service-provider/blog.png",
        date: "May 26, 2022",
        tags: "Headlights, Turn Signals, Brake,and Parking Lights",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget congue justo, nec pellentesque di.."
      },
      {
        image: "assets/images/service-provider/blog.png",
        date: "May 26, 2022",
        tags: "Headlights, Turn Signals, Brake,and Parking Lights",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget congue justo, nec pellentesque di.."
      },
      {
        image: "assets/images/service-provider/blog.png",
        date: "May 26, 2022",
        tags: "Headlights, Turn Signals, Brake,and Parking Lights",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget congue justo, nec pellentesque di.."
      }
    ]
    this.customerReview = [
      {
        companyName: "Mas Mobile Auto Solution",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suscipit ipsum at interdum tincidunt. Nunclacinia erat eu dui auctor, sed vulputate dui convallis. Praesent ut scelerisque eros.",
        reviewBy: "Dan Will",
        reviewerPosition: "CEO ABC Company"
      },
      {
        companyName: "Mas Mobile Auto Solution",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suscipit ipsum at interdum tincidunt. Nunclacinia erat eu dui auctor, sed vulputate dui convallis. Praesent ut scelerisque eros.",
        reviewBy: "Dan Will",
        reviewerPosition: "CEO ABC Company"
      },
      {
        companyName: "Mas Mobile Auto Solution",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suscipit ipsum at interdum tincidunt. Nunclacinia erat eu dui auctor, sed vulputate dui convallis. Praesent ut scelerisque eros.",
        reviewBy: "Dan Will",
        reviewerPosition: "CEO ABC Company"
      },
      {
        companyName: "Mas Mobile Auto Solution",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suscipit ipsum at interdum tincidunt. Nunclacinia erat eu dui auctor, sed vulputate dui convallis. Praesent ut scelerisque eros.",
        reviewBy: "Dan Will",
        reviewerPosition: "CEO ABC Company"
      },
      {
        companyName: "Mas Mobile Auto Solution",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suscipit ipsum at interdum tincidunt. Nunclacinia erat eu dui auctor, sed vulputate dui convallis. Praesent ut scelerisque eros.",
        reviewBy: "Dan Will",
        reviewerPosition: "CEO ABC Company"
      },
    ];
    this.trainingData();
  }

  redirectToInnerDetailPage(training: any) {
    console.log(training);
    this.router.navigateByUrl('/marketplace/domain/' + training?.domainID + '/detail/' + training?.id);
  }

  trainingData() {
    this.loadingList = true;
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: this.domainId
    };
    this.scrollInit = 1;
    this.threadApi.apiGetMarketPlaceData(payload).subscribe((response: any) => {
      if (response && response.data && response.data.marketPlaceData && response.data.marketPlaceData.length) {
        response.data.marketPlaceData.forEach((data: any) => {
          this.serviceProviderData.push(data);
        });
      }
      this.domainData = response?.data?.businessDomainData;
      this.bannerFit = (this.domainData.market_place_banner_fit && parseInt(this.domainData.market_place_banner_fit)) ? true : false,
      this.domainurl = 'https://' + this.domainData.subdomainurl + '.collabtic.com/marketplace/detail';
      this.marketPlaceTotalData = response?.data?.totalRecords;
      if (this.marketPlaceTotalData > this.serviceProviderData.length) {
        this.loadList = true;
      } else {
        this.loadList = false;
      }
      this.loadingList = false;
    }, (error: any) => {
      this.loadingList = false;
      console.log(error);
    });
  }

  loadMoreData() {
    if (this.marketPlaceTotalData > this.serviceProviderData.length) {
      this.dataOffset += parseInt(this.dataLimit);
      this.trainingData();
      this.loadList = true;
    } else {
      this.loadList = false;
    }
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY')
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

  convertStringToInt(value: any) {
    return parseInt(value);
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

  goBack(){
    history.back();
  }

  checkBirdPriceAvailablity(date: any) {
    let currentDate: any = new Date();
    currentDate.setHours(0,0,0,0)
    let checkDate: any = new Date(date);
    checkDate.setHours(0,0,0,0)
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
