/**
 * Hero Robot Automatic Continuous Pose Animation for RoboKidz
 * Automatically and smoothly cycles through 7 cute poses every 3 seconds:
 * 0: Original Pose (Standing & Waving)
 * 1: Jump & Cheer
 * 2: Wink & Thumbs Up
 * 3: Working on Laptop
 * 4: Funny Dab Dance
 * 5: Idea Moment
 * 6: Silly Wave
 * Loops continuously forever with smooth crossfade & natural motion.
 * NO badges, NO text labels, NO extra UI overlays.
 */

(function () {
    const poseSources = [
        "assets/hero-robot-red-white.png", // 0: Original Waving
        "assets/hero-robot-pose-1.png",     // 1: Jump & Cheer
        "assets/hero-robot-pose-2.png",     // 2: Wink & Thumbs Up
        "assets/hero-robot-pose-3.png",     // 3: Working on Laptop
        "assets/hero-robot-pose-4.png",     // 4: Funny Dab Dance
        "assets/hero-robot-pose-5.png",     // 5: Idea Moment
        "assets/hero-robot-pose-6.png"      // 6: Silly Wave
    ];

    const poseClasses = [
        "pose-0-motion",
        "pose-1-motion",
        "pose-2-motion",
        "pose-3-motion",
        "pose-4-motion",
        "pose-5-motion",
        "pose-6-motion"
    ];

    let currentPoseIndex = 0;
    let activeLayerIndex = 0; // 0 for Layer A, 1 for Layer B
    let isInitialized = false;

    // Preload all pose images into browser cache immediately
    poseSources.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    function initAutoRobotAnimation() {
        if (isInitialized) return;
        
        const robotImg = document.querySelector('.floating-robot') || document.getElementById('heroRobotMascot');
        if (!robotImg) return;

        isInitialized = true;

        const parent = robotImg.parentElement;

        // Create double-buffered crossfade layers if not already present
        let container = parent.querySelector('.robot-animation-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'robot-animation-container';
            parent.insertBefore(container, robotImg);

            // Layer A (Primary)
            const layerA = robotImg;
            layerA.className = 'floating-robot robot-layer active pose-0-motion';
            layerA.setAttribute('id', 'robotLayerA');

            // Layer B (Secondary crossfade buffer)
            const layerB = document.createElement('img');
            layerB.className = 'floating-robot robot-layer pose-1-motion';
            layerB.setAttribute('id', 'robotLayerB');
            layerB.alt = robotImg.alt || "3D Red and White Robot Mascot";
            layerB.src = poseSources[1];

            container.appendChild(layerA);
            container.appendChild(layerB);

            // Move floor shadow into container if present
            const shadow = parent.querySelector('.robot-floor-shadow');
            if (shadow) {
                container.appendChild(shadow);
            }
        }

        const layerA = container.querySelector('#robotLayerA');
        const layerB = container.querySelector('#robotLayerB');
        const layers = [layerA, layerB];

        // Automatic Pose Switcher function
        function switchToNextPose() {
            const nextPoseIndex = (currentPoseIndex + 1) % poseSources.length;
            const nextLayerIndex = 1 - activeLayerIndex;

            const currentLayer = layers[activeLayerIndex];
            const nextLayer = layers[nextLayerIndex];

            // 1. Prepare next layer with target pose image & motion class
            nextLayer.src = poseSources[nextPoseIndex];
            poseClasses.forEach(cls => nextLayer.classList.remove(cls));
            nextLayer.classList.add(poseClasses[nextPoseIndex]);

            // 2. Perform smooth crossfade
            nextLayer.classList.add('active');
            currentLayer.classList.remove('active');

            // Update indices
            currentPoseIndex = nextPoseIndex;
            activeLayerIndex = nextLayerIndex;
        }

        // Auto-cycle pose every 3.2 seconds continuously
        setInterval(switchToNextPose, 3200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoRobotAnimation);
    } else {
        initAutoRobotAnimation();
    }
})();
