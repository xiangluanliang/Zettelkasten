import { Plugin, TFile, Notice } from 'obsidian';
import { normalizePath } from 'obsidian';

export class FileManager {
  private plugin: Plugin;
  private rootFolder = '归档盒子';

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  async archiveToMajorFolder(file: TFile, majorTag: string) {
    // 确保 "归档盒子/major" 文件夹存在
    const targetFolder = normalizePath(`${this.rootFolder}/${majorTag}`);
    await this.plugin.app.vault.createFolder(targetFolder).catch(() => {});

    // 移动文件到目标文件夹
    await this.plugin.app.fileManager.renameFile(file, `${targetFolder}/${file.name}`);
    
    // 更新目录
    await this.addToCatalog(file, majorTag);
  }

  async addToCatalog(file: TFile, tag: string) {
    // 找到或创建对应目录文件
    const catalogFilePath = normalizePath(`${this.rootFolder}/目录/${tag}目录.md`);
    let catalogFile = this.plugin.app.vault.getAbstractFileByPath(catalogFilePath) as TFile;

    if (!catalogFile) {
      catalogFile = await this.plugin.app.vault.create(catalogFilePath, `# ${tag} 目录\n\n`);
    }

    // 添加链接到目录文件末尾
    const fileLink = `[[${file.basename}]]`;
    const content = await this.plugin.app.vault.read(catalogFile);
    if (!content.includes(fileLink)) {
      await this.plugin.app.vault.append(catalogFile, `\n${fileLink}`);
    }
  }
}
