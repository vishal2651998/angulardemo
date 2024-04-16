import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { GtsService } from 'src/app/services/gts/gts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit, OnDestroy, OnChanges {

  @Input() processSteps: any;
  @Input() stepName: any;
  @Input() required: number;
  @Input() actionButionSyncer: Observable<any>;
  items: any = [];
  activeId: any;
  @Output() nextProcessId = new EventEmitter<number>();
  actionButionSyncerSubscriber: any;
  isDisabled = true;

  constructor(
    public gtsApi: GtsService
  ) { }

  ngOnInit(): void {

    this.isDisabled = this.required > 0 ? false : true;
    this.allSpecificButtons();

    this.actionButionSyncerSubscriber = this.actionButionSyncer.subscribe(res => {
      this.allSpecificButtons();



      setTimeout(() => {
        for (let input of this.processSteps.userInputs) {
          if (input.isRequired > 0 && input.vaild == false) {
            this.isDisabled = true;
            return;
          }
        }
        this.isDisabled = false;
      }, 200);
    });
  }

  ngOnDestroy(): void {
    this.actionButionSyncerSubscriber.unsubscribe();
  }

  ngOnChanges(): void {
    this.isDisabled = this.required > 0 ? false : true;
  }

  allSpecificButtons() {

    this.items = [];
    const successButtonText = ['ok', 'confirm', 'complete', 'yes'];
    const errorButtonText = ['not ok', 'no'];
    let warningButtonText: any = [];
    if (this.stepName == 'info') {
      warningButtonText = ['skip'];
    } else {
      warningButtonText = ['optional', 'skip'];
    }
    this.processSteps.actionOptions.map((option) => {
      const name = option.name;
      console.log("name: ", name);
      if (successButtonText.includes(name.toLowerCase())) {
        this.items.push({
          className: 'p-button-success',
          icon: 'pi-check',
          label: name,
          id: option.id,
          nextProcessId: option.nextProcessID,
          active: (option.name == this.processSteps.actionStatusName) ? true : false,
          contentId: this.processSteps.contentId,
          instructionType: this.processSteps.instructionType,
          processStepEnabled: this.processSteps.processStepIsEnabled
        })
      } else if (errorButtonText.includes(name.toLowerCase())) {
        this.items.push({
          className: 'p-button-danger',
          icon: 'pi-times',
          label: name,
          id: option.id,
          nextProcessId: option.nextProcessID,
          active: (option.name == this.processSteps.actionStatusName) ? true : false,
          contentId: this.processSteps.contentId,
          instructionType: this.processSteps.instructionType,
          processStepEnabled: this.processSteps.processStepIsEnabled
        })
      } else if (warningButtonText.includes(name.toLowerCase())) {
        this.items.push({
          className: 'p-button-warning',
          icon: 'pi-angle-double-right',
          label: name,
          id: option.id,
          nextProcessId: option.nextProcessID,
          active: (option.name == this.processSteps.actionStatusName) ? true : false,
          contentId: this.processSteps.contentId,
          instructionType: this.processSteps.instructionType,
          processStepEnabled: this.processSteps.processStepIsEnabled
        })
      } else if (name.toLowerCase() != 'optional') {
        this.items.push({
          className: 'p-button-secondary color-white',
          icon: '',
          label: name,
          id: option.id,
          nextProcessId: option.nextProcessID,
          active: (option.id == this.processSteps.actionStatusName) ? true : false,
          contentId: this.processSteps.contentId,
          instructionType: this.processSteps.instructionType,
          processStepEnabled: this.processSteps.processStepIsEnabled
        })
      }
    });
  }

  updateProdecureData(item, active) {
    this.items.forEach((oldItem) => {
      if (oldItem.id != item.id) {
        oldItem.active = false;
      } else if (oldItem.id == item.id) {
        if (oldItem.label != item.label) {
          oldItem.active = false;
        }
      }
    });
    item.active = true;
    this.nextProcessId.emit(item);
  }
}
