import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'attendance-wi-fi-edit', loadChildren: './pages/attendance-wi-fi-edit/attendance-wi-fi-edit.module#AttendanceWiFiEditPageModule' },
  // { path: 'attendance-settings', loadChildren: './pages/attendance-settings/attendance-settings.module#AttendanceSettingsPageModule' },
  // { path: 'filter-view', loadChildren: './pages/filter-view/filter-view.module#FilterViewPageModule' },
  // { path: 'attendance-rank', loadChildren: './pages/attendance-rank/attendance-rank.module#AttendanceRankPageModule' },

  // { path: 'attendance-tabs', loadChildren: './pages/attendance-tabs/attendance-tabs.module#AttendanceTabsPageModule' },

  // { path: 'attendance', loadChildren: './pages/attendance/attendance.module#AttendancePageModule' },
  // { path: 'report-template', loadChildren: './pages/report-template/report-template.module#ReportTemplatePageModule' },
  // { path: 'report', loadChildren: './pages/report/report.module#ReportPageModule' },
  // { path: 'medication-notification', loadChildren: './pages/medication-notification/medication-notification.module#MedicationNotificationPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
