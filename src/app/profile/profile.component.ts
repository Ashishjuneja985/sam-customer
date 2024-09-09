import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    public authenticationService: AuthenticationService,
   
  ) { 
  }

  ngOnInit() {

  }
  goBack(): void {
    this.location.back();
  }
  logutUser() {
    this.authenticationService.logout();
  }


}
