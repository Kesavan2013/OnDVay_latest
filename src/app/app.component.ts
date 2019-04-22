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
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";


@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    private appLoggedIn: boolean = false;
    public connectionType: string;
    private profileImage : any;
    private username : string;
    private email : string;
    private loggedIn : boolean;
    
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
    
    ActivateURL(event:NavigationEnd)
    {
        this._activatedUrl = event.urlAfterRedirects;        
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {

        if(ApplicationSettings.getString("userid") != null){
            this.profileImage = ApplicationSettings.getString("profileImageURL");
            this.email = ApplicationSettings.getString("email");
            this.username = ApplicationSettings.getString("username");
        }

        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });
        this.closeDrawer();
    }

    LogoutSuccess(success)
    {
        this.closeDrawer();
        this.loggedIn = false;
        this.username = "";
        this.email = "";        
        ApplicationSettings.remove("userid");
        firebase.logout();
        this.routerExtensions.navigate(["signin"], {
            transition: {
                name: "push"
            }
        });
    }

    LogoutError(error) { }

    Logout() {
        var objUser = { userid : ApplicationSettings.getString("userid") };
        this.bikepoolservice.PostService(ServiceURL.DeleteDeviceToken,objUser).subscribe(
            success => this.LogoutSuccess(success),
            error => this.LogoutError(error)
        )
    }

    closeDrawer(){
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    public connectionToString(connectionType: number): string {
        switch(connectionType) {
            case Connectivity.connectionType.none:
                return "Please Check Your Internet Connection";            
            default:
                 return "";
        }
    }
}
