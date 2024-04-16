import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { CommonService } from '../../../../../services/common/common.service';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss']
})
export class SeeMoreComponent implements OnInit {

  subscription: Subscription = new Subscription();
  public headerFlag: boolean = false;
  pageAccess: string = "escalation-product";
  public headerData: Object;
  public rightPanel: boolean = true;
  public title="Escalation";
  public searchVal:string = '';

  constructor(    private commonApi: CommonService ) { }

  ngOnInit(): void {
    
    this.headerData = {
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': true,
      'searchBg': false
    };

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        this.rightPanel = JSON.parse(flag);
      })
    );



  }

  // Apply Search
  applySearch(val) {    
    if(this.searchVal == '' && val == ''){
        // empty
    } 
    else{
      this.searchVal = val;
      this.commonApi.emitEscalationLevelView(val);
    }     
  }

  ngOnDestroy() {
        this.subscription.unsubscribe();
      }
  }
