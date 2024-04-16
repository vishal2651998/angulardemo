import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../../services/common/common.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-dynamic-page-view',
  templateUrl: './dynamic-page-view.component.html',
  styleUrls: ['./dynamic-page-view.component.scss']
})
export class DynamicPageViewComponent implements OnInit {

  subscription: Subscription = new Subscription();
  public kbApiCall;
  public loading: boolean = true;

  constructor(
    private commonApi: CommonService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      (this.kbApiCall = this.commonApi.knowledgeBaseViewDataReceivedSubject.subscribe(
        (knowledgeBaseData) => { 
          console.log(knowledgeBaseData);         
          this.getKBInfoData(knowledgeBaseData);  
        }
        ))
      );

  }

  
  getKBInfoData(knowledgeBaseData) {
    this.loading = false;
    console.log(knowledgeBaseData);
    /*let action = knowledgeBaseData["action"];

    switch (action) {     
      case "":
      break;      
      default:
      break;
    }*/

      
  }

}
