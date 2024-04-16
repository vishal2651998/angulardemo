import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { CommonService } from '../../../services/common/common.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { GtsService } from "src/app/services/gts/gts.service";
import { ExcelService } from '../../../services/dashboard/excel/excel.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { UserActivitiesService } from 'src/app/services/user-activities.service';
import { collectExternalReferences } from '@angular/compiler';
import { UserDashboardService } from '../../../services/user-dashboard/user-dashboard.service';

@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent implements OnInit {
  @Input() apiData;
  @Input() exportInfo;
  @Input() exportData;
  @Input() access;
  @Input() title;
  @Input() isCollabtic;
  @Input() exportAllFlag;
  @Output() updateonExportisDone = new EventEmitter<any>();

  public totalLimit = 0;
  public itemLimit = 30;
  public itemOffset = 0;
  public sNo = 0;
  public uploadFlag;
  public itemLength;
  public progressbarCount = "1";
  public progressbarCountWidth = "";
  public stopexportapi: boolean = true;
  public threadLists = [];
  public dealerData = [];
  public leaderInfo: any = [];
  public dtcInfo: any = [];
  public diagnosticInfo: any = [];
  public adasInfo: any = [];
  public exceldownloadtrue: boolean = false;
  public downloadtextflag = 'Exporting data to Excel..';
  public userActivitiesInfo: any = [];
  public firstTimeCall: any = 1;
  public firstData: any = [];
  public userDashLists: any = [];
  constructor(
    private router: Router,
    private leaderBoardApi: LeaderboardService,
    private dashboardApi: DashboardService,
    private excelService: ExcelService,
    private commonService: CommonService,
    private LandingpagewidgetsAPI: LandingpageService,
    private modalService: NgbModal,
    private userActiviesApi: UserActivitiesService,
    private gtsListingApi: GtsService,
    private userDashboardApi: UserDashboardService,
  ) { }

  ngOnInit() {
    console.log(this.access)
    this.sNo = 0;
    switch (this.access) {
      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealerActivity();
        break;
      case 'threads':
        if (this.exportAllFlag) {
          this.getexceldata();
        }
        else {
          this.getexceldataThread();
        }
        break;
      case 'leaderboard':
        this.getexceldataLeaderBoard()
        break;
      case 'user-activities':
        this.getexceldataUserActivities()
        break;
      case 'gts':
        this.getGTSExcelData();
        break;
      case 'user-dashboard':
        this.getUserDashboard();
        break;
      case 'dtc':
        this.getDTCExcelData();
        break;
      case 'dtc-template':
        this.exceldownloadtrue = true;
        this.exportDTCReport(this.access, this.exportInfo, this.exportData);
        break;
      case 'diagnostic':
        this.getDiagnosticExcelData();
        break;
      case 'diagnostic-template':
        this.exceldownloadtrue = true;
        this.exportDiagnosticReport(this.access, this.exportInfo, this.exportData);
        break;
      case 'adas':
        this.getAdasExcelData();
        break;
      case 'adas-template':
        this.exceldownloadtrue = true;
        this.exportAdasReport(this.access, this.exportInfo, this.exportData);
        break;
      case 'customer-template':
        this.exceldownloadtrue = true;
        this.exportCustomersReport(this.exportInfo);
        break;
    }
  }

  getexceldata() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 1;
    this.apiData['exportLazy'] = 1;

    //alert(JSON.stringify(this.apiData));
    // alert(this.apiData);
    this.uploadFlag = this.dashboardApi.apiChartDetailAll(this.apiData).subscribe((response) => {
      //alert(11);
      let responseData = response.data;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportThreadData = responseData.chartdetails;
      let threadType = this.exportInfo[1];
      let threadInfo = ['exportThread'];
      let threadList = this.commonService.getModifiedThreadData(threadInfo, exportThreadData, threadType);
      this.exportData['threadList'] = threadList;

      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, this.exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  getexceldataLeaderBoard1() {
    this.apiData['limit'] = this.leaderBoardApi.offset;
    this.apiData['offset'] = 0;
    this.apiData['exportAll'] = 0;
    this.leaderBoardApi.getLeaderBoardChartData(this.apiData).subscribe(response => {
      this.itemLength += response.total;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / response.total) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (response.total != 0) {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;
          }
          this.generateExcel(this.access, this.exportInfo, response.items);
        }
      }
    })
  }

  getexceldataLeaderBoard() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;
    this.leaderBoardApi.getLeaderBoardChartData(this.apiData).subscribe((response) => {
      let responseData = response;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportData = responseData.items;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;
          }
          console.log(exportData);
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    });
  }

  getexceldataUserActivities() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;
    this.userActiviesApi.getUserActivitiesChartData(this.apiData).subscribe((response) => {
      let responseData = response;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportData = responseData.data;
      if (this.firstTimeCall === 1) {
        this.firstData = exportData;
      }
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;
          }
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    });
  }

  getexceldataThread() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;

    this.uploadFlag = this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportThreadData = responseData.chartdetails;

      let threadType = this.exportInfo[1];
      let threadInfo = ['exportThread'];
      let threadList = this.commonService.getModifiedThreadData(threadInfo, exportThreadData, threadType);
      this.exportData['threadList'] = threadList;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, this.exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    }, err => {
      console.log(err)
    });
  }

  exportDealerActivity() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;
    this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportData = responseData.chartdetails;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.title, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    });
  }

  generateExcel(access, title, exportData, type1='', type2='',type3='',type4='') {
    switch (access) {
      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealers(title, exportData);
        break;
      case 'threads':
        this.exportThreadReports(title, exportData);
        break;
      case 'leaderboard':
        this.exportLeaderBoardReport(title, exportData);
        break;
      case 'user-activities':
        this.firstTimeCall += this.firstTimeCall;
        this.exportUserActivitiesReport(title, exportData);
        break;
      case 'gts':
        this.exportGTSReport(access, title, exportData);
        break;
      case 'user-dashboard':
        this.exportUserDashboardReport(access, title, exportData,type1, type2, type3, type4);
        break;
      case 'dtc':
        this.exportDTCReport(access, title, exportData);
        break;
      case 'diagnostic':
        this.exportDiagnosticReport(access, title, exportData);
        break;
      case 'adas':
        this.exportAdasReport(access, title, exportData);
        break;
      case 'customer-template':
        this.exportCustomersReport(this.exportInfo);
        break;
    }
  }

  exportLeaderBoardReport(title, exportData) {
    let apiData = exportData;
    let headers = ['Position', 'Username', 'Email Address', 'Thread Count', 'Reply Count', 'Badge Point'];
    apiData.forEach(data => {
      this.sNo = this.sNo + 1;
      let leaderInfo = [this.sNo, data.username, data.email, data.threadCount, data.replyCount, data.socialPoint];
      this.leaderInfo.push(leaderInfo)
    });

    let workbook = new Workbook();
    let startDateExcel = '';
    if (this.apiData.hasOwnProperty('startDate') && this.apiData.hasOwnProperty('endDate')) {
      startDateExcel = ' for ' + moment(this.apiData.startDate).format('MMM DD, YYYY') + ' - ' +
        moment(this.apiData.endDate).format('MMM DD, YYYY');
    }
    let worksheet = workbook.addWorksheet(title[0]);

    let titleRow = worksheet.addRow([title[0] + ' ' + startDateExcel]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.leaderInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(6);
      let color = 'FF99FF';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';

      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Leaderboard.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getexceldataLeaderBoard();
    }
  }

  exportUserActivitiesReport(title, exportData) {
    let apiData = exportData;
    let headers = ['Username'];
    this.firstData[0].metrics.forEach((metric: any) => {
      headers.push(metric.title);
    });
    headers.push('Total Count');
    if (apiData && apiData.length) {
      apiData.forEach((data: any) => {
        let valueArray: any = [];
        this.sNo = this.sNo + 1;
        valueArray.push(data.userName);
        for (let metric of data.metrics) {
          valueArray.push(parseInt(metric.count));
        }
        valueArray.push(data.totalCount);
        this.userActivitiesInfo.push(valueArray)
      });
    }

    let workbook = new Workbook();
    let startDateExcel = '';
    if (this.apiData.hasOwnProperty('startDate') && this.apiData.hasOwnProperty('endDate')) {
      startDateExcel = ' for ' + moment(this.apiData.startDate).format('MMM DD, YYYY') + ' - ' +
        moment(this.apiData.endDate).format('MMM DD, YYYY');
    }
    let worksheet = workbook.addWorksheet(title[0]);

    let titleRow = worksheet.addRow([title[0] + ' ' + startDateExcel]);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, bold: true }
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.userActivitiesInfo.forEach(l => {
      worksheet.addRow(l);
    });

    headers.forEach((header: any, index: number) => {
      worksheet.getColumn(index + 1).width = 30;
      worksheet.addRow([]);
    })

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      this.firstTimeCall = 1;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Useractivities.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getexceldataUserActivities();
    }
  }

  exportDealers(title, exportData) {
    let apiData = exportData;
    let header = ['Dealer Name', 'ID', 'Zone', 'Area', 'Territory'];
    let monthInfo = apiData[0].interdays;
    for (let m of monthInfo) {
      header.push(m.day)
    }
    header.push('Total Time');
    // let dealerData = [];
    for (let info in apiData) {
      let days = [];
      let dayInfo = apiData[info].interdays;
      let utype = parseInt(apiData[info].userType);
      let name = (utype == 2) ? apiData[info].dealerName : apiData[info].userName;
      let id = (utype == 2) ? apiData[info].dealerCode : apiData[info].userId;
      let dealerInfo = [name, id, apiData[info].zone, apiData[info].userarea, apiData[info].territory];
      for (let d of dayInfo) {
        dealerInfo.push(d.totaltime);
      }
      dealerInfo.push(apiData[info].totaltime);
      this.dealerData.push(dealerInfo);
    }


    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    worksheet.addRow([]);
    //let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

    //Blank Row
    worksheet.addRow([]);

    // Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        //fgColor: { argb: 'FFFFFF00' },
        fgColor: { argb: 'e8e3e3' },

        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    this.dealerData.forEach(d => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(5);
      let color = 'FF99FF';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';

      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Dealer_Usage.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    }
    else {
      this.exportDealerActivity();
    }

    //Generate Excel File with given name


  }

  exportThreadReports(title, exportData) {
    let openThreadsData = exportData.openThreads;
    let closedThreadsData = exportData.closedThreads;
    let threadListData = exportData.threadList;

    let openHeader = ['Thread Status', 'Total Count', 'Percentage'];
    let openData = [];
    for (let openThread in openThreadsData) {
      let status = openThreadsData[openThread].title;
      let count = openThreadsData[openThread].countValue;
      let percentVal = openThreadsData[openThread].percentageValue + '%';
      let openThreadInfo = [status, count, percentVal];
      openData.push(openThreadInfo);
    }

    let closedHeader = ['Thread Status', 'Total Count', 'Percentage'];
    let closedData = [];
    for (let closedThread in closedThreadsData) {
      let status = closedThreadsData[closedThread].title;
      let count = closedThreadsData[closedThread].countValue;
      let percentVal = closedThreadsData[closedThread].percentageValue + '%';
      let closedThreadInfo = [status, count, percentVal];
      closedData.push(closedThreadInfo);
    }

    let threadTitle = title[1].charAt(0).toUpperCase() + title[1].slice(1);
    let threadListHeader;
    let startDateExcel = '';
    if (this.isCollabtic) {
      threadListHeader = ['Thread owner', 'Assigned To', 'Model > Year', 'Title', 'Open Date', 'Fix Date', 'Time to Fix (Hrs)','First Response Date','First Response (Hrs)','Thread Closed Date','Time to Close', 'Thread Status', 'Thread ID'];
      if (this.apiData.hasOwnProperty('filterOptions')) {
        if (this.apiData.filterOptions.hasOwnProperty('startDate') && this.apiData.filterOptions.hasOwnProperty('endDate')) {
          startDateExcel = ' for ' + moment(this.apiData.filterOptions.startDate).format('YYYY-MM-DD') + ' - ' +
            moment(this.apiData.filterOptions.endDate).format('YYYY-MM-DD');
        } else {
          startDateExcel = ' for ' + moment().subtract(30, 'days').format('MMM D, YYYY') + ' - ' +
            moment().format('MMM D, YYYY');
        }
      }
    } else {
      if (threadTitle == 'Open') {
        threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Frame#', 'Odo Meter', 'Title', 'Error Code', 'Description', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', '1st Reply Time', 'Thread ID', 'Time to Share Proposed Fix (Hrs)', 'Open/Closed', 'Workstreams', 'Feedback Status'];
      } else {
        threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Frame#', 'Odo Meter', 'Title', 'Error Code', 'Description', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', '1st Reply Time', 'Thread ID', 'Thread Closed Date', 'Time to Time to Share Proposed Fix (Hrs)', 'Time to Close (Hrs)', 'Open/Closed', 'Workstreams', 'Feedback Status'];
      }
    }
    console.log(threadListData)
    for (let threadList in threadListData) {
      console.log(threadListData[threadList].thread_id)
      let threadOwner = (this.isCollabtic) ? threadListData[threadList].threadOwner : '';
      let dealerName = threadListData[threadList].dealerName;
      dealerName = (this.isCollabtic) ? threadOwner : dealerName;
      let dealerCode = threadListData[threadList].dealerCode;
      let userTypeName = threadListData[threadList].userTypeName;
      let zone = threadListData[threadList].zone;
      let userarea = threadListData[threadList].userarea;
      let tty = threadListData[threadList].territory;
      let prodOwner = (this.isCollabtic) ? threadListData[threadList].assignedUser : threadListData[threadList].assignedUser;
      let tmName = threadListData[threadList].territory_manager;
      let threadCreation = threadListData[threadList].created_on;
      const year = ' > ' + threadListData[threadList].year;
      let model = (threadListData[threadList].year) ? threadListData[threadList].model + ' > ' + threadListData[threadList].year : threadListData[threadList].model;
      let frame = threadListData[threadList].frameNo;
      let odoMeter = threadListData[threadList].odoMeter;
      let title = threadListData[threadList].title;
      let errorCode = threadListData[threadList].error_code;
      let desc = threadListData[threadList].description;
      let threadStatus = threadListData[threadList].thread_status;
      let escLevel = threadListData[threadList].escalate_status_land;
      let proposedFixDate = threadListData[threadList].proposedFix_createdOn;
      let firstTimeReply = threadListData[threadList].firstReplyFromEmp;
      //added by karuna for proposed fix content
      let proposedFix_content = threadListData[threadList].proposedFix_contentxls;
      let threadId = '#' + threadListData[threadList].thread_id;
      let timeToRespond = (threadListData[threadList].exportTimeToRespond == '-' || threadListData[threadList].exportTimeToRespond == '') ? 0 : threadListData[threadList].exportTimeToRespond;
      let threadFixDate = threadListData[threadList].threadFixDate;
      let timeToFix = (threadListData[threadList].timeToFix == '-' || threadListData[threadList].timeToFix == '') ? '-' : threadListData[threadList].timeToFix;

      let firstReplyFromEmp = (threadListData[threadList].firstReplyFromEmp == '-' || threadListData[threadList].firstReplyFromEmp == '') ? '-' : threadListData[threadList].firstReplyFromEmp;

      let firstReplyTime = (threadListData[threadList].firstReplyTime == '-' || threadListData[threadList].firstReplyTime == '') ? '-' : threadListData[threadList].firstReplyTime;

      let timeToCloseData = (threadListData[threadList].timeToClose == '-' || threadListData[threadList].timeToClose == '') ? '-' : threadListData[threadList].timeToClose;

      let close_dateData = (threadListData[threadList].close_date == '-' || threadListData[threadList].close_date == '') ? '-' : threadListData[threadList].close_date;
      let timeclose_status = threadListData[threadList].close_status;
      let workstreamsListthread = threadListData[threadList].workstreamsList;
      let feedbackStatus = threadListData[threadList].feedbackStatus;

      let timeToClose: any = 0;
      let openclosestatus = '';
      if (timeclose_status == 1) {
        openclosestatus = 'Closed';
      } else {
        openclosestatus = 'Open';
      }

      let threadListInfo;
      if (this.isCollabtic) {
        threadListInfo = [
          dealerName,
          prodOwner,
          model,
          title,
          threadCreation,
          threadFixDate,
          timeToFix,
          firstReplyFromEmp,
          firstReplyTime,
          close_dateData,
          timeToCloseData,
         threadStatus,
          threadId,
        ];
      } else {
        if (threadTitle == 'Open') {
          threadListInfo = [dealerName, dealerCode, userTypeName, zone, userarea, tty, prodOwner, tmName, threadCreation, model, frame, odoMeter, title, errorCode, desc, threadStatus, escLevel, proposedFixDate, proposedFix_content, firstTimeReply, threadId, timeToRespond, openclosestatus, workstreamsListthread, feedbackStatus];
        } else {
          let threadCloseDate = threadListData[threadList].close_date;
          timeToClose = (threadListData[threadList].exportTimeToClose == '-' || threadListData[threadList].exportTimeToClose == '') ? 0 : threadListData[threadList].exportTimeToClose;
          threadListInfo = [dealerName, dealerCode, userTypeName, zone, userarea, tty, prodOwner, tmName, threadCreation, model, frame, odoMeter, title, errorCode, desc, threadStatus, escLevel, proposedFixDate, proposedFix_content, firstTimeReply, threadId, threadCloseDate, timeToRespond, timeToClose, openclosestatus, workstreamsListthread, feedbackStatus];
        }
      }
      this.threadLists.push(threadListInfo);
    }

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title[0]);

    //Add Row and formatting
    let titleRow = worksheet.addRow([title[0]]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    worksheet.addRow([]);
    //let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

    // Open Threads Data

    //Blank Row
    worksheet.addRow([]);
    // Add Header Row
    let openTitle = "Open Threads" + startDateExcel;
    let openTitleRow = worksheet.addRow([openTitle]);
    openTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    let openHeaderRow = worksheet.addRow(openHeader);

    // Cell Style : Fill and Border
    openHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    openData.forEach(ot => {
      let row = worksheet.addRow(ot);
    });

    // Closed Threads Data

    //Blank Row
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Add Header Row
    let closedTitle = "Closed Threads" + startDateExcel;
    let closedTitleRow = worksheet.addRow([closedTitle]);
    closedTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    let closedHeaderRow = worksheet.addRow(closedHeader);

    // Cell Style : Fill and Border
    closedHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    closedData.forEach(ct => {
      let row = worksheet.addRow(ct);
    });


    // Thread Lists Data

    //Blank Row
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Add Header Row
    let threadListTitle = threadTitle + " Thread Lists";
    let threadListTitleRow = worksheet.addRow([threadListTitle]);
    threadListTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    let threadListHeaderRow = worksheet.addRow(threadListHeader);

    // Cell Style : Fill and Border
    threadListHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    let t2 = 0;
    this.threadLists.forEach(tl => {
      t2 = t2 + 1;
      let row = worksheet.addRow(tl);
      worksheet.getColumn(t2).width = 30;
      if (threadTitle == 'Open') {
        let ts = row.getCell(18);
        ts.alignment = {
          horizontal: 'left'
        }
      } else {
        let ts = row.getCell(19);
        ts.alignment = {
          horizontal: 'left'
        }

        let tc = row.getCell(20);
        tc.alignment = {
          horizontal: 'left'
        }
      }
    });

    worksheet.addRow([]);
    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Processing Excel';

      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Thread_Reports.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Adding data to Excel sheet';
        this.updateonExportisDone.emit(1);
      }, 3000);
    }
    else {
      if (this.exportAllFlag) {
        this.getexceldata();
      }
      else {
        this.getexceldataThread();
      }
    }
  }

  getUserDashboard(){
    console.log(this.apiData)
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    //apiFormData.append("searchKey", this.apiData["searchKey"]);
    apiFormData.append("limit", this.apiData["limit"]);
    apiFormData.append("offset", this.apiData["offset"]);
    apiFormData.append("userType",this.apiData["userType"]);

    this.uploadFlag =  this.userDashboardApi.getuserlist(apiFormData).subscribe((response) => {
      let exportData = response.data.user_details;
      let total_count = response.data.totalCount;
      this.totalLimit = total_count;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      //console.log(this.itemOffset/total_count)
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, '', exportData,this.apiData["domainId"], this.apiData["exportHeader"],this.apiData['userTypeName'],this.apiData['workstreamArr']);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }
   // Export DTC Data
   getGTSExcelData() {
    //console.log(this.apiData)
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    apiFormData.append("searchKey", this.apiData["searchKey"]);
    apiFormData.append("limit", this.apiData["limit"]);
    apiFormData.append("offset", this.apiData["offset"]);
    apiFormData.append("filterOptions",JSON.stringify(this.apiData["filterOptions"]));

    this.uploadFlag =  this.gtsListingApi.getGTSLists(apiFormData).subscribe((response) => {
      let exportData = response.procedure;
      let total_count = response.total;
      this.totalLimit = total_count;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      //console.log(this.itemOffset/total_count)
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  // Export DTC Data
  getDTCExcelData() {
    console.log(this.apiData)
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.uploadFlag = this.commonService.getErrorCodes(this.apiData).subscribe((response) => {
      let exportData = response.errorCodes;
      let total_count = response.total;
      this.totalLimit = total_count;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      console.log(this.itemOffset/total_count)
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  exportDTCReport(access, title, exportData) {
    let apiData = exportData;
    let headers = ['S.No', 'Code', 'Description'];
    apiData.forEach(data => {
      this.sNo = this.sNo + 1;
      let dtcInfo = [this.sNo, data.code, data.desc];
      this.dtcInfo.push(dtcInfo)
    });

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.dtcInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(3);
      let color = 'FFFFFF';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let date = '';
      if (this.apiData.hasOwnProperty('uploadedOn')) {
        let uploadedDate = this.apiData.uploadedOn;
        date = (uploadedDate == '-') ? date : moment(uploadedDate).format('MMM DD, YYYY');
      }
      let fname = (access == 'dtc') ? 'DTC' : 'DTC Template';
      let fileName = (access == 'dtc') ? `${title} ${fname} ${date}.xlsx` : `${fname}.xlsx`;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getDTCExcelData();
    }
  }

  exportGTSReport(access, title, exportData) {
    //console.log(exportData)
    let apiData = exportData;
    let platformId = localStorage.getItem('platformId');
    let tvsFlag = (platformId == '2' && this.apiData["domainId"] == 52) ? true : false;

    let headers = [];
    if(tvsFlag){
      headers = ['Problem Category', 'GTS Procedure Title', 'Module Type', 'Module Mfg','DTC', 'DTC Description', 'System', 'Procedure ID', 'Workstream Name', 'Product Type','Model', 'Year','Created On','Created By','Modified On','Modified By','Status'];
    }
    else{
      headers = ['Problem Category', 'GTS Procedure Title', 'System', 'Procedure ID', 'Workstream Name', 'Make','Model', 'Year','Created On','Created By','Modified On','Modified By','Status'];
    }

    apiData.forEach(data => {
      let diagnosticInfo: any = [];
      let infoItems = data.procedureId;
      if(infoItems.length == 0) {
        diagnosticInfo = [''];
        this.diagnosticInfo.push(diagnosticInfo);
      } else {

        let vehicleInfo: any;
        let vehicleFlag: boolean;
        let make = [];
        let makeStr = "";
        let model = [];
        let modelStr = "";
        let year = [];
        let yearStr = "";
        vehicleInfo = data.vehicleDetails == "" ? data.vehicleDetails : JSON.parse(data.vehicleDetails);
        vehicleFlag = vehicleInfo.length == 0 ? false : true;
        //console.log(vehicleInfo);
        if (vehicleFlag) {
          for (let vh of vehicleInfo) {
            year = vh.year == 0 && vh.year != '' ? ['All'] : vh.year;
            //console.log(year);
            make.push(vh.productType);
            model.push(vh.model);
            year.push(year);
          }
        }
        //console.log(year);
        makeStr = make.toString();
        modelStr = model.toString();
        yearStr = year.toString();
        if(yearStr!=''){
          yearStr = yearStr.replace(/,\s*$/, "");
        }

        let gtsid = data.procedureId.toString();
        //console.log(gtsid);
        //console.log(data.workstreamsList);
        //console.log(makeStr);
        //console.log(modelStr);
        console.log(yearStr);
        let createdDate = moment.utc(data.createdOn).toDate();
        let localCreatedDate = moment(createdDate).local().format("MMM DD, YYYY h:mm A");
        let updatedDate = data.updatedOn == '' ? '' : moment.utc(data.updatedOn).toDate();
        let localUpdatedDate;
        if(updatedDate != ''){
          localUpdatedDate = moment(updatedDate).local().format("MMM DD, YYYY h:mm A");
        }
        if(tvsFlag){
          diagnosticInfo = [data.productCategoryName, data.name, data.productModuleType, data.productModuleMfg, data.dtcCode, data.dtcDesc, data.systemSelection, gtsid, data.workstreamsList, makeStr, modelStr, yearStr, localCreatedDate, data.createdBy, localUpdatedDate, data.updatedBy, data.status ];
        }
        else{
          diagnosticInfo = [data.productCategoryName, data.name, data.systemSelection, gtsid, data.workstreamsList, makeStr, modelStr, yearStr, localCreatedDate, data.createdBy, localUpdatedDate, data.updatedBy, data.status ];
        }
        this.diagnosticInfo.push(diagnosticInfo);
        //console.log(this.diagnosticInfo);
      }
    });

    let workbook = new Workbook();
    title = 'GTS Procedure';

    let worksheet = workbook.addWorksheet(title);

    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, bold: true }
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(headers);

    headerRow.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });



    this.diagnosticInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(100);
      let color = 'FFFFFF';
      if (+qty.value < 500) {
        color = 'FFFFFF'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    if(tvsFlag){
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 45;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 35;
      worksheet.getColumn(7).width = 20;
      worksheet.getColumn(8).width = 20;
      worksheet.getColumn(9).width = 35;
      worksheet.getColumn(10).width = 30;
      worksheet.getColumn(11).width = 30;
      worksheet.getColumn(12).width = 20;
      worksheet.getColumn(13).width = 35;
      worksheet.getColumn(14).width = 20;
      worksheet.getColumn(15).width = 35;
      worksheet.getColumn(16).width = 20;
      worksheet.getColumn(17).width = 20;
    }
    else{
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 35;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 35;
      worksheet.getColumn(6).width = 35;
      worksheet.getColumn(7).width = 35;
      worksheet.getColumn(8).width = 35;
      worksheet.getColumn(9).width = 35;
      worksheet.getColumn(10).width = 30;
      worksheet.getColumn(11).width = 35;
      worksheet.getColumn(12).width = 30;
      worksheet.getColumn(13).width = 20;
    }



    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let date = '';
      if (this.apiData.hasOwnProperty('uploadedOn')) {
        let uploadedDate = this.apiData.uploadedOn;
        date = (uploadedDate == '-') ? date : moment(uploadedDate).format('MMM DD, YYYY');
      }
      let fname = 'gts';
      let fileName = `${fname}.xlsx`;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getGTSExcelData();
    }
  }

  exportUserDashboardReport(access, title, exportData,domainId,exportHeader,threadListHeader1,workstreamdIds) {

    console.log(exportData,domainId,exportHeader,threadListHeader1,workstreamdIds);

    let userListData = exportData;
    let threadListHeader;
   // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']
   threadListHeader=exportHeader;
   //let userDashLists = [];
   for (let userList in userListData) {
    let ULoginID = userListData[userList].LoginID;
    let UFirstName = userListData[userList].FirstName;
    let ULastName = userListData[userList].LastName;
    let UEmailAddress = userListData[userList].EmailAddress;
    let UIsVerified= userListData[userList].IsVerified;

    let UuserRole = userListData[userList].userRole;
    let UbusinessRole = userListData[userList].businessRole;
    let businessName = userListData[userList].bussName;

    let Uisactive = userListData[userList].isactive;
    let UlastupdatedOn = userListData[userList].lastUpdatedOn;
    let lastupdatedDate = moment.utc(UlastupdatedOn).toDate();
      let locallastupdatedDate = moment(lastupdatedDate).local().format('MMM DD, YYYY h:mm A');
    let UbussTitle = userListData[userList].bussTitle;
    let UUsername = userListData[userList].Username;
    let Ucreated_on = userListData[userList].created_on;
    let UManagerName = userListData[userList].ManagerName;
    let dealerCode=userListData[userList].dealerCode;
    let dealerName=userListData[userList].dealerName;
    let contactPersonEmail=userListData[userList].contactPersonEmail;
    let contactPersonPhone=userListData[userList].contactPersonPhone;
    let contactPersonName=userListData[userList].contactPersonName;
    let czone=userListData[userList].zone;
    let cuserarea=userListData[userList].userarea;
    let cterritory=userListData[userList].territory;
    let wst=[];
    let userListInfo;
   if(domainId=='52')
   {
    userListInfo = [ULoginID,UFirstName,ULastName,UEmailAddress,UIsVerified,UuserRole,Uisactive,locallastupdatedDate,UbussTitle,UbusinessRole,UUsername,Ucreated_on,UManagerName,dealerCode,dealerName,czone,cuserarea,cterritory];
   }
   else if(domainId=='97')
   {
    userListInfo = [ULoginID,UFirstName,ULastName,UEmailAddress,UIsVerified,UuserRole,Uisactive,locallastupdatedDate,UbussTitle,UbusinessRole,UUsername,Ucreated_on,UManagerName,dealerCode,dealerName,czone,cuserarea,contactPersonEmail,contactPersonPhone,contactPersonName];
   }
   else
   {
    userListInfo = [ULoginID,UFirstName,ULastName,UEmailAddress,UIsVerified,UuserRole,Uisactive,locallastupdatedDate,businessName,UbussTitle,UbusinessRole,UUsername,Ucreated_on,UManagerName];
   }

    for(let ws=0;ws<workstreamdIds.length;ws++)
    {
      let wnamearr='"'+userListData[userList][workstreamdIds[ws]]+'"';
      console.log(userListData[userList][workstreamdIds[ws]]);
      userListInfo.push(userListData[userList][workstreamdIds[ws]]);


    }

    //return false;
    //let joinuser=wst.join(',');
    //console.log(joinuser);

    //return false;



console.log(userListInfo);

      this.userDashLists.push(userListInfo);
     // return false;
   }
   title = threadListHeader1+"_"+"User_Dashboard";
   let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);





    // Add Header Row
   let titleInfo = threadListHeader1+" "+"User Dashboard Reports";
    let openTitleRow = worksheet.addRow([titleInfo]);
    openTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);


    let threadListHeaderRow = worksheet.addRow(threadListHeader);

    // Cell Style : Fill and Border
    threadListHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });


    let t2=0;
    this.userDashLists.forEach(tl => {
      t2=t2+1;
      let row = worksheet.addRow(tl);
      worksheet.getColumn(t2).width = 30;
      /*
      worksheet.getColumn(t2).eachCell((cell, number) => {

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E55554' },
          bgColor: { argb: 'FFFFFF' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
      */
    });


    worksheet.addRow([]);
    worksheet.addRow([]);
