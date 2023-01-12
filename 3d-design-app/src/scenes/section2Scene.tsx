import { useMemo, useRef } from 'react'

import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import vertexShader from './shaders/vertexShader'
import fragmentShader from './shaders/fragmentShader'

function Blob(props: any) {
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
            mesh.current.material.uniforms.u_time.value = props.speed*clock.getElapsedTime()

            mesh.current.material.uniforms.u_intensity.value = THREE.MathUtils.lerp(
                mesh.current.material.uniforms.u_intensity.value,
                hover.current ? props.hover : .15, .02
            )
        }
    })

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

export default Blob