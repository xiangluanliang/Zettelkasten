import { Plugin } from 'obsidian';
import { ArchiveButton } from './src/archiveButton';
import { TagManager } from './src/tagManager';

export default class ArchivePlugin extends Plugin {
  private tagManager: TagManager;
  private archiveButton: ArchiveButton;

  async onload() {
    console.log('加载 ArchivePlugin 插件');

    // 初始化标签管理和归档按钮
    this.tagManager = new TagManager(this);
    await this.tagManager.loadTags(); // 从设置或文件加载标签

    this.archiveButton = new ArchiveButton(this);
    this.archiveButton.addArchiveButton();
  }

  onunload() {
    console.log('卸载 ArchivePlugin 插件');
    this.archiveButton.removeArchiveButton();
  }
}
