import oceanMask from "@/assets/ocean-mask.svg";
import ripple from "@/assets/ocean-ripple.png";

/**
 * Moving water over the beach photo: two drifting layers of soft glints masked
 * to the sea, up to the water's edge on the sand. The mask uses the photo's
 * coordinates and covers the box the same way the photo does (object-cover,
 * centered). Hidden for reduced motion.
 */
export function OceanMotion() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      style={{ maskImage: `url(${oceanMask.src})`, maskSize: "cover", maskPosition: "center" }}
    >
      <div className="ocean-ripple animate-ripple-a bg-size-[1200px_720px] opacity-30" style={{ backgroundImage: `url(${ripple.src})` }} />
      <div className="ocean-ripple animate-ripple-b bg-size-[930px_560px] opacity-20" style={{ backgroundImage: `url(${ripple.src})` }} />
    </div>
  );
}
