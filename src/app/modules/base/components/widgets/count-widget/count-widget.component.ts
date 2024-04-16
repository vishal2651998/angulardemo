import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-count-widget',
  templateUrl: './count-widget.component.html',
  styleUrls: ['./count-widget.component.scss']
})
export class CountWidgetComponent implements OnInit {

  @Input() title: any;
  @Input() colorCode: any;
  @Input() count: any;
  constructor() { }

  ngOnInit(): void {
    
  }
}
