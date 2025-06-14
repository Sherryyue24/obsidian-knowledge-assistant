import { Plugin, Notice, WorkspaceLeaf } from 'obsidian';
import { NoteService } from './noteService';
import { SearchService } from './searchService';
import { InputModal } from '../ui/inputModal';
import { SearchResultsModal } from '../ui/resultsModal';
import { ProgressModal } from '../ui/progressModal';
import { PluginSettings, DEFAULT_SETTINGS, SettingsTab } from '../ui/settingsTab';
import { EmbeddingService } from './ai/embeddingService';
import { Note } from '../types/interfaces';
import { AISidebarView, VIEW_TYPE_AI_ASSISTANT } from '../ui/sidebarView';
import { getI18nTexts } from '../utils/i18n';


export default class MyPlugin extends Plugin {
    settings: PluginSettings;
    private noteService: NoteService;
    embeddingService: EmbeddingService;
    public cachedNotes: Note[] = []; // 添加笔记缓存
    private cacheValid: boolean = false; // 缓存是否有效

    async onload() {
        await this.loadSettings();
        
        // 加载样式
        this.loadStyles();
        
        this.noteService = new NoteService(this, this.settings);
        this.addSettingTab(new SettingsTab(this));

        this.embeddingService = new EmbeddingService(this.settings);
        
        // 初始化本地embedding模型（如果启用）
        await this.embeddingService.initializeLocalModel();
        
        // 初始化时加载笔记缓存
        await this.loadNotesCache();
        
        // 尝试加载向量缓存，如果没有缓存才重新创建
        await this.embeddingService.loadFromCache();
        if (this.embeddingService.vectors.length === 0) {
            console.log('未找到向量缓存，开始创建向量索引...');
            
            // 初始化时不显示进度条，但在控制台输出进度
            await this.embeddingService.createVectorIndex(
                this.cachedNotes,
                // 进度回调 - 只在控制台显示
                (current, total, status) => {
                    console.log(`索引创建进度: ${current}/${total} - ${status}`);
                }
            );
            await this.embeddingService.saveToCache();
            console.log('向量索引创建完成');
        } else {
            console.log(`从缓存加载了 ${this.embeddingService.vectors.length} 个向量`);
        }

        // 监听文件变更，自动清空缓存
        this.setupCacheInvalidation();

        this.addCommand({
            id: 'search-notes-by-keyword',
            name: 'Search Notes by Keyword',
            callback: () => {
                console.log('命令触发');
                new InputModal(this.app, '请输入要检索的关键词：', async (keyword) => {
                    if (!keyword.trim()) {
                        new Notice('未输入关键词');
                        return;
                    }
                    
                    // 确保笔记缓存是最新的
                    await this.refreshNotesIfNeeded();
                    
                    const hits = SearchService.keywordSearch(this.cachedNotes, keyword);

                    if (hits.length === 0) {
                        new Notice('未找到包含该关键词的笔记');
                    } else {
                        new Notice(`共找到 ${hits.length} 个笔记`);
                        new SearchResultsModal(
                            this.app,
                            hits,
                            keyword
                        ).open();
                    }
                }).open();
            }
        }
        );

        this.addCommand({
            id: 'semantic-search',
            name: 'Search Notes by Semantic',
            callback: () => {
                const texts = getI18nTexts(this.settings.language);
                new InputModal(this.app, texts.semanticSearchHint, async (query) => {
                    if (!query.trim()) return;
                    
                    let progressModal: ProgressModal | null = null;
                    let isCancelled = false;
                    
                    try {
                        // 1. vectors为空，尝试加载缓存
                        if (!this.embeddingService.vectors.length) {
                            await this.embeddingService.loadFromCache();
                            
                            // 2. 缓存还是没有，就全量重建并保存
                            if (!this.embeddingService.vectors.length) {
                                await this.refreshNotesIfNeeded();
                                
                                if (this.cachedNotes.length === 0) {
                                    new Notice('❌ 没有找到任何笔记');
                                    return;
                                }
                                
                                // 显示进度模态框
                                progressModal = new ProgressModal(this.app, '🧠 创建语义索引', true);
                                progressModal.open();
                                progressModal.setStatus('正在为笔记创建向量索引...');
                                
                                // 设置取消回调
                                progressModal.setCancelCallback(() => {
                                    isCancelled = true;
                                });
                                
                                // 创建向量索引，带进度回调
                                await this.embeddingService.createVectorIndex(
                                    this.cachedNotes,
                                    // 进度回调
                                    (current, total, status) => {
                                        if (progressModal && !isCancelled) {
                                            progressModal.updateProgress(current, total, status);
                                        }
                                    },
                                    // 取消检查回调
                                    () => isCancelled || (progressModal?.isCancelRequested() ?? false)
                                );
                                
                                if (!isCancelled) {
                                    await this.embeddingService.saveToCache();
                                    progressModal?.complete('索引创建完成！开始搜索...');
                                    // 等待一下让用户看到完成状态
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                        
                        // 如果被取消，直接返回
                        if (isCancelled) {
                            progressModal?.close();
                            return;
                        }
                        
                        // 关闭进度模态框
                        if (progressModal) {
                            progressModal.close();
                            progressModal = null;
                        }
                        
                        // 检查是否有可用的向量
                        if (this.embeddingService.vectors.length === 0) {
                            new Notice('❌ 没有可用的向量数据，请检查API配置');
                            return;
                        }
                        
                        // 3. 开始语义检索（显示简单的进度提示）
                        const searchProgressModal = new ProgressModal(this.app, '🔍 语义搜索中', false);
                        searchProgressModal.open();
                        searchProgressModal.setStatus('正在分析查询内容...');
                        searchProgressModal.updateProgress(1, 3, '生成查询向量...');
                        
                        const hits = await this.embeddingService.semanticSearch(query, this.settings.maxSearchResults);
                        
                        searchProgressModal.updateProgress(2, 3, '计算相似度...');
                        await new Promise(resolve => setTimeout(resolve, 300)); // 让用户看到进度
                        
                        searchProgressModal.updateProgress(3, 3, '准备结果...');
                        await new Promise(resolve => setTimeout(resolve, 200));
                        
                        searchProgressModal.close();
                        
                        if (hits.length === 0) {
                            new Notice('未找到相关的笔记');
                        } else {
                            new SearchResultsModal(this.app, hits, query, true).open();
                        }
                    } catch (error) {
                        console.error('语义搜索出错:', error);
                        
                        // 关闭任何打开的进度模态框
                        if (progressModal) {
                            if (error.message.includes('操作已取消')) {
                                progressModal.close();
                            } else {
                                progressModal.showError(error.message);
                                setTimeout(() => progressModal?.close(), 3000);
                            }
                        }
                        
                        // 根据错误类型显示不同的提示
                        if (error.message.includes('操作已取消')) {
                            new Notice('⏹️ 操作已取消');
                        } else if (error.message.includes('API请求失败')) {
                            new Notice('❌ API请求失败，请检查API密钥和网络连接');
                        } else if (error.message.includes('语义搜索失败')) {
                            new Notice('❌ 语义搜索失败，请重试或使用关键词搜索');
                        } else {
                            new Notice(`❌ 搜索失败: ${error.message}`);
                        }
                    }
                }).open();
            }
        });
       
        // 注册侧边栏视图
        this.registerView(
            VIEW_TYPE_AI_ASSISTANT,
            (leaf) => new AISidebarView(leaf, this)
        );

        // 添加侧边栏ribbon图标
        this.addRibbonIcon('brain-circuit', 'Knowledge Assistant', () => {
            this.activateView();
        });

        // 添加打开侧边栏的命令
        this.addCommand({
            id: 'open-ai-sidebar',
            name: 'Open Knowledge Assistant Sidebar',
            callback: () => {
                this.activateView();
            }
        });

        // 新增：添加快速问答命令
        this.addCommand({
            id: 'quick-qa',
            name: 'Quick Q&A with Notes',
            callback: () => {
                new InputModal(this.app, '请输入你的问题：', async (question) => {
                    if (!question.trim()) {
                        new Notice('请输入问题');
                        return;
                    }
                    
                    // 打开侧边栏并切换到问答模式
                    await this.activateView();
                    
                    // 等待侧边栏加载完成
                    setTimeout(() => {
                        const sidebarView = this.app.workspace.getLeavesOfType(VIEW_TYPE_AI_ASSISTANT)[0]?.view as AISidebarView;
                        if (sidebarView) {
                            // 设置问答模式并执行搜索
                            sidebarView.setQAMode(question);
                        }
                    }, 100);
                }).open();
            }
        });
    }

    // 加载笔记缓存
    private async loadNotesCache() {
        this.cachedNotes = await this.noteService.getAllMarkdownNotes();
        this.cacheValid = true;
    }

    // 如果需要的话刷新笔记缓存
    public async refreshNotesIfNeeded() {
        // 如果缓存无效或为空，重新加载
        if (!this.cacheValid || this.cachedNotes.length === 0) {
            await this.loadNotesCache();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        // 通知noteService设置已更新
        if (this.noteService) {
            this.noteService.updateSettings(this.settings);
            // 设置变更时清空缓存，强制重新加载
            this.cacheValid = false;
        }
        
        // 刷新侧边栏语言
        const sidebarView = this.app.workspace.getLeavesOfType(VIEW_TYPE_AI_ASSISTANT)?.[0]?.view;
        if (sidebarView && sidebarView instanceof AISidebarView) {
            sidebarView.refreshLanguage();
        }
    }

    // 清除所有缓存
    public clearCache() {
        localStorage.removeItem('vectors');
        this.embeddingService.vectors = [];
        this.cachedNotes = [];
        this.cacheValid = false;
    }

    // 刷新侧边栏语言
    public refreshSidebarLanguage() {
        const sidebarView = this.app.workspace.getLeavesOfType(VIEW_TYPE_AI_ASSISTANT)?.[0]?.view;
        if (sidebarView && sidebarView instanceof AISidebarView) {
            sidebarView.refreshLanguage();
        }
    }

    // 加载样式
    private loadStyles() {
        // 主要样式已在 styles.css 中定义
        // 如果需要动态样式，可以在这里添加
    }

    // 监听文件变更，自动清空缓存
    private setupCacheInvalidation() {
        this.registerEvent(
            this.app.vault.on('create', () => {
                this.cacheValid = false;
                // 清空向量缓存
                this.embeddingService.vectors = [];
            })
        );
        
        this.registerEvent(
            this.app.vault.on('delete', () => {
                this.cacheValid = false;
                this.embeddingService.vectors = [];
            })
        );
        
        this.registerEvent(
            this.app.vault.on('modify', () => {
                this.cacheValid = false;
                this.embeddingService.vectors = [];
            })
        );
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_AI_ASSISTANT);

        if (leaves.length > 0) {
            // 侧边栏已存在，激活它
            leaf = leaves[0];
        } else {
            // 创建新的侧边栏
            leaf = workspace.getRightLeaf(false);
            if (leaf) {
                await leaf.setViewState({ type: VIEW_TYPE_AI_ASSISTANT, active: true });
            }
        }

        // 显示侧边栏
        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }
}
