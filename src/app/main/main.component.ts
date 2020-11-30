import { MsgsDataService } from "./msgs-data.service";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import * as L from "leaflet";
import { Subscription } from "rxjs";
import { location } from "../shared/location.model";
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  map;
  locations;
  locationSubscription: Subscription;

  constructor(private MsgsDataService: MsgsDataService) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.getData();
  }

  initMap(): void {
    this.map = L.map("map", {
      center: [28.23661456501749, 29.52335392159906],
      zoom: 4,
    });

    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        markerColor: "green",
      }
    );

    tiles.addTo(this.map);
    let normalIcon = "./assets/imgs/map_normal.png";
    let happyIcon = "./assets/imgs/map_smile.png";
    let sadIcon = "./assets/imgs/map_sad.png";
    let txtClass = "";

    let iconObj = {
      iconSize: [30, 40], // size of the icon
    };
    var markerIcon = L.icon(iconObj);

    for (var i = 0; i < this.locations.length; i++) {
      this.locations.forEach((el) => {
        switch (el.sentiment) {
          case "Positive":
            iconObj["iconUrl"] = happyIcon;
            txtClass = "happy";
            break;
          case "Negative":
            iconObj["iconUrl"] = sadIcon;
            txtClass = "sad";

            break;
          case "Neutral":
            iconObj["iconUrl"] = normalIcon;
            txtClass = "normal";

            break;
        }

        var markerIcon = L.icon(iconObj);

        let marker = new L.marker([el["lat"], el["long"]], {
          icon: markerIcon,
        })
          .bindPopup(`<h3 class="${txtClass}">${el.message}</h3>`)
          .addTo(this.map);
      });
    }
  }

  getData() {
    this.locationSubscription = this.MsgsDataService.getAllData().subscribe(
      (res: location[]) => {
        this.locations = res;
      },
      (err) => {},
      () => {
        this.initMap();
      }
    );
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }
}
