/** Border-beam decoration: two light dots looping along the host's border.
 *  Host must set --beam-radius / --beam-size / --beam-ring and isolate. */
export function BeamFrame() {
  return (
    <div className="beamline" aria-hidden="true">
      <div className="dot dot-a" />
      <div className="dot dot-b" />
    </div>
  );
}
