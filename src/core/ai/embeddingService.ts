import { Note, SearchHit } from '../../types/interfaces';
import { getI18nTexts } from '../../utils/i18n';

export class EmbeddingService {
    public vectors: { id: string, name: string, text: string, vector: number[] }[] = [];
    pipe: any;

    constructor(private settings: any) {}

    private getEmbeddingEndpoint(): string {
        const baseUrl = this.settings.apiUrl || 'https://api.openai.com/v1';
        const endpoint = baseUrl.replace(/\/$/, '');
        return endpoint.endsWith('/embeddings') ? endpoint : `${endpoint}/embeddings`;
    }

    async validateApiKey(): Promise<boolean> {
        try {
            const response = await fetch(this.getEmbeddingEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.openaiApiKey}`
                },
                body: JSON.stringify({
                    input: 'test',
                    model: 'text-embedding-3-small'
                })
            });
            if (!response.ok) return false;
            const data = await response.json();
            return Array.isArray(data.data) && !!data.data[0]?.embedding;
        } catch (e) {
            return false;
        }
    }


    async embedText(text: string): Promise<number[]> {
        if (this.settings.localEmbedding && this.pipe) {
            const result = await this.pipe(text, { pooling: 'mean' });
            return Array.from(result.data);
        }
        
        // 否则使用OpenAI API
        return this.embedWithOpenAI(text);
    }

    private async embedWithOpenAI(text: string): Promise<number[]> {
        try {
            const response = await fetch(this.getEmbeddingEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.openaiApiKey}`
                },
                body: JSON.stringify({
                    input: text,
                    model: 'text-embedding-3-small'
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                const texts = getI18nTexts(this.settings.language);
                console.error(`${texts.embeddingApiError} ${response.status}:`, errorText);
                throw new Error(`${texts.embeddingApiRequestFailed}: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 验证响应格式
            if (!data || !Array.isArray(data.data) || !data.data[0] || !Array.isArray(data.data[0].embedding)) {
                const texts = getI18nTexts(this.settings.language);
                console.error(`${texts.invalidApiResponseFormat}:`, data);
                throw new Error(texts.apiReturnedInvalidData);
            }
            
            return data.data[0].embedding;
        } catch (error) {
            const texts = getI18nTexts(this.settings.language);
            console.error(`${texts.embeddingApiCallFailed}:`, error);
            
            // 如果API调用失败，可以选择返回零向量或抛出错误
            if (error.message.includes(texts.embeddingApiRequestFailed)) {
                throw error; // 重新抛出API错误
            } else {
                // 对于其他错误，可能是网络问题，返回零向量避免中断整个流程
                console.warn(texts.returnZeroVectorFallback);
                return new Array(1536).fill(0); // text-embedding-3-small 的维度是 1536
            }
        }
    }

    async createVectorIndex(
        notes: Note[], 
        progressCallback?: (current: number, total: number, status: string) => void,
        cancelCallback?: () => boolean
    ) {
        this.vectors = [];
        const texts = getI18nTexts(this.settings.language);
        console.log(`${texts.startCreatingVectorIndex} ${notes.length} ${texts.notesUnit}...`);
        
        if (progressCallback) {
            progressCallback(0, notes.length, texts.beginCreatingVectorIndex);
        }
        
        let successCount = 0;
        let failureCount = 0;
        
        for (let i = 0; i < notes.length; i++) {
            // 检查是否被取消
            if (cancelCallback && cancelCallback()) {
                console.log(texts.vectorIndexCreationCancelled);
                throw new Error(texts.operationCancelled);
            }
            
            const note = notes[i];
            console.log(`${texts.processingNote} ${i + 1}/${notes.length}: ${note.name}`);
            
            if (progressCallback) {
                progressCallback(i, notes.length, `${texts.processingNoteLabel}: ${note.name}`);
            }
            
            try {
                const vector = await this.embedText(note.content);
                this.vectors.push({
                    id: note.path,
                    name: note.name,
                    text: note.content,
                    vector
                });
                successCount++;
            } catch (error) {
                console.error(`${texts.processNoteError} "${note.name}":`, error);
                failureCount++;
                
                // 可以选择跳过这个文件，或者使用零向量
                // 这里选择跳过，避免使用无效的向量
                continue;
            }
            
            // 每处理5个文件显示一次进度
            if ((i + 1) % 5 === 0) {
                console.log(`${texts.progress}: ${i + 1}/${notes.length} (${Math.round((i + 1) / notes.length * 100)}%) - ${texts.successful}: ${successCount}, ${texts.failed}: ${failureCount}`);
            }
        }
        
        if (progressCallback) {
            progressCallback(notes.length, notes.length, `${texts.completedLabel} ${texts.successful}: ${successCount}, ${texts.failed}: ${failureCount}`);
        }
        
        console.log(`${texts.vectorIndexCreationComplete} ${texts.totalProcessed}: ${notes.length}, ${texts.successful}: ${successCount}, ${texts.failed}: ${failureCount}`);
        
        if (failureCount > 0) {
            console.warn(`${failureCount} ${texts.filesFailedToProcess}`);
        }
    }

    private cosineSimilarity(a: number[], b: number[]): number {
        const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
        const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
        const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
        return dot / (normA * normB);
    }

    async semanticSearch(query: string, limit = 5): Promise<SearchHit[]> {
        try {
            const queryVector = await this.embedText(query);
            const scored = this.vectors.map(row => ({
                ...row,
                score: this.cosineSimilarity(queryVector, row.vector)
            }));

            // 打印每个笔记的分数
            const texts = getI18nTexts(this.settings.language);
            console.log(`${texts.semanticRetrievalScores}:`, scored.map(r => ({
                name: r.name,
                score: r.score
            })));

            return scored
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(r => ({
                    path: r.id,
                    name: r.name,
                    snippets: this.extractMeaningfulSnippets(r.text, query),
                    score: r.score
                }));
        } catch (error) {
            const texts = getI18nTexts(this.settings.language);
            console.error(`${texts.semanticSearchFailed}:`, error);
            throw new Error(`${texts.semanticSearchFailed}: ${error.message}`);
        }
    }

    // 新增：提取有意义的内容片段
    private extractMeaningfulSnippets(content: string, query: string, maxSnippets = 2): string[] {
        // 1. 移除frontmatter (properties)
        let cleanContent = content;
        
        // 移除YAML frontmatter
        if (cleanContent.startsWith('---')) {
            const endIndex = cleanContent.indexOf('---', 3);
            if (endIndex !== -1) {
                cleanContent = cleanContent.substring(endIndex + 3).trim();
            }
        }
        
        // 2. 按段落分割内容
        const paragraphs = cleanContent
            .split(/\n\s*\n/) // 按空行分割段落
            .map(p => p.trim())
            .filter(p => p.length > 20) // 过滤太短的段落
            .filter(p => !p.startsWith('#')) // 暂时保留标题，但优先级较低
            .filter(p => !p.match(/^[\-\*\+]\s/)) // 过滤简单的列表项
            .filter(p => !p.match(/^\d+\.\s/)); // 过滤数字列表
        
        if (paragraphs.length === 0) {
            // 如果没有合适的段落，返回清理后内容的开头
            return [cleanContent.substring(0, 200) + '...'];
        }
        
        // 3. 计算段落与查询的相关性（简单的关键词匹配）
        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        
        const scoredParagraphs = paragraphs.map(paragraph => {
            const lowerParagraph = paragraph.toLowerCase();
            let score = 0;
            
            // 计算关键词匹配分数
            queryWords.forEach(word => {
                const matches = (lowerParagraph.match(new RegExp(word, 'g')) || []).length;
                score += matches;
            });
            
            // 给较长的段落稍微加分
            if (paragraph.length > 50 && paragraph.length < 300) {
                score += 0.5;
            }
            
            return { paragraph, score };
        });
        
        // 4. 选择最相关的段落
        const selectedParagraphs = scoredParagraphs
            .sort((a, b) => b.score - a.score)
            .slice(0, maxSnippets)
            .map(item => {
                let snippet = item.paragraph;
                
                // 限制长度
                if (snippet.length > 200) {
                    snippet = snippet.substring(0, 200) + '...';
                }
                
                return snippet;
            });
        
        // 5. 如果没有找到相关段落，返回前几个段落
        if (selectedParagraphs.length === 0) {
            return paragraphs.slice(0, maxSnippets).map(p => {
                if (p.length > 200) {
                    return p.substring(0, 200) + '...';
                }
                return p;
            });
        }
        
        return selectedParagraphs;
    }

    async saveToCache() {
        localStorage.setItem('vectors', JSON.stringify(this.vectors));
    }
    
    async loadFromCache() {
        const data = localStorage.getItem('vectors');
        if (data) {
            this.vectors = JSON.parse(data);
        }
    }

    // 初始化本地embedding模型
    async initializeLocalModel() {
        if (this.settings.localEmbedding && !this.pipe) {
            try {
                // 动态导入transformers库
                const { pipeline } = await import('@xenova/transformers');
                this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
                const texts = getI18nTexts(this.settings.language);
                console.log(texts.localEmbeddingModelLoaded);
            } catch (error) {
                const texts = getI18nTexts(this.settings.language);
                console.error(`${texts.localEmbeddingModelLoadFailed}:`, error);
                // 如果本地模型加载失败，自动切换到API模式
                this.settings.localEmbedding = false;
            }
        }
    }
}