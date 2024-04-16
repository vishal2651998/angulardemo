import { Component, HostListener, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.scss']
})
export class AddInspectionComponent implements OnInit {
  public bodyHeight: number;
  public innerHeight: number;
  public scrollPos: any = 0;
  public sconfig: PerfectScrollbarConfigInterface = {};
  userId: any;
  dekraNetworkId: any = "";
  user: any
  countryId;
  public apiKey: string = Constant.ApiKey;
  public domainId;
  public item;
  networkName: string = ""
  public bodyElem;
  public loading: boolean = false;
  public templateSelect = [];
  public templateSelectedId = [];
  public templateSelectedName = [];
  public selectedShops = [];
  public tagSelectedId = [];
  public tagSelectedName = [];

  public typeOption = [];

  public condOption = [];
  public completeOption = [];
  inspectionForm = this.formBuilder.group({})
  imageData: any;
  networkList: any = [];
  selectedNetworkId: boolean = false;
  public selectedLocationsFlag: boolean = false;
  public selectedLocationsDisplay: boolean = false;
  public selectNetworkName: string = '';
  public selectNetworkId: string = '';
  public selectionData: any = [];
  public typesList: any[] = [];
  startDate
  submitted = false;
  today = new Date()
  editId: string | Blob;
  isPublished: any = "1";
  selectedType: any;
  selectedTitle: any = "";
  templateData: any = {};
  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(private modalService: NgbModal, private activeRoute: ActivatedRoute, private modalConfig: NgbModalConfig, public headQuarterService: HeadquarterService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private headquarterService: HeadquarterService,
    private titleService: Title,) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = 'dialog-centered';

