import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Library,
  Search,
  Book,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { LibraryBook, LibraryLoan } from '../../types';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalogue' | 'loans'>('catalogue');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loans, setLoans] = useState<LibraryLoan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dataService.getLibraryBooks().then(setBooks);
    dataService.getLibraryLoans().then(setLoans);
  }, []);

  const handleBorrow = async (book: LibraryBook) => {
    await dataService.borrowBook(book, user?.id || 'b0000000-0000-0000-0000-000000000001');
    setBooks(await dataService.getLibraryBooks());
    setLoans(await dataService.getLibraryLoans());
    alert(`Successfully borrowed "${book.title}"! Due in 14 days.`);
  };

  const handleReturn = async (loan: LibraryLoan) => {
    await dataService.returnBook(loan.id, loan.book_id);
    setBooks(await dataService.getLibraryBooks());
    setLoans(await dataService.getLibraryLoans());
    alert(`Book returned successfully. Thank you!`);
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus Central Library
            </h1>
            <Badge variant="brand">Digital & Physical Repository</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse 25,000+ technical volumes, search shelf locations, manage loans and instant renewals
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, author, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
            activeTab === 'catalogue'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Book Catalogue ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
            activeTab === 'loans'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          My Active Loans ({loans.filter((l) => l.status === 'borrowed').length})
        </button>
      </div>

      {/* Catalogue Grid */}
      {activeTab === 'catalogue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">
                    {book.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400">
                    ISBN: {book.isbn}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Author: {book.author}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Shelf: {book.shelf_location || 'General Stacks'}</span>
                  <span className={book.available_copies > 0 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                    {book.available_copies} / {book.total_copies} Copies Available
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={book.available_copies <= 0}
                  onClick={() => handleBorrow(book)}
                >
                  {book.available_copies > 0 ? 'Borrow Volume' : 'Out of Stock'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Active Loans Tab */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={loan.status === 'borrowed' ? 'brand' : 'neutral'}>
                    {loan.status}
                  </Badge>
                  <span className="text-xs text-slate-500">Fine: ₹{loan.fine_amount}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {loan.book_title}
                </h3>
                <div className="text-xs text-slate-500">
                  Issued: {loan.issue_date} • Return Due: <span className="font-semibold text-slate-800 dark:text-slate-200">{loan.due_date}</span>
                </div>
              </div>

              {loan.status === 'borrowed' && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={() => handleReturn(loan)}
                  >
                    Return Book
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
