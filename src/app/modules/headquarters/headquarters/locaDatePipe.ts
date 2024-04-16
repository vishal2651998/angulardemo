import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localDatePipe'
  })
  export class localDatePipe implements PipeTransform {
    transform(value: string): string {
        if(value){
            return new Date(value.toString() + " UTC").toString();
        }else{
            return ""
        }
    }
  }