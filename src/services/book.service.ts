import { AuthorDTO } from "../dto/author.dto";
import { Author } from "../models/author.model";
import { Book } from "../models/book.model";

export class BookService {
  public async getAllBooks(): Promise<Book[]> {
    return Book.findAll({
        include: [{
            model: Author,
            as: 'author'
        }]
    });
  }

  public async getBookById(id: number): Promise<Book | null> {
    return Book.findByPk(id
      ,{
        include: [{
            model: Author,
            as: 'author'
        }]
    });
    
  }
  
  
 public async createBook(
    title: string,
    publish_year: number,
    isbn: string,
    author_id?: number
  ): Promise<Book> {
    if(author_id){
      return Book.create({title, publish_year, author_id , isbn});
    }else{
      throw new Error('Author ID is required');
    }
  }


}

export const bookService = new BookService();
