import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import MyPlugin from '../core/plugin';
import { SearchService } from '../core/searchService';
import { ProgressModal } from './progressModal';
import { AIService } from '../core/ai/aiService';
import { getI18nTexts } from '../utils/i18n';

export const VIEW_TYPE_AI_ASSISTANT = 'knowledge-assistant-sidebar';

export class AISidebarView extends ItemView {
    private plugin: MyPlugin;
    private searchInput: HTMLInputElement;
    private modeToggle: HTMLElement;
    private semanticCheckbox: HTMLInputElement;
    private semanticCheckboxContainer: HTMLElement;
    private resultsContainer: HTMLElement;
    private isSemanticSearch: boolean = false;
    private isQAMode: boolean = false;
    private currentQuery: string = '';
    private aiService: AIService;

    constructor(leaf: WorkspaceLeaf, plugin: MyPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.aiService = new AIService(plugin.settings);
    }

    getViewType(): string {
        return VIEW_TYPE_AI_ASSISTANT;
    }

    getDisplayText(): string {
        return 'Knowledge Assistant';
    }

    getIcon(): string {
        return 'brain-circuit';
    }

    async onOpen() {
        this.createSidebarUI();
    }

    private createSidebarUI() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('knowledge-assistant-sidebar');
        
        const texts = getI18nTexts(this.plugin.settings.language);

        // 标题区域
        const headerEl = container.createDiv({ cls: 'sidebar-header' });
        headerEl.createEl('h2', { text: '🧠 Knowledge Assistant', cls: 'sidebar-title' });

        // 模式切换（搜索/问答）
        const modeContainer = container.createDiv({ cls: 'mode-container' });
        
        this.modeToggle = modeContainer.createDiv({ cls: 'mode-toggle' });
        const searchModeBtn = this.modeToggle.createEl('button', { 
            text: texts.searchModeBtn, 
            cls: 'mode-btn active' 
        });
        const qaModeBtn = this.modeToggle.createEl('button', { 
            text: texts.qaModeBtn, 
            cls: 'mode-btn' 
        });

        // 语义搜索勾选框（仅在搜索模式下显示）
        this.semanticCheckboxContainer = container.createDiv({ cls: 'semantic-checkbox-container' });
        const checkboxWrapper = this.semanticCheckboxContainer.createDiv({ cls: 'checkbox-wrapper' });
        this.semanticCheckbox = checkboxWrapper.createEl('input', { 
            type: 'checkbox',
            cls: 'semantic-checkbox'
        });
        checkboxWrapper.createEl('label', { 
            text: texts.semanticCheckbox,
            cls: 'checkbox-label'
        });

        // 模式描述
        const modeDescContainer = container.createDiv({ cls: 'mode-desc-container' });
        const searchDesc = modeDescContainer.createDiv({ 
            text: texts.searchModeDesc,
            cls: 'mode-desc active'
        });
        const qaDesc = modeDescContainer.createDiv({ 
            text: texts.qaModeDesc,
            cls: 'mode-desc'
        });

        // 模式切换事件
        searchModeBtn.onclick = () => {
            this.isQAMode = false;
            searchModeBtn.addClass('active');
            qaModeBtn.removeClass('active');
            searchDesc.addClass('active');
            qaDesc.removeClass('active');
            this.semanticCheckboxContainer.style.display = 'block';
            this.searchInput.placeholder = texts.searchPlaceholder;
            this.updateSearchButton();
        };

        qaModeBtn.onclick = () => {
            this.isQAMode = true;
            qaModeBtn.addClass('active');
            searchModeBtn.removeClass('active');
            qaDesc.addClass('active');
            searchDesc.removeClass('active');
            this.semanticCheckboxContainer.style.display = 'none';
            this.searchInput.placeholder = texts.questionPlaceholder;
            this.updateSearchButton();
        };

        // 语义搜索勾选框事件
        this.semanticCheckbox.onchange = () => {
            this.isSemanticSearch = this.semanticCheckbox.checked;
        };

