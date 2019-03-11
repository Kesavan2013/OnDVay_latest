import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { BikePoolService } from "../shared/bikepoolservice"
import { ServiceURL } from "../shared/services";
import * as ApplicationSettings from "application-settings";
import * as Geolocation from "nativescript-geolocation";

class RidersItem {
  constructor(public name: string,
    public distance: string, public status: string, public userid: string,
    public devicetoken:string,public profilePhoto:string) { }
}

@Component({
  selector: 'ns-riderslist',
  templateUrl: './riderslist.component.html',
  moduleId: module.id,
})
export class RiderListComponent implements OnInit {

  public dataItems: Array<RidersItem>;
  fromLat: string;
  fromLong: string;
  showLoader:boolean;
  noRidersAvail : boolean;

  RidersListSuccess(riders) {

    this.showLoader = false;

    for (let ride = 0; ride < riders.Data.length; ride++) {
      if(riders.Data[ride].userid != ApplicationSettings.getString("userid"))
      {
        let distance = this.CalculateDistance(riders.Data[ride].latitude, riders.Data[ride].longitude)
        let rideDistance = isNaN(distance) ? "Less than a Km" : distance.toString();
        this.dataItems.push(new RidersItem(riders.Data[ride].username, rideDistance.toString(),
         riders.Data[ride].status, riders.Data[ride].userid,
         riders.Data[ride].deviceToken,
         riders.Data[ride].profilePhoto))
      }
    }

    if(this.dataItems.length <= 0)
    {
      this.noRidersAvail = true;
    }
  }

  CalculateDistance(lat, long): any {
    let locationFrom = new Geolocation.Location();
    locationFrom.latitude = parseFloat(ApplicationSettings.getString("fromlat"));
    locationFrom.longitude = parseFloat(ApplicationSettings.getString("fromlong"));

    let locationTo = new Geolocation.Location();
    locationTo.latitude = parseFloat(lat);
    locationTo.longitude = parseFloat(long);

    let distance = Geolocation.distance(locationFrom, locationTo);
    return (distance / 1000).toFixed(2).toString() + "kms";
  }

  RiderListError(error) {
    this.showLoader = false;
  }
  constructor(private bikepoolservice: BikePoolService) {    
  }

  ngOnInit() {
    this.dataItems = [];
    this.showLoader = true;
        this.bikepoolservice.PostService(ServiceURL.RideUsers, null).subscribe(
          riders => this.RidersListSuccess(riders),
          error => this.RiderListError(error)
        )
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  onItemTap(args) {
    let selectedRider = this.dataItems[args.index];
    
    let objRideStatus =
    {
      userid : selectedRider.userid,
      rideStartTime : ApplicationSettings.getString("ridetime"),
      rideDistance : ApplicationSettings.getString("ridedistance"),
      currentLocation : ApplicationSettings.getString("currentlocation"),
      destinationLocation : ApplicationSettings.getString("tolocation"),
      deviceToken : selectedRider.devicetoken
    }

    console.log(objRideStatus);

    this.bikepoolservice.PostService(ServiceURL.RequestForRide,objRideStatus).subscribe(
      success =>this.RideStatusSuccess(success),
      error => this.RideStatusError(error)
    )
  }

  RideStatusSuccess(response)
  {
    console.log(response);
  }

  RideStatusError(error)
  {
    console.log(error);
  }

  onRiderItemTap(item: RidersItem) {
    console.log(item);
  }

  onSetupItemView(args: SetupItemViewArgs) {
    args.view.context.third = (args.index % 3 === 0);
  }
}
