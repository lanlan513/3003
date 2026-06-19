import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ZoomIn, ZoomOut, Move, RotateCcw, Network, ArrowRight, Sparkles } from 'lucide-react';
import { knowledgeGraphData, graphNodeTypeLabels, graphNodeTypeColors, recommendPaths } from '@/data/knowledgeGraph';
import type { GraphNode, GraphRelation, GraphNodePosition, DetailData, GraphNodeType } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

export default function KnowledgeGraph({ onOpenDetail }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[] | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<GraphNodeType>>(
    new Set(['dynasty', 'kiln', 'craft', 'pattern', 'shape', 'glaze'])
  );
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const positions = useRef<Map<string, GraphNodePosition>>(new Map());
  const nodes = knowledgeGraphData.nodes;
  const relations = knowledgeGraphData.relations;

  const filteredNodes = useMemo(
    () => nodes.filter((n) => activeFilters.has(n.type)),
    [nodes, activeFilters]
  );

  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  );

  const filteredRelations = useMemo(
    () =>
      relations.filter(
        (r) => filteredNodeIds.has(r.source) && filteredNodeIds.has(r.target)
      ),
    [relations, filteredNodeIds]
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const initializePositions = useCallback(() => {
    const cx = containerSize.width / 2;
    const cy = containerSize.height / 2;
    const typeOrder: GraphNodeType[] = ['dynasty', 'kiln', 'craft', 'pattern', 'shape', 'glaze'];
    const rings: Record<GraphNodeType, number> = {
      dynasty: 80,
      kiln: 180,
      craft: 280,
      pattern: 360,
      shape: 360,
      glaze: 360,
    };

    const countsByType: Record<string, number> = {};
    const indexByType: Record<string, number> = {};

    nodes.forEach((n) => {
      countsByType[n.type] = (countsByType[n.type] || 0) + 1;
    });

    nodes.forEach((n) => {
      const typeIdx = typeOrder.indexOf(n.type);
      const count = countsByType[n.type] || 1;
      indexByType[n.type] = indexByType[n.type] || 0;
      const idx = indexByType[n.type]++;

      const baseAngle = (typeIdx / typeOrder.length) * Math.PI * 2 - Math.PI / 2;
      const angleSpread = (Math.PI * 2) / typeOrder.length * 0.8;
      const angle = baseAngle + (idx / Math.max(count - 1, 1) - 0.5) * angleSpread;
      const radius = rings[n.type];

      positions.current.set(n.id, {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      });
    });
  }, [nodes, containerSize]);

  useEffect(() => {
    initializePositions();
  }, [initializePositions]);

  const simulateTick = useCallback(() => {
    const cx = containerSize.width / 2;
    const cy = containerSize.height / 2;
    const iterations = 5;

    for (let iter = 0; iter < iterations; iter++) {
      filteredNodes.forEach((node) => {
        const pos = positions.current.get(node.id);
        if (!pos || draggingNode === node.id) return;

        const dx = cx - pos.x;
        const dy = cy - pos.y;
        pos.vx += dx * 0.001;
        pos.vy += dy * 0.001;

        pos.vx *= 0.9;
        pos.vy *= 0.9;

        pos.x += pos.vx;
        pos.y += pos.vy;
      });

      for (let i = 0; i < filteredNodes.length; i++) {
        for (let j = i + 1; j < filteredNodes.length; j++) {
          const a = positions.current.get(filteredNodes[i].id);
          const b = positions.current.get(filteredNodes[j].id);
          if (!a || !b) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = 100;

          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.5;
            const fx = dx * force;
            const fy = dy * force;
            if (draggingNode !== filteredNodes[i].id) {
              a.x -= fx;
              a.y -= fy;
            }
            if (draggingNode !== filteredNodes[j].id) {
              b.x += fx;
              b.y += fy;
            }
          }
        }
      }

      filteredRelations.forEach((rel) => {
        const a = positions.current.get(rel.source);
        const b = positions.current.get(rel.target);
        if (!a || !b) return;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 140;
        const force = (dist - targetDist) / dist * 0.02;

        if (draggingNode !== rel.source) {
          a.x += dx * force;
          a.y += dy * force;
        }
        if (draggingNode !== rel.target) {
          b.x -= dx * force;
          b.y -= dy * force;
        }
      });
    }
  }, [filteredNodes, filteredRelations, containerSize, draggingNode]);

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      simulateTick();
      forceUpdate((x) => x + 1);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [simulateTick]);

  const getNodeById = (id: string): GraphNode | undefined =>
    nodes.find((n) => n.id === id);

  const getRelatedNodeIds = (nodeId: string): Set<string> => {
    const related = new Set<string>();
    related.add(nodeId);
    filteredRelations.forEach((r) => {
      if (r.source === nodeId) related.add(r.target);
      if (r.target === nodeId) related.add(r.source);
    });
    return related;
  };

  const isRelationHighlighted = (rel: GraphRelation): boolean => {
    if (highlightedPath) {
      for (let i = 0; i < highlightedPath.length - 1; i++) {
        const a = highlightedPath[i];
        const b = highlightedPath[i + 1];
        if (
          (rel.source === a && rel.target === b) ||
          (rel.source === b && rel.target === a)
        ) {
          return true;
        }
      }
      return false;
    }
    if (selectedNode) {
      return (
        rel.source === selectedNode || rel.target === selectedNode
      );
    }
    if (hoveredNode) {
      return (
        rel.source === hoveredNode || rel.target === hoveredNode
      );
    }
    return false;
  };

  const isNodeHighlighted = (nodeId: string): boolean => {
    if (highlightedPath) {
      return highlightedPath.includes(nodeId);
    }
    if (selectedNode) {
      return getRelatedNodeIds(selectedNode).has(nodeId);
    }
    if (hoveredNode) {
      return getRelatedNodeIds(hoveredNode).has(nodeId);
    }
    return true;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(3, Math.max(0.3, transform.scale * delta));

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - transform.x) / transform.scale;
      const worldY = (mouseY - transform.y) / transform.scale;

      setTransform({
        scale: newScale,
        x: mouseX - worldX * newScale,
        y: mouseY - worldY * newScale,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggingNode) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - transform.x) / transform.scale;
      const y = (e.clientY - rect.top - transform.y) / transform.scale;
      const pos = positions.current.get(draggingNode);
      if (pos) {
        pos.x = x;
        pos.y = y;
        pos.vx = 0;
        pos.vy = 0;
      }
    } else if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNode(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
  };

  const handleNodeClick = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    if (draggingNode) return;

    setSelectedNode(node.id === selectedNode ? null : node.id);
    setHighlightedPath(null);
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    onOpenDetail({
      type: 'graph-node',
      id: node.id,
      title: node.name,
      subtitle: graphNodeTypeLabels[node.type],
      description: node.description,
      sections: node.details ? [{ title: '核心要点', content: node.details }] : [],
      color: node.color,
      bgColor: node.bgColor,
      imagePrompt: `Chinese porcelain ${node.name}, ${node.description}, museum quality, warm lighting`,
    });
  };

  const zoom = (factor: number) => {
    setTransform((prev) => {
      const newScale = Math.min(3, Math.max(0.3, prev.scale * factor));
      const cx = containerSize.width / 2;
      const cy = containerSize.height / 2;
      const worldX = (cx - prev.x) / prev.scale;
      const worldY = (cy - prev.y) / prev.scale;
      return {
        scale: newScale,
        x: cx - worldX * newScale,
        y: cy - worldY * newScale,
      };
    });
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
    setSelectedNode(null);
    setHoveredNode(null);
    setHighlightedPath(null);
    initializePositions();
  };

  const toggleFilter = (type: GraphNodeType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handlePathSelect = (path: typeof recommendPaths[0]) => {
    setHighlightedPath(path.nodes);
    setSelectedNode(null);

    const validNodes = path.nodes.filter((id) => positions.current.has(id));
    if (validNodes.length > 0 && svgRef.current) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      validNodes.forEach((id) => {
        const pos = positions.current.get(id)!;
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y);
      });

      const padding = 80;
      const graphWidth = maxX - minX + padding * 2;
      const graphHeight = maxY - minY + padding * 2;
      const scaleX = containerSize.width / graphWidth;
      const scaleY = containerSize.height / graphHeight;
      const scale = Math.min(scaleX, scaleY, 1.5);

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      setTransform({
        scale,
        x: containerSize.width / 2 - cx * scale,
        y: containerSize.height / 2 - cy * scale,
      });
    }
  };

  const selectedNodeData = selectedNode ? getNodeById(selectedNode) : null;
  const selectedRelations = selectedNode
    ? filteredRelations.filter(
        (r) => r.source === selectedNode || r.target === selectedNode
      )
    : [];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(graphNodeTypeLabels) as GraphNodeType[]).map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilters.has(type)
                  ? 'text-white shadow-md'
                  : 'bg-porcelain-paper text-porcelain-inkbrown/50 hover:text-porcelain-inkbrown border border-porcelain-crackle/40'
              }`}
              style={{
                backgroundColor: activeFilters.has(type)
                  ? graphNodeTypeColors[type]
                  : undefined,
              }}
            >
              {graphNodeTypeLabels[type]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-porcelain-paper/80 rounded-lg p-1 border border-porcelain-crackle/40">
          <button
            onClick={() => zoom(1.2)}
            className="p-2 rounded-md hover:bg-porcelain-scroll/60 text-porcelain-inkbrown/70 hover:text-porcelain-inkbrown transition-colors"
            title="放大"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => zoom(0.8)}
            className="p-2 rounded-md hover:bg-porcelain-scroll/60 text-porcelain-inkbrown/70 hover:text-porcelain-inkbrown transition-colors"
            title="缩小"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-md hover:bg-porcelain-scroll/60 text-porcelain-inkbrown/70 hover:text-porcelain-inkbrown transition-colors"
            title="重置视图"
          >
            <RotateCcw size={16} />
          </button>
          <div className="w-px h-5 bg-porcelain-crackle/50 mx-1" />
          <div className="flex items-center gap-1 px-2 text-xs text-porcelain-inkbrown/60">
            <Move size={14} />
            <span>{Math.round(transform.scale * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div
          ref={containerRef}
          className="flex-1 relative rounded-2xl border border-porcelain-crackle/40 bg-gradient-to-br from-porcelain-paper via-porcelain-scroll/30 to-porcelain-paper overflow-hidden shadow-porcelain"
          style={{ height: '560px', minHeight: '400px' }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(61,43,31,0.08) 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />

          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#C9A962" opacity="0.6" />
              </marker>
            </defs>

            <g
              transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
            >
              {filteredRelations.map((rel) => {
                const a = positions.current.get(rel.source);
                const b = positions.current.get(rel.target);
                if (!a || !b) return null;

                const highlighted = isRelationHighlighted(rel);
                const isDim =
                  (selectedNode || hoveredNode || highlightedPath) && !highlighted;

                const midX = (a.x + b.x) / 2;
                const midY = (a.y + b.y) / 2;

                return (
                  <g key={rel.id}>
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={highlighted ? rel.type === 'succeeded' || rel.type === 'influenced' ? '#C9A962' : '#A83232' : '#D4C8A8'}
                      strokeWidth={highlighted ? 2.5 : 1}
                      strokeOpacity={isDim ? 0.15 : highlighted ? 0.9 : 0.4}
                      strokeDasharray={
                        rel.type === 'influenced' || rel.type === 'succeeded' ? '6 4' : undefined
                      }
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    {highlighted && transform.scale > 0.6 && (
                      <g>
                        <rect
                          x={midX - 30}
                          y={midY - 10}
                          width={60}
                          height={20}
                          rx={10}
                          fill="#FAF7F0"
                          stroke={rel.type === 'succeeded' || rel.type === 'influenced' ? '#C9A962' : '#A83232'}
                          strokeOpacity={0.3}
                          strokeWidth={0.5}
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          textAnchor="middle"
                          fontSize={10}
                          fill="#3D2B1F"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          {rel.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {filteredNodes.map((node) => {
                const pos = positions.current.get(node.id);
                if (!pos) return null;

                const isSelected = selectedNode === node.id;
                const isHovered = hoveredNode === node.id;
                const highlighted = isNodeHighlighted(node.id);
                const isDim =
                  (selectedNode || hoveredNode || highlightedPath) && !highlighted;
                const onPath = highlightedPath?.includes(node.id);
                const pathIndex = highlightedPath?.indexOf(node.id);

                const nodeRadius = isSelected || isHovered ? 34 : onPath ? 32 : 28;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={(e) => handleNodeClick(e, node)}
                    onDoubleClick={(e) => handleNodeDoubleClick(e, node)}
                    opacity={isDim ? 0.25 : 1}
                  >
                    {(isSelected || onPath) && (
                      <circle
                        r={nodeRadius + 8}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        opacity={0.6}
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0"
                          to="360"
                          dur="12s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {isHovered && !isSelected && (
                      <circle
                        r={nodeRadius + 4}
                        fill={node.color}
                        opacity={0.15}
                        filter="url(#glow)"
                      />
                    )}

                    <circle
                      r={nodeRadius}
                      fill={node.bgColor}
                      stroke={node.color}
                      strokeWidth={isSelected ? 3 : onPath ? 2.5 : 1.5}
                      filter={isSelected || onPath ? 'url(#glow)' : undefined}
                    />

                    {onPath && pathIndex !== undefined && (
                      <circle
                        r={12}
                        cx={nodeRadius - 6}
                        cy={-nodeRadius + 6}
                        fill="#C9A962"
                        stroke="#FAF7F0"
                        strokeWidth={2}
                      />
                    )}
                    {onPath && pathIndex !== undefined && (
                      <text
                        x={nodeRadius - 6}
                        y={-nodeRadius + 10}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight="bold"
                        fill="#FAF7F0"
                      >
                        {pathIndex + 1}
                      </text>
                    )}

                    <text
                      y={-nodeRadius - 8}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight="600"
                      fill={isSelected || onPath ? node.color : '#3D2B1F'}
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      {node.name}
                    </text>

                    <text
                      y={4}
                      textAnchor="middle"
                      fontSize={10}
                      fill={node.color}
                      opacity={0.8}
                    >
                      {graphNodeTypeLabels[node.type]}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-porcelain-paper/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-porcelain-crackle/40">
            <Network size={14} className="text-porcelain-gold" />
            <span className="text-xs text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              {filteredNodes.length} 节点 · {filteredRelations.length} 关系 · 拖拽平移 · 滚轮缩放 · 双击查看详情
            </span>
          </div>
        </div>

        <div className="lg:w-72 flex flex-col gap-4">
          {selectedNodeData ? (
            <div className="bg-porcelain-scroll/40 rounded-2xl p-5 border border-porcelain-crackle/40 shadow-porcelain animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                  style={{ backgroundColor: selectedNodeData.color }}
                >
                  {graphNodeTypeLabels[selectedNodeData.type]?.[0]}
                </div>
                <div>
                  <h4
                    className="font-serif text-lg font-bold text-porcelain-inkbrown"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    {selectedNodeData.name}
                  </h4>
                  <span className="text-xs" style={{ color: selectedNodeData.color }}>
                    {graphNodeTypeLabels[selectedNodeData.type]}
                  </span>
                </div>
              </div>

              <p
                className="text-sm text-porcelain-inkbrown/75 leading-relaxed mb-4"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {selectedNodeData.description}
              </p>

              {selectedRelations.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-porcelain-inkbrown/60 mb-2 flex items-center gap-1">
                    <ArrowRight size={12} />
                    关联知识（{selectedRelations.length}）
                  </h5>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {selectedRelations.map((rel) => {
                      const targetId =
                        rel.source === selectedNode ? rel.target : rel.source;
                      const target = getNodeById(targetId);
                      if (!target) return null;
                      return (
                        <button
                          key={rel.id}
                          onClick={() => {
                            setSelectedNode(targetId);
                            const pos = positions.current.get(targetId);
                            if (pos && svgRef.current) {
                              setTransform((prev) => ({
                                scale: Math.max(prev.scale, 1.2),
                                x: containerSize.width / 2 - pos.x * Math.max(prev.scale, 1.2),
                                y: containerSize.height / 2 - pos.y * Math.max(prev.scale, 1.2),
                              }));
                            }
                          }}
                          className="group px-2 py-1 rounded-md text-xs flex items-center gap-1 transition-all hover:scale-105"
                          style={{
                            backgroundColor: target.bgColor,
                            color: target.color,
                            border: `1px solid ${target.color}30`,
                          }}
                        >
                          <span className="font-medium">{target.name}</span>
                          <span className="text-[10px] opacity-70">
                            {rel.source === selectedNode ? '→' : '←'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-porcelain-scroll/40 rounded-2xl p-5 border border-porcelain-crackle/40">
              <h4
                className="font-serif text-base font-bold text-porcelain-inkbrown mb-2 flex items-center gap-2"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <Sparkles size={16} className="text-porcelain-gold" />
                知识图谱探索
              </h4>
              <p
                className="text-sm text-porcelain-inkbrown/70 leading-relaxed"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                点击任意节点可查看关联知识网络，双击可查看详细信息。拖拽节点可调整位置，滚轮缩放视图。
              </p>
            </div>
          )}

          <div className="bg-porcelain-scroll/40 rounded-2xl p-5 border border-porcelain-crackle/40">
            <h4
              className="font-serif text-base font-bold text-porcelain-inkbrown mb-3"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              探索路径推荐
            </h4>
            <div className="flex flex-col gap-2">
              {recommendPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handlePathSelect(path)}
                  className={`text-left p-3 rounded-xl transition-all border ${
                    highlightedPath === path.nodes
                      ? 'bg-porcelain-gold/15 border-porcelain-gold/50 shadow-md'
                      : 'bg-porcelain-paper/60 border-porcelain-crackle/30 hover:border-porcelain-gold/40 hover:bg-porcelain-paper'
                  }`}
                >
                  <div className="font-serif text-sm font-bold text-porcelain-inkbrown mb-0.5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {path.name}
                  </div>
                  <div className="text-[11px] text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {path.description}
                  </div>
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    {path.nodes.map((nid, i) => {
                      const n = getNodeById(nid);
                      if (!n) return null;
                      return (
                        <span key={nid} className="flex items-center gap-1">
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold"
                            style={{ backgroundColor: n.color }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[10px] text-porcelain-inkbrown/70">
                            {n.name}
                          </span>
                          {i < path.nodes.length - 1 && (
                            <ArrowRight size={10} className="text-porcelain-gold/60" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
