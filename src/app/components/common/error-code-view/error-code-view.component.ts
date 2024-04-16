import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-code-view',
  templateUrl: './error-code-view.component.html',
  styleUrls: ['./error-code-view.component.scss']
})
export class ErrorCodeViewComponent implements OnInit {

  @Input() errorCodes: any;
  public emptyCont: string = "<i class='gray'>None</i>";

  constructor() { }

  ngOnInit(): void {
  }

}
