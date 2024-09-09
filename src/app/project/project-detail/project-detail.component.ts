import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  projectsList: any = [];
  projectId:any=null;
  imagesArray:string[]=[]
  modelStyle: string = "";
  deleteProjectId: any = null;;
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private _Activatedroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { 
    this.projectId = this._Activatedroute.snapshot.params["id"];
  }

  ngOnInit() {
    if(this.projectId)
      {
        this.spinner.show();
        this.getProductData(this.projectId)
      }
    // this.getRoles();

   
  }
  ngAfterViewInit(): void {
    $(document).on("click", ".showDropdown", function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });
  }

 
  getProductData(productIdGetting: any) {
    this.SERVER.getProductById(productIdGetting)
      .subscribe(
        response => {
          // console.log(response)
          this.projectsList = response?.data;
          this.imagesArray=response?.data?.constructionEstimate
          console.log(this.projectsList);
          // console.log(this.imagesArray);
          // Hide the spinner after successful response
          this.spinner.hide();
        },
        error => {
          console.error('Error fetching product data:', error);
          // Handle error as needed
          // Hide the spinner in case of error
          this.spinner.hide();
        }
      );
  }
  goBack(): void {
    this.location.back();
  }
  openDeleteModel(item: any) {
    this.modelStyle = "block";
    this.deleteProjectId = item;
  }
  closeModel() {
    this.modelStyle = "none";
  }

  onDeleteProduct(): void {
    this.modelStyle = "none";
    this.SERVER.deleteProduct(this.deleteProjectId)
      .subscribe(
        response => {
          this.toastr.success("Success!", "Project is Deleted");
          this.router.navigate(["/project"]);
          // console.log('Product deleted successfully:', response);
          // Add any additional logic after successful deletion
        },
        error => {
          console.error('Error deleting product:', error);
          // Handle error as needed
        }
      );
  }
}
