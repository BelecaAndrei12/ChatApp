import { CommonModule } from "@angular/common";
import { ChatDashboardComponent } from "./components/chat-dashboard/chat-dashboard.component";
import { NgModule } from "@angular/core";
import { PrivateRoutingModule } from "./private-routing.module";
import {MatListModule} from '@angular/material/list'
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { CreateChatRoomComponent } from './components/create-chat-room/create-chat-room.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChatRoomsResolver } from "./resolver/chatrooms.resolver";
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    ChatDashboardComponent,
    CreateChatRoomComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrivateRoutingModule,
    MatListModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  providers:[ChatRoomsResolver]
})
export class PrivateModule { }
