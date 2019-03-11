import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SignInRoutingModule } from "./signin-routing.module";
import { SigninComponent } from "./signin.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        SignInRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        SigninComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SigninModule { }
