import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatDashboardComponent } from './components/chat-dashboard/chat-dashboard.component';

const routes: Routes = [
  {
    path: 'chat-dashboard',
    component: ChatDashboardComponent
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
