import * as THREE from 'three'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'

function StartPageScene() {
    const mesh = useRef<THREE.Mesh>(null!)

    return (
        <mesh ref={mesh}>
            <gridHelper args={[200, 10]} />
            <OrbitControls enableZoom={false} minDistance={100} />
        </mesh>
    )
}

export default StartPageScene