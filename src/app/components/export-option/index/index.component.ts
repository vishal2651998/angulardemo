import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common/common.service';
import { ExportOptionService } from '../../../services/export-option/export-option.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
declare var $:any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  date1: Date;
  date2: Date;
  public headerFlag: boolean = false;
  public headerData: Object;
  public countryId;
    public domainId;
    public userId;
    public userparamDataValue;
    public downloadtextflag='Exporting data to Excel..';
    public roleId;
    public apiData: Object;
    public itemLimit: number = 20;
    public isCheckednoManager = false;
    public itemOffset: number = 0;
    public itemOffsetinitiate:boolean= false;
    public stopexportapi:boolean= true;
    public exceldownloadtrue:boolean= false;
    public itemLength: number = 0;
    public itemTotal: number = 0;
    public dataitemLimit=0;
    public progressbarCount="0";
    public userthreadheadsArr=[];
    public userThreadDataLists=[];
  public access: string = "";
  public exportDataFlag;
  public titleFlag: boolean;
  public exportFlag: boolean;
  public exportFlagthread: boolean;
  public userDashboardheadswid=[];
  public exportLoading: boolean = false;
  public excelreportdiaLog: boolean = false;
  public exportLoadingAll: boolean = false;
  public exportData: any;
  pageAccess: string = "exportoption";

  public user: any;

  constructor(
    private titleService: Title,
    private router: Router,
    private exportOptionAPI: ExportOptionService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService,

  // private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - Export Threads');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'isActive': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset

    }

    this.apiData = apiInfo;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
    this.headerData = {
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': false
    };
  }
  else
  {
    this.router.navigate(['/forbidden']);
  }
  this.threadheaderexport();
}

applySearch(action, val) {
}



exportallThreads()
{
  //this.itemLimit=20;
  this.itemOffset=0;
  let title = "Thread Export";

        let exportInfo = [title,'All'];
        this.exportUserThreadALL(exportInfo);
}

exportUserThreadALL(exportInfo)
{
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'isActive': 1,
    'limit': this.itemLimit,
    'offset': this.itemOffset

  }
  this.apiData = apiInfo;
  this.excelreportdiaLog=true;
  this.downloadtextflag='Exporting data to Excel..';
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('offset', this.apiData['offset']);
  apiFormData.append('limit', this.apiData['limit']);

  //this.progressbarCount=5;
  this.exportDataFlag= this.exportOptionAPI.GetallThreadExportData(apiFormData).subscribe((response) => {
    let exportData = response.threadData;
    let total_count=response.total;
    //total_count=140;

    this.itemTotal=total_count;
    if(this.itemOffset==0)
    {
      this.itemOffsetinitiate=true;
    }
    else
    {
      this.itemOffsetinitiate=false;
    }
    this.itemLength += total_count;
    this.itemOffset += this.itemLimit;
    //alert(this.itemOffset+'--'+total_count);
    this.progressbarCount=((this.itemOffset/total_count)*100).toFixed(0);

//alert(this.progressbarCount);
    //alert(this.itemOffset);
    if (total_count == 0) {
    }
    else
    {


      if(this.stopexportapi)
      {
        if(this.itemOffset>=this.itemTotal)
      {
        this.exceldownloadtrue=true;;
      }
        this.exportAllThreads( exportInfo, exportData,this.userthreadheadsArr,this.userDashboardheadswid);
      }

      if(this.itemOffset>=this.itemTotal)
      {
this.stopexportapi=false;
      }
    }

  //this.excelService.generateExcel('userThread', exportInfo, exportData,this.userthreadheadsArr,this.userDashboardheadswid);

});
}
threadheaderexport()
{
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);


  this.exportOptionAPI.GetThreadExportAll(apiFormData).subscribe((response) => {
    if(response.status=='Success')
    {
     let threadHeaderDataInfo= response.threadHeader;
     let dataLimit= response.dataLimit;
     this.dataitemLimit=dataLimit;
     this.itemLimit=this.dataitemLimit;
     for (let md2  in threadHeaderDataInfo)
     {
       this.userthreadheadsArr.push(threadHeaderDataInfo[md2].name);
       //console.log(headdataInfo[md1].name);
     }
     let modelDataInfo= response.modelData;
    for (let md in  modelDataInfo)
    {
      let headdataInfo=modelDataInfo[md].data;
      //console.log(modelDataInfo[md]);
      for (let md1  in headdataInfo)
      {
        this.userthreadheadsArr.push(headdataInfo[md1].name);
        //console.log(headdataInfo[md1].name);
      }

    }
    }
   // console.log(response);
  });
}


