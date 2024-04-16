import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ThreadService } from 'src/app/services/thread/thread.service';

@Component({
  selector: 'app-view-policy',
  templateUrl: './view-policy.component.html',
  styleUrls: ['./view-policy.component.scss']
})
export class ViewPolicyComponent implements OnInit {
  @Input() public policyId;
  @Input() public domainId;
  @Output() closePolicyPopup: EventEmitter<any> = new EventEmitter();

  loading: boolean;
  policyContent: string;
  policyName: string;
  policyTagsList: any[];
  showPolicy = true;
  constructor(private threadApi: ThreadService, private sanitized: DomSanitizer) { }

  ngOnInit(): void {
    this.getPolicyData(this.policyId)
  }
  getPolicyData(id: number) {
    this.loading = true;
    let data = {
      domainId: this.domainId,
      policyId: id,
    };
    this.threadApi.apiMarketPlacePolicyData(data).subscribe((res: any) => {
      this.policyContent = "";
      this.policyName = "";
      this.policyTagsList = [];
      if(res && res.status == 'Success' && res.policy) {
        this.policyContent = res.policy.content;
        this.policyName = res.policy.name;
        this.policyTagsList = res.policy.tagsList.map((item) => item.name);
      }
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
    })
  }
  closePopup(){
    this.showPolicy = false;
    this.closePolicyPopup.emit(true);
  }
  transformHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
    // this.sanitized.bypassSecurityTrustStyle(value);
  }
}
