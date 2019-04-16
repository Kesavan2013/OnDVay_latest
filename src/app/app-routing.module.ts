import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/signin", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "myrides", loadChildren: "~/app/myrides/myrides.module#MyridesModule" },
    { path: "rideinfo", loadChildren: "~/app/rideinfo/rideinfo.module#RideInfoModule" },    
    { path: "signin", loadChildren: "~/app/signin/signin.module#SigninModule" },
    { path: "riderslist", loadChildren: "~/app/riderslist/riderslist.module#RidersListModule" },
    { path : "configureride",loadChildren:"~/app/configureride/configureride.module#ConfigureRideModule"}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
