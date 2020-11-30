import { location } from "./../shared/location.model";
import { locations } from "./../shared/locations-data.mockup";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class MsgsDataService {
  locations = locations;
  constructor(private http: HttpClient) {}

  getAllData() {
    return this.http
      .get<location[]>(
        "https://spreadsheets.google.com/feeds/list/0Ai2EnLApq68edEVRNU0xdW9QX1BqQXhHRl9sWDNfQXc/od6/public/basic?alt=json"
      )
      .pipe(
        map((res: any) => {
          let feedEntry = res.feed.entry;
          let contents = [];
          feedEntry.forEach((el) => {
            let myStr: string = el.content.$t;
            // indexes
            let messageIdIndex = myStr.indexOf("messageid:");
            let messageIndex = myStr.indexOf(", message:");
            let sentimentIndex = myStr.indexOf(", sentiment:");

            let id = myStr.substring(
              messageIdIndex + "messageid: ".length,
              messageIndex
            );
            let msg = myStr.substring(
              messageIndex + ", message: ".length,
              sentimentIndex
            );

            let sentiment = myStr.substring(
              sentimentIndex + ", sentiment: ".length
            );

            let obj = {
              messageid: id,
              message: msg,
              sentiment: sentiment,
            };

            contents.push(obj);
          });

          for (let index = 0; index < contents.length; index++) {
            contents[index].lat = this.locations[index][1];
            contents[index].long = this.locations[index][2];
          }

          return contents;
        })
      );
  }
}
