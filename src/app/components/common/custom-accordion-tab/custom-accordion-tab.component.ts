import { Component, OnInit, Input, Output, TemplateRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AccordionOptions } from 'src/app/models/customAccordion.model';

@Component({
  selector: 'app-custom-accordion-tab',
  templateUrl: './custom-accordion-tab.component.html',
  styleUrls: ['./custom-accordion-tab.component.scss']
})
export class CustomAccordionTabComponent implements OnInit {

  @Input() Config: AccordionOptions = {
    multiple: true,
    isFirstSelected: true,
    imageClass: '',
    title: 'Header'
  };
  
  @Input() wrapperClass: string = "";
  @Input() headerTemplate: TemplateRef<any> = null;
  @Input() headerPreWidgetsTemplate: TemplateRef<any> = null;
  @Input() headerPostWidgetsTemplate: TemplateRef<any> = null;
  @Output() onExpand: EventEmitter<any> = new EventEmitter();
  @Output() onCollapse: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onTabClose($event) {
    this.onCollapse.emit($event);
  }

  onTabOpen($event) {
    this.onExpand.emit($event);
  }

}
