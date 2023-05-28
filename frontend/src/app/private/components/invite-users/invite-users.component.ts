import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/public/services/auth.service';
import { ChatService } from '../../services/chat.service';
import { SymmetricKeyService } from '../../services/symmetric-key.service';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss']
})
export class InviteUsersComponent implements OnInit {
  activeChatRoom: ChatRoom;
  symmetricKey: Buffer
  inviteUsersForm: FormGroup;
  selectedUser: User | null = null;
  findUser = new FormControl();
  users!: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { activeChatroom: ChatRoom, symmetricKey: Buffer },
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private chatService: ChatService,
    private symmetricKeyService: SymmetricKeyService

  ) {
    this.activeChatRoom = data.activeChatroom;
    this.symmetricKey = data.symmetricKey
  }

  ngOnInit(): void {
    console.log(this.symmetricKey)
    this.inviteUsersForm = this.formBuilder.group({
      findUser: this.findUser,
      users: this.formBuilder.array([])
    });
    this.searchUsers();
  }

  onSubmit() {
    const users = this.inviteUsersForm.getRawValue().users;
    this.activeChatRoom.users = [...this.activeChatRoom.users, ...users];
    this.activeChatRoom.encryptedSymmetricKey = this.symmetricKeyService.encryptSymmetricKeyForInvitedUsers(users,this.symmetricKey,JSON.parse(this.activeChatRoom.encryptedSymmetricKey));
    this.chatService.inviteUserToChatRoom(this.activeChatRoom);
  }

  onAddUser(): void {
    const usersFormArray = this.inviteUsersForm.get('users') as FormArray;
    usersFormArray.push(new FormControl(this.selectedUser));
    this.selectedUser = null;
    this.findUser.setValue('');
  }

  onUserSelected(user: User): void {
    this.selectedUser = user;
  }

  onRemoveUser(user: User): void {
    const usersFormArray = this.inviteUsersForm.get('users') as FormArray;
    const index = usersFormArray.controls.findIndex((control) => control.value === user);
    if (index >= 0) {
      usersFormArray.removeAt(index);
    }
  }

  private searchUsers(): void {
    this.findUser.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((username: string) => this.authService.getUsersByName(username).pipe(
        tap((users: User[]) => this.users = users)
      ))
    ).subscribe();
  }

  displayUsers(user: User): string | null {
    return user ? user.username : null;
  }
}
