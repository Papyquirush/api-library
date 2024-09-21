import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { BookCollectionDTO } from "../dto/bookCollection.dto";
import { bookCollectionService } from "../services/bookCollection.service";

@Route("bookCollections")
@Tags("BookCollections")
export class BookCollectionController extends Controller {

  @Get("/")
  public async getAllBookCollections(): Promise<BookCollectionDTO[]> {
    return bookCollectionService.getAllBookCollections();
  }



}
