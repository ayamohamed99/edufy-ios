import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {AccountService} from '../../services/Account/account.service';

@Component({
  selector: 'app-attendance-tabs',
  templateUrl: './attendance-tabs.page.html',
  styleUrls: ['./attendance-tabs.page.scss'],
})
export class AttendanceTabsPage implements OnInit {
  selectedPath = '';
  constructor(private router: Router, private accountServ:AccountService) {

    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });

  }

  ngOnInit() {
  }

}
