import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type MutableRefObject } from 'react';
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PointLight,
} from 'three';
import { CAMP_LEVEL, FIRE_TILE, HUT_TILE } from '../../domain/island/island';
import { night as nightPalette } from '../palette';

const SURFACE_Y = CAMP_LEVEL - 0.5;
/** Where animals enter the hut: in front of the door (+z face) and at the door. */
export const HUT_APPROACH = { x: HUT_TILE.x, z: HUT_TILE.z + 1.0 } as const;
export const HUT_DOOR = { x: HUT_TILE.x, z: HUT_TILE.z + 0.5 } as const;

const box = new BoxGeometry(1, 1, 1);
const wood = new MeshLambertMaterial({ color: '#C8935F', flatShading: true });
const roof = new MeshLambertMaterial({ color: '#B5523C', flatShading: true });
const log = new MeshLambertMaterial({ color: '#6B4526', flatShading: true });
const doorDay = new Color('#3B2A1E');
const doorNight = new Color('#FFB050');
const flameColors = ['#FF7A1A', '#FFB33D', '#FFE38A'].map((c) => new MeshBasicMaterial({ color: c }));

function glowTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/** Hut and campfire on their reserved tiles. `night` is the shared 0..1 day/night factor. */
export function Camp({ night, reducedMotion }: { night: MutableRefObject<number>; reducedMotion: boolean }) {
  const light = useRef<PointLight>(null);
  const flames = useRef<Group>(null);
  const glow = useRef<Mesh>(null);
  const door = useRef<Mesh>(null);
  const glowMaterial = useMemo(
    () => new MeshBasicMaterial({ map: glowTexture(), color: nightPalette.fire, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0 }),
    [],
  );
  const doorMaterial = useMemo(() => new MeshBasicMaterial({ color: doorDay }), []);

  useFrame(({ clock }) => {
    const n = night.current;
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const flicker = 1 + Math.sin(t * 9) * 0.06 + Math.sin(t * 23 + 1) * 0.05;
    if (light.current) light.current.intensity = n * 6 * flicker;
    glowMaterial.opacity = n * 0.55 * flicker;
    if (glow.current) glow.current.visible = n > 0.01;
    doorMaterial.color.copy(doorDay).lerp(doorNight, n);
    const f = flames.current;
    if (f) {
      f.visible = n > 0.05;
      f.children.forEach((child, i) => {
        const s = n * (1 + Math.sin(t * (8 + i * 3) + i) * 0.18);
        child.scale.set(0.2 - i * 0.05, (0.2 - i * 0.03) * s, 0.2 - i * 0.05);
        child.position.y = 0.1 + i * 0.09 + ((0.2 - i * 0.03) * s) / 2;
        child.rotation.y = t * (1 + i) * 0.7;
      });
    }
  });

  return (
    <>
      {/* Campfire */}
      <group position={[FIRE_TILE.x, SURFACE_Y, FIRE_TILE.z]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} geometry={box} material={log} position={[0, 0.045, 0]} rotation={[0, (i * Math.PI) / 3, 0]} scale={[0.42, 0.09, 0.09]} />
        ))}
        <group ref={flames}>
          {flameColors.map((m, i) => (
            <mesh key={i} geometry={box} material={m} />
          ))}
        </group>
        <pointLight ref={light} position={[0, 0.7, 0]} color={nightPalette.fire} intensity={0} distance={9} decay={1.6} />
        <mesh ref={glow} material={glowMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} visible={false}>
          <planeGeometry args={[4.4, 4.4]} />
        </mesh>
      </group>
      {/* Hut */}
      <group position={[HUT_TILE.x, SURFACE_Y, HUT_TILE.z]}>
        <mesh geometry={box} material={wood} position={[0, 0.25, 0]} scale={[0.84, 0.5, 0.84]} />
        <mesh geometry={box} material={roof} position={[0, 0.57, 0]} scale={[1.0, 0.14, 1.0]} />
        <mesh geometry={box} material={roof} position={[0, 0.71, 0]} scale={[0.72, 0.14, 0.72]} />
        <mesh geometry={box} material={roof} position={[0, 0.85, 0]} scale={[0.44, 0.14, 0.44]} />
        <mesh ref={door} geometry={box} material={doorMaterial} position={[0, 0.17, 0.43]} scale={[0.24, 0.34, 0.03]} />
      </group>
    </>
  );
}
