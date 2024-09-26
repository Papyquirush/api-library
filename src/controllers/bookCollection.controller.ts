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


  @Get("/:id")
  public async getBookCollection(id: number): Promise<BookCollectionDTO | null> {
    return bookCollectionService.getBookCollection(id);
  }

  @Post("/")
  public async createBookCollection(@Body() requestBody: BookCollectionDTO): Promise<BookCollectionDTO> {
    const { book_id, available, state } = requestBody;
    return bookCollectionService.createBookCollection( book_id, available, state);
  }


}
