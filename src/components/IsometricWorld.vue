<template>
  <div class="isometric-wrapper">
    <div ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Application, Container } from "pixi.js";
import {
  BUILDING_TYPES,
  LAYOUT_CONFIG,
  CAMERA_CONFIG,
  CANVAS_SIZE,
} from "../constants/buildingTypes.js";
import { preloadImages } from "../utils/isometric.js";
import { Building } from "../classes/Building.js";

const emit = defineEmits(["building-select"]);

const canvasContainer = ref(null);
let app = null;
let worldContainer = null;
let buildings = [];

/**
 * 初始化 Pixi 应用
 */
async function initApp() {
  app = new Application();
  await app.init({
    resolution: window.devicePixelRatio,
    autoDensity: true,
    width: CANVAS_SIZE.width,
    height: CANVAS_SIZE.height,
    backgroundAlpha: 0,
    antialias: true,
  });

  if (canvasContainer.value) {
    canvasContainer.value.appendChild(app.canvas);
  }

  // 创建容器
  worldContainer = new Container();
  app.stage.addChild(worldContainer);

  // 初始化相机位置
  worldContainer.x = CAMERA_CONFIG.initialX;
  worldContainer.y = CAMERA_CONFIG.initialY;

  // TODO 初始化交互
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

  buildingList.forEach(([gx, gy, typeKey, text]) => {
    const id = buildingId++;
    const isActive = activeId && id === activeId;
    const building = new Building(gx, gy, typeKey, id, {
      text: text,
      isActive,
      scale,
      onSelect: (selectedId) => {
        buildings.forEach((b) => b.setActive(b.id === selectedId));
      },
    });
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

// 挂载时初始化
onMounted(async () => {
  await initApp();
  await preloadImages(BUILDING_TYPES);
  generateBuildings();
});

// 卸载时清理
onUnmounted(() => {
  if (app) {
    app.destroy(true, { children: true, texture: true });
  }
});
</script>

<style scoped>
.isometric-wrapper {
  width: 812px;
  height: 375px;
  position: relative;
  overflow: hidden;
  background: url(/assets/img_05.png) center/100% 100% no-repeat;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  touch-action: none;
}

.canvas-container {
  width: 812px;
  height: 375px;
}
</style>
