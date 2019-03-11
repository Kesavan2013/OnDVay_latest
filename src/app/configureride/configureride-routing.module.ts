import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ConfigurerideComponent } from "./configureride.component";

const routes: Routes = [
    { path: "", component: ConfigurerideComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ConfigureRideRoutingModule { }
