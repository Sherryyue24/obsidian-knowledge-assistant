
import { Note, SearchHit } from '../types/interfaces';
import { getSnippets } from '../utils/textUtils';

export class SearchService {
    static keywordSearch(notes: Note[], keyword: string): SearchHit[] {
        const lowerKeyword = keyword.toLowerCase();
        const hits = notes.filter(note => 
            note.content.toLowerCase().includes(lowerKeyword)
        );

        return hits.map(note => ({
            name: note.name,
            path: note.path,
            snippets: getSnippets(note.content, keyword)
        }));
    }
}