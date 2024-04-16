import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { industryTypes } from 'src/app/common/constant/constant';
import { GtsService } from 'src/app/services/gts/gts.service';

@Component({
  selector: 'app-gts-sidebar',
  templateUrl: './gts-sidebar.component.html',
  styleUrls: ['./gts-sidebar.component.scss']
})
export class GtsSidebarComponent implements OnInit, AfterViewInit {

  @Input() pageData;
  @Input() innerHeight;
  tags: Array<any>;
  vehicleDetail: Array<any>;
  isScrollbar: boolean = false;
  isPrinting = industryTypes;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const sidebar = document.getElementById('gts-sidebar');
    this.isScrollbar = this.checkScrollBar(sidebar, 'vertical')
  }

  imgURL: any = '';
  public gtsPlaceholderImg: string = "assets/images/gts/gts-placeholder.png";
  public gtsInfo: Object;

  constructor(public gtsApi: GtsService) { }

  ngOnInit(): void {
    console.log("gtsApi.apiData", this.gtsApi.apiData);

    this.imgURL = !this.pageData["gtsImg"] ? this.gtsPlaceholderImg : this.pageData["gtsImg"];
    this.tags = (this.pageData.tags) ? JSON.parse(this.pageData.tags) : [];
    this.vehicleDetail = (this.pageData.vehicleDetails) ? JSON.parse(this.pageData.vehicleDetails) : []
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const sidebar = document.getElementById('gts-sidebar');
      this.isScrollbar = this.checkScrollBar(sidebar, 'vertical')
    }, 2000)

  }

  checkScrollBar(element, dir) {
    dir = (dir === 'vertical') ?
      'scrollTop' : 'scrollLeft';

    var res = !!element[dir];

    if (!res) {
      element[dir] = 1;
      res = !!element[dir];
      element[dir] = 0;
    }
    return res;
  }

}
