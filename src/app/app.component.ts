import { Component, OnInit } from '@angular/core';
import { MydataserviceService } from './mydataservice.service';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from './router.animations';

@Component({
  selector: 'app-root',
  animations: [routerTransition],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'cissappng9';
  private api = 'http://58.69.10.202/api';

  constructor(
    private http: HttpClient,
    public service: MydataserviceService
  ) { }

  async ngOnInit() {

    // set socket ip
    const surl = await `${this.api}/sip`;
    const socket_ip: any = await this.http.get(surl).toPromise();
    const true_socket: any = socket_ip.socket_ip;
    this.service.socket_ip = true_socket;

    // set image_source
    const url = await `${this.api}/pbu`;
    const image_source: any = await this.http.get(url).toPromise();
    const true_host: any = image_source.image_source;
    this.service.image_source = true_host;
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

}
