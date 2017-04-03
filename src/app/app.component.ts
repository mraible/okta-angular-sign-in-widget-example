import { Component, OnInit } from '@angular/core';
import { Okta } from './shared/okta/okta.service';
declare let Backbone: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  user;
  oktaSignIn;

  constructor(private okta: Okta) {
    this.oktaSignIn = okta.getWidget();
  }

  showLogin() {
    Backbone.history.stop();
    this.oktaSignIn.renderEl({el: '#okta-login-container'}, (response) => {
      if (response.status === 'SUCCESS') {
        this.user = response.claims.email;
      }
    });
  }

  ngOnInit() {
    this.oktaSignIn.session.get((response) => {
      if (response.status !== 'INACTIVE') {
        this.user = response.login;
      } else {
        this.showLogin();
      }
    });
  }

  logout() {
    this.oktaSignIn.signOut(() => {
      this.user = null;
      this.showLogin();
    });
  }
}
