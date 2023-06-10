import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, of, switchMap} from "rxjs";
import {Employee, Job} from "../models/model";

interface Category {
    slug: string,
    name: string,
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class Service {

    constructor(private _httpClient: HttpClient) {
    }

    /*Categories APIs*/
    addCategory_API(body: Category): Observable<any> {
        return this._httpClient.post(environment.api_base_url + '/category', body);
    }

    updateCategory_API(id: number, body: Category): Observable<any> {
        return this._httpClient.put(environment.api_base_url + '/category/' + id, body);
    }

    getCategories_API(): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/category');
    }

    getCategoryById_API(body: Category, id: string): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/category/' + id);
    }

    deleteCategory_API(id: string): Observable<any> {
        return this._httpClient.delete(environment.api_base_url + '/category/' + id);
    }

    /*Jobs APIs*/
    getJobs_API(): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/job');
    }

    getJobById_API(id): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/job/' + id);
    }

    createJob_API(body: Job): Observable<any> {
        return this._httpClient.post(environment.api_base_url + '/job', body);
    }

    updateJob_API(id: string, body: Job): Observable<any> {
        return this._httpClient.put(environment.api_base_url + '/job/' + id, body);
    }

    deleteJob_API(id: string): Observable<any> {
        return this._httpClient.delete(environment.api_base_url + '/job/' + id);
    }

    /*Employees APIs*/

    addEmployee_API(body: Employee): Observable<any> {
        return this._httpClient.post(environment.api_base_url + '/user', body);
    }

    updateEmployee_API(id: number, body: Employee): Observable<any> {
        return this._httpClient.put(environment.api_base_url + '/user/' + id, body);
    }

    deleteEmployee_API(id: string): Observable<any> {
        return this._httpClient.delete(environment.api_base_url + '/user/' + id);
    }

    getEmployees_API(): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/user');
    }

    /*Attachment APIs*/
    getAllAttachments_API(): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/attaches');
    }

    getAttachmentById_API(id: string): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/attach/' + id)
    }

    getAttachmentDetails_API(id: string): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/attach/' + id + '/info');
    }

    /*Dashboard APIs*/
    getDashboard_API(): Observable<any> {
        return this._httpClient.get(environment.api_base_url + '/dashboard');
    }


    getJobsByType_API(job_type: string): Observable<any> {
        return this._httpClient.get(`${environment.api_base_url}/job/type/${job_type}`)
    }
}
