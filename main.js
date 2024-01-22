import * as THREE from 'three';
import * as dat from 'dat.gui';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background to black
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

// Group for all cubes
const cubeGroup = new THREE.Group();

// Box dimensions and spacing
let boxSize = 2; // Size for each small box
let spacing = 2; // Spacing between each box

// Base path for cell images
const basePath = 'puzzle1/';
const basePath2 = 'puzzle1_empty/';

// Selected cube and material variables
let selectedCube = null;
let originalMaterial = null;

// Function to create the main grid of boxes
function createBoxes() {
    const gridSize = 9; // 9x9x9 grid
    while (cubeGroup.children.length) {
        cubeGroup.remove(cubeGroup.children[0]);
    }

    const loader = new THREE.TextureLoader();

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                let textureFileName1 = `${basePath}/cell_${z}_${y}.png`;
                let textureFileName2 = `${basePath2}/cell_${z}_${y}.png`;

                loadTexture(textureFileName1, textureFileName2, (texture, isFromBasePath1) => {
                    let materials = [
                        new THREE.MeshBasicMaterial({ map: texture }),
                        new THREE.MeshBasicMaterial({ color: 0xffffff}), 
                        new THREE.MeshBasicMaterial({ color: 0xffffff}),
                        new THREE.MeshBasicMaterial({ color: 0xffffff}),
                        new THREE.MeshBasicMaterial({ color: 0xffffff}),
                        new THREE.MeshBasicMaterial({ color: 0xffffff})
                    ];
                    let box = new THREE.Mesh(new THREE.BoxGeometry(boxSize, boxSize, boxSize), materials);
                    box.position.set(
                        (x - gridSize / 2) * spacing,
                        (y - gridSize / 2) * spacing,
                        (z - gridSize / 2) * spacing
                        );
                        box.userData.isFromBasePath1 = isFromBasePath1; // Store whether texture is from basePath2
                        cubeGroup.add(box);
                    });
                }
            }
        }
    scene.add(cubeGroup);
}

function loadTexture(primaryPath, fallbackPath, callback) {
    const loader = new THREE.TextureLoader();
    loader.load(
        primaryPath,
        (texture) => {
            callback(texture, true); // False indicates texture is not from basePath2
        },
        undefined,
        (error) => {
            // If loading from the primary path fails, try the fallback path
            loader.load(
                fallbackPath,
                (texture) => {
                    callback(texture, false); // True indicates texture is from basePath2
                },
                undefined,
                (error) => {
                    console.error('Error loading texture:', error);
                }
            );
        }
    );
}


// Event listeners for interaction
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('keydown', onDocumentKeyDown, false);
window.addEventListener('resize', onWindowResize, false);

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    let allSelectableObjects = cubeGroup.children.slice();
    scene.traverse(function (object) {
        if (object.userData.isNumberCube) {
            allSelectableObjects.push(object);
        }
    });

    const intersects = raycaster.intersectObjects(allSelectableObjects, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        if (clickedObject.userData.isFromBasePath1) {
        } else {
            // Selecting a cube from the grid
            if (selectedCube) {
                selectedCube.material = originalMaterial; // Reset previous selection
            }
            originalMaterial = clickedObject.material;
            
            // Create a highlight material with reduced opacity
            const highlightMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x767676, // Highlight color
                opacity: 1,    // Set the opacity (0.5 for 50% transparent)
            });
            
            clickedObject.material = highlightMaterial;
            selectedCube = clickedObject;

            createInputForCube(selectedCube)
            
        }
    } else {
        // Clicking somewhere else, unhighlight the selected cube
        if (selectedCube) {
            selectedCube.material = originalMaterial;
            selectedCube = null;
        }
    }
}
createBoxes();


// GUI Control setup
const gui = new dat.GUI();
const guiControls = {
    number: 1, // Default number
    updateGrid: function() {
        if (selectedCube) {
            displayNumberOnCube(guiControls.number, selectedCube);
        }
    }
};

// Add number control
gui.add(guiControls, 'number', 1, 9).step(1);

// Add update button
gui.add(guiControls, 'updateGrid').name('Update Grid');

// function displayNumberOnCube(number, cube) {
//     // Validate the number
//     if (number < 1 || number > 9) {
//         console.error("Number out of range");
//         return;
//     }

//     // Define the path to the updated texture using template literals
//     let updatedTexturePath = `valid-numbers/cell_${number}.png`;
    
//     // Load the new texture
//     const loader = new THREE.TextureLoader();
//     loader.load(updatedTexturePath, function(texture) {
//     // Update the texture of all materials of the selected cube
//         cube.material.forEach(material => {
//         material.map = texture;
//         material.needsUpdate = true;
//     });
// }, undefined, function(error) {
//     console.error('Error loading texture:', error);
// });

// }

// Assuming raycaster and camera are defined globally or passed to the function
function displayNumberOnCube(number, raycaster, allSelectableObjects) {
    // Validate the number
    if (number < 1 || number > 9) {
        console.error("Number out of range");
        return;
    }

    // Perform raycaster intersection check
    const intersects = raycaster.intersectObjects(allSelectableObjects, true);

    if (intersects.length > 0) {
        const sCube = intersects[0].object; // The first intersected object

        let updatedTexturePath = `valid-numbers/cell_${number}.png`;

        sCube.material = originalMaterial;
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(updatedTexturePath, function(texture) {
            sCube.material = 
            new THREE.MeshBasicMaterial({ map: texture }),
            new THREE.MeshBasicMaterial({ color: 0xffffff}), 
            new THREE.MeshBasicMaterial({ color: 0xffffff}),
            new THREE.MeshBasicMaterial({ color: 0xffffff}),
            new THREE.MeshBasicMaterial({ color: 0xffffff}),
            new THREE.MeshBasicMaterial({ color: 0xffffff}) 
        });
        sCube.material.needsUpdate = true;

        sCube.material = textureLoader;
        selectedCube = sCube;

        // // Define the path to the updated texture using template literals
        // let updatedTexturePath = `valid-numbers/cell_${number}.png`;

        // // Load the new texture
        // textureLoader.load(updatedTexturePath, function(texture) {
        //     selectedCube.material = new THREE.MeshBasicMaterial({ map: texture });
        //     selectedCube.material.needsUpdate = true;
        // }, undefined, function(error) {
        //     console.error('Error loading texture:', error);
        // });
    }
}


document.addEventListener('keydown', onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var rotationAmount = 0.1;
    var sizeChangeAmount = 0.1;

    var keyCode = event.which;
    var rotationAmount = 0.1;
    var sizeChangeAmount = 0.1;
    
    // Rotate the cube group
    if (keyCode == 37) { // Left arrow
        cubeGroup.rotation.y -= rotationAmount;
    } else if (keyCode == 38) { // Up arrow
        cubeGroup.rotation.x -= rotationAmount;
    } else if (keyCode == 39) { // Right arrow
        cubeGroup.rotation.y += rotationAmount;
    } else if (keyCode == 40) { // Down arrow
        cubeGroup.rotation.x += rotationAmount;
    }

    // Resize boxes
    if (keyCode == 187) { // '+' key
        boxSize += sizeChangeAmount;
        spacing += sizeChangeAmount; // Increase spacing along with size
        createBoxes(); // Recreate the boxes with new size
    } else if (keyCode == 189) { // '-' key
        boxSize = Math.max(boxSize - sizeChangeAmount, 0.1); // Prevent box size from going negative
        spacing = Math.max(spacing - sizeChangeAmount, 1.0); // Adjust spacing
        createBoxes(); // Recreate the boxes with new size
    }
}



function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Initialize the scene
createBoxes();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();







