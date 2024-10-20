import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch, Security } from "tsoa";
import { authorService } from "../services/author.service";
import { AuthorDTO } from "../dto/author.dto";
import { Author } from "../models/author.model";  
import { BookDTO } from "../dto/book.dto";


@Route("authors")
@Tags("Authors")

export class AuthorController extends Controller {
  // Récupère tous les auteurs
  @Get("/")
  @Security('jwt', ['author:read'])
  public async getAllAuthors(): Promise<AuthorDTO[]> {
    return authorService.getAllAuthors();
  }

  // Récupère un auteur par ID
  @Get("{id}")
  @Security('jwt', ['author:read'])
  public async getAuthorById(@Path() id: number): Promise<AuthorDTO | null> {
    const author = await authorService.getAuthorById(id);

    if(!author){
      const error = new Error('Author not found');
      (error as any).status = 404;
      throw error;
    }
    return author;
  }

  // Crée un nouvel auteur
  @Post("/")
  @Security('jwt', ['author:write'])
  public async createAuthor(
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO> {
    const { first_name, last_name } = requestBody;
    return authorService.createAuthor(first_name, last_name);
  }

  // Supprime un auteur par ID
  @Delete("{id}")
  @Security('jwt', ['author:delete'])
  public async deleteAuthor(@Path() id: number): Promise<void> {
    await authorService.deleteAuthor(id);
  }

  // Met à jour un auteur par ID
  @Patch("{id}")
  @Security('jwt', ['author:write'])
  public async updateAuthor(
    @Path() id: number,
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO | null> {
    const author = await authorService.getAuthorById(id);

    if(!author){
      const error = new Error('Author not found');
      (error as any).status = 404;
      throw error;
    }
    const { first_name, last_name } = requestBody;
    return authorService.updateAuthor(id, first_name, last_name);
  }

  @Get('{id}/books')
  @Security('jwt', ['author:read'])
  public async getBooksByAuthor(@Path() id: number): Promise<BookDTO[] | null> {
    const author = await authorService.getAuthorById(id);

    if (!author) {
      const error = new Error('Author not found');
      (error as any).status = 404;
      throw error;
    }

    return authorService.getBooksByAuthor(id);
  }
  
}