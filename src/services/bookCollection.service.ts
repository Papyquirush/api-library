import { Book } from "../models/book.model";
import { BookCollection } from "../models/bookCollection.model";
import { Author } from "../models/author.model";

export class BookCollectionService {
  public async getAllBookCollections(): Promise<BookCollection[]> {
    return BookCollection.findAll({
      include: [{
        model: Book,
        as: 'book',
      }]
    });
  }


  public async getBookCollection(id: number): Promise<BookCollection | null> {
    return BookCollection.findByPk(id, {
      include: [{
        model: Book,
        as: 'book',
      }]
    });
  }

  public async createBookCollection(
    book_id: number, 
    available: number, 
    state: number
  ): Promise<BookCollection> {

    if(!await Book.findByPk(book_id)){
      throw new Error('Book not found');
    }

    return BookCollection.create({ book_id, available, state });
  }

}

export const bookCollectionService = new BookCollectionService();