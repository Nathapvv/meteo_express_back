import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { LogService } from './log.service';

@Injectable()
export class ApiService {
  private apiGetIntensity = environment.baseUrlBack + 'api/?';
  private apiGetLocation = environment.baseUrlBack + 'api/?';

  constructor(private http: HttpClient, private logService: LogService) {}

  public getIntensity(filter: any): Observable<any> {
    const response = {
      zone: 'DE',
      location: 'Amiens',
      history: [
        {
          carbonIntensity: 413,
          datetime: '2021-08-18T13:00:00.000Z',
          updatedAt: '2021-08-19T08:40:20.886Z',
          createdAt: '2021-08-15T13:40:15.544Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
        {
          carbonIntensity: 338,
          datetime: '2021-08-19T12:00:00.000Z',
          updatedAt: '2021-08-19T12:39:55.666Z',
          createdAt: '2021-08-16T12:39:45.450Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
        {
          carbonIntensity: 338,
          datetime: '2021-08-19T12:00:00.000Z',
          updatedAt: '2021-08-19T12:39:55.666Z',
          createdAt: '2021-08-16T12:39:45.450Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
        {
          carbonIntensity: 338,
          datetime: '2021-08-19T12:00:00.000Z',
          updatedAt: '2021-08-19T12:39:55.666Z',
          createdAt: '2021-08-16T12:39:45.450Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
        {
          carbonIntensity: 338,
          datetime: '2021-08-19T12:00:00.000Z',
          updatedAt: '2021-08-19T12:39:55.666Z',
          createdAt: '2021-08-16T12:39:45.450Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
        {
          carbonIntensity: 338,
          datetime: '2021-08-19T12:00:00.000Z',
          updatedAt: '2021-08-19T12:39:55.666Z',
          createdAt: '2021-08-16T12:39:45.450Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
        {
          carbonIntensity: 338,
          datetime: '2021-08-19T12:00:00.000Z',
          updatedAt: '2021-08-19T12:39:55.666Z',
          createdAt: '2021-08-16T12:39:45.450Z',
          emissionFactorType: 'lifecycle',
          isEstimated: false,
          estimationMethod: null,
        },
      ],
    };
    return of(response);

    // return this.http
    //   .post(this.apiGetIntensity, filter)
    //   .pipe(catchError(this.logService.handleError));
  }

  public getLocation(): Observable<any> {
    const response = {
      locations: [
        { name: 'Amiens', zone: 'FR', lon: 2.3023, lat: 49.8951 },
        { name: 'Paris', zone: 'FR', lon: 2.3522, lat: 48.8566 },
        { name: 'Berlin', zone: 'DE', lon: 13.405, lat: 52.52 },
        { name: 'London', zone: 'GB', lon: -0.1276, lat: 51.5074 },
      ],
    };
    return of(response);

    // return this.http
    //   .get(this.apiGetLocation)
    //   .pipe(catchError(this.logService.handleError));
  }
}
