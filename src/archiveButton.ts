import { Plugin, TFile, Notice } from "obsidian";
import { FileManager } from "./fileManager";
import { TagManager } from "./tagManager";

export class ArchiveButton {
  private plugin: Plugin;
  private fileManager: FileManager;
  private tagManager: TagManager;
  private buttonEl: HTMLElement | null = null;
  private layoutChangeHandler: (() => void) | null = null;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.fileManager = new FileManager(plugin);
    this.tagManager = new TagManager(plugin);
  }

  /**
   * 添加归档按钮到界面
   */
  addArchiveButton() {
    const viewActionsContainer = document.querySelector(".view-actions");

    // 检查按钮是否已存在，避免重复添加
    if (!viewActionsContainer || viewActionsContainer.querySelector(".archive-button")) {
      if (!this.layoutChangeHandler) {
        this.layoutChangeHandler = () => this.addArchiveButton();
        this.plugin.app.workspace.on("layout-change", this.layoutChangeHandler);
      }
      return;
    }

    // 创建新的按钮元素
    this.buttonEl = document.createElement("a");
    this.buttonEl.classList.add("clickable-icon", "view-action", "archive-button");
    this.buttonEl.setAttribute("aria-label", "点击此处将文件归档至对应文件夹");
    this.buttonEl.setAttribute("title", "归档");

    // SVG 图标
    this.buttonEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-archive">
        <path d="M21 8v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"></path>
        <rect x="1" y="3" width="22" height="5" rx="2" ry="2"></rect>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
    `;

    // 添加点击事件
    this.buttonEl.addEventListener("click", async () => {
      const file = this.plugin.app.workspace.getActiveFile();
      if (file) {
        await this.archiveFile(file);
      } else {
        new Notice("请打开要归档的文件");
      }
    });

    viewActionsContainer.prepend(this.buttonEl);
    this.toggleButtonVisibility();
  }

  /**
   * 归档文件逻辑
   * @param file 当前文件
   */
  private async archiveFile(file: TFile) {
    // 获取文件的 YAML 数据
    const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter ?? {};
    const majorTag = frontmatter.major?.[0]; // major 是一个数组，取第一个元素
    const rawTags = frontmatter.tags;
    const otherTags = Array.isArray(rawTags)
      ? rawTags // 如果已经是数组，直接使用
      : typeof rawTags === "string"
        ? rawTags.split(",").map(tag => tag.trim()) // 如果是字符串，按逗号分隔并去除空格
        : []; // 如果是 undefined 或其他类型，返回空数组

    // 判断是否有主标签
    if (majorTag) {
      // 移动文件到 major 文件夹
      await this.fileManager.archiveToMajorFolder(file, majorTag);
    } else {
      console.warn(`文件 "${file.name}" 没有主标签 (major)，未移动到 major 文件夹`);
    }

    // 处理普通标签
    const uniqueTags = new Set(otherTags);
    for (const tag of uniqueTags) {
      // 避免重复添加主标签到目录文件
      // if (tag !== majorTag) {
        await this.tagManager.addToCatalog(file, tag);
      // }
    }

    // 通知归档完成
    new Notice(`文件 "${file.basename}" 已归档至归档盒子`);
  }

  /**
   * 切换按钮可见性
   */
  toggleButtonVisibility = () => {
    const file = this.plugin.app.workspace.getActiveFile();
    if (this.buttonEl) {
      this.buttonEl.style.display = file ? "block" : "none";
    }
  };

  /**
   * 移除归档按钮及其相关监听器
   */
  removeArchiveButton() {
    if (this.buttonEl) {
      this.buttonEl.remove();
      this.buttonEl = null;
    }
    if (this.layoutChangeHandler) {
      this.plugin.app.workspace.off("layout-change", this.layoutChangeHandler);
      this.layoutChangeHandler = null;
    }
  }
}
