import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  generateExcel(access, title, exportData,tableheader=[],workstreamdIds=[],domainId='') {
    switch(access) {
      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealers(title, exportData);
        break;
      case 'threads':
        this.exportThreadReports(title, exportData);
        break;
        case 'userDashboard':
          this.exportAllUsers(title, exportData,tableheader,workstreamdIds,domainId);
          break;
          case 'domainDashboard':
            this.exportAllDomains(title, exportData,tableheader,domainId);
            break;

          case 'userThread':
            this.exportAllThreads(title, exportData,tableheader,workstreamdIds);
            break;
    }
  }
  exportAllThreads(title, exportData,threadListHeader1,workstreamdIds)
  {

    let userThreadListData = exportData;

   // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']

   let userThreadDataLists = [];
   for (let threadList in userThreadListData) {
    let TthreadId = userThreadListData[threadList].threadId;
    let TcreatedOn = userThreadListData[threadList].createdOn;
    let Tgroups = userThreadListData[threadList].groups;
    let TpostedBy = userThreadListData[threadList].postedBy;
    let Tmake= userThreadListData[threadList].make;
    let Tmodel = userThreadListData[threadList].model;
    let TerrorCode = userThreadListData[threadList].errorCode;
    let Tdescription = userThreadListData[threadList].description;
    //let lastupdatedDate = moment.utc(UlastupdatedOn).toDate();
    //  let locallastupdatedDate = moment(lastupdatedDate).local().format('MMM DD, YYYY h:mm A');
    let threadreplies=userThreadListData[threadList].replies;
    let wst=[];
    let userListInfo;
    userListInfo = [TthreadId,TcreatedOn,Tgroups,TpostedBy,Tmake,Tmodel,TerrorCode,Tdescription];
  if(threadreplies.length>0)
    {


    for(let ws=0;ws<threadreplies.length;ws++)
    {
      var tontriButerName='"'+threadreplies[ws].contriButerName+'"';
      var tdateTime='"'+threadreplies[ws].dateTime+'"';
      var trdescription='"'+threadreplies[ws].description+'"';

      userListInfo.push(tontriButerName,tdateTime,trdescription);
    }
  }
    //let joinuser=wst.join(',');
    //console.log(joinuser);

    //return false;


//console.log(userListInfo);

userThreadDataLists.push(userListInfo);
     // return false;
   }
    let threadListHeader;
    // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']
    threadListHeader=threadListHeader1;



   let workbook = new Workbook();
   let worksheet = workbook.addWorksheet(title[0]);





   // Add Header Row

   let openTitleRow = worksheet.addRow([title[0]]);
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

/*
   let t2=0;
   userDashLists.forEach(tl => {
     t2=t2+1;
     let row = worksheet.addRow(tl);
     worksheet.getColumn(t2).width = 30;

   });
*/


let t2=0;
userThreadDataLists.forEach(tl => {
  t2=t2+1;
  let row = worksheet.addRow(tl);
  worksheet.getColumn(t2).width = 100;

  worksheet.getColumn(t2).alignment = { wrapText: true,vertical: 'middle', horizontal: 'left' };
  worksheet.properties.outlineLevelCol = 2;
worksheet.properties.defaultRowHeight = 20;
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

   //Generate Excel File with given name
   workbook.xlsx.writeBuffer().then((data) => {
     let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     fs.saveAs(blob, 'User_Threads.xlsx');
   });

  }
  // Export Dealer Data
  exportDealers(title, exportData) {
    let apiData = exportData;
    let header = ['Dealer Name', 'ID', 'Zone', 'Area', 'Territory'];
    let monthInfo = apiData[0].interdays;
    for (let m of monthInfo) {
      header.push(m.day)
    }
    header.push('Total Time');
    let data = [];
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
      data.push(dealerInfo);
    }

    if(apiData.length == data.length) {
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
      data.forEach(d => {
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

      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'Dealer_Usage.xlsx');
      });
    }
  }
  exportAllDomains(title, exportData,threadListHeader1,domainId)
  {

    let userListData = exportData;
    let threadListHeader;
   // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']
   threadListHeader=threadListHeader1;
   let userDashLists = [];
   for (let userList in userListData) {
    let domainIDInfo = userListData[userList].id;
    let subDomainUrl = userListData[userList].subDomainUrl;
    let businessName = userListData[userList].businessName;
    let industryName = userListData[userList].industryName;
    let adminName= userListData[userList].adminName;
    let emailAddress= userListData[userList].email;
    let phoneNo= userListData[userList].phoneNo;

    let UlastupdatedOn = userListData[userList].createdOn;
    let lastupdatedDate = moment.utc(UlastupdatedOn).toDate();
      let locallastupdatedDate = moment(lastupdatedDate).local().format('MMM DD, YYYY h:mm A');

    let userListInfo;

    userListInfo = [domainIDInfo,businessName,subDomainUrl,industryName,UlastupdatedOn,emailAddress,adminName,phoneNo];



    //let joinuser=wst.join(',');
    //console.log(joinuser);

    //return false;


//console.log(userListInfo);

      userDashLists.push(userListInfo);
     // return false;
   }
   let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title[0]);





    // Add Header Row

    let openTitleRow = worksheet.addRow([title[0]]);
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
    userDashLists.forEach(tl => {
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

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Domains_dashboard.xlsx');
    });

  }
  exportAllUsers(title, exportData,threadListHeader1,workstreamdIds,domainId)
  {

    let userListData = exportData;
    let threadListHeader;
   // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']
   threadListHeader=threadListHeader1;
   let userDashLists = [];
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
    //let joinuser=wst.join(',');
    //console.log(joinuser);

    //return false;


//console.log(userListInfo);

      userDashLists.push(userListInfo);
     // return false;
   }
   let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title[0]);





    // Add Header Row

    let openTitleRow = worksheet.addRow([title[0]]);
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
    userDashLists.forEach(tl => {
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

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'User_dashboard.xlsx');
    });

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
      let percentVal = openThreadsData[openThread].percentageValue+'%';
      let openThreadInfo = [status, count, percentVal];
      openData.push(openThreadInfo);
    }

    let closedHeader = ['Thread Status', 'Total Count', 'Percentage'];
    let closedData = [];
    for (let closedThread in closedThreadsData) {
      let status = closedThreadsData[closedThread].title;
      let count = closedThreadsData[closedThread].countValue;
      let percentVal = closedThreadsData[closedThread].percentageValue+'%';
      let closedThreadInfo = [status, count, percentVal];
      closedData.push(closedThreadInfo);
    }

    let threadTitle = title[1].charAt(0).toUpperCase() + title[1].slice(1);
    let threadListHeader;
    if(threadTitle == 'Open') {
      threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Frame#', 'Odo Meter', 'Title', 'Error Code', 'Description', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', '1st Reply Time', 'Thread ID', 'Time to Share Proposed Fix (Hrs)', 'Open/Closed', 'Workstreams', 'Feedback Status'];
    } else {
      threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Frame#', 'Odo Meter', 'Title', 'Error Code', 'Description', 'Status', 'Esc Level', 'Proposed Fix Date',  'Proposed Fix Content', '1st Reply Time', 'Thread ID', 'Thread Closed Date', 'Time to Time to Share Proposed Fix (Hrs)', 'Time to Close (Hrs)', 'Open/Closed', 'Workstreams', 'Feedback Status'];
    }
    let threadLists = [];
    for (let threadList in threadListData) {
      let dealerName = threadListData[threadList].dealerName;
      let dealerCode = threadListData[threadList].dealerCode;
      let userTypeName = threadListData[threadList].userTypeName;
      let zone = threadListData[threadList].zone;
      let userarea = threadListData[threadList].userarea;
      let tty = threadListData[threadList].territory;
      let prodOwner = threadListData[threadList].assigneeFirstLastname;
      let tmName = threadListData[threadList].territory_manager;
      let threadCreation = threadListData[threadList].created_on;
      let model = threadListData[threadList].model+' > '+threadListData[threadList].year;
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

      let threadId = '#'+threadListData[threadList].thread_id;
      let timeToRespond = (threadListData[threadList].exportTimeToRespond == '-' || threadListData[threadList].exportTimeToRespond == '') ? 0 : threadListData[threadList].exportTimeToRespond;
      let timeclose_status = threadListData[threadList].close_status;
      let workstreamsListthread = threadListData[threadList].workstreamsList;
      let feedbackStatus = threadListData[threadList].feedbackStatus;

      let timeToClose:any = 0;
      let openclosestatus='';
      if(timeclose_status == 1) {
        openclosestatus = 'Closed';
      } else {
        openclosestatus = 'Open';
      }

      let threadListInfo;
      if(threadTitle == 'Open') {
        threadListInfo = [dealerName, dealerCode, userTypeName, zone, userarea, tty, prodOwner, tmName, threadCreation, model, frame, odoMeter, title, errorCode, desc, threadStatus, escLevel, proposedFixDate, proposedFix_content, firstTimeReply, threadId, timeToRespond, openclosestatus, workstreamsListthread, feedbackStatus];
      } else {
        let threadCloseDate = threadListData[threadList].close_date;
        timeToClose = (threadListData[threadList].exportTimeToClose == '-' || threadListData[threadList].exportTimeToClose == '') ? 0 : threadListData[threadList].exportTimeToClose;
        threadListInfo = [dealerName, dealerCode, userTypeName, zone, userarea, tty, prodOwner, tmName, threadCreation, model, frame, odoMeter, title, errorCode, desc, threadStatus, escLevel, proposedFixDate, proposedFix_content, firstTimeReply, threadId, threadCloseDate, timeToRespond, timeToClose,openclosestatus, workstreamsListthread, feedbackStatus];
      }

      threadLists.push(threadListInfo);
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
    let openTitle = "Open Threads";
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
    let closedTitle = "Closed Threads";
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
    let threadListTitle = threadTitle+" Thread Lists";
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
    let t2=0;
    threadLists.forEach(tl => {
      t2=t2+1;
      let row = worksheet.addRow(tl);
      worksheet.getColumn(t2).width = 30;
      if(threadTitle == 'Open') {
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

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Thread_Reports.xlsx');
    });
  }
}