/*
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'User_dashboard.xlsx');
    });
	*/


	 if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let date = '';
      if (this.apiData.hasOwnProperty('uploadedOn')) {
        let uploadedDate = this.apiData.uploadedOn;
        date = (uploadedDate == '-') ? date : moment(uploadedDate).format('MMM DD, YYYY');
      }

      let fileName = `${title}.xlsx`;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getUserDashboard();
    }


  }


  exportDiagnosticReport(access, title, exportData) {
    console.log(exportData)
    let apiData = exportData;
    let headers = ['Module', 'Module Abbreviation', 'Module Description', 'DTC', 'Description', 'Diagnostic Instruction'];
    apiData.forEach(data => {
      let diagnosticInfo: any = [];
      let infoItems = data.infoItems;
      if(infoItems.length == 0) {
        diagnosticInfo = [data.name, data.slug, data.desc, '', '', ''];
        this.diagnosticInfo.push(diagnosticInfo);
      } else {
        infoItems.forEach(item => {
          diagnosticInfo = [data.name, data.slug, data.desc, item.dtcCode, item.dtcDesc, item.instruction];
          this.diagnosticInfo.push(diagnosticInfo);
        });
      }
    });

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.diagnosticInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(100);
      let color = 'FFFFFF';
      if (+qty.value < 500) {
        color = 'FFFFFF'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 75;
    worksheet.getColumn(6).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let date = '';
      if (this.apiData.hasOwnProperty('uploadedOn')) {
        let uploadedDate = this.apiData.uploadedOn;
        date = (uploadedDate == '-') ? date : moment(uploadedDate).format('MMM DD, YYYY');
      }
      let fname = (access == 'diagnostic') ? `${this.apiData.fileName} Module` : 'Module Template';
      let fileName = (access == 'diagnostic') ? `${fname} ${date}.xlsx` : `${fname}.xlsx`;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getDiagnosticExcelData();
    }
  }

  exportCustomersReport(title) {
    let headers = ['First Name', 'Last Name', 'Email', 'Company', 'Phone', 'Address 1', 'Address 2', 'Country', 'State', 'City', 'Zip'];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let fname = `${this.apiData.fileName}`;
      let fileName = `${fname}.xlsx`;
      setTimeout(() => {
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getDiagnosticExcelData();
    }
  }

  exportAdasReport(access, title, exportData) {
    console.log(exportData)
    let apiData = exportData;
    let headers = ['Make', 'Model', 'Year', 'Equipment'];
    let appendCol1 = 'Calibration Name';
    let appendCol2 = 'Calibration Instruction';
    let appendCol3 = 'Internal Notes';
    let appendHeaders = [appendCol1, appendCol2, appendCol3];
    if(access == 'adas-template') {
      let appendCount = 5;
      for(let i=0; i<appendCount; i++) {
        headers = headers.concat(appendHeaders);
      }
    }
    apiData.forEach((data, aindex) => {
      let adasInfo: any = [];
      let infoItems = data.contItems;
      adasInfo = [data.make, data.model, parseInt(data.year), data.equipmentStr];
      if(infoItems.length == 0) {
        this.adasInfo.push(adasInfo);
      } else {
        infoItems.forEach((item, index) => {
          let checkCount = 4;
          let colCount = 3;
          colCount = (index == 0) ? checkCount : colCount;
          let itemIndex = (index * colCount)+checkCount;
          let colIndex1 = itemIndex+0;
          let colIndex2 = itemIndex+1;
          let colIndex3 = itemIndex+2;
          headers[colIndex1] = appendCol1;
          headers[colIndex2] = appendCol2;
          headers[colIndex3] = appendCol3;
          adasInfo[colIndex1] = item.adasName;
          adasInfo[colIndex2] = item.realDescription;
          adasInfo[colIndex3] = item.realNotes;
        });
        this.adasInfo.push(adasInfo);
      }
    });

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.adasInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(100);
      let color = 'FFFFFF';
      if (+qty.value < 500) {
        color = 'FFFFFF'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    headers.forEach((item, index) => {
      let width = (index > 2) ? 25 : 10;
      worksheet.getColumn(index+1).width = width;
    })
    /* worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 75;
    worksheet.getColumn(6).width = 30; */
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let date = '';
      if (this.apiData.hasOwnProperty('uploadedOn')) {
        let uploadedDate = this.apiData.uploadedOn;
        date = (uploadedDate == '-') ? date : moment(uploadedDate).format('MMM DD, YYYY');
      }
      let fname = (access == 'adas') ? `${this.apiData.fileName} Vehicle` : 'Vehicle Template';
      let fileName = (access == 'adas') ? `${fname} ${date}.xlsx` : `${fname}.xlsx`;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getDiagnosticExcelData();
    }
  }

  // Export Diagnostic Data
  getDiagnosticExcelData() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['listType'] = 'download';
    this.uploadFlag = this.LandingpagewidgetsAPI.getStandardReportlistsAPI(this.apiData).subscribe((response) => {
      this.apiData['listType'] = '';
      let responseData = response.data;
      let exportData = responseData.items;
      let totalCount = responseData.total;
      this.totalLimit = totalCount;
      this.itemLength += totalCount;
      this.itemOffset += this.itemLimit;
      let minRowCount = 1;
      this.progressbarCount = (this.itemOffset > totalCount) ? (minRowCount*100).toFixed() : ((this.itemOffset / totalCount) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (totalCount == 0) {
      }
      else {
        if (this.stopexportapi) {
          console.log('in')
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  // Export Adas Data
  getAdasExcelData() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['listType'] = 'download';
    this.uploadFlag = this.LandingpagewidgetsAPI.getStandardReportlistsAPI(this.apiData).subscribe((response) => {
      this.apiData['listType'] = '';
      let responseData = response.data;
      let exportData = responseData.items;
      let totalCount = responseData.total;
      this.totalLimit = totalCount;
      this.itemLength += totalCount;
      this.itemOffset += this.itemLimit;
      let minRowCount = 1;
      this.progressbarCount = (this.itemOffset > totalCount) ? (minRowCount*100).toFixed() : ((this.itemOffset / totalCount) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (totalCount == 0) {
      }
      else {
        if (this.stopexportapi) {
          console.log('in')
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  myStyle(): object {
    return { "width": this.progressbarCountWidth };
  }
  cancelUpload() {
    this.uploadFlag.unsubscribe();
    this.downloadtextflag = 'Canceling Export';
    this.exceldownloadtrue = false;
    this.stopexportapi = true;
    this.itemOffset = 0;
    this.threadLists = [];
    this.progressbarCount = '0';
    setTimeout(() => {
      this.updateonExportisDone.emit(1);
    }, 3000);
  }
}
