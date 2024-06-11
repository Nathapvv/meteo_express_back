import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { LogService } from './log.service';

@Injectable()
export class ApiService {
  private apiGetIntensity = environment.baseUrlBack + 'meteo';
  private apiGetLocation = environment.baseUrlBack + 'locations';

  constructor(private http: HttpClient, private logService: LogService) {}

  public getMeteoData(
    ville?: string,
    fenetre?: number,
    heureDebut?: string,
    heureFin?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (ville) params = params.set('ville', ville);
    if (fenetre) params = params.set('fenetre', fenetre.toString());
    if (heureDebut) params = params.set('heureDebut', heureDebut);
    if (heureFin) params = params.set('heureFin', heureFin);

    return this.http
      .get(this.apiGetIntensity, { params })
      .pipe(catchError(this.logService.handleError));
  }

  public getLocation(ville?: string): Observable<any> {
    const url = `${this.apiGetLocation}/${ville}`;
    return this.http.get(url).pipe(catchError(this.logService.handleError));
  }
}
