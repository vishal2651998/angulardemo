import { Injectable } from '@angular/core';
import { Constant } from '../common/constant/constant';
import * as OT from '@opentok/client';
import { MatSnackBar } from '@angular/material';

declare let AccCore: any;

@Injectable({
  providedIn: 'root',
})
export class CallsService {

  joining: boolean = true;
  whoIsJoined: string = '';

  otCore: any;
  options: any = {};
  sessionId: any = null;
  token: any = null;

  user: any = JSON.parse(localStorage.getItem('user'));

  users: any = [];
  groupName: string = '';
  session: OT.Session;

  publisher: OT.Publisher;

  onCall = false;
  incomingCall: boolean = false;
  meetingEnded: boolean = false;
  streams: Array<OT.Stream> = [];

  channel: BroadcastChannel;

  rejoin: boolean = false;

  outgoingCall = false;
  outgoingCallRing: HTMLMediaElement;

  publishAudio: boolean = true;
  publishVideo: boolean = false;

  subscriberCamera: any;
  sharing: boolean = false;
  enableSharing: boolean = false;
  screenSharingStream: OT.Stream;

  isWebcam: boolean = true;
  isFullScreen: boolean = false;

  state = {
    connected: false,
    active: false,
    publishers: null,
    subscribers: null,
    meta: null,
    localAudioEnabled: true,
    localVideoEnabled: true,
    ringPause: false
  };

  annotationToolbarContainer: HTMLElement;

  deviceOptions = {
    os: null,
    browserName: null
  };

  constructor(private snackBar: MatSnackBar) {
    this.annotationToolbarContainer = <HTMLElement>document.getElementById('annotationToolbarContainer')
  }

  get getOT() {
    return OT;
  }

  populateDeviceSources(selector, kind) {
    OT.getDevices((err, devices) => {
      if (err) {
        alert('getDevices error ' + err.message);
        return;
      }
      let index = 0;
      selector.innerHTML = devices.reduce((innerHTML, device) => {
        if (device.kind === kind) {
          index += 1;
          return `${innerHTML}<option value="${device.deviceId}">${device.label || device.kind + index}</option>`;
        }
        return innerHTML;
      }, '');
      // publishBtn.disabled = false;
    });
  }

  internalInitSession(sessionId, token, groupName) {

    if (this.users.length === 0) {
      return;
    }

    this.groupName = (groupName) ? groupName : '';

    this.session = this.getOT.initSession(Constant.VonageApiKey, sessionId);
    this.token = token;

    localStorage.setItem('videoCallDataToken', token);
    localStorage.setItem('videoCallDataSessionId', sessionId);

    this.connect().then(res => {
      console.log('connect event occur');
    });
    this.session.on('streamCreated', (event) => {
      if (this.outgoingCall && !this.onCall) {
        this.outgoingCall = false;
        this.outgoingCallRing.pause();
        const url = 'video-call';
        this.openInNewTab(url);
      }
    });
  }

  openInNewTab(url: any) {
    var a = document.createElement("a");
    a.href = '/'+url;
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
    a.dispatchEvent(event);
  }

  initOptions() {
    this.options = {
      credentials: {
        apiKey: Constant.VonageApiKey,
        sessionId: this.sessionId,
        token: this.token
      },
      streamContainers: function streamContainers(pubSub, type, data) {
        return {
          publisher: {
            camera: '#cameraPublisherContainer',
            screen: '#screenPublisherContainer',
          },
          subscriber: {
            camera: '#cameraSubscriberContainer',
            screen: '#screenSubscriberContainer',
          },
        }[pubSub][type];
      },
      controlsContainer: '#controls',
      packages: ['screenSharing', 'annotation'],
      communication: {
        callProperties: {
          name: `${this.user.Username} (${this.deviceOptions.browserName} ${(this.deviceOptions.os) ? `- Operating system: ${this.deviceOptions.os}` : ''})`,
          showControls: true,
          publishVideo: this.publishVideo,
          style: {
            nameDisplayMode: 'on'
          },
        },
      },
      screenSharing: {
        extensionID: 'plocfffmbcclpdifaikiikgplfnepkpo',
        annotation: true,
        externalWindow: false,
        dev: true,
        screenProperties: null,
      },
      annotation: {
        absoluteParent: {
          publisher: '.call-popup',
          subscriber: '.call-popup',
        }
      },
    }
  }

