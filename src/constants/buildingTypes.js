// 导入图片资源
import img06 from "/assets/img_06.png";
import img08 from "/assets/img_08.png";
import img09 from "/assets/img_09.png";
import img10 from "/assets/img_10.png";
import img11 from "/assets/img_11.png";
import img13 from "/assets/img_13.png";
import img15 from "/assets/img_15.png";
import img17 from "/assets/img_17.png";

// 楼栋类型配置
export const BUILDING_TYPES = {
  RESIDENTIAL_LOW: {
    name: "住宅楼",
    normalImage: img06,
    activeImage: img17,
    width: 92,
    height: 170,
    floors: 6,
  },
  RESIDENTIAL_HIGH: {
    name: "高层住宅",
    normalImage: img08,
    activeImage: img11,
    width: 123,
    height: 188,
    floors: 12,
  },
  OFFICE: {
    name: "办公楼",
    normalImage: img09,
    activeImage: img13,
    width: 132,
    height: 126,
    floors: 10,
  },
  COMMERCIAL: {
    name: "商业楼",
    normalImage: img10,
    activeImage: img15,
    width: 86,
    height: 194,
    floors: 4,
  },
};

// 布局配置
export const LAYOUT_CONFIG = {
  gridSize: 50,
  positions: [
    [2, 1], // 住宅楼
    [4, 1], // 高层住宅
    [2, 3], // 办公楼
    [4, 3], // 商业楼
  ],
  typeKeys: ["RESIDENTIAL_LOW", "RESIDENTIAL_HIGH", "OFFICE", "COMMERCIAL"],
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
