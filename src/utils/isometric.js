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

