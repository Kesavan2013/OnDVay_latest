import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { BikePoolService } from "../shared/bikepoolservice"
import { ServiceURL } from "../shared/services";
import * as ApplicationSettings from "application-settings";
import * as Geolocation from "nativescript-geolocation";
import { LoadingScreen } from 'nativescript-loading-screen';
import { alert, prompt } from "tns-core-modules/ui/dialogs";

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

  private loadingScreen: LoadingScreen;
  public dataItems: Array<RidersItem>;
  fromLat: string;
  fromLong: string;
  showLoader:boolean;
  noRidersAvail : boolean;

  RidersListSuccess(riders) {
    
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

    this.hideLoader();
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
    this.hideLoader();
  }
  constructor(private bikepoolservice: BikePoolService) {    
  }

  ngOnInit() {
    this.loadingScreen = new LoadingScreen();
    this.dataItems = [];
    this.showLoader = true;
    this.LoaderShow();
        this.bikepoolservice.PostService(ServiceURL.RideUsers, null).subscribe(
          riders => this.RidersListSuccess(riders),
          error => this.RiderListError(error)
        )
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

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  onItemTap(args) {
    let selectedRider = this.dataItems[args.index];
    
    let objRideStatus =
    {
      requestedUserId : ApplicationSettings.getString("userid"),
      riderUserid : selectedRider.userid,
      rideStartTime : ApplicationSettings.getString("ridetime"),
      rideDistance : ApplicationSettings.getString("ridedistance"),
      currentLocation : ApplicationSettings.getString("currentlocation"),
      destinationLocation : ApplicationSettings.getString("tolocation"),
      deviceToken : selectedRider.devicetoken,      
    }

    this.LoaderShow();

    this.bikepoolservice.PostService(ServiceURL.RequestForRide,objRideStatus).subscribe(
      success =>this.RideStatusSuccess(success),
      error => this.RideStatusError(error)
    )
  }

  RideStatusSuccess(response){
    this.hideLoader();
    alert({
      title: "On d Vay",
      message: "Request has been placed for ride",
      okButtonText: "Ok"
    })
  }

  RideStatusError(error){
    this.hideLoader();
  }

  onRiderItemTap(item: RidersItem) {}

  onSetupItemView(args: SetupItemViewArgs) {
    args.view.context.third = (args.index % 3 === 0);
  }
}
