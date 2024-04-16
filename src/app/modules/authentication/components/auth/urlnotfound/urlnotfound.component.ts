import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { pageInfo, Constant,PlatFormNames,PlatFormType } from 'src/app/common/constant/constant';

@Component({
  selector: 'app-urlnotfound',
  templateUrl: './urlnotfound.component.html',
  styleUrls: ['./urlnotfound.component.scss']
})
export class UrlnotfoundComponent implements OnInit {

  public bodyHeight: number; 
  public innerHeight: number;
  public loading: boolean = true;

  constructor(public activeModal: NgbActiveModal,  private router: Router, private titleService: Title) { this.titleService.setTitle(localStorage.getItem('platformName')+' - URL Not Found'); }

  ngOnInit(): void {

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    

  }

  // Set Screen resize Height
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight;
  }
  // Set Screen Height
  setScreenHeight() { 
    this.innerHeight = this.bodyHeight; 
    this.loading = false;   
  }  

  redirectURL(){ 
     window.location.replace(Constant.forumLiveURLLogin);
  }

}


