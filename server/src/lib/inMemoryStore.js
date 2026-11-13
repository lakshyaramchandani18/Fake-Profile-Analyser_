'use strict';

const { randomUUID } = require('crypto');

const profilesTable = new Map();
const analysesTable = new Map();

function sortRecords(arr, orderBy) {
  if (!orderBy) return arr;
  const [field, direction] = Object.entries(orderBy)[0];
  return [...arr].sort((a, b) => {
    if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return direction === 'asc' ?  1 : -1;
    return 0;
  });
}

function pickFields(record, selectMap) {
  if (!selectMap) return record;
  const result = {};
  for (const key of Object.keys(selectMap)) {
    if (selectMap[key]) result[key] = record[key];
  }
  return result;
}

const profile = {
  async create({ data }) {
    const record = {
      id: randomUUID(),
      platform: data.platform,
      handle: data.handle,
      displayName: data.displayName,
      bio: data.bio ?? null,
      profileUrl: data.profileUrl ?? null,
      followers: data.followers,
      following: data.following,
      postsCount: data.postsCount,
      accountAgeDays: data.accountAgeDays,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    profilesTable.set(record.id, record);
    return record;
  },

  async findMany({ orderBy, include } = {}) {
    let rows = sortRecords([...profilesTable.values()], orderBy);
    if (include && include.analyses) {
      const { orderBy: ao, take, select } = include.analyses;
      rows = rows.map((p) => {
        let linked = [...analysesTable.values()].filter((a) => a.profileId === p.id);
        linked = sortRecords(linked, ao);
        if (take)   linked = linked.slice(0, take);
        if (select) linked = linked.map((a) => pickFields(a, select));
        return { ...p, analyses: linked };
      });
    }
    return rows;
  },


  async findFirst({ where } = {}) {
    if (!where) return profilesTable.values().next().value ?? null;
    const entries = Object.entries(where);
    for (const rec of profilesTable.values()) {
      if (entries.every(([k, v]) => rec[k] === v)) return rec;
    }
    return null;
  },

  async findUnique({ where, include } = {}) {
    if (!where || !where.id) return null;
    const p = profilesTable.get(where.id) ?? null;
    if (!p) return null;
    if (include && include.analyses) {
      const linked = [...analysesTable.values()].filter((a) => a.profileId === p.id);
      return { ...p, analyses: linked };
    }
    return p;
  },

  async delete({ where }) {
    if (!where || !where.id) return null;
    const p = profilesTable.get(where.id);
    if (!p) return null;
    profilesTable.delete(where.id);
    for (const [id, a] of analysesTable.entries()) {
      if (a.profileId === where.id) analysesTable.delete(id);
    }
    return p;
  },
};

const analysis = {
  async create({ data }) {
    const record = {
      id: randomUUID(),
      profileId: data.profileId,
      score: data.score,
      riskLevel: data.riskLevel,
      threatCategory: data.threatCategory,
      indicators: data.indicators,
      breakdown: data.breakdown,
      createdAt: new Date(),
    };
    analysesTable.set(record.id, record);
    return record;
  },

  async findMany({ where, orderBy, select } = {}) {
    let rows = [...analysesTable.values()];
    if (where && where.profileId) rows = rows.filter((a) => a.profileId === where.profileId);
    rows = sortRecords(rows, orderBy);
    if (select) rows = rows.map((a) => pickFields(a, select));
    return rows;
  },

  async findUnique({ where }) {
    return analysesTable.get(where.id) ?? null;
  },
};

function _reset() {
  profilesTable.clear();
  analysesTable.clear();
}

module.exports = { profile, analysis, _reset };
