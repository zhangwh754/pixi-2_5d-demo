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
  // 形状1（左窄右宽梯形）
  TYPE_1: "type_1",
  // 形状2（矩形）
  TYPE_2: "type_2",
  // 形状3（三角形）
  TYPE_3: "type_3",
  // 形状4（右窄左宽梯形）
  TYPE_4: "type_4",
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
    case SHAPE.TYPE_1:
      // img_06
      return [
        { x: -45.54129094117508, y: -136.61997985839844 },
        { x: 13.098723707262423, y: -169.89999389648438 },
        { x: 42.7787469006218, y: -150.05999755859375 },
        { x: 44.69872981077805, y: -38.06001281738281 },
        { x: -11.621246995862577, y: -1.5799713134765625 },
        { x: -44.90127629273758, y: -20.779953002929688 },
      ];
    case SHAPE.TYPE_2:
      // img_08
      return [
        { x: -60.93875056273117, y: -161.0199737548828 },
        { x: -16.778746900621798, y: -187.25999450683594 },
        { x: 60.02127140992508, y: -143.09999084472656 },
        { x: 61.30127018922195, y: -27.900009155273438 },
        { x: 15.221253099378202, y: -1.0200042724609375 },
        { x: -60.93875056273117, y: -46.46000671386719 },
      ];
    case SHAPE.TYPE_3:
      // img_09
      return [
        { x: -64.98129338258133, y: -99.02000427246094 },
        { x: -20.821228685315702, y: -123.97996520996094 },
        { x: -13.781281175550077, y: -118.86000061035156 },
        { x: -4.8212286853157025, y: -125.25999450683594 },
        { x: 64.93872004515305, y: -84.94001770019531 },
        { x: 65.57873469359055, y: -27.340011596679688 },
        { x: 57.2587273693718, y: -21.579971313476562 },
        { x: 48.93872004515305, y: -26.060012817382812 },
        { x: 4.7787469006217975, y: -1.0999908447265625 },
        { x: -64.98129338258133, y: -40.13999938964844 },
        { x: -64.98129338258133, y: -100.30000305175781 },
      ];
    case SHAPE.TYPE_4:
      // img_10
      return [
        { x: -42.800018310546875, y: -170.5800018310547 },
        { x: -3.119964599609375, y: -192.97999572753906 },
        { x: 42.959991455078125, y: -168.0199737548828 },
        { x: 42.959991455078125, y: -24.659988403320312 },
        { x: 2, y: -0.3400115966796875 },
        { x: -42.160003662109375, y: -25.939987182617188 },
      ];
    default:
      return [
        { x: -halfW, y: -height },
        { x: halfW, y: -height },
        { x: halfW, y: 0 },
        { x: -halfW, y: 0 },
      ];
  }
}

// 楼栋类型配置
export const BUILDING_TYPES = {
  BUILDING_1: {
    name: "类型1",
    normalImage: img06,
    activeImage: img17,
    width: 92,
    height: 170,
    floors: 6,
    shape: SHAPE.TYPE_1,
  },
  BUILDING_2: {
    name: "类型2",
    normalImage: img08,
    activeImage: img11,
    width: 123,
    height: 188,
    floors: 12,
    shape: SHAPE.TYPE_2,
  },
  BUILDING_3: {
    name: "类型3",
    normalImage: img09,
    activeImage: img13,
    width: 132,
    height: 126,
    floors: 10,
    shape: SHAPE.TYPE_3,
  },
  BUILDING_4: {
    name: "类型4",
    normalImage: img10,
    activeImage: img15,
    width: 86,
    height: 194,
    floors: 4,
    shape: SHAPE.TYPE_4,
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
  // 全局缩放比例
  scale: 0.5,
  buildings: [
    [2.8, 1.4, "BUILDING_1"],
    [2.8, 2.1, "BUILDING_1"],
    [2.8, 2.8, "BUILDING_1"],

    [0.8, 4.5, "BUILDING_2"],
    [1.73, 4.5, "BUILDING_2"],
    [2.66, 4.5, "BUILDING_2"],

    [-0.2, 3.3, "BUILDING_2"],
    [0.73, 3.3, "BUILDING_2"],

    [-1, 2.1, "BUILDING_2"],
    [-0.07, 2.1, "BUILDING_2"],
    [0.86, 2.1, "BUILDING_2"],

    [-1.5, 0.9, "BUILDING_2"],
    [-0.57, 0.9, "BUILDING_2"],
    [0.36, 0.9, "BUILDING_2"],
    [1.29, 0.9, "BUILDING_2"],

    [-1.5, -0.4, "BUILDING_2"],
    [-0.57, -0.4, "BUILDING_2"],
    [0.36, -0.4, "BUILDING_2"],
    [1.29, -0.4, "BUILDING_2"],

    [2.8, -0.1, "BUILDING_3"],
    [2.8, -0.8, "BUILDING_3"],
    [2.8, -1.5, "BUILDING_3"],

    [-1.1, -2.1, "BUILDING_4"],
    [-0.55, -2.2, "BUILDING_4"],
    [0, -2.2, "BUILDING_4"],
    [0.55, -2.2, "BUILDING_4"],
    [1.1, -2.1, "BUILDING_4"],
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
