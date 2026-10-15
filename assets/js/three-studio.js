/**
 * AETHER KICKS - 3D WebGL Studio & 360 Sneaker Inspector Engine
 * Built with Three.js (r128) & OrbitControls
 */

class Sneaker3DStudio {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.sneakerGroup = null;
    this.particles = null;
    this.shadowPlane = null;
    this.lights = {};
    this.currentShoeId = 'chicago';
    this.currentMode = 'realistic'; // 'realistic', 'wireframe', 'hologram', 'xray'
    this.currentLighting = 'studio'; // 'studio', 'cyberpunk', 'chicago', 'gold'
    this.isAutoRotating = true;
    this.animId = null;
    this.customColors = {
      base: '#ffffff',
      overlay: '#dc2626',
      swoosh: '#000000',
      sole: '#ffffff',
      outsole: '#dc2626',
      laces: '#000000'
    };

    this.textures = {};
    this.loadedImages = {};
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 550;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070709, 0.035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 5.2);

    // 3. Renderer with antialiasing and high precision
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxDistance = 8.5;
      this.controls.minDistance = 2.5;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip below floor
      this.controls.autoRotate = this.isAutoRotating;
      this.controls.autoRotateSpeed = 1.4;
    }

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Build 3D Sneaker Model & Stage
    this.buildStage();
    this.buildSneakerModel(this.currentShoeId);

    // 7. Ambient Particle Field
    this.buildParticleField();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());

    // 9. Start Render Loop
    this.animate();
  }

  setupLighting() {
    // Ambient light
    this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.lights.ambient);

    // Main Key Spotlight (Cast shadow)
    this.lights.keySpot = new THREE.SpotLight(0xffffff, 2.2);
    this.lights.keySpot.position.set(4, 7, 5);
    this.lights.keySpot.angle = Math.PI / 4.5;
    this.lights.keySpot.penumbra = 0.6;
    this.lights.keySpot.castShadow = true;
    this.lights.keySpot.shadow.mapSize.width = 1024;
    this.lights.keySpot.shadow.mapSize.height = 1024;
    this.lights.keySpot.shadow.bias = -0.001;
    this.scene.add(this.lights.keySpot);

    // Fill Light (soft bluish)
    this.lights.fill = new THREE.PointLight(0x38bdf8, 1.2, 15);
    this.lights.fill.position.set(-5, 2, -3);
    this.scene.add(this.lights.fill);

    // Dynamic Rim / Accent Light (Thematic color)
    this.lights.rim = new THREE.PointLight(0xdc2626, 2.5, 12);
    this.lights.rim.position.set(0, -1, 3.5);
    this.scene.add(this.lights.rim);

    // Top Halo Light
    this.lights.topHalo = new THREE.PointLight(0xffffff, 1.0, 10);
    this.lights.topHalo.position.set(0, 5, 0);
    this.scene.add(this.lights.topHalo);
  }

  buildStage() {
    // Studio Pedestal Floor
    const floorGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.2, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121216,
      roughness: 0.35,
      metalness: 0.75
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.1;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Glowing Neon Ring around Pedestal
    const ringGeo = new THREE.RingGeometry(3.22, 3.32, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide
    });
    this.pedestalRing = new THREE.Mesh(ringGeo, ringMat);
    this.pedestalRing.rotation.x = Math.PI / 2;
    this.pedestalRing.position.y = -1.0;
    this.scene.add(this.pedestalRing);

    // Contact Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.2, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55
    });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -0.98;
    this.scene.add(this.shadowPlane);
  }

  buildParticleField() {
    const count = 120;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = Math.random() * 4 - 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geom, mat);
    this.scene.add(this.particles);
  }

  /**
   * Constructs an Authentic, High-Detail Volumetric 3D Sneaker Mesh Model
   * Features: Outsole, Midsole, Perforated Toe Box, Mudguard, Eyestays,
   * 3D Criss-Cross Laces, Padded Tongue with Label, Ankle Collar with Wings,
   * Dual 3D Swooshes, and Heel Counter with Air Cushioning Unit.
   */
  buildSneakerModel(shoeId) {
    if (this.sneakerGroup) {
      this.scene.remove(this.sneakerGroup);
    }

    this.sneakerGroup = new THREE.Group();
    this.sneakerGroup.position.set(0, 0.05, 0);

    const db = window.SNEAKERS_DB || (typeof SNEAKERS_DB !== 'undefined' ? SNEAKERS_DB : {});
    const shoeData = db[shoeId] || db['chicago'] || {
      name: 'Air Jordan 1 High',
      theme: '#dc2626'
    };
    const themeColor = new THREE.Color(shoeData.theme);

    // Color definitions for each colorway
    const isShadow = (shoeId === 'shadow');
    const isChicago = (shoeId === 'chicago');
    const isPurple = (shoeId === 'purple');
    const isBlue = (shoeId === 'blue');
    const isGreen = (shoeId === 'green');
    const isOrange = (shoeId === 'orange');

    let colOverlay = new THREE.Color(shoeData.theme);
    let colBase = new THREE.Color(0xffffff);
    let colSwoosh = new THREE.Color(0x0a0a0c);
    let colMidsole = new THREE.Color(0xf4f4f5);
    let colOutsole = new THREE.Color(shoeData.theme);
    let colLaces = new THREE.Color(0x0a0a0c);
    let colCollar = new THREE.Color(0x0a0a0c);
    let colTongueTag = new THREE.Color(shoeData.theme);

    if (isChicago) {
      colOverlay.set(0xdc2626);
      colBase.set(0xffffff);
      colSwoosh.set(0x0a0a0c);
      colCollar.set(0x0a0a0c);
      colOutsole.set(0xdc2626);
    } else if (isPurple) {
      colOverlay.set(0x9333ea);
      colBase.set(0xffffff);
      colSwoosh.set(0x0a0a0c);
      colCollar.set(0x0a0a0c);
      colOutsole.set(0x9333ea);
    } else if (isBlue) {
      colOverlay.set(0x0284c7);
      colBase.set(0xffffff);
      colSwoosh.set(0x0a0a0c);
      colCollar.set(0x0a0a0c);
      colOutsole.set(0x0284c7);
    } else if (isGreen) {
      colOverlay.set(0x16a34a);
      colBase.set(0x0a0a0c);
      colSwoosh.set(0x0a0a0c);
      colCollar.set(0x0a0a0c);
      colOutsole.set(0x16a34a);
      colTongueTag.set(0xdc2626);
    } else if (isOrange) {
      colOverlay.set(0x0a0a0c);
      colBase.set(0xfef9c3);
      colSwoosh.set(0x0a0a0c);
      colCollar.set(0xea580c);
      colOutsole.set(0xea580c);
      colMidsole.set(0xfef08a);
    } else if (isShadow) {
      colOverlay.set(0x18181b);
      colBase.set(0x18181b);
      colSwoosh.set(0x27272a);
      colMidsole.set(0x121214);
      colOutsole.set(0x09090b);
      colLaces.set(0x18181b);
      colCollar.set(0x121214);
      colTongueTag.set(0x3f3f46);
    }

    // PBR Leather Materials
    const matOverlay = new THREE.MeshStandardMaterial({
      color: colOverlay,
      roughness: 0.38,
      metalness: 0.12
    });
    const matBase = new THREE.MeshStandardMaterial({
      color: colBase,
      roughness: 0.42,
      metalness: 0.08
    });
    const matSwoosh = new THREE.MeshStandardMaterial({
      color: colSwoosh,
      roughness: 0.28,
      metalness: 0.18
    });
    const matMidsole = new THREE.MeshStandardMaterial({
      color: colMidsole,
      roughness: 0.85,
      metalness: 0.04
    });
    const matOutsole = new THREE.MeshStandardMaterial({
      color: colOutsole,
      roughness: 0.72,
      metalness: 0.08
    });
    const matLaces = new THREE.MeshStandardMaterial({
      color: colLaces,
      roughness: 0.9,
      metalness: 0.02
    });
    const matTongue = new THREE.MeshStandardMaterial({
      color: isGreen || isOrange || isShadow ? colBase : new THREE.Color(0xffffff),
      roughness: 0.82,
      metalness: 0.05
    });
    const matCollar = new THREE.MeshStandardMaterial({
      color: colCollar,
      roughness: 0.6,
      metalness: 0.06
    });

    // 1. OUTSOLE (Rubber Traction Base with Sculpted Footbed Curve)
    const soleShape = new THREE.Shape();
    soleShape.moveTo(-1.45, 0.42);
    soleShape.bezierCurveTo(-0.9, 0.52, -0.2, 0.48, 0.5, 0.58);
    soleShape.bezierCurveTo(1.0, 0.62, 1.45, 0.45, 1.6, 0.0);
    soleShape.bezierCurveTo(1.45, -0.45, 1.0, -0.58, 0.5, -0.54);
    soleShape.bezierCurveTo(-0.1, -0.38, -0.8, -0.48, -1.45, -0.38);
    soleShape.bezierCurveTo(-1.62, -0.22, -1.62, 0.22, -1.45, 0.42);

    const extrudeSettingsSole = {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04
    };

    const outsoleGeo = new THREE.ExtrudeGeometry(soleShape, extrudeSettingsSole);
    const outsoleMesh = new THREE.Mesh(outsoleGeo, matOutsole);
    outsoleMesh.rotation.x = Math.PI / 2;
    outsoleMesh.position.set(0, -0.48, 0);
    outsoleMesh.castShadow = true;
    outsoleMesh.receiveShadow = true;
    this.sneakerGroup.add(outsoleMesh);

    // Outsole Pivot Ring Tread
    const pivotRingGeo = new THREE.TorusGeometry(0.24, 0.03, 8, 24);
    const pivotRing = new THREE.Mesh(pivotRingGeo, matOutsole);
    pivotRing.rotation.x = Math.PI / 2;
    pivotRing.position.set(0.75, -0.52, 0.1);
    this.sneakerGroup.add(pivotRing);

    // 2. MIDSOLE (Textured Rubber Sidewall)
    const extrudeSettingsMid = {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };
    const midsoleGeo = new THREE.ExtrudeGeometry(soleShape, extrudeSettingsMid);
    const midsoleMesh = new THREE.Mesh(midsoleGeo, matMidsole);
    midsoleMesh.rotation.x = Math.PI / 2;
    midsoleMesh.position.set(0, -0.24, 0);
    midsoleMesh.scale.set(0.98, 0.98, 1);
    midsoleMesh.castShadow = true;
    this.sneakerGroup.add(midsoleMesh);

    // Perimeter Midsole Stitching Groove
    const grooveCurve = new THREE.EllipseCurve(0, 0, 1.48, 0.52, 0, 2 * Math.PI, false, 0);
    const groovePoints = grooveCurve.getPoints(50);
    const grooveGeo = new THREE.BufferGeometry().setFromPoints(groovePoints.map(p => new THREE.Vector3(p.x, -0.15, p.y)));
    const grooveMat = new THREE.LineBasicMaterial({ color: 0x888888 });
    const grooveLine = new THREE.Line(grooveGeo, grooveMat);
    this.sneakerGroup.add(grooveLine);

    // 3. TOE BOX (Volumetric Curved Leather Dome)
    const toeBoxGeo = new THREE.CylinderGeometry(0.42, 0.54, 0.85, 24, 12, false, 0, Math.PI);
    const toeBoxMesh = new THREE.Mesh(toeBoxGeo, matBase);
    toeBoxMesh.rotation.z = Math.PI / 2;
    toeBoxMesh.rotation.y = Math.PI;
    toeBoxMesh.scale.set(0.68, 1.15, 0.82);
    toeBoxMesh.position.set(0.95, -0.06, 0);
    toeBoxMesh.castShadow = true;
    this.sneakerGroup.add(toeBoxMesh);

    // 4. TOE MUDGUARD OVERLAY (Curved Leather Reinforcement)
    const mudguardGeo = new THREE.TorusGeometry(0.52, 0.12, 12, 28, Math.PI);
    const mudguardMesh = new THREE.Mesh(mudguardGeo, matOverlay);
    mudguardMesh.rotation.x = Math.PI / 2;
    mudguardMesh.rotation.z = Math.PI / 2;
    mudguardMesh.scale.set(0.9, 1.15, 0.8);
    mudguardMesh.position.set(1.05, -0.12, 0);
    mudguardMesh.castShadow = true;
    this.sneakerGroup.add(mudguardMesh);

    // 5. VAMP & QUARTER PANELS (Side Leather Walls)
    const quarterGeo = new THREE.BoxGeometry(1.4, 0.48, 0.94);
    const quarterMesh = new THREE.Mesh(quarterGeo, matBase);
    quarterMesh.position.set(0.05, 0.08, 0);
    quarterMesh.castShadow = true;
    this.sneakerGroup.add(quarterMesh);

    // Lateral and Medial Eyestay Columns
    const eyestayLeftGeo = new THREE.BoxGeometry(0.95, 0.12, 0.16);
    const eyestayLeft = new THREE.Mesh(eyestayLeftGeo, matOverlay);
    eyestayLeft.rotation.z = -0.36;
    eyestayLeft.position.set(0.35, 0.32, 0.38);
    eyestayLeft.castShadow = true;
    this.sneakerGroup.add(eyestayLeft);

    const eyestayRight = eyestayLeft.clone();
    eyestayRight.position.z = -0.38;
    this.sneakerGroup.add(eyestayRight);

    // Eyelet Rings (Metallic Grommets)
    for (let i = 0; i < 5; i++) {
      const eyeletGeo = new THREE.TorusGeometry(0.03, 0.012, 8, 16);
      const eyeletMat = new THREE.MeshStandardMaterial({ color: isShadow ? 0x222222 : 0xcccccc, metalness: 0.85, roughness: 0.2 });
      
      const eLeft = new THREE.Mesh(eyeletGeo, eyeletMat);
      eLeft.rotation.y = Math.PI / 2;
      eLeft.position.set(0.05 + i * 0.16, 0.18 + i * 0.07, 0.45);
      this.sneakerGroup.add(eLeft);

      const eRight = eLeft.clone();
      eRight.position.z = -0.45;
      this.sneakerGroup.add(eRight);
    }

    // 6. PADDED TONGUE (Angled & Cushioned)
    const tongueGeo = new THREE.BoxGeometry(0.85, 0.08, 0.62);
    const tongueMesh = new THREE.Mesh(tongueGeo, matTongue);
    tongueMesh.rotation.z = -0.42;
    tongueMesh.position.set(0.18, 0.52, 0);
    tongueMesh.castShadow = true;
    this.sneakerGroup.add(tongueMesh);

    // Woven Tongue Label Badge
    const labelGeo = new THREE.BoxGeometry(0.16, 0.02, 0.32);
    const labelMat = new THREE.MeshStandardMaterial({ color: colTongueTag, roughness: 0.6 });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.rotation.z = -0.42;
    labelMesh.position.set(0.48, 0.82, 0);
    this.sneakerGroup.add(labelMesh);

    // 7. REAL 3D CRISS-CROSS LACES
    for (let i = 0; i < 5; i++) {
      const yPos = 0.22 + i * 0.11;
      const xPos = 0.58 - i * 0.12;
      const laceCross1 = new THREE.CylinderGeometry(0.022, 0.022, 0.72, 12);
      const laceMesh1 = new THREE.Mesh(laceCross1, matLaces);
      laceMesh1.rotation.x = Math.PI / 2 + 0.18;
      laceMesh1.rotation.y = -0.15;
      laceMesh1.position.set(xPos, yPos, 0);
      laceMesh1.castShadow = true;
      this.sneakerGroup.add(laceMesh1);

      const laceCross2 = new THREE.CylinderGeometry(0.022, 0.022, 0.72, 12);
      const laceMesh2 = new THREE.Mesh(laceCross2, matLaces);
      laceMesh2.rotation.x = Math.PI / 2 - 0.18;
      laceMesh2.rotation.y = 0.15;
      laceMesh2.position.set(xPos, yPos, 0);
      laceMesh2.castShadow = true;
      this.sneakerGroup.add(laceMesh2);
    }

    // Top Lace Knot / Bow
    const knotGeo = new THREE.TorusGeometry(0.08, 0.03, 10, 20);
    const knotLeft = new THREE.Mesh(knotGeo, matLaces);
    knotLeft.rotation.y = 0.3;
    knotLeft.position.set(0.08, 0.74, 0.12);
    this.sneakerGroup.add(knotLeft);

    const knotRight = new THREE.Mesh(knotGeo, matLaces);
    knotRight.rotation.y = -0.3;
    knotRight.position.set(0.08, 0.74, -0.12);
    this.sneakerGroup.add(knotRight);

    // 8. HIGH-TOP PADDED ANKLE COLLAR (High Cut Jordan 1 Iconic Shape)
    const collarGeo = new THREE.CylinderGeometry(0.46, 0.54, 0.72, 24, 8, true);
    const collarMesh = new THREE.Mesh(collarGeo, matCollar);
    collarMesh.rotation.z = -0.12;
    collarMesh.position.set(-0.62, 0.62, 0);
    collarMesh.scale.set(1.15, 1, 0.94);
    collarMesh.castShadow = true;
    this.sneakerGroup.add(collarMesh);

    // Inner Collar Soft Lining (Black cushioned rim)
    const liningGeo = new THREE.TorusGeometry(0.44, 0.08, 12, 28);
    const liningMat = new THREE.MeshStandardMaterial({ color: 0x070709, roughness: 0.9 });
    const liningMesh = new THREE.Mesh(liningGeo, liningMat);
    liningMesh.rotation.x = Math.PI / 2;
    liningMesh.rotation.y = -0.12;
    liningMesh.position.set(-0.66, 0.95, 0);
    this.sneakerGroup.add(liningMesh);

    // Outer Collar Wings Flaps
    const wingFlapGeo = new THREE.BoxGeometry(0.55, 0.38, 0.08);
    const wingLeft = new THREE.Mesh(wingFlapGeo, matOverlay);
    wingLeft.rotation.y = 0.22;
    wingLeft.rotation.z = -0.15;
    wingLeft.position.set(-0.55, 0.68, 0.44);
    wingLeft.castShadow = true;
    this.sneakerGroup.add(wingLeft);

    const wingRight = wingLeft.clone();
    wingRight.rotation.y = -0.22;
    wingRight.position.z = -0.44;
    this.sneakerGroup.add(wingRight);

    // Wings Logo Medallion on Lateral Wing
    const wingsLogoGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20);
    const wingsLogoMat = new THREE.MeshStandardMaterial({
      color: isShadow ? 0x222222 : 0x111111,
      roughness: 0.3,
      metalness: 0.5
    });
    const wingsLogo = new THREE.Mesh(wingsLogoGeo, wingsLogoMat);
    wingsLogo.rotation.x = Math.PI / 2;
    wingsLogo.rotation.z = -0.2;
    wingsLogo.position.set(-0.52, 0.68, 0.49);
    this.sneakerGroup.add(wingsLogo);

    // 9. HEEL COUNTER & LOWER REAR WRAP
    const heelCupGeo = new THREE.SphereGeometry(0.58, 20, 16, 0, Math.PI, 0, Math.PI / 2);
    const heelCup = new THREE.Mesh(heelCupGeo, matOverlay);
    heelCup.rotation.y = -Math.PI / 2;
    heelCup.scale.set(0.9, 0.85, 0.88);
    heelCup.position.set(-0.95, -0.05, 0);
    heelCup.castShadow = true;
    this.sneakerGroup.add(heelCup);

    // Heel Spine Leather Strip
    const heelSpineGeo = new THREE.BoxGeometry(0.12, 0.92, 0.18);
    const heelSpine = new THREE.Mesh(heelSpineGeo, matOverlay);
    heelSpine.position.set(-1.42, 0.28, 0);
    this.sneakerGroup.add(heelSpine);

    // 10. DUAL 3D SCULPTED NIKE SWOOSH (Lateral & Medial)
    const createSwoosh = (isLateral) => {
      const zDir = isLateral ? 1 : -1;
      const swooshCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.55, 0.12, 0.47 * zDir),
        new THREE.Vector3(0.25, -0.04, 0.48 * zDir),
        new THREE.Vector3(-0.35, 0.05, 0.46 * zDir),
        new THREE.Vector3(-0.95, 0.32, 0.42 * zDir),
        new THREE.Vector3(-1.42, 0.44, 0.18 * zDir)
      ]);
      const swooshGeo = new THREE.TubeGeometry(swooshCurve, 32, 0.045, 12, false);
      const swooshMesh = new THREE.Mesh(swooshGeo, matSwoosh);
      swooshMesh.castShadow = true;
      return swooshMesh;
    };
    this.sneakerGroup.add(createSwoosh(true));
    this.sneakerGroup.add(createSwoosh(false));

    // 11. AIR JORDAN 4 SPECIALS (Black Cat: Triangular TPU Wings & Visible Air Window)
    if (isShadow) {
      // AJ4 TPU Lace Wing Triangles
      const tpuWingGeo = new THREE.ConeGeometry(0.24, 0.45, 3);
      const tpuMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2, metalness: 0.3 });
      
      const tpuLeft = new THREE.Mesh(tpuWingGeo, tpuMat);
      tpuLeft.rotation.z = 0.4;
      tpuLeft.rotation.y = Math.PI / 2;
      tpuLeft.position.set(-0.25, 0.42, 0.52);
      this.sneakerGroup.add(tpuLeft);

      const tpuRight = tpuLeft.clone();
      tpuRight.position.z = -0.52;
      this.sneakerGroup.add(tpuRight);

      // Quarter Netting Grids
      const netGeo = new THREE.PlaneGeometry(0.42, 0.24);
      const netMat = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.9, wireframe: true });
      const netLeft = new THREE.Mesh(netGeo, netMat);
      netLeft.position.set(-0.05, 0.12, 0.48);
      this.sneakerGroup.add(netLeft);

      const netRight = netLeft.clone();
      netRight.rotation.y = Math.PI;
      netRight.position.z = -0.48;
      this.sneakerGroup.add(netRight);

      // Visible Air-Sole Window in Heel
      const airWindowGeo = new THREE.BoxGeometry(0.48, 0.14, 0.22);
      const airWindowMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        transmission: 0.8
      });
      const airWindow = new THREE.Mesh(airWindowGeo, airWindowMat);
      airWindow.position.set(-0.85, -0.32, 0.42);
      this.sneakerGroup.add(airWindow);

      const airPillarGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.11, 12);
      const airPillarMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.5 });
      const airPillar = new THREE.Mesh(airPillarGeo, airPillarMat);
      airPillar.position.set(-0.85, -0.32, 0.42);
      this.sneakerGroup.add(airPillar);
    }

    // 12. Floating Pedestal Halo Energy Ring
    const haloGeo = new THREE.TorusGeometry(1.9, 0.018, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: 0.65
    });
    this.modelHalo = new THREE.Mesh(haloGeo, haloMat);
    this.modelHalo.rotation.x = Math.PI / 2;
    this.modelHalo.position.set(0, -0.56, 0);
    this.sneakerGroup.add(this.modelHalo);

    this.scene.add(this.sneakerGroup);

    // Update pedestal ring & rim light to match current shoe
    if (this.pedestalRing) {
      this.pedestalRing.material.color.set(themeColor);
    }
    if (this.lights.rim) {
      this.lights.rim.color.set(themeColor);
    }
  }

  setShoe(shoeId) {
    this.currentShoeId = shoeId;
    this.buildSneakerModel(shoeId);
    if (window.soundEngine) window.soundEngine.playSwitch();
  }

  setMode(mode) {
    this.currentMode = mode;
    if (!this.sneakerGroup) return;

    this.sneakerGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        if (mode === 'wireframe') {
          child.material.wireframe = true;
          child.material.emissive = new THREE.Color(0x38bdf8);
          child.material.emissiveIntensity = 0.5;
        } else if (mode === 'hologram') {
          child.material.wireframe = false;
          child.material.emissive = new THREE.Color(0x00ffcc);
          child.material.emissiveIntensity = 0.8;
          child.material.transparent = true;
          child.material.opacity = 0.75;
        } else if (mode === 'xray') {
          child.material.wireframe = false;
          child.material.transparent = true;
          child.material.opacity = 0.35;
          child.material.emissive = new THREE.Color(0xa855f7);
          child.material.emissiveIntensity = 0.4;
        } else {
          // realistic
          child.material.wireframe = false;
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
          child.material.opacity = 1;
        }
      }
    });

    if (window.soundEngine) window.soundEngine.playClick();
  }

  setLightingPreset(preset) {
    this.currentLighting = preset;
    if (preset === 'cyberpunk') {
      this.lights.keySpot.color.setHex(0x00ffff);
      this.lights.fill.color.setHex(0xff00ff);
      this.lights.rim.color.setHex(0x9900ff);
      this.renderer.toneMappingExposure = 1.35;
    } else if (preset === 'chicago') {
      this.lights.keySpot.color.setHex(0xff3333);
      this.lights.fill.color.setHex(0x111111);
      this.lights.rim.color.setHex(0xdc2626);
      this.renderer.toneMappingExposure = 1.25;
    } else if (preset === 'gold') {
      this.lights.keySpot.color.setHex(0xffd700);
      this.lights.fill.color.setHex(0xff8c00);
      this.lights.rim.color.setHex(0xffaa00);
      this.renderer.toneMappingExposure = 1.3;
    } else {
      // studio
      this.lights.keySpot.color.setHex(0xffffff);
      this.lights.fill.color.setHex(0x38bdf8);
      const shoeData = SNEAKERS_DB[this.currentShoeId] || SNEAKERS_DB['chicago'];
      this.lights.rim.color.set(shoeData.theme);
      this.renderer.toneMappingExposure = 1.15;
    }
    if (window.soundEngine) window.soundEngine.playSwitch();
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    if (this.controls) {
      this.controls.autoRotate = this.isAutoRotating;
    }
    return this.isAutoRotating;
  }

  resetCamera() {
    if (this.camera && this.controls) {
      this.camera.position.set(0, 1.2, 5.2);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
  }

  captureSnapshot() {
    if (!this.renderer) return;
    this.renderer.render(this.scene, this.camera);
    const dataURL = this.renderer.domElement.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `AETHER-3D-${this.currentShoeId.toUpperCase()}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    if (window.soundEngine) window.soundEngine.playSuccess();
    showToast('4K 3D Snapshot Downloaded!');
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Gentle float wave in 3D space
    if (this.sneakerGroup) {
      this.sneakerGroup.position.y = 0.15 + Math.sin(time * 1.8) * 0.08;
      if (this.modelHalo) {
        this.modelHalo.rotation.z += 0.01;
        this.modelHalo.rotation.x = Math.sin(time) * 0.3;
      }
    }

    // Shadow expansion synced with levitation
    if (this.shadowPlane && this.sneakerGroup) {
      const lev = (this.sneakerGroup.position.y - 0.15) / 0.08; // -1 to 1
      this.shadowPlane.scale.set(1 - lev * 0.15, 1 - lev * 0.15, 1);
      this.shadowPlane.material.opacity = 0.55 - lev * 0.15;
    }

    // Floating particles drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.04;
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

window.sneaker3DStudio = new Sneaker3DStudio();
