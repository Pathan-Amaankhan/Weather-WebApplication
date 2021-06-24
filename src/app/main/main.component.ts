import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PanelComponent} from '../panel/panel.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  listOfPanels: number[] = [1];
  constructor() { }

  ngOnInit(): void { }
  onAddClick() {
    this.listOfPanels.push(1);
    console.log(this.listOfPanels);
  }

  onRemoveClick() {
    this.listOfPanels.pop();
  }

}
