import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';

@Component({
  selector: 'app-remove-media',
  templateUrl: './remove-media.component.html',
  styleUrls: ['./remove-media.component.scss']
})
export class RemoveMediaComponent implements OnInit {
  @Input() mediaInfo: any;
  @Output() emitResponse: EventEmitter<any> = new EventEmitter();

  public removeFlag: boolean = false;
  public removeCheckFlag: boolean = false;
  public deleteCheckFlag: boolean = true;
  public emitData = {
    action: true,
    deleteStatus: '',
    removeStatus: ''
  };

  constructor() { }

  ngOnInit(): void {
    console.log(this.mediaInfo)
    this.removeFlag = this.mediaInfo.removeFlag;
  }

  checkboxChange(action) {
    switch(action) {
      case 'remove':
        this.removeCheckFlag = (this.removeCheckFlag) ? false : true;
        this.deleteCheckFlag = !this.removeCheckFlag;
        break;
      case 'delete':
        if(this.removeFlag) {
          this.deleteCheckFlag = (this.deleteCheckFlag) ? false : true;
          this.removeCheckFlag = !this.deleteCheckFlag;
        }        
        break;  
    }
  }

  action(type) {
    let delStatus: any = this.deleteCheckFlag;
    let removeStatus: any = this.removeCheckFlag;
    this.emitData.action = (type == 'cancel') ? false : true;
    this.emitData.deleteStatus = delStatus;
    this.emitData.removeStatus = removeStatus;
    this.emitResponse.emit(this.emitData);
  }

}
