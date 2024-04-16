import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  @Input() msg;
  @Input() msgType: string = "";
  @Input() bgImg: any = "";

  constructor() { }

  ngOnInit() {
  }

}
