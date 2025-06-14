import { Modal } from 'obsidian';

export class ProgressModal extends Modal {
    private progressBar: HTMLElement;
    private progressText: HTMLElement;
    private statusText: HTMLElement;
    private cancelCallback?: () => void;
    private isCancelled = false;

    constructor(app: any, title: string = '处理中...', showCancel: boolean = false) {
        super(app);
        this.modalEl.addClass('progress-modal');
        this.createProgressUI(title, showCancel);
    }

    private createProgressUI(title: string, showCancel: boolean) {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.style.padding = '20px';
        contentEl.style.minWidth = '400px';

        // 标题
        const titleEl = contentEl.createEl('h3', { text: title });
        titleEl.style.marginBottom = '15px';
        titleEl.style.textAlign = 'center';

        // 状态文本
        this.statusText = contentEl.createEl('p', { text: '准备中...' });
        this.statusText.style.marginBottom = '10px';
        this.statusText.style.fontSize = '0.9em';
        this.statusText.style.color = 'var(--text-muted)';

        // 进度条容器
        const progressContainer = contentEl.createDiv({ cls: 'progress-container' });
        progressContainer.style.width = '100%';
        progressContainer.style.height = '20px';
        progressContainer.style.backgroundColor = 'var(--background-modifier-border)';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.marginBottom = '10px';

        // 进度条
        this.progressBar = progressContainer.createDiv({ cls: 'progress-bar' });
        this.progressBar.style.width = '0%';
        this.progressBar.style.height = '100%';
        this.progressBar.style.backgroundColor = 'var(--text-accent)';
        this.progressBar.style.transition = 'width 0.3s ease';

        // 进度文本
        this.progressText = contentEl.createEl('p', { text: '0%' });
        this.progressText.style.textAlign = 'center';
        this.progressText.style.margin = '5px 0 15px 0';
        this.progressText.style.fontWeight = 'bold';

        // 取消按钮
        if (showCancel) {
            const buttonContainer = contentEl.createDiv({ cls: 'progress-buttons' });
            buttonContainer.style.textAlign = 'center';

            const cancelBtn = buttonContainer.createEl('button', { text: '取消' });
            cancelBtn.style.padding = '8px 16px';
            cancelBtn.style.backgroundColor = 'var(--interactive-normal)';
            cancelBtn.style.border = '1px solid var(--background-modifier-border)';
            cancelBtn.style.borderRadius = '4px';
            cancelBtn.style.cursor = 'pointer';

            cancelBtn.onClickEvent(() => {
                this.isCancelled = true;
                if (this.cancelCallback) {
                    this.cancelCallback();
                }
                this.close();
            });
        }
    }

    // 更新进度
    updateProgress(current: number, total: number, status?: string) {
        if (this.isCancelled) return;

        const percentage = Math.round((current / total) * 100);
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.setText(`${percentage}% (${current}/${total})`);
        
        if (status) {
            this.statusText.setText(status);
        }
    }

    // 设置状态文本
    setStatus(status: string) {
        if (this.isCancelled) return;
        this.statusText.setText(status);
    }

    // 设置取消回调
    setCancelCallback(callback: () => void) {
        this.cancelCallback = callback;
    }

    // 检查是否被取消
    isCancelRequested(): boolean {
        return this.isCancelled;
    }

    // 完成进度
    complete(message: string = '完成！') {
        this.progressBar.style.width = '100%';
        this.progressText.setText('100%');
        this.statusText.setText(message);
        
        // 2秒后自动关闭
        setTimeout(() => {
            if (!this.isCancelled) {
                this.close();
            }
        }, 2000);
    }

    // 显示错误
    showError(errorMessage: string) {
        this.progressBar.style.backgroundColor = 'var(--text-error)';
        this.statusText.setText(`❌ ${errorMessage}`);
        this.statusText.style.color = 'var(--text-error)';
    }
} 