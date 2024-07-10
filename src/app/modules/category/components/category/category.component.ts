import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private utilService = inject(UtilService);
  isAdmin: any;

  ngOnInit(): void {
    this.getCategories();
    console.log("roles: ", this.utilService.getRoles());
    this.isAdmin = this.utilService.isAdmin();
  }

  displayColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
        (data: any) => {
          console.log("respuesta categories: ", data);
          this.processCategoriesResponse(data);
        },
        (error: any) => {
          console.log("error: ", error);
        }
      );
  }

  processCategoriesResponse(resp:any){
    const dataCategory: CategoryElement[] = [];

    if(resp.metadata[0].code == "00"){
      let listCategory = resp.category.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);

      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open( NewCategoryComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if(result == 1){
        this.openSnackBar("Categoría agregada", "Exitosa");
        this.getCategories();

      } else if(result == 2){
        this.openSnackBar("Se produjo un error al guardar categoría", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  edit(id:number, name:string, description:string){
    const dialogRef = this.dialog.open( NewCategoryComponent, {
      width: '450px',
      data: {id: id, name: name, description: description}
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if(result == 1){
        this.openSnackBar("Categoría Actualizada", "Exitosa");
        this.getCategories();

      } else if(result == 2){
        this.openSnackBar("Se produjo un error al actualizar categoría", "Error");
      }
    });
  }

  deleteCategory(id: any){
    const dialogRef = this.dialog.open( ConfirmComponent, {
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if(result == 1){
        this.openSnackBar("Categoría Eliminada", "Exitosa");
        this.getCategories();

      } else if(result == 2){
        this.openSnackBar("Se produjo un error al eliminar categoría", "Error");
      }
    });
  }

  findCategory(term: string){

    if(term.length == 0){
      return this.getCategories();
    }

    this.categoryService.getCategoryById(term).subscribe(
      (resp: any) => {
        this.processCategoriesResponse(resp);
      }
    );
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}