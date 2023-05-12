import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/public/services/auth.service';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-chat-room',
  templateUrl: './create-chat-room.component.html',
  styleUrls: ['./create-chat-room.component.scss']
})
export class CreateChatRoomComponent implements OnInit {

  createNewChatRoomForm: FormGroup;
  selectedUser: User | null = null;

  findUser = new FormControl();
  users!: User[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.createNewChatRoomForm = this.formBuilder.group({
      name: ['', Validators.required],
      findUser: this.findUser,
      users: this.formBuilder.array([])
    });
    this.searchUsers();
  }

  onSubmit(): void {
    if(this.createNewChatRoomForm.valid) {
      this.chatService.createChatRoom(this.createNewChatRoomForm.getRawValue());
      this.router.navigate(['/private/chat-dashboard']);
    }
  }

  onAddUser(): void {
    const usersFormArray = this.createNewChatRoomForm.get('users') as FormArray;
    usersFormArray.push(new FormControl(this.selectedUser));
    this.selectedUser = null;
    this.findUser.setValue('');
  }

  onUserSelected(user: User): void {
    this.selectedUser = user;
  }

  onRemoveUser(user: User): void {
    const usersFormArray = this.createNewChatRoomForm.get('users') as FormArray;
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
