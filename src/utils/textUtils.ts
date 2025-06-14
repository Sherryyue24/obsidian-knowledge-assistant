// textUtils.ts
export function getSnippets(content: string, keyword: string, contextLen = 50): string[] {
    const regex = new RegExp(keyword, 'gi');
    const snippets: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const start = Math.max(0, match.index - contextLen);
        const end = Math.min(content.length, match.index + keyword.length + contextLen);
        let snippet = content.slice(start, end);
        
        if (start > 0) snippet = "..." + snippet;
        if (end < content.length) snippet = snippet + "...";
        snippets.push(snippet);
    }
    
    return snippets;
}