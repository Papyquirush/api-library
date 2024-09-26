import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { BookCollectionDTO } from "../dto/bookCollection.dto";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  public async getAllBooks(): Promise<BookDTO[]> {
    return bookService.getAllBooks();
  }

  @Get("{id}")
  public async getBookById(@Path() id: number): Promise<BookDTO | null> {
    const book = await bookService.getBookById(id);

    if(!book){
      const error = new Error('Book not found');
      (error as any).status = 404;
      throw error;
    }
    return book;
  }

  @Post("/")
  public async createBook(
    @Body() requestBody: BookDTO
  ): Promise<BookDTO> {
    const { title, publish_year, author, isbn } = requestBody;
    return bookService.createBook(title,publish_year , isbn, author?.id);
  }
  

  @Patch("{id}")
  public async updateBook(
    @Path() id: number,
    @Body() requestBody: BookDTO
  ): Promise<BookDTO | null> {
    const book = await bookService.getBookById(id);

    if(!book){
      const error = new Error('Book not found');
      (error as any).status = 404;
      throw error;
    }
    const { title, publish_year, author, isbn } = requestBody;
    return bookService.updateBook(id, title, publish_year, isbn, author?.id);
  }


  @Delete("{id}")
  public async deleteBook(@Path() id: number): Promise<void> {
    const book = await bookService.getBookById(id);

    if(!book){
      const error = new Error('Book not found');
      (error as any).status = 404;
      throw error;
    }
    await bookService.deleteBook(id);
  }

  @Get('{id}/book-collections')
  public async getBookCollectionsByBookId(@Path() id: number): Promise<BookCollectionDTO[]> {
    const book = await bookService.getBookCollectionsByBook(id);

    if (!book) {
      const error = new Error('Book not found');
      (error as any).status = 404;
      throw error;
    }

    return book;
  }
  
}

