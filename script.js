document.addEventListener('DOMContentLoaded', () => {
    const ornamentsContainer = document.getElementById('ornaments');
    const snowflakesContainer = document.getElementById('snowflakes');
    const canvas = document.getElementById('christmas-tree-canvas');
    const ctx = canvas.getContext('2d');

    // 设置Canvas大小
    canvas.width = 300;
    canvas.height = 500;

    // 绘制圣诞树函数
    function drawChristmasTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        // 树干
        ctx.fillRect(140, 400, 20, 100);
        // 树枝（多边形）
        ctx.moveTo(150, 400);
        ctx.lineTo(100, 300);
        ctx.lineTo(200, 300);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(150, 300);
        ctx.lineTo(90, 200);
        ctx.lineTo(210, 200);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(150, 200);
        ctx.lineTo(80, 100);
        ctx.lineTo(220, 100);
        ctx.closePath();
        ctx.fill();

        // 装饰球
        ctx.fillStyle = 'yellow';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 200 + 50;
            const y = Math.random() * 300 + 100;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 生成圣诞球
    function createOrnaments() {
        const ornamentCount = 30;
        for (let i = 0; i < ornamentCount; i++) {
            const ornament = document.createElement('div');
            ornament.classList.add('ornament');
            ornament.style.left = Math.random() * 100 + 'vw';
            ornament.style.top = '-50px';
            ornament.style.backgroundColor = getRandomColor();
            ornament.style.transform = `scale(${Math.random() + 0.5})`;
            ornament.style.animationDuration = (Math.random() * 5 + 5) + 's';
            ornament.style.animationDelay = (Math.random() * 5) + 's';
            ornamentsContainer.appendChild(ornament);
        }
    }

    // 获取随机颜色
    function getRandomColor() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#33FFF5'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 生成雪花
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
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            snowflake.style.animationDelay = (Math.random() * 5) + 's';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // 显示圣诞树
    function showTree() {
        setTimeout(() => {
            drawChristmasTree();
        }, 1000); // 延迟1秒后绘制圣诞树
    }

    createOrnaments();
    createSnowflakes();
    showTree();

    // 3D旋转效果
    let angle = 0;
    function rotateTree() {
        angle += 0.01;
        canvas.style.transform = `translateX(-50%) rotateY(${angle}rad)`;
        requestAnimationFrame(rotateTree);
    }
    rotateTree();
});