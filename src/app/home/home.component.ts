import { Component, OnInit, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as Geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { TimePicker } from "tns-core-modules/ui/time-picker";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { BikePoolService } from "../shared/bikepoolservice";
import { ServiceURL } from "../shared/services"
import * as dialogs from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
const firebase = require("nativescript-plugin-firebase");
import * as ApplicationSettings from "application-settings";
import { Router, NavigationExtras } from "@angular/router";
import { TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { offer } from "../shared/models/offerride";
import { DateTimePicker } from "nativescript-datetimepicker";
import { LoadingScreen } from 'nativescript-loading-screen';

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    currentLocation: string = "";
    items: any;
    searchPhrase: string;
    FromLat: string;
    FromLong: string;
    ToLat: string;
    ToLong: string;
    totalRideDistance: any;
    showLoader: boolean;
    offer: any;
    StartTime: any;
    VehicleType: any;
    userlatitude: any;
    userlongtitude: any;
    private loadingScreen: LoadingScreen;

    constructor(private bikepoolservice: (BikePoolService), private routerExtensions: RouterExtensions,
        private router: Router, private zone: NgZone) {
        // Use the component constructor to inject providers.
        this.loadingScreen = new LoadingScreen();
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

    ngOnInit(): void {

        // Init your component properties here.
        this.items = [];
        this.items.push("Car");
        this.items.push("Bike");

        this.offer = new offer();

        // call setDatePickerTime method
        this.setDatePickerTime();
        this.LoaderShow();
        let location = this.getDeviceLocation();
        this.InitFireBasePlugIn();
        this.updateStatusAvail();
    }

    setDatePickerTime() {
        let date = new Date();
        const datePicker = new DatePicker();
        datePicker.day = date.getDate();
        datePicker.month = date.getMonth() + 1;
        datePicker.year = date.getFullYear();
        datePicker.date = new Date(); // using Date object

        datePicker.minDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        datePicker.maxDate = new Date(2040, 4, 20);
    }

    updateStatusAvail() {

        firebase.addValueEventListener(data => {
            let Status;
            if (data.value) {
                console.log('Status: Online');
                Status = "Online";
            } else {
                console.log('Status: Offline');
                Status = "Offline";
            }

            let objUpdateUserLocation =
                {
                    userid: ApplicationSettings.getString("userid"),
                    longitude: this.FromLat,
                    latitude: this.FromLong,
                    status: Status
                }

            this.bikepoolservice.PostService(ServiceURL.RideUpdateUserLocation, objUpdateUserLocation).subscribe(
                success => console.log(success),
                error => console.log("updatedevicelocation" + error)
            )
        }, '.info/connected');
    }

    InitFireBasePlugIn() {
        firebase.init({
            //persist should be set to false as otherwise numbers aren't returned during livesync
            persist: false,
            url: "https://metroapplicationproject.firebaseio.com",
            onPushTokenReceivedCallback: function (token) {
                ApplicationSettings.setString('device_token', token);
                console.log('device token: ', token); // <-- add this
            },
            onMessageReceivedCallback: (message: any) => {
                let objNotificationMessage = message.data.value;
                console.log(message.data.value);
                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        objNotificationMessage
                    }
                };

                this.router.navigate(["rideinfo"], navigationExtras);
            },
            notificationCallbackAndroid: (message: any) => {
                console.log(JSON.stringify(message));

                //if (message.foreground == false) {
                dialogs.alert({
                    title: "On d Vay",
                    message: "Riders Requested Notification",
                    okButtonText: "ok"
                });
                // } else {
                //     console.log("Message received when inside the app");
                // }
            },
            onAuthStateChanged: (data: any) => {                
                console.log("dataError" + JSON.stringify(data))
                if (data.loggedIn) {
                    ApplicationSettings.setString("userid", data.user.uid);
                    ApplicationSettings.setString("email",data.user.email);
                    ApplicationSettings.setString("username",data.user.name);
                    ApplicationSettings.setString("profileImageURL",data.user.profileImageURL);
                }
                else {                    
                    console.log("OnAuthState" + data);
                }
            }
        }).then(
            function (instance) {
                console.log("firebase.init done");
                console.log(instance);
            },
            function (error) {
                console.log("firebase.init error: " + error);
            }
            );
    }

    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({ timeout: 10000 }).then(location => {
                    resolve(location);
                    // Call updateDeviceLocation method
                    this.userlatitude = location.latitude;
                    this.userlongtitude = location.longitude;
                    this.updateDeviceLocation(13.061140,80.282478);
                   // this.updateDeviceLocation(location.latitude, location.longitude);
                    this.hideLoader();
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    updateDeviceLocation(lat, long) {
        this.LoaderShow();
        this.FromLat = lat; this.FromLong = long;
        let formURL = "?prox=" + lat + "," + long;
        this.bikepoolservice.GetAddress(formURL).subscribe(
            address => this.handleSuccessDeviceLoc(address),
            error => this.handleErrorDeviceLoc(error))
    }

    handleSuccessDeviceLoc(success) {
        this.hideLoader();
        let objResult = success.Response.View[0].Result[0];
        this.currentLocation = objResult.Location.Address.Label;
        this.offer.PickLocation = objResult.Location.Address.Label;
        this.FromLat = objResult.Location.DisplayPosition.Latitude;
        this.FromLong = objResult.Location.DisplayPosition.Longitude;
        ApplicationSettings.setString("fromlat", this.FromLat.toString());
        ApplicationSettings.setString("fromlong", this.FromLong.toString());
    }

    handleErrorDeviceLoc(error) { this.hideLoader(); }

    public onSubmit(args) {
        this.LoaderShow();
        let searchBar = <SearchBar>args.object;
        this.bikepoolservice.GetAddressAC(searchBar.text).subscribe(
            ac => this.handleACSuccess(ac),
            error => this.handleACError(error))
    }

    setRideSettings() { }

    ClearRideSettings() { }

    handleACSuccess(success) {
        this.hideLoader();
        let objResult = success.Response.View[0].Result[0];
        this.searchPhrase = objResult.Location.Address.Label;
        this.ToLat = objResult.Location.DisplayPosition.Latitude;
        this.ToLong = objResult.Location.DisplayPosition.Longitude;
        ApplicationSettings.setString("currentlocation", this.currentLocation);
        ApplicationSettings.setString("tolocation", this.searchPhrase);
        this.CalculateDistance();
    }

    handleACError(error) { this.hideLoader(); }

    public onTextChanged(args) {
        let searchBar = <SearchBar>args.object;
    }

    public onClear(args) {
        let searchBar = <SearchBar>args.object;
        searchBar.text = "";
        searchBar.hint = "Enter Location";
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

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onFindRiders(event) {
        //this.setRideSettings();
        if (this.searchPhrase != undefined && this.searchPhrase != '') {
            ApplicationSettings.setString("ridetime", this.selectedRideTime.toString());
            this.routerExtensions.navigate(["/riderslist"], { clearHistory: true });
        }
        else {
            alert({
                title: "On d Vay",
                message: "Please Search Location to Find Riders",
                okButtonText: "Ok"
            })
        }
    }

    onPickerLoaded(args) {
        let timePicker = <TimePicker>args.object;

        var today = new Date();
        var time = today.getHours();

        timePicker.hour = time;
        timePicker.minute = today.getMinutes() + 10;

        let periodian = (timePicker.hour >= 12) ? "am" : "pm"
        this.selectedRideTime = timePicker.hour + timePicker.minute + periodian;
        ApplicationSettings.setString("ridetime", this.selectedRideTime);
    }

    selectedRideTime: string;

    onTimeChanged(args) {

        let totalTime;
        let hour = args.value.getHours();
        let minutes = args.value.getMinutes();

        if (parseFloat(hour) >= 12) {
            let FormatHour = parseFloat(hour) - 12;
            this.selectedRideTime = (FormatHour == 0) ? "12" : FormatHour.toString() + " : " + minutes + " pm";
        }
        else {
            this.selectedRideTime = parseFloat(hour).toString() + " : " + minutes.toString() + " am";
        }
        ApplicationSettings.setString("ridetime", this.selectedRideTime);
        //this.setRideSettings();
    }

    CalculateDistance() {
        let locationFrom = new Geolocation.Location();
        locationFrom.latitude = parseFloat(this.FromLat);
        locationFrom.longitude = parseFloat(this.FromLong);

        let locationTo = new Geolocation.Location();
        locationTo.latitude = parseFloat(this.ToLat);
        locationTo.longitude = parseFloat(this.ToLong);

        this.showLoader = true;
        var url = "waypoint0=" + this.FromLat + "," + this.FromLong + "&waypoint1=" + this.ToLat + "," + this.ToLong
        console.log(url);
        this.bikepoolservice.GetDistance(url).subscribe(
            distance => this.distancesuccess(distance),
            error => this.distanceerror(error)
        )
    }

    distancesuccess(distance) {
        this.showLoader = false;
        let dist = distance.response.route[0].summary.distance
        let travelTime = distance.response.route[0].summary.travelTime;
        this.totalRideDistance = dist / 1000;
        ApplicationSettings.setString("ridedistance", this.totalRideDistance.toString(2));
    }

    distanceerror(error) {
        this.showLoader = false;
        console.log(error);
    }

    submitOfferSuccess(success) {
        this.showLoader = false;
        //this.offer = new offer();
        dialogs.alert({
            title: "On d Vay",
            message: "Ride Offer Received !",
            okButtonText: "ok"
        });
    }

    submitOfferError(error) {
        console.log(error);
        this.showLoader = false;
    }

    submitOfferRide(event) {
        console.log(this.offer);
        this.offer.userId = ApplicationSettings.getString("userid");
        this.offer.VehicleTypeText = this.items[this.offer.VechileType];      
        this.offer.DropLocation = this.searchPhrase;
        this.offer.offerRide = true;  
        this.offer.latitude = parseFloat(this.FromLat);
        this.offer.longitude = parseFloat(this.FromLong);
        let minutes = (this.offer.StartTime.getMinutes().toString().length == 1) ?
            "0" + this.offer.StartTime.getMinutes().toString() :
            this.offer.StartTime.getMinutes().toString();
        this.offer.StartTime = this.offer.StartTime.getHours() + " : " + minutes;
        this.offer.UserName = ApplicationSettings.getString("email");
        var objOffer = { OfferRide: this.offer };

        this.showLoader = true;
        this.bikepoolservice.PostService(ServiceURL.OfferRide, objOffer).subscribe(
            success => this.submitOfferSuccess(success),
            error => this.submitOfferError(error)
        )
    }
}
