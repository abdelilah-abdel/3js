 import './style.css'


import * as THREE from  'https://unpkg.com/three@0.126.1/build/three.module.js' //three js library 
import * as dat from 'dat.gui'; // the gui library 
import  {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js' // orbit controls library 
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'; 



console.log(GLTFLoader);

// creating a gui object : -----------------------------------------------------------------

//---function that does the changes ---------------------------
    function generatePlane(){
    plane.geometry.dispose()
        plane.geometry = new THREE.PlaneGeometry(world.planem.width, world.planem.hight, world.planem.Wsegment, world.planem.Hsegment);



    const { array } = plane.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i + 2] = z + Math.random();
    }
    }
//------------------function end-------------------------------
//-----------------GUI END -----------------------------------------------------------------


 const canvasContainer = document.querySelector('#canvasContainer')
 const canvaslogo = document.querySelector('#canvaslogo')

//------------------CREATING THE SCENE AND CAMERA OBJ-------------------------------
const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 1, 700 );
 
let renderer = new THREE.WebGLRenderer
({
    antilias:true,
    canvas : document.querySelector('canvas')
});


// document.body.appendChild(renderer.domElement);// the black box showed , we push it into the html

renderer.setSize(innerHeight, canvasContainer.offsetHeight)
renderer.setPixelRatio (window.devicePixelRatio)



// orbit controls : 
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 60; // to zoom out , bcz the camera is centred by default .
//-----------------------------------------------------------------------------------


// creating the material object : the cube----------------------------
// 1- creating the geometry / or the space where will render our object in
const Boxgeometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const mesh = new THREE.Mesh( Boxgeometry, material );
//--------------------------------------------------------------------


// steps to creat and add an object to a scene : torus object DONUT ----
const torusgeometry = new THREE.TorusGeometry( 10, 0.5, 100, 100 );
const torusmaterial = new THREE.MeshBasicMaterial({color: 0xb26319,side: THREE.DoubleSide} );
const torusmesh = new THREE.Mesh( torusgeometry, material );
//scene.add(torusmesh);
//----------------------------------------------------------------------


// plane object creation------------------------------------------
const Planegeometry = new THREE.PlaneGeometry(13,13,5,5);
const planematerial = new THREE.MeshBasicMaterial
({color: 0xff9500,
 side: THREE.DoubleSide, 
 flatShading:THREE.flatShading
});

const plane = new THREE.Mesh( Planegeometry, planematerial );
//scene.add(plane);
//----------------------------------------------------------------


// making lights--------------------------------------------------
/*
const directionalLight = new THREE.DirectionalLight(0xffffff,1);// color , intinsity of the light 
directionalLight.position.set(0,0,1);// 3 params : x y z
scene.add(directionalLight);
*/
//----------------------------------------------------------------

//------------------------------------------------------------
const { array }= plane.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
}
//-------------------------------------------------------------

//----- mouse hover effect -----------------------------------

const mouse = { x: undefined, y:undefined};

addEventListener('mousemove', (event) => {
    mouse.x = ((event.clientX) / innerWidth) * 2 - 1
    mouse.y = ((event.clientY) / innerHeight) * 2 - 1

   console.log(mouse)
    
})

//-----------------------------------------------------







//---changing background of the scene ------------------------

/* .background: Object
If not null, sets the background used when rendering the scene, 
and is always rendered first.Can be set to a Color which sets the clear color, 
a Texture covering the canvas, a cubemap as a CubeTexture or an equirectangular as a Texture.Default is null.
*/


//scene.background = new THREE.Color(0x83a4d4);
 
const texture = new THREE.TextureLoader().load('background2.jpg');
scene.background=texture;

//---------------------------------------------------------

const starGeometry = new THREE.BufferGeometry()






//--------------------importing my 3D module --------------------------------------------------

// Instantiate a loader
const loader = new GLTFLoader();


var obj;

loader.load('scene.gltf', function (gltf) {
   
  //  IMARA.scale.set(0.5,0.5,0.5); 
   obj = gltf.scene;

   scene.add(gltf.scene ); 

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    
    }, function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

},
    // called when loading has errors
    function (error) {

        console.log('An error happened');

    }
);
           //---adding light 
const light = new THREE.HemisphereLight(0xffffff, 0x000000, 4.5);
scene.add(light);
camera.position.set(0, 0, 15)

//---------------------------------------------------------------------------------------------------



const pointLight = new THREE.PointLight(0xE6B84C, 12, 300);
pointLight.position.set(0, 30,0);

const gridHelper = new THREE.GridHelper(0, 0);
scene.add(pointLight, gridHelper);

const sphereSize = 20;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);



//scene.add(mesh); //adding the object / box to the scene
//scene.add(torusmesh);
//scene.add(plane);















// to make animation-------------*----------------------
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    
    //mesh.rotation.y += 0.001;
    obj.rotation.y +=0.001;
    
    torusmesh.rotation.y+=0.01;
    plane.positionY=2000;
    plane.rotation.y+=0.00000000000000000001;
  
    pointLight.rotation.y+=0.01;
    pointLight.rotation.x+= 0.01;
    pointLight.rotation.z += 0.01;
 
  //  obj.rotation.y += 0;
  
    raycaster.setFromCamera(mouse, camera)
   
    const intersect = raycaster.intersectObject(obj);
    if (intersect.length > 0) {
        console.log('intersection')
    }

}



animate();


console.log(scene);
console.log(camera);
console.log(renderer);
console.log(material);

console.log(plane.geometry.attributes.position.array);
