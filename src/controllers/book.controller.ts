import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch, Security, Request } from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { BookCollectionDTO } from "../dto/bookCollection.dto";
import { authorService } from "../services/author.service";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  @Security('jwt', ['book:read'])
  public async getAllBooks(): Promise<BookDTO[]> {
    return bookService.getAllBooks();
  }

  @Get("{id}")
  @Security('jwt', ['book:read'])
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
  @Security('jwt', ['book:write'])
  public async createBook(
    @Request() request: any,
    @Body() requestBody: BookDTO
  ): Promise<BookDTO> {
    const { title, publish_year, author, isbn } = requestBody;

    const username = request.user.username;

    if (username === 'utilisateur') {
      if (!author || !author.id) {
        throw new Error("Author must be specified and must exist");
      }

      const existingAuthor = await authorService.getAuthorById(author.id);
      if (!existingAuthor) {
        throw new Error("Author does not exist");
      }
    }

    return bookService.createBook(title, publish_year, isbn, author?.id);
  }
  

  @Patch("{id}")
  @Security('jwt', ['book:write'])
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
  @Security('jwt', ['book:delete'])
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
  @Security('jwt', ['book:read'])
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

