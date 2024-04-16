import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from 'src/app/common/constant/constant';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  public bodyElem;
  public user: any;
  public userId: any;
  public apiData: any;
  public domainId: any;
  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public accessPage: string = '';
  public loading: boolean = true;
  public sidebarActiveClass: Object;
  public sidebarRef: SidebarComponent;
  public apiKey: string = Constant.ApiKey;
  public bodyClass: string = "parts-list";
  public pageAccess: string = "headquarters";
  public headTitle: string = "Section Detail";
  public accessModule: string = 'dekra-audit';
  public bodyClass2: string = "system-settings";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  scroll = (event: any): void => { }

  constructor(
    private router: Router,
    private titleService: Title,
    private activeRoute: ActivatedRoute,
    private headquarterService: HeadquarterService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass2);

    window.addEventListener('scroll', this.scroll, true);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let id = this.activeRoute.snapshot.params['id'];
    let networkId = this.activeRoute.snapshot.params['networkId'];
    this.getData(id, networkId)
  }

  menuNav(item) {
    let section = item.slug;
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case 'home':
        this.router.navigate(["/headquarters/home"]);
        return false;
        break;
      case 'headquarters':
        this.router.navigate(["/headquarters/network"]);
        return false;
        break;
      case 'tools':
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
        break;
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;
      default:
        break;
    }
  }

  setScreenHeight() {
    setTimeout(() => {
      var elmnt = document.getElementById("matrixTable");
      if (!elmnt) {
        this.setScreenHeight();
      }
    }, 1000);

    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    let url: any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
      searchVal: "",
    };
  }

  getData(id: string, networkId: string) {
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", networkId);
    apiFormData.append("id", id);
    apiFormData.append("offset", '0');
    apiFormData.append("limit", '10');
    this.headquarterService.getGtsList(apiFormData).subscribe((response: any) => {
      this.loading = false;
      if (response.status == 'Success') {
        this.apiData = response.items[0];
      }
    }, (error: any) => {
      this.loading = false;
    });
  }

  back() {
    this.router.navigate(["headquarters/audit"], { queryParams: { type: 'section' } })
  }

  goToEdit () {
    this.router.navigate(["/edit-section/" + this.activeRoute.snapshot.params['id']])
  }

  submitDelete(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        this.deleteSection();
      }
    });
  }

  deleteSection () {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("id", this.activeRoute.snapshot.params['id']);
    
    this.headquarterService.deleteSection(apiFormData).subscribe((res: any)=>{
      if(res.status == 'Success') {
        this.bodyElem.classList.add('headquarters');
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = "Section deleted successfull";
       
        setTimeout(() => {
          msgModalRef.dismiss('Cross click');  
          this.bodyElem.classList.remove('headquarters');
          this.back();
        }, 2000);
      }
    })
  }
}
