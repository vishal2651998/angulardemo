import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { industryTypes, PlatFormType } from '../../../common/constant/constant';

@Component({
  selector: 'app-dynamic-values',
  templateUrl: './dynamic-values.component.html',
  styleUrls: ['./dynamic-values.component.scss']
})
export class DynamicValuesComponent implements OnInit {

  @Input() apiFields: any = [];
  @Input() banner: string = "";
  @Input() startDate: any = "";
  @Input() trainingMode: any = "";
  @Input() endDate: any = "";
  @Input() defaultBanner: boolean = false;
  @Input() public group: any = "";
  @Input() industryType: any = industryTypes[0];
  @Input() type: any = '';
  @Input() marketPlaceimgUrl: any = '';
  public collabticDomain: boolean = false;
  public roFlag: boolean = false;
  public vinScanToolFlag: boolean = false;
  public optionTxt: string = "Options";
  public platform: any = localStorage.getItem('platformId');
  public dynamicValues: any = [
    {
      group: 1,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: [],
    },
    {
      group: 2,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: [],
    },
    {
      group: 3,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: [],
    },
    {
      group: 4,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: [],
    }
  ];
  dynamicValuesNew: any = [];
  startDateIndex: any;
  startTimeIndex: any;
  endDateIndex: any;
  endTimeIndex: any;
  timeZoneIndex: any;
  public emptyCont: string = "<i class='gray'>None</i>";
  inPersonData: any = [];

  constructor() { }

  ngOnInit(): void {
    let platformId = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    let catgVal:any = '';
    console.log(this.apiFields)
    for(let f in this.apiFields) {
      let optFlag = this.apiFields[f].optField;
      let group = this.apiFields[f].group;
      let fieldName = this.apiFields[f].fieldName;
      let fieldType = this.apiFields[f].fieldType;
      let formatAttr = this.apiFields[f].formatAttr;
      let formatType = this.apiFields[f].formatType;
      let selection = this.apiFields[f].selection;
      let val = (formatAttr == 1) ? this.apiFields[f].formValueItems : this.apiFields[f].formValue;
      let wsVal:any = 0;
      let threadCatgFlag = true;
      //console.log(fieldName)
      if(this.industryType.id == 2) {
        switch (fieldName) {
          case 'repairOrder':
            this.roFlag = true;    
            break;
          case 'vinNoScanTool':
            this.roFlag = false;
            this.vinScanToolFlag = true;
            break;
          case 'ThreadCategory':
            let wsVal: any = 0;
            let roIndex = this.apiFields.findIndex(option => option.fieldName === 'repairOrder');
            let roFlag = (roIndex < 0) ? false : true;
            if(roFlag) {
              let wsIndex = this.apiFields.findIndex(option => option.fieldName === 'workstreams');
              wsVal = (wsIndex < 0) ? 0 : this.apiFields[wsIndex].formValueIds[0];
            }
            val = (Array.isArray(val)) ? val[0] : val;
            threadCatgFlag = (this.industryType.id == 2 && selection == 'single' && roFlag && wsVal == 2) ? true : false;
            break;  
        }
      }
      threadCatgFlag = (this.collabticDomain && fieldName == 'ThreadCategory' && val == 'General') ? true : threadCatgFlag;
      if(fieldName != 'threadType') {
        this.apiFields[f].selectedVal = val;
      }
      if(fieldType == 'chip-input' && val.length > 0) {
        val = val.join(', ');
        this.apiFields[f].selectedVal = val;
      }

      this.apiFields[f].isArray = (formatType == 1 || fieldName == 'SelectProductType') ? false : true;
      if(this.apiFields[f].isArray && !Array.isArray(val)) {
        val = [val];
        this.apiFields[f].selectedVal = val;
      }
      if(fieldName == 'policies') {
        if(this.apiFields[f].selectedVal && Array.isArray(this.apiFields[f].selectedVal)) {
          let policynames = '';
          this.apiFields[f].selectedVal.forEach(selectedPolicy => {
            if(policynames) policynames += ', ';
            policynames += selectedPolicy.name;
          });
          this.apiFields[f].selectedVal = policynames;
        }
      }
      let di = this.dynamicValues.findIndex(option => option.group === group);
      if(fieldName == 'miles') {
        let prevIndex = parseInt(f)-1;
        let preVal = this.apiFields[prevIndex].selectedVal;
        let optVal = this.apiFields[f].selectedVal;
        let prevField = this.apiFields[prevIndex].fieldName;
        if(prevField == 'odometer') {
          if(preVal != '' && preVal != '""') {
            this.apiFields[prevIndex].selectedVal = `${preVal} <span class="joined-field">${optVal}</span>`;
          } else {
            this.apiFields[prevIndex].selectedVal = "";
          }
        }
      } else {
        if(threadCatgFlag) {
          if(optFlag) {
            this.dynamicValues[di].optFields.push(this.apiFields[f]);
          } else {
            let pushFlag = true;
            if(this.collabticDomain) {
              if(fieldName == 'ThreadCategory' && val == 'General') {
                catgVal = val[0];
                pushFlag = false;
                this.dynamicValues[di].items.unshift(this.apiFields[f]);
              }
              if(fieldName == 'threadType') {
                pushFlag = (catgVal == 'General' || catgVal == 7) ? false : pushFlag;
              }
            }
            if(pushFlag) {
              this.dynamicValues[di].items.push(this.apiFields[f]);
            }
          }
        }
      }
    }
    this.dynamicValues.forEach((dynamicValue: any, index: number) => {
      if (dynamicValue.items && dynamicValue.items.length) {
        dynamicValue.items.forEach((item: any) => {
          if (item.apiFieldKey != 'workstream' && this.type == 'market-place') {
            item.newClassName = 'new-text-background';
          } else {
            item.newClassName = '';
          }
          if ((item.apiFieldKey.includes('inPerson') && (item.selectedVal || item.selectedValues)) || item.apiFieldKey.includes('inPersonNotes')) {
            let inPersonItem = JSON.parse(JSON.stringify(item));
            this.inPersonData.push(inPersonItem);
          }
        });
        this.rearrangeDateTimeFields(this.dynamicValues, index);
      }
    });
    if (this.trainingMode === 'In-person') {
      this.rearrangeInPersonFields();
    }
    if(this.industryType.id == 2)
      this.rearrangeField(this.dynamicValues[0].items, 'odometer')
  }

