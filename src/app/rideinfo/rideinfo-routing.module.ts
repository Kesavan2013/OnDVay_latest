import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { RideInfoComponent } from "./rideinfo.component";

const routes: Routes = [
    { path: "", component: RideInfoComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class RideInfoRoutingModule { }
