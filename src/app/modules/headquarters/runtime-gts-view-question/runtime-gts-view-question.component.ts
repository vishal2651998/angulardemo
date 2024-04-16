// import { Component, OnInit } from "@angular/core";


// @Component({
//   selector: "app-gts-view-question",
//   templateUrl: "./runtime-gts-view-question.component.html",
//   styleUrls: ["./runtime-gts-view-question.component.scss"],
// })
// export class GtsViewQuestionComponent implements OnInit {
//   /**
//    *
//    */
//   constructor() {
//   }


//   ngOnInit() {
//   }

//   goBack(){}

// }


import { DatePipe, Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Constant } from "src/app/common/constant/constant";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { ManageUserComponent } from "src/app/components/common/manage-user/manage-user.component";
import { CallsService } from "src/app/controller/calls.service";
import { ApiService } from "src/app/services/api/api.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { GtsService } from "src/app/services/gts/gts.service";
import { LOCALSTORAGE } from "src/app/utils/constants";
import { formatBytes } from "src/app/utils/helper";

@Component({
  selector: "app-gts-view-question",
  templateUrl: "./runtime-gts-view-question.component.html",
  styleUrls: ["./runtime-gts-view-question.component.scss"],
})
export class GtsViewQuestionComponent implements OnInit {
  public data = [];
  public classArr: any = [0];
  public contentBox: any = [];
  public outerContentBox: any = [0];
  public contentOne = [1, 2, 3, 4];
  public outerContent = [1, 2, 3, 4];
  public sections: Array<any> = [];
  public userData: any = {};
  public inspectionId: string = "";
  public inspectionTitle: string = "";
  public loading: boolean = false;
  public apiKey: string = Constant.ApiKey;
  public actionButionSyncer: any;
  public formData: any = {};
  public selected: any = {};
  public gstId: any = undefined;
  public attachmentFiles: any = {};
  public removedAttachments: any = [];
  public totalQuestionPerItem: any = {};
  public completedQuestionsPerItem: any = {};
  public totalCompeletedInfoProgress: any = {};
  public totalInfoChecksAnswered: any = {};
  public totalQuestions: number = 0;
  public completedQuestions: number = 0;
  public infoData: any = [];
  public checksAction: any = {}
  public userInputData: any = {};
  public sectionLoading: any = {}
  public userInputLoading: any = {}
  public currentLocation: any = {};
  public startInspectionDate: any = undefined
  public datePipe = new DatePipe('en-US')
  public currentInputState: any = [];
  public currentInspectionStatus: any = {}
  public infoProgressFromApi: any = []
  public userActionTouched: any = {}
  public selectedContactUsers: any = {};
  public bodyElem;
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public domainId: any;
  public countryId: any;
  public userId: any;
  public user: any;
  public alreadyAnswered: any = {}
  public inputValuesOnChange: any = {}
  public inputRequiredClass: any = {}

  public assignUserDate: any = {}
  public assignUserFollowDate: any = {}
  public logoUrl: string = ""
  public modalRef: any;

  public inputItemLoader: any = {}
  public inputItemCheck: any = {}

  public readonly: boolean = false

  /**
   *
   */
  constructor(
    public callService: CallsService,
    private route: ActivatedRoute,
    private gtsService: GtsService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
  ) {


    this.userData = this.callService.user.data;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;

    const logoObj: string = localStorage.getItem('logoUrl')
    this.logoUrl = logoObj;

    this.countryId = localStorage.getItem('countryId');
    this.inspectionTitle = this.route.snapshot.params["title"]
    this.inspectionId = this.route.snapshot.params["id"]
  }



  ngOnInit() {
    this.getData();
  }

  goBack() {
    this.location.back();
  }

  getData() {
    this.loading = true;
    const id = this.route.snapshot.params["id"];
    const apiFormData = new FormData();

    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("procedureID", id);

    this.gtsService.getProcessinfobysection(apiFormData).subscribe((res: any) => {
      console.log(" ==== rs ==== > ", res)
      if (res.status === 'Success') {
        this.infoData = res.data
        this.checksAction = {
          ...this.checksAction,
          [`${id}-${0}`]: this.infoData[0]?.['firstData']
        }
      }

      this.loading = false;
    }, (error) => {
      this.loading = false;
      console.log(" ==== error ==== ", error)
    })

  }

  returnChecksAction(item: any, index: any, type: string) {
    const returnResult = this.checksAction[`${item?.ProcedureID}-${index}`]
    return (returnResult ?? []).filter((i) => i?.name === type)
  }

  renderAssignUserInput(json: any) {
    return json ? JSON.parse(json) : []
  }

  returnsAction(item: any, val: any) {
    return item?.ProcessID == val?.ProcessID;
  }


}
