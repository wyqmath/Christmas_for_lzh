// 在代码开头或其它合适位置添加一个公共的 3D→2D 投影函数：
function project3D(x, y, z, angle, fov = 600) {
    // 绕 Y 轴旋转
    const zRot = z * Math.cos(angle) - x * Math.sin(angle);
    const xRot = z * Math.sin(angle) + x * Math.cos(angle);
    const yRot = y;

    // 透视投影
    const scale = fov / (fov - zRot);
    const Xscreen = xRot * scale;
    const Yscreen = yRot * scale;

    return { x: Xscreen, y: Yscreen, z: zRot };
}

/**
 * 绘制多边形辅助函数：
 * points: 多边形顶点的 3D 坐标数组 [{x, y, z}, ...]
 * fillStyle: 填充样式
 * angle: 当前旋转角度
 */
function draw3DPolygon(ctx, points, fillStyle, angle) {
    ctx.beginPath();
    // 将 3D 顶点投影到 2D
    const projected = points.map(p => project3D(p.x, p.y, p.z, angle));
    // 路径
    ctx.moveTo(projected[0].x, projected[0].y);
    for (let i = 1; i < projected.length; i++) {
        ctx.lineTo(projected[i].x, projected[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
}

/**
 * 绘制一个三棱柱(用于模拟立体树叶)
 * prismPoints 是一个对象，包含 frontA, frontB, frontC, backA, backB, backC 六个key，
 * 每个 key 包含 {x, y, z}
 * 其中：
 *  - frontA, frontB, frontC 构成前三角形
 *  - backA,  backB,  backC  构成后三角形
 */
function draw3DPrism(ctx, prismPoints, angle) {
    const {
        frontA, frontB, frontC,
        backA,  backB,  backC
    } = prismPoints;

    // (1) 前三角面
    draw3DPolygon(ctx, [frontA, frontB, frontC], '#0D500D', angle);
    // (2) 后三角面
    draw3DPolygon(ctx, [backA, backB, backC], '#0A3A0A', angle);

    // (3) 侧面 A：frontA -> backA -> backB -> frontB
    draw3DPolygon(ctx, [frontA, backA, backB, frontB], '#0C6B0C', angle);
    // (4) 侧面 B：frontB -> backB -> backC -> frontC
    draw3DPolygon(ctx, [frontB, backB, backC, frontC], '#0C6B0C', angle);
    // (5) 侧面 C：frontC -> backC -> backA -> frontA
    draw3DPolygon(ctx, [frontC, backC, backA, frontA], '#0C6B0C', angle);
}

/**
 * 绘制 3D 圆（用于球状装饰或星星），保持不变
 */
function draw3DCircle(ctx, x, y, z, r, color, angle) {
    const p = project3D(x, y, z, angle);
    ctx.beginPath();
    // 用投影后的z去计算缩放
    ctx.arc(p.x, p.y, Math.abs(r * (600 / (600 - p.z))), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

// 添加五角星绘制函数
function drawStar(ctx, x, y, z, size, color, angle) {
    const points = [];
    const innerRadius = size * 0.4;
    
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? size : innerRadius;
        const theta = (i * Math.PI) / 5;
        points.push({
            x: x + radius * Math.cos(theta),
            y: y + radius * Math.sin(theta),
            z: z
        });
    }
    
    draw3DPolygon(ctx, points, color, angle);
}

document.addEventListener('DOMContentLoaded', () => {
    const snowflakesContainer = document.getElementById('snowflakes');
    const canvas = document.getElementById('christmas-tree-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 3D旋转相关变量
    let angle = 0; 
    const rotationSpeed = 0.006; 

    // 圣诞树基本参数
    const trunkWidth = 40;
    const trunkHeight = 180;
    const layers = 6;
    const maxWidth = 280;
    const layerHeight = 55;
    const ornamentsPerLayer = 6;

    // 预先生成装饰球数据
    const ornaments = [];
    function initOrnaments() {
        const ornamentColors = [
            '#FF5733', '#33FF57', '#3357FF', '#F333FF',
            '#FF33A8', '#33FFF5', '#FFFF33', '#FFA500'
        ];
        for (let i = 0; i < layers; i++) {
            for (let j = 0; j < ornamentsPerLayer; j++) {
                const radius = 4 + Math.random() * 4;
                // 使球的X坐标在[-layerWidth/2, layerWidth/2]左右，略随机
                const currentWidth = maxWidth - i * (maxWidth / layers);
                const x = Math.random() * currentWidth - currentWidth / 2;
                const yOffset = Math.random() * layerHeight * 0.8;
                const color = ornamentColors[Math.floor(Math.random() * ornamentColors.length)];
                ornaments.push({
                    layerIndex: i,
                    x,
                    yOffset,
                    radius,
                    color
                });
            }
        }
    }
    initOrnaments();

    // 绘制圣诞树函数（3D 改造）
    function drawChristmasTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // 将原点移到屏幕中央偏下，以便模拟在画布上的中心
        ctx.translate(canvas.width / 2, canvas.height * 0.78);

        // ----------------
        // 1. 绘制树干(简单做一个矩形或棱柱)
        // ----------------
        const trunkTopY = -trunkHeight;
        const trunkPoints = {
            // 前面的四个点
            frontPoints: [
                { x: -trunkWidth/2, y: trunkTopY, z: -20 },  // 左上
                { x: trunkWidth/2,  y: trunkTopY, z: -20 },  // 右上
                { x: trunkWidth/2,  y: 0,         z: -20 },  // 右下
                { x: -trunkWidth/2, y: 0,         z: -20 }   // 左下
            ],
            // 后面的四个点
            backPoints: [
                { x: -trunkWidth/2, y: trunkTopY, z: -35 },  // 左上
                { x: trunkWidth/2,  y: trunkTopY, z: -35 },  // 右上
                { x: trunkWidth/2,  y: 0,         z: -35 },  // 右下
                { x: -trunkWidth/2, y: 0,         z: -35 }   // 左下
            ]
        };

        // 绘制树干的六个面
        // 前面
        draw3DPolygon(ctx, trunkPoints.frontPoints, '#8B4513', angle);
        // 后面
        draw3DPolygon(ctx, trunkPoints.backPoints, '#5D3A1A', angle);
        // 上面
        draw3DPolygon(ctx, [
            trunkPoints.frontPoints[0],
            trunkPoints.frontPoints[1],
            trunkPoints.backPoints[1],
            trunkPoints.backPoints[0]
        ], '#6B3E11', angle);
        // 下面
        draw3DPolygon(ctx, [
            trunkPoints.frontPoints[2],
            trunkPoints.frontPoints[3],
            trunkPoints.backPoints[3],
            trunkPoints.backPoints[2]
        ], '#6B3E11', angle);
        // 左面
        draw3DPolygon(ctx, [
            trunkPoints.frontPoints[0],
            trunkPoints.frontPoints[3],
            trunkPoints.backPoints[3],
            trunkPoints.backPoints[0]
        ], '#724214', angle);
        // 右面
        draw3DPolygon(ctx, [
            trunkPoints.frontPoints[1],
            trunkPoints.frontPoints[2],
            trunkPoints.backPoints[2],
            trunkPoints.backPoints[1]
        ], '#724214', angle);

        // ----------------
        // 2. 绘制每层树叶（三棱柱）
        // ----------------
        for (let i = 0; i < layers; i++) {
            const currentWidth = maxWidth - i * (maxWidth / layers);
            // 定义前三角 (zFront)
            const zFront = -20; // 前面较靠近观察者
            const frontA = {
                x: 0,
                y: -trunkHeight - i * layerHeight - layerHeight,
                z: zFront
            };
            const frontB = {
                x: -currentWidth / 2,
                y: -trunkHeight - i * layerHeight,
                z: zFront
            };
            const frontC = {
                x: currentWidth / 2,
                y: -trunkHeight - i * layerHeight,
                z: zFront
            };
            // 定义后三角 (zBack)
            // 深一点(距离更远), 如 zBack = zFront - 15
            // 使树叶有厚度
            const zBack = -35;
            const backA = {
                x: frontA.x,
                y: frontA.y,
                z: zBack
            };
            const backB = {
                x: frontB.x,
                y: frontB.y,
                z: zBack
            };
            const backC = {
                x: frontC.x,
                y: frontC.y,
                z: zBack
            };

            // 绘制三棱柱
            draw3DPrism(ctx, {
                frontA, frontB, frontC,
                backA, backB, backC
            }, angle);
        }

        // ----------------
        // 3. 绘制装饰球
        // ----------------
        for (const ornament of ornaments) {
            const layerIndex = ornament.layerIndex;
            const layerTop = -trunkHeight - layerIndex * layerHeight;
            const y = layerTop + layerHeight - ornament.yOffset;
            // 给饰品随机一点 z，让它分布在 [-40, -20] 之间
            const zRand = -20 - Math.random() * 20;
            draw3DCircle(
                ctx,
                ornament.x,
                y,
                zRand,
                ornament.radius,
                ornament.color,
                angle
            );
        }

        // ----------------
        // 4. 绘制随机灯光
        // ----------------
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * maxWidth - maxWidth / 2;
            const y = -trunkHeight - Math.random() * layers * layerHeight;
            const zRand = -20 - Math.random() * 20;
            const alpha = (0.3 + Math.random() * 0.7);
            draw3DCircle(ctx, x, y, zRand, 2, `rgba(255, 255, 255, ${alpha})`, angle);
        }

        // ----------------
        // 5. 顶部星星(简单 3D 圆)
        // ----------------
        const starY = -trunkHeight - layers * layerHeight - layerHeight;
        drawStar(ctx, 0, starY, -35, 20, '#FFD700', angle);

        ctx.restore();
    }

    // 生成雪花
    function createSnowflakes() {
        const snowflakeCount = 100;
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.textContent = '❄';
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.top = Math.random() * 100 + 'vh';
            snowflake.style.opacity = Math.random();
            snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            snowflake.style.animationDelay = (Math.random() * 5) + 's';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // 3D旋转动画
    function rotateTree() {
        angle += rotationSpeed;
        drawChristmasTree();
        requestAnimationFrame(rotateTree);
    }

    // 添加彩色装饰物容器
    const decorContainer = document.createElement('div');
    decorContainer.id = 'decorations';
    document.body.appendChild(decorContainer);
    
    // 创建彩色装饰物
    function createDecorations() {
        const items = ['🌟', '⭐', '🎈', '🎊', '🥟'];
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFFF33'];
        
        for (let i = 0; i < 30; i++) {
            const decor = document.createElement('div');
            decor.classList.add('decoration');
            decor.textContent = items[Math.floor(Math.random() * items.length)];
            decor.style.left = Math.random() * 100 + 'vw';
            decor.style.top = -20 + 'px';
            decor.style.color = colors[Math.floor(Math.random() * colors.length)];
            decor.style.fontSize = (Math.random() * 15 + 15) + 'px';
            decor.style.animationDuration = (Math.random() * 8 + 4) + 's';
            decor.style.animationDelay = (Math.random() * 5) + 's';
            decorContainer.appendChild(decor);
        }
    }

    // 初始化
    createSnowflakes();
    rotateTree();
    createDecorations();
});