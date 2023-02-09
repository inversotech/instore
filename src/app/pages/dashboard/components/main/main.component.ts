import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'open-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  readonly position = { lat: 51.678418, lng: 7.809007 };

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  ngOnInit() {
  }

}
