import { Component, OnInit, Injectable, ViewChild, NgZone, DoCheck, ElementRef } from '@angular/core';
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as app from "tns-core-modules/application";
import * as ApplicationSettings from "application-settings";
const firebase = require("nativescript-plugin-firebase");
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationEnd, Router } from "@angular/router";
import { BikePoolService } from "../shared/bikepoolservice"
import { ServiceURL } from "../shared/services"
//import { Loader  } from "../shared/loader";
import { LoadingScreen } from 'nativescript-loading-screen';

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

  private loadingScreen: LoadingScreen;
  options: any;
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
    private router: Router,
    private bikepoolservice: BikePoolService) {
      this.loadingScreen = new LoadingScreen();      
      this.isLoggingIn =false;
  }

  ngOnInit() {            
    this.user = new User();
    console.log(ApplicationSettings.getString("userid"));
    if(ApplicationSettings.getString("userid") != null){
      this.router.navigate(['/home']);
    }    
  }

  GetUser(){
    var objUser = {userId : ApplicationSettings.getString("userid")};
    this.bikepoolservice.PostService(ServiceURL.GetUser,objUser).subscribe(
      user => this.userSuccess(user),
      error => this.userError(error)
    )
  }

  userSuccess(success)  { this.hideLoader(); }

  userError(error){ this.hideLoader();  }

  toggleForm() {
    this.clickSignInButton = !this.clickSignInButton;
    this.isLoggingIn = !this.isLoggingIn;
  }

  signUpSuccess(success) {    
    this.hideLoader();    
    this.isLoggingIn = true;
  }

  signUpError(error) {
    this.hideLoader();
  }

  loginSuccess(success) {    
    this.hideLoader();
    let user = success.data.user;
    ApplicationSettings.setString("email", user.email);
    ApplicationSettings.setString("userid", user.uid);
    if(user.name != undefined){
      ApplicationSettings.setString("username",user.name);
    }
    else{
      ApplicationSettings.remove("username");
    }

    if(user.profileImageURL != undefined){
      ApplicationSettings.setString("profileImageURL",user.profileImageURL);
    }
    else{
      ApplicationSettings.remove("profileImageURL");
    }

    this.navigateHome();
  }

  loginError(error) {
    this.isAuthenticating = false;
    this.hideLoader();
    console.log(error);
    alert({
      title: "On d Vay",
      message: "Please enter correct username/password",
      okButtonText: "Ok"
    })
  }

  busy: boolean;

  submit() {
    this.showLoader();
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

  hideLoader(){    
    this.loadingScreen.close();
  }

  showLoader(){    
    this.loadingScreen.show({message: "Loading..."});
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  googleresult(result) {
    this.isLoggingIn = true;
    this.showLoader();    
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
    this.hideLoader();
    this.navigateHome();
  }

  createusererror(error) {    
    this.hideLoader();
    alert({
      title: "On d Vay",
      message: error,
      okButtonText: "Ok"
    })
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

  public onopen() {  }

  public onclose() {  }

  navigateHome() {
    this.routerExtensions.navigate(["/home"], {
      transition: {
        name: "fade"
      }
    });
  }

  successForgotPwd(success) {
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
