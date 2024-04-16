import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlatFormType } from 'src/app/common/constant/constant';

@Component({
  selector: 'app-required-fields',
  templateUrl: './required-fields.component.html',
  styleUrls: ['./required-fields.component.scss']
})
export class RequiredFieldsComponent implements OnInit {
  @Input() fields: any = [];
  @Output() requireClose: EventEmitter<any> = new EventEmitter();
  public displayPopup: boolean = true;
  public header: string = "Required Fields";
  public innerCont: string = "Please provide the following information:";
  public CBADomain: boolean = false;
  public platformId: number = 0;
  
  constructor() { }

  ngOnInit(): void {
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
  }

  closeDialog() {
    this.displayPopup = false;    
    this.requireClose.emit(true);
  }

}
