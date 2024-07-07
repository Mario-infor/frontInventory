import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  
  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.getCategories();
  }

  displayColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

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
    }
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}