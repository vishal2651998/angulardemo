import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Constant } from "src/app/common/constant/constant";
import { CallsService } from "src/app/controller/calls.service";
import { GtsService } from "src/app/services/gts/gts.service";
import { LOCALSTORAGE } from "src/app/utils/constants";

@Component({
  selector: "app-gts-sample",
  templateUrl: "./gts-sample.component.html",
  styleUrls: ["./gts-sample.component.scss"],
})
export class GtsSampleComponent implements OnInit {
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
  public totalQuestionPerItem: any = {};
  public completedQuestionsPerItem: any = {};
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
  /**
   *
   */
  constructor(
    public callService: CallsService,
    private route: ActivatedRoute,
    private gtsService: GtsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) {
    this.userData = this.callService.user.data;
    const localstorageResponse: string = localStorage.getItem(
      LOCALSTORAGE.CURRENT_SECTION_LIST
    );
    const locationFromStorage: any = localStorage.getItem(LOCALSTORAGE.CURRENT_SECTION_LOCATION)
    this.currentLocation = JSON.parse(locationFromStorage)
    this.inspectionId = this.route.snapshot.params["id"];
    this.inspectionTitle = this.route.snapshot.params["title"];
    const localSection = JSON.parse(localstorageResponse)
    this.sections = localSection?.[this.inspectionId]
    this.sections.forEach((i) => {
      this.totalQuestionPerItem = {
        ...this.totalQuestionPerItem,
        [i?.sectionId]: parseInt(i?.questionsCount)
      }
      this.totalQuestions += parseInt(i?.questionsCount)
    })
  }

  onBlurInput(event: any, input: any, item: any): void {
    const formData = new FormData();
    formData.append("apiKey", this.gtsService.apiKey);
    formData.append("domainId", this.gtsService.domainId);
    formData.append("userId", this.gtsService.userId);
    formData.append("gtsId", item?.gstId);
    formData.append("procedureId", item.ProcedureID);
    formData.append("processId", item.ProcessID);
    formData.append("contentId", item.id);
    formData.append("instructionType", item.InstructionType);
    formData.append("userInput", input?.userInput);
    formData.append("isLastProcess", "0");
    formData.append("workstreamId", "1");
    formData.append("isFrameCutOffProcess", "0");
    formData.append("userInputId", input?.id);
    formData.append("userActionValue", event.target.value);
    this.gtsService.updateInputRuntimeBlur(formData).subscribe(
      (res: any) => {
        console.log(" ==== Input blur API ===> ", res);
      },
      (error) => {
        console.log(" ==== Input blur API ===> ", error);
      }
    );
  }

  ngOnInit() {
    this.getData();
    localStorage.setItem(
      LOCALSTORAGE.CURRENT_SECTION_INSTRUCTIONS,
      JSON.stringify({})
    );
  }

  getPerItemPercentage(item: any) {
    const percentage =
      ((this.completedQuestionsPerItem?.[item.sectionId] ?? 0) /
        (this.totalQuestionPerItem?.[item.sectionId] ?? 0)) *
      100;
    return this.completedQuestionsPerItem?.[item.sectionId] &&
      this.totalQuestionPerItem?.[item.sectionId]
      ? percentage.toFixed(0)
      : 0;
  }

