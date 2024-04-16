import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, flatMap, mergeMap } from "rxjs/operators";
import { AppService } from "./app.service";

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    constructor(
        private httpClient: HttpClient,
        private appService: AppService
    ) { }

    getJSONDef(json: string): Observable<any> {
        return this.httpClient.get("../assets/json/" + json);
    }

    public getAll() {

    }

    public get(application: string, apiEndPoint: string, params?: any) { //userId: any, domainId: any,
        let url = this.appService.appData.api + application + "/" + apiEndPoint;
        return this.httpClient.get(url, { 'params': params })
            .pipe(
                mergeMap((result: any) => {
                    return new Promise<any>((reslove, reject) => {
                        reslove(result);
                    });
                }),
                (catchError(error => {
                    return throwError(error);
                }))
            );
    }

    public post(application: string, apiEndPoint: string, userId: any, domainId: any, contentTypeId?: any, filterOptions?: any, params?: any, options?: any) {
        let url = this.appService.appData.api + application + "/" + apiEndPoint;
        options = new HttpParams()
            .set('apiKey', this.appService.appData.apiKey)
            .set('userId', userId)
            .set('domainId', domainId);
        if (filterOptions)
            options = options.set('filterOptions', JSON.stringify(filterOptions));
        if (contentTypeId)
            options = options.set('contentTypeId', contentTypeId);
        return this.httpClient.post(url, params, { 'params': options }).pipe(
            mergeMap((result: any) => {
                return new Promise<any>((reslove, reject) => {
                    reslove(result.data);
                });
            }),
            (catchError(error => {
                return throwError(error);
            }))
        );
    }

    public postFormData(application: string, apiEndPoint: string, params?: any, options?: any) {
        let url = this.appService.appData.api + application + "/" + apiEndPoint;
        return this.httpClient.post(url, params, { 'params': options }).pipe(
            mergeMap((result: any) => {
                return new Promise<any>((reslove, reject) => {
                    reslove(result);
                });
            }),
            (catchError(error => {
                return throwError(error);
            }))
        );
    }

}