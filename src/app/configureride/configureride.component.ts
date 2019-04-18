import { Component, OnInit } from '@angular/core';
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { ConfigureRide } from "../shared/models/configureride";
import { BikePoolService } from "../shared/bikepoolservice";
import { ServiceURL } from "../shared/services";
import * as ApplicationSettings from "application-settings";
import { Router, NavigationExtras } from "@angular/router";
import { LoadingScreen } from 'nativescript-loading-screen';

@Component({
	moduleId: module.id,
	selector: 'configureride',
	templateUrl: './configureride.component.html'
})

export class ConfigurerideComponent implements OnInit {

	configure : ConfigureRide;
	private loadingScreen: LoadingScreen;	

	constructor(private bikepoolservice: BikePoolService,private router: Router) {		
		this.loadingScreen = new LoadingScreen();	
		this.configure = new ConfigureRide();		
	}

	ngOnInit() {
		this.LoaderShow();				
		let userId = { userId : ApplicationSettings.getString("userid")};		
		this.bikepoolservice.PostService(ServiceURL.GetCongfigureRider,userId).subscribe(
			configure => this.getConfigureRideSuccess(configure),
			error => this.getConfigureError(error)
		)
	}

	getConfigureError(error)
	{
		this.hideLoader();		
	}

	getConfigureRideSuccess(configure)
	{
		this.hideLoader();		
		if(configure.success)
		{			
			let objConfigure = configure.Data;
			this.configure.ContactNumber = objConfigure.ContactNumber;
			this.configure.Price = objConfigure.Price;
			this.configure.VechileName = objConfigure.VechileName;
			this.configure.VechileNumber = objConfigure.VechileNumber;				
		}
	}

	saveConfigure(){
		
		this.LoaderShow();
		this.configure.userId = ApplicationSettings.getString("userid");
		var objConfigureRider = { ConfigureRider : this.configure}
		this.bikepoolservice.PostService(ServiceURL.ConfigureRider,objConfigureRider).subscribe(
			success => this.configureRideSuccess(success),
			error => this.configureRideError(error)
		)
	}

	configureRideSuccess(success)
	{
		this.hideLoader();
		this.router.navigate(['home']);
	}

	configureRideError(error)
	{
		this.hideLoader();
		console.log(error);
	}

	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.showDrawer();
	  }

	hideLoader() {	
		this.loadingScreen.close();
	}
	
	LoaderShow() {		
		this.loadingScreen.show({
			message: "Loading..."
		});
	}
}