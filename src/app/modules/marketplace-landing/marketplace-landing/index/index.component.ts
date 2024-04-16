import { Component, OnInit, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public loading: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;
  public fromPageName = 'training';
  public mobileBrowser: boolean = false;
  public headTitle: string = "Marketplace Landing Page";

   // Resize Widow
   @HostListener("window:resize", ["$event"])
   onResize(event) {
     this.bodyHeight = window.innerHeight;
     this.setScreenHeight();
   }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private titleService: Title,
    ) {
      this.titleService.setTitle(
        localStorage.getItem("platformName") + " - " + this.headTitle
      );
     }

  ngOnInit(): void {
    if(this.authenticationService.userValue == null){
      // detect the browsers
      setTimeout(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          /* your code here */
          this.mobileBrowser = true;
        }
        else{
          this.mobileBrowser = false;
        }
        this.loading = false;
        this.bodyHeight = window.innerHeight;
        this.setScreenHeight();
      }, 100);      
    }
    else{
      let url = "login";
      this.router.navigate([url])
    }
  }

  navigatePage(type){
    let url = "https://marketplace.collabtic.com/";
    window.open(url,url)
  }
   // Set Screen Height
   setScreenHeight() {
    this.innerHeight = this.bodyHeight-148;
   }

}

