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


  public async updateBookCollection(
    id: number,
    book_id?: number,
    available?: number,
    state?: number
  ): Promise<BookCollection | null> {
    const bookCollection = await BookCollection.findByPk(id);
    if (bookCollection) {
      if (book_id) bookCollection.book_id = book_id;
      if (available) bookCollection.available = available;
      if (state) bookCollection.state = state;
      await bookCollection.save();
      return bookCollection;
    }
    return null;
  }


  public async deleteBookCollection(id: number): Promise<void> {
    const bookCollection = await BookCollection.findByPk(id);
    if (bookCollection) {
      await bookCollection.destroy();
    }
  }
  
}

export const bookCollectionService = new BookCollectionService();