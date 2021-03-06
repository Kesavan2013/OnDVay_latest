import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptDateTimePickerModule } from "nativescript-datetimepicker/angular";
import { DropDownModule } from "nativescript-drop-down/angular";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule,
        NativeScriptFormsModule,
        NativeScriptDateTimePickerModule,
        DropDownModule
    ],
    declarations: [
        HomeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule { }
