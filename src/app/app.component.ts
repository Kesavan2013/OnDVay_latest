import { Component, OnInit, ViewChild,NgZone  } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as ApplicationSettings from "application-settings";
const firebase = require("nativescript-plugin-firebase");
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import { BikePoolService} from "./shared/bikepoolservice";
import { ServiceURL } from "./shared/services";
import * as Connectivity from "tns-core-modules/connectivity";
import * as Toast from "nativescript-toast";
import { alert, prompt } from "tns-core-modules/ui/dialogs";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    appLoggedIn: boolean = false;
    public connectionType: string;
    
    constructor(private router: Router, private routerExtensions: RouterExtensions,
        private bikepoolservice:BikePoolService,private zone: NgZone) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();
        //this.CheckInternetConnection();
        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this.ActivateURL(event));

        if (ApplicationSettings.getString("userid") != null) {
            this.loggedIn = true;
        }

        this.connectionType = this.connectionToString(Connectivity.getConnectionType());
        Connectivity.startMonitoring(connectionType => {
            this.zone.run(() => {
                this.connectionType = this.connectionToString(connectionType);
                //Toast.makeText(this.connectionType,"20000");
                if(this.connectionType != '')
                {
                    alert({
                        title: "On d Vay",
                        message: this.connectionType,
                        okButtonText: "Ok"
                      })
                }
            });
        });
    }

    public connectionToString(connectionType: number): string {
        switch(connectionType) {
            case Connectivity.connectionType.none:
                return "Please Check Your Internet Connection";
            // case Connectivity.connectionType.wifi:
            //     return "Connected to WiFi!";
            // case Connectivity.connectionType.mobile:
            //     return "Connected to Cellular!";
            default:
                 return "";
        }
    }

    // CheckInternetConnection(){
    //     connectivityModule.startMonitoring((newConnectionType) => {
    //         switch (newConnectionType) {
    //             case connectivityModule.connectionType.none:
    //                 console.log("Connection type changed to none.");
    //                 break;
    //             case connectivityModule.connectionType.wifi:
    //                 console.log("Connection type changed to WiFi.");
    //                 break;
    //             case connectivityModule.connectionType.mobile:
    //                 console.log("Connection type changed to mobile.");
    //                 break;
    //             default:
    //                 break;
    //         }
    //     });
    // }

    profileImage : any;
    username : string;
    email : string;
    loggedIn : boolean;
    ActivateURL(event:NavigationEnd)
    {
        this._activatedUrl = event.urlAfterRedirects;

        if(ApplicationSettings.getString("userid") != null)
        {
            this.loggedIn = true;
            this.profileImage = ApplicationSettings.getString("profileImage");
            this.email = ApplicationSettings.getString("email");
            this.username = ApplicationSettings.getString("username");
        }
        else{
            this.loggedIn = false;
            this.username = "Welcome Guest!";
            this.email = "";

            ApplicationSettings.remove("profileImage");
            ApplicationSettings.remove("email");
            ApplicationSettings.remove("username");
        }
        
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    LogoutSuccess(success)
    {
        this.loggedIn = false;
        this.username = "Welcome Guest!";
        this.email = "";        
        firebase.logout();
        this.routerExtensions.navigate(["signin"], {
            transition: {
                name: "fade"
            }
        });
    }

    LogoutError(error)
    {

    }

    Logout() {

        try{
            this.loggedIn = false;
            this.username = "Welcome Guest!";
            this.email = "";        
            firebase.logout();
            this.routerExtensions.navigate(["signin"], {
                transition: {
                    name: "fade"
                }
            });
        }
        catch(e)
        {
            console.log(e);
        }
        

        // var objUserId = {userid : ApplicationSettings.getString("userid")};
        // this.bikepoolservice.PostService(ServiceURL.DeleteLogOutUser,objUserId).subscribe(
        //     success => this.LogoutSuccess(success),
        //     error => this.LogoutError(error)
        // )
    }
}
