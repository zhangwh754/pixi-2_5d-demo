<template>
  <IsometricWorld
    ref="isometricWorld"
    @building-select="handleBuildingSelect"
  />
</template>

<script setup>
import { ref, provide } from "vue";
import IsometricWorld from "./components/IsometricWorld.vue";

// 提供选中建筑信息给子组件
const selectedBuilding = ref(null);
provide("selectedBuilding", selectedBuilding);

// 处理建筑选中事件
const handleBuildingSelect = (buildingData) => {
  selectedBuilding.value = buildingData;
};
</script>
