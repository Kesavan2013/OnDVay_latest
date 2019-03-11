import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BikePoolService {

  baseUrl : string = 'https://us-central1-metroapplicationproject.cloudfunctions.net';  
  HereAPI: string = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json';
  HereUpdateAPI: string = 'https://route.api.here.com/routing/7.2/calculateroute.json?';
  HereAPIAppID : string ='&app_id=x3nC7Tuf3PC7PMmqdLQz';
  HereAPIAppCode : string = '&app_code=ukGcX7YnI7TS72VdZyHp_w';
  HereAPIGenCode : string ='&gen=9';
  HereAPIRetMode : string = '&mode=retrieveAddresses';
  AUTOCOMPLETION_URL : string = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json'
  
  constructor(@Inject(HttpClient) private httpClient: HttpClient) {
  }

  private createRequestOptions() {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return headers;
  }

  GetAddressAC(url): Observable<any>
  {
    //let params = "?" + this.HereAPIAppID + this.HereAPIAppCode+"&searchtext=" + url;
    return this.httpClient.get("https://geocoder.api.here.com/6.2/geocode.json?searchtext="+url+"&app_id=x3nC7Tuf3PC7PMmqdLQz&app_code=ukGcX7YnI7TS72VdZyHp_w", { headers: this.createRequestOptions() });
  }

  GetAddress(url) : Observable<any>
  {
    url = url + this.HereAPIRetMode + this.HereAPIAppID + this.HereAPIAppCode;
    return this.httpClient.get(this.HereAPI+ url);
  }

  GetDistance(url):Observable<any>
  {
    //https://route.api.here.com/routing/7.2/calculateroute.json?waypoint0=13.02398,80.17639&waypoint1=12.97939,80.21847&mode=fastest;car;traffic:enabled&app_id=x3nC7Tuf3PC7PMmqdLQz&app_code=ukGcX7YnI7TS72VdZyHp_w
    //waypoint0=13.02398,80.17639&waypoint1=12.97939,80.21847&
         var objUrl = url + "&mode=fastest;car;traffic:enabled" + this.HereAPIAppID + this.HereAPIAppCode;
    return this.httpClient.get(this.HereUpdateAPI+objUrl);
  }

  GetService(url) 
  {
      this.httpClient.get(this.baseUrl + url);
  }

  PostService(url,data) : Observable<any>
  {
      return this.httpClient.post(this.baseUrl+url,data);
  }
}