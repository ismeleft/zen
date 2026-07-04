import { useRef, useEffect } from "react";
import * as THREE from "three";

interface LayerConfig {
  count: number;
  len: number;
  width: number;
  closed: number;
  open: number;
  delay: number;
  lift: number;
}

function makePetalGeometry(
  length: number,
  width: number,
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(1, 1, 10, 20);
  const pos = geo.attributes.position;
  const colors: number[] = [];
  const baseColor = new THREE.Color("#fdf6ec");
  const midColor = new THREE.Color("#f7c8d8");
  const tipColor = new THREE.Color("#e56a9a");
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x0 = pos.getX(i); // -0.5 ~ 0.5
    const v = pos.getY(i) + 0.5; // 0 (基部) ~ 1 (尖端)

    // 寬度輪廓：基部窄、中段寬、尖端收成尖
    const profile = Math.pow(Math.sin(Math.pow(v, 0.75) * Math.PI), 0.85);
    const wp = 0.18 + 0.82 * profile;
    const xn = x0 * 2; // -1 ~ 1

    const x = x0 * wp * width;
    const y = v * length;
    // 橫向內凹（杯狀）+ 縱向微拱 + 尖端回勾
    const cup = 0.22 * width * (xn * xn) * profile;
    const arch = 0.16 * length * Math.sin(v * Math.PI);
    const tipCurl = 0.1 * length * Math.pow(v, 3);
    const z = cup + arch - tipCurl;

    pos.setXYZ(i, x, y, z);

    // 頂點色：基部乳白 → 中段粉 → 尖端桃紅
    if (v < 0.55) c.copy(baseColor).lerp(midColor, v / 0.55);
    else c.copy(midColor).lerp(tipColor, (v - 0.55) / 0.45);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

const smoothstep = (a: number, b: number, t: number): number => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/* 由外而內依序綻放的四層花瓣 */
const LAYERS: LayerConfig[] = [
  {
    count: 12,
    len: 1.6,
    width: 0.82,
    closed: 0.2,
    open: 1.42,
    delay: 0.0,
    lift: 0.0,
  },
  {
    count: 10,
    len: 1.52,
    width: 0.74,
    closed: 0.15,
    open: 1.1,
    delay: 0.14,
    lift: 0.03,
  },
  {
    count: 8,
    len: 1.36,
    width: 0.64,
    closed: 0.1,
    open: 0.8,
    delay: 0.3,
    lift: 0.06,
  },
  {
    count: 6,
    len: 1.15,
    width: 0.54,
    closed: 0.06,
    open: 0.52,
    delay: 0.46,
    lift: 0.09,
  },
];

const BLOOM_DURATION_MS = 4500;

export default function LotusBloom() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth,
      H = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1e24");
    scene.fog = new THREE.Fog("#0b1e24", 8, 16);

    // 防 NaN：jsdom 下 clientHeight 為 0
    const camera = new THREE.PerspectiveCamera(42, W / H || 1, 0.1, 50);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    /* ---------- 光 ---------- */
    scene.add(new THREE.AmbientLight("#40525c", 0.9));
    const key = new THREE.DirectionalLight("#fff4e0", 1.15);
    key.position.set(4, 6, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#7fd4c8", 0.5);
    rim.position.set(-5, 3, -4);
    scene.add(rim);
    const heart = new THREE.PointLight("#ffd27a", 0, 4);
    heart.position.set(0, 0.6, 0);
    scene.add(heart);

    /* ---------- 花 ---------- */
    const flower = new THREE.Group();
    scene.add(flower);

    const petalMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.0,
    });

    const pivots: THREE.Group[][] = [];
    LAYERS.forEach((cfg, li) => {
      const geo = makePetalGeometry(cfg.len, cfg.width);
      const ringOffset = (li % 2) * (Math.PI / cfg.count);
      const arr: THREE.Group[] = [];
      for (let i = 0; i < cfg.count; i++) {
        const angle = (i / cfg.count) * Math.PI * 2 + ringOffset;
        const holder = new THREE.Group();
        holder.rotation.y = angle;
        const pivot = new THREE.Group();
        pivot.position.set(0, 0.05 + cfg.lift, 0.1 + li * 0.015);
        const petal = new THREE.Mesh(geo, petalMat);
        pivot.add(petal);
        holder.add(pivot);
        flower.add(holder);
        arr.push(pivot);
      }
      pivots.push(arr);
    });

    /* 花心蓮蓬 + 花蕊 */
    const center = new THREE.Group();
    const pod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.1, 0.22, 20),
      new THREE.MeshStandardMaterial({ color: "#c9d75a", roughness: 0.8 }),
    );
    pod.position.y = 0.22;
    center.add(pod);
    const stamenMat = new THREE.MeshStandardMaterial({
      color: "#ffcf5e",
      emissive: "#7a5210",
      roughness: 0.6,
    });
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 0.2 + (i % 2) * 0.045;
      const s = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.008, 0.26, 6),
        stamenMat,
      );
      s.position.set(Math.cos(a) * r, 0.24, Math.sin(a) * r);
      s.rotation.z = -Math.cos(a) * 0.35;
      s.rotation.x = Math.sin(a) * 0.35;
      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 8, 8),
        stamenMat,
      );
      tip.position.y = 0.14;
      s.add(tip);
      center.add(s);
    }
    flower.add(center);

    /* 蓮葉水面 */
    const leafGeo = new THREE.CircleGeometry(1.6, 48, 0.25, Math.PI * 2 - 0.5);
    const leafMat = new THREE.MeshStandardMaterial({
      color: "#1d5c48",
      roughness: 0.85,
      side: THREE.DoubleSide,
    });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.rotation.x = -Math.PI / 2;
    leaf.position.y = -0.02;
    scene.add(leaf);
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({
        color: "#0e2f38",
        roughness: 0.3,
        metalness: 0.4,
      }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.05;
    scene.add(water);

    /* ---------- 視角（拖曳環繞 + 滾輪縮放） ---------- */
    let theta = 0.5,
      phi = 1.12,
      dist = 5.2;
    let dragging = false,
      px = 0,
      py = 0;
    const updateCam = () => {
      camera.position.set(
        dist * Math.sin(phi) * Math.sin(theta),
        dist * Math.cos(phi) + 0.7,
        dist * Math.sin(phi) * Math.cos(theta),
      );
      camera.lookAt(0, 0.7, 0);
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      theta -= (e.clientX - px) * 0.006;
      phi = Math.min(1.5, Math.max(0.35, phi - (e.clientY - py) * 0.006));
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      dist = Math.min(9, Math.max(3, dist + e.deltaY * 0.004));
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    /* ---------- 動畫迴圈 ---------- */
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    let raf: number;
    // 用絕對時間戳計算 progress，避免 THREE.Clock 累積 delta 或 tab 隱藏造成的問題
    const animStartMs = performance.now();
    let prevMs = animStartMs;

    const applyBloom = (t: number) => {
      LAYERS.forEach((cfg, li) => {
        const local = smoothstep(cfg.delay, Math.min(1, cfg.delay + 0.55), t);
        const angle = cfg.closed + (cfg.open - cfg.closed) * local;
        pivots[li].forEach((pivot, i) => {
          // 每瓣加一點隨機性，開得更自然
          const jitter = 1 + 0.06 * Math.sin(i * 12.9898 + li * 78.233);
          pivot.rotation.x = angle * jitter;
        });
      });
      const reveal = smoothstep(0.55, 1, t);
      center.scale.setScalar(0.35 + 0.65 * reveal);
      heart.intensity = reveal * 1.6;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const nowMs = performance.now();
      const dt = Math.min((nowMs - prevMs) / 1000, 0.05);
      prevMs = nowMs;

      const bloomProgress = Math.min(1, (nowMs - animStartMs) / BLOOM_DURATION_MS);
      const elapsed = (nowMs - animStartMs) / 1000;

      applyBloom(bloomProgress);

      if (!reduced && !dragging) theta += dt * 0.08; // 緩慢自轉
      flower.position.y = reduced ? 0 : Math.sin(elapsed * 0.8) * 0.02;
      updateCam();
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      const w = mount.clientWidth,
        h = mount.clientHeight;
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) (mesh.material as THREE.Material).dispose();
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "#0b1e24",
        overflow: "hidden",
      }}
    >
      <div
        ref={mountRef}
        style={{ position: "absolute", inset: 0, cursor: "grab" }}
      />
    </div>
  );
}
