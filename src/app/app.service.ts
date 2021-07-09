import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // apiUrl = 'https://arxa.eu/rootapi/api/covid';
  // apiUrl = 'http://localhost:55954/api/covid';
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar) { }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  covidGetData() {
    return this.http.get(`${environment.api}/getdata`);
  }

  async covid2GetData(dataType: string, fromDate: string) {
    return this.http.get(`${environment.api2}/getdata/${dataType}/${fromDate}`).toPromise();
  }

  covidGetLatestData() {
    return this.http.get(`${environment.api}/getLatestData`);
  }


  //   stringToColour(label: string) {

  //     var hash = 0;
  //     for (var i = 0; i < label.length; i++) {
  //       hash = label.charCodeAt(i) + ((hash << 5) - hash);
  //     }
  //     var colour = '#';
  //     for (var i = 0; i < 3; i++) {
  //       var value = (hash >> (i * 8)) & 0xFF;
  //       colour += ('00' + value.toString(16)).substr(-2);
  //     }
  //     return colour;
  //   }

}
