import { Component, OnInit } from '@angular/core';
import { ScrollTopService } from '../../../../services/scroll-top.service';

@Component({
  selector: 'app-monthly-escalations',
  templateUrl: './monthly-escalations.component.html',
  styleUrls: ['./monthly-escalations.component.scss']
})
export class MonthlyEscalationsComponent implements OnInit {

  constructor(
    private scrollTopService: ScrollTopService
  ) { }

  ngOnInit() {
    this.scrollTopService.setScrollTop();
  }

}