exportAllThreads(title, exportData,threadListHeader1,workstreamdIds)
  {

    let userThreadListData = exportData;
   //let userThreadDataLists;
   // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']


   if(this.itemOffsetinitiate==true)
   {
    //this.userThreadDataLists = [];
   }
   for (let threadList in userThreadListData) {
    let TthreadId = userThreadListData[threadList].threadId;
    let TcreatedOn = userThreadListData[threadList].createdOn;
    let Tgroups = userThreadListData[threadList].groups;
    let TpostedBy = userThreadListData[threadList].postedBy;
    let Tmake= userThreadListData[threadList].make;
    let Tmodel = userThreadListData[threadList].model;
    let TcurrentDtc = userThreadListData[threadList].currentDtc;
    let TerrorCodearr=[];
    if(TcurrentDtc.length>0)
    {
      for (let err in TcurrentDtc)
      {
        var coderr=TcurrentDtc[err].code+' '+TcurrentDtc[err].description;
        TerrorCodearr.push(coderr);
      }
    }
    let TerrorCode='';
    if(TerrorCodearr)
    {
      TerrorCode=TerrorCodearr.join(', ');
    }
    let TthreadTitle = userThreadListData[threadList].threadTitle;
   // let TerrorCode = userThreadListData[threadList].errorCode;
    let Tdescription = userThreadListData[threadList].description;
    let TthreadLink = userThreadListData[threadList].threadLink;
    let Tview = userThreadListData[threadList].view;
    let Tcomment = userThreadListData[threadList].comment;
    let TlikeCount= userThreadListData[threadList].likeCount;
    let TpinCount = userThreadListData[threadList].pinCount;
    let TcloseStatusText = userThreadListData[threadList].closeStatusText;
    let TcloseDate = userThreadListData[threadList].closeDate;
   let locallTcloseDate='';
    if(TcloseDate==' 0000-00-00 00:00:00')
    {
      locallTcloseDate='';
    }
    else
    {
      if(TcloseDate)
      {
        let lTcloseDate = moment.utc(TcloseDate).toDate();
        locallTcloseDate = moment(lTcloseDate).local().format('MMM DD, YYYY h:mm A');
      }

    }
    let TfixStatusbulb = userThreadListData[threadList].fixStatusbulb;
    let TthreadType = userThreadListData[threadList].threadType;
    let TthreadDescFix = userThreadListData[threadList].threadDescFix;
    let ThourminThread = userThreadListData[threadList].hourThread+' '+userThreadListData[threadList].minThread;
    let TpartUsed = userThreadListData[threadList].partUsed;
    let TdifficultyLevel = userThreadListData[threadList].difficultyLevel;
    let TspecialTools = userThreadListData[threadList].specialTools;
    let lastTcreatedOn = moment.utc(TcreatedOn).toDate();
      let locallastTcreatedOn = moment(lastTcreatedOn).local().format('MMM DD, YYYY h:mm A');

    let threadreplies=userThreadListData[threadList].replies;
    let wst=[];
    let userListInfo;
    let platformId = localStorage.getItem("platformId");
    if(platformId!='3')
    {
      userListInfo = [TthreadId,locallastTcreatedOn,Tgroups,TpostedBy,Tmake,Tmodel,TerrorCode,TthreadTitle,Tdescription,TthreadLink,Tview,Tcomment,TlikeCount,TpinCount,TcloseStatusText,locallTcloseDate,TfixStatusbulb,TthreadType,TthreadDescFix,ThourminThread,TdifficultyLevel,TpartUsed,TspecialTools];
    }
    else
    {
      userListInfo = [TthreadId,locallastTcreatedOn,Tgroups,TpostedBy,Tmake,Tmodel,TerrorCode,TthreadTitle,Tdescription,TthreadLink,Tview,Tcomment,TlikeCount,TpinCount,TcloseStatusText,locallTcloseDate,TfixStatusbulb,TthreadType];
    }





    for(let ws=0;ws<threadreplies.length;ws++)
    {
      var tontriButerName=threadreplies[ws].postedBy;
      var trcreatedOn=threadreplies[ws].createdOn;
      let lasttrcreatedOn = moment.utc(trcreatedOn).toDate();
      let locallasttrcreatedOn = moment(lasttrcreatedOn).local().format('MMM DD, YYYY h:mm A');
      var trdescription=threadreplies[ws].description;
      var trreplyStatus=threadreplies[ws].fixStatusbulb;

      userListInfo.push(tontriButerName,locallasttrcreatedOn,trdescription,'',trreplyStatus);
    }

    //let joinuser=wst.join(',');
    //console.log(joinuser);

    //return false;


//console.log(userListInfo);

this.userThreadDataLists.push(userListInfo);
     // return false;
   }
    let threadListHeader;
    // threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Title', 'Error Code', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', 'Thread ID', 'Time to Respond','Open/Closed','Workstreams']
    threadListHeader=threadListHeader1;



   let workbook = new Workbook();
   let worksheet = workbook.addWorksheet('Thread report');





   // Add Header Row

   let openTitleRow = worksheet.addRow(['Thread report']);
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
let t3=0;
console.log(threadListHeader);
this.userThreadDataLists.forEach(tl => {
  t2=t2+1;
  //console.log(t2);
  let row = worksheet.addRow(tl);

  let collength=this.userThreadDataLists[t3].length;
 // console.log(userThreadDataLists[t3]);
for (let c1=1;c1<collength;c1++)
{
  if(threadListHeader[c1]==='Reply attachments')
  {
    worksheet.getColumn(c1).width = 100;
  }
  if(c1==9)
  {
    worksheet.getColumn(c1).width = 100;

    //worksheet.getColumn(c1).height = 100;

  }
  if(c1==19)
  {
    worksheet.getColumn(c1).width = 70;

    //worksheet.getColumn(c1).height = 100;

  }
  if(c1==10)
  {
    worksheet.getColumn(c1).width = 50;
  }
  if(c1!=10 && c1!=9 && c1!=19 && threadListHeader[c1]!='Reply attachments')

  {
    worksheet.getColumn(c1).width = 20;
   // worksheet.properties.defaultRowHeight = 20;
  }


  /*
  worksheet.getColumn(c1).eachCell((cell, number) => {
    console.log('Cell ' + number + ' = ' + cell.value);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E55554' },
      bgColor: { argb: 'FFFFFF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  });
 */
worksheet.getColumn(c1).alignment = { wrapText: true,vertical: 'middle', horizontal: 'left' };
//worksheet.properties.outlineLevelCol = 2;
//worksheet.getRow(c1).height  = 50;
worksheet.properties.defaultRowHeight = 30;

}

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
 t3=t3+1;
});
/*
for (let q=0;q<userThreadDataLists.length;q++)
{
//console.log(userThreadDataLists[q]);
let collength=userThreadDataLists[q].length;
for (let c1=0;c1<collength;c1++)
{

  worksheet.getColumn(c1).width = 20;

worksheet.getColumn(c1).alignment = { wrapText: true,vertical: 'middle', horizontal: 'left' };
worksheet.properties.outlineLevelCol = 2;
worksheet.properties.defaultRowHeight = 20;
}


}
*/



   worksheet.addRow([]);
   worksheet.addRow([]);

//alert(this.exceldownloadtrue);
   if(this.exceldownloadtrue)
{
  this.progressbarCount='100';
  this.downloadtextflag='Processing Excel';

  setTimeout(() => {
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Thread_report.xlsx');
    });
    this.exceldownloadtrue=false;
    this.stopexportapi=true;
    this.itemLimit=this.dataitemLimit;
    this.itemOffset=0;
    this.progressbarCount='0';
  this.excelreportdiaLog=false;
  this.downloadtextflag='Exporting data to Excel..';
  },3000);
}
else
{
  this.exportUserThreadALL('');
  this.exportUsertest();

}
   //Generate Excel File with given name


  }

  exportUsertest()
  {
    //alert(this.itemOffset+'---'+this.itemTotal);
  }


  cancelUpload()
  {
    this.exportDataFlag.unsubscribe();
    this.downloadtextflag='Canceling Export';
    this.excelreportdiaLog=false;
    this.exceldownloadtrue=false;
    this.stopexportapi=true;
    this.itemOffset=0;
    this.userThreadDataLists=[];
    this.progressbarCount='0';

  }

}
