document.addEventListener('DOMContentLoaded', () => {
    const snowflakesContainer = document.getElementById('snowflakes');
    const canvas = document.getElementById('christmas-tree-canvas');
    const ctx = canvas.getContext('2d');

    // 设置Canvas大小为窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 3D旋转相关变量
    let angle = 0;

    // 调大圣诞树尺寸，并让其显示在较靠近画面中央的位置
    const trunkWidth = 40;
    const trunkHeight = 200;
    const layers = 6;        // 树叶层数
    const maxWidth = 300;    // 树冠最大宽度
    const layerHeight = 60;  // 每层高度

    // 绘制圣诞树函数
    function drawChristmasTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 保存当前状态
        ctx.save();

        // 将原点移动到屏幕中央偏下位置，让整棵树大致居中
        ctx.translate(canvas.width / 2, canvas.height * 0.75);

        // 绘制树干
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight);

        // 绘制树冠（改为正三角形）
        ctx.fillStyle = 'green';
        for (let i = 0; i < layers; i++) {
            // 当前层的最大宽度会随层数递减
            const currentWidth = maxWidth - i * (maxWidth / layers);
            // 3D效果的X缩放
            const scaleX = Math.cos(angle);

            ctx.save();
            ctx.scale(scaleX, 1);
            ctx.beginPath();
            // 将三角形顶点放在上，底边放在下，形成正三角形
            ctx.moveTo(0, -trunkHeight - i * layerHeight - layerHeight);
            ctx.lineTo(-currentWidth / 2, -trunkHeight - i * layerHeight);
            ctx.lineTo(currentWidth / 2, -trunkHeight - i * layerHeight);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // 绘制装饰球（跟随树叶缩小而缩小）
        // 这里的球是直接画在 Canvas 上的，所以会随 3D 旋转而缩放
        const ornamentColors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#33FFF5', '#FFFF33'];
        for (let i = 0; i < 40; i++) {
            const radius = 5 + Math.random() * 5;
            const x = (Math.random() * maxWidth - maxWidth / 2) * Math.cos(angle);
            const y = -trunkHeight - Math.random() * layers * layerHeight;
            ctx.fillStyle = ornamentColors[Math.floor(Math.random() * ornamentColors.length)];
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制灯光（小圆点模拟）
        for (let i = 0; i < 100; i++) {
            const radius = 2;
            const x = (Math.random() * maxWidth - maxWidth / 2) * Math.cos(angle);
            const y = -trunkHeight - Math.random() * layers * layerHeight;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.random() + ')';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制顶部星星
        ctx.save();
        ctx.scale(Math.cos(angle), 1);
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        drawStar(ctx, 0, -trunkHeight - layers * layerHeight - layerHeight, 5, 20, 10);
        ctx.fill();
        ctx.restore();

        // 恢复状态
        ctx.restore();
    }

    // 绘制星星的函数
    function drawStar(ctx, x, y, points, outerRadius, innerRadius) {
        const step = Math.PI / points;
        let rotation = -Math.PI / 2;
        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < points; i++) {
            ctx.lineTo(
                x + Math.cos(rotation) * outerRadius,
                y + Math.sin(rotation) * outerRadius
            );
            rotation += step;
            ctx.lineTo(
                x + Math.cos(rotation) * innerRadius,
                y + Math.sin(rotation) * innerRadius
            );
            rotation += step;
        }
        ctx.closePath();
    }

    // 生成雪花（可留作氛围效果）
    function createSnowflakes() {
        const snowflakeCount = 100;
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.textContent = '❄'; // 设置雪花字符
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.top = Math.random() * 100 + 'vh';
            snowflake.style.opacity = Math.random();
            snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            // 雪花下落时间保持不变
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            snowflake.style.animationDelay = (Math.random() * 5) + 's';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // 不再使用 createOrnaments() 函数来生成在屏幕上随机下落的 DOM 球体
    // 如果仍需少量球体做额外氛围，可保留此函数，但要注意其出现在整个视口而非随树缩放
    /*
    function createOrnaments() {
        const ornamentCount = 50;
        for (let i = 0; i < ornamentCount; i++) {
            const ornament = document.createElement('div');
            ornament.classList.add('ornament');
            // 调整动画时长使旋转更慢
            ornament.style.animationDuration = (Math.random() * 30 + 60) + 's';
            ornament.style.animationDelay = (Math.random() * 5) + 's';
            // 其它随机效果保留
            ornament.style.left = Math.random() * 100 + 'vw';
            ornament.style.top = '-50px';
            ornament.style.backgroundColor = getRandomColor();
            ornament.style.transform = `scale(${Math.random() + 0.5})`;
            document.body.appendChild(ornament);
        }
    }

    function getRandomColor() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#33FFF5', '#FFFF33'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    */

    // 3D旋转效果
    function rotateTree() {
        angle += 0.01; // 调整旋转速度，模拟3D旋转
        drawChristmasTree();
        requestAnimationFrame(rotateTree);
    }

    // 初始化
    createSnowflakes(); // 只生成雪花，去除 createOrnaments() 的调用
    rotateTree();
});