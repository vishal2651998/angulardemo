import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { GtsService } from 'src/app/services/gts/gts.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import * as html2pdf from 'html2pdf.js';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from "@angular/common";

@Component({
  selector: 'app-session-summary',
  templateUrl: './session-summary.component.html',
  styleUrls: ['./session-summary.component.scss']
})
export class SessionSummaryComponent implements OnInit {
  public gtsSessionId: any;
  public user: any;
  public userId: any;
  public countryId: any;
  public domainId: any;
  public apiKey: string;
  gtsSummaryId: any;
  summaryData: any;
  public bodyClass: string = "gts";
  public bodyElem;
  public showLoader:boolean = true;
  public vehicle: any;
  public loading: boolean = false;

  constructor(
    private threadApi: ThreadService,
    private gtsService: GtsService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer,
    private location: Location,
  ) { }

  ngOnInit(): void {

    this.apiKey = "dG9wZml4MTIz";
    this.gtsSessionId = this.route.snapshot.params["sessionId"];
    this.gtsSummaryId = this.route.snapshot.params["summaryId"];
    // console.log(this.gtsSessionId)
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid;
    this.countryId = this.user.countryId;
    this.domainId = this.user.domain_id;
    this.loadSummary();
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.remove(this.bodyClass);
    let element = document.getElementById("probing-questions");
    element.style.overflow = "auto"
  }

  ngOnDestroy() {
    this.bodyElem.classList.add(this.bodyClass);
    let element = document.getElementById("probing-questions");
    element.style.overflow = "auto"
  }

  loadSummary() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("searchKey", "");
    apiFormData.append("procedureId", this.gtsSessionId);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("gtsSessionId", this.gtsSummaryId);
    this.gtsService.apiGetSessionSummary(apiFormData).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.summaryData = response.items[0];
        let vehicleInfo = this.summaryData?.vehicleInfo[0];
        if(vehicleInfo) {
        this.vehicle = {'productType':vehicleInfo?.productType,'year':vehicleInfo?.year[0],'model':vehicleInfo?.model[0]};
        }
        this.summaryData.summaryInfo.map((res)=>{
          if(res.processSteps.length > 0) {
            res.processSteps.map((processStepsRes)=>{
              if(processStepsRes.userInputs.length > 0) {
                processStepsRes.userInputs.map((userInputsRes)=>{
                  if((userInputsRes.authorInput && userInputsRes.userActionValue) || userInputsRes.userAttachments.length > 0) {
                    processStepsRes['userInputFields'] = true;
                  } else {
                    processStepsRes['userInputFields'] = false;
                  }
                })
              }
            })
          }
        })
        // console.log(this.summaryData);
        this.showLoader = false;
      }
    }, (error: any) => {
      console.log('error: ', error);
    });
  }

  previousPage() {
    // this.router.navigateByUrl('gts');
    // this.router.navigate([`gts/session-list/${this.gtsSessionId}`]);
    this.location.back();
  }

  downloadPdf() {
    this.loading = true;
    let element = document.getElementById('summaryData');
    let opt = {
      // margin: 1,
      margin: [0, 0, 0.5, 0],
      filename: 'summaryData.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      /* pagebreak: { after: '.before-page' } */ /* to break the page after desired class of the element  */
    }
    html2pdf().from(element).set(opt).save().then((res)=>{
      console.log('working')
    this.loading = false;
    });

    // console.log(html2pdf().from(element).set(opt).save())
  }

  goToFile(path:any) {
    window.open(path, '_blank');
  }

  transformHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

  breadCrumbNavigation(page: any) {
    switch (page) {
      case 'gtsSessionList':
        this.router.navigate([`gts/session-list/${this.gtsSessionId}`]);
        break;
      case 'gtsList':
        this.router.navigateByUrl('gts');
        break;
    }
  }
}
