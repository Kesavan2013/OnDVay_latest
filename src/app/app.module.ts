import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DropDownModule } from "nativescript-drop-down/angular";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {BikePoolService} from "./shared/bikepoolservice";
import { MyridesComponent } from './myrides/myrides.component';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptDateTimePickerModule } from "nativescript-datetimepicker/angular";
import { RadioButtonModule } from 'nativescript-radiobutton/angular'


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        DropDownModule,
        HttpClientModule,        
        NativeScriptDateTimePickerModule,
        RadioButtonModule      
    ],
    declarations: [
        AppComponent
    ],
    providers:[
        BikePoolService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
