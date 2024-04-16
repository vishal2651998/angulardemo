import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeWhiteSpace'
})
export class RemoveWhiteSpacePipe implements PipeTransform {

  /*transform(value: any, ...args: any[]): any {
    return null;
  }*/

  transform(value: string, args?: any): string {
    return value.replace(/ /g, '');
  }

}
