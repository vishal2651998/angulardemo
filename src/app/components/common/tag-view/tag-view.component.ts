import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tag-view",
  templateUrl: "./tag-view.component.html",
  styleUrls: ["./tag-view.component.scss"],
})
export class TagViewComponent implements OnInit {
  @Input() tagItems: any;
  @Input() isKnowledgeArticle = false;
  public tagFlag: boolean = true;
  public emptyCont: string = "<i class='gray'>None</i>";

  constructor() {}

  ngOnInit(): void {
    console.log(this.tagItems);
    this.tagFlag = this.tagItems.length > 0 ? true : false;
  }
}
