import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';
import { ApiService } from "../../../services/api/api.service";

@Component({
  selector: 'app-system-info-view',
  templateUrl: './system-info-view.component.html',
  styleUrls: ['./system-info-view.component.scss']
})
export class SystemInfoViewComponent implements OnInit {

  @Input() systemInfo: any;
  @Input() customStyle: any = false;
  @Input() noPaddingStyle: any = false;
  public headerFlag: boolean = false;
  public workstreams: any;
  public workstreamsList: any;
  public categoryList: any;
  public userInfo: any;
  public docApproveFlag: boolean = false;
  public knowledgeData: boolean = false;

  constructor(
    private commonApi: CommonService,
    private apiUrl: ApiService,
  ) { }

  ngOnInit(): void {
    this.headerFlag = this.systemInfo.header;

    this.workstreams = this.systemInfo.workstreams;
    console.log(this.workstreams)

    if(this.systemInfo.knowledgeData != undefined){
      this.knowledgeData = this.systemInfo.knowledgeData ? true : false;
      if(this.knowledgeData){
        this.workstreamsList = this.systemInfo.workstreamsList;
        this.categoryList = this.systemInfo.categoryList;
      }
    }
    
    /*if(this.workstreams!=''){
      let workstreamsItems: any = [];
      for(let e of this.workstreams) {
        workstreamsItems.push(e.name);
      }
      workstreamsItems = Array.from(new Set(workstreamsItems));
      this.workstreams = [];
      this.workstreams.push({
        name: workstreamsItems
      });
    }*/
    
    this.userInfo = this.systemInfo.userInfo;
    console.log(this.userInfo.approveFlag);
    this.userInfo.approveFlag = this.userInfo.approveFlag != undefined ?  this.userInfo.approveFlag : false;
    
  }
 
  categoryItemList(item){
    let data = {
      action: 'close',
      wdata: ''
    }
    if(item.id != localStorage.getItem('kaCatID')){
      localStorage.getItem('kaCatName'); 
      setTimeout(() => {        
        this.commonApi.emitKADetailCloseData(data);
      }, 500);
      let cdata = {
        cid: item.id,
        cname: item.name,
        detailview: '1'
      }
      this.apiUrl.knowledgeArtCall = "1";
      this.commonApi.emitKnowledgeCatListData(cdata);
    }
    else{
      this.commonApi.emitKADetailCloseData(data);
    }
     
  }
  workstreamItemList(item){
    console.log(item);
    let data = {
      action: 'close',
      wdata: item.workstreamId
    }
    this.commonApi.emitKADetailCloseData(data);   
  }

}
