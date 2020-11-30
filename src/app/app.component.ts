import { MsgsDataService } from "./main/msgs-data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "sortingandvisualisingtask";

  constructor(private MsgsDataService: MsgsDataService) {}
  ngOnInit() {
    this.MsgsDataService.getAllData();
  }
}
