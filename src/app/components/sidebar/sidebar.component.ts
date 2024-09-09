import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
declare const $: any;
import { ApiService, AuthenticationService } from "../../services";
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  
  icon2: string;
  class: string;
  subMenus?: RouteInfo[];
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "../../../assets/img/side-menu-icons/dashboard.png",
    icon2: "../../../assets/img/side-menu-icons/dashboard_active.png",
    class: "",
  },
  {
    path: "/project",
    title: "Project  List",
    icon: "../../../assets/img/side-menu-icons/sub_admin_management.png",
    icon2: "../../../assets/img/side-menu-icons/sub_admin_management_active.png",
    class: "",
  },


 

  {
    path: "/logout",
    title: "Logout",
    icon: "../../../assets/img/side-menu-icons/logout.png",
    icon2: "../../../assets/img/side-menu-icons/logout_active.png",
    class: "logOutUser",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  public listTitles: any[];
  menuItems: any[];
  userData:any;
  isOpen:boolean=false;
  private toggleButton: any;
  location: Location;
  mobile_menu_visible: any = 0;
  private sidebarVisible: boolean;

  constructor(
    private element: ElementRef,
    private router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.userData= localStorage.getItem("currentUser");
    this.userData = JSON.parse(this.userData);
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    // this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }
  logutUser() {
    this.authenticationService.logout();
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }
  toggleSideBar()
  {
    let sideBar=document.querySelector('.sidebar-offcanvas')
    if(sideBar)
    {
      sideBar.classList.remove('sidebar-offcanvas');
      sideBar.classList.add('sidebar-offcanvas-show');
    }
    this.isOpen=true
  }
  toggleSideBar2()
  {
    let sideBar=document.querySelector('.sidebar-offcanvas-show')
    if(sideBar)
    {
      sideBar.classList.remove('sidebar-offcanvas-show');
      sideBar.classList.add('sidebar-offcanvas');
      
    }
    this.isOpen=false
  }
}
