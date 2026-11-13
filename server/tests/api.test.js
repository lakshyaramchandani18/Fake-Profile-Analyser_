"use strict";

/**
 * FPDS — Controller Integration Tests
 * Tests the complete flow: create profile -> analyze -> list -> get
 * No network socket or port required — calls controller functions directly with mock req/res.
 *
 * Run: node --test tests/api.test.js
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

function mockReq({ params = {}, body = {}, query = {} } = {}) {
  return { params, body, query };
}

function mockRes() {
  const res = {
    _status: 200,
    _body: null,
    status(code) {
      this._status = code;
      return this;
    },
    json(payload) {
      this._body = payload;
      return this;
    },
  };
  return res;
}

function mockNext(err) {
  if (err) throw err;
}

const store = require("../src/lib/inMemoryStore");

function clearStore() {
  if (typeof store._reset === "function") store._reset();
}

const profileCtrl = require("../src/controllers/profileController");
const analysisCtrl = require("../src/controllers/analysisController");
const scanCtrl = require("../src/controllers/scanController");

const SAMPLE_PROFILE = {
  platform: "instagram",
  handle: "@shadow_bot99",
  displayName: "Shadow Bot",
  followers: 120000,
  following: 95000,
  postsCount: 4,
  accountAgeDays: 30,
  bio: "click link in bio",
  profileUrl: "https://instagram.com/shadow_bot99",
};

describe("profileController integration", () => {
  beforeEach(clearStore);

  it("POST /api/profiles - creates profile and returns 201", async () => {
    const req = mockReq({ body: SAMPLE_PROFILE });
    const res = mockRes();

    await profileCtrl.create(req, res, mockNext);

    assert.equal(res._status, 201);
    assert.ok(res._body.profile);
    assert.ok(res._body.profile.id);
    assert.equal(res._body.profile.handle, "@shadow_bot99");
    assert.equal(res._body.profile.platform, "instagram");
  });

  it("GET /api/profiles - returns empty array when no profiles exist", async () => {
    const req = mockReq();
    const res = mockRes();

    await profileCtrl.list(req, res, mockNext);

    assert.equal(res._status, 200);
    assert.deepEqual(res._body.profiles, []);
  });

  it("GET /api/profiles - returns all created profiles", async () => {
    await profileCtrl.create(mockReq({ body: SAMPLE_PROFILE }), mockRes(), mockNext);
    await profileCtrl.create(
      mockReq({ body: { ...SAMPLE_PROFILE, handle: "@clean_user" } }),
      mockRes(),
      mockNext
    );

    const res = mockRes();
    await profileCtrl.list(mockReq(), res, mockNext);

    assert.equal(res._status, 200);
    assert.equal(res._body.profiles.length, 2);
  });

  it("GET /api/profiles/:id - retrieves a single profile by id", async () => {
    const createRes = mockRes();
    await profileCtrl.create(mockReq({ body: SAMPLE_PROFILE }), createRes, mockNext);
    const profileId = createRes._body.profile.id;

    const res = mockRes();
    await profileCtrl.getOne(mockReq({ params: { id: profileId } }), res, mockNext);

    assert.equal(res._status, 200);
    assert.equal(res._body.profile.id, profileId);
  });

  it("GET /api/profiles/:id - returns 404 for nonexistent id", async () => {
    const res = mockRes();
    await profileCtrl.getOne(mockReq({ params: { id: "unknown-id" } }), res, mockNext);

    assert.equal(res._status, 404);
    assert.ok(res._body.error);
  });

  it("GET /api/profiles/dashboard - formats investigations for frontend table", async () => {
    await profileCtrl.create(mockReq({ body: SAMPLE_PROFILE }), mockRes(), mockNext);

    const res = mockRes();
    await profileCtrl.dashboard(mockReq(), res, mockNext);

    assert.equal(res._status, 200);
    assert.ok(Array.isArray(res._body.investigations));
    assert.equal(res._body.investigations.length, 1);
    const inv = res._body.investigations[0];
    assert.ok(inv.id);
    assert.ok(inv.handle);
    assert.ok(inv.platformName);
    assert.ok(inv.avatarInitials);
    assert.ok(inv.status);
  });

  it("inMemoryStore findFirst - finds profile by matching fields", async () => {
    await profileCtrl.create(mockReq({ body: SAMPLE_PROFILE }), mockRes(), mockNext);
    const found = await store.profile.findFirst({
      where: { handle: "@shadow_bot99", platform: "instagram" },
    });
    assert.ok(found);
    assert.equal(found.handle, "@shadow_bot99");

    const notFound = await store.profile.findFirst({
      where: { handle: "@nonexistent" },
    });
    assert.equal(notFound, null);
  });
});

describe("analysisController integration", () => {
  beforeEach(clearStore);

  async function createTestProfile(overrides = {}) {
    const res = mockRes();
    await profileCtrl.create(mockReq({ body: { ...SAMPLE_PROFILE, ...overrides } }), res, mockNext);
    return res._body.profile;
  }

  it("POST /api/profiles/:id/analyze - runs risk engine and returns 201", async () => {
    const profile = await createTestProfile();
    const res = mockRes();

    await analysisCtrl.analyze(mockReq({ params: { id: profile.id } }), res, mockNext);

    assert.equal(res._status, 201);
    const { analysis, investigation } = res._body;

    assert.ok(analysis.id);
    assert.equal(typeof analysis.score, "number");
    assert.ok(["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(analysis.riskLevel));
    assert.ok(Array.isArray(analysis.indicators));
    assert.ok(analysis.breakdown);

    assert.ok(investigation);
    assert.ok(investigation.id);
    assert.equal(investigation.riskScore, analysis.score);
  });

  it("POST /api/profiles/:id/analyze - returns 404 if profile does not exist", async () => {
    const res = mockRes();
    await analysisCtrl.analyze(mockReq({ params: { id: "ghost-id" } }), res, mockNext);

    assert.equal(res._status, 404);
  });

  it("GET /api/profiles/:id/analyses - lists historical analyses newest first", async () => {
    const profile = await createTestProfile();
    const analyzeReq = mockReq({ params: { id: profile.id } });

    await analysisCtrl.analyze(analyzeReq, mockRes(), mockNext);
    await analysisCtrl.analyze(analyzeReq, mockRes(), mockNext);

    const res = mockRes();
    await analysisCtrl.listForProfile(analyzeReq, res, mockNext);

    assert.equal(res._status, 200);
    assert.equal(res._body.analyses.length, 2);
  });

  it("GET /api/analyses/:id - retrieves analysis by id", async () => {
    const profile = await createTestProfile();
    const analyzeRes = mockRes();
    await analysisCtrl.analyze(mockReq({ params: { id: profile.id } }), analyzeRes, mockNext);
    const analysisId = analyzeRes._body.analysis.id;

    const res = mockRes();
    await analysisCtrl.getOne(mockReq({ params: { id: analysisId } }), res, mockNext);

    assert.equal(res._status, 200);
    assert.equal(res._body.analysis.id, analysisId);
    assert.ok(res._body.analysis.riskLevelCss);
  });

  it("GET /api/analyses/:id - returns 404 for unknown analysis id", async () => {
    const res = mockRes();
    await analysisCtrl.getOne(mockReq({ params: { id: "missing-id" } }), res, mockNext);

    assert.equal(res._status, 404);
  });
});

describe("scanController integration", () => {
  beforeEach(clearStore);

  it("POST /api/scan - handles minimal quick scan payload", async () => {
    const req = mockReq({ body: { handle: "@quickbot", platform: "twitter" } });
    const res = mockRes();

    await scanCtrl.scan(req, res, mockNext);

    assert.equal(res._status, 201);
    assert.ok(res._body.investigation);
    assert.equal(res._body.investigation.handle, "@quickbot");
  });

  it("POST /api/scan - handles full profile scan payload", async () => {
    const req = mockReq({ body: SAMPLE_PROFILE });
    const res = mockRes();

    await scanCtrl.scan(req, res, mockNext);

    assert.equal(res._status, 201);
    assert.equal(res._body.investigation.handle, "@shadow_bot99");
    assert.ok(typeof res._body.investigation.riskScore === "number");
  });
});
