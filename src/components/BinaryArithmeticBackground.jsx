import React, { useEffect, useRef } from 'react';

// Comprehensive Syntax Snippets across 7 modern software engineering stacks
const CODE_SNIPPET_CATEGORIES = {
  reactFrontend: [
    "const { data, isLoading } = useQuery(['projects'], fetchProjects);",
    "<Suspense fallback={<SkeletonLoader />}>",
    "const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);",
    "export default function AsyncBoundary({ children }) { return <ErrorBoundary>{children}</ErrorBoundary>; }",
    "const [state, dispatch] = useReducer(engineReducer, initialWorkspaceState);",
    "const debouncedSearch = useDebounceCallback((q: string) => setSearchTerm(q), 300);",
    "const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });",
    "const canvasRef = useRef<HTMLCanvasElement | null>(null);",
    "const transition = useTransitionState({ timeout: 450 });",
    "<AnimatePresence mode='wait'>{children}</AnimatePresence>"
  ],
  typescriptInterfaces: [
    "type EngineConfig<T> = { id: string; payload: T; active: boolean; };",
    "interface SystemArchitecture extends BaseCluster { nodes: ClusterNode[]; }",
    "export type Nullable<T> = T | null | undefined;",
    "type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };",
    "type AsyncResult<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };",
    "export interface MetricsPayload { latencyMs: number; p99: number; throughput: number; }",
    "type InferPayload<T> = T extends Action<infer P> ? P : never;",
    "interface VectorEmbedding { vector: Float32Array; dimensions: 1536; }"
  ],
  nodeBackend: [
    "app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));",
    "const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });",
    "async function executePipeline(queue: Task[]): Promise<Result>",
    "const redis = new Redis({ host: process.env.REDIS_HOST, port: 6379, lazyConnect: true });",
    "fastify.register(cors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });",
    "const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');",
    "await prisma.workspace.findUnique({ where: { slug }, include: { deployments: true } });",
    "eventEmitter.emit('cluster:node_spawned', { nodeId, timestamp: Date.now() });"
  ],
  pythonDataAI: [
    '@app.post("/api/v1/predict") async def generate_embedding(payload: VectorInput):',
    "df['normalized_score'] = df['metric'].apply(lambda x: np.log1p(x))",
    'transformer = AutoModelForCausalLM.from_pretrained("verity/core-v1")',
    "embeddings = torch.nn.functional.normalize(model.encode(texts), p=2, dim=1)",
    "pipeline = Pipeline([('scaler', StandardScaler()), ('classifier', GradientBoosting())])",
    "async with aiohttp.ClientSession() as session: async with session.post(infer_url, json=data) as resp:",
    "dataset = load_dataset('json', data_files='train_telemetry.jsonl')",
    "optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)"
  ],
  databaseQueries: [
    "SELECT p.id, p.title, c.name FROM projects p JOIN categories c ON p.cat_id = c.id WHERE p.status = 'active';",
    "db.collection('analytics').doc(id).set({ timestamp: FieldValue.serverTimestamp() }, { merge: true });",
    "CREATE INDEX CONCURRENTLY idx_projects_slug_status ON projects (slug, status) WHERE is_deleted = false;",
    "await prisma.deployment.findMany({ where: { status: 'HEALTHY' }, orderBy: { deployedAt: 'desc' } });",
    "EXPLAIN ANALYZE SELECT * FROM telemetry_events WHERE timestamp > NOW() - INTERVAL '24 hours';",
    "INSERT INTO cluster_logs (cluster_id, level, payload) VALUES ($1, $2, $3) RETURNING id;"
  ],
  devopsCloud: [
    "FROM node:20-alpine AS builder WORKDIR /app RUN npm ci --omit=dev",
    "version: '3.8' services: web: build: . ports: - \"3000:3000\"",
    "kubectl apply -f ./k8s/deployment.yaml --namespace=production",
    "docker run -d --restart=unless-stopped -p 8080:8080 --name core-api-gateway",
    "terraform init && terraform apply -auto-approve -var-file=prod.tfvars",
    "ingress: hosts: - host: verity-ground.internal paths: - path: / http: paths: [{ backend: { service: { name: web-svc } } }]",
    "ARG NODE_ENV=production ENV NODE_ENV=${NODE_ENV}"
  ],
  cssTailwindAnimation: [
    "@keyframes streamDrift { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }",
    "grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));",
    "backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);",
    "transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);",
    "box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.8);",
    "@media (prefers-reduced-motion: reduce) { animation: none; }"
  ]
};