  createEventListeners() {
    const events = [
      'subscribeToCamera',
      'unsubscribeFromCamera',
      'subscribeToScreen',
      'unsubscribeFromScreen',
      'startScreenShare',
      'endScreenShare',
    ];
    events.forEach(event => this.otCore.on(event, ({ publishers, subscribers, meta }) => {
      this.state.publishers = publishers;
      this.state.subscribers = subscribers;
      this.state.meta = meta;
      this.sharing = meta.subscriber.screen ? true : false;
      this.enableSharing = this.sharing;
      console.log(event);
      if (event == 'subscribeToCamera') {
       // this.joining = false;
      }
      if (event == 'unsubscribeFromScreen') {
        document.getElementById('screenSubscriberContainer').style.display = 'none';
        document.getElementById('screenPublisherContainer').style.display = 'none';
      }
      if (this.sharing) {
        document.getElementById('startScreenSharing').style.display = 'none';
        document.getElementById('wrapper').style.display = 'none';
      } else {
        document.getElementById('startScreenSharing').style.display = 'block';
        document.getElementById('wrapper').style.display = 'grid';
      }
      if (event == 'unsubscribeFromScreen') {
        for (let i = 0; i < subscribers.length; i++) {
          if (subscribers[i].stream.hasAudio) {
            subscribers[i].subscribeToAudio(true);
          } else {
            subscribers[i].subscribeToAudio(false);
          }
        }
        document.querySelector('.OT_edge-bar-item.OT_mute').addEventListener('click', (event1: Event) => {
          // this.isSubscriberAudioOn = !this.isSubscriberAudioOn;
          // subscriber.subscribeToAudio(this.isSubscriberAudioOn);
          console.log('audio', event1);
        });
      }
      console.log(event, this.state, 'sharing');
      if (this.sharing && this.annotationToolbarContainer) {
        this.annotationToolbarContainer.style.display = 'none';
      }
      this.togglePublisherVideoElement();
    }));
    this.startCall();
  }

  togglePublisherVideoElement() {
    if (this.state.meta.publisher.screen && !this.isFullScreen) {
      this.enableSharing = true;
      this.timeOut(500).then(() => {
        const publisherElement = <HTMLElement>document.getElementById('cameraPublisherContainer').parentElement;
        document.body.appendChild(publisherElement);
        publisherElement.style.zIndex = '9999999999';
        if (document.getElementById('opentok_canvas')) {
          // document.getElementById('opentok_canvas').style.height = '90vh';
          document.getElementById('opentok_canvas').style.top = '0px';
        }
      })
    } else {
      this.enableSharing = false;
      const publisherElement = <HTMLElement>document.getElementById('cameraPublisherContainer').parentElement;
      if (publisherElement) {
        document.getElementById('wrapper')?.insertAdjacentElement('afterend', publisherElement);
        publisherElement.style.zIndex = '1';
      }
    }
  }

  toggleLocalAudio() {
    this.publishAudio = !this.publishAudio;
    this.otCore.toggleLocalAudio(this.publishAudio);
  }

  toggleLocalVideo() {
    this.otCore.toggleLocalVideo(!this.publishVideo);
    this.publishVideo = !this.publishVideo;
  }

  startCall() {
    this.otCore.startCall()
      .then(({ publishers, subscribers, meta }) => {
        this.state.publishers = publishers;
        this.state.subscribers = subscribers;
        this.state.meta = meta;
       // this.joining = false;
      }).catch((error) => { console.log(error); });

  }

  async initSession(sessionId, token) {
    this.session = this.getOT.initSession(Constant.VonageApiKey, sessionId);
    this.sessionId = sessionId;
    this.token = token;
    await this.detectBrowser();
    const isWebcam = await this.detectWebCam();
    this.isWebcam = isWebcam;

    this.session.on('streamCreated', (event) => {
      this.outgoingCall = false;
      if (event.stream.videoType == 'screen') {
        this.screenSharingStream = event.stream;
        setTimeout(() => {
          if (document.getElementById('opentok_canvas')) {
            // document.getElementById('opentok_canvas').style.height = '90vh';
            document.getElementById('opentok_canvas').style.top = '0px';
          }
        }, 2000);
      } else {
        const rejoin = localStorage.getItem('rejoin');
        if (rejoin == 'true') {
          this.whoIsJoined = '';
          this.streams.push(event.stream);
        } else {
          this.whoIsJoined = event.stream.name.substring(0, event.stream.name.indexOf('('));
          this.joining = false;
          this.timeOut(4000).then(() => {
            this.whoIsJoined = '';
            this.streams.push(event.stream);
          });
        }
      }
      this.timeOut(8000).then(() => {
        localStorage.setItem('rejoin', 'false');
      });
    });

    this.session.on('streamDestroyed', (event) => {
      if (event.reason === 'mediaStopped') {
        console.log('media stopped');
      } else if (event.reason === 'forceUnpublished') {
        console.log('force stopped');
      }
      const idx = this.streams.indexOf(event.stream);
      if (idx > -1) {
        this.streams.splice(idx, 1);
      }
      if (this.streams.length == 0) {
        this.disconnect();
        this.meetingEnded = true;
      }
    });

    this.initOptions();
    this.timeOut(100).then(() => {
      this.otCore = new AccCore(this.options);
      this.otCore.connect().then(() => {
        this.state.connected = true;
        this.onCall = true;
        this.createEventListeners();
        this.session = this.otCore.session;
      });
    });
  }

