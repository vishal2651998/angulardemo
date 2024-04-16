import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-upload-attachments',
  templateUrl: './upload-attachments.component.html',
  styleUrls: ['./upload-attachments.component.scss']
})
export class UploadAttachmentsComponent implements OnInit {

  @Input() attachments: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.attachments)
  }

}
