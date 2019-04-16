import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ConfigureRideRoutingModule } from "./configureride-routing.module";
import { ConfigurerideComponent } from "./configureride.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ConfigureRideRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        ConfigurerideComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ConfigureRideModule { }
