import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { GtsService } from 'src/app/services/gts/gts.service';
import { Constant, industryTypes } from '../../../../common/constant/constant';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  recentBin: any = industryTypes;
  gtsForm: FormGroup;

  recentSelection: string[] = []

  @Input() innerHeight: number;
  @Input() pageData: any;
  @Input() gtsInfo: any;

  odoFields: Array<any> = [];
  apiData: Object;
  public user: any;
  public domainId;
  public userId;
  procedureId: any;
  countryId: any

  constructor(private gtsApi: GtsService, private fb: FormBuilder, private config: NgbModalConfig, private modalService: NgbModal,
    private apiUrl: ApiService,
  ) { }

  ngOnInit(): void {
    this.gtsApi.apiData = {
      apiKey: this.gtsApi.apiKey,
      userId: this.gtsApi.userId,
      domainId: this.gtsApi.domainId,
      actionMode: '2',
      processId: this.gtsApi.processId,
      procedureId: this.gtsApi.procedureId,
    };

    if (this.gtsInfo && this.gtsInfo.workstreams.length > 0) {
      this.gtsApi.apiData.workstreamId = this.gtsInfo.workstreams[0].id
    }
    this.gtsForm = this.fb.group({
      frameNo: [''],
      odometerNo: ['']
    })
    this.pageData.OdoValues.forEach((val) => {
      this.odoFields.push({ name: val.charAt(0).toUpperCase() + val.slice(1) })
    })

    this.countryId = localStorage.getItem('countryId');

    if (this.gtsApi.showFirstScreen == false) {
      this.startGTS();
    }
  }

  openRecentSelection() {

    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.gtsApi.domainId,
      'countryId': this.countryId,
      'userId': this.gtsApi.userId,
      'lookUpdataId': '',
      'lookupHeaderName': '',
      'groupId': 0
    };

    let inputData = {
      baseApiUrl: this.apiUrl.apiCollabticBaseUrl(),
      apiUrl: this.apiUrl.apiCollabticBaseUrl() + Constant.getRecentVins,
      field: 'vinNo',
      selectionType: 'single',
      filteredItems: [''],
      filteredLists: [''],
      actionApiName: '',
      actionQueryValues: '',
      title: 'Recent VINs'
    };
    this.config.backdrop = 'static';
    this.config.keyboard = false;
    this.config.size = 'lg';
    this.config.centered = true;
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = 'newthread';
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = this.innerHeight - 140;
    modalRef.componentInstance.commonApiValue = '';
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      if (receivedService.length) {
        this.gtsForm.patchValue({
          frameNo: receivedService[0].vinNo
        })
      }
    })
  }

  startGTS(): void {
    this.gtsApi.isLoading = true;
    this.gtsApi.apiData.frameNo = this.gtsForm.value.frameNo;
    this.gtsApi.apiData.odometerNo = this.gtsForm.value.odometerNo;

    if (!this.pageData.isVinDecode) {
      this.gtsApi.getProcedure();
    } else if (this.gtsForm.value.frameNo) {
      this.gtsApi.frameDecode(this.gtsForm.value.frameNo).subscribe(response => {
        if (response.status == 'Success') {
          this.gtsApi.getProcedure();
        }
      })
    }
  }
  updateSerialno() {
    this.gtsApi.serialNumber = this.gtsForm.value.frameNo;
  }
}
