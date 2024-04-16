import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from '../../../services/scroll-top.service';

@Component({
  selector: 'app-workstreams',
  templateUrl: './workstreams.component.html',
  styleUrls: ['./workstreams.component.scss']
})
export class WorkstreamsComponent implements OnInit {

  public bodyClass:string = "workstreams";
  public bodyElem;

  constructor(
    private scrollTopService: ScrollTopService
  ) { }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }

}
