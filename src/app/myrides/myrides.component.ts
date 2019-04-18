import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { BikePoolService } from "../shared/bikepoolservice";
import { ServiceURL } from "../shared/services";
import * as ApplicationSettings from "application-settings";
import { LoadingScreen } from 'nativescript-loading-screen';

class RideHistory {
  constructor(public DropLocation: string, public PickLocation: string, public StartTime: string,
    public VehicleTypeText: string,public rideTaken:string) { }
}

@Component({
  selector: 'ns-myrides',
  templateUrl: './myrides.component.html',
  styleUrls: ['./myrides.component.css'],
  moduleId: module.id,
})
export class MyridesComponent implements OnInit {

  public rideHistoryItem: Array<RideHistory>;
  private loadingScreen: LoadingScreen;
  showLoader: boolean;
  constructor(private bikepoolservice: BikePoolService) { }

  ngOnInit() {
    this.rideHistoryItem = [];
    this.loadingScreen = new LoadingScreen();
    console.log(ApplicationSettings.getString("userid"));
    var objUser = { userid: ApplicationSettings.getString("userid") }
    this.showLoader = true;
    this.LoaderShow();
    this.bikepoolservice.PostService(ServiceURL.GetMyRide, objUser).subscribe(
      success => this.riderList(success),
      error => this.riderListError(error)
    )
  }

  riderList(riders) {
    this.showLoader = false;
    this.hideLoader();
    let objRides = riders.rides;
    console.log(objRides);
    if (objRides.length > 0) {
      for (let i = 0; i <= objRides.length; i++) {
        let ridehistory = new RideHistory(
          objRides[i].DropLocation,
          objRides[i].PickLocation,
          objRides[i].StartTime,
          objRides[i].VehicleTypeText,
          objRides[i].rideTaken = (objRides[i].offerRide == true) ? "Ride Offered" : "Ride Requested"
        )
        this.rideHistoryItem.push(ridehistory);
      }
    }
  }

  riderListError(error) {
    this.showLoader = false;
    this.hideLoader();
    console.log("error" + error);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

hideLoader() {
    //this.loader.hide();
    this.loadingScreen.close();
}

LoaderShow() {
    //this.loader.show(this.options);
    this.loadingScreen.show({
        message: "Loading..."
    });
}

}
