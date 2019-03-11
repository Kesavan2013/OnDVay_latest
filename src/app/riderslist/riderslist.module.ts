import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { RidersListRoutingModule } from "./riderslist-routing.module";
import { RiderListComponent } from "./riderslist.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        RidersListRoutingModule
    ],
    declarations: [
        RiderListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RidersListModule { }
