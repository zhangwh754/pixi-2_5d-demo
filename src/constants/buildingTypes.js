// 导入图片资源
import img06 from "/assets/img_06.png";
import img08 from "/assets/img_08.png";
import img09 from "/assets/img_09.png";
import img10 from "/assets/img_10.png";
import img11 from "/assets/img_11.png";
import img13 from "/assets/img_13.png";
import img15 from "/assets/img_15.png";
import img17 from "/assets/img_17.png";

// 形状模板类型
const SHAPE = {
  // 矩形
  RECT: "rect",
  // 梯形（左窄右宽）
  TRAPEZOID_LEFT: "trapezoid_left",
  // 梯形（右窄左宽）
  TRAPEZOID_RIGHT: "trapezoid_right",
  // 三角形
  TRIANGLE: "triangle",
};

/**
 * 根据形状类型生成多边形顶点
 * @param {string} shapeType - 形状类型
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} topScale - 顶部缩放比例 (0-1)，梯形专用
 * @returns {Array<{x: number, y: number}>} 顶点数组
 */
function generatePolygon(shapeType, width, height, topScale = 1) {
  const halfW = width / 2;
  const topHalfW = halfW * topScale;

  switch (shapeType) {
    case SHAPE.TRAPEZOID_LEFT:
      // 左窄右宽梯形
      return [
        {
          x: -45.54129094117508,
          y: -136.61997985839844,
        },
        { x: 13.098723707262423, y: -169.89999389648438 },
        {
          x: 42.7787469006218,
          y: -150.05999755859375,
        },
        {
          x: 44.69872981077805,
          y: -38.06001281738281,
        },
        {
          x: -11.621246995862577,
          y: -1.5799713134765625,
        },
        {
          x: -44.90127629273758,
          y: -20.779953002929688,
        },
      ];
    case SHAPE.TRAPEZOID_RIGHT:
      // 右窄左宽梯形
      return [
        { x: -halfW, y: -height }, // 左上
        { x: halfW, y: -height }, // 右上
        { x: -halfW, y: 0 }, // 左下
        { x: halfW, y: 0 }, // 右下
      ];
    case SHAPE.TRIANGLE:
      // 三角形（简约版）
      return [
        { x: 0, y: -height }, // 顶点
        { x: halfW, y: 0 }, // 右下
        { x: -halfW, y: 0 }, // 左下
      ];
    case SHAPE.RECT:
    default:
      // 矩形
      return [
        { x: -halfW, y: -height }, // 左上
        { x: halfW, y: -height }, // 右上
        { x: halfW, y: 0 }, // 右下
        { x: -halfW, y: 0 }, // 左下
      ];
  }
}

// 楼栋类型配置
export const BUILDING_TYPES = {
  RESIDENTIAL_LOW: {
    name: "住宅楼",
    normalImage: img06,
    activeImage: img17,
    width: 92,
    height: 170,
    floors: 6,
    shape: SHAPE.TRAPEZOID_LEFT,
    topScale: 0.65,
  },
  RESIDENTIAL_HIGH: {
    name: "高层住宅",
    normalImage: img08,
    activeImage: img11,
    width: 123,
    height: 188,
    floors: 12,
    shape: SHAPE.RECT,
  },
  OFFICE: {
    name: "办公楼",
    normalImage: img09,
    activeImage: img13,
    width: 132,
    height: 126,
    floors: 10,
    shape: SHAPE.RECT,
  },
  COMMERCIAL: {
    name: "商业楼",
    normalImage: img10,
    activeImage: img15,
    width: 86,
    height: 194,
    floors: 4,
    shape: SHAPE.TRAPEZOID_RIGHT,
    topScale: 0.5,
  },
};

/**
 * 获取建筑的多边形顶点
 * @param {Object} config - 建筑配置
 * @returns {Array<{x: number, y: number}>}
 */
export function getBuildingPolygon(config) {
  return generatePolygon(
    config.shape,
    config.width,
    config.height,
    config.topScale,
  );
}

// 布局配置 - 每个元素为 [x, y, typeKey]
export const LAYOUT_CONFIG = {
  gridSize: 50,
  buildings: [
    [0, 1, "RESIDENTIAL_LOW"],
    [0.8, 1, "RESIDENTIAL_LOW"],
    [1.6, 1, "RESIDENTIAL_LOW"],
    [2.4, 1, "RESIDENTIAL_LOW"],
    // [2, 3, "RESIDENTIAL_HIGH"],
    // [4, 3, "OFFICE"],
    // [6, 2, "COMMERCIAL"],
  ],
};

// 相机配置
export const CAMERA_CONFIG = {
  initialX: 406,
  initialY: 180,
  minZoom: 0.3,
  maxZoom: 2,
};

// 画布尺寸
export const CANVAS_SIZE = {
  width: 812,
  height: 375,
};
