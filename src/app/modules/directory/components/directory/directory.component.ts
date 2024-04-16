import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  public bodyClass:string = "directory";
  public bodyElem;s
  public footerElem;

  constructor() { }

  ngOnInit(): void {
  }

}
