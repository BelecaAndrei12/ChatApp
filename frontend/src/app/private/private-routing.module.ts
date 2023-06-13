import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatDashboardComponent } from './components/chat-dashboard/chat-dashboard.component';
import { CreateChatRoomComponent } from './components/create-chat-room/create-chat-room.component';
import { ChatRoomsResolver } from './resolver/chatrooms.resolver';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'chat-dashboard',
    component: ChatDashboardComponent,
    //resolve: { chatRooms: ChatRoomsResolver },
  },
  {
    path:'create-chat-room',
    component: CreateChatRoomComponent
  },

  {
    path:'user-profile',
    component: UserProfileComponent
  },
  {
    path: '**',
    redirectTo: 'chat-dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
