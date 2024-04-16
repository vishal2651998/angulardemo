import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ManageTokBoxsession } from 'src/app/models/chatmodel';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  Constant,
} from 'src/app/common/constant/constant';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CallsService } from 'src/app/controller/calls.service';
@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss'],
})
export class ActiveUsersComponent implements OnInit {

  @ViewChild('usersScroll', { static: true }) usersScroll: ElementRef;
  @ViewChild('searchInputText', { static: true }) searchInputText: ElementRef;

  isLoadingOnScroll: boolean = false;
  userlist: any = [];
  memberSelectedList: any[] = [];
  newMeberList: any[] = [];
  removedMeberList: any[] = [];
  pagenumber = 1;
  limit = 20;
  wsName: string;
  userId: any;
  user: any;
  chatType: string = '';

  constructor(
    private dialogRef: MatDialogRef<ActiveUsersComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private userService: UserService,
    public callService: CallsService,
    private authenticationService: AuthenticationService,
    private chatService: ChatService,
  ) {
    this.wsName = data.wsName
  }

  ngOnInit(): void {
    this.userService.resetOffsetOnSearch();
    this.userService.ResetOrInitsearch().then((users) => {
      this.userlist = users;
    });
    this.InitilizeUserInputSearch();
    this.InitializeAndLoadUserDataOnScoll();
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid;
  }

  InitilizeUserInputSearch() {
    fromEvent(this.searchInputText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 || res.length == 0)

      // Time in milliseconds between key events
      , debounceTime(500)

      // If previous query is diffent from current
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      this.isLoadingOnScroll = true;
      this.userService.searchtext = text;
      this.userService.resetOffsetOnSearch();
      this.userService.ResetOrInitsearch().then(users => {
        this.isLoadingOnScroll = false;
        this.userlist = users;
      })
    });
  }

  InitializeAndLoadUserDataOnScoll() {
    fromEvent(this.usersScroll.nativeElement, 'scroll').pipe(
      map((event: any) => {
        return event;
      })
      , filter(res =>
        ((res.target.scrollTop + res.target.offsetHeight) > (res.target.scrollHeight - 10)) && (this.pagenumber < Math.ceil(236 / Number(this.limit))))
      , debounceTime(300)
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: any) => {
      this.isLoadingOnScroll = true;
      
      this.userService.ResetOrInitsearch().then(users => {
        this.isLoadingOnScroll = false
        this.userlist = [...this.userlist, ...users];
      })
    });
  }

  clearAllSelected(): void {
    this.userlist = this.userlist.map(member => {
      member.isMemberSelected = false;
      return member;
    })
    this.memberSelectedList = [];
  }

  SelectMember(user): void {
    if (this.memberSelectedList.length >= 6) return;
    this.userlist.find((x) => x.userId == user.userId).isMemberSelected = true;
    if (!this.newMeberList.find((x) => x.userId == user.userId)) {
      this.newMeberList.push(user);
    }
    if (!this.memberSelectedList.find((x) => x.userId == user.userId)) {
      this.memberSelectedList.push(user);
    }
  }

  removeemberSelected(user): void {
    this.memberSelectedList = this.memberSelectedList.filter(
      (x) => x.userId != user.userId
    );
    if (this.userlist.find((x) => x.userId == user.userId)) {
      this.userlist.find((x) => x.userId == user.userId).isMemberSelected =
        false;
    }
  }

  startCall(isVideo = true): void {
    const names = [];
    if (this.memberSelectedList.length > 0) {
      this.chatService.idsArr = [];
      this.memberSelectedList.map((list) => {
        names.push(list.userName);
        this.chatService.idsArr.push(list.userId);
      });
      if (!isVideo) {
        this.chatType = 'audio'
      }
      if (!localStorage.getItem('groupName')) {
        this.callService.groupName = names.join('<br/> ')
      } else {
        this.callService.groupName = localStorage.getItem('groupName');
      }
      this.wsName = this.callService.groupName;
      localStorage.setItem('videoCallUserId', JSON.stringify(this.chatService.idsArr));
      const userData: ManageTokBoxsession = this.prepareManageTokBoxsessionData();
      this.chatService.ManageTokBoxsession(userData).subscribe(resp => {
        this.callService.handleOutgoingCallPopup();
        if (!this.callService.onCall) {
          this.callService.users = this.memberSelectedList;
          this.callService.internalInitSession(resp.sessionId, resp.token, this.wsName);
        }
        this.close();
      });
    }
  }

  prepareManageTokBoxsessionData(): ManageTokBoxsession {
    let name;
    if (!localStorage.getItem('groupName')) {
      name = this.user.Username
    } else {
      name = this.wsName;
    }
    const memberToGroup: ManageTokBoxsession = new ManageTokBoxsession();
    memberToGroup.apiKey = Constant.ApiKey;
    memberToGroup.chatGroupId = '0';
    memberToGroup.domainId = '1';
    memberToGroup.userId = this.userId;
    memberToGroup.groupName = name;
    memberToGroup.chatType = this.chatType;
    return memberToGroup;
  }

  close(): void {
    this.userService.searchtext = '';
    this.dialogRef.close();
  }
}
