import { CommonModule } from "@angular/common";
import { ChatDashboardComponent } from "./components/chat-dashboard/chat-dashboard.component";
import { NgModule } from "@angular/core";
import { PrivateRoutingModule } from "./private-routing.module";

@NgModule({
  declarations: [
    ChatDashboardComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
