import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { BikePoolService } from "../shared/bikepoolservice";
import { ServiceURL } from "../shared/services";
import * as ApplicationSettings from "application-settings";

class RideHistory {
  constructor(public rideTime: string, public rideDistance: string, public rideFromLocation: string,
    public rideToLocation: string) { }
}

@Component({
  selector: 'ns-myrides',
  templateUrl: './myrides.component.html',
  styleUrls: ['./myrides.component.css'],
  moduleId: module.id,
})
export class MyridesComponent implements OnInit {

  public rideHistoryItem: Array<RideHistory>;
  showLoader: boolean;
  constructor(private bikepoolservice: BikePoolService) { }

  ngOnInit() {
    this.rideHistoryItem = [];
    console.log(ApplicationSettings.getString("userid"));
    var objUser = { userid: ApplicationSettings.getString("userid") }
    this.showLoader = true;
    this.bikepoolservice.PostService(ServiceURL.GetMyRide, objUser).subscribe(
      success => this.riderList(success),
      error => this.riderListError(error)
    )
  }

  riderList(riders) {
    this.showLoader = false;
    let objRides = riders.rides;
    console.log(objRides);
    if (objRides.length > 0) {
      for (let i = 0; i <= objRides.length; i++) {
        let ridehistory = new RideHistory(
          objRides[i].rideStartTime,
          objRides[i].rideDistance,
          objRides[i].rideFromLocation,
          objRides[i].rideToLocation
        )

        this.rideHistoryItem.push(ridehistory);
      }
    }
  }

  riderListError(error) {
    this.showLoader = false;
    console.log("error" + error);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

}
