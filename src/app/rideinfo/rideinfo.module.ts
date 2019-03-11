import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { RideInfoRoutingModule } from "./rideinfo-routing.module";
import { RideInfoComponent } from "./rideinfo.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        RideInfoRoutingModule
    ],
    declarations: [
        RideInfoComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RideInfoModule { }
