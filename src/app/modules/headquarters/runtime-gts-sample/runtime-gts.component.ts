import { DatePipe, Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { Constant } from "src/app/common/constant/constant";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { ManageUserComponent } from "src/app/components/common/manage-user/manage-user.component";
import { CallsService } from "src/app/controller/calls.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { GtsService } from "src/app/services/gts/gts.service";
import { LOCALSTORAGE } from "src/app/utils/constants";
import { formatBytes } from "src/app/utils/helper";
import _ from "lodash";

@Component({
  selector: "app-gts-sample",
  templateUrl: "./runtime-gts.component.html",
  styleUrls: ["./runtime-gts.component.scss"],
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
  private dueDate: any = null;
  private followDate: any = {};
  private username: any = {};

  public currentInputValuesForExtra: any = {};

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
    const getCurrentInspectionStatusFromLocalStorage: string = localStorage.getItem(
      LOCALSTORAGE.CURRENT_RUNTIME_STATUS
    );

    const logoObj: string = localStorage.getItem('logoUrl')
    this.logoUrl = logoObj;

    if (getCurrentInspectionStatusFromLocalStorage != 'undefined') {
      this.currentInspectionStatus = JSON.parse(getCurrentInspectionStatusFromLocalStorage)
      this.startInspectionDate = this.currentInspectionStatus?.created_at
    }


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

    if (this.route.snapshot.params?.['gtsId']) {
      this.getInfoProgress();
      this.getInputValues();
    }

    //  for readonly view
    if (this.route.snapshot.params?.['readonly']) {
      this.readonly = true
    }



    this.countryId = localStorage.getItem('countryId');
  }

  inputRenderCssClasses(item: any) {
    return this.inputRequiredClass?.[item.id] ? true : false
  }

  inputRequiredCheckOnBlur(event: any, input: any) {
    if (event.target.value === "") {
      this.inputRequiredClass = {
        ...this.inputRequiredClass,
        [input.id]: true
      }
    } else {
      this.inputRequiredClass = {
        ...this.inputRequiredClass,
        [input.id]: false
      }
    }
  }

  inputLoaderCheck(id: any) {
    return this.inputItemLoader?.[id] ? this.inputItemLoader?.[id] : false
  }
  inputSuccessCheck(id: any) {
    return this.inputItemCheck?.[id] ? this.inputItemCheck?.[id] : false
  }

  onBlurInput(event: any, input: any, item: any, itemParent: any, index: any, parentInfo: any, outerIndex: any): void {
    const formData = new FormData();
    let gtsId = ""

    if (this.route.snapshot.params?.['gtsId']) {
      gtsId = this.route.snapshot.params?.['gtsId']
    } else {
      gtsId = item?.gstId
    }

    this.inputItemLoader = {
      ...this.inputItemLoader,
      [input.id]: true
    }
    this.inputItemCheck = {
      ...this.inputItemCheck,
      [input.id]: false
    }

    formData.append("apiKey", this.gtsService.apiKey);
    formData.append("domainId", this.gtsService.domainId);
    formData.append("userId", this.gtsService.userId);
    formData.append("gtsId", gtsId);
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
    formData.append("InstructionID", item?.InstructionID);

    this.inputValuesOnChange = {
      ...this.inputValuesOnChange,
      [`${item?.InstructionID}-${input?.id}`]: event.target.value
    }


    this.gtsService.updateInputRuntimeBlur(formData).subscribe(
      (res: any) => {
        this.inputItemLoader = {
          ...this.inputItemLoader,
          [input.id]: false
        }
        this.inputItemCheck = {
          ...this.inputItemCheck,
          [input.id]: true
        }

        setTimeout(() => {
          this.inputItemCheck = {
            ...this.inputItemCheck,
            [input.id]: false
          }
        }, 2000)

      },
      (error) => {
        console.log(" ==== Input blur API ===> ", error);
        this.inputItemLoader = {
          ...this.inputItemLoader,
          [input.id]: false
        }
      }
    );


    if (event.target.value) {
      console.log(" === calucaltor params ===>", itemParent?.actionOptions?.[0]?.id, itemParent, index, parentInfo, outerIndex, false)
      this.onSubmitForm(itemParent?.actionOptions?.[0]?.id, item, index, parentInfo, outerIndex, false)
    }

  }


  getInstructionInputValue(item: any, input: any) {
    const itemObj = this.currentInputState.find((i) => i?.ProcedureID === item?.ProcedureID && i?.ProcessID === item?.ProcessID)
    const inputObj = itemObj?.inputValue.find(i => i?.itemID === input?.id)
    const returnValue = this.inputValuesOnChange?.[`${item?.InstructionID}-${input?.id}`] ? this.inputValuesOnChange?.[`${item?.InstructionID}-${input?.id}`] : inputObj?.selectedValue ?? ''
    this.currentInputValuesForExtra = {
      ...this.currentInputValuesForExtra,
      [`${item?.id}-input`]: returnValue
    }
    return returnValue
  }

  ngOnInit() {

    localStorage.setItem(
      LOCALSTORAGE.CURRENT_SECTION_INSTRUCTIONS,
      JSON.stringify({})
    );
    setTimeout(() => { this.getData(); }, 100)
  }

  getPerItemPercentage(item: any) {
    let percentage = 0
    percentage =
      ((this.completedQuestionsPerItem?.[item.sectionId] ?? 0) /
        (this.totalQuestionPerItem?.[item.sectionId] ?? 0)) *
      100;

    if (percentage >= 100) {
      percentage = 100
    }

    return this.completedQuestionsPerItem?.[item.sectionId] &&
      this.totalQuestionPerItem?.[item.sectionId]
      ? percentage.toFixed(0)
      : 0;
  }

  onFileAttachment(event: Event, item: any, extraId: any = "") {
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
        [`${itemId}${extraId}`]: [...(this.attachmentFiles?.[itemId] ?? []), base64],
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
    const modalRef = this.modalService.open(ConfirmationComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      if (document.body.classList.contains("presets-popup")) {
        document.body.classList.remove("manage-popup-new");
      }
      modalRef.dismiss('Cross click');
      console.log(" === wind ==attachment ====> ", receivedService);
      if (receivedService) {
        if (url?.id) {
          const attachmentFormData = new FormData();
          attachmentFormData.append("attachment_id", url?.id);
          attachmentFormData.append("instruction_id", itemId);

          this.removedAttachments = [
            ...this.removedAttachments,
            url?.id
          ]
          this.gtsService.removeAttachmentForRuntime(attachmentFormData).subscribe((res) => {
            console.log(" ==== response =====> ", res);
          }, (err) => {
            console.log(" ==== error =====> ", err);
          })

        } else {
          this.attachmentFiles = {
            ...this.attachmentFiles,
            [itemId]: this.attachmentFiles?.[itemId].filter((i) => i !== url),
          };
        }
      }
    });

  }

  renderAttachment(attachments: any) {
    let filter: any = attachments.filter((i) => this.removedAttachments.indexOf(i?.id) === -1);
    const exists = Object.keys(this.attachmentFiles ?? {})
    filter = filter.filter((val: any) => !exists.includes(val.post_id));
    return filter
  }

  onClickSection() {
    this.getData();
  }

  goBack() {
    this.location.back();
  }

  onSubmitForm(actionId: any, item: any, index: any, parentInfo: any, outerIndex: any, isActionUpdate = true) {

    const actionsList = this.returnChecksAction(parentInfo, outerIndex, 'Action')
    const filteredActions = actionsList.filter((i: any) => i?.ProcessID == item?.ProcessID)
    const [inputList] = (filteredActions ?? []).map((i: any) => i?.userInputs)
    const requiredInputs = (inputList ?? []).filter((i: any) => i?.isRequired == 1)


    let inputValues = [];

    (this.currentInputState ?? []).filter((i: any) => i?.ProcessID == item?.ProcessID).forEach((i: any) => {
      inputValues = [...inputValues, ...i?.inputValue]
    })

    let calculatedValues: boolean = true

    requiredInputs.forEach((i: any) => {
      const itemInput: any = inputValues.find((n: any) => n?.itemID == i?.id)
      if (!itemInput?.selectedValue) {
        calculatedValues = false
      }
      if (this.inputValuesOnChange?.[`${itemInput?.InstructionID}-${itemInput?.itemID}`]) {
        calculatedValues = true
      }
    })

    if (index == 0) {
      calculatedValues = true
    }


    // console.log(" === calculatedValues ===> ", calculatedValues, this.inputValuesOnChange, item, parentInfo)

    this.selected = {
      ...this.selected,
      [item?.id]: index,
    };

    this.userActionTouched = {
      ...this.userActionTouched,
      [item?.id]: true,
    }
    const formData = new FormData();

    const now: any = Date.now();
    if (!this.startInspectionDate) {
      this.startInspectionDate = this.datePipe.transform(now, 'mediumDate')
    }

    let gtsId = ""

    if (this.route.snapshot.params?.['gtsId']) {
      gtsId = this.route.snapshot.params?.['gtsId']
    } else {
      gtsId = item?.gstId
    }

    formData.append("apiKey", this.gtsService.apiKey);
    formData.append("domainId", this.gtsService.domainId);
    formData.append("userId", this.gtsService.userId);
    formData.append("gtsId", gtsId);
    formData.append("procedureId", item.ProcedureID);
    formData.append("processId", item.ProcessID);
    formData.append("contentId", item.id);
    formData.append("instructionType", item.InstructionType);
    formData.append("currentState", actionId);
    formData.append("actionStatus", "1");
    formData.append("isLastProcess", "0");
    formData.append("workstreamId", "1");
    formData.append("isFrameCutOffProcess", "0");
    formData.append("previousProcessId", "0");


    // if (!this.completedQuestionsPerItem?.[item.ProcedureID]) {
    if (calculatedValues) {
      if (!this.alreadyAnswered?.[`${parentInfo.ProcedureID}-${item.id}`]) {
        this.completedQuestions += 1;
        this.completedQuestionsPerItem = {
          ...this.completedQuestionsPerItem,
          [item.ProcedureID]:
            (this.completedQuestionsPerItem?.[item.ProcedureID] ?? 0) + 1,
        };
      }
    }

    if (isActionUpdate) {
      this.gtsService.updateActionRuntime(formData).subscribe(
        (res: any) => {
          console.log(" ==== response chck API ===> ", res);

        },
        (error) => {
          console.log(" ==== ERRPR chck API ===> ", error);
          if (!this.completedQuestionsPerItem?.[item.ProcedureID]) {
            this.completedQuestions = this.completedQuestions - 1;
            this.completedQuestionsPerItem = {
              ...this.completedQuestionsPerItem,
              [item.ProcedureID]:
                (this.completedQuestionsPerItem?.[item.ProcedureID] ?? 0) - 1,
            };
          }

        }
      );
    }



    // Condtion if already data is available for this procedureId and instruction
    // START
    if (!this.alreadyAnswered?.[`${parentInfo.ProcedureID}-${item.id}`]) {
      let exitStatus = '4'
      const per =
        (this.completedQuestions / this.totalQuestions) * 100;

      if (per === 100) {
        exitStatus = '1'
      }

      const inspectionStatusForm = new FormData();
      inspectionStatusForm.append('gtsId', gtsId)
      inspectionStatusForm.append('exitStatus', exitStatus)
      inspectionStatusForm.append('progress', this.updatePercentageOverall())
      inspectionStatusForm.append('locationId', this.route.snapshot.params['locationId'])
      inspectionStatusForm.append('inspectionId', this.inspectionId)
      inspectionStatusForm.append('section_json', JSON.stringify(this.completedQuestionsPerItem))
      this.gtsService.gtsUpdateInspectionStatus(inspectionStatusForm).subscribe(
        (res: any) => {
          console.log(" ==== insepection status ===> ", res);
        },
        (error) => {
          console.log(" ==== insepection status error ===> ", error);
        }
      )
    }
    // END


    //  ============================
    const infoProgressStatus = new FormData();

    if (calculatedValues) {
      if (!this.alreadyAnswered?.[`${parentInfo.ProcedureID}-${item.id}`]) {
        this.totalInfoChecksAnswered = {
          ...this.totalInfoChecksAnswered,
          [`${parentInfo.ProcedureID}-${outerIndex}`]: {
            ...this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`],
            totalPerform: (this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.totalPerform ?? 0) + 1,
            ...index === 0 ? {
              yes: (this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.yes ?? 0) + 1
            } : {
              no: (this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.no ?? 0) + 1
            }
          }
        }
      }
    }


    this.alreadyAnswered = {
      ...this.alreadyAnswered,
      [`${parentInfo.ProcedureID}-${item.id}`]: true
    }

    const totalChecks = (this.checksAction?.[`${parentInfo.ProcedureID}-${outerIndex}`] ?? []).filter(i => i?.name === 'Check')
    const notPerformes: any = (totalChecks.length) - (this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`].totalPerform)
    const totalAns = this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.totalPerform ?? 0

    let allPercentages: any = 0
    if (totalAns > 0) {
      allPercentages = (totalAns / totalChecks.length) * 100;
      if (allPercentages >= 100) {
        allPercentages = 100
      }
    } else {
      allPercentages = 0
    }

    let totalCompliance: any = 0
    const totalAnsYes = this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.yes ?? 0
    if (totalAns > 0) {
      totalCompliance = (totalAnsYes / totalAns) * 100;
      if (totalCompliance >= 100) {
        totalCompliance = 100
      }
    } else {
      totalCompliance = 0
    }

    this.totalInfoChecksAnswered = {
      ...this.totalInfoChecksAnswered,
      [`${parentInfo.ProcedureID}-${outerIndex}`]: {
        ...this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`],
        compliance: totalCompliance
      }
    }


    infoProgressStatus.append('procedureId', parentInfo.ProcedureID)
    infoProgressStatus.append('InstructionID', parentInfo.id)
    infoProgressStatus.append('gtsno', item?.gstId)
    infoProgressStatus.append('inspection_id', this.inspectionId)
    infoProgressStatus.append('total_checks', totalChecks.length)
    infoProgressStatus.append('total_answered', totalAns)
    infoProgressStatus.append('total_yes', this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.yes ?? 0)
    infoProgressStatus.append('total_no', this.totalInfoChecksAnswered?.[`${parentInfo.ProcedureID}-${outerIndex}`]?.no ?? 0)
    infoProgressStatus.append('total_not_answered', notPerformes)
    infoProgressStatus.append('compliance_per', totalCompliance)
    infoProgressStatus.append('completion_per', allPercentages)

    this.gtsService.gtsUpdateInfoStatus(infoProgressStatus).subscribe((res) => {
      console.log(" ==== =info ===> ", res)
    }, (err) => {
      console.log(" ==== = error ===> ", err)
    })

  }

  getInfoPercentage(val: any, outerIndex: any) {
    const totalChecksObj = (this.checksAction?.[`${val.ProcedureID}-${outerIndex}`] ?? []).filter(i => i?.name === 'Check')
    const totalAns = this.totalInfoChecksAnswered?.[`${val.ProcedureID}-${outerIndex}`]?.totalPerform ?? 0

    const returnResult = (this.checksAction?.[`${val.ProcedureID}-${outerIndex}`] ?? [])
    const a = returnResult
    console.log(" === returnResult ===> ", returnResult)
    let renderActions = []

    _.uniq(a).forEach((i: any) => {
      if (a.filter((n: any) => n?.ProcessID == i?.ProcessID).length == 1 && returnResult.length > 1) {
        renderActions.push(i)
      }
    })

    const renderNewChecks = renderActions.map((i: any) => ({ ...i, name: 'Check' }))
    let updatedChecks = (renderNewChecks ?? []).filter((i) => i?.name === 'Check')

    const totalChecks = [...updatedChecks, ...totalChecksObj]

    console.log(" ===== new extra wind =====> ", totalChecks)

    // console.log(" ====outerIndex percetnwind ===> ", outerIndex, this.totalInfoChecksAnswered?.[`${val.ProcedureID}-${outerIndex}`])

    let allPercentages = 0
    let totalChecksLength = 0

    if (totalChecks.length === 0) {
      totalChecksLength = this.totalInfoChecksAnswered?.[`${val.ProcedureID}-${outerIndex}`]?.total_checks ?? 0
    } else {
      totalChecksLength = totalChecks.length
    }

    if (totalAns > 0) {
      allPercentages = (totalAns / totalChecksLength) * 100;
      if (allPercentages >= 100) {
        allPercentages = 100
      }
    } else {
      allPercentages = 0
    }
    return isNaN(allPercentages) ? 0 : allPercentages.toFixed(0);
  }


  isEnableCameraIcon(inputs): boolean {
    return inputs.filter((i) => i?.userInput === "3").length > 0;
  }

  isSelected(item: any, index: number, actionItem: any) {
    let className;
    const itemId = item.id;
    if (this.selected?.[itemId] === 0 && index === 0) {
      className = "yes-sec yes-sec-selected";
    } else if (this.selected?.[itemId] === 1 && index === 1) {
      className = "yes-sec no-sec-selected";
    } else if (this.getCurrentInputState(item, actionItem) && index === 0 && !this.userActionTouched?.[itemId]) {
      className = "yes-sec yes-sec-selected";
      this.selected = {
        ...this.selected,
        [item?.id]: index,
      };
    } else if (this.getCurrentInputState(item, actionItem) && index === 1 && !this.userActionTouched?.[itemId]) {
      className = "yes-sec no-sec-selected";
      this.selected = {
        ...this.selected,
        [item?.id]: index,
      };
    }
    else {
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
    if (this.route.snapshot.params?.['gtsId']) {
      apiFormData.append("gtsId", this.route.snapshot.params?.['gtsId']);
    }

    if (this.gstId) {
      apiFormData.append("gtsId", this.gstId);
    }

    const getSectionfromLocalStorage = "{}" //localStorage.getItem(LOCALSTORAGE.CURRENT_SECTION_INSTRUCTIONS)
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


        if (res.status === 'Success') {
          this.infoData = res.data
          this.checksAction = {
            ...this.checksAction,
            [`${id}-${0}`]: this.infoData[0]?.['firstData']
          }

          this.gstId = this.infoData[0]?.['firstData'][0]?.gstId
          console.log(" ===== gtsID wind ===> ", this.gstId)
          localStorage.setItem(
            LOCALSTORAGE.CURRENT_SECTION_INSTRUCTIONS,
            JSON.stringify({
              ...JSON.parse(getSectionfromLocalStorage),
              [id]: res.data
            })
          )
        }

        // =================================================================
        this.infoProgressFromApi.filter(i => i?.procedureId == id).forEach((item, outerIndex) => {
          this.totalInfoChecksAnswered = {
            ...this.totalInfoChecksAnswered,
            [`${item.procedureId}-${outerIndex}`]: {
              totalPerform: parseInt(item?.total_answered),
              yes: parseInt(item?.total_yes),
              no: parseInt(item?.total_no),
              total_checks: parseInt(item?.total_checks)
            }
          }
        })
        console.log(" ==== this.infoProgressFromApi 494 === asdasasdasd ===> ", this.infoProgressFromApi, this.totalInfoChecksAnswered)
        // =================================================================
        this.loading = false;
      }, (error) => {
        this.loading = false;
        console.log(" ==== error ==== ", error)
      })
    }

  }

  getInfoProgress() {
    this.loading = true;
    const infoFormData = new FormData();
    const ins_id = this.route.snapshot.params["id"]
    const gtsId = this.route.snapshot.params?.['gtsId']
    infoFormData.append('inspection_id', ins_id)
    infoFormData.append('gtsno', gtsId)

    this.gtsService.getInfoProgress(infoFormData).subscribe((res) => {
      if (res.code == "Success") {
        (res?.data ?? []).forEach((item: any) => {
          this.completedQuestions += parseInt(item?.total_answered)
          this.completedQuestionsPerItem = {
            ...this.completedQuestionsPerItem,
            [item.procedureId]:
              (this.completedQuestionsPerItem?.[item.procedureId] ?? 0) + parseInt(item?.total_answered),
          };
        })

        this.infoProgressFromApi = (res?.data ?? [])
        console.log(" ====  this.infoProgressFromApi  ====> ", this.infoProgressFromApi)
      }
    }, (err) => {
      console.log(" ==== err info progress ====> ", err)
    })
  }

  getInputValues() {
    const statusFormData = new FormData()
    statusFormData.append('gtsno', this.route.snapshot.params['gtsId']);
    this.loading = true;
    this.gtsService.apiGetruntimeUserInputs(statusFormData).subscribe((response) => {
      if (response.code === 'Success') {
        this.currentInputState = response.data
        this.currentInputState?.forEach((i: any) => {
          this.alreadyAnswered = {
            ...this.alreadyAnswered,
            [`${i.ProcedureID}-${i.InstructionID}`]: true
          }
        })
      }
      this.loading = false;
    }, (error: any) => {
      console.log(" ==== error 338 ==> ", error)
      this.loading = false;
    })
    // END
  }

  getCurrentInputState(item: any, actionButtonId: any) {
    const currentValue: any = this.currentInputState.find((i: any) => i?.InstructionID === item?.id && i?.ProcessID === item?.ProcessID)
    return actionButtonId == currentValue?.currentState
  }

  updatePercentageOverall() {
    const allPercentages =
      (this.completedQuestions / this.totalQuestions) * 100;
    return allPercentages >= 100 ? '100' : allPercentages.toFixed(0);
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
    if (this.route.snapshot.params?.['gtsId']) {
      checkApiFormData.append("gtsId", this.route.snapshot.params?.['gtsId']);
    }

    if (this.gstId) {
      checkApiFormData.append("gtsId", this.gstId);
    }

    const getChecksfromLocalStorage = localStorage.getItem(LOCALSTORAGE.RUNTIME_CHECK_ACTIONS)
    const currentChecksData = {}//JSON.parse(getChecksfromLocalStorage)
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
    //   if (currentChecksData?.[`${item.ProcedureID}-${id}`]) {
    //     this.checksAction = {
    //       ...this.checksAction,
    //       [`${item.ProcedureID}-${id}`]: currentChecksData?.[`${item.ProcedureID}-${id}`]
    //     }
    //     this.updateSectionLoading(item, false);
    //   } else {
    // //  
    //   }
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

  renderExtraAction(item: any, index: any, type: string) {
    const returnResult = this.checksAction[`${item?.ProcedureID}-${index}`]
    const a = returnResult
    // console.log(" === returnResult ===> ", returnResult)
    let renderActions = []

    _.uniq(a).forEach((i: any) => {
      if (a.filter((n: any) => n?.ProcessID == i?.ProcessID).length == 1 && returnResult.length > 1 && i?.name != "Check") {
        renderActions.push(i)
      }
    })

    const renderNewChecks = renderActions.map((i: any) => ({ ...i, name: 'Check' }))
    let updatedChecks = (renderNewChecks ?? []).filter((i) => i?.name === type)
    return this.unique(updatedChecks, ['name', 'ProcessID'])
  }

  unique = (arr, props = []) => [...new Map(arr.map(entry => [props.map(k => entry[k]).join('|'), entry])).values()];

  returnChecksAction(item: any, index: any, type: string) {
    const returnResult = this.checksAction[`${item?.ProcedureID}-${index}`]
    return (returnResult ?? []).filter((i) => i?.name === type)
  }


  returnsAction(item: any, val: any) {
    return item?.ProcessID == val?.ProcessID;
  }

  returnChecksUserInputs(ch) {
    const returnResult = this.userInputData?.[`${ch.ProcedureID}-${ch.ProcessID}-${ch.id}`]
    return returnResult
  }

  assignContact(selectedItem: any, overAllItem: any, inputId: any) {
    this.modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 157);
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
    };
    let techSupportUserId = [];

    this.modalRef.componentInstance.access = "dekraUsers";
    // if (this.selectedContactUsers) {
    //   modalRef.componentInstance.selectedList = [JSON.parse(JSON.stringify(this.selectedContactUsers))];
    // }
    this.modalRef.componentInstance.accessTitle = "Contact at Location";
    this.modalRef.componentInstance.userType = "customer"
    this.modalRef.componentInstance.apiData = apiData;
    this.modalRef.componentInstance.height = innerHeight;
    this.modalRef.componentInstance.action = '';
    this.modalRef.componentInstance.singleUser = true;
    this.modalRef.componentInstance.escalationFlag = false;
    this.modalRef.componentInstance.selectedUsers = techSupportUserId;
    this.modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      this.modalRef.dismiss('Cross click');
      if (receivedService && receivedService.length > 0) {
        this.selectedContactUsers = {
          ...this.selectedContactUsers,
          [inputId?.id]: receivedService[0]
        };
        this.assignUserChange(selectedItem, overAllItem, this.selectedContactUsers?.[inputId?.id], inputId)
      }
    });
  }

  assignUserChange(item: any, overAllItem: any, username: any, inputId: any) {
    const jsObj = JSON.parse(overAllItem)

    const valueOwner = (inputId?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == item?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}

    const updatedPayload = jsObj.map((i: any) => item?.id == i?.id ? ({
      ...item,
      ...updateValues,
      ...this.dueDate?.[item?.id] && {
        dueDate: this.dueDate?.[item?.id]
      },
      ...this.followDate?.[item?.id] && {
        followUpDate: this.followDate?.[item?.id]
      },
      username: username?.userName
    }) : i)

    this.username = {
      ...this.username,
      [item?.id]: username?.userName
    }

    const assigFormData = new FormData();

    let apiData = {
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
    };

    const procedureId = inputId?.ProcedureID
    const processId = inputId?.ProcessID
    const domainId = apiData?.domainId
    const userId = apiData?.userId
    const gtsId = inputId?.gstId
    const InstructionID = inputId?.InstructionID
    const assign_owner = updatedPayload?.[0]
    const assign_owner_id = updatedPayload?.[0]?.id

    assigFormData.append('procedureId', procedureId)
    assigFormData.append('processId', processId)
    assigFormData.append('domainId', domainId)
    assigFormData.append('userId', userId)
    assigFormData.append('gtsId', gtsId)
    assigFormData.append('InstructionID', InstructionID)
    assigFormData.append('assign_owner', JSON.stringify(assign_owner))
    assigFormData.append('assign_owner_id', assign_owner_id)

    this.gtsService.updateInputOwnerRuntime(assigFormData).subscribe((res: any) => {
      console.log(" ==== response ====> ", res)
    }, (err: any) => {
      console.log(" ==== error ====> ", err)
    })

  }

  validateAssignUserDate(item: any, overAllItem: any, inputId: any, date: any) {
    this.assignUserDate = {
      ...this.assignUserDate,
      [inputId?.id]: date.target.value
    }

    const jsObj = JSON.parse(overAllItem)

    const valueOwner = (inputId?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == item?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}

    console.log(" ==== updateValues === ", updateValues)

    const updatedPayload = jsObj.map((i: any) => item?.id == i?.id ? ({
      ...item,
      ...updateValues,
      ...this.username?.[item?.id] && {
        username: this.username?.[item?.id]
      },
      ...this.followDate?.[item?.id] && {
        followUpDate: this.followDate?.[item?.id]
      },
      dueDate: date.target.value
    }) : i)

    console.log(" ==== updatedPayload === ", updatedPayload)

    this.dueDate = {
      ...this.dueDate,
      [item?.id]: date.target.value
    }

    const assigFormData = new FormData();
    let apiData = {
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
    };

    const procedureId = inputId?.ProcedureID
    const processId = inputId?.ProcessID
    const domainId = apiData?.domainId
    const userId = apiData?.userId
    const gtsId = inputId?.gstId
    const InstructionID = inputId?.InstructionID
    const assign_owner = updatedPayload?.[0]
    const assign_owner_id = updatedPayload?.[0]?.id

    assigFormData.append('procedureId', procedureId)
    assigFormData.append('processId', processId)
    assigFormData.append('domainId', domainId)
    assigFormData.append('userId', userId)
    assigFormData.append('gtsId', gtsId)
    assigFormData.append('InstructionID', InstructionID)
    assigFormData.append('assign_owner', JSON.stringify(assign_owner))
    assigFormData.append('assign_owner_id', assign_owner_id)

    this.gtsService.updateInputOwnerRuntime(assigFormData).subscribe((res: any) => {
      console.log(" ==== response ====> ", res)
    }, (err: any) => {
      console.log(" ==== error ====> ", err)
    })
  }

  validateAssignUserFollowDate(item: any, overAllItem: any, inputId: any, date: any) {
    this.assignUserFollowDate = {
      ...this.assignUserFollowDate,
      [inputId?.id]: date.target.value
    }


    const valueOwner = (inputId?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == item?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}


    const jsObj = JSON.parse(overAllItem)
    const updatedPayload = jsObj.map((i: any) => item?.id == i?.id ? ({
      ...item,
      ...updateValues,
      ...this.username?.[item?.id] && {
        username: this.username?.[item?.id]
      },
      ...this.dueDate?.[item?.id] && {
        dueDate: this.dueDate?.[item?.id]
      },
      followUpDate: date.target.value
    }) : i)

    this.followDate = {
      ...this.followDate,
      [item?.id]: date.target.value
    }

    const assigFormData = new FormData();
    let apiData = {
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
    };

    const procedureId = inputId?.ProcedureID
    const processId = inputId?.ProcessID
    const domainId = apiData?.domainId
    const userId = apiData?.userId
    const gtsId = inputId?.gstId
    const InstructionID = inputId?.InstructionID
    const assign_owner = updatedPayload?.[0]
    const assign_owner_id = updatedPayload?.[0]?.id

    assigFormData.append('procedureId', procedureId)
    assigFormData.append('processId', processId)
    assigFormData.append('domainId', domainId)
    assigFormData.append('userId', userId)
    assigFormData.append('gtsId', gtsId)
    assigFormData.append('InstructionID', InstructionID)
    assigFormData.append('assign_owner', JSON.stringify(assign_owner))
    assigFormData.append('assign_owner_id', assign_owner_id)

    this.gtsService.updateInputOwnerRuntime(assigFormData).subscribe((res: any) => {
      console.log(" ==== response ====> ", res)
    }, (err: any) => {
      console.log(" ==== error ====> ", err)
    })
  }

  renderAssignUsername(assignUser: any, itemAct: any) {

    const valueOwner = (itemAct?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == assignUser?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}
    console.log(" ==== itemAct ====> ", updateValues)
    return this.selectedContactUsers?.[itemAct?.id] ?
      this.selectedContactUsers?.[itemAct?.id]?.userName : updateValues?.username ? updateValues?.username : 'Assign User'
  }

  trackAssignUsername(index: number, item: any) {
    return item.id + index;
  }

  renderAssignUserInput(json: any, itemAct: any) {
    const jsonObj = (json ? JSON.parse(json) : [])
    return jsonObj
  }

  getAssignInputValue(itemAct: any, assignUser: any) {
    const valueOwner = (itemAct?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == assignUser?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}
    return (this.assignUserDate?.[itemAct?.id] || updateValues?.dueDate) ?? ''
  }

  getAssignInputValueFollowDate(itemAct: any, assignUser: any) {
    const valueOwner = (itemAct?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == assignUser?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}
    return (this.assignUserFollowDate?.[itemAct?.id] || updateValues?.followUpDate) ?? ''
  }

  fileSizeFormat(size: any) {
    return formatBytes(size)
  }

  // EXTRA ACTIION as Parent Methods START ===========>
  isRenderExtraActionComplete(item: any) {
    let className;
    const itemId = item.id;
    className = "yes-sec";

    if (
      this.currentInputValuesForExtra?.[`${itemId}-input`]
    ) {
      className = "yes-sec yes-sec-selected";
    }

    return className;
  }

  extrarenderAssignUsername(assignUser: any, itemAct: any) {
    const valueOwner = (itemAct?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == assignUser?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}
    const returnValue = this.selectedContactUsers?.[itemAct?.id] ?
      this.selectedContactUsers?.[itemAct?.id]?.userName : updateValues?.username ? updateValues?.username : 'Assign User'
    this.currentInputValuesForExtra = {
      ...this.currentInputValuesForExtra,
      [`${itemAct?.id}-assign-username`]: returnValue
    }
    return returnValue
  }

  extragetAssignInputValue(itemAct: any, assignUser: any) {
    const valueOwner = (itemAct?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == assignUser?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}
    const returnValue = (this.assignUserDate?.[itemAct?.id] || updateValues?.dueDate) ?? ''
    this.currentInputValuesForExtra = {
      ...this.currentInputValuesForExtra,
      [`${itemAct?.id}-assign-date`]: returnValue
    }
    return returnValue
  }

  extragetAssignInputValueFollowDate(itemAct: any, assignUser: any) {
    const valueOwner = (itemAct?.ownerValues ?? []).find((i: any) => i?.assign_owner_id == assignUser?.id)
    const updateValues = valueOwner ? JSON.parse(valueOwner?.assign_owner) : {}
    const returnValue = (this.assignUserFollowDate?.[itemAct?.id] || updateValues?.followUpDate) ?? ''
    this.currentInputValuesForExtra = {
      ...this.currentInputValuesForExtra,
      [`${itemAct?.id}-assign-follow-date`]: returnValue
    }
    return returnValue
  }
  // EXTRA ACTIION as Parent Methods END ===========>
}
