export interface Note {
    path: string;
    name: string;
    content: string;
}

export interface SearchHit {
    name: string;
    path: string;
    snippets: string[];
    score?: number;  // 语义搜索时的相似度分数
}

export interface PluginCache {
    [path: string]: string;
}