// Flatten all snippets into master array
const ALL_SNIPPETS = Object.values(CODE_SNIPPET_CATEGORIES).flat();

// Shuffle utility (Fisher-Yates)
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function BinaryArithmeticBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    // Track cursor for subtle ambient interactive glow
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Track scroll for parallax drift across the full page (from Hero to Contact)
    let scrollY = window.scrollY || window.pageYOffset || 0;
    let targetScrollY = scrollY;

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let columns = [];

    const initColumns = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Adaptive column count and spacing across screen widths
      const colWidth = width > 1600 ? 380 : width > 1200 ? 350 : width > 768 ? 320 : 280;
      const numCols = Math.max(2, Math.ceil(width / colWidth) + 1);

      columns = [];

      for (let c = 0; c < numCols; c++) {
        // Varying drift velocities for multi-speed parallax
        // Direction alternates: upwards and downwards
        const baseSpeed = 0.22 + (c % 4) * 0.08 + Math.random() * 0.05;
        const direction = c % 2 === 0 ? -1 : 1;
        const scrollFactor = 0.08 + (c % 3) * 0.04;

        // Dedicated randomized snippet pool for this column
        const pool = shuffleArray(ALL_SNIPPETS);
        const itemSpacing = 68; // Vertical distance between snippets
        const totalItemsInCol = Math.ceil((height + 300) / itemSpacing) + 3;

        const items = [];
        for (let i = 0; i < totalItemsInCol; i++) {
          const snippetText = pool[i % pool.length];
          items.push({
            text: snippetText,
            y: (i * itemSpacing) - 80,
            baseAlpha: 0.05 + Math.random() * 0.035, // Soft faint opacity: 0.05 - 0.085
            snippetIndex: i % pool.length
          });
        }

        columns.push({
          x: c * colWidth + 18,
          speed: baseSpeed * direction,
          scrollFactor,
          items,
          itemSpacing,
          pool,
          colWidth
        });
      }
    };

    initColumns();

    const handleResize = () => {
      initColumns();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Smooth render loop (60fps)
    const render = () => {
      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Clean developer monospace font
      ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
      ctx.textBaseline = 'middle';

      for (let c = 0; c < columns.length; c++) {
        const col = columns[c];

        for (let i = 0; i < col.items.length; i++) {
          const item = col.items[i];

          // Advance continuous drift
          item.y += col.speed;

          // Parallax effect from page scrolling (flowing from Hero down to Contact)
          const effectiveY = item.y - (scrollY * col.scrollFactor) % (height + 200);

          // Wrap boundaries and assign a newly randomized snippet upon wrap
          if (col.speed > 0 && effectiveY > height + 80) {
            item.y = -100 + (scrollY * col.scrollFactor) % (height + 200);
            item.snippetIndex = (item.snippetIndex + col.items.length + Math.floor(Math.random() * 7) + 1) % col.pool.length;
            item.text = col.pool[item.snippetIndex];
          } else if (col.speed < 0 && effectiveY < -120) {
            item.y = height + 60 + (scrollY * col.scrollFactor) % (height + 200);
            item.snippetIndex = (item.snippetIndex + col.items.length + Math.floor(Math.random() * 7) + 1) % col.pool.length;
            item.text = col.pool[item.snippetIndex];
          }

          // Subtle interaction with mouse spotlight
          const dx = col.x - mouse.x;
          const dy = effectiveY - mouse.y;
          const dist = Math.hypot(dx, dy);
          const mouseGlow = dist < 220 ? (1 - dist / 220) * 0.09 : 0;

          // Compute final alpha (faint & soft, non-distracting)
          const finalAlpha = Math.min(item.baseAlpha + mouseGlow, 0.14);

          // Render code snippet line
          ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
          ctx.fillText(item.text, col.x, effectiveY);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 bg-transparent"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0.3) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0.3) 100%)'
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
