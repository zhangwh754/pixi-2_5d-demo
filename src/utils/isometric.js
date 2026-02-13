import { Assets } from "pixi.js";

/**
 * 等距投影转换函数
 * 将3D坐标转换为2D等距投影坐标
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} z - Z坐标（高度）
 * @returns {{x: number, y: number}} 2D坐标
 */
export function toIsometric(x, y, z = 0) {
  return {
    x: (x - y) * Math.cos(Math.PI / 6),
    y: (x + y) * Math.sin(Math.PI / 6) - z,
  };
}

/**
 * 预加载图片资源到 Pixi 缓存
 * @param {Object} configs - 建筑类型配置对象
 * @returns {Promise<void>} 加载完成的Promise
 */
export async function preloadImages(configs) {
  const urls = [];
  Object.values(configs).forEach((config) => {
    urls.push(config.normalImage);
    urls.push(config.activeImage);
  });
  await Assets.load(urls);
}

/**
 * 更新信息面板
 * @param {Object} building - 建筑对象
 * @param {string} panelId - 面板元素ID
 */
export function updateInfoPanel(building, panelId) {
  const { config, id, gridX, gridY, width, height } = building;
  const info = `
    <h2>${config.name} #${id}</h2>
    <p>楼层: ${config.floors}层</p>
    <p>位置: (${gridX}, ${gridY})</p>
    <p>高度: ${height}px</p>
    <p>宽度: ${width}px</p>
  `;
  document.getElementById(panelId).innerHTML = info;
}
