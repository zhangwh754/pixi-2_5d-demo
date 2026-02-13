import { Application, Container } from "pixi.js";
import "./styles/main.css";
import {
  BUILDING_TYPES,
  LAYOUT_CONFIG,
  CAMERA_CONFIG,
  CANVAS_SIZE,
} from "./constants/buildingTypes.js";
import { preloadImages } from "./utils/isometric.js";
import { Building } from "./classes/Building.js";

// 全局变量
let app;
let worldContainer;
let buildings = [];

/**
 * 初始化 Pixi 应用
 */
async function initApp() {
  app = new Application();
  await app.init({
    width: CANVAS_SIZE.width,
    height: CANVAS_SIZE.height,
    backgroundAlpha: 0,
    antialias: true,
  });
  document.getElementById("gameCanvas").appendChild(app.canvas);

  // 创建容器
  worldContainer = new Container();
  app.stage.addChild(worldContainer);

  // 初始化相机位置
  worldContainer.x = CAMERA_CONFIG.initialX;
  worldContainer.y = CAMERA_CONFIG.initialY;

  // TODO 关闭了交互事件
  // initInteraction();
}

/**
 * 初始化交互（拖拽、缩放）
 */
function initInteraction() {
  let isDragging = false;
  let lastX, lastY;

  app.canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    worldContainer.x += dx;
    worldContainer.y += dy;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  app.canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = worldContainer.scale.x * scale;

    if (
      newScale >= CAMERA_CONFIG.minZoom &&
      newScale <= CAMERA_CONFIG.maxZoom
    ) {
      worldContainer.scale.set(newScale);
    }
  });
}

/**
 * 生成建筑布局
 * @param {number|null} activeId - 当前激活的建筑ID
 */
function generateBuildings(activeId = null) {
  // 清空现有建筑
  buildings.forEach((b) => worldContainer.removeChild(b.container));
  buildings = [];

  const { gridSize, scale, buildings: buildingList } = LAYOUT_CONFIG;
  let buildingId = 1;

  buildingList.forEach(([gx, gy, typeKey]) => {
    const id = buildingId++;
    const isActive = activeId && id === activeId;
    const building = new Building(
      gx,
      gy,
      typeKey,
      id,
      isActive,
      scale,
      (selectedId) => {
        buildings.forEach((b) => b.setActive(b.id === selectedId));
      }
    );
    building.setPosition(gx * gridSize, gy * gridSize);
    buildings.push(building);
    worldContainer.addChild(building.container);
  });

  // 按Y坐标排序，实现正确的遮挡关系
  buildings.sort((a, b) => {
    const aY = a.gridX + a.gridY;
    const bY = b.gridX + b.gridY;
    return aY - bY;
  });

  buildings.forEach((b, index) => {
    worldContainer.setChildIndex(b.container, index);
  });
}

/**
 * 初始化应用
 */
async function init() {
  await initApp();
  await preloadImages(BUILDING_TYPES);
  generateBuildings();
}

// 启动应用
init();
