import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import * as constant from "./constants";
import { apiUrl } from "./apiUrls";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from "rxjs";
/* import {ToastrService} from 'ngx-toastr'; */
/* import {ToastrService} from 'ngx-toastr';
import {Lightbox} from 'ngx-lightbox';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'; */
import { Location } from "@angular/common";
import { AuthenticationService } from "../services/authentication.service";
import { User } from "../models";
declare var jQuery: any;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public readonly API_SERVER: String;
  public readonly END_POINT: any;
  private subject = new BehaviorSubject<any>(null);
  public title = this.subject.asObservable();

  private loaderSubject = new BehaviorSubject<any>(null);
  public loaderStatus = this.loaderSubject.asObservable();

  constant = constant;
  currentLanugae: any = "en";
  apiLoader: boolean = false;
  isSubmitting:boolean;
  currentUser: User;
  constructor(
    private router: Router,
    private http: HttpClient,
    private location: Location,
    /* public toastr: ToastrService,
    public lightBox: Lightbox,
    public modalService: BsModalService, */
    private authenticationService: AuthenticationService,
  ) {
    this.API_SERVER = environment.API_SERVER;
    this.END_POINT = apiUrl;
    this.isSubmitting = false;
  }

  GET_DATA(url, obj, loader?) {
    let params = new HttpParams();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== "" && obj[key] !== undefined) {
        params = params.set(key, obj[key]);
      }
    });
    return this.http.get<any>(this.API_SERVER + url, {
      params: params,
      reportProgress: false,
    });
  }

  POST_DATA(url: string, data: any) {
    return this.http.post<any>(this.API_SERVER + url, data, {
      reportProgress: false,
    });
  }

  GET_DATA2(url, obj, loader?) {
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `${userData.token}`,
    });
    let params = new HttpParams();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== "" && obj[key] !== undefined) {
        if (Array.isArray(obj[key])) {
         params = params.set(key, JSON.stringify(obj[key]));
        } else {
          params = params.set(key, obj[key]);
        }
        
      }
    });
    return this.http.get<any>(this.API_SERVER + url, {
      params: params,
      reportProgress: loader,
      headers: headers,
    });
  }

  POST_DATA2(url: string, data: any) {
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `${userData.token}`,
    });
    return this.http.post<any>(this.API_SERVER + url, data, {
      reportProgress: false,
      headers: headers,
    }).pipe(
      catchError(error => {
        // Handle error here
        console.error('Error:', error);
        // You can throw the error again to propagate it to the subscriber
        return throwError(error);
      })
    );;
  }
  POST_DATA_WITH_HEADER_PROFILE_UPLOAD(url: string, data: any) {
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      /*  'Content-Type': 'application/json', */
      Authorization: `${userData.token}`,
    });

    return this.http.post<any>(this.API_SERVER + url, data, {
      reportProgress: false,
      headers: headers,
    });
  }
  
  deleteProduct(productId: string): Observable<any> {
    // Construct the URL for the delete request
    // console.log(productId)
    const url = `${this.API_SERVER}projects/admin/${productId}`;

    // Fetch token from local storage, assuming you have it stored there
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `${userData.token}`,
    });

    // Send the DELETE request
    return this.http.delete<any>(url, { headers: headers });
  }
  getProductById(productId: string): Observable<any> {
    // Construct the URL for the GET request
    const url = `${this.API_SERVER}projects/customer/${productId}`;

    // Fetch token from local storage, assuming you have it stored there
    const userData: any = localStorage.getItem("currentUser");
    const token = userData ? JSON.parse(userData).token : ''; // Check if userData is not null
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    // Send the GET request
    return this.http.get<any>(url, { headers: headers });
  }

  REJECT_DOCUMENT(url: string, data: any) {
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `${userData.token}`,
    });
    return this.http.put<any>(this.API_SERVER + url, data, {
      reportProgress: false,
      headers: headers,
    });
  }
  APPROVED_DOCUMENT(url: string, data: any) {
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `${userData.token}`,
    });
    return this.http.put<any>(this.API_SERVER + url, data, {
      reportProgress: false,
      headers: headers,
    });
  }
}
