import { Plugin } from "obsidian";
import { ArchiveButton } from "./src/archiveButton";
import { FileManager } from "./src/fileManager";
import { TagManager } from "./src/tagManager";

export default class ArchivePlugin extends Plugin {
  private archiveButton: ArchiveButton | null = null;

  async onload() {
    console.log("ArchivePlugin loaded!");

    const fileManager = new FileManager(this);
    const tagManager = new TagManager(this);

    // 初始化归档按钮
    this.archiveButton = new ArchiveButton(this);
    this.archiveButton.addArchiveButton();
  }

  onunload() {
    console.log("ArchivePlugin unloaded!");

    // 移除归档按钮
    if (this.archiveButton) {
      this.archiveButton.removeArchiveButton();
    }
  }
}
