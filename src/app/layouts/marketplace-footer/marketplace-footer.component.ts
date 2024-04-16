import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-marketplace-footer',
  templateUrl: './marketplace-footer.component.html',
  styleUrls: ['./marketplace-footer.component.scss']
})
export class MarketplaceFooterComponent implements OnInit {

  public year = moment().year();
  constructor() { }

  ngOnInit(): void {
  }

}
