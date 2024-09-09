import { Component, OnInit, ViewChild } from "@angular/core";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ChartComponent,
  ApexChart
} from "ng-apexcharts";
import { User, stateResponse, Statistics } from "../models";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  stateData: stateResponse;
  loading = false;
  users: any = [];
  statatics: any = {}; // Statistics;
  singleUser: any = {};
  modelStyle: string = "";
  deleteUserId: string = "";
 
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
   
  }
  ngOnInit() {
    this.modelStyle = "none";
    // this.getStats();
    // this.getUsers();
    
  }

  getStats() {
    this.spinner.show();
    var payload = {};
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.dashboardStats,
      {},
      true,
    ).subscribe((res) => {
      // console.log(res)
      this.statatics = res.data;
      this.spinner.hide();
    });
  }

  openDeleteModel(item: any) {
    this.singleUser = item;
    this.modelStyle = "block";
    this.deleteUserId = item._id;
  }
  closeModel() {
    this.modelStyle = "none";
  }
}
