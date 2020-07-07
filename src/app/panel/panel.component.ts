import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  url = 'https://api.openweathermap.org/data/2.5/weather?';
  apiKey = 'a44224604925b3f23115c403c8e9c7c0';
  weatherInfo = undefined;
  cityName = '';
  typeOfWeather: string;
  subscription: Subscription;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void { }

  getWeatherData(city: string, apiKey: string, isNotUpdating: boolean){
    this.http.get(this.url.concat(`q=${city}&appid=${apiKey}`)).subscribe(res => {
      this.fetchInfoFromData(res);
    }, error => {
      if (isNotUpdating){
        this.openErrorDialog();
      }
      console.clear();
    });
  }

  tryToUpdate(){
    if (this.weatherInfo !== undefined){
      try{
        this.getWeatherData(this.cityName, this.apiKey, false);
      } catch (e) {
        console.clear();
      }
    }
  }

  fetchInfoFromData(data){
    this.weatherInfo = {};
    this.weatherInfo.cityName = data.name;
    this.weatherInfo.humidity = data.main.humidity;
    this.weatherInfo.currentTemp = (data.main.temp - 273.15).toFixed(0);
    this.weatherInfo.minTemp = (data.main.temp_min - 273.15).toFixed(0);
    this.weatherInfo.maxTemp = (data.main.temp_max - 273.15).toFixed(0);
    this.weatherInfo.feelsLike = (data.main.feels_like - 273.15).toFixed(0);
    this.weatherInfo.iconOfWeather = data.weather[0].icon;
    this.updateTypeOfWeather(this.weatherInfo.iconOfWeather);
  }

  updateTypeOfWeather(iconOfWeather: string){
    if (iconOfWeather === '01d' || iconOfWeather === '01n'){
      this.typeOfWeather = 'Sunny';
      return;
    }
    if (iconOfWeather === '02d' || iconOfWeather === '03d' || iconOfWeather === '04d' || iconOfWeather === '04n'){
      this.typeOfWeather = 'Cloudy';
      return;
    }
    if (iconOfWeather === '09d' || iconOfWeather === '09n' || iconOfWeather === '10d'
      || iconOfWeather === '10n' || iconOfWeather === '11d' || iconOfWeather === '11n'){
      this.typeOfWeather = 'Rainy';
      return;
    }
    if (iconOfWeather === '50d' || iconOfWeather === '50n'){
      this.typeOfWeather = 'Windy';
      return;
    }
    this.typeOfWeather = 'Unknown';
  }

  closeClicked(){
    this.subscription.unsubscribe();
    this.weatherInfo = undefined;
    this.cityName = '';
  }

  openChooseCityDialog(){
    const dialogRef = this.dialog.open(ChooseCityDialogComponent, {
      data: this.cityName
    });
    dialogRef.afterClosed().subscribe(result => {
      try{
        console.log(result.length);
        console.clear();
        this.getWeatherData(result, this.apiKey, true);
        this.cityName = result;
        const updateBroadcast = interval(20000);
        this.subscription = updateBroadcast.subscribe(res => {
          this.tryToUpdate();
        });
      } catch (e) {
        console.clear();
      }
    });
  }

  openErrorDialog(){
    this.dialog.open(ErrorDialogComponent);
  }
}


@Component({
  selector: 'app-choose-city-dialog',
  templateUrl: './choose-city-dialog.component.html',
})
export class ChooseCityDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ChooseCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {}
