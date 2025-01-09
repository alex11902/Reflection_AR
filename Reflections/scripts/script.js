const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const HandTracking = require('HandTracking');

(async function() {
    const mainSphere = await Scene.root.findFirst('MainSphere');
    const smallSphere1 = await Scene.root.findFirst('SmallSphere1');
    const smallSphere2 = await Scene.root.findFirst('SmallSphere2');

    // Initial states
    smallSphere1.hidden = true;
    smallSphere2.hidden = true;

    // Tap Gesture
    TouchGestures.onTap(mainSphere).subscribe(() => {
        mainSphere.material.opacity = 0.5;
        smallSphere1.hidden = false;
        smallSphere2.hidden = false;
    });

    // Hand Tracking
    const hand = await HandTracking.hand(0); // First hand
    hand.cameraTransform.position.monitor().subscribe((pos) => {
        smallSphere1.transform.position = pos.newValue;

        if (pos.newValue.distance(mainSphere.transform.position) < 0.2) {
            smallSphere1.hidden = true;
            mainSphere.material.opacity = 0.75;
        }
    });

    const hand2 = await HandTracking.hand(1); // Second hand
    hand2.cameraTransform.position.monitor().subscribe((pos) => {
        smallSphere2.transform.position = pos.newValue;

        if (pos.newValue.distance(mainSphere.transform.position) < 0.2) {
            smallSphere2.hidden = true;
            mainSphere.material.opacity = 1.0;
        }
    });
})();
