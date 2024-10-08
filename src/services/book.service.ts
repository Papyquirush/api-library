import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import { BookCollection } from "../models/bookCollection.model";

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


  public async updateBook(
    id: number,
    title?: string,
    publish_year?: number,
    isbn?: string,
    author_id?: number
  ): Promise<Book | null> {
    const book = await Book.findByPk(id);
    if (book) {
      if (title) book.title = title;
      if (publish_year) book.publish_year = publish_year;
      if (isbn) book.isbn = isbn;
      if (author_id) book.author_id = author_id;
      await book.save();
      return book;
    }
    return null;
  }

  public async deleteBook(id: number): Promise<void> {


    //On récupère tous les livres de la bibliothèque
    const books = await BookCollection.findAll({
      where: {
        book_id: id
      }
    });


    if(books.length == 0){
      const book = await Book.findByPk(id);
      if (book) {
        await book.destroy();
      }
    }else {
      const error = new Error('BookCollection has book');
      (error as any).status = 400;
      throw error;
    }

    
  }


  public async getBookCollectionsByBook(id: number): Promise<BookCollection[]> {
    return BookCollection.findAll({
      where: {
        book_id: id
      }
    });
  }



}





export const bookService = new BookService();
