import { Component } from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WeatherApp';

  constructor(private http: HttpClient, updates: SwUpdate) {
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => {
        document.location.reload();
      });
    });
  }
}