    this.titleService.setTitle(
      localStorage.getItem("platformName") + " -New Audit/Inspection"
    );
    this.initForm();

  }

  ngOnInit(): void {
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';
    if (this.activeRoute.snapshot && this.activeRoute.snapshot.params && this.activeRoute.snapshot.params.id) {
      this.editId = this.activeRoute.snapshot.params.id;
    }
    this.getNetworkList();
    this.getCommonDataList('19');
    setTimeout(() => {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
    }, 1000);


    this.typeOption = [
      {
        "id": 3,
        "name": "Assessment",
        "domainId": 0
      },
      {
        "id": 2,
        "name": "Inspections",
        "domainId": 0
      },
      {
        "id": 1,
        "name": "Audit",
        "domainId": 0
      }
    ];


    this.condOption = [
      {
        "id": "Monthly",
        "name": "Monthly",
        "domainId": 0
      },
      {
        "id": "Twice a year",
        "name": "Twice a year",
        "domainId": 0
      },
      {
        "id": "Annual",
        "name": "Annual",
        "domainId": 0
      }
    ];

    this.completeOption = [
      {
        "id": "1 Month",
        "name": "1 Month",
        "domainId": 0
      },
      {
        "id": "2 Months",
        "name": "2 Months",
        "domainId": 0
      }, {
        "id": "3 Months",
        "name": "3 Months",
        "domainId": 0
      }, {
        "id": "4 Months",
        "name": "4 Months",
        "domainId": 0
      }, {
        "id": "5 Months",
        "name": "5 Months",
        "domainId": 0
      }, {
        "id": "6 Months",
        "name": "6 Months",
        "domainId": 0
      }, {
        "id": "7 Months",
        "name": "7 Months",
        "domainId": 0
      }, {
        "id": "8 Months",
        "name": "8 Months",
        "domainId": 0
      }, {
        "id": "9 Months",
        "name": "9 Months",
        "domainId": 0
      }, {
        "id": "10 Months",
        "name": "2 Months",
        "domainId": 0
      }, {
        "id": "11 Months",
        "name": "11 Months",
        "domainId": 0
      },
      {
        "id": "12 Months",
        "name": "12 Months",
        "domainId": 0
      }
    ];

    if (this.editId) {
      this.getInspectionData()
    }


  }

  initForm() {
    this.inspectionForm = this.formBuilder.group({
      typeId: ["", [Validators.required]],
      title: ["", [Validators.required]],
      networkId: [0, [Validators.required]],
      templates: ["", [Validators.required]],
      inspectionTime: [""],
      totalTime: [""],
      startDate: [""],
      completionDeadline: [""],
      dekraOwner: [""],
      customerOwner: [""],
      tags: [""],
    })

    this.inspectionForm.controls["typeId"].valueChanges.subscribe(e => {
      this.selectedType = this.typesList.find(t => t.id == e)?.name;
    })

    this.inspectionForm.controls["title"].valueChanges.subscribe(e => {
      this.selectedTitle = e;
    })

    this.inspectionForm.controls["startDate"].valueChanges.subscribe(e => {
      this.startDate = e;
      if (e) {
        this.inspectionForm.controls["completionDeadline"].enable();
      } else {
        this.inspectionForm.controls["completionDeadline"].disable();
      }

      if (e > this.inspectionForm.controls["completionDeadline"].value) {
        this.inspectionForm.controls["completionDeadline"].setValue("")
      }
    })


  }

  getTemplateData(id) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("limit", "10");
    apiFormData.append("offset", "0");
    apiFormData.append("id", id);
    apiFormData.append("networkId", this.user.networkId.toString());

    this.headQuarterService.getTemplateList(apiFormData).subscribe((response: any) => {
      if (response && response.items && response.items.length > 0) {
        this.templateData = response.items
        this.templateSelect = [];
        this.templateSelectedId = [];
        this.templateSelectedName = [];
        let items = this.templateData;
        for (let t in items) {
          let chkIndex = this.templateSelectedId.findIndex(
            (option) => option == items[t].id
          );
          if (chkIndex < 0) {
            this.templateSelectedId.push(items[t].id);
            this.templateSelectedName.push(items[t].title);
            this.templateSelect.push({
              id: items[t].id.toString(),
              name: items[t].title.toString(),
              secs: items[t].sectionsCount,
              qs: items[t].questionsCount
            });
          }
        }
      }
    })

  }

  deleteLogo() {
    this.imageData = ""
  }

  uploadLogo() {
    const modalRef = this.modalService.open(ImageCropperComponent, { size: 'md' });
    modalRef.componentInstance.type = "Add";
    modalRef.componentInstance.profileType = "add-inspection";
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.id = "";
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        this.imageData = receivedService;
        modalRef.dismiss('Cross click');
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    // headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    this.innerHeight = (this.bodyHeight - (headerHeight + 110));
    console.log(this.innerHeight);

  }

  submit(type) {
    switch (type) {
      case 'cancel':
        this.submitCancel();
        break;
      case 'draft':
        this.submitForm(type);
        break;
      case 'publish':
        this.submitForm(type);
        break;
      default:
        break;
    }
  }

  getInspectionData() {

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("limit", "10");
    apiFormData.append("offset", "0");
    apiFormData.append("id", this.editId);
    apiFormData.append("networkId", this.user.networkId.toString());
    this.loading = true;
    this.headQuarterService.getInspectionList(apiFormData).subscribe((response: any) => {
      // this.loading = false;
      this.loading = false;
      if (response && response.items && response.items.length > 0) {
        // if(!response.items[0].gtsImg.includes("gts-placeholder"))
        if (response.items[0].logoUrl && response.items[0].logoImageName) {
          this.imageData = { logoUrl: response.items[0].logoUrl, logoImageName: response.items[0].logoImageName }
        }
        if (response.items[0]["isPublished"]) {
          this.isPublished = response.items[0]["isPublished"];
        }

        if (response.items[0]["startDate"] == '0000-00-00 00:00:00') {
          response.items[0]["startDate"] = ""
        }

        if (response.items[0]["completionDeadline"] == '0000-00-00 00:00:00') {
          response.items[0]["completionDeadline"] = ""
        }

        if (response.items[0]["networkId"]) {
          response.items[0]["networkId"] = Number(response.items[0]["networkId"]);
        }

        if (response.items[0]["typeId"]) {
          response.items[0]["typeId"] = Number(response.items[0]["typeId"]);
        }

        if (response.items[0]["typeName"]) {
          this.selectedType = response.items[0]["typeName"];
        }

        if (response.items[0].tagsInfo && response.items[0].tagsInfo.length > 0) {
          response.items[0]?.tagsInfo.forEach(e => {
            this.tagSelectedId.push(e?.id);
            this.tagSelectedName.push(" " + e?.name);
          })
        }

        if (response.items[0]?.locations && response.items[0]?.locations.length > 0) {
          response.items[0]?.locations.forEach(e => {
            this.selectedShops.push({ id: e });
          })
        }

        if (this.selectedShops && this.selectedShops.length > 0) {
          this.saveData(this.selectedShops);
        }

        if (response.items[0].templates && response.items[0].templates.length > 0) {
          response.items[0].templates = response.items[0]?.templates.map(e => {
            this.templateSelectedId.push(e?.id);
            this.templateSelectedName.push(e?.title);
            return e.id
          })
        }


        if (response.items[0].templates && response.items[0].templates.length > 0) {
          this.getTemplateData(response.items[0].templates[0])
        }


        if (response.items[0].completionDeadline) {
          response.items[0].completionDeadline = new Date(response.items[0].completionDeadline)
        }

        if (response.items[0].startDate) {
          response.items[0].startDate = new Date(response.items[0].startDate)
        }
        this.inspectionForm.patchValue(response.items[0])
        //  this.templateForm.controls["networkId"].valueChanges.subscribe(e=>{
        //   if(this.selectedSectionList.length > 0){
        //     const modalRef = this.modalService.open(ConfirmationComponent, this.config);
        //     modalRef.componentInstance.access = 'Cancel';
        //     modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
        //       modalRef.dismiss('Cross click'); 
        //       if(!receivedService) {
        //         this.templateForm.controls["networkId"].setValue(this.previousNetwork,{ emitEvent: false })
        //         return;
        //       } else {
        //         this.previousNetwork = e;
        //         this.selectedSectionList = [];
        //         this.getSections();
        //       }
        //     });
        //   }else{
        //     this.previousNetwork = e;
        //     this.getSections();
        //   }
        // })
        let templateData = response.items[0]
      }
    })

  }

  submitForm(type: string) {
    this.submitted = true;
    if (this.inspectionForm.valid) {

      let request = JSON.parse(JSON.stringify(this.inspectionForm.value));
      if (request && request.tags) {
        request.tags = "[" + request.tags + "]"
      }

      if (request && request.templates) {
        request.templates = "[" + request.templates + "]"
      }


      if (this.selectedShops && this.selectedShops.length > 0) {
        let shopName = this.selectedShops.map(e => e.id)
        request.locations = "[" + shopName + "]"
      }

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      if (type == 'publish') {
        apiFormData.append("isPublished", "2");
      } else {
        apiFormData.append("isPublished", "1");
      }

      if (this.editId) {
        apiFormData.append("id", this.editId);
      }

      if (this.imageData && this.imageData.response) {
        apiFormData.append("bannerUrl", this.imageData.response);
      }

      if (this.imageData && this.imageData.logoImageName) {
        apiFormData.append("bannerUrl", this.imageData.logoImageName);
      }

      for (let key in request) {
        apiFormData.append(key, request[key]);
      }

      request.startDate = this.dateFormat(new Date(request.startDate))
      request.completionDeadline = this.dateFormat(new Date(request.completionDeadline))

      this.headQuarterService.saveInspection(apiFormData).subscribe((response: any) => {
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        if (this.editId) {
          msgModalRef.componentInstance.successMessage = "Inspection details updated.";
        } else {
          msgModalRef.componentInstance.successMessage = "New inspection added.";
        }
        setTimeout(() => {
          msgModalRef.dismiss('Cross click');
        }, 2000);
        // if (!this.editId) 
        this.router.navigate(["headquarters/audit"], { queryParams: { type: 'audit' } });
        // else this.router.navigate(["headquarters/audit/inspection/" + this.editId]);
      })
    }
  }

  dateFormat(d) {
    if (!!d && d !== '') {
      return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    }
  }

  submitCancel() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (!receivedService) {
        return;
      } else {
        this.backToList();
      }
    });
  }

  backToList() {
    // if (!this.editId) 
    this.router.navigate(["headquarters/audit"], { queryParams: { type: 'audit' } });
    // else this.router.navigate(["/headquarters/audit/inspection/" + this.editId]);
  }

  eventChanged(type, event) {
    console.log(event.value);
    this.selectNetworkId = event.value;
    for (let i in this.networkList) {
      if (this.networkList[i].id == event.value) {
        this.selectNetworkName = this.networkList[i].name;
      }
    }
  }
  getNetworkList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("type", "20");
    this.headQuarterService.getCommonList(apiFormData).subscribe((response: any) => {
      console.log(response)
      if (response && response.items) {
        this.networkList = response.items;
        for (let i in this.networkList) {
          if (this.networkList[i].id == this.user.networkId) {
            this.selectNetworkName = this.networkList[i].name;
            this.selectNetworkId = this.networkList[i].id;
          }
        }
      }

      if (this.user.domain_id != 1) {
        this.selectedNetworkId = true;
        this.inspectionForm.controls['networkId'].setValue(this.user.networkId);
      } else {
      }
    })
  }

  // Manage List
  manageList(field) {

    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      networkId: this.dekraNetworkId,
      statusId: "2"
    };

    let access;
    let filteredItems;
    let filteredNames;
    let selectionType;
    let inputfield;
    let title;

    let inputData = {};
    switch (field) {
      case "dekra-template":
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.add("dekra-audit-tmodal");
        apiData["type"] = "8";
        access = "newthread";
        selectionType = 'single';
        inputfield = 'dekra-template';
        title = 'Templates';
        filteredItems = this.templateSelectedId;
        filteredNames = this.templateSelectedName;
        break;
      case "tags":
        apiData["type"] = "18";
        access = "newthread";
        selectionType = 'multiple';
        inputfield = 'dekra-shoptype';
        title = 'Tag';
        filteredItems = this.tagSelectedId;
        filteredNames = this.tagSelectedName;
        break;

    }

    inputData = {
      actionApiName: "",
      actionQueryValues: "",
      selectionType: selectionType,
      field: inputfield,
      title: title,
      filteredItems: filteredItems,
      filteredLists: filteredNames,
      baseApiUrl: this.headQuarterService.dekraBaseUrl,
      apiUrl: this.headQuarterService.dekraBaseUrl + "" + Constant.getDekraCommonData,
    };

    if (field == "dekra-template") {
      inputData["apiUrl"] = this.headQuarterService.dekraBaseUrl + "" + "network/templatelist"
    }

    const modalRef = this.modalService.open(ManageListComponent, this.modalConfig);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.addAllow = false;
    // modalRef.componentInstance.actionFlag = true;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.checkboxColor = 'active-green';
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredNames;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = this.innerHeight + 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove("dekra-audit-tmodal");
      modalRef.dismiss("Cross click");
      let items = receivedService;
      console.log(receivedService);
      switch (field) {
        case 'dekra-template':
          this.templateSelect = [];
          this.templateSelectedId = [];
          this.templateSelectedName = [];
          for (let t in items) {
            let chkIndex = this.templateSelectedId.findIndex(
              (option) => option == items[t].id
            );
            if (chkIndex < 0) {
              this.templateSelectedId.push(items[t].id);
              this.templateSelectedName.push(items[t].title);
              this.templateSelect.push({
                id: items[t].id.toString(),
                name: items[t].title.toString(),
                secs: items[t].sectionsCount,
                qs: items[t].questionsCount
              });
            }
          }
          this.inspectionForm.get('templates').setValue(this.templateSelectedId);

          break;
        case 'tags':
          this.tagSelectedId = [];
          this.tagSelectedName = [];
          for (let t in items) {
            this.tagSelectedId.push(items[t].id);
            this.tagSelectedName.push(" " + items[t].name);
          }
          if (this.tagSelectedId && this.tagSelectedId.length > 0) {
            this.inspectionForm.get('tags').setValue(this.tagSelectedId);
          } else {
            this.inspectionForm.get('tags').setValue("");
          }
          break;
      }
      //this.inspectionForm.controls['template'].setValue("Repair Quality Process");


    });
  }

  selectLocation() {
    this.selectedLocationsFlag = true;
    this.selectionData = {
      'selectNetworkId': this.selectNetworkId,
      'selectNetworkName': this.selectNetworkName
    }
    //this.router.navigate(['/inspection-location']);           
  }

  saveData(event) {
    if (event) {
      this.selectedShops = event;
      this.selectedLocationsFlag = false;
      this.selectedLocationsDisplay = true;
    }

  }

  getCommonDataList(type: string) {
    const apiFormData = new FormData();
    apiFormData.append("type", type);
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headquarterService.getCommonList(apiFormData).subscribe((response: any) => {
      if (type == "19") {
        this.typesList = response.items;
      }

    });
  }

  removeSelection(index) {
    this.tagSelectedId.splice(index, 1);
    this.tagSelectedName.splice(index, 1);
    if (this.tagSelectedId && this.tagSelectedId.length == 0) {
      this.inspectionForm.get('tags').setValue("");
    } else {
      this.inspectionForm.get('tags').setValue(this.tagSelectedId);
    }
  }



}

