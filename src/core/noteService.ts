import { Plugin, TFile } from 'obsidian';
import { Note, PluginCache } from '../types/interfaces';
import { PluginSettings } from '../ui/settingsTab';
import { getI18nTexts } from '../utils/i18n';

export class NoteService {
    private plugin: Plugin;
    private cache: PluginCache = {};
    private settings: PluginSettings;

    constructor(plugin: Plugin, settings: PluginSettings) {
        this.plugin = plugin;
        this.settings = settings;
        this.setupCacheInvalidation();
    }

    async getAllMarkdownNotes(): Promise<Note[]> {
        const files = this.plugin.app.vault.getMarkdownFiles();
        const notes: Note[] = [];
        
        for (const file of files) {
            // 检查文件是否应该被包含
            if (!this.shouldIncludeFile(file)) {
                continue;
            }

            // 检查文件大小
            if (file.stat.size > this.settings.maxFileSize * 1024) {
                const texts = getI18nTexts(this.settings.language);
                console.log(`${texts.skipLargeFile}: ${file.path} (${Math.round(file.stat.size / 1024)}KB > ${this.settings.maxFileSize}KB)`);
                continue;
            }

            const content = await this.getNoteContent(file);
            notes.push({
                path: file.path,
                name: file.name,
                content
            });
        }
        
        const texts = getI18nTexts(this.settings.language);
        if (this.settings.language === 'zh-CN') {
            console.log(`${texts.loadedNotesFromFiles} ${notes.length} 个笔记 (从 ${files.length} 个文件中筛选)`);
        } else {
            console.log(`${texts.loadedNotesFromFiles} ${notes.length} notes (filtered from ${files.length} files)`);
        }
        return notes;
    }

    // 检查文件是否应该被包含
    private shouldIncludeFile(file: TFile): boolean {
        const filePath = file.path;
        const folder = file.parent?.path || '';

        // 检查排除列表
        for (const excludedFolder of this.settings.excludedFolders) {
            if (excludedFolder && (
                folder === excludedFolder || 
                folder.startsWith(excludedFolder + '/') ||
                filePath.startsWith(excludedFolder + '/')
            )) {
                return false;
            }
        }

        // 如果有允许列表，检查是否在允许列表中
        if (this.settings.allowedFolders.length > 0) {
            let isAllowed = false;
            for (const allowedFolder of this.settings.allowedFolders) {
                if (allowedFolder && (
                    folder === allowedFolder || 
                    folder.startsWith(allowedFolder + '/') ||
                    filePath.startsWith(allowedFolder + '/') ||
                    allowedFolder === '' // 空字符串表示根目录
                )) {
                    isAllowed = true;
                    break;
                }
            }
            if (!isAllowed) {
                return false;
            }
        }

        return true;
    }

    // 更新设置
    updateSettings(settings: PluginSettings) {
        this.settings = settings;
    }

    async getNoteContent(file: TFile): Promise<string> {
        if (this.cache[file.path]) return this.cache[file.path];
        
        const content = await this.plugin.app.vault.read(file);
        this.cache[file.path] = content;
        return content;
    }

    private setupCacheInvalidation() {
        this.plugin.registerEvent(
            this.plugin.app.vault.on('modify', (file) => {
                if (file instanceof TFile && this.cache[file.path]) {
                    delete this.cache[file.path];
                }
            })
        );
    }
}