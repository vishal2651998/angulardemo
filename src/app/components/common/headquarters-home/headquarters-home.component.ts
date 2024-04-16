import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ApiService } from 'src/app/services/api/api.service';
import { Constant } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPasswordModelComponent } from 'src/app/modules/headquarters/set-password-model/set-password-model.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
declare let google: any;
@Component({
  selector: 'app-headquarters-home',
  templateUrl: './headquarters-home.component.html',
  styleUrls: ['./headquarters-home.component.scss']
})
export class HeadquartersHomeComponent implements OnInit {
  @Output() headquartersComponentRef: EventEmitter<HeadquartersHomeComponent> = new EventEmitter();
  @Output() callback: EventEmitter<HeadquartersHomeComponent> = new EventEmitter();
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};

  public headTitle: "Home";
  public bodyClass1: string = "parts-list";
  public redirectionPage = '';
  public pageTitleText = '';
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public roleId;
  public shopListColumns: any = [];
  public wfListColumns: any = [];
  public contentType: any = 51;

  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public isDealer: boolean = false;

  public bodyElem;
  public bodyClass2: string = "submit-loader";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
  public apiData: Object;
  public activeIndex = 0;
  public displayNoRecordsShow = 0;
  public itemEmpty;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public carouselLinks
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public createAccess: boolean = true;
  currentServicesDonutChartConfig: any = {};
  repairProcessDonutChartConfig: any = {};
  recentInspectionDonutChartConfig: any = {};
  currentServicesBarChartConfig: any = {};
  repairProcessBarChartConfig: any = {};
  currentShopData:any;
  newVsRenewalBarChartConfig:any =  {};
  currentServicesDonutChart: any;
  repairProcessDonutChart: any;
  recentInspectionDonutChart: any
  currentServicesBarChart: any;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
    size:"mySize"
  };
  repairProcessBarChart: any;
  newVsRenewalBarChart: any = {};
  googleMapInfo: any = '';
  public googleMapUrl: string = "https://www.google.com/maps/embed/v1"
  public googleApiKey: string = 'AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
  grid1Columns = [
    { field: 'inspectionName', header: 'InspectionName', columnpclass: 'w1 header thl-col-2' },
    { field: 'instanceId', header: 'Instance#', columnpclass: 'w1 header thl-col-1' },
    { field: 'instance', header: 'Instance#', columnpclass: 'w2 header thl-col-1' },
    { field: 'frequency', header: 'Frequency', columnpclass: 'w3 header thl-col-1' },
    { field: 'startDate', header: 'Start Date', columnpclass: 'w4 header thl-col-1' },
    { field: 'location', header: 'Locations', columnpclass: 'w5 header thl-col-1' },
    { field: 'totalLocations', header: 'Total Locations', columnpclass: 'w6 header thl-col-1' },
  ];

  gridStatusColumns = [
    { field: 'listoflocations', header: 'List of locations', columnpclass: 'w1 header thl-col-1 ' },
    { field: 'laststatus', header: 'Number of days since last stauts change', columnpclass: 'w1 header thl-col-2' },
    { field: 'progress', header: 'Progress', columnpclass: 'w1 header thl-col-6' },
     ];

  shopList:any = [
    {name:"Volvo",address1:'880 University Ave West, St. Paul, MN 55104',address2:" Schmelz Countryside Volkswagen",address3:"(402402)-CER 4L",progress :1 , laststatus: "Certificaiton Audit (ID# 3454)", elapsed: "12",img:"volvo.png"},
    {name:"VW of US",address1:'25 New York Ave #4, Huntington, NY 11743',address2:"Volkswagen of Smithtown",address3:"(408359)-NER 1G",progress :2 , laststatus: "CCRF Assessment (ID# 4359)", elapsed: "73",img:"vw.png"},
    {name:"BMW of US",address1:'5280 N Garfield Ave, Loveland, CO 80538',address2:"Ed Carroll Motor Company, Inc",address3:"(420112)-CER 4G",progress :3 , laststatus: "Repair Process Quality  Asssessment (ID# 4356)", elapsed: "33",img:"bmw.png"},
    {name:"Crash Champions",address1:'7920 Jaguar Trail, St. Louis, MO 63143',address2:" The Dean Team of Ballwin",address3:"(424140)-CER 4P",progress :4 , laststatus: "Collision quality (ID# 43537)", elapsed: "35",img:"crash.png"},
    {name:"Caliber",address1:'80-82 Olympia Ave, Woburn, MA 01801',address2:"Minuteman Volkswagen, Inc",address3:"(401057)-NER 1M",progress :5 , laststatus: "Automotive Lift Inspection (ID# ALI322)", elapsed: "03",img:"volvo.png"},
  ]

  grid1Data = [
    { inspectionName: "Collision quality (ID# COL368)", instanceId: "COL368", instance: "1", frequency: "1", startDate: "Jan 10, 2024", location: "150", totalLocations: "170" },
    { inspectionName: "Tools inspection (ID# TOL987)", instanceId: "TOL987", instance: "2", frequency: "2", startDate: "Feb 6, 2024", location: "80", totalLocations: "95" },
    // {inspectionName:"testName3",instanceId:"3",instance:"SWH1H3",frequency:"F3",startDate:"Jan 10, 24",location:"150",totalLocations:"501"},
    // {inspectionName:"testName4",instanceId:"4",instance:"SFH1H1",frequency:"F4",startDate:"Jan 10, 24",location:"150",totalLocations:"501"},
  ]

  grid2Columns = [
    { field: 'name', header: 'Name', columnpclass: 'w1 header thl-col-2' },
    { field: 'id', header: 'ID', columnpclass: 'w1 header thl-col-1' },
    { field: 'address', header: 'Address', columnpclass: 'w2 header thl-col-1' },
    { field: 'city', header: 'City', columnpclass: 'w3 header thl-col-1' },
    { field: 'state', header: 'State', columnpclass: 'w4 header thl-col-1' },
  ];

  grid2Data = [
    { name: "Courtesy Chrysler Jeep Dodge Ram", id: "6456", address: "9207 E Adamo Dr,", city: "Tampa", state: "Florida" },
    { name: "Courtesy Genesis of Tampa", id: "7567", address: "3810 W Hillsborough Ave,", city: "Tampa", state: "Florida" },
    { name: "Crown MINI of Richmond", id: "3455", address: "8712 W Broad St,", city: "Henrico", state: "Virginia" },
  ]

  grid3Columns = [
    { field: 'name', header: 'Name', columnpclass: 'w1 header thl-col-2' },
    { field: 'id', header: 'ID', columnpclass: 'w1 header thl-col-1' },
    { field: 'address', header: 'Address', columnpclass: 'w2 header thl-col-1' },
    { field: 'city', header: 'City', columnpclass: 'w3 header thl-col-1' },
    { field: 'state', header: 'State', columnpclass: 'w4 header thl-col-1' },
  ];

  grid3Data = [
    { name: "Courtesy Hyundai of Tampa", id: "46456", address: "9207 E Adamo Dr,", city: "Tampa", state: "Florida" },
    { name: "Crown Nissan of Greenville", id: "57567", address: "3810 W Hillsborough Ave,", city: "Tampa", state: "Florida" },
    { name: "Hare Isuzu Trucks", id: "53455", address: "8712 W Broad St,", city: "Henrico", state: "Virginia" },
  ]

  PlannedInspectionsColumns = [
    { field: 'InspectionName', header: 'Inspection Name ', columnpclass: 'w1 header thl-col-2' },
    { field: 'Instance', header: 'Instance#', columnpclass: 'w1 header thl-col-1' },
    { field: 'Instance1', header: 'Instance#', columnpclass: 'w3 header thl-col-1' },
    { field: 'Frequency', header: 'Frequency', columnpclass: 'w4 header thl-col-1' },
    { field: 'StartDate', header: 'Start Date', columnpclass: 'w5 header thl-col-1' },
    { field: 'Locations', header: 'Locations', columnpclass: 'w6 header thl-col-1' },
    { field: 'TotalLocations', header: 'Total Locations', columnpclass: 'w7 header thl-col-1' },

  ];

  PlannedInspectionsList = [
    { InspectionName: "Collision quality (ID# COL368)", Instance: "COL368", Instance1: "1", Frequency: "1", StartDate: "Jan 10, 2024", Locations: "150", TotalLocations: "170" },
    { InspectionName: "Tools inspection (ID# TOL987", Instance: "COL368", Instance1: "1", Frequency: "1", StartDate: "Jan 10, 2024", Locations: "150", TotalLocations: "170" }
  ]
  isBlank: boolean = false;
  isAssesorUser:boolean = false;
  currentAssesorFilter: string = 'month';
  networkName: string = "";
  dekraNetworkId: string | Blob;
  bannerList: any= [];
  constructor(
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private sanitizer: DomSanitizer,
    private headquarterService:HeadquarterService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    if(this.user && this.user.data && this.user.data.shopId){
      this.isDealer = true;
      this.networkName =  localStorage.getItem("networkName") ;
    }
    this.domainId = this.user.domain_id;
    if(this.domainId == 2 && this.user && this.user.Email== "karunakaran@collabtic.com"){
      this.isBlank = false;
    }else{
      this.isBlank = true;
      // this.carouselLinks = [{src:"../../../../assets/images/default-banner.jpg",index:0}];  
    }
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    if(this.router.url.includes("filled")){
      this.isBlank = false;
      // this.carouselLinks = [{src:"../../../../assets/images/default-banner.jpg",index:0}];  
    }

    if(this.router.url.includes("blank")){
      this.isBlank = true;
      // this.carouselLinks = [{src:"../../../../assets/images/default-banner.jpg",index:0}];  
    }

    if(this.router.url.includes("assesor-user")){
      this.isAssesorUser = true;
      // this.carouselLinks = [{src:"../../../../assets/images/default-banner.jpg",index:0}];  
    }
    this.getBannerList();
    google.load("visualization", "1", { packages: ["corechart"] });
    this.loadScript()
    setTimeout(() => {
      this.setupMap();
      let currentServicesDatatable = new google.visualization.DataTable();
      currentServicesDatatable.addColumn('string', 'Task');
      currentServicesDatatable.addColumn('number', 'Status');
      currentServicesDatatable.addColumn({type: 'string', role: 'tooltip'});
      currentServicesDatatable.addRows([
        ['50 - Completed', 50,'Completed - 50'],
        ['25 - Scheduled', 25,'Scheduled - 25'],
        ['30 - In-process', 30, 'In-process - 30'],
        ['25 - Not-scheduled', 25 , 'Not-scheduled - 25'],
      ])
        // data.addColumn({type:'string',role:'tooltip'});
      this.currentServicesDonutChartConfig = {
        data: currentServicesDatatable,
        options: {
          pieHole: 0.6, pieSliceText: 'value', colors: ['#3eb7a1', '#f7b94a', '#299cdb', '#444444'], 'chartArea': { 'height': '90%' },
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: { position: 'right', textStyle: { color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium' }, alignment: 'center' },
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } ,alignment: 'center'  }
        }
      }

      let repairProcessDatatable = new google.visualization.DataTable();
      repairProcessDatatable.addColumn('string', 'Task');
      repairProcessDatatable.addColumn('number', 'Status');
      repairProcessDatatable.addColumn({type: 'string', role: 'tooltip'});
      repairProcessDatatable.addRows(
        [
        ['70 - Completed', 70 , 'Completed - 70'],
        ['35 - Scheduled', 35, 'Scheduled - 35'],
        ['30 - In-process', 30, 'In-process - 30'],
        ['25 - Not-scheduled', 25, 'Not-scheduled - 25'],
        ]
      )
      this.repairProcessDonutChartConfig = {
        data: repairProcessDatatable,
        options: {
          pieHole: 0.6, pieSliceText: 'value', colors: ['#3eb7a1', '#f7b94a', '#299cdb', '#444444'], 'chartArea': { 'height': '90%' },
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: { position: 'right', textStyle: { color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium' }, alignment: 'center' },
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } }
        }
      }

      let recentInspectionsDatatable = new google.visualization.DataTable();
      recentInspectionsDatatable.addColumn('string', 'Task');
      recentInspectionsDatatable.addColumn('number', 'Status');
      recentInspectionsDatatable.addColumn({type: 'string', role: 'tooltip'});
      recentInspectionsDatatable.addRows(
        [
          ['125 - Compliant', 125,'Compliant - 125'],
          ['25 - Non-Compliant', 25, 'Non-Compliant - 25'],
        ]
      )
      this.recentInspectionDonutChartConfig = {
        data: recentInspectionsDatatable,
        options: {
          title: '', pieHole: 0.6, pieSliceText: 'value', colors: ['#3eb7a1', '#f36868'], 'chartArea': { 'height': '90%' },
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: { position: 'right', textStyle: { color: '#777777', fontSize: 13, fontName: 'Roboto-Medium' }, alignment: 'center' },
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } }
        }
      }

      let currentServicesBarDatatable = new google.visualization.DataTable();
      currentServicesBarDatatable.addColumn('string', 'Month');
      currentServicesBarDatatable.addColumn('number', 'Completed');
      currentServicesBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      currentServicesBarDatatable.addColumn('number', 'Scheduled');
      currentServicesBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      currentServicesBarDatatable.addColumn('number', 'In-process');
      currentServicesBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      currentServicesBarDatatable.addRows([
        ['FEB 23', 70,"Completed - 70", 150,"Scheduled - 150", 60,"In-process - 60"],
        ['MAR 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['APR 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['MAY 23', 70, "Completed - 70", 150,"Scheduled - 150", 60,"In-process - 60"],
        ['JUN 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['JUL 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['AUG 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['OCT 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['SEP 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['NOV 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['DEC 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
      ])
      this.currentServicesBarChartConfig = {
        data: currentServicesBarDatatable,
        options: {
          title: '', colors: ['#3eb7a1', '#f7b94a', '#299cdb'], bar: { groupWidth: "30%" }, 'chartArea': { 'width': '96%','left':'4%'},
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: 'none',
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } },
          vAxes: [{ 
              baseline:1,
              baselineColor:'f3f3f3',
              gridlines: {
                  color: '#f3f3f3',
                  count:5
              }
            },{ }],
          hAxis:{
            baseline:10,
            baselineColor:'f3f3f3',
            gridlines: {
                color: '#f3f3f3',
                count:5
            },
            textStyle : {
              fontSize: 12
            }
          }
          
        }
      }

      let repairProcessBarDatatable = new google.visualization.DataTable();
      repairProcessBarDatatable.addColumn('string', 'Month');
      repairProcessBarDatatable.addColumn('number', 'Completed');
      repairProcessBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      repairProcessBarDatatable.addColumn('number', 'Scheduled');
      repairProcessBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      repairProcessBarDatatable.addColumn('number', 'In-process');
      repairProcessBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      repairProcessBarDatatable.addRows([
        ['FEB 23', 70,"Completed - 70", 150,"Scheduled - 150", 60,"In-process - 60"],
        ['MAR 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['APR 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['MAY 23', 70, "Completed - 70", 150,"Scheduled - 150", 60,"In-process - 60"],
        ['JUN 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['JUL 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['AUG 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['OCT 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['SEP 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
        ['NOV 23', 80, "Completed - 80", 100,"Scheduled - 100", 12,"In-process - 12"],
        ['DEC 23', 60, "Completed - 60", 140,"Scheduled - 140", 40,"In-process - 40"],
      ])
      this.repairProcessBarChartConfig = {
        data: repairProcessBarDatatable,
        options: {
          title: '', colors: ['#3eb7a1', '#f7b94a', '#299cdb'], bar: { groupWidth: "30%" }, 'chartArea': { 'width': '96%','left':'4%'},
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: 'none',
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } },
          vAxes: [{ 
            baseline:1,
            baselineColor:'f3f3f3',
            gridlines: {
                color: '#f3f3f3',
                count:5
            }
          },{ }],
        hAxis:{
          baseline:10,
          baselineColor:'f3f3f3',
          gridlines: {
              color: '#f3f3f3',
              count:5
          },
          textStyle : {
            fontSize: 12
          }
        }
        }
      }
      let newVsRenewalBarDatatable = new google.visualization.DataTable();
      newVsRenewalBarDatatable.addColumn('string', 'Month');
      newVsRenewalBarDatatable.addColumn('number', 'Completed');
      newVsRenewalBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      newVsRenewalBarDatatable.addColumn('number', 'Scheduled');
      newVsRenewalBarDatatable.addColumn({type: 'string', role: 'tooltip'});
      newVsRenewalBarDatatable.addRows([
        ['FEB 23', 70,"Completed - 70", 150,"Scheduled - 150"],
        ['MAR 23', 80, "Completed - 80", 100,"Scheduled - 100"],
        ['APR 23', 60, "Completed - 60", 140,"Scheduled - 140"],
        ['MAY 23', 70, "Completed - 70", 150,"Scheduled - 150"],
        ['JUN 23', 80, "Completed - 80", 100,"Scheduled - 100"],
        ['JUL 23', 60, "Completed - 60", 140,"Scheduled - 140"],
        ['AUG 23', 80, "Completed - 80", 100,"Scheduled - 100"],
        ['OCT 23', 60, "Completed - 60", 140,"Scheduled - 140"],
        ['SEP 23', 60, "Completed - 60", 140,"Scheduled - 140"],
        ['NOV 23', 80, "Completed - 80", 100,"Scheduled - 100"],
        ['DEC 23', 60, "Completed - 60", 140,"Scheduled - 140"],
      ])
      this.newVsRenewalBarChartConfig = {
        data: newVsRenewalBarDatatable,
        options: {
          title: '', colors: ['#3eb7a1', '#f7b94a'], bar: { groupWidth: "30%" }, 'chartArea': { 'width': '96%','left':'4%'},
          titleTextStyle: {
            color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
            fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
            fontSize: 14, // 12, 18 whatever you want (don't specify px)
            bold: false,    // true or false
            italic: false,   // true of false
            alignment: 'center'
          },
          legend: 'none',
          pieSliceBorderColor: 'transparent',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { textStyle: { color: '#FFFFFF' } },
          vAxes: [{ 
            baseline:1,
            baselineColor:'f3f3f3',
            gridlines: {
                color: '#f3f3f3',
                count:5
            }
          },{ }],
        hAxis:{
          baseline:10,
          baselineColor:'f3f3f3',
          gridlines: {
              color: '#f3f3f3',
              count:5
          },
          textStyle : {
            fontSize: 12
          }
        }
        }
      }
      this.initcurrentServicesDonutChart();
      this.initRepairProcessDonutChart();
      this.initcurrentServicesBarChart();
      this.initRepairProcessBarChart();
      this.initRecentInspectionsDonutChart();
      this.initRecentNewVsRenewalBarChart();
    }, 3000);
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 2000);


    this.getShopList()
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("platform", '3');
    apiFormData.append("userId", this.userId);
    this.headquarterService.getUserDetails(apiFormData).subscribe((response:any) => {  
      let resultData = response.data;
      if(resultData && resultData.isChangePassword){
        this.openNewPasswordPopup()
      }
    })
  }

  getShopList(){
    if(this.user.data && this.user.data.shopId){
      this.loading = true;
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("shopIds", this.user.data.shopId);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("networkId",this.user.networkId.toString());
      this.headquarterService.getShopList(apiFormData).subscribe((res:any)=>{
        this.loading = false;
        if(res && res.items && res.items.length > 0){
          this.shopList = res.items[0];
        }
      })
    }
  }

  getBannerList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headquarterService.getBannerList(apiFormData).subscribe((response:any) => {
      if(response && response.data && response.data.items){
        this.carouselLinks = response.data.items.map((e,index)=>{
          return {src:e.image,index:index,fillOption:e.fillOption}
        });
      if(this.carouselLinks == 0){
        this.carouselLinks = [{src:"../../../../assets/images/default-banner.jpg",index:0,fillOption:"1"}];
      }
    }
    })
  }



  setupMap() {
    const address = '2707 N' + ' Main St' + ',' + 'Royal Oak' + ',' + 'michigan' + ',' + 48073;
    this.googleMapInfo = "";
    this.googleMapInfo = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
    this.googleMapInfo = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleMapInfo);
    console.log(this.googleMapInfo)
  }

  loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  getData() {
    this.itemEmpty = true;
    this.loading = false;
    this.lazyLoading = false;
  }

  initcurrentServicesDonutChart() {
    this.currentServicesDonutChart = new google.visualization.PieChart(document.getElementById('currentServiceDonutChart'));
    this.currentServicesDonutChart.draw(this.currentServicesDonutChartConfig.data, this.currentServicesDonutChartConfig.options);
  }

  initRepairProcessDonutChart() {
    this.repairProcessDonutChart = new google.visualization.PieChart(document.getElementById('repairProcessDonutChart'));
    this.repairProcessDonutChart.draw(this.repairProcessDonutChartConfig.data, this.repairProcessDonutChartConfig.options);
  }

  initcurrentServicesBarChart() {
    this.currentServicesBarChart = new google.visualization.ColumnChart(document.getElementById('currentServiceBarChart'));
    this.currentServicesBarChart.draw(this.currentServicesBarChartConfig.data, this.currentServicesBarChartConfig.options);
  }

  initRepairProcessBarChart() {
    this.repairProcessBarChart = new google.visualization.ColumnChart(document.getElementById('repairProcessBarChart'));
    this.repairProcessBarChart.draw(this.repairProcessBarChartConfig.data, this.repairProcessBarChartConfig.options);
  }

  initRecentInspectionsDonutChart() {
    this.recentInspectionDonutChart = new google.visualization.PieChart(document.getElementById('recentInspectionsDonutChart'));
    let chart1 = new google.visualization.PieChart(document.getElementById('recentInspectionsDonutChart1'));
    this.recentInspectionDonutChart.draw(this.recentInspectionDonutChartConfig.data, this.recentInspectionDonutChartConfig.options);
    chart1.draw(this.recentInspectionDonutChartConfig.data, this.recentInspectionDonutChartConfig.options);
  }
  initRecentNewVsRenewalBarChart(){
    this.newVsRenewalBarChart = new google.visualization.ColumnChart(document.getElementById('newVsRenewalProcessBarChart'));
    this.newVsRenewalBarChart.draw(this.newVsRenewalBarChartConfig.data, this.newVsRenewalBarChartConfig.options);
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? 30 : 0;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    console.log(headerHeight);

    this.emptyHeight = headerHeight + 46;
  }

  assessorFilterBy(param:string){
    this.currentAssesorFilter = param;
  }

  openNewPasswordPopup(){
    const modalRef = this.modalService.open(
      SetPasswordModelComponent,
      this.modalConfig
    );
    modalRef.result.then(res=>{
      const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
      msgModalRef.componentInstance.successMessage = "Password Updated.";
      setTimeout(() => {
        msgModalRef.dismiss('Cross click'); 
      }, 2000);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

