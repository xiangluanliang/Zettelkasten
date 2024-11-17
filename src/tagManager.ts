import { TFile, Notice, Vault } from "obsidian";

export class TagManager {
  private plugin: any;

  constructor(plugin: any) {
    this.plugin = plugin;
  }

  /**
   * 在指定标签的目录文件中添加引用
   * @param file 当前文件
   * @param tag 标签名称
   */
  async addToCatalog(file: TFile, tag: string) {
    try {
      const catalogPath = `归档盒子/目录/${tag}.md`;
      const fileContent = await this.plugin.app.vault.adapter.read(catalogPath).catch(() => "");
      const reference = `[[${file.basename}]]`;

      if (!fileContent.includes(reference)) {
        const updatedContent = fileContent + `\n- ${reference}`;
        await this.plugin.app.vault.adapter.write(catalogPath, updatedContent);
        new Notice(`已将 [[${file.basename}]] 添加到 ${tag}.md`);
      } else {
        console.log(`引用已存在于 ${tag}.md`);
      }
    } catch (err) {
      console.error(`添加引用到目录文件失败: ${err}`);
    }
  }
}
