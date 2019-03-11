import { Component, OnInit } from '@angular/core';
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

@Component({
	moduleId: module.id,
	selector: 'configureride',
	templateUrl: './configureride.component.html',
	styleUrls: ['./configureride.component.css']
})

export class ConfigurerideComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

	saveConfigure(){
		
	}

	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.showDrawer();
	  }
}