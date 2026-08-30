import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";

describe("viewer safari CPU/RAM optimization", () => {
  const viewer = readFileSync("src/viewer/index.html", "utf-8");

  it("handles Page Visibility API by cancelling graph RAF and pausing dither loop on hidden", () => {
    expect(viewer).toContain("document.addEventListener('visibilitychange'");
    expect(viewer).toContain("if (document.hidden)");
    expect(viewer).toContain("cancelAnimationFrame(graphSim.raf)");
    expect(viewer).toContain("stopDitherLoop()");
  });

  it("resumes dither loop and repaints or wakes graph when visible", () => {
    expect(viewer).toContain("startDitherLoop()");
    expect(viewer).toContain("if (state.activeTab === 'graph')");
    expect(viewer).toContain("wakeGraphSim()");
    expect(viewer).toContain("renderGraph()");
  });

  it("cancels graph animation frames when switching away from graph tab", () => {
    expect(viewer).toContain("if (tab !== 'graph' && graphSim.raf)");
    expect(viewer).toContain("graphSim.raf = null");
  });

  it("guards auto-refresh dashboard and polling intervals when document is hidden", () => {
    expect(viewer).toContain("function startDashboardAutoRefresh()");
    expect(viewer).toContain("if (document.hidden) return;");
  });
});
