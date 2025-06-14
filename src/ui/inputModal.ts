import { Modal } from 'obsidian';

export class InputModal extends Modal {
    prompt: string;
    onSubmit: (value: string) => void;

    constructor(app: any, prompt: string, onSubmit: (value: string) => void) {
        super(app);
        this.prompt = prompt;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        // 添加CSS类
        this.modalEl.addClass('knowledge-assistant-modal');

        contentEl.createEl('h3', { text: this.prompt });
        const input = contentEl.createEl('input', { 
            type: 'text', 
            cls: 'prompt-input'
        });
        input.focus();

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.onSubmit(input.value);
                this.close();
            }
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    onClose() {
        this.contentEl.empty();
    }
}