<template>
  <div class="isometric-wrapper">
    <div ref="canvasContainer" class="canvas-container"></div>

    <div class="info-container">
      <!-- 独居老人 -->
      <div class="info">{{ elderlyAloneCount }}户</div>
      <!-- 疑似群居 -->
      <div class="info">{{ suspectedGroupCount }}户</div>
      <!-- 商铺 -->
      <div class="info">{{ shopCount }}户</div>
      <!-- 空关户 -->
      <div class="info">{{ vacantCount }}户</div>
    </div>
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
import {
  generateAllBuildingsData,
  RESIDENT_TYPE,
} from "../constants/mockData.js";

const emit = defineEmits(["building-select"]);

const canvasContainer = ref(null);
let app = null;
let worldContainer = null;
let buildings = [];

// 各类型户数统计
const elderlyAloneCount = ref(0);
const suspectedGroupCount = ref(0);
const shopCount = ref(0);
const vacantCount = ref(0);

// 存储所有楼栋的 mock 数据
let buildingsData = [];
let selectedBuildingId = null; // 当前选中的楼栋ID
let isBuildingClick = false; // 标记是否是楼栋点击事件

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

  // 初始化交互
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

  // 点击 canvas 时，如果点击的不是楼栋（有选中的话）则取消选中
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointertap", () => {
    if (isBuildingClick) {
      isBuildingClick = false;
      return;
    }
    if (selectedBuildingId !== null) {
      clearSelection();
    }
  });
}

/**
 * 恢复显示所有楼栋数据之和
 */
function restoreTotalCounts() {
  const totalCounts = {
    [RESIDENT_TYPE.ELDERLY_ALONE]: 0,
    [RESIDENT_TYPE.SUSPECTED_GROUP]: 0,
    [RESIDENT_TYPE.SHOP]: 0,
    [RESIDENT_TYPE.VACANT]: 0,
  };

  buildingsData.forEach((data) => {
    data.households.forEach((h) => {
      if (totalCounts[h.type] !== undefined) {
        totalCounts[h.type]++;
      }
    });
  });

  elderlyAloneCount.value = totalCounts[RESIDENT_TYPE.ELDERLY_ALONE];
  suspectedGroupCount.value = totalCounts[RESIDENT_TYPE.SUSPECTED_GROUP];
  shopCount.value = totalCounts[RESIDENT_TYPE.SHOP];
  vacantCount.value = totalCounts[RESIDENT_TYPE.VACANT];
}

/**
 * 取消选中，恢复显示所有楼栋数据之和
 */
function clearSelection() {
  selectedBuildingId = null;
  buildings.forEach((b) => b.setActive(false));
  restoreTotalCounts();
}

/**
 * 更新 info-container 显示对应楼栋的户数
 * @param {number} buildingId 楼栋ID
 */
function updateInfoContainer(buildingId) {
  const data = buildingsData[buildingId - 1];
  if (!data) return;

  const counts = {
    [RESIDENT_TYPE.ELDERLY_ALONE]: 0,
    [RESIDENT_TYPE.SUSPECTED_GROUP]: 0,
    [RESIDENT_TYPE.SHOP]: 0,
    [RESIDENT_TYPE.VACANT]: 0,
  };

  data.households.forEach((h) => {
    if (counts[h.type] !== undefined) {
      counts[h.type]++;
    }
  });

  elderlyAloneCount.value = counts[RESIDENT_TYPE.ELDERLY_ALONE];
  suspectedGroupCount.value = counts[RESIDENT_TYPE.SUSPECTED_GROUP];
  shopCount.value = counts[RESIDENT_TYPE.SHOP];
  vacantCount.value = counts[RESIDENT_TYPE.VACANT];
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

  // 生成所有楼栋的 mock 数据
  buildingsData = generateAllBuildingsData(buildingList);

  buildingList.forEach(([gx, gy, typeKey, text], index) => {
    const id = buildingId++;
    const isActive = activeId && id === activeId;
    const building = new Building(gx, gy, typeKey, id, {
      text: text,
      isActive,
      scale,
      onSelect: (selectedId) => {
        isBuildingClick = true;
        // 如果点击的是已选中的楼栋，则取消选中
        if (selectedBuildingId === selectedId) {
          selectedBuildingId = null;
          buildings.forEach((b) => b.setActive(false));
          // 恢复显示所有楼栋数据之和
          restoreTotalCounts();
        } else {
          selectedBuildingId = selectedId;
          buildings.forEach((b) => b.setActive(b.id === selectedId));
          // 更新 info-container 的户数统计
          updateInfoContainer(selectedId);
        }
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

  // 默认显示所有楼栋数据之和
  restoreTotalCounts();
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
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  overflow: hidden;
  background: url(/assets/img_05.png) center/100% no-repeat;
  border-radius: 8px;
}

.info-container {
  position: fixed;
  top: 78px;
  right: 27px;
  display: flex;
  flex-direction: column;
}

.info {
  width: 40px;
  color: #a7c3ff;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.info:nth-of-type(2),
.info:nth-of-type(3),
.info:nth-of-type(4) {
  margin-top: 53px;
}
</style>
