import { Author } from "../models/author.model";
import { Book } from '../models/book.model';


export class AuthorService {
  // Récupère tous les auteurs
  public async getAllAuthors(): Promise<Author[]> {
    return Author.findAll();
  }

  // Récupère un auteur par ID
  public async getAuthorById(id: number): Promise<Author | null> {
    return Author.findByPk(id);
  }

  // Crée un nouvel auteur
  public async createAuthor(
    firstName: string,
    lastName: string
  ): Promise<Author> {
    return Author.create({first_name: firstName, last_name: lastName });
  }

  // Supprime un auteur par ID
  public async deleteAuthor(id: number): Promise<void> {


    // On récupère tous les livres de l'auteur
    const books = await Book.findAll({
      where: {
        author_id: id
      }
    });

    if(books.length == 0){
      const author = await Author.findByPk(id);
      if (author) {
        await author.destroy();
      }
    }else {
      const error = new Error('Author has books');
      (error as any).status = 400;
      throw error;
    }


    
  }

  // Met à jour un auteur
  public async updateAuthor(
    id: number,
    firstName?: string,
    lastName?: string
  ): Promise<Author | null> {
    const author = await Author.findByPk(id);
    if (author) {
      if (firstName) author.first_name = firstName;
      if (lastName) author.last_name = lastName;
      await author.save();
      return author;
    }
    return null;
  }
}

export const authorService = new AuthorService();