  onFileAttachment(event: Event, item: any) {
    const itemId: any = item?.id;
    const target: any = event.target as HTMLInputElement;
    const file = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      const base64 = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${reader.result}`
      );
      this.attachmentFiles = {
        ...this.attachmentFiles,
        [itemId]: [...(this.attachmentFiles?.[itemId] ?? []), base64],
      };
      const formData = new FormData();

      formData.append("apiKey", this.gtsService.apiKey);
      formData.append("domainId", this.gtsService.domainId);
      formData.append("userId", this.gtsService.userId);
      formData.append("uploadCount", "1");
      formData.append("uploadFlag", "true");
      formData.append("type", file?.type);
      formData.append("caption", "");
      formData.append("displayOrder", "1");
      formData.append("language", '["1"]');
      formData.append("dataId", item.id);
      formData.append("contentTypeId", item.ProcessID);
      formData.append("file", file);

      this.gtsService.uploadAttachmentForRuntime(formData).subscribe(
        (res) => {
          console.log(" === response ====> ", res);
        },
        (err) => {
          console.log(" === Error ====> ", err);
        }
      );
      // console.log(" ==== selected file ====", this.attachmentFiles);
    };
  }

  onDeleteAttachment(itemId, url) {
    this.attachmentFiles = {
      ...this.attachmentFiles,
      [itemId]: this.attachmentFiles?.[itemId].filter((i) => i !== url),
    };
  }

  onClickSection() {
    this.getData();
  }

  goBack() {
    this.router.navigate([`inspection/${this.inspectionId}`]);
  }

  onSubmitForm(actionId: any, item: any, index: any) {
    this.selected = {
      ...this.selected,
      [item?.id]: index,
    };
    const formData = new FormData();

    if (!this.startInspectionDate) {
      const now = Date.now();
      this.startInspectionDate = this.datePipe.transform(now, 'dd, MM, YYYY')
      console.log(" === startInspectionDate ====> ", this.startInspectionDate)
    }

    formData.append("apiKey", this.gtsService.apiKey);
    formData.append("domainId", this.gtsService.domainId);
    formData.append("userId", this.gtsService.userId);
    formData.append("gtsId", this.gstId || item?.gstId);
    formData.append("procedureId", item.ProcedureID);
    formData.append("processId", item.ProcessID);
    formData.append("contentId", item.id);
    formData.append("instructionType", item.InstructionType);
    formData.append("actionStatus", "1");
    formData.append("isLastProcess", "0");
    formData.append("workstreamId", "1");
    formData.append("isFrameCutOffProcess", "0");
    formData.append("previousProcessId", "0");

    this.completedQuestions += 1;

    this.completedQuestionsPerItem = {
      ...this.completedQuestionsPerItem,
      [item.ProcedureID]:
        (this.completedQuestionsPerItem?.[item.ProcedureID] ?? 0) + 1,
    };

    this.gtsService.updateActionRuntime(formData).subscribe(
      (res: any) => {
        console.log(" ==== response chck API ===> ", res);

      },
      (error) => {
        console.log(" ==== ERRPR chck API ===> ", error);
        this.completedQuestions = this.completedQuestions - 1;

        this.completedQuestionsPerItem = {
          ...this.completedQuestionsPerItem,
          [item.ProcedureID]:
            (this.completedQuestionsPerItem?.[item.ProcedureID] ?? 0) - 1,
        };
      }
    );
  }

  isEnableCameraIcon(inputs): boolean {
    return inputs.filter((i) => i?.userInput === "3").length > 0;
  }

  isSelected(itemId: any, index: number) {
    let className;
    if (this.selected?.[itemId] === 0 && index === 0) {
      className = "yes-sec yes-sec-selected";
    } else if (this.selected?.[itemId] === 1 && index === 1) {
      className = "yes-sec no-sec-selected";
    } else {
      className = "yes-sec";
    }
    return className;
  }

  isRenderActionInputSection(itemId: any) {
    return this.selected?.[itemId] === 1;
  }

  getData() {
    this.loading = true;
    const id = this.sections?.[this.classArr?.[0]]?.sectionId;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("procedureID", id);
    const getSectionfromLocalStorage = localStorage.getItem(LOCALSTORAGE.CURRENT_SECTION_INSTRUCTIONS)
    const currentSectionData = JSON.parse(getSectionfromLocalStorage)

    if (currentSectionData?.[id]) {
      this.infoData = currentSectionData?.[id]
      this.checksAction = {
        ...this.checksAction,
        [`${id}-${0}`]: this.infoData[0]?.['firstData']
      }
      this.loading = false;
    } else {
      this.gtsService.getprocessInfo(apiFormData).subscribe((res: any) => {
        this.loading = false;
        if (res.status === 'Success') {
          this.infoData = res.data
          this.checksAction = {
            ...this.checksAction,
            [`${id}-${0}`]: this.infoData[0]?.['firstData']
          }

          localStorage.setItem(
            LOCALSTORAGE.CURRENT_SECTION_INSTRUCTIONS,
            JSON.stringify({
              ...JSON.parse(getSectionfromLocalStorage),
              [id]: res.data
            })
          )
        }
      }, (error) => {
        this.loading = false;
        console.log(" ==== error ==== ", error)
      })
    }

    const firstInfoCheck = this.infoData[0]?.['firstData']?.[0]
    this.gstId = firstInfoCheck?.gstId ?? ''
    console.log(" ==== firstInfoCheck ==== ", firstInfoCheck, this.gstId)
  }

  updatePercentageOverall() {
    const allPercentages =
      (this.completedQuestions / this.totalQuestions) * 100;
    return allPercentages.toFixed(0);
  }

  leftSelection(item: any) {
    if (!this.classArr.includes(item)) {
      this.classArr = [];
      this.classArr.push(item);
      this.getData();
    }
  }

  openContentBox(innerId: number, outerId: number) {
    const id = `${innerId}-${outerId}`;
    if (!this.contentBox.includes(id)) {
      this.contentBox.push(id);
    } else {
      let index = this.contentBox.findIndex((res: any) => res == id);
      this.contentBox.splice(index, 1);
    }
  }

  openOuterContentBox(id: any, item: any) {
    this.updateSectionLoading(item, true)
    if (!this.outerContentBox.includes(id)) {
      this.outerContentBox.push(id);
    } else {
      let index = this.outerContentBox.findIndex((res: any) => res == id);
      this.outerContentBox.splice(index, 1);
    }
    const checkApiFormData = new FormData();
    checkApiFormData.append("apiKey", this.apiKey);
    checkApiFormData.append("procedureID", item.ProcedureID);
    checkApiFormData.append("ProcessID", item?.ProcessID);

    const getChecksfromLocalStorage = localStorage.getItem(LOCALSTORAGE.RUNTIME_CHECK_ACTIONS)
    const currentChecksData = JSON.parse(getChecksfromLocalStorage)
    if (currentChecksData?.[`${item.ProcedureID}-${id}`]) {
      this.checksAction = {
        ...this.checksAction,
        [`${item.ProcedureID}-${id}`]: currentChecksData?.[`${item.ProcedureID}-${id}`]
      }
      this.updateSectionLoading(item, false);
    } else {
      this.gtsService.getprocesschecksandactions(checkApiFormData).subscribe((res: any) => {
        if (res.status === "Success") {
          this.checksAction = {
            ...this.checksAction,
            [`${item.ProcedureID}-${id}`]: res.data
          }
          localStorage.setItem(LOCALSTORAGE.RUNTIME_CHECK_ACTIONS, JSON.stringify({
            ...this.checksAction,
            [`${item.ProcedureID}-${id}`]: res.data
          }));
          this.updateSectionLoading(item, false);
        }
      }, (err) => {
        this.updateSectionLoading(item, false)
        console.log(' ==== check api Error ==== ', err)
      })
    }
  }

  updateSectionLoading(item: any, value: boolean) {
    this.sectionLoading = {
      ...this.sectionLoading,
      [item?.ProcessID]: value
    }
  }

  updateUserInputLoading(key: any, value: boolean) {
    this.userInputLoading = {
      ...this.userInputLoading,
      [key]: value
    }
  }

  isUserInputShowLoading(ch: any) {
    const key = `${ch.ProcedureID}-${ch.ProcessID}-${ch.id}`
    return this.userInputLoading?.[key] || false
  }

  isShowSectionLoading(item: any) {
    return this.sectionLoading?.[item?.ProcessID] || false
  }

  returnChecksAction(item: any, index: any, type: string) {
    const returnResult = this.checksAction[`${item?.ProcedureID}-${index}`]
    return returnResult.filter((i) => i?.name === type)
  }

  returnChecksUserInputs(ch) {
    const returnResult = this.userInputData?.[`${ch.ProcedureID}-${ch.ProcessID}-${ch.id}`]
    return returnResult
  }
}
