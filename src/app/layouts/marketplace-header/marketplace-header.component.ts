import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketplace-header',
  templateUrl: './marketplace-header.component.html',
  styleUrls: ['./marketplace-header.component.scss']
})
export class MarketplaceHeaderComponent implements OnInit {
  showMobileMenu: boolean = false;
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  goToLink(section: any) {
    this.showMobileMenu = false;
    if(section == 'login'){
      
    }
    else{

    }
  }

}
