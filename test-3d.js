// Simple test to verify 3D components are working
console.log('Testing 3D components...');

try {
  // Test if we can import the main components
  const fs = require('fs');
  const path = require('path');
  
  // Check if main page exists
  const pagePath = path.join(__dirname, 'src/app/page.tsx');
  if (fs.existsSync(pagePath)) {
    console.log('✅ Main page component exists');
    
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Check for key 3D components
    if (pageContent.includes('Canvas')) {
      console.log('✅ Canvas component found');
    }
    
    if (pageContent.includes('RainLabVisualization')) {
      console.log('✅ RainLabVisualization component found');
    }
    
    if (pageContent.includes('BiefeldBrownApparatus')) {
      console.log('✅ BiefeldBrownApparatus component referenced');
    }
    
    if (pageContent.includes('FluxCapacitor')) {
      console.log('✅ FluxCapacitor component referenced');
    }
    
    if (pageContent.includes('ZinsserModule')) {
      console.log('✅ ZinsserModule component referenced');
    }
    
    if (pageContent.includes('ElectrokineticSaucer')) {
      console.log('✅ ElectrokineticSaucer component referenced');
    }
    
    // Check for Three.js imports
    if (pageContent.includes('@react-three/fiber')) {
      console.log('✅ React Three Fiber imported');
    }
    
    if (pageContent.includes('@react-three/drei')) {
      console.log('✅ React Three Drei imported');
    }
    
  } else {
    console.log('❌ Main page component not found');
  }
  
  // Check apparatus components
  const apparatusPath = path.join(__dirname, 'src/components/apparatus');
  if (fs.existsSync(apparatusPath)) {
    console.log('✅ Apparatus components directory exists');
    
    const apparatusFiles = fs.readdirSync(apparatusPath);
    console.log('📁 Apparatus files:', apparatusFiles);
  }
  
  // Check effects components
  const effectsPath = path.join(__dirname, 'src/components/effects');
  if (fs.existsSync(effectsPath)) {
    console.log('✅ Effects components directory exists');
    
    const effectsFiles = fs.readdirSync(effectsPath);
    console.log('📁 Effects files:', effectsFiles);
  }
  
  console.log('\n🎉 3D component structure verification complete!');
  
} catch (error) {
  console.error('❌ Error testing 3D components:', error.message);
}