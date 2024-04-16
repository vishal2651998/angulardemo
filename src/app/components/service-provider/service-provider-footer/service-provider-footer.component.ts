import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-service-provider-footer',
  templateUrl: './service-provider-footer.component.html',
  styleUrls: ['./service-provider-footer.component.scss']
})

export class ServiceProviderFooterComponent implements OnInit {
  currentYear = new Date().getFullYear()

  
  constructor(
    private router: Router,
  ) {
  }
  ngOnInit(): void {
  }

  openOtherUrl(url: any) {
    window.open(url, "_blank")
  }
}
