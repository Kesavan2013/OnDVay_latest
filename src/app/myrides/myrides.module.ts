import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { MyridesRoutingModule } from "./myrides-routing.module";
import { MyridesComponent } from "./myrides.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MyridesRoutingModule
    ],
    declarations: [
        MyridesComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MyridesModule { }