        // 搜索输入框
        const searchContainer = container.createDiv({ cls: 'search-container' });
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            cls: 'sidebar-search-input',
            placeholder: texts.searchPlaceholder
        });

        const searchBtn = searchContainer.createEl('button', {
            text: texts.search,
            cls: 'sidebar-search-btn'
        });

        // 搜索事件
        const performSearch = () => this.performSearch();
        searchBtn.onclick = performSearch;
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 快速操作按钮
        const actionsContainer = container.createDiv({ cls: 'quick-actions' });
        
        const clearBtn = actionsContainer.createEl('button', {
            text: texts.clearBtn,
            cls: 'action-btn clear-btn'
        });
        clearBtn.onclick = () => this.clearResults();

        const refreshBtn = actionsContainer.createEl('button', {
            text: texts.refreshBtn,
            cls: 'action-btn refresh-btn'
        });
        refreshBtn.onclick = () => this.refreshCache();

        // 搜索结果容器
        this.resultsContainer = container.createDiv({ cls: 'sidebar-results' });
        this.showWelcomeMessage();

        // 统计信息
        const statsContainer = container.createDiv({ cls: 'sidebar-stats' });
        this.updateStats(statsContainer);
    }

    private updateSearchButton() {
        const searchBtn = this.containerEl.querySelector('.sidebar-search-btn') as HTMLElement;
        if (searchBtn) {
            const texts = getI18nTexts(this.plugin.settings.language);
            if (this.isQAMode) {
                searchBtn.textContent = texts.question;
            } else {
                searchBtn.textContent = texts.search;
            }
        }
    }

    private showWelcomeMessage() {
        this.resultsContainer.empty();
        const welcomeEl = this.resultsContainer.createDiv({ cls: 'welcome-message' });
        
        const texts = getI18nTexts(this.plugin.settings.language);
        
        welcomeEl.createEl('div', { 
            text: texts.welcomeTitle,
            cls: 'welcome-title'
        });
        
        welcomeEl.createEl('div', { 
            text: texts.welcomeDesc,
            cls: 'welcome-desc'
        });

        // 使用提示
        const tipsEl = welcomeEl.createDiv({ cls: 'welcome-tips' });
        tipsEl.createEl('div', { text: texts.featuresTitle });
        tipsEl.createEl('div', { text: `• ${texts.searchModeDesc}` });
        tipsEl.createEl('div', { text: `• ${texts.qaModeDesc}` });
        tipsEl.createEl('div', { text: `• ${texts.semanticCheckbox}：${texts.semanticSearchDesc}` });
        tipsEl.createEl('div', { text: texts.clickHint });
    }

    private async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            const texts = getI18nTexts(this.plugin.settings.language);
            new Notice(this.isQAMode ? texts.qaHint : texts.semanticSearchHint);
            return;
        }

        this.currentQuery = query;
        this.resultsContainer.empty();

        // 显示加载状态
        const loadingEl = this.resultsContainer.createDiv({ cls: 'loading-state' });
        const texts = getI18nTexts(this.plugin.settings.language);
        const loadingText = this.isQAMode ? texts.thinking : texts.searching;
        loadingEl.createEl('div', { text: loadingText, cls: 'loading-text' });

        try {
            if (this.isQAMode) {
                await this.performQA(query);
            } else if (this.isSemanticSearch) {
                await this.performSemanticSearch(query);
            } else {
                await this.performKeywordSearch(query);
            }
        } catch (error) {
            console.error('操作失败:', error);
            this.showError(error.message);
        }
    }

    private async performKeywordSearch(query: string) {
        await this.plugin.refreshNotesIfNeeded();
        const hits = SearchService.keywordSearch(this.plugin.cachedNotes, query);
        this.displayResults(hits, false);
    }

    private async performSemanticSearch(query: string) {
        let progressModal: ProgressModal | null = null;
        let isCancelled = false;

        try {
            // 检查向量缓存
            if (!this.plugin.embeddingService.vectors.length) {
                await this.plugin.embeddingService.loadFromCache();
                
                if (!this.plugin.embeddingService.vectors.length) {
                    await this.plugin.refreshNotesIfNeeded();
                    
                    if (this.plugin.cachedNotes.length === 0) {
                        const texts = getI18nTexts(this.plugin.settings.language);
                        throw new Error(texts.noNotesFound);
                    }

                    // 显示进度模态框
                    const texts = getI18nTexts(this.plugin.settings.language);
                    progressModal = new ProgressModal(this.app, '🧠 创建语义索引', true);
                    progressModal.open();
                    progressModal.setStatus(texts.creatingIndex);
                    
                    progressModal.setCancelCallback(() => {
                        isCancelled = true;
                    });
                    
                    await this.plugin.embeddingService.createVectorIndex(
                        this.plugin.cachedNotes,
                        (current, total, status) => {
                            if (progressModal && !isCancelled) {
                                progressModal.updateProgress(current, total, status);
                            }
                        },
                        () => isCancelled || (progressModal?.isCancelRequested() ?? false)
                    );
                    
                    if (!isCancelled) {
                        await this.plugin.embeddingService.saveToCache();
                        progressModal?.complete('索引创建完成！');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            if (isCancelled) {
                progressModal?.close();
                return;
            }

            if (progressModal) {
                progressModal.close();
            }

            if (this.plugin.embeddingService.vectors.length === 0) {
                const texts = getI18nTexts(this.plugin.settings.language);
                throw new Error(texts.noVectorData);
            }

            const hits = await this.plugin.embeddingService.semanticSearch(
                query, 
                this.plugin.settings.maxSearchResults
            );
            this.displayResults(hits, true);

        } catch (error) {
            if (progressModal) {
                if (error.message.includes('操作已取消')) {
                    progressModal.close();
                } else {
                    progressModal.showError(error.message);
                    setTimeout(() => progressModal?.close(), 3000);
                }
            }
            throw error;
        }
    }

    private displayResults(hits: any[], isSemanticSearch: boolean) {
        this.resultsContainer.empty();

        if (hits.length === 0) {
            const texts = getI18nTexts(this.plugin.settings.language);
            const noResultsEl = this.resultsContainer.createDiv({ cls: 'no-results' });
            noResultsEl.createEl('div', { text: texts.noResultsFound });
            noResultsEl.createEl('div', { text: texts.tryDifferentSearch });
            return;
        }

        // 结果标题
        const texts = getI18nTexts(this.plugin.settings.language);
        const resultHeaderEl = this.resultsContainer.createDiv({ cls: 'result-header' });
        const searchTypeIcon = isSemanticSearch ? '🧠' : '🔍';
        const searchTypeName = isSemanticSearch ? texts.semanticSearchType : texts.keywordSearchType;
        resultHeaderEl.createEl('div', { 
            text: `${searchTypeIcon} ${searchTypeName} (${hits.length} 个结果)`,
            cls: 'result-title'
        });

        // 搜索结果列表
        hits.forEach((hit, index) => {
            const hitEl = this.resultsContainer.createDiv({ cls: 'sidebar-search-hit' });
            
            // 笔记标题
            const titleEl = hitEl.createEl('div', { 
                text: hit.name,
                cls: 'hit-title'
            });
            titleEl.onclick = () => {
                this.app.workspace.openLinkText(hit.path, '', false);
            };

            // 相似度分数（仅语义搜索）
            if (isSemanticSearch && hit.score !== undefined) {
                const scoreEl = hitEl.createEl('div', {
                    text: `${texts.similarity}: ${(hit.score * 100).toFixed(1)}%`,
                    cls: 'hit-score'
                });
            }

            // 内容片段
            if (hit.snippets && hit.snippets.length > 0) {
                const snippetEl = hitEl.createEl('div', { cls: 'hit-snippet' });
                const snippet = hit.snippets[0];
                
                if (!isSemanticSearch && this.currentQuery) {
                    // 关键词搜索：高亮关键词
                    const regex = new RegExp(
                        this.currentQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
                        'gi'
                    );
                    snippetEl.innerHTML = snippet.replace(
                        regex,
                        (match: string) => `<span class="search-keyword">${match}</span>`
                    );
                } else {
                    snippetEl.textContent = snippet;
                }
            }

            // 路径信息
            const pathEl = hitEl.createEl('div', {
                text: hit.path,
                cls: 'hit-path'
            });
        });
    }

    private showError(message: string) {
        this.resultsContainer.empty();
        const texts = getI18nTexts(this.plugin.settings.language);
        const errorEl = this.resultsContainer.createDiv({ cls: 'error-state' });
        errorEl.createEl('div', { text: texts.searchFailedError });
        errorEl.createEl('div', { text: message, cls: 'error-message' });
    }

    private clearResults() {
        this.searchInput.value = '';
        this.showWelcomeMessage();
    }

    private async refreshCache() {
        const refreshBtn = this.containerEl.querySelector('.refresh-btn') as HTMLElement;
        if (refreshBtn) {
            refreshBtn.textContent = '⏳ 刷新中...';
            refreshBtn.style.pointerEvents = 'none';
        }

        try {
            this.plugin.clearCache();
            new Notice('✅ 缓存已清除');
        } finally {
            if (refreshBtn) {
                refreshBtn.textContent = '🔄 刷新缓存';
                refreshBtn.style.pointerEvents = 'auto';
            }
        }
    }

    private updateStats(container: HTMLElement) {
        container.empty();
        
        const texts = getI18nTexts(this.plugin.settings.language);
        const notesCount = this.plugin.cachedNotes?.length || 0;
        const vectorsCount = this.plugin.embeddingService?.vectors?.length || 0;
        
        container.createEl('div', { 
            text: `📄 ${texts.notesCount}: ${notesCount} | 🧠 ${texts.vectorsCount}: ${vectorsCount}`,
            cls: 'stats-text'
        });
    }

    async onClose() {
        // 清理工作
    }

    // 刷新界面语言
    public refreshLanguage() {
        this.createSidebarUI();
    }

    // 新增：设置问答模式并执行问答
    public setQAMode(question: string) {
        // 切换到问答模式
        this.isQAMode = true;
        this.isSemanticSearch = false;
        
        // 更新UI状态
        const qaModeBtn = this.containerEl.querySelector('.mode-btn:nth-child(2)') as HTMLElement;
        const searchModeBtn = this.containerEl.querySelector('.mode-btn:nth-child(1)') as HTMLElement;
        const searchDesc = this.containerEl.querySelector('.mode-desc:nth-child(1)') as HTMLElement;
        const qaDesc = this.containerEl.querySelector('.mode-desc:nth-child(2)') as HTMLElement;
        
        if (qaModeBtn && searchModeBtn) {
            qaModeBtn.addClass('active');
            searchModeBtn.removeClass('active');
        }
        
        if (searchDesc && qaDesc) {
            qaDesc.addClass('active');
            searchDesc.removeClass('active');
        }
        
        // 隐藏语义搜索勾选框
        if (this.semanticCheckboxContainer) {
            this.semanticCheckboxContainer.style.display = 'none';
        }
        
        // 设置输入框内容和占位符
        this.searchInput.value = question;
        const texts = getI18nTexts(this.plugin.settings.language);
        this.searchInput.placeholder = texts.questionPlaceholder;
        
        // 更新搜索按钮
        this.updateSearchButton();
        
        // 执行问答
        this.performSearch();
    }

    private async performQA(question: string) {
        let isCancelled = false;

        try {
            const texts = getI18nTexts(this.plugin.settings.language);
            
            // 在侧边栏内显示进度
            this.resultsContainer.empty();
            const progressEl = this.resultsContainer.createDiv({ cls: 'qa-progress-container' });
            
            const progressHeader = progressEl.createDiv({ cls: 'qa-progress-header' });
            progressHeader.createEl('div', { 
                text: texts.qaProcessing,
                cls: 'qa-progress-title'
            });
            
            const progressStatus = progressEl.createDiv({ cls: 'qa-progress-status' });
            const progressBar = progressEl.createDiv({ cls: 'qa-progress-bar' });
            const progressFill = progressBar.createDiv({ cls: 'qa-progress-fill' });
            
            // 更新进度的辅助函数
            const updateProgress = (current: number, total: number, status: string) => {
                const percentage = (current / total) * 100;
                progressFill.style.width = `${percentage}%`;
                progressStatus.textContent = status;
            };

            // 1. 准备搜索
            updateProgress(1, 4, texts.preparingSearch);
            await new Promise(resolve => setTimeout(resolve, 200)); // 让用户看到进度

            // 确保有向量索引
            if (!this.plugin.embeddingService.vectors.length) {
                await this.plugin.embeddingService.loadFromCache();
                
                if (!this.plugin.embeddingService.vectors.length) {
                    await this.plugin.refreshNotesIfNeeded();
                    
                    if (this.plugin.cachedNotes.length === 0) {
                        throw new Error(texts.noNotesFound);
                    }

                    progressStatus.textContent = texts.creatingIndex;
                    
                    await this.plugin.embeddingService.createVectorIndex(
                        this.plugin.cachedNotes,
                        (current, total, status) => {
                            if (!isCancelled) {
                                const indexProgress = (current / total) * 100;
                                progressFill.style.width = `${indexProgress}%`;
                                progressStatus.textContent = `${texts.creatingIndexPrefix}: ${status}`;
                            }
                        },
                        () => isCancelled
                    );
                    
                    if (!isCancelled) {
                        await this.plugin.embeddingService.saveToCache();
                    }
                }
            }

            if (isCancelled) {
                return;
            }

            // 2. 搜索相关内容
            updateProgress(2, 4, texts.searchingContent);
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const contextHits = await this.plugin.embeddingService.semanticSearch(
                question, 
                Math.min(5, this.plugin.settings.maxSearchResults) // 限制上下文数量
            );

            if (contextHits.length === 0) {
                throw new Error(texts.noRelevantContent);
            }

            // 3. 生成答案
            updateProgress(3, 4, texts.generatingAnswer);
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const answer = await this.aiService.generateAnswer(question, contextHits);

            // 4. 显示结果
            updateProgress(4, 4, texts.preparingResults);
            await new Promise(resolve => setTimeout(resolve, 300));

            this.displayQAResult(question, answer, contextHits);

        } catch (error) {
            this.showError(error.message);
            throw error;
        }
    }

    private displayQAResult(question: string, answer: string, contextHits: any[]) {
        this.resultsContainer.empty();

        const texts = getI18nTexts(this.plugin.settings.language);

        // 问题标题
        const questionHeaderEl = this.resultsContainer.createDiv({ cls: 'qa-question-header' });
        questionHeaderEl.createEl('div', { 
            text: texts.questionLabel,
            cls: 'qa-section-title'
        });
        questionHeaderEl.createEl('div', { 
            text: question,
            cls: 'qa-question-text'
        });

        // 答案区域
        const answerHeaderEl = this.resultsContainer.createDiv({ cls: 'qa-answer-header' });
        const answerTitleContainer = answerHeaderEl.createDiv({ cls: 'qa-answer-title-container' });
        answerTitleContainer.createEl('div', { 
            text: texts.aiAnswerLabel,
            cls: 'qa-section-title'
        });
        
        // 复制按钮
        const copyBtn = answerTitleContainer.createEl('button', {
            text: texts.copyBtn,
            cls: 'qa-copy-btn'
        });
        copyBtn.title = texts.copyBtnTitle;

        const answerEl = this.resultsContainer.createDiv({ cls: 'qa-answer-content' });
        
        // 解析并渲染Markdown格式的答案
        const answerLines = answer.split('\n');
        answerLines.forEach(line => {
            if (line.trim()) {
                const lineEl = answerEl.createDiv({ cls: 'qa-answer-line' });
                
                // 简单的Markdown解析
                if (line.startsWith('# ')) {
                    lineEl.createEl('h3', { text: line.substring(2) });
                } else if (line.startsWith('## ')) {
                    lineEl.createEl('h4', { text: line.substring(3) });
                } else if (line.startsWith('- ') || line.startsWith('* ')) {
                    const listEl = lineEl.createEl('ul');
                    listEl.createEl('li', { text: line.substring(2) });
                } else if (line.match(/^\d+\. /)) {
                    const listEl = lineEl.createEl('ol');
                    listEl.createEl('li', { text: line.replace(/^\d+\. /, '') });
                } else {
                    // 处理内联格式
                    lineEl.innerHTML = line
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>');
                }
            }
        });

        // 添加复制功能
        copyBtn.onclick = async () => {
            try {
                // 将来源引用转换为双链格式
                let processedAnswer = answer;
                
                // 替换来源引用为实际的双链 - 同时处理中英文格式
                contextHits.forEach((hit, index) => {
                    const sourceRefChinese = `[来源 ${index + 1}]`;
                    const sourceRefEnglish = `[Source ${index + 1}]`;
                    const fileName = hit.name.replace('.md', ''); // 移除.md扩展名
                    const doubleLink = `[[${fileName}]]`;
                    
                    // 全局替换所有出现的来源引用 - 同时处理中英文格式
                    processedAnswer = processedAnswer.replace(
                        new RegExp(sourceRefChinese.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
                        doubleLink
                    );
                    processedAnswer = processedAnswer.replace(
                        new RegExp(sourceRefEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
                        doubleLink
                    );
                });
                
                await navigator.clipboard.writeText(processedAnswer);
                
                copyBtn.textContent = texts.copySuccess;
                copyBtn.style.color = 'var(--text-success)';
                
                // 2秒后恢复原状
                setTimeout(() => {
                    copyBtn.textContent = texts.copyBtn;
                    copyBtn.style.color = '';
                }, 2000);
                
                new Notice(texts.copySuccessNotice);
            } catch (error) {
                console.error('复制失败:', error);
                new Notice(texts.copyError);
            }
        };

        // 参考来源
        if (contextHits.length > 0) {
            const sourcesHeaderEl = this.resultsContainer.createDiv({ cls: 'qa-sources-header' });
            sourcesHeaderEl.createEl('div', { 
                text: `${texts.referenceSources} (${contextHits.length} ${texts.notesUnit})`,
                cls: 'qa-section-title'
            });

            contextHits.forEach((hit, index) => {
                const sourceEl = this.resultsContainer.createDiv({ cls: 'sidebar-search-hit' });
                
                // 来源标题 - 使用与搜索结果相同的样式
                const sourceTitleEl = sourceEl.createEl('div', { 
                    text: `[${index + 1}] ${hit.name}`,
                    cls: 'hit-title'
                });
                
                // 统一的打开文件函数
                const openFile = async () => {
                    try {
                        console.log('尝试打开文件:', hit.name, '路径:', hit.path);
                        
                        // 直接查找并打开文件
                        const files = this.app.vault.getMarkdownFiles();
                        console.log('搜索文件，总数:', files.length);
                        
                        const targetFile = files.find(f => {
                            const matches = [
                                f.path === hit.path,
                                f.name === hit.name,
                                f.basename === hit.name.replace('.md', ''),
                                f.path.endsWith(hit.name),
                                f.path.includes(hit.name.replace('.md', ''))
                            ];
                            console.log(`检查文件 ${f.path}:`, matches);
                            return matches.some(m => m);
                        });
                        
                        if (targetFile) {
                            console.log('找到目标文件:', targetFile.path);
                            const leaf = this.app.workspace.getLeaf(false);
                            await leaf.openFile(targetFile);
                            new Notice(`✅ 已打开: ${targetFile.name}`);
                        } else {
                            console.log('未找到文件，尝试链接方式');
                            const linkText = hit.name.replace('.md', '');
                            await this.app.workspace.openLinkText(linkText, '', false);
                            new Notice(`🔗 尝试打开链接: ${linkText}`);
                        }
                    } catch (error) {
                        console.error('打开文件失败:', error);
                        new Notice(`❌ 打开失败: ${error.message}`);
                        
                        // 显示详细调试信息
                        const allFiles = this.app.vault.getMarkdownFiles().map(f => f.path);
                        console.log('所有可用文件:', allFiles);
                        console.log('查找目标:', hit);
                    }
                };
                
                // 绑定点击事件
                sourceTitleEl.onclick = openFile;

                // Q&A模式下不显示相似度分数，因为用户关心的是来源是否能回答问题，而不是相似度

                // 内容片段 - 使用与搜索结果相同的样式
                if (hit.snippets && hit.snippets.length > 0) {
                    const snippetEl = sourceEl.createEl('div', { 
                        text: hit.snippets[0], // 只显示第一个片段，与搜索结果保持一致
                        cls: 'hit-snippet' 
                    });
                }

                // 路径信息 - 使用与搜索结果相同的样式
                const pathEl = sourceEl.createEl('div', {
                    text: hit.path,
                    cls: 'hit-path'
                });
            });
        }
    }
}