import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafePipePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  public transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
