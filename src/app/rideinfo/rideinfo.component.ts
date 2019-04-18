import { Component, OnInit, Injectable, ViewChild, NgZone, DoCheck, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BikePoolService } from "../shared/bikepoolservice";
import { ServiceURL } from "../shared/services"
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { alert, prompt } from "tns-core-modules/ui/dialogs";

export class RideInfo {
  RideFromLocation: string
  RideToLocation: string
  RideDistance: string
  RidePickUpTime: string
  RideStatus: string
  RideFromDeviceToken: string
  RideContactNo: string
  riderContactNo: any
  requestedUserId : any
}

@Component({
  selector: 'ns-rideinfo',
  templateUrl: './rideinfo.component.html',
  moduleId: module.id,
})
export class RideInfoComponent implements OnInit {

  public rideInfo: RideInfo;
  rideContactNo: any;
  constructor(private route: ActivatedRoute, private bikepoolservice: BikePoolService) {
    this.route.queryParams.subscribe(params => {
      let notification = params["objNotificationMessage"];

      this.rideInfo = new RideInfo();

      var objNotification = JSON.parse(notification);
      this.rideInfo.RideFromLocation = objNotification.rideLocation;
      this.rideInfo.RideToLocation = objNotification.destinationLocation;
      this.rideInfo.RideDistance = objNotification.rideDistance;
      this.rideInfo.RidePickUpTime = objNotification.rideStartTime;
      this.rideInfo.RideStatus = objNotification.ridestatus;
      this.rideInfo.RideFromDeviceToken = objNotification.device_token;
      this.rideInfo.requestedUserId = objNotification.requestedUserId;
      this.rideInfo.RideContactNo = "";
      if (objNotification.phoneNo != undefined) {
        this.rideInfo.RideContactNo = objNotification.phoneNo;
        console.log("RideContactno" + this.rideInfo.RideContactNo);
      }
      else {
        this.rideInfo.riderContactNo = '';
      }
      console.log("status" + this.rideInfo.RideContactNo);
    });
  }

  ngOnInit() {
  }

  GetRideInformation(status,phoneno): any {
    var objdeviceToken = [];
    objdeviceToken.push({ deviceToken: this.rideInfo.RideFromDeviceToken })
    
    var objRideStatus = {
      deviceToken: objdeviceToken,
      requestStatus: status,
      currentLocation: this.rideInfo.RideFromLocation,
      destinationLocation: this.rideInfo.RideToLocation,
      phoneNo: phoneno,
      requestedUserId:this.rideInfo.requestedUserId
    }

    return objRideStatus;
  }

  onAccept() {

    prompt({
      title: "On D Vay",
      message: "Please enter contact number for ride.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        // Call the backend to reset the password
        
        var objemail = { emailAddress: data.text.toString().trim() }
        var objRide = this.GetRideInformation(1,data.text.toString());
        this.bikepoolservice.PostService(ServiceURL.RideStatus, objRide).subscribe(
          ride => console.log("success" + JSON.stringify(ride)),
          error => console.log("error" + error)
        )
      }
    });
  }

  OnCancel() {
    var objRide = this.GetRideInformation(0,"00000");

    this.bikepoolservice.PostService(ServiceURL.RideStatus, objRide).subscribe(
      ride => console.log(ride),
      error => console.log(error)
    )
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

}
