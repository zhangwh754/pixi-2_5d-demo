/**
 * 住户类型枚举
 */
export const RESIDENT_TYPE = {
  ELDERLY_ALONE: "elderly_alone", // 独居老人
  SUSPECTED_GROUP: "suspected_group", // 疑似群居
  SHOP: "shop", // 商铺
  VACANT: "vacant", // 空关户
};

/**
 * 生成单栋楼的 mock 数据
 * @param {string} buildingId 楼栋编号，如 "17号"
 */
export function generateBuildingData(buildingId) {
  // 70% 概率为 0 户
  const isZero = Math.random() < 0.7;
  const unitCount = isZero ? 0 : Math.floor(Math.random() * 5) + 1; // 1-5 户

  const households = [];

  for (let i = 0; i < unitCount; i++) {
    const rand = Math.random();
    let type;
    if (rand < 0.25) type = RESIDENT_TYPE.ELDERLY_ALONE;
    else if (rand < 0.5) type = RESIDENT_TYPE.SUSPECTED_GROUP;
    else if (rand < 0.75) type = RESIDENT_TYPE.SHOP;
    else type = RESIDENT_TYPE.VACANT;

    households.push({
      unitNumber: i + 1,
      type,
    });
  }

  return {
    buildingId,
    households,
  };
}

/**
 * 为所有楼栋生成 mock 数据
 * @param {Array} buildingList LAYOUT_CONFIG.buildings 数组
 */
export function generateAllBuildingsData(buildingList) {
  return buildingList.map(([gx, gy, typeKey, text]) => {
    return generateBuildingData(text);
  });
}
