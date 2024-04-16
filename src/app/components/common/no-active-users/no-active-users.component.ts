import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-active-users',
  templateUrl: './no-active-users.component.html',
  styleUrls: ['./no-active-users.component.scss']
})
export class NoActiveUsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  taponLink()
  {
    window.open('https://helpdesk.cbaconnect.com/hc/en-us/requests/new?ticket_form_id=360000617173', '_self');
  }
}
