import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch , Security} from "tsoa";
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

  @Patch("/:id")
  public async updateBookCollection(
    @Path() id: number,
    @Body() requestBody: BookCollectionDTO
  ): Promise<BookCollectionDTO | null> {
    const bookCollection = await bookCollectionService.getBookCollection(id);

    if(!bookCollection){
      const error = new Error('BookCollection not found');
      (error as any).status = 404;
      throw error;
    }
    const { book_id, available, state } = requestBody;
    return bookCollectionService.updateBookCollection(id, book_id, available, state);
  }


  @Delete("/:id")
  public async deleteBookCollection(id: number): Promise<void> {
    const bookCollection = await bookCollectionService.getBookCollection(id);

    if(!bookCollection){
      const error = new Error('BookCollection not found');
      (error as any).status = 404;
      throw error;
    }

    await bookCollectionService.deleteBookCollection(id);
  }

  

}
