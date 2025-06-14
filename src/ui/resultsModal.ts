import { Modal } from 'obsidian';
import { SearchHit } from '../types/interfaces';

export class SearchResultsModal extends Modal {
        constructor(
        app: any, 
        private hits: SearchHit[], 
        private query: string,
        private isSemanticSearch: boolean = false
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        // 标题
        const title = this.isSemanticSearch ? '语义搜索结果' : '关键词搜索结果';
        contentEl.createEl('h3', { text: `${title}：${this.query}` });

        if (this.hits.length === 0) {
            contentEl.createEl('p', { text: '未找到相关笔记。' });
            return;
        }

        // 构造高亮正则（仅用于关键词搜索）
        const keywordRegex = this.isSemanticSearch ? null : 
            new RegExp(this.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        this.hits.forEach(hit => {
            const hitDiv = contentEl.createDiv({ cls: 'search-hit' });
            
            // 可点击的笔记标题
            const titleEl = hitDiv.createEl('h3', { text: hit.name });
            titleEl.style.cursor = 'pointer';
            titleEl.onclick = () => {
                this.app.workspace.openLinkText(hit.path, '', false);
                this.close();
            };

            // 显示相似度分数（仅语义搜索）
            if (this.isSemanticSearch && hit.score !== undefined) {
                const scoreEl = hitDiv.createEl('p', { 
                    text: `相似度: ${(hit.score * 100).toFixed(1)}%`,
                    cls: 'search-score'
                });
                scoreEl.style.fontSize = '0.8em';
                scoreEl.style.color = 'var(--text-muted)';
                scoreEl.style.margin = '4px 0 8px 0';
            }

            // 显示每个片段并高亮关键词（仅关键词搜索）
            hit.snippets.forEach((snippet, index) => {
                if (index > 0) {
                    hitDiv.createEl('hr');
                }
                const snippetDiv = hitDiv.createDiv();
                
                if (keywordRegex && !this.isSemanticSearch) {
                    // 关键词搜索：高亮关键词
                    snippetDiv.innerHTML = snippet.replace(
                        keywordRegex,
                        (match) => `<span class="search-keyword">${match}</span>`
                    );
                } else {
                    // 语义搜索：直接显示文本
                    snippetDiv.textContent = snippet;
                }
            });
        });
    }

    onClose() {
        this.contentEl.empty();
    }
}