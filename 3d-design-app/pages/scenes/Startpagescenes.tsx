import { useEffect, useMemo, useRef, useState } from 'react'
import useWindowDimensions from '../hooks/windowDimensionsHook'

import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import vertexShader from './shaders/vertexShader'
import fragmentShader from './shaders/fragmentShader'

function Section1Scene() {
    const mesh = useRef<THREE.Mesh>(null!)
    const { camera } = useThree()
    const [mobile, setMobile] = useState(true)

    const dimensions = useWindowDimensions()

    useEffect(() => {
        camera.position.set(10, 2, 5)  
        
        if (dimensions.width < 900) {
            setMobile(false)
        } else {
            setMobile(true)
        }
    }, [camera, dimensions])

    return (
        <mesh ref={mesh}>
            <gridHelper args={[200, 10]} />
            <OrbitControls enableZoom={false} minDistance={100} args={[camera]} enableRotate={mobile} />
        </mesh>
    )
}

function Section2Scene() {
    const mesh = useRef<THREE.Mesh<THREE.IcosahedronGeometry, THREE.ShaderMaterial>>(null!)
    const hover = useRef<boolean>(false)
    const uniforms = useMemo(() => {
        return {
            u_time: {
                value: 0
            },
            u_intensity: {
                value: .3
            }
        }
    }, [])

    useFrame((state) => {
        const { clock } = state

        if (mesh.current) {
            mesh.current.material.uniforms.u_time.value = .4*clock.getElapsedTime()

            mesh.current.material.uniforms.u_intensity.value = THREE.MathUtils.lerp(
                mesh.current.material.uniforms.u_intensity.value,
                hover.current ? 1 : .15, .02
            )
        }
    })
    console.log('test');
    

    return (
        <mesh 
            ref={mesh} 
            scale={[1.5, 1.5, 1.5]} 
            position={[0, 0, 0]} 
            onPointerOver={ () => (hover.current = true) }
            onPointerOut={ () => (hover.current = false) }
        >
            <icosahedronBufferGeometry args={[2, 20]} />
            <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        </mesh>
    )
}

export {
    Section1Scene,
    Section2Scene
}