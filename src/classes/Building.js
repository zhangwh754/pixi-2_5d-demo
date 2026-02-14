import { Container, Graphics, Sprite, Text, Texture, Polygon } from "pixi.js";
import { toIsometric } from "../utils/isometric.js";
import { updateInfoPanel } from "../utils/isometric.js";
import {
  BUILDING_TYPES,
  getBuildingPolygon,
} from "../constants/buildingTypes.js";

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
   * @param {boolean} isActive - 是否激活状态
   * @param {number} scale - 缩放比例
   * @param {Function} onSelect - 选中回调函数
   */
  constructor(
    gridX,
    gridY,
    type,
    id,
    isActive = false,
    scale = 1,
    onSelect = null
  ) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.type = type;
    this.id = id;
    this.onSelect = onSelect;
    this.isActive = isActive;
    this.scale = scale;

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

    // TODO 建筑图形的红色边框
    // 创建可点击区域边框（红色多边形）
    // const border = new Graphics();
    // border.setStrokeStyle({ width: 2, color: 0xff0000, alpha: 0.8 });
    // border.moveTo(polygon[0].x, polygon[0].y);
    // for (let i = 1; i < polygon.length; i++) {
    //   border.lineTo(polygon[i].x, polygon[i].y);
    // }
    // border.closePath();
    // border.stroke();
    // this.container.addChild(border);

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
      text: `${config.floors}F`,
      style: {
        fontSize: 14,
        fill: 0xffffff,
      },
    });
    text.anchor.set(0.5);
    text.y = -this.height + 20;
    this.container.addChild(text);
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
    updateInfoPanel(this, "infoPanel");

    // TODO 获取点击在容器内的本地坐标
    // const localPos = event.getLocalPosition(this.container);
    // console.log("click xy:", { x: localPos.x, y: localPos.y });

    // 通过回调更新所有建筑的激活状态
    if (this.onSelect) {
      this.onSelect(this.id);
    }
  }
}
