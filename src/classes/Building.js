import { Container, Sprite, Text, Texture, Polygon, Assets } from "pixi.js";
import { toIsometric } from "../utils/isometric.js";
import {
  BUILDING_TYPES,
  getBuildingPolygon,
} from "../constants/buildingTypes.js";
import { TYPE_ICONS } from "../constants/mockData.js";

/**
 * 建筑类
 * 渲染单个建筑及其交互
 */
export class Building {
  /**
   * @param {number} gridX - 网格X坐标
   * @param {number} gridY - 网格Y坐标
   * @param {string} type - 建筑类型键名
   * @param {number} id - 建筑ID
   */
  constructor(gridX, gridY, type, id, params = {}) {
    const text = params.text ?? "";
    const isActive = params.isActive ?? false;
    const scale = params.scale ?? 1;
    const onSelect = params.onSelect ?? null;
    const types = params.types ?? []; // 楼栋的属性类型数组

    this.gridX = gridX;
    this.gridY = gridY;
    this.type = type;
    this.id = id;
    this.text = text;
    this.onSelect = onSelect;
    this.isActive = isActive;
    this.scale = scale;
    this.types = types;

    this.container = new Container();
    this.container.scale.set(scale);

    const config = BUILDING_TYPES[type];
    this.config = config;
    this.width = config.width;
    this.height = config.height;

    this.createBuilding(config);
    this.setupInteraction();
  }

  /**
   * 创建建筑图形
   * @param {Object} config - 建筑配置
   */
  createBuilding(config) {
    // 获取多边形顶点数据
    const polygon = getBuildingPolygon(config);

    // 设置容器多边形点击区域
    const points = polygon.flatMap((p) => [p.x, p.y]);
    this.container.hitArea = new Polygon(points);

    // 创建正常态精灵
    const normalTexture = Texture.from(config.normalImage);
    this.normalSprite = new Sprite(normalTexture);
    this.normalSprite.anchor.set(0.5, 1); // 底部中心为锚点
    this.normalSprite.visible = !this.isActive;
    this.container.addChild(this.normalSprite);

    // 创建激活态精灵
    const activeTexture = Texture.from(config.activeImage);
    this.activeSprite = new Sprite(activeTexture);
    this.activeSprite.anchor.set(0.5, 1); // 底部中心为锚点
    this.activeSprite.visible = this.isActive;
    this.container.addChild(this.activeSprite);

    // 添加文字标签
    const text = new Text({
      text: `${this.text}`,
      style: {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
      },
    });
    text.anchor.set(0.5);
    text.y = -this.height + 20;
    this.container.addChild(text);

    // 添加属性图标
    this.createTypeIcons();
  }

  /**
   * 创建属性类型图标
   */
  createTypeIcons() {
    if (!this.types || this.types.length === 0) return;

    const iconSize = 32;
    const spacing = 4;
    const lineHeight = iconSize + spacing;

    // 计算可点击区域的边界
    const polygon = getBuildingPolygon(this.config);
    const xs = polygon.map((p) => p.x);
    const maxWidth = Math.max(...xs) - Math.min(...xs);
    const maxIconsPerLine = Math.floor((maxWidth + spacing) / (iconSize + spacing));

    this.types.forEach((type, index) => {
      const iconUrl = TYPE_ICONS[type];
      if (!iconUrl) return;

      const lineIndex = Math.floor(index / maxIconsPerLine);
      const colIndex = index % maxIconsPerLine;

      const remainingIcons = this.types.length - lineIndex * maxIconsPerLine;
      const iconsInLine = Math.min(remainingIcons, maxIconsPerLine);

      const lineWidth = iconsInLine * iconSize + (iconsInLine - 1) * spacing;
      const startX = -lineWidth / 2 + iconSize / 2;
      const x = startX + colIndex * (iconSize + spacing);

      // 图标放在建筑顶部下方
      const y = -this.height + 10 + lineIndex * lineHeight;

      const texture = Assets.get(iconUrl);
      const icon = new Sprite(texture);
      icon.width = iconSize;
      icon.height = iconSize;
      icon.anchor.set(0.5);
      icon.x = x;
      icon.y = y;
      this.container.addChild(icon);
    });
  }

  /**
   * 设置激活状态
   * @param {boolean} active - 是否激活
   */
  setActive(active) {
    if (this.isActive === active) return;
    this.isActive = active;
    this.normalSprite.visible = !active;
    this.activeSprite.visible = active;
  }

  /**
   * 设置位置
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  setPosition(x, y) {
    const iso = toIsometric(x, y, 0);
    this.container.x = iso.x;
    this.container.y = iso.y;
  }

  /**
   * 设置交互事件
   */
  setupInteraction() {
    this.container.eventMode = "static";
    this.container.cursor = "pointer";

    this.container.on("pointertap", (event) => {
      this.onClick(event);
    });
  }

  /**
   * 点击事件处理
   * @param {Object} event - 点击事件对象
   */
  onClick(event) {
    // 通过回调更新所有建筑的激活状态
    if (this.onSelect) {
      this.onSelect(this.id);
    }
  }
}
