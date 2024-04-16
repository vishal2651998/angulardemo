import { Component, HostListener, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Constant } from "src/app/common/constant/constant";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { HeadquarterService } from "src/app/services/headquarter.service";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LOCALSTORAGE } from "src/app/utils/constants";

@Component({
  selector: "app-inspections",
  templateUrl: "./inpsections.component.html",
  styleUrls: ["./inpsections.component.scss"],
})
export class InspectionsComponent implements OnInit {
  public bodyElem;
  public apiData: any;
  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public accessPage: string = "";
  public loading: boolean = true;
  public sidebarActiveClass: Object;
  public dekraNetworkId: string = "";
  public sidebarRef: SidebarComponent;
  public apiKey: string = Constant.ApiKey;
  public bodyClass: string = "parts-list";
  public pageAccess: string = "headquarters";
  public headTitle: string = "Section Detail";
  public accessModule: string = "dekra-audit";
  public bodyClass2: string = "system-settings";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public user: any;
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

  scroll = (event: any): void => { };

  constructor(
    private router: Router,
    private titleService: Title,
    private activeRoute: ActivatedRoute,
    private headquarterService: HeadquarterService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass2);
    this.user = this.authenticationService.userValue;

    window.addEventListener("scroll", this.scroll, true);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    this.dekraNetworkId =
      localStorage.getItem("dekraNetworkId") != undefined
        ? localStorage.getItem("dekraNetworkId")
        : "";
    let id = this.activeRoute.snapshot.params["id"];
    this.getData(id);
  }

  menuNav(item) {
    let section = item.slug;
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case "home":
        this.router.navigate(["/headquarters/home"]);
        return false;
        break;
      case "headquarters":
        this.router.navigate(["/headquarters/network"]);
        return false;
        break;
      case "tools":
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
        break;
      case 'dekra-audit':
          this.router.navigate(["/headquarters/audit"]);
          return false;
        break;
      case 'all-users':
        this.router.navigate(["/headquarters/all-users"]);
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
    let headerHeight2 = document.getElementsByClassName("hq-head")[0]
      ? document.getElementsByClassName("hq-head")[0].clientHeight
      : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    let url: any = this.router.url;
    let currUrl = url.split("/");
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

  getData(id: string) {
    console.log(" ==== Funtime flow ID ====> ", id)
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("id", id);

    const localstorageResponse: any = localStorage.getItem(
      LOCALSTORAGE.CURRENT_SECTION_LIST
    );
    const parsedResponse = JSON.parse(localstorageResponse)
    this.headquarterService.getInspectionList(apiFormData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.status == "Success") {
          this.apiData = response.items[0];
          localStorage.setItem(
            LOCALSTORAGE.CURRENT_SECTION_LIST,
            JSON.stringify({
              ...parsedResponse,
              [id]: this.apiData?.sections ?? []
            })
          );
        }
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  
  goToSection(id, networkId) {
    if (networkId == 0) networkId = this.dekraNetworkId;
    this.router.navigate(["section/" + networkId + "/" + id]);
  }

  back() {
    this.router.navigate(["/headquarters/audit"])
  }

  goToEdit() {
    this.router.navigate([
      "/edit-inspection/" + this.activeRoute.snapshot.params["id"],
    ]);
  }

  submitDelete() {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      if (!receivedService) {
        return;
      } else {
        this.deleteInspection();
      }
    });
  }

  deleteInspection() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("id", this.activeRoute.snapshot.params["id"]);

    this.headquarterService
      .deleteInspection(apiFormData)
      .subscribe((res: any) => {
        if (res.status == "Success") {
          this.bodyElem.classList.add("headquarters");
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage =
            "Inspection deleted successfull";

          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            this.bodyElem.classList.remove("headquarters");
            this.back();
          }, 2000);
        }
      });
  }

  startInspection(title: any) {
    let id = this.activeRoute.snapshot.params['id'];
    this.router.navigateByUrl('/inspection/'+ id+"/summary");
    let breadCrumb = ['Audit/Inspections', 'Inspection', title];
    localStorage.setItem('breadCrumb' , JSON.stringify(breadCrumb));
  }
}
