import { Plugin, TFile, Notice } from 'obsidian';
import { FileManager } from './fileManager';
import { TagManager } from './tagManager';

export class ArchiveButton {
  private plugin: Plugin;
  private buttonEl: HTMLElement;
  private fileManager: FileManager;
  private tagManager: TagManager;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.fileManager = new FileManager(plugin);
    this.tagManager = new TagManager(plugin);
  }

  addArchiveButton() {
    // 添加“归档”按钮到编辑视图切换按钮左侧
    this.buttonEl = this.plugin.addRibbonIcon('archive', '归档', async () => {
      const file = this.plugin.app.workspace.getActiveFile();
      if (file) {
        await this.archiveFile(file);
      } else {
        new Notice('请打开要归档的文件');
      }
    });
  }

  removeArchiveButton() {
    if (this.buttonEl) {
      this.buttonEl.remove();
    }
  }

  private async archiveFile(file: TFile) {
    // 获取当前文件的标签
    const tags = await this.plugin.app.metadataCache.getFileCache(file)?.tags ?? [];

    // 检查是否有 major 标签，并归档
    for (const tag of tags) {
      if (this.tagManager.isMajorTag(tag.tag)) {
        await this.fileManager.archiveToMajorFolder(file, tag.tag);
      } else {
        await this.fileManager.addToCatalog(file, tag.tag);
      }
    }
    new Notice(`文件已归档至归档盒子`);
  }
}
