import { Component, OnInit, Injectable, ViewChild, NgZone, DoCheck, ElementRef } from '@angular/core';
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as app from "tns-core-modules/application";
import * as ApplicationSettings from "application-settings";
const firebase = require("nativescript-plugin-firebase");
import { RouterExtensions } from "nativescript-angular/router";
import { BikePoolService } from "../shared/bikepoolservice"
import { ServiceURL } from "../shared/services"

export class User {
  username: string
  password: string
  confirmpassword: string
  email: string;
  deviceToken: string;
}

@Component({
  selector: 'SignIn',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  moduleId: module.id
})
export class SigninComponent implements OnInit {

  test: string;
  isLoggingIn = false;
  isAuthenticating = false;
  public input: any;
  public selectedIndex = 1;
  public items: Array<string>;
  public bikes: Array<string>;
  public user: User;
  public clickSignInButton: boolean;

  constructor(private routerExtensions: RouterExtensions,
    private bikepoolservice: BikePoolService) {
  }

  ngOnInit() {
    this.isLoggingIn = false;
    this.user = new User();
  }

  toggleForm() {
    this.clickSignInButton = !this.clickSignInButton;
    this.isLoggingIn = !this.isLoggingIn;
  }

  signUpSuccess(success) {
    this.isAuthenticating = false;
    console.log("loginsuccess" + success);
    this.isLoggingIn = true;
  }

  signUpError(error) {
    this.isAuthenticating = false;
    console.log("loginsuccess" + error);
    this.isAuthenticating = false;
  }

  loginSuccess(success) {
    this.isAuthenticating = false;
    let user = success.data.user;
    ApplicationSettings.setString("email", user.email);
    ApplicationSettings.setString("userid", user.uid);
    this.navigateHome();
  }

  loginError(error) {
    this.isAuthenticating = false;
    console.log("loginError : " + JSON.stringify(error));
  }

  busy: boolean;

  submit() {
    // Normal Signup on d vay    
    if (this.isLoggingIn == false) {      
      if (this.user.username != undefined && this.user.password != undefined &&
        this.user.email != undefined &&
         this.user.username != '' && this.user.password != '' &&
        this.user.email != '') {
        this.isAuthenticating = true;
        this.isLoggingIn = true;
        this.busy = true;
        let objLogin = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password,
          deviceToken: ApplicationSettings.getString("device_token")
        }
        this.bikepoolservice.PostService(ServiceURL.SignUpOnDVay, objLogin).subscribe(
          success => this.signUpSuccess(success),
          error => this.signUpError(error)
        )
      }
      else{
        alert({
          title: "On d Vay",
          message: "Please Enter valid Information to SignUp",
          okButtonText: "Ok"
        })
      }
    }
    else if(this.user.email != '' && this.user.password != '') {
      this.isAuthenticating = true;
      // normal login on d vay
      if (this.user.email != undefined && this.user.password != undefined 
        && this.user.password != '' && this.user.email != '') {
        var objLogin = { email: this.user.email, password: this.user.password };        
        this.bikepoolservice.PostService(ServiceURL.Login, objLogin).subscribe(
          success => this.loginSuccess(success),
          error => this.loginError(error)
        )
      }
      else
      {
        alert({
          title: "On d Vay",
          message: "Please Enter valid Information to LogIn",
          okButtonText: "Ok"
        })
      }
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  googleresult(result) {
    this.isLoggingIn = true;

    this.isAuthenticating = true;
    ApplicationSettings.setString("profileImage", result.profileImageURL);
    ApplicationSettings.setString("email", result.email);
    ApplicationSettings.setString("username", result.name);

    let objGoogleLogin = {
      userid: result.uid,
      deviceToken: ApplicationSettings.getString("device_token"),
      username: result.name,
      email: result.email,
      profilePhoto: result.profileImageURL
    }

    this.bikepoolservice.PostService(ServiceURL.CreateWithSocialLogin, objGoogleLogin).subscribe(
      user => this.createusersuccess(user),
      error => this.createusererror(error)
    )
  }

  createusersuccess(user) {
    this.isAuthenticating = false;
    console.log("createusersuccess" + user);
    this.navigateHome();
  }

  createusererror(error) {
    this.isAuthenticating = false;
    console.log("createusererror" + error);
  }


  googleerror(error) {
    console.log(error);
  }

  submitGoogle() {
    firebase.login({ type: firebase.LoginType.GOOGLE }).
      then(googleresult => this.googleresult(googleresult),
      googleerror => this.googleerror(googleerror));
  }

  fbresult(success) {
    this.isLoggingIn = true;

    ApplicationSettings.setString("profileImage", success.profileImageURL);
    ApplicationSettings.setString("email", success.email);
    ApplicationSettings.setString("username", success.name);

    let objFBLogin = {
      userid: success.uid,
      deviceToken: ApplicationSettings.getString("device_token"),
      username: success.name,
      email: success.email,
      profilePhoto: success.profileImageURL
    }

    this.bikepoolservice.PostService(ServiceURL.CreateWithSocialLogin, objFBLogin).subscribe(
      user => this.createusersuccess(user),
      error => this.createusererror(error)
    )
  }

  fberror(error) {
    let formatErrorMessage = error.replace('com.google.firebase.auth.FirebaseAuthUserCollisionException:', "");
    alert({
      title: "On d Vay",
      message: formatErrorMessage,
      okButtonText: "Ok"
    })
  }

  submitFB() {
    firebase.login({
      type: firebase.LoginType.FACEBOOK,
      facebookOptions: {
        scope: ['public_profile', 'email']
      }
    })
      .then(
      success => this.fbresult(success),
      error => this.fberror(error)
      )
  }

  public onchange(args: SelectedIndexChangedEventData) {
    console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);
  }

  public onopen() {
    console.log("Drop Down opened.");
  }

  public onclose() {
    console.log("Drop Down closed.");
  }

  navigateHome(): any {
    this.routerExtensions.navigate(["home"], {
      transition: {
        name: "fade"
      }
    });
  }

  successForgotPwd(success) {
    console.log(success);
    alert({
      title: "On d Vay",
      message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
      okButtonText: "Ok"
    })
  }

  errorForgotPwd(error) {
    console.log(error);
  }

  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for On d Vay to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        // Call the backend to reset the password
        var objemail = { emailAddress: data.text.toString().trim() }
        this.bikepoolservice.PostService(ServiceURL.ResetPassword, objemail).subscribe(
          success => this.successForgotPwd(success),
          error => this.errorForgotPwd(error)
        )
      }
    });
  }

}
