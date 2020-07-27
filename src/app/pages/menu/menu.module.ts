import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { MenuPage } from "./menu.page";
import { MatMenuModule } from "@angular/material";

const routes: Routes = [
  {
    path: "",
    component: MenuPage,
    children: [
      {
        path: "profile",
        loadChildren: "../profile/profile.module#ProfilePageModule",
      },
      {
        path: "notification",
        loadChildren:
          "../notification/notification.module#NotificationPageModule",
      },
      {
        path: "cafeteria-menu",
        loadChildren:
          "../cafeteria-menu/cafeteria-menu.module#CafeteriaMenuPageModule",
      },
      {
        path: "cafeteria-card",
        loadChildren:
          "../cafeteria-card/cafeteria-card.module#CafeteriaCreditPageModule",
      },
      {
        path: "daily-report",
        loadChildren: "../report/report.module#ReportPageModule",
      },
      {
        path: "report/:reportname",
        loadChildren: "../report/report.module#ReportPageModule",
      },
      {
        path: "chat",
        loadChildren: "../chat/chat.module#ChatPageModule",
      },
      {
        path: "medical-care",
        loadChildren:
          "../medical-care/medical-care.module#MedicalCarePageModule",
      },
      {
        path: "attendance",
        loadChildren: "../attendance/attendance.module#AttendancePageModule",
      },
      {
        path: "attendance-plus",
        loadChildren:
          "../attendance-tabs/attendance-tabs.module#AttendanceTabsPageModule",
      },
      {
        path: "settings",
        loadChildren: "../settings/settings.module#SettingsPageModule",
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatMenuModule,
  ],
  declarations: [MenuPage],
})
export class MenuPageModule {}
