import { TFile, Vault } from "obsidian";

export class FileManager {
  private plugin: any;

  constructor(plugin: any) {
    this.plugin = plugin;
  }

  /**
   * 将文件归档到对应的 major 文件夹
   * @param file 当前文件
   * @param major 文件的 major 属性
   */
  async archiveToMajorFolder(file: TFile, major: string) {
    try {
      const targetFolderPath = `归档盒子/${major}`;
      const targetPath = `${targetFolderPath}/${file.name}`;

      // 如果目标文件夹不存在，创建它
      if (!this.plugin.app.vault.getAbstractFileByPath(targetFolderPath)) {
        await this.plugin.app.vault.createFolder(targetFolderPath);
      }

      // 移动文件
      await this.plugin.app.fileManager.renameFile(file, targetPath);
      console.log(`文件已移动到 ${targetPath}`);
    } catch (err) {
      console.error(`移动文件到 major 文件夹失败: ${err}`);
    }
  }
}
