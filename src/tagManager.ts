import { Plugin } from 'obsidian';

export class TagManager {
  private plugin: Plugin;
  private tags: Set<string>; // 储存所有标签

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.tags = new Set();
  }

  async loadTags() {
    // 从插件设置或文件中加载标签
    const savedTags = await this.plugin.loadData();
    if (savedTags) {
      this.tags = new Set(savedTags);
    }
  }

  async saveTags() {
    await this.plugin.saveData(Array.from(this.tags));
  }

  addTag(tag: string) {
    this.tags.add(tag);
    this.saveTags();
  }

  getAllTags() {
    return Array.from(this.tags);
  }

  isMajorTag(tag: string): boolean {
    // 定义 major 标签的规则
    return ['数学', '计算机'].includes(tag);
  }
}