  toggleScreenSharing() {
    this.enableSharing = !this.enableSharing;
  }

  disconnect(closeTab = true): void {
    if (this.annotationToolbarContainer) {
      this.annotationToolbarContainer.remove();
    }
    if (document.getElementById('opentok_parent_canvas')) {
      document.getElementById('opentok_parent_canvas').remove();
    }
    if (this.outgoingCallRing) {
      this.outgoingCallRing.pause();
    }
    if (this.streams.length <= 1) {
      this.publishAudio = true;
      this.publishVideo = true;
      this.outgoingCall = false;
      this.incomingCall = false;
      this.onCall = false;
      this.session.disconnect();
      if (closeTab) {
        console.log('removing token');
        localStorage.setItem('rejoin', 'false');
        if (!this.state.ringPause) {
          localStorage.removeItem('videoCallDataSessionId');
          localStorage.removeItem('videoCallDataToken');
          localStorage.removeItem('videoCallUserId');
        }
        this.meetingEnded = true;
      }
    } else {
      this.session.disconnect();
      this.rejoin = true;
    }
  }

  initOutgoingCall() {
    this.outgoingCallRing = <HTMLMediaElement>document.getElementById('outgoing-call');
    this.outgoingCallRing.play();
    this.timeOut(30000).then(() => {
      this.state.ringPause = true;
      this.disconnect();
      this.outgoingCallRing.pause();
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err) {
          console.log('Error =>', err);
          reject(err);
        } else {
          console.log('Session connected =>', this.session);
          resolve(this.session);
        }
      });
    });
  }

  detectBrowser(): Promise<any> {
    return new Promise((resolve, reject) => {
      var nAgt = navigator.userAgent;
      var browserName = navigator.appName;
      var fullVersion = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix, os;

      // In Opera, the true version is after "Opera" or after "Version"
      if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
      }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
      }
      // In most other browsers, "name/version" is at the end of userAgent
      else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
      if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }


      if (navigator.appVersion.indexOf("Win") != -1) os =
        "Windows OS";
      if (navigator.appVersion.indexOf("Mac") != -1) os =
        "MacOS";
      if (navigator.appVersion.indexOf("X11") != -1) os =
        "UNIX OS";
      if (navigator.appVersion.indexOf("Linux") != -1) os =
        "Linux OS";
      this.deviceOptions.browserName = browserName;
      this.deviceOptions.os = os;
      resolve(true)
    })
  }

  detectWebCam(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getOT.getDevices((err, devices) => {
        const videoInputDevices = devices.filter((element) => {
          return element.kind == 'videoInput';
        });
        if (videoInputDevices.length > 0) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }


  toggleCamera() {
    const id = Object.keys(this.state.publishers.camera);
    const publisher = this.state.publishers.camera[id[0]];
    publisher.cycleVideo().then(deviceId => {
      this.snackBar.open('Camera changed successfully', '', {
        duration: 3000
      });
    }).catch(error => {
      console.log(error);
    });
  }

  handleOutgoingCallPopup() {
    this.outgoingCall = true;
    if (!this.onCall) {
      this.initOutgoingCall();
    }
    this.timeOut(2000).then(() => {
      const outgoingPopup = <HTMLElement>document.getElementById('outgoing-popup');
      document.body.insertAdjacentElement('beforeend', outgoingPopup);
    });
    this.timeOut(30000).then(() => {
      this.outgoingCall = false;
    });
  }

  timeOut(time): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }
}
