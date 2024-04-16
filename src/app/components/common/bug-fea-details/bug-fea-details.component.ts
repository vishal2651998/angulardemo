import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bug-fea-details',
  templateUrl: './bug-fea-details.component.html',
  styleUrls: ['./bug-fea-details.component.scss']
})
export class BugFeaDetailsComponent implements OnInit {
  @Input() docData: object = {};
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public toggleOn: boolean = true;
  public data: any = {};
  public title: string;
  public description: string;
  public firstObj: boolean = false
  public attachments: any= [];
  public action: string = 'view';
  public infoLoading: boolean = true;
  public innerInfoHeight: number= 0;
  public bodyHeight: number = 0;
  public bFId: any=[];
  public bugDatas: any;
  constructor(
    private common: CommonService,
    private route: Router
  ) { }

  ngOnInit(): void {
   
    this.common.bugfeaturedataSubject.subscribe((data) => {
      this.firstObj = true;
      console.log(data)
      this.bugDatas = data;
      let id = data['Id']
      let docDetails = data['docdata'];
      let action = data['action']
      this.getdata(docDetails)
    })
    
    if(!this.firstObj){
    this.getdata(this.docData)
    }
    
    
  }
  setScreenHeight() {
    let headerHeight = 0;
    this.innerInfoHeight = (this.bodyHeight-(headerHeight+30));  
    this.innerInfoHeight = (this.bodyHeight > 1420) ? 980 : this.innerInfoHeight;
    this.innerInfoHeight = this.innerInfoHeight-90;
  }

  getdata(obj):void{
    this.title = obj['threadTitle'];
    this.description = obj['content'];
    this.description = this.description.replace( /(<([^>]+)>)/ig, '');
    this.attachments = obj['uploadContents']
    this.bFId = obj['threadId'];
    setTimeout(()=>{
      this.infoLoading = false;
      this.setScreenHeight();
    },1000)
  }

  toggleAction(): void {
    if (this.toggleOn) {
      this.data = {
        action: 'unLoad',
        docdata:this.docData
      }
    } else {
      this.data = {
        action: 'load',
        docdata:this.docData
      }
    }
    this.common.emitbugfeaturedata(this.data);
    this.toggleOn = !this.toggleOn;
  }
  viewMore(): void{
    let nav = `bug_and_features/view/${this.bFId}`
    this.route.navigate([nav]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
