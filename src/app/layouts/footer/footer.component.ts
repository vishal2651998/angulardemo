import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() accessModule;

  public cont: string = "Comments/Questions Email us at";
  public email: string = "support@collabtic.com";

  constructor() { }

  ngOnInit() {
    //console.log(this.accessModule)
  }

}