  rearrangeInPersonFields() {
    if (this.inPersonData && this.inPersonData.length) {
      let inPersonValue = '<div class="mainInpersonParent">';
      let inPersonFirstFields: any = '<div class="mainParentFirst">';
      let inPersonSecondFields: any = '<div class="mainParentSecond">';
      let inPersonThirdFields: any = '<div class="mainParentThird">';
      let inPersonFourthFields: any = '<div class="mainParentFourth">';
      let inPersonFifthFields: any = '<div class="mainParentFifth">';
      let inPersonSixthFields: any = '<div class="mainParentSixth">';
      let inPersonSeventhFields: any = '<div class="mainParentSeventh">';
      this.inPersonData.forEach((inPerson: any) => {
        if ((inPerson.apiFieldKey == 'inPersonDay0' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonStartTime0' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonEndTime0' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonTimeZone0' && inPerson.selectedValues)) {
          if (inPerson.apiFieldKey == 'inPersonDay0') {
            inPersonFirstFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDateFormat(this.startDate)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime0') {
            inPersonFirstFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime0') {
            inPersonFirstFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone0') {
            inPersonFirstFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonFirstFields: ", inPersonFirstFields);
        if ((inPerson.apiFieldKey == 'inPersonDay1' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonStartTime1' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonEndTime1' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonTimeZone1' && inPerson.selectedValues)) {
          if (inPerson.apiFieldKey == 'inPersonDay1') {
            inPersonSecondFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDatePlusFormat(this.startDate, 1)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime1') {
            inPersonSecondFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime1') {
            inPersonSecondFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+', </span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone1') {
            inPersonSecondFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonSecondFields: ", inPersonSecondFields);
        if (inPerson.apiFieldKey == 'inPersonDay2' || inPerson.apiFieldKey == 'inPersonStartTime2' || inPerson.apiFieldKey == 'inPersonEndTime2' || inPerson.apiFieldKey == 'inPersonTimeZone2') {
          if (inPerson.apiFieldKey == 'inPersonDay2') {
            inPersonThirdFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDatePlusFormat(this.startDate, 2)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime2') {
            inPersonThirdFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime2') {
            inPersonThirdFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+', </span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone2') {
            inPersonThirdFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonThirdFields: ", inPersonThirdFields);
        if ((inPerson.apiFieldKey == 'inPersonDay3' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonStartTime3' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonEndTime3' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonTimeZone3' && inPerson.selectedValues)) {
          if (inPerson.apiFieldKey == 'inPersonDay3') {
            inPersonFourthFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDatePlusFormat(this.startDate, 3)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime3') {
            inPersonFourthFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime3') {
            inPersonFourthFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+', </span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone3') {
            inPersonFourthFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonFourthFields: ", inPersonFourthFields);
        if ((inPerson.apiFieldKey == 'inPersonDay4' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonStartTime4' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonEndTime4' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonTimeZone4' && inPerson.selectedValues)) {
          if (inPerson.apiFieldKey == 'inPersonDay4') {
            inPersonFifthFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDatePlusFormat(this.startDate, 4)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime4') {
            inPersonFifthFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime4') {
            inPersonFifthFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+', </span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone4') {
            inPersonFifthFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonFifthFields: ", inPersonFifthFields);
        if ((inPerson.apiFieldKey == 'inPersonDay5' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonStartTime5' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonEndTime5' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonTimeZone5' && inPerson.selectedValues)) {
          if (inPerson.apiFieldKey == 'inPersonDay5') {
            inPersonSixthFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDatePlusFormat(this.startDate, 5)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime5') {
            inPersonSixthFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime5') {
            inPersonSixthFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+', </span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone5') {
            inPersonSixthFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonSixthFields: ", inPersonSixthFields);
        if ((inPerson.apiFieldKey == 'inPersonDay6' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonStartTime6' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonEndTime6' && inPerson.selectedValues) || (inPerson.apiFieldKey == 'inPersonTimeZone6' && inPerson.selectedValues)) {
          if (inPerson.apiFieldKey == 'inPersonDay6') {
            inPersonSeventhFields += '<div class="display-flex"><span>'+inPerson.selectedValues+',&nbsp;</span><span>'+this.getDatePlusFormat(this.startDate, 6)+'</span></div>';
          }
          if (inPerson.apiFieldKey == 'inPersonStartTime6') {
            inPersonSeventhFields += '<div class="display-flex"><span>'+this.getHourFormat(inPerson.selectedValues)+'</span>';
          }
          if (inPerson.apiFieldKey == 'inPersonEndTime6') {
            inPersonSeventhFields += '&nbsp;-&nbsp;<span>'+this.getHourFormat(inPerson.selectedValues)+', </span>';
          }
          if (inPerson.apiFieldKey == 'inPersonTimeZone6') {
            inPersonSeventhFields += '&nbsp;<span>'+inPerson.selectedValues+'</span></div></div>';
          }
        }
        console.log("inPersonSeventhFields: ", inPersonSeventhFields);
      });
      if (inPersonFirstFields == '<div class="mainParentFirst">') {
        inPersonFirstFields = '';
      }
      if (inPersonSecondFields == '<div class="mainParentSecond">') {
        inPersonSecondFields = '';
      }
      if (inPersonThirdFields == '<div class="mainParentThird">') {
        inPersonThirdFields = '';
      }
      if (inPersonFourthFields == '<div class="mainParentFourth">') {
        inPersonFourthFields = '';
      }
      if (inPersonFifthFields == '<div class="mainParentFifth">') {
        inPersonFifthFields = '';
      }
      if (inPersonSixthFields == '<div class="mainParentSixth">') {
        inPersonSixthFields = '';
      }
      if (inPersonSeventhFields == '<div class="mainParentSeventh">') {
        inPersonSeventhFields = '';
      }
      inPersonValue = inPersonFirstFields + inPersonSecondFields + inPersonThirdFields + inPersonFourthFields + inPersonFifthFields + inPersonSixthFields + inPersonSeventhFields + '</div>'
      let inPersonData: any = {
        apiFieldKey: "dayTimeData",
        displayFlag: true,
        fieldName: "dayTimeData",
        fieldType: "dayTimeData",
        findex: 0,
        formValue: inPersonValue,
        formValueIds: inPersonValue,
        formValueItems: inPersonValue,
        formatAttr: 2,
        formatType: 1,
        group: 0,
        isArray: false,
        isMandatary: 1,
        newClassName: "new-inPerson-background-background",
        optField: false,
        placeholder: "Days & Time",
        sec: 1,
        selectedVal: inPersonValue,
        selection: "dayTimeData",
        threadType: "dayTimeData",
        valid: true,
        vinNo: undefined
      }
      console.log("inPersonData: ", inPersonData);
      this.dynamicValuesNew[0].items.join();
      this.dynamicValuesNew[0].items.splice(this.startTimeIndex, 0, inPersonData);
      this.dynamicValuesNew[0].items.join();
    }
  }

  rearrangeDateTimeFields(dynamicValues: any, dynamicArrayIndex: number) {
    this.dynamicValuesNew = dynamicValues;
    this.startDateIndex = this.dynamicValuesNew[dynamicArrayIndex].items.findIndex((item: any) => {
      return item.apiFieldKey == 'startDate';
    });
    this.endDateIndex = this.dynamicValuesNew[dynamicArrayIndex].items.findIndex((item: any) => {
      return item.apiFieldKey == 'endDate';
    });
    this.startTimeIndex = this.dynamicValuesNew[dynamicArrayIndex].items.findIndex((item: any) => {
      return item.apiFieldKey == 'startTime';
    });
    this.endTimeIndex = this.dynamicValuesNew[dynamicArrayIndex].items.findIndex((item: any) => {
      return item.apiFieldKey == 'endTime';
    });
    this.timeZoneIndex = this.dynamicValuesNew[dynamicArrayIndex].items.findIndex((item: any) => {
      return item.apiFieldKey == 'timeZone';
    });
    if (this.startDateIndex != '-1' && this.endDateIndex != '-1') {
      let startEndDate: any = {
        apiFieldKey: "startEndDate",
        displayFlag: true,
        fieldName: "startEndDate",
        fieldType: "startEndDate",
        findex: 0,
        formValue: this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) == this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue) ? this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) : this.getOnlyDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) +' - '+ this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue),
        formValueIds: this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) == this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue) ? this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) : this.getOnlyDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) +' - '+ this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue),
        formValueItems: this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) == this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue) ? this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) : this.getOnlyDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) +' - '+ this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue),
        formatAttr: 2,
        formatType: 1,
        group: 0,
        isArray: false,
        isMandatary: 1,
        newClassName: "new-text-background",
        optField: false,
        placeholder: "Start & End Date",
        sec: 1,
        selectedVal: this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) == this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue) ? this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) : this.getOnlyDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startDateIndex].formValue) +' - '+ this.getDateFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endDateIndex].formValue),
        selection: "startEndDate",
        threadType: "startEndDate",
        valid: true,
        vinNo: undefined
      }
      this.dynamicValuesNew[dynamicArrayIndex].items.join();
      this.dynamicValuesNew[dynamicArrayIndex].items.splice(this.startDateIndex, 0, startEndDate);
      this.dynamicValuesNew[dynamicArrayIndex].items.join();
      // this.dynamicValuesNew[dynamicArrayIndex].items.push(startEndDate);
    }
    if (this.startTimeIndex != '-1' && this.endTimeIndex != '-1') {
      let startEndTime: any = {
        apiFieldKey: "startEndTime",
        displayFlag: true,
        fieldName: "startEndTime",
        fieldType: "startEndTime",
        findex: 0,
        formValue: this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startTimeIndex + 1].formValue) +' - '+ this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endTimeIndex + 1].formValue)+', '+this.dynamicValuesNew[dynamicArrayIndex].items[this.timeZoneIndex + 1].formValue,
        formValueIds: this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startTimeIndex + 1].formValue) +' - '+ this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endTimeIndex + 1].formValue)+', '+this.dynamicValuesNew[dynamicArrayIndex].items[this.timeZoneIndex + 1].formValue,
        formValueItems: this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startTimeIndex + 1].formValue) +' - '+ this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endTimeIndex + 1].formValue)+', '+this.dynamicValuesNew[dynamicArrayIndex].items[this.timeZoneIndex + 1].formValue,
        formatAttr: 2,
        formatType: 1,
        group: 0,
        isArray: false,
        isMandatary: 1,
        newClassName: "new-text-background",
        optField: false,
        placeholder: "Start & End Time",
        sec: 1,
        selectedVal: this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.startTimeIndex + 1].formValue) +' - '+ this.getHourFormat(this.dynamicValuesNew[dynamicArrayIndex].items[this.endTimeIndex + 1].formValue)+', '+this.dynamicValuesNew[dynamicArrayIndex].items[this.timeZoneIndex + 1].formValue,
        selection: "startEndTime",
        threadType: "startEndTime",
        valid: true,
        vinNo: undefined
      }
      this.dynamicValuesNew[dynamicArrayIndex].items.join();
      this.dynamicValuesNew[dynamicArrayIndex].items.splice(this.startTimeIndex, 0, startEndTime);
      this.dynamicValuesNew[dynamicArrayIndex].items.join();
    }
  }
  onToggle(data) {
    let flag = data.optFlag;
    flag = (flag) ? false : true;
    data.optFlag = flag;
    data.toggleTxt = (flag) ? 'Hide' : 'Show';
  }

  rearrangeField(d, item) {
    let r = [];
    let index = -1;
    let yearIndex = -1;
    d.forEach((e, i) => {
      if (e['fieldName'] === item) {
        index = i;
        r.unshift(e);
      }

      if(e['fieldName'] === 'year') {
        yearIndex = i;
      }
    });

    if(index >= 0)
      d.splice(index, 1);

    d.splice(yearIndex+1, 0, r[0]);
  }
  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }
  getOnlyDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD');
    } else {
      return '';
    }
  }
  openLink(link: any) {
    if (link.indexOf('http://') == 0 || link.indexOf('https://') == 0) {
      window.open(link, '_blank');
    } else {
      const prefix = 'http://';
      link = prefix + link;
      window.open(link, '_blank');
    }
  }
  getDatePlusFormat(value: any, days: any) {
    if (value) {
      return moment(value).add(days, 'days').format('MMM DD, YYYY');
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A');
    } else {
      return '';
    }
  }
}
