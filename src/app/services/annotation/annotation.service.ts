import { Injectable } from '@angular/core';
import { OpenTokSDK } from 'opentok-accelerator-core';
import { Constant } from 'src/app/common/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  otSDK: any;

  constructor() { }

  initSession(sessionId, token): void {
    this.otSDK = new OpenTokSDK({ apiKey: Constant.VonageApiKey, sessionId, token })
  }
}